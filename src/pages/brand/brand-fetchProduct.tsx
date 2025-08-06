import { useEffect, useState } from "react"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useParams } from "react-router-dom"
import { Product } from "@/components/Shopping Cart PopOver/shopping-cart"
import brandSvc, { BrandData } from "./brand.service"
import { ProductCard } from "@/components/Product Card/productCard"


const categories = ["All Products", "Smartphones", "Laptops", "Tablets", "Wearables", "Audio", "Smart Home"]



export default function BrandProductListing() {
    const [selectedCategory, setSelectedCategory] = useState("All Products")

    const [products, setProduct] = useState<Product[]>([])
    const [brandData, setBrand] = useState<BrandData | null>(null)
    const { slug } = useParams()

    // const filteredProducts =
    // selectedCategory === "All Products" ? products : products.filter((product) => product.category === selectedCategory)

    const fetchProductBySlug = async () => {
        try {
            const response = await brandSvc.fetchBySlug(slug as string)
            setProduct(response.data.detail.products)
            setBrand(response.data.detail.brand)

        } catch (exception) {
            console.log(exception)
        }
    }
    useEffect(() => {
        fetchProductBySlug()
    }, [])

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Brand information sidebar */}
                    <div className="lg:w-1/4">
                        <div className="bg-muted p-4 rounded-lg lg:sticky lg:top-4">
                            <Accordion type="single" collapsible className="lg:hidden">
                                <AccordionItem value="brand-info">
                                    <AccordionTrigger className="flex items-center">
                                        <img
                                            src={brandData?.image || "/placeholder.svg"}
                                            alt={brandData?.title}
                                            width={80}
                                            height={40}
                                            className="mr-2 mix-blend-multiply"
                                        />
                                        <h1 className="text-xl font-bold">{brandData?.title}</h1>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <BrandInfo brandData={brandData} />
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <div className="hidden lg:block">
                                <div className="flex items-center mb-4">
                                    <img
                                        src={brandData?.image || "/placeholder.svg"}
                                        alt={brandData?.title}
                                        width={120}
                                        height={60}
                                        className="mr-4 mix-blend-multiply"
                                    />
                                    <h1 className="text-2xl font-bold">{brandData?.title}</h1>
                                </div>
                                <BrandInfo brandData={brandData} />
                            </div>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="lg:w-3/4">
                        {/* Results header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                            <h2 className="text-2xl font-bold mb-2 sm:mb-0">{brandData?.title} Products</h2>
                            <div className="flex items-center">
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

                        {/* Categories */}
                        <div className="mb-6 overflow-x-auto">
                            <div className="flex flex-nowrap gap-2 pb-2">
                                {categories.map((category) => (
                                    <Button
                                        key={category}
                                        variant={selectedCategory === category ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedCategory(category)}
                                        className="whitespace-nowrap"
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Products grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
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

                        {/* Load more button */}
                        <div className="mt-8 text-center">
                            <Button variant="outline">Load More Products</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function BrandInfo({ brandData }: { brandData: BrandData | null }) {

    const brandDatas =
    {
        keyFeatures: [
            "Industry-leading 5-year warranty",
            "30-day money-back guarantee",
            "24/7 customer support",
            "Eco-friendly packaging",
            "Free software updates for life",
        ],
    }


    return (
        <>
            <p className="text-sm text-muted-foreground mb-4">

                {brandData?.title}: Innovating for a smarter tomorrow. Our cutting-edge consumer electronics blend style with functionality to enhance your daily life.

            </p>
            <div className="mb-4">
                <p className="text-sm">
                    <strong>Founded:</strong> 2005
                </p>
                <p className="text-sm">
                    <strong>Headquarters:</strong> Silicon Valley, CA
                </p>
            </div>
            <h2 className="font-semibold mb-2">Why Choose {brandData?.title}?</h2>
            <ul className="space-y-2">
                {brandDatas.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                    </li>
                ))}
            </ul>
            <Button className="w-full mt-6">Visit Brand Website</Button>
        </>
    )
}

