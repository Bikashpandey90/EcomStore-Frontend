import type React from "react"
import { useContext, useEffect, useState } from "react"
import {
    ArrowRight,
    Box,
    CreditCard,
    Gift,
    Heart,
    History,
    MessageSquare,
    Settings,
    ShoppingCart,
    Star,
    Truck,
    User,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { NavLink, useNavigate } from "react-router-dom"
import { AuthContext } from "@/context/auth-context"
import productSvc from "../products/products.service"
import { Product } from "../products/admin-products.page"
import { ProductCard } from "@/components/Product Card/productCard"
import orderSvc from "../orders/order.service"
import { formatDateTOYMD, formatNumber } from "@/lib/utils"
interface Buyer {
    _id: string;
    name: string;
    email: string;
    phone: string;
}

interface Order {
    _id: string;
    buyer: Buyer;
    orderDate: string;
    subTotal: number;
    discount: number;
    tax: number;
    serviceCharge: number;
    deliveryCharge: number;
    total: number;
    status: string;
    createdBy: string | null;
    updatedBy: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
}



export default function CustomerDashboard() {
    const auth = useContext(AuthContext) as { loggedInUser: any }
    const navigate = useNavigate()
    const [recommendations, setRecommendations] = useState<Product[]>([])
    const [orders, setOrder] = useState<Order[]>([])

    const fetchRecommendations = async () => {
        try {
            const response = await productSvc.getProductForHome(1)
            setRecommendations(response.data.detail)

        } catch (exception) {
            console.log(exception)
        }
    }
    useEffect(() => {
        fetchRecommendations()
    }, [])

    const fetchOrders = async () => {
        try {
            const response = await orderSvc.getMyOrders()
            setOrder(response.data.detail)


        } catch (exception) {
            console.log(exception)
        }
    }
    useEffect(() => {
        fetchOrders()
    }, [])


    return (

        < div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8" >
            {/* Welcome Section */}
            < div className="mb-6" >
                <h1 className="text-2xl font-bold tracking-tight">Hello, {auth.loggedInUser?.name.split(' ')[0]}</h1>
                <p className="text-muted-foreground">Welcome back to your dashboard</p>
            </div >

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Recent Orders */}
                <Card className="col-span-full lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                            <CardTitle className="text-xl">Recent Orders</CardTitle>
                            <CardDescription>Track your recent purchases</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-1"
                            onClick={() => {
                                navigate('/orders')
                            }}>
                            View all orders <ArrowRight className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {
                                orders.slice(0, 3).map((order, index) => (
                                    <div>
                                        <OrderItem
                                            key={index}
                                            id={order._id}
                                            date={order.orderDate}
                                            status={order.status}
                                            items={2}
                                            total={order.subTotal}
                                            image="/placeholder.svg?height=80&width=80"
                                        />
                                        <Separator />
                                    </div>

                                ))
                            }


                        </div>
                    </CardContent>
                </Card>

                {/* Account Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Account</CardTitle>
                        <CardDescription>Manage your account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                {
                                    auth.loggedInUser?.image ? <img src={auth.loggedInUser.image} className="h-full w-full object-cover rounded-full" /> : <User className="h-5 w-5 text-primary" />
                                }
                            </div>
                            <div>
                                <p className="font-medium">{auth.loggedInUser.name}</p>
                                <p className="text-sm text-muted-foreground">{auth.loggedInUser.email}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Payment Methods</span>
                                </div>
                                <Badge variant="outline">3</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Truck className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Shipping Addresses</span>
                                </div>
                                <Badge variant="outline">2</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Communication Preferences</span>
                                </div>
                                <Button variant="ghost" size="sm" className="h-6 px-2">
                                    Edit
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full"
                            onClick={() => {
                                navigate('/manage-account')
                            }}>
                            <Settings className="mr-2 h-4 w-4" />
                            Manage Account
                        </Button>
                    </CardFooter>
                </Card>

                {/* Quick Actions */}
                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle className="text-xl">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            <QuickAction icon={ShoppingCart} label="Buy Again" />
                            <QuickAction icon={Heart} label="Lists" />
                            <QuickAction icon={Gift} label="Gift Cards" />
                            <QuickAction icon={History} label="Browsing History" />
                            <QuickAction icon={Star} label="Reviews" />
                            <QuickAction icon={Box} label="Returns" />
                        </div>
                    </CardContent>
                </Card>

                {/* Recommendations */}
                <Card className="col-span-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                            <CardTitle className="text-xl">Recommended For You</CardTitle>
                            <CardDescription>Based on your recent purchases</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-1">
                            View all <ArrowRight className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {/* //Product card */}
                            {
                                recommendations.map((product, index) => (
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

                                    />))
                            }

                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >

    )
}

interface OrderItemProps {
    id: string
    date: string
    status: string
    items: number
    total: number
    image: string
    estimatedDelivery?: string
}

function OrderItem({ id, date, status, items, total, estimatedDelivery }: OrderItemProps) {
    const navigate = useNavigate()
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Delivered":
                return "bg-green-100 text-green-800"
            case "Shipped":
                return "bg-blue-100 text-blue-800"
            case "Processing":
                return "bg-yellow-100 text-yellow-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getProgressValue = (status: string) => {
        switch (status) {
            case "Delivered":
                return 100
            case "Shipped":
                return 66
            case "Processing":
                return 33
            default:
                return 0
        }
    }

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="shrink-0">
                {/* <img src={image || "/placeholder.svg"} alt="Product" width={80} height={80} className="rounded-md border" /> */}
                <Box className="rounded-md border w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <div className="font-medium">Order #{id}</div>
                    <div className="text-sm text-muted-foreground">{formatDateTOYMD(date)}</div>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(status)}`}
                    >
                        {status}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {items} item{items > 1 ? "s" : ""}
                    </span>
                </div>
                {estimatedDelivery && (
                    <div className="text-sm">
                        Estimated delivery: <span className="font-medium">{estimatedDelivery}</span>
                    </div>
                )}
                <Progress value={getProgressValue(status)} className="h-1.5" />
            </div>
            <div className="flex items-center gap-4">
                <div className="font-medium">Nrs {formatNumber(total)}</div>
                <Button variant="outline" size="sm"
                    onClick={() => {
                        navigate('/order-detail/' + id)
                    }}>
                    Details
                </Button>
            </div>
        </div>
    )
}

interface QuickActionProps {
    icon: React.ElementType
    label: string
}

function QuickAction({ icon: Icon, label }: QuickActionProps) {
    return (
        <NavLink
            to="#"
            className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-accent hover:text-accent-foreground"
        >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium">{label}</span>
        </NavLink>
    )
}



