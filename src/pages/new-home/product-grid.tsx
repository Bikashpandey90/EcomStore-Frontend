import ProductCard from "./product-card"

// Sample product data
const products = [
    {
        id: "1",
        name: "Revenant Relax Hood - Sacred Sand",
        price: 59.0,
        image: "https://flowersandsaints.com.au/cdn/shop/files/FNS1.jpg?v=1744530624&width=600",
        color: "#f5f0e5",
        slug: "revenant-relax-hood-sacred-sand",
    },
    {
        id: "2",
        name: "Revenant Relax Crew - Sacred Sand",
        price: 52.0,
        image: "https://flowersandsaints.com.au/cdn/shop/files/FNS2.jpg?v=1744530624&width=600",
        color: "#f5f0e5",
        slug: "revenant-relax-crew-sacred-sand",
    },
    {
        id: "3",
        name: "Stay Humble Relax Crew - Sacred Sand",
        price: 52.0,
        image: "https://flowersandsaints.com.au/cdn/shop/files/FNS3.jpg?v=1744530624&width=600",
        color: "#f5f0e5",
        slug: "stay-humble-relax-crew-sacred-sand",
    },
    {
        id: "4",
        name: "Stay Humble Relax Crew - Halo Mist",
        price: 52.0,
        image: "https://flowersandsaints.com.au/cdn/shop/files/FNS4.jpg?v=1744530624&width=600",
        color: "#c5d3e2",
        slug: "stay-humble-relax-crew-halo-mist",
    },
    {
        id: "5",
        name: "Stay Humble Relax Crew - Charcoal",
        price: 52.0,
        image: "https://flowersandsaints.com.au/cdn/shop/files/FNS5.jpg?v=1744530624&width=600",
        color: "#4a4a4a",
        slug: "stay-humble-relax-crew-charcoal",
    },
    {
        id: "6",
        name: "Stay Humble Relax Crew - Black",
        price: 52.0,
        image: "https://flowersandsaints.com.au/cdn/shop/files/FNS6.jpg?v=1744530624&width=600",
        color: "#000000",
        slug: "stay-humble-relax-crew-black",
    },
    {
        id: "7",
        name: "Revenant Relax Hood - Sacred Sand",
        price: 59.0,
        image: "https://flowersandsaints.com.au/cdn/shop/files/FNS1.jpg?v=1744530624&width=600",
        color: "#f5f0e5",
        slug: "revenant-relax-hood-sacred-sand-2",
    },
    {
        id: "8",
        name: "Revenant Relax Crew - Sacred Sand",
        price: 52.0,
        image: "https://flowersandsaints.com.au/cdn/shop/files/FNS2.jpg?v=1744530624&width=600",
        color: "#f5f0e5",
        slug: "revenant-relax-crew-sacred-sand-2",
    },
    {
        id: "9",
        name: "Stay Humble Relax Crew - Sacred Sand",
        price: 52.0,
        image: "https://flowersandsaints.com.au/cdn/shop/files/FNS3.jpg?v=1744530624&width=600",
        color: "#f5f0e5",
        slug: "stay-humble-relax-crew-sacred-sand-2",
    },
    {
        id: "10",
        name: "Stay Humble Relax Crew - Halo Mist",
        price: 52.0,
        image: "https://flowersandsaints.com.au/cdn/shop/files/FNS4.jpg?v=1744530624&width=600",
        color: "#c5d3e2",
        slug: "stay-humble-relax-crew-halo-mist-2",
    },
    {
        id: "11",
        name: "Stay Humble Relax Crew - Charcoal",
        price: 52.0,
        image: "https://flowersandsaints.com.au/cdn/shop/files/FNS5.jpg?v=1744530624&width=600",
        color: "#4a4a4a",
        slug: "stay-humble-relax-crew-charcoal-2",
    },
    {
        id: "12",
        name: "Stay Humble Relax Crew - Black",
        price: 52.0,
        image: "https://flowersandsaints.com.au/cdn/shop/files/FNS6.jpg?v=1744530624&width=600",
        color: "#000000",
        slug: "stay-humble-relax-crew-black-2",
    },
]

// Accept isFilterVisible as a prop
export default function ProductGrid({ isFilterVisible }: { isFilterVisible: boolean }) {
    // Determine grid columns based on filter visibility
    // When filters are hidden, use a different layout especially on mobile
    const gridClass = isFilterVisible
        ? "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
        : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"

    return (
        <div className={gridClass}>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    color={product.color}
                    slug={product.slug}
                    
                />
            ))}
        </div>
    )
}
