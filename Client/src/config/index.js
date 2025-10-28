import {
  LayoutDashboard,
  ShoppingBasket,
  BadgeCheck,
  Users,        // 👈 for Users
  Mail          // 👈 for Contact
} from "lucide-react";


export const registerFormControls = [
  {
    name: "userName", // ✅ matches backend
    label: "User Name",
    placeholder: "Enter your username",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];



export const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: ShoppingBasket,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: BadgeCheck,
  },
  {
    id: "users",
    label: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    id: "contact",
    label: "Contact",
    path: "/admin/contact",
    icon: Mail,
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "H&M" },
      { id: "levi", label: "Levi's" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice", // ✅ matches backend
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (if any)",
  },
  {
    label: "Total Stock",
    name: "totalStock", // ✅ matches backend
    componentType: "input",
    type: "number",
    placeholder: "Enter stock quantity",
  },
];

export const shoppingViewHeaderMenuItems = [
  { id: 'home', label: 'Home', path: '/shop/home' },
  { id: 'products', label: 'Products', path: '/shop/list' },
  { id: 'men', label: 'Men', path: '/shop/list?category=men' },
  { id: 'women', label: 'Women', path: '/shop/list?category=women' },
  { id: 'kids', label: 'Kids', path: '/shop/list?category=kids' },
  { id: 'accessories', label: 'Accessories', path: '/shop/list?category=accessories' },
  { id: 'footwear', label: 'Footwear', path: '/shop/list?category=footwear' },
  { id: 'search', label: 'Search', path: '/shop/search' },
];

export const FilterOptions = {
  categories: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "accessories", label: "Accessories" },
    { id: "footwear", label: "Footwear" },
  ],
  brands: [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },
    { id: "levi", label: "Levi's" },
  ],
};
export const SortOptions=[
   { id: "price_asc", value: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", value: "price_desc", label: "Price: High to Low" },
  { id: "name_asc", value: "name_asc", label: "Name: A-Z" },
  { id: "name_desc", value: "name_desc", label: "Name: Z-A" },
]
export const categoryOptionMap = {
  'men': "Men",
  'women': "Women",
  'kids': "Kids",
 'accessories':'Accessories',
 "footwear":"Footwear"
};
export const brandOptionMap = {
  'nike': "Nike",
  'adidas': "Adidas",
  'puma': "Puma",
 'zara': "Zara",
  "h&m": "H&M",
  'levi': "Levi's",
};
export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea", // could also be input
    placeholder: "Additional notes (optional)",
  },
]

