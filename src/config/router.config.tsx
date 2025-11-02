import { AuthProvider } from "@/context/auth-context";
import AboutUs from "@/pages/about-us/about-us.pae";
import LoginPage from "@/pages/auth/login-page";
import RegisterPage from "@/pages/auth/register-page";
import NotFound from "@/pages/errors/not-found.page";
import AdminPage from "@/pages/layout/admin-page.layout";
import HomePageLayout from "@/pages/layout/home-page.layout";
import { FC, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import AdminDashBoard from "@/components/AdminDashboard/dashboard";
import BannerList from "@/pages/banner/banner-list";
import BannerDetailsPage from "@/pages/banner/bannerdetailpage";
import PermissionCheck from "@/config/permission.config";
import AdminProfile from "@/pages/layout/admin-profile";
import AdminSettings from "@/pages/layout/admin-settings";
import CustomerListPage from "@/pages/customers/customers-listpage";
import BrandsPage from "@/pages/brand/brand-list";
import BrandDetailsPage from "@/pages/brand/brandDetailPage";
import { Chat } from "@/pages/layout/admin-chat-page";
import CategorysPage from "@/pages/category/category-list";
import AdminProductsPage from "@/pages/products/admin-products.page";
import SellerDashboard from "@/pages/seller/seller-dashboard";
import MainContent from "@/pages/seller/main-content";
import SellerProfile from "@/pages/seller/seller-profile";
import ProductDetail from "@/components/seller-dashboard-components/product-detailpage";
import HomePageDraft from "@/pages/home/homepage-draft";
import ProductPage from "@/pages/products/full-productView";
import CategoryListPage from "@/pages/category/fetch-by-category";
import BrandProductListing from "@/pages/brand/brand-fetchProduct";
import CartPage from "@/pages/orders/cart-fullpage";
import EsewaCheckoutPage from "@/pages/orders/checkout";
import OrderListing from "@/pages/layout/admin-orderlisting";
import PaymentSuccess from "@/pages/orders/paymentSucess";
import CustomerDashboard from "@/pages/customer/customer-dashboard";
import ManageAccount from "@/pages/customer/manage-account";
import OrdersPage from "@/pages/seller/order-page";
import PaymentFailure from "@/pages/orders/payment-failure";
import OrderDetailPage from "@/pages/orders/order-detail-page";
import CustomerOrderDetailPage from "@/pages/customers/customer-order-detail";
import CategoryDetailsPage from "@/pages/category/categoryDetailPage";
import BrandsListingPage from "@/pages/brand/brand-listing";
import WishlistPage from "@/pages/customers/customer-wishlist";
import BlogPage from "@/pages/blog/blog";
import CustomerOrderListing from "@/pages/customer/orders-page";
import NewLandingPage from "@/pages/new-home/page";
import NewProductPage from "@/pages/new-home/product-page";
import ListPage from "@/pages/new-home/list-page";
import MainHome from "@/pages/new-home/mainpage";



const Routing: FC = () => {
    const router = createBrowserRouter([
        {
            path: "",
            element: <HomePageLayout />,
            children: [
                {
                    index: true,
                    element: <HomePageDraft />,
                },
                {
                    path: "\about-us",
                    element: <AboutUs />,
                },
                // {
                //     path: "category/:slug",
                //     element: <CategoryDetailPage />

                // },
                {
                    path: 'search',
                    element: <CategoryListPage />

                },
                {
                    path: "*", //wildcard error pages 404
                    element: <NotFound />,
                },
                {
                    path: "/login",
                    element: <LoginPage />,
                }, {
                    path: "/register",
                    element: <RegisterPage />,
                },
                {
                    path: "products/:slug",
                    element: <ProductPage />

                }, {
                    path: 'category/:slug',
                    element: <CategoryListPage />
                }, {
                    path: 'brand/:slug',
                    element: <BrandProductListing />
                }, {
                    path: "my-cart",
                    element: <CartPage />
                }, {
                    path: "chat",
                    element: <Chat />
                }, {
                    path: 'checkout',
                    element: <EsewaCheckoutPage />

                }, {
                    path: 'payment-success',
                    element: <PaymentSuccess />
                }
                ,
                {
                    path: 'payment-failure',
                    element: <PaymentFailure />
                }
                ,
                {
                    path: 'brands',
                    element: <BrandsListingPage />


                }, {
                    path: 'orders',
                    element: <CustomerOrderListing />

                }, {
                    path: '/customer',
                    element: <PermissionCheck allowedRole="customer">
                        <CustomerDashboard />
                    </PermissionCheck>,
                    children: [
                        {
                            index: true,
                            element: <CustomerDashboard />
                        },


                    ]
                }, {
                    path: 'order-detail/:id',
                    element: <CustomerOrderDetailPage />

                }, {
                    path: '/manage-account',
                    element: <PermissionCheck allowedRole="customer">
                        <ManageAccount />
                    </PermissionCheck>

                }, {
                    path: 'wishlist',
                    element: <WishlistPage />
                    //  <PermissionCheck allowedRole="customer">
                    //     <WishlistPage />
                    // </PermissionCheck>

                }, {
                    path: 'blog',
                    element: <BlogPage />
                }
            ]
        },

        {
            path: "/admin",
            element: <PermissionCheck allowedRole="admin">
                <AdminPage />
            </PermissionCheck>,
            children: [
                {
                    index: true,
                    element: <AdminDashBoard />

                }, {
                    path: "products",
                    element: <AdminProductsPage />

                }, {
                    path: "products/:id",
                    element: <ProductDetail />
                },
                {
                    path: "profile",
                    element: <AdminProfile />

                },
                {
                    path: "settings",
                    element: <AdminSettings />

                },
                {
                    path: "banners",
                    element: <BannerList />,

                },
                {
                    path: "brand",
                    element: <BrandsPage />,

                },
                {
                    path: "category",
                    element: <CategorysPage />,

                },
                {
                    path: "category/:id",
                    element: <CategoryDetailsPage />,

                },
                {
                    path: "brand/:id",
                    element: <BrandDetailsPage />

                },
                {
                    path: "banner/:id",
                    element: <BannerDetailsPage />

                },

                {
                    path: "chat",
                    element: <Chat />

                }, {
                    path: "order",
                    element: <OrderListing />
                },
                {
                    path: "order-detail/:id",
                    element: <OrderDetailPage />
                },
                {
                    path: "*", //wildcard error pages 404
                    element: <NotFound />,
                }, {
                    path: "customers",
                    element: <CustomerListPage />
                    // element:<CustomerProfile params={{ id: '' }} />
                }
            ]

        }, {
            path: "/seller",
            element: <PermissionCheck allowedRole="seller">
                <SellerDashboard />
            </PermissionCheck>,
            children: [
                {
                    index: true,
                    element: <MainContent />
                }, {
                    path: "orders",
                    element: <OrdersPage />
                },
                {
                    path: "order-detail/:id",
                    element: <OrderDetailPage />
                }, {
                    path: "chat",
                    element: <Chat />
                }, {
                    path: "profile",
                    element: <SellerProfile />
                },
                {
                    path: "customers",
                    element: <CustomerListPage />
                },
                {
                    path: "products/:id",
                    element: <ProductDetail />
                }


            ]

        },


        {
            path: "/customer",
            element: <PermissionCheck allowedRole="customer">
                <AdminPage />
            </PermissionCheck>,



        },





    ]);

    const [queryClient] = useState(() => new QueryClient());





    return <>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ToastContainer theme="colored" />

                <RouterProvider router={router} />
            </AuthProvider>

        </QueryClientProvider>

    </>;
}

export default Routing;