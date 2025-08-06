import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import { ShoppingCart, X } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { CartContext } from "@/context/cart-context";
import { formatNumber } from "@/lib/utils";


export interface Buyer {
    _id: string;
    name: string;
    email: string;
    image: string;
    phone: string;
    address: string;
}

export interface Product {
    _id: string;
    title: string;
    slug: string;
    price: number;
    discount: number;
    actualAmt: number;
    images: any;
    minOrderQuantity?: number
}

export interface Cart {
    _id: string;
    orderId: string | null;
    buyer: Buyer;
    product: Product;
    price: number;
    quantity: number;
    totalAmt: number;
    status: string;
    seller: string;
    createdBy: string;
    updatedBy: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
}


const ShoppingCartPopover = () => {
    const auth = useContext(AuthContext) as { loggedInUser: any }

    const cartContext = useContext(CartContext)
    if (!cartContext) {
        return null
    }


    // const handleRemove = async (cartId: string, quantity: number) => {
    //     try {
    //         console.log("function initiated")

    //         const response = await orderSvc.removeItemFromCart(cartId, quantity)
    //         return response
    //     } catch (exception) {
    //         console.log(exception)
    //     }

    // }

    const { carts, removeItemFromCart } = cartContext
    const cartCount = carts.length

    return (
        <Popover >
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                    <span className="sr-only">Cart</span>
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 bg-slate-50 z-20 rounded-lg p-5 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)]" align="end">
                <div className="grid gap-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-medium">Shopping Cart ({cartCount})</h4>
                        {
                            auth.loggedInUser ?
                                <NavLink to="/my-cart" className="text-sm text-primary hover:underline">
                                    View Full Cart
                                </NavLink> :
                                <NavLink to="/login" className="text-sm text-primary hover:underline">
                                    View Full Cart
                                </NavLink>

                        }
                    </div>
                    <div className="space-y-3">
                        {carts.map((item, index) => (
                            <div key={index} className="flex gap-3">
                                <div className="flex h-12 w-12 ">
                                    <img
                                        src={item.product.images[0] || "/placeholder.svg"}
                                        alt={item.product.title}
                                        width={60}
                                        height={60}
                                        className="rounded object-cover "
                                    />
                                </div>
                                <div className="flex-1">
                                    <h5 className="font-medium text-sm">{item.product.title}</h5>
                                    <div className="text-sm text-muted-foreground">
                                        {item.quantity} × Nrs {formatNumber(item.product.actualAmt)}
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8"

                                    onClick={() => {
                                        const quantity = item.quantity
                                        removeItemFromCart(item._id, quantity)
                                        console.log("clicked")
                                    }}



                                >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Remove</span>
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-3">
                        {
                            auth.loggedInUser ?
                                <div className="flex justify-between mb-3">
                                    <span>Subtotal:</span>
                                    <span className="font-medium">{formatNumber(carts.reduce((total, cart) => {
                                        return total + cart.product.actualAmt * cart.quantity;
                                    }, 0))}</span>
                                </div>
                                : <></>
                        }
                        <div className="grid gap-2">
                            {auth.loggedInUser ?
                                <Button asChild>
                                    <NavLink to="/my-cart">Checkout</NavLink>
                                </Button>
                                : <Button asChild>
                                    <NavLink to="/login">Login</NavLink>
                                </Button>

                            }
                        </div>
                    </div>
                </div>
            </PopoverContent>

        </Popover>

    );
};

export default ShoppingCartPopover;
