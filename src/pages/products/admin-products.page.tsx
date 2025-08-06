import { useCallback, useContext, useEffect, useState } from "react"
import { MoreHorizontal, Plus, Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { AuthContext } from "@/context/auth-context"
import { toast } from "react-toastify"
import productSvc from "./products.service"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { AddProductForm } from "@/components/seller-dashboard-components/add-product-form"
import { EditProductForm } from "@/components/seller-dashboard-components/edit-form"
import { formatNumber } from "@/lib/utils"

export interface Product {
  _id: string
  title: string
  slug: string
  category: any
  price: number
  brand: {
    _id: string
    title: string
    slug: string
  }
  stock: number
  minOrderQuantity?: number
  discountOnQuantity?: number
  discount: number
  actualAmt: number
  description: string
  seller: {
    _id: string
    name: string
    email: string
    phone: string
    image: string
  }
  images: any
  status: string
  createdBy: {
    _id: string
    name: string
    email: string
    status: string
  }
  updatedBy: {
    _id: string
    name: string
    email: string
    status: string
  } | null
  createdAt: Date | null
  updatedAt: Date | null
}

export default function AdminProductsPage() {
  const navigate = useNavigate()
  const [datas, setData] = useState<Product[]>([])
  const [item, selectedItem] = useState<string>()

  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const auth = useContext(AuthContext) as { loggedInUser: any }
  const [editProductId, setEditProductId] = useState<string | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)


  // Toggle selection of a product
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  // Toggle selection of all products
  const toggleAllProducts = () => {
    if (selectedProducts.length === datas.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(datas.map((datas) => datas._id))
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800"
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800"
      case "Out of Stock":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }


  // ------------------------MY Functions--------------------------------


  const handleEditClick = (id: string) => {
    setEditProductId(id)
    setIsEditSheetOpen(true)
  }


  const loadAllProducts = useCallback(async ({ page = 1 }) => {
    try {
      const response = await productSvc.getAllProductList(page, 30)
      setData(response?.data.detail || [])
    } catch (exception) {
      console.log(exception)
      toast.error("Error loading products !")
    } finally {
      console.log("Done")
    }
  }, [])
  useEffect(() => {
    loadAllProducts({ page: 1 })
  }, [])

  const deleteProductItem = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure ?",
        text: "You will not be able to recover this!",
        icon: "warning",
        confirmButtonColor: "#0E0E0E",
        cancelButtonColor: "#ccc",

        confirmButtonText: "Delete",
      })
      if (result.isConfirmed) {
        await productSvc.deleteProduct(id)
        loadAllProducts({ page: 1 })
        toast.success("Product deleted successfully !")
      }
    } catch (exception) {
      console.log(exception)
      toast.error("Error deleting product!")
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Main content */}
      <main className={`flex-1 transition-all duration-200 `}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-3 sm:px-6">
          <h1 className="text-xl font-semibold">Products</h1>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search products..." className="w-[200px] pl-8 md:w-[300px]" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <img
                    src={auth.loggedInUser.image || "/placeholder.svg"}
                    alt="Admin"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    navigate("/admin/profile")
                  }}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Products content */}
        <div className="p-4 sm:p-6">
          {/* Actions bar */}
          <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">All Products</h2>
              <Badge variant="outline">{datas?.length}</Badge>
            </div>

            <div className="flex flex-wrap gap-2 sm:flex-row">
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="gap-1 flex-1 sm:flex-none">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                </Button>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-[130px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="apparel">Apparel</SelectItem>
                    <SelectItem value="home">Home Goods</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Sheet open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <SheetTrigger asChild>
                  <Button className="ml-auto w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Add New Product</SheetTitle>
                    <SheetDescription>Fill in the details to add a new product to your store.</SheetDescription>
                  </SheetHeader>
                  <AddProductForm onSuccess={() => setIsAddProductOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Mobile search */}
          <div className="mb-4 block md:hidden">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search products..." className="w-full pl-8" />
            </div>
          </div>

          {/* Mobile product card view (visible only on very small screens) */}
          <div className="block sm:hidden mb-4 w-full">
            {datas.map((data) => (
              <div key={data._id} className="border rounded-md p-3 mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedProducts.includes(data._id)}
                    onCheckedChange={() => toggleProductSelection(data._id)}
                    aria-label={`Select ${data.title}`}
                  />
                  <img
                    src={data.images[0] || "/placeholder.svg"}
                    alt={data.title}
                    width={40}
                    height={40}
                    className="rounded-md"
                  />
                  <div>
                    <div className="font-medium truncate max-w-[150px]">{data?.title}</div>
                    <div className="text-sm text-muted-foreground">Nrs {formatNumber(data.price)}</div>
                  </div>
                </div>
                <DropdownMenu onOpenChange={() => selectedItem(data._id)}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        handleEditClick(data._id)
                      }}
                    >Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/admin/products/" + data._id)}>View</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => {
                        if (item) deleteProductItem(item)
                        else toast.error("No user selected")
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>

          {/* Products table */}
          <div className="rounded-md border bg-card hidden sm:block w-full overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={selectedProducts.length === datas.length && datas.length > 0}
                      onCheckedChange={toggleAllProducts}
                      aria-label="Select all products"
                    />
                  </TableHead>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="hidden lg:table-cell">Category</TableHead>
                  <TableHead className="hidden md:table-cell">Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datas.map((data) => (
                  <TableRow key={data._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(data._id)}
                        onCheckedChange={() => toggleProductSelection(data._id)}
                        aria-label={`Select ${data.title}`}
                      />
                    </TableCell>
                    <TableCell>
                      <img
                        src={data.images[0] || "/placeholder.svg"}
                        alt={data.title}
                        width={40}
                        height={40}
                        className="rounded-md"
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-[120px] sm:max-w-none">
                      <div className="flex flex-col">
                        <span className="truncate">{data?.title}</span>
                        <span className="text-xs text-muted-foreground">{data._id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {data?.category?.length > 0 ? data.category[0].title : "Parent"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{data?.stock || 40}</TableCell>
                    <TableCell>Nrs {formatNumber(data.actualAmt)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className={getStatusColor(data.status)}>
                        {data.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu
                        onOpenChange={() => {
                          selectedItem(data._id)
                          console.log(data._id)
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              handleEditClick(data._id)
                            }}

                          >Edit</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              navigate("/admin/products/" + data._id)
                            }}
                          >
                            View
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              if (item) {
                                deleteProductItem(item)
                                console.log(item)
                              } else {
                                toast.error("No user selected")
                              }
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground order-2 sm:order-1">
              Showing <strong>1-8</strong> of <strong>24</strong> products
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-end order-1 sm:order-2">
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8">
                1
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8">
                2
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8">
                3
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        {/* Edit Product Sheet */}
        <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Edit Product</SheetTitle>
              <SheetDescription>Make changes to your product here.</SheetDescription>
            </SheetHeader>

            <EditProductForm
              productId={editProductId!}

            />
          </SheetContent>
        </Sheet>
      </main>
    </div>
  )
}

