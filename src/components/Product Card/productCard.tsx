import { Heart, ShoppingCart, Star } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import orderSvc from "@/pages/orders/order.service";
import { AuthContext } from "@/context/auth-context";
import { toast } from "react-toastify";
import { Badge } from "../ui/badge";
import { CartContext } from "@/context/cart-context";

export function ProductCard({
  name,
  image,
  price,
  originalPrice,
  rating,
  reviews,
  discount,
  isNew,
  isFeatured,
  isBestseller,
  onClick,
  productId
}: any) {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const auth = useContext(AuthContext) as { loggedInUser: any }
  const cartContext = useContext(CartContext)

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

    } catch (exception) {
      console.log(exception)
    } finally {
      setLoading(false)
    }
  }


  return (


    <Card className="overflow-hidden h-full group">
      <CardContent className="p-0">
        <div className="relative">
          <div className="aspect-square relative overflow-hidden">
            <img
              onClick={() => {
                navigate(`/products/${onClick}`)
              }}
              src={image || "/placeholder.svg"}
              alt={name}

              className="object-cover transition-transform group-hover:scale-110 h-full w-full"
            />
          </div>
          {discount > 0 && <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">{discount}% off</Badge>}
          {isNew && <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">New</Badge>}
          {isFeatured && <Badge className="absolute top-2 left-2 bg-purple-500 hover:bg-purple-600">Featured</Badge>}
          {isBestseller && <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">Bestseller</Badge>}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
              <Heart className="h-4 w-4" />
              <span className="sr-only">Add to wishlist</span>
            </Button>

          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 translate-y-full group-hover:translate-y-0 transition-transform">
            <Button className="w-full gap-2"
              disabled={loading}

              onClick={() => {
                console.log("Logged in user:", auth.loggedInUser);



                if (auth.loggedInUser === null) {
                  navigate('/login')
                  toast.info("You need to login first!")
                  return
                }
                if (auth.loggedInUser.role === 'seller') {
                  toast.info("Acess denied for seller")
                  return
                }

                if (productId) {
                  const id: string = productId;
                  const quantity = 1;
                  addToCart(id, quantity);
                  return
                }

              }}

            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium line-clamp-2 min-h-[2.5rem]">{name}</h3>
          <div className="flex items-center gap-1 mt-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : i < rating ? "text-yellow-400 fill-yellow-400 stroke-yellow-400" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({reviews})</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-bold">Nrs {price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-muted-foreground line-through text-sm">Nrs {originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>);

}