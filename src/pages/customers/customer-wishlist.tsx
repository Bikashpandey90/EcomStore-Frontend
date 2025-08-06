import { useContext, useEffect, useState } from "react"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
// import { useToast } from "@/hooks/use-toast"
import { NavLink, useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import wishListSvc from "../wishlist/wishlist.service"
import { formatNumber } from "@/lib/utils"
import { Product } from "../products/admin-products.page"
import productSvc from "../products/products.service"
import { ProductCard } from "@/components/Product Card/productCard"
import { CartContext } from "@/context/cart-context"
import orderSvc from "../orders/order.service"
import { AuthContext } from "@/context/auth-context"


// Types for our wishlist items
interface WishlistItem {
    _id: string
    productId: string
    userId: string
    product: {
        _id: string
        title: string
        slug: string
        price: number
        discount: number
        actualAmt: number
        images: string[]
        stock: number,
        minOrderQuantity?: number
    }
    createdAt: string
    updatedAt: string
    __v: number
}

export default function WishlistPage() {
    // const { toast } = useToast()

    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const cartContext = useContext(CartContext)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const auth = useContext(AuthContext) as { loggedInUser: any }

    if (!auth.loggedInUser) {
        navigate('/login')
    }

    if (!cartContext) {
        return null
    }
    const { fetchCart } = cartContext

    const addToCart = async (id: string, quantity: number) => {


        setLoading(true)
        try {
            const response = await orderSvc.addItemsToCart(id, quantity)
            fetchCart()
            console.log(response)

            // toast({
            //     title: "Added to cart",
            //     description: `${response.data.detail.product.title} has been added to your cart.`,
            // })

        } catch (exception) {
            console.log(exception)
        } finally {
            setLoading(false)
        }
    }


    const fetchWishList = async () => {
        try {
            const response = await wishListSvc.getMyWishList()
            setWishlistItems(response.data.detail)

        } catch (exception) {
            console.log(exception)

        }
    }
    useEffect(() => {
        fetchWishList()
    }, [])

    const removeFromWishlist = async (id: string) => {

        try {
            const response = await wishListSvc.removeWishlist(id)
            if (response.data.status === 200) {
                // toast({
                //     title: "Item removed",
                //     description: "The item has been removed from your wishlist.",
                // })
            }
            fetchWishList()
        } catch (exception) {
            console.log(exception)
        }
    }


    const fetchRecommended = async () => {
        try {
            const response = await productSvc.getProductForHome(1, 12)
            setProducts(response.data.detail)

        } catch (exception) {
            console.log(exception)
        }
    }
    useEffect(() => {
        fetchRecommended()
    }, [])



    return (
        <div className="container mx-auto px-0 sm:px-4 py-4 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 px-3 sm:px-0">
                <h1 className="text-2xl sm:text-3xl font-bold">My Wishlist</h1>
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                        {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
                    </span>
                </div>
            </div>

            {wishlistItems.length > 0 ? (
                <>
                    <div className="flex justify-end mb-3 px-3 sm:px-0">
                        <Button onClick={() => { }} className="flex items-center gap-2 text-sm sm:text-base">
                            <ShoppingCart className="h-4 w-4" />
                            Move all to cart
                        </Button>
                    </div>

                    <div className="border-x-0 border-t border-b sm:border sm:rounded-lg overflow-hidden w-full">
                        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium">
                            <div className="col-span-6">Product</div>
                            <div className="col-span-2">Price</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>

                        {wishlistItems.map((item, index) => (
                            <div key={index} className="border-t first:border-t-0">
                                {/* Mobile View */}
                                <div className="block md:hidden p-2 w-full">
                                    <div className="flex gap-2">
                                        <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                                            <img src={item.product.images[0] || "/placeholder.svg"} alt={item.product.title} className="object-cover  hover:scale-105"
                                                onClick={() => {
                                                    navigate('/products/' + item.product.slug)
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium truncate">{item.product.title}</h3>
                                            <div className="text-xs text-muted-foreground mt-0.5">
                                                {/* {item.product.category[0].title} */}

                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="font-semibold">Nrs {formatNumber(item.product.actualAmt)}</span>
                                                {item?.product?.actualAmt && (
                                                    <span className="text-muted-foreground line-through text-xs">
                                                        Nrs {formatNumber(item.product.price)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-1">
                                                {item.product.stock > 5 ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-primary/10 text-primary border-primary/20 text-xs py-0"
                                                    >
                                                        In Stock
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-destructive/10 text-destructive border-destructive/20 text-xs py-0"
                                                    >
                                                        Low in Stock
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => addToCart(item.product._id, item.product?.minOrderQuantity ?? 1)}
                                            disabled={!item.product.stock || loading}
                                            className="flex-1 h-8 text-xs"

                                        >
                                            <ShoppingCart className="h-3 w-3 mr-1" />
                                            Add to Cart
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeFromWishlist(item._id)}
                                            className="flex-none h-8 text-xs"
                                        >
                                            <Trash2 className="h-3 w-3 mr-1" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>

                                {/* Desktop View */}
                                <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:p-4 md:items-center">
                                    <div className="col-span-6 flex gap-4 items-center">
                                        <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                                            <img src={item.product.images[0] || "/placeholder.svg"} alt={item.product.title} className="object-cover  hover:scale-105" onClick={() => {
                                                navigate('/products/' + item.product.slug)
                                            }} />
                                        </div>
                                        <div>
                                            <h3 className="font-medium hover:underline" onClick={() => {
                                                navigate('/products/' + item.product.slug)
                                            }}>{item.product.title}</h3>
                                            <div className="text-sm text-muted-foreground mt-1">
                                                {/* {item.product.category} */}

                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <div className="flex flex-col">
                                            <span className="font-semibold">Nrs {formatNumber(item.product.actualAmt)}</span>
                                            {item.product.actualAmt && (
                                                <span className="text-muted-foreground line-through text-sm">
                                                    Nrs {formatNumber(item.product.price)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        {item.product.stock > 5 ? (
                                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                                In Stock
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                                                Low in Stock
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="col-span-2 flex gap-2 justify-end">
                                        <Button variant="default" size="sm" onClick={() => addToCart(item.product._id, 1)}
                                            disabled={!item.product.stock}
                                        >
                                            <ShoppingCart className="h-4 w-4 mr-2" />
                                            Add
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9"
                                            onClick={() => removeFromWishlist(item._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Remove</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center py-12 px-4 border rounded-none sm:rounded-lg mx-0">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                        <Heart className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Items added to your wishlist will appear here. Start browsing and add your favorite products!
                    </p>
                    <Button asChild>
                        <NavLink to="/products">Browse products</NavLink>
                    </Button>
                </div>
            )}

            <div className="mt-8 px-3 sm:px-0">
                <Separator className="mb-4" />
                <h2 className="text-xl font-semibold mb-3">You might also like</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {products.map((product, index) => (
                        <ProductCard
                            key={index}
                            onClick={product.slug}
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
                    ))}
                </div>
            </div>
        </div>
    )
}

