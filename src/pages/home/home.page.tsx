
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect } from "react"
import { ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NavLink } from "react-router-dom";
import { ProductCard } from "@/components/Product Card/productCard";




const HomePage = () => {



  const [activeTab, setActiveTab] = useState("all")
  const [autoplay, setAutoplay] = useState(true)

  // Autoplay for main banner
  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      const nextButton = document.querySelector('[data-carousel="main-banner"] [data-carousel-next]')
      if (nextButton) {
        nextButton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay])

  return <>


    {/* <BannerSlider /> */}



    <div className="flex flex-col min-h-screen">
      {/* Main Banner Carousel */}
      <section className="w-full">
        <Carousel className="w-full" data-carousel="main-banner">
          <CarouselContent>
            {[
              {
                image: "/placeholder.svg?height=500&width=1200",
                title: "Summer Collection 2024",
                subtitle: "Up to 50% off on selected items",
                cta: "Shop Now",
              },
              {
                image: "/placeholder.svg?height=500&width=1200",
                title: "New Arrivals",
                subtitle: "Check out our latest products",
                cta: "Discover More",
              },
              {
                image: "/placeholder.svg?height=500&width=1200",
                title: "Limited Time Offer",
                subtitle: "Free shipping on orders over $50",
                cta: "Get Started",
              },
            ].map((banner, index) => (
              <CarouselItem key={index} className="relative">
                <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full">
                  <img
                    src={banner.image || "/placeholder.svg"}
                    alt={banner.title}

                    className="object-cover"
                  // priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-8 md:px-16">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2">{banner.title}</h2>
                    <p className="text-lg md:text-xl text-white/90 mb-6 max-w-md">{banner.subtitle}</p>
                    <Button size="lg" className="w-fit">
                      {banner.cta}
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-4 right-4 flex gap-2 z-10">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40"
              onClick={() => setAutoplay(!autoplay)}
            >
              {autoplay ? (
                <span className="h-3 w-3 bg-white rounded-sm"></span>
              ) : (
                <ChevronRight className="h-4 w-4 text-white" />
              )}
            </Button>
            <CarouselPrevious className="relative inset-0 translate-y-0 bg-white/20 backdrop-blur-sm hover:bg-white/40" />
            <CarouselNext className="relative inset-0 translate-y-0 bg-white/20 backdrop-blur-sm hover:bg-white/40" />
          </div>
        </Carousel>
      </section>

      {/* Categories Section */}
      <section className="container py-8 md:py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
          <NavLink to="/categories" className="text-primary flex items-center gap-1 hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </NavLink>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: "Electronics", icon: "🖥️", color: "bg-blue-100" },
            { name: "Fashion", icon: "👕", color: "bg-pink-100" },
            { name: "Home & Kitchen", icon: "🏠", color: "bg-green-100" },
            { name: "Beauty", icon: "✨", color: "bg-purple-100" },
            { name: "Sports", icon: "⚽", color: "bg-orange-100" },
            { name: "Books", icon: "📚", color: "bg-yellow-100" },
            { name: "Toys", icon: "🧸", color: "bg-red-100" },
            { name: "Automotive", icon: "🚗", color: "bg-gray-100" },
            { name: "Health", icon: "💊", color: "bg-teal-100" },
            { name: "Grocery", icon: "🛒", color: "bg-lime-100" },
            { name: "Pet Supplies", icon: "🐾", color: "bg-amber-100" },
            { name: "Garden", icon: "🌱", color: "bg-emerald-100" },
          ].map((category, index) => (
            <NavLink to={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`} key={index} className="group">
              <div
                className={`${category.color} rounded-lg p-4 flex flex-col items-center justify-center h-32 transition-transform group-hover:scale-105`}
              >
                <span className="text-4xl mb-2">{category.icon}</span>
                <span className="font-medium text-center">{category.name}</span>
              </div>
            </NavLink>
          ))}
        </div>
      </section>

      {/* Deals Section */}
      <section className="bg-muted py-8 md:py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Today's Deals</h2>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Ends in:</span>
              <div className="flex gap-1">
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded">10</span>:
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded">45</span>:
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded">22</span>
              </div>
            </div>
          </div>
          <Carousel className="w-full">
            <CarouselContent>
              {Array.from({ length: 10 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4"
                >
                  <ProductCard
                    name={`Deal Product ${index + 1}`}
                    image="/placeholder.svg?height=300&width=300"
                    price={99.99 - index * 5}
                    originalPrice={149.99}
                    rating={4.5}
                    reviews={120 + index}
                    discount={Math.floor(((149.99 - (99.99 - index * 5)) / 149.99) * 100)}

                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Banner Grid */}
      <section className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="relative h-[200px] rounded-lg overflow-hidden">
            <img src="/placeholder.svg?height=400&width=600" alt="Promotion 1" className="object-cover" />
            <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-center">
              <h3 className="text-white text-2xl font-bold mb-2">Summer Essentials</h3>
              <p className="text-white/90 mb-4">Get ready for summer with our collection</p>
              <Button variant="secondary" className="w-fit">
                Shop Now
              </Button>
            </div>
          </div>
          <div className="relative h-[200px] rounded-lg overflow-hidden">
            <img src="/placeholder.svg?height=400&width=600" alt="Promotion 2" className="object-cover" />
            <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-center">
              <h3 className="text-white text-2xl font-bold mb-2">New Tech Arrivals</h3>
              <p className="text-white/90 mb-4">Discover the latest gadgets</p>
              <Button variant="secondary" className="w-fit">
                Explore
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="container py-8 md:py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Popular Products</h2>
          <Tabs defaultValue="all" className="w-fit" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="new">New Arrivals</TabsTrigger>

            </TabsList>
          </Tabs>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <ProductCard
              key={index}
              name={`Product ${index + 1}`}
              image="/placeholder.svg?height=300&width=300"
              price={49.99 + index * 10}
              rating={4 + (index % 2) * 0.5}
              reviews={50 + index * 5}
              isNew={activeTab === "new" || index % 3 === 0}
              isFeatured={activeTab === "featured" || index % 4 === 0}
              isBestseller={activeTab === "bestsellers" || index % 5 === 0}
            />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Button variant="outline" size="lg">
            Load More
          </Button>
        </div>
      </section>

      {/* Brands Section */}
      <section className="bg-muted py-8 md:py-12">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Top Brands</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {Array.from({ length: 12 }).map((_, index) => (
                <CarouselItem key={index} className="basis-1/3 md:basis-1/4 lg:basis-1/6 pl-4">
                  <div className="bg-background rounded-lg p-4 h-24 flex items-center justify-center">
                    <img
                      src="/placeholder-logo.svg"
                      alt={`Brand ${index + 1}`}
                      width={100}
                      height={50}
                      className="max-h-12 w-auto object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="container py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Summer Collection", image: "/placeholder.svg?height=400&width=400" },
            { title: "New Arrivals", image: "/placeholder.svg?height=400&width=400" },
            { title: "Bestsellers", image: "/placeholder.svg?height=400&width=400" },
          ].map((collection, index) => (
            <NavLink
              to={`/collection/${collection.title.toLowerCase().replace(/\s+/g, "-")}`}
              key={index}
              className="group"
            >
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <img
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.title}

                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white text-xl font-bold mb-2">{collection.title}</h3>
                  <Button variant="secondary" size="sm" className="w-fit">
                    View Collection
                  </Button>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      <section className="container py-8 md:py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Recently Viewed</h2>
          <Button variant="ghost">Clear All</Button>
        </div>
        <Carousel className="w-full">
          <CarouselContent>
            {Array.from({ length: 8 }).map((_, index) => (
              <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4">
                <ProductCard
                  name={`Viewed Product ${index + 1}`}
                  image="/placeholder.svg?height=300&width=300"
                  price={79.99 - index * 3}
                  rating={4.2}
                  reviews={35 + index}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </section>

      {/* Services Banner */}
      <section className="bg-muted py-8 md:py-12">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🚚", title: "Free Shipping", description: "On orders over $50" },
              { icon: "🔄", title: "Easy Returns", description: "30-day return policy" },
              { icon: "🔒", title: "Secure Payment", description: "100% secure checkout" },
              { icon: "💬", title: "24/7 Support", description: "We're here to help" },
            ].map((service, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-background rounded-lg">
                <div className="text-3xl">{service.icon}</div>
                <div>
                  <h3 className="font-semibold">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}


      {/* Footer */}

    </div>


  </>


}
export default HomePage


