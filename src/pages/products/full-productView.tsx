import { useContext, useEffect, useState } from "react"
import { ChevronDown, ChevronUp, Heart, MessageCircle, ShoppingCart, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import ChatInterface from "@/components/Chat-interface/Chat-interface"
import { Product } from "./admin-products.page"
import { useNavigate, useParams } from "react-router-dom"
import productSvc from "./products.service"
import { formatNumber } from "@/lib/utils"
import { User } from "@/components/Chat-view/chat-view"
import { CartContext } from "@/context/cart-context"
import { AuthContext } from "@/context/auth-context"
import { toast } from "react-toastify"
import { ProductCard } from "@/components/Product Card/productCard"
import wishListSvc from "../wishlist/wishlist.service"

export default function ProductView() {
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const navigate = useNavigate()
  const [loading] = useState(false)
  const [activeTab] = useState("all")
  const [filledHeart, setiFilledHeart] = useState(false)
  const [wishlistId, setWishListId] = useState<string>('')
  const [relatedProducts, setRelatedProduct] = useState<Product[]>([])

  const { slug } = useParams()
  const cartContext = useContext(CartContext)
  const auth = useContext(AuthContext) as { loggedInUser: any }

  if (!cartContext) {
    return null
  }

  const { addToCart } = cartContext

  const fetchProduct = async () => {
    try {
      const response = await productSvc.fetchProductBySlug(slug as string)
      const fetchedProduct = response.data.detail.product
      setProduct(fetchedProduct)
      
      // Initialize quantity with minOrderQuantity when product is loaded
      const minQty = fetchedProduct?.minOrderQuantity ?? 1
      setQuantity(minQty)
      
      console.log("Fetched Product", fetchedProduct)
      setRelatedProduct(response.data.detail.related)
    } catch (exception) {
      console.log(exception)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [slug])

  // Update quantity when product changes (for navigation between products)
  useEffect(() => {
    if (product) {
      const minQty = product?.minOrderQuantity ?? 1
      setQuantity(minQty)
    }
  }, [product?._id]) // Only trigger when product ID changes

  const addtoWishList = async (id: string) => {
    try {
      const response = await wishListSvc.wishlist(id)
      console.log(response)
      checkWishlist()
      if (response?.data?.status === 'ADD_TO_WISHLIST_SUCCESS') {
        setiFilledHeart(true)
      }
    } catch (exception) {
      console.log(exception)
    }
  }

  const removeFromWishlist = async (id: string) => {
    try {
      const response = await wishListSvc.removeWishlist(id);
      if (response?.data?.status === 'WISHLIST_ITEM_REMOVED') {
        setiFilledHeart(false)
      }
    } catch (error: any) {
      console.error("Error removing from wishlist:", error.response?.data || error.message);
      toast.error("Failed to remove from wishlist. Please try again.");
    }
  };

  const checkWishlist = async () => {
    try {
      const response = await wishListSvc.getMyWishList()
      const wishlist = response.data.detail

      if (product) {
        const wishlistItem = wishlist.find((item: any) => item.productId === product._id);
        if (wishlistItem) {
          setiFilledHeart(true);
          setWishListId(wishlistItem._id);
        }
      }
    } catch (exception) {
      console.log(exception)
    }
  }

  useEffect(() => {
    if (product) {
      checkWishlist();
    }
  }, [product]);

  const descriptionPreview = product ? product?.description?.split("\n\n")[0] : ""

  // Get minimum order quantity for this product
  const minOrderQuantity = product?.minOrderQuantity ?? 1

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Product Images */}
        <div className="lg:col-span-1">
          <div className="mb-4 rounded-lg overflow-hidden border border-border">
            <img
              src={product ? product.images[selectedImage] : "/placeholder.svg"}
              alt={product ? product.title : "Product image"}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {product && product.images.map((image: string, index: number) => (
              <div
                key={index}
                className={`cursor-pointer border-2 rounded-md overflow-hidden ${selectedImage === index ? "border-primary" : "border-border"}`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.title} - view ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{product?.title}</h1>
            <div className="flex items-center mb-2">
              <div className="flex mr-2">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <Star className="h-4 w-4 fill-muted text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">4.0 (128 reviews)</span>
            </div>
            <div className="flex items-center space-x-2">
              {(product?.brand?.title) ? <Badge variant="outline" className="capitalize">
                {product?.brand?.title}
              </Badge> : null}
              {product?.category.map((cat: { _id: string; title: string }) => (
                <Badge key={cat._id} variant="outline">
                  {cat.title}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-3xl font-bold">{product?.actualAmt !== undefined ? formatNumber(product.actualAmt) : "N/A"}</span>
              {(product?.discount ?? 0) > 0 && (
                <>
                  {product && <span className="text-xl text-muted-foreground line-through">{formatNumber(product.price)}</span>}
                  <Badge className="bg-red-500 hover:bg-red-600">{product?.discount}% OFF</Badge>
                </>
              )}
              {(product?.discountOnQuantity ?? 0) > 0 && (
                <>
                  <Badge className="bg-orange-500 hover:bg-orange-600">Get additional {product?.discountOnQuantity}% OFF with each quantity</Badge>
                </>
              )}
            </div>
            <p
              className={`text-sm ${product?.stock ?? 0 > 10 ? "text-green-600" : product?.stock ?? 0 > 0 ? "text-amber-600" : "text-red-600"}`}
            >
              {(product?.stock ?? 0) > 10
                ? "In Stock"
                : (product?.stock ?? 0) > 0
                  ? `Only ${product?.stock} left in stock`
                  : "Out of Stock"}
            </p>
            {minOrderQuantity > 1 && (
              <p className="text-sm text-muted-foreground mt-1">
                Minimum order quantity: {minOrderQuantity}
              </p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center border rounded-md">
                <button
                  className="px-3 py-2 border-r hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setQuantity(Math.max(minOrderQuantity, quantity - 1))}
                  disabled={quantity <= minOrderQuantity}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                <button
                  className="px-3 py-2 border-l hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setQuantity(Math.min(product?.stock ?? 0, quantity + 1))}
                  disabled={quantity >= (product?.stock ?? 0)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <Button 
                className="flex-1" 
                disabled={product?.stock === 0 || loading}
                onClick={() => {
                  if (!auth.loggedInUser) {
                    navigate('/login')
                    toast.info("You need to login first")
                    return
                  }
                  if (auth.loggedInUser.role === 'seller') {
                    toast.info("Access denied for seller")
                    return
                  }
                  if (product?._id) {
                    const id: string = product._id;
                    addToCart(id, quantity); // Use the current quantity state
                  }
                }}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button variant="outline" size="icon" aria-label="Add to wishlist"
                onClick={() => {
                  if (filledHeart === true) {
                    removeFromWishlist(wishlistId)
                  } else {
                    const id: string = product?._id ?? "";
                    addtoWishList(id)
                  }
                }}>
                <Heart className={`h-4 w-4 ${filledHeart ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>

            <div className="space-y-4">
            
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <div className="text-sm text-muted-foreground">
                  <p>{showFullDescription ? product?.description : descriptionPreview}</p>
                  {product?.description && product.description.length > descriptionPreview.length && (
                    <Button
                      variant="link"
                      className="p-0 h-auto mt-2 font-medium flex items-center"
                      onClick={() => setShowFullDescription(!showFullDescription)}
                    >
                      {showFullDescription ? (
                        <>
                          Show less <ChevronUp className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Read more <ChevronDown className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Seller/Shop Information */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={product?.seller?.image || "/placeholder.svg"} alt={product?.seller.name} />
                <AvatarFallback>
                  {product?.seller.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-lg">{product?.seller.name}'s Shop</h3>
                <p className="text-sm text-muted-foreground">Trusted seller since 2020</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.8</span>
                <span className="text-sm text-muted-foreground">(203 reviews)</span>
              </div>
              <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message Seller
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] md:max-w-[600px] w-[95vw]">
                  <DialogHeader>
                    <DialogTitle>Chat with {product?.seller.name}</DialogTitle>
                  </DialogHeader>
                  <ChatInterface seller={{ ...product?.seller, role: "seller" } as User} onClose={() => setIsChatOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-10" />

      {/* Related Products */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.map((product: Product, index: number) => (
            <ProductCard
              onClick={product.slug}
              key={`related-${product._id}-${index}`}
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
      </div>
    </div>
  )
}
