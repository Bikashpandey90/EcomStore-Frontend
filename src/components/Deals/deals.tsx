import { useEffect, useState } from "react"
import { ProductCard } from "../Product Card/productCard"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { Product } from "@/pages/products/admin-products.page"
import productSvc from "@/pages/products/products.service"

const DealSection = () => {
    const [products, setProduct] = useState<Product[]>([])
    const [timeleft, setTimeLeft] = useState<number>(3600 * 11)

    const fetchProducts = async () => {
        try {
            const response = await productSvc.getDealsProduct()
            setProduct(response.data.detail)


        } catch (exception) {
            console.log(exception);
        }
    }

    useEffect(() => {
        fetchProducts()
        const interval = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(interval)
                    return 0
                }
                return prevTime - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    // Convert timeLeft (seconds) to hours, minutes, and seconds
    const hours = Math.floor(timeleft / 3600)
    const minutes = Math.floor((timeleft % 3600) / 60)
    const seconds = timeleft % 60
    return (<>

        <section className="bg-muted py-8 md:py-12">
            <div className="container">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold">Today's Deals</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Ends in:</span>
                        <div className="flex gap-1">
                            <span className="bg-primary text-primary-foreground px-2 py-1 rounded">{hours}</span>:
                            <span className="bg-primary text-primary-foreground px-2 py-1 rounded">{minutes}</span>:
                            <span className="bg-primary text-primary-foreground px-2 py-1 rounded">{seconds}</span>
                        </div>
                    </div>
                </div>
                <Carousel className="w-full">
                    <CarouselContent>
                        {products.map((product, index) => (
                            <CarouselItem
                                key={index}
                                className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4"
                            >
                                <ProductCard


                                    onClick={product.slug
                                    }
                                    name={product.title}
                                    image={product.images[0]}
                                    price={product.actualAmt}
                                    originalPrice={product.price}
                                    rating={4.5}
                                    reviews={120 + index}
                                    discount={product.discount}
                                    productId={product._id}
                                    minOrderQuantity={product?.minOrderQuantity ?? 1}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" />
                </Carousel>
            </div>
        </section></>)
}
export default DealSection