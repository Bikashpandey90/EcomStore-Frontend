import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import * as Yup from "yup"
import { ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify"
import productSvc from "@/pages/products/products.service"
import { yupResolver } from "@hookform/resolvers/yup"
import { InputType, ProductImageUploader, TextAreaField, TextInputField } from "../form/input-field"
import categorySvc from "@/pages/category/category.service"
import { Category } from "../CategoryDialog/CategoryDialog"
import { Label } from "@radix-ui/react-label"
import brandSvc, { BrandData } from "@/pages/brand/brand.service"




interface AddProductFormProps {
  onSuccess: () => void;
}

export function AddProductForm({ onSuccess }: AddProductFormProps): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [brand, setBrand] = useState<BrandData[]>([])

  console.log(onSuccess)
  const ProductDTO = Yup.object({
    title: Yup.string().min(2).max(300).required(),
    description: Yup.string().min(2).max(2000).required(),
    price: Yup.number().min(100).required(),
    images: Yup.mixed().required(),
    category: Yup.array().of(Yup.string()).notRequired(),
    status: Yup.string().matches(/^(active|inactive)$/).default('inactive'),
    stock: Yup.number().min(0).required(),
    brand: Yup.string().notRequired(),
    discount: Yup.number().min(0).max(100).optional().default(0),
    minOrderQuantity: Yup.number().min(1).optional().default(1),
    discountOnQuantity: Yup.number().min(0).max(100).optional().default(0)


  })

  const { control, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: yupResolver(ProductDTO),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      category: [],
      status: 'inactive',
      stock: 0,
      brand: '',
      discount: 0,
      minOrderQuantity: 1,
      discountOnQuantity: 0
    }
  })

  const fetchCategories = async () => {
    try {
      const response = await categorySvc.getAllCategoryListUser()
      setCategories(response.data.detail)
    } catch (exception) {
      console.error(exception)

    }

  }
  const fetchBrand = async () => {
    try {
      const response = await brandSvc.getHomeBrandList()
      setBrand(response.data.detail)

    } catch (exception) {
      console.error(exception)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchBrand()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const submitForm = async (data: any) => { //todo manage data type(binding)
    setIsSubmitting(true)
    try {

      console.log("Submitting data", data)
      const response = await productSvc.createProduct(data)
      toast.success("Product added Succesfully");
      console.log(response)

    } catch (exception) {
      console.log(exception)
      toast.error("Product creation failed !")
    }
    finally {
      setIsSubmitting(false)
    }
  }

  return (

    <form onSubmit={handleSubmit(submitForm)} className="space-y-2 pt-4 mr" >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Image upload section - Column 1 */}
        <div className="flex flex-col items-center justify-start">
          <div className="relative mb-4 h-32 w-32 rounded-md border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden">
            {imagePreview ? (
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <ImagePlus className="h-10 w-10 text-muted-foreground/50" />
            )}
          </div>
          <ProductImageUploader
            onImageChange={handleImageChange}
            id="product-image"
            name="images"
            className="hidden"
            control={control}
            errMsg={errors?.images?.message as string}
            setError={setError}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("product-image")?.click()}
          >
            Upload Image
          </Button>
        </div>

        {/* Main form fields - Columns 2-3 */}
        <div className="md:col-span-2 space-y-3">
          <div className="space-y-2">
            <Label className="text-black">Product Name</Label>
            <TextInputField
              placeholder="Premium Wireless Headphones"
              type={InputType.TEXT}
              name="title"
              control={control}
              errMsg={errors?.title?.message as string}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <TextAreaField
              control={control}
              placeholder="Enter product description"
              name="description"
              errMsg={errors?.description?.message as string}
            />
          </div>
        </div>
      </div>

      {/* Price, Discount, Stock, Brand section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <Label>Price (Nrs)</Label>
          <TextInputField
            type={InputType.NUMBER}
            name="price"
            errMsg={errors?.price?.message as string}
            control={control}
          />
        </div>

        <div>
          <Label>Discount (%)</Label>
          <TextInputField
            type={InputType.NUMBER}
            name="discount"
            errMsg={errors?.discount?.message as string}
            control={control}
          />
        </div>
        <div>
          <Label>MinOrderQuantity</Label>
          <TextInputField
            type={InputType.NUMBER}
            name="minOrderQuantity"
            errMsg={errors?.minOrderQuantity?.message as string}
            control={control}
          />
        </div>


        <div>
          <Label>Stock</Label>
          <TextInputField
            type={InputType.NUMBER}
            control={control}
            name="stock"
            errMsg={errors?.stock?.message as string}
          />
        </div>


        <div>
          <Label>Brand</Label>
          <Controller
            name="brand"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">None</SelectItem>
                  {brand?.map((brd) => (
                    <SelectItem key={brd._id} value={brd._id || ""}>
                      {brd.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div>
          <Label >(%)offbyQuantity</Label>
          <TextInputField
            type={InputType.NUMBER}
            name="discountOnQuantity"
            errMsg={errors?.discountOnQuantity?.message as string}
            control={control}
          />
        </div>
      </div>


      {/* Category selector */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select onValueChange={(value) => field.onChange(value ? [value] : [])} value={field.value?.[0] || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select parent category (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">None</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <Label className="text-sm text-muted-foreground">Select the category that best fits your product</Label>
      </div>



      {/* Publish/Unpublish selector */}
      <div className="space-y-2">
        <Label>Status</Label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || "inactive"}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Publish</SelectItem>
                <SelectItem value="inactive">Unpublish</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <Label className="text-sm text-muted-foreground">Control whether this product is visible to customers</Label>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Add Product"}
        </Button>
      </div>
    </form>

  )
}

