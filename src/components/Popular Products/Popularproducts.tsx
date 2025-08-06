import { ProductCard } from "../Product Card/productCard"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { Product } from "@/pages/products/admin-products.page"
import productSvc from "@/pages/products/products.service"

const PopularProducts = () => {
    const [activeTab, setActiveTab] = useState("all")

    const [products, setProduct] = useState<Product[]>([])
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)

    const fetchProducts = async (page = 1) => {
        try {
            setLoading(true)
            const response = await productSvc.getProductForHome(page)
            if (response.data.detail.length === 0) {
                setHasMore(false)
            } else {
                setProduct((prevProducts) => {
                    // Convert the current and new products to a Set to remove duplicates
                    const productMap = new Map(prevProducts.map(product => [product._id, product]));
                    response.data.detail.forEach((product: Product) => productMap.set(product._id, product));

                    return Array.from(productMap.values()); // Convert Map back to an array
                });

            }

        } catch (exception) {
            console.log(exception);
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts(page)
    }, [page])

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage((prevPage) => prevPage + 1)
        }
    }

    return (<>
        <section className="container py-8 md:py-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">Popular Products</h2>
                <Tabs defaultValue="all" className="w-fit" onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="new">New Arrivals</TabsTrigger>
                        {/* <TabsTrigger value="featured">Featured</TabsTrigger>
                            <TabsTrigger value="bestsellers">Bestsellers</TabsTrigger> */}
                    </TabsList>
                </Tabs>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {products.map((product, index) => (
                    <ProductCard
                        onClick={product.slug}
                        key={index}
                        name={product.title}
                        image={product.images[0]}
                        price={product.actualAmt}
                        rating={4 + (index % 2) * 0.5}
                        reviews={50 + index * 5}
                        isNew={activeTab === "new" || index % 3 === 0}
                        isFeatured={activeTab === "featured" || index % 4 === 0}
                        isBestseller={activeTab === "bestsellers" || index % 5 === 0}
                        productId={product._id}
                        minOrderQuantity={product?.minOrderQuantity ?? 1}
                    />
                ))}
            </div>
            <div className="flex justify-center mt-8">
                <Button variant="outline" size="lg"
                    onClick={() => {
                        handleLoadMore()
                    }}
                    disabled={loading}


                >
                    {loading ? "Loading.." : "Load More"}
                </Button>
            </div>
        </section></>)
}
export default PopularProducts