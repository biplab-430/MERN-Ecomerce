import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { brandOptionMap, categoryOptionMap } from '@/config'
import React from 'react'

function ShopProductTile({ product,handleGetProductDetails,handleAddToCart }) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={()=>handleGetProductDetails(product?._id)}>
        {/* Product Image */}
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />  {
            
             product?.totalStock === 0?
              <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-800">
              OUT OF STOCK
            </Badge>: product?.totalStock <= 10?
             <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-800">
              {`only ${product?.totalStock} items are left! Hurry Up `}
            </Badge>:
            product?.salePrice > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-800">
              Sale
            </Badge>
          )}
        </div>

    
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>

          {/* Category & Brand */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              {categoryOptionMap[product?.category]}
            </span>
            <span className="text-sm text-muted-foreground">
              {brandOptionMap[product?.brand]}
            </span>
          </div>

          {/* Price Section */}
          <div className="flex justify-between items-center mb-2">
            <span
              className={`text-lg font-semibold ${
                product?.salePrice > 0
                  ? 'line-through text-muted-foreground'
                  : 'text-primary'
              }`}
            >
              ₹{product?.price}
            </span>

            {product?.salePrice > 0 && (
              <span className="text-lg font-bold text-primary">
                ₹{product?.salePrice}
              </span>
            )}
          </div>
        </CardContent>

     
      </div>
        <CardFooter>
          {
             product?.totalStock === 0?
            <Button 
           className="w-full opacity-60 cursor-not-allowed">Out Of Stock</Button> :
           <Button onClick={()=>handleAddToCart(product?._id,product?.totalStock)}
           className="w-full">Add to Cart</Button>

          }
          
        </CardFooter>
    </Card>
  )
}

export default ShopProductTile
