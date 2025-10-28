import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import Filter from '@/components/shooping-view/Filter'
import ShopProductTile from './Product-Tile'
import ProductDetailsDialouge from '@/components/shooping-view/Product-Details'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { SortOptions } from '@/config'
import { fetchAllShopProducts, fetchProductsDetails } from '@/store/Product-slice'
import { addToCart, getCartItems } from '@/store/Cart-slice'
import { ArrowUpDown } from 'lucide-react'
import { toast } from 'react-toastify'

function createSearchParamsHelper(filters){
  const queryParams = []
  if(filters.categories?.length){
    queryParams.push(`category=${encodeURIComponent(filters.categories.join(','))}`)
  }
  if(filters.brands?.length){
    queryParams.push(`brand=${encodeURIComponent(filters.brands.join(','))}`)
  }
  return queryParams.join('&')
}

function getSortLabel(value) {
  if (!value) return "Sort By"
  const option = SortOptions.find(opt => opt.value === value)
  return option ? option.label : "Sort By"
}

function Listing() {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { productList, ProductDetails } = useSelector(state => state.shopProducts)
  const { cartItems } = useSelector(state => state.shopCart)

  const [Filters, setFilters] = useState({ categories: [], brands: [] })
  const [sortValue, setSortValue] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()
  const [openDetails, setOpenDetails] = useState(false)

  // ------------------- Initialize Filters -------------------
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    const savedFilters = JSON.parse(sessionStorage.getItem('filters')) || { categories: [], brands: [] }

    const initialFilters = {
      ...savedFilters,
      categories: categoryFromUrl ? [categoryFromUrl] : savedFilters.categories
    }

    setFilters(initialFilters)
  }, [searchParams])

  // ------------------- Update URL when filters change -------------------
  useEffect(() => {
    const queryString = createSearchParamsHelper(Filters)
    setSearchParams(new URLSearchParams(queryString))
  }, [Filters, setSearchParams])

  // ------------------- Fetch Products -------------------
  useEffect(() => {
    const filterParams = {
      category: Filters.categories,
      brand: Filters.brands
    }
    dispatch(fetchAllShopProducts({ filterParams, sortParams: sortValue }))
  }, [dispatch, sortValue, JSON.stringify(Filters)])

  // ------------------- Load Product Details -------------------
  useEffect(() => {
    if(ProductDetails !== null) setOpenDetails(true)
  }, [ProductDetails])

  // ------------------- Filter Handlers -------------------
  function handleFilter(sectionId, option) {
    setFilters(prev => {
      const current = prev[sectionId] || []
      const updated = current.includes(option)
        ? current.filter(o => o !== option)
        : [...current, option]
      const newFilters = { ...prev, [sectionId]: updated }
      sessionStorage.setItem('filters', JSON.stringify(newFilters))
      return newFilters
    })
  }

  // ------------------- Sorting -------------------
  function handleSort(value) {
    setSortValue(value)
  }

  // ------------------- Product Details -------------------
  function handleGetProductDetails(productId) {
    dispatch(fetchProductsDetails(productId))
  }

  // ------------------- Add to Cart -------------------
  function handleAddToCart(productId, totalStock) {
    let getcartItem = cartItems.items || []

    if(getcartItem.length){
      const index = getcartItem.findIndex(item => item.productId === productId)
      if(index > -1){
        const getQuantity = getcartItem[index].quantity
        if(getQuantity + 1 > totalStock){
          toast.error(`Only ${getQuantity} quantity can be added for this item`)
          return
        }
      }
    }

    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 }))
      .then(data => {
        if(data?.payload?.success){
          dispatch(getCartItems(user?.id))
          toast.success("✅ Product added to cart!")
        } else {
          toast.error("❌ Failed to add product to cart")
        }
      })
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-4 md:p-6'>
      {/* Filters */}
      <Filter Filters={Filters} handleFilter={handleFilter} />

      {/* Product List */}
      <div className='bg-background w-full rounded-lg shadow-sm'>
        <div className='p-4 border-b flex items-center justify-between'>
          <h2 className='text-lg font-extrabold'>
            {Filters.categories.length > 0 ? `${Filters.categories[0].toUpperCase()} Products` : "All Products"}
          </h2>
          <div className='flex items-center gap-7'>
            <span className='text-muted-foreground'>{productList?.length || 0} Products</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm' className='flex items-center gap-1'>
                  <ArrowUpDown className='h-4 w-4 text-amber-50'/>
                  <span className='text-white'>{getSortLabel(sortValue)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-[200px]'>
                <DropdownMenuRadioGroup value={sortValue} onValueChange={handleSort}>
                  {SortOptions.map(sortItem => (
                    <DropdownMenuRadioItem key={sortItem.id} value={sortItem.value}>
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-4 md:grid-col-3 lg:grid-cols-4 gap-4 p-4'>
          {productList && productList.length > 0
            ? productList.map(product => (
                <ShopProductTile 
                  key={product._id} 
                  product={product} 
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddToCart={handleAddToCart}
                />
              ))
            : <p className="text-center text-muted-foreground col-span-full">No products found</p>}
        </div>
      </div>

      {/* Product Details Modal */}
      <ProductDetailsDialouge 
        open={openDetails} 
        setOpen={setOpenDetails} 
        productDetails={ProductDetails}
      />
    </div>
  )
}

export default Listing
