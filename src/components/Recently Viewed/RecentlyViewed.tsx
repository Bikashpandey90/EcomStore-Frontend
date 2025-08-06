import { useEffect, useState } from "react"
import { ProductCard } from "../Product Card/productCard"
import { Button } from "../ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { Product } from "../Shopping Cart PopOver/shopping-cart"
import productSvc from "@/pages/products/products.service"



const RecentlyViewed = () => {

    const [newProducts, setNewProducts] = useState<Product[]>([])

    const fetchNewArrivals = async () => {
        try {
            const response = await productSvc.getNewArrivals()
            setNewProducts(response.data.detail)

        } catch (exception) {
            console.log(exception)
        }
    }
    useEffect(() => {
        fetchNewArrivals()
    }, [])
    return (<>

        <section className="container py-8 md:py-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">New Arrivals</h2>
                <Button variant="ghost">View All</Button>
            </div>
            <Carousel className="w-full">
                <CarouselContent>
                    {newProducts.map((product, index) => (
                        <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4">
                            <ProductCard
                                name={product.title}
                                image={product.images[0]}
                                price={product.actualAmt}
                                rating={4.2}
                                reviews={35 + index}
                                originalPrice={product.price}
                                onClick={product.slug}
                                isNew={true}
                                minOrderQuantity={product?.minOrderQuantity ?? 1}

                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
            </Carousel>
        </section>
    </>)
}
export default RecentlyViewed