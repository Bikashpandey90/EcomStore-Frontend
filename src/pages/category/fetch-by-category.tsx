import { useEffect, useState } from "react"
import { ChevronDown, ChevronRight, Filter, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NavLink, useNavigate, useParams, useSearchParams } from "react-router-dom"
import categorySvc, { CategoryData } from "./category.service"
import { Product } from "@/components/Shopping Cart PopOver/shopping-cart"
import { ProductCard } from "@/components/Product Card/productCard"
import brandSvc, { BrandData } from "../brand/brand.service"
import productSvc from "../products/products.service"

// Sample data - in a real app this would come from an API
// const categories = [
//     { id: 1, name: "Electronics", count: 1245 },
//     { id: 2, name: "Clothing", count: 842 },
//     { id: 3, name: "Home & Kitchen", count: 654 },
//     { id: 4, name: "Books", count: 423 },
//     { id: 5, name: "Sports & Outdoors", count: 321 },
// ]

const subCategories = {
    Electronics: ["Smartphones", "Laptops", "Tablets", "Headphones", "Cameras", "Smart Home"],
    Clothing: ["Men's", "Women's", "Kids'", "Shoes", "Accessories", "Watches"],
    "Home & Kitchen": ["Furniture", "Kitchen Appliances", "Bedding", "Decor", "Storage", "Lighting"],
    Books: ["Fiction", "Non-Fiction", "Children's", "Textbooks", "Comics", "Audiobooks"],
    "Sports & Outdoors": ["Exercise & Fitness", "Outdoor Recreation", "Team Sports", "Water Sports", "Winter Sports"],
}



const priceRanges = [
    { id: 1, range: "Under $25", count: 245 },
    { id: 2, range: "$25 to $50", count: 187 },
    { id: 3, range: "$50 to $100", count: 143 },
    { id: 4, range: "$100 to $200", count: 98 },
    { id: 5, range: "$200 & Above", count: 76 },
]






export default function CategoryListPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>()
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [products, setProduct] = useState<Product[]>([])
    const [categories, setCategories] = useState<CategoryData[]>([])
    const [brands, setBrand] = useState<BrandData[]>([])
    const { slug } = useParams();
    const navigate = useNavigate()
    // const location = useLocation();
    const [searchParams] = useSearchParams()
    // const [search, setSearch] = useState(new URLSearchParams(location.search).get('q') || ''); // Extract search query from URL
    const search = searchParams.get('q') || '';




    const fetchProducts = async () => {
        try {
            const response = await categorySvc.fetchProductBySlug(slug as string)

            if (response) {
                setProduct(response.data.detail.products)
                setSelectedCategory(response.data.detail.category.title)
            }
        } catch (exception) {
            console.log(exception)
        }
    }
    const fetchCategories = async () => {
        try {
            const response = await categorySvc.getHomeCategoryList()
            setCategories(response.data.detail)


        } catch (exception) {
            console.log(exception)
        }
    }

    const fetchBrand = async () => {
        try {
            const response = await brandSvc.getHomeBrandList()
            setBrand(response.data.detail)


        } catch (exception) {
            console.log(exception)
        }
    }

    const loadSearchProducts = async ({ page = 1 }) => {
        try {
            const response = await productSvc.getProductForHome(page, 40, search)
            setProduct(response.data.detail)

        } catch (exception) {
            console.log(exception)
        }
    }
    useEffect(() => {
        fetchCategories()
        fetchBrand()
    }, [])
    useEffect(() => {
        fetchProducts()
    }, [selectedCategory])

    useEffect(() => {
        loadSearchProducts({ page: 1 })
    }, [search])





    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-muted-foreground mb-6">
                <NavLink to="/" className="hover:underline">
                    Home
                </NavLink>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span className="font-medium text-foreground">
                    {selectedCategory}


                </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Mobile filter button */}
                <div className="lg:hidden mb-4">
                    <Button
                        variant="outline"
                        className="w-full flex items-center justify-between"
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    >
                        <span className="flex items-center">
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                        </span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${mobileFiltersOpen ? "rotate-180" : ""}`} />
                    </Button>
                </div>

                {/* Sidebar filters */}
                <div className={`${mobileFiltersOpen ? "block" : "hidden"} lg:block lg:w-1/4 space-y-6`}>
                    {/* Department/Category section */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Department</h3>
                        <ul className="space-y-2">
                            {categories.map((category) => (
                                <li key={category._id} className="flex items-center justify-between">
                                    <button
                                        className={`text-left hover:text-primary ${selectedCategory === category.title ? "font-medium text-primary" : ""}`}
                                        onClick={() => {
                                            setSelectedCategory(category.title)
                                            navigate(`/category/${category.slug}`)
                                        }
                                        }

                                    >
                                        {category.title}
                                    </button>
                                    <span className="text-sm text-muted-foreground">
                                        ({Math.floor(Math.random() * (1000 - 100 + 1)) + 100})
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Separator />


                    {/* Subcategories */}
                    {selectedCategory && (
                        <div>
                            <h3 className="font-semibold text-lg mb-3">{selectedCategory}
                            </h3>
                            <Accordion type="single" collapsible defaultValue="subcategories">
                                <AccordionItem value="subcategories" className="border-none">
                                    <AccordionTrigger className="py-2 hover:no-underline">
                                        <span className="text-sm font-medium">Show all subcategories</span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-2 pl-2">
                                            {subCategories[selectedCategory as keyof typeof subCategories]?.map((subCategory, index) => (
                                                <li key={index} className="flex items-center justify-between">
                                                    <button className="text-left text-sm hover:text-primary">{subCategory}</button>
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    )}

                    <Separator />

                    {/* Customer Reviews filter */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Customer Reviews</h3>
                        <ul className="space-y-2">
                            {[4, 3, 2, 1].map((rating) => (
                                <li key={rating} className="flex items-center">
                                    <Checkbox id={`rating-${rating}`} className="mr-2" />
                                    <label htmlFor={`rating-${rating}`} className="flex items-center cursor-pointer">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                            />
                                        ))}
                                        <span className="ml-1 text-sm">& Up</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Separator />

                    {/* Brand filter */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Brand</h3>
                        <ul className="space-y-2">
                            {brands.map((brand) => (
                                <li key={brand._id} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Checkbox id={`brand-${brand._id}`} className="mr-2" />
                                        <label htmlFor={`brand-${brand._id}`} className="text-sm cursor-pointer">
                                            {brand.title}
                                        </label>
                                    </div>
                                    <span className="text-sm text-muted-foreground">

                                        {/* brand count */}
                                        ({Math.floor(Math.random() * (1000 - 100 + 1)) + 100})

                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Separator />

                    {/* Price filter */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Price</h3>
                        <ul className="space-y-2">
                            {priceRanges.map((range) => (
                                <li key={range.id} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Checkbox id={`price-${range.id}`} className="mr-2" />
                                        <label htmlFor={`price-${range.id}`} className="text-sm cursor-pointer">
                                            {range.range}
                                        </label>
                                    </div>
                                    <span className="text-sm text-muted-foreground">({range.count})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Main content */}
                <div className="lg:w-3/4">
                    {/* Results header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <h1 className="text-2xl font-bold">{selectedCategory}{search ? `Showing Results for ${search}` : ''}</h1>
                        <div className="flex items-center mt-3 sm:mt-0">
                            <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
                            <Select defaultValue="featured">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="featured">Featured</SelectItem>
                                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                                    <SelectItem value="rating">Avg. Customer Review</SelectItem>
                                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Results count */}
                    <p className="text-sm text-muted-foreground mb-6">
                        1-{products.length} of over 1,000 results for "{selectedCategory}{search}"
                    </p>

                    {/* Products grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product, index) => (

                            <ProductCard
                                onClick={product.slug}
                                key={index}
                                name={product.title}
                                image={product.images[0]}
                                price={product.actualAmt}
                                rating={4 + (index % 2) * 0.5}
                                reviews={50 + index * 5}

                                productId={product._id}
                                minOrderQuantity={product?.minOrderQuantity ?? 1}
                            />


                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-8">
                        <nav className="flex items-center space-x-1">
                            <Button variant="outline" size="icon" disabled>
                                <ChevronRight className="h-4 w-4 rotate-180" />
                            </Button>
                            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                1
                            </Button>
                            <Button variant="outline" size="sm">
                                2
                            </Button>
                            <Button variant="outline" size="sm">
                                3
                            </Button>
                            <Button variant="outline" size="sm">
                                4
                            </Button>
                            <Button variant="outline" size="sm">
                                5
                            </Button>
                            <Button variant="outline" size="icon">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}

