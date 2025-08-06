import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { NavLink, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { Button } from "../ui/button"
import { ChevronDown, Globe, Heart, Mail, MapPin, Menu, Phone, ShoppingCart, User, Search } from "lucide-react"
import { AuthContext } from "@/context/auth-context"
import ShoppingCartPopover from "../Shopping Cart PopOver/shopping-cart"
import SearchBar from "../header-check/search-bar"
import { toast } from "react-toastify"


const HomeHeaderNew = () => {

    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
    const navigate = useNavigate()


    const auth = useContext(AuthContext) as { loggedInUser: any }
    // Handle scroll for sticky header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 80)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])



    const LogOut = () => {
        try {
            localStorage.removeItem('token')
            localStorage.removeItem('refToken');
            navigate('/')
            auth.loggedInUser = null
            toast.info("Logged out")

        } catch (exception) {
            console.error("Error logging out:", exception);
        }
    }



    return (<>

        <div className="bg-primary text-primary-foreground py-2 text-sm hidden md:block">
            <div className="container flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>+1 (888) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>support@ecomstore.com</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>Kathmandu,Nepal</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="link" size="sm" className="text-primary-foreground p-0 h-auto">
                                <Globe className="h-3 w-3 mr-1" /> English <ChevronDown className="h-3 w-3 ml-1" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>English</DropdownMenuItem>
                            <DropdownMenuItem>Spanish</DropdownMenuItem>
                            <DropdownMenuItem>French</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="link" size="sm" className="text-primary-foreground p-0 h-auto">
                                USD <ChevronDown className="h-3 w-3 ml-1" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>USD</DropdownMenuItem>
                            <DropdownMenuItem>EUR</DropdownMenuItem>
                            <DropdownMenuItem>GBP</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>

        <header className={`bg-background border-b z-40 ${isScrolled ? "sticky top-0 shadow-md" : ""}`}>
            <div className="container py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden mr-2">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
                                <SheetHeader className="border-b p-4">
                                    <SheetTitle>Menu</SheetTitle>
                                </SheetHeader>
                                <div className="py-4 overflow-y-auto h-full">
                                    <div className="px-4 mb-4">
                                        <SearchBar />
                                        {/* <Input placeholder="Search products..." className="w-full" /> */}
                                    </div>
                                    <nav className="space-y-1">
                                        {[
                                            { name: "Home", to: "/" },
                                            { name: "Shop", to: "/shop" },
                                            { name: "Categories", to: "/categories" },
                                            { name: "Deals", to: "/deals" },
                                            { name: "New Arrivals", to: "/new" },
                                            { name: "Brands", to: "/brands" },
                                            { name: "Blog", to: "/blog" },
                                            { name: "Contact", to: "/contact" },
                                        ].map((item, index) => (
                                            <NavLink
                                                key={index}
                                                to={item.to}
                                                className="flex items-center py-3 px-4 hover:bg-muted"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {item.name}
                                            </NavLink>
                                        ))}
                                    </nav>
                                    <div className="border-t mt-4 pt-4 px-4 space-y-4">
                                        <NavLink to="/" className="flex items-center gap-2 py-2">
                                            <User className="h-4 w-4" />
                                            My Account
                                        </NavLink>
                                        <NavLink to="/orders" className="flex items-center gap-2 py-2">
                                            <ShoppingCart className="h-4 w-4" />
                                            My Orders
                                        </NavLink>
                                        <NavLink to="/wishlist" className="flex items-center gap-2 py-2">
                                            <Heart className="h-4 w-4" />
                                            Wishlist
                                        </NavLink>
                                        <div className="pt-4 border-t">
                                            <div className="flex items-center gap-3 py-2">
                                                <Phone className="h-4 w-4" />
                                                +1 (888) 123-4567
                                            </div>
                                            <div className="flex items-center gap-3 py-2">
                                                <Mail className="h-4 w-4" />
                                                support@ecomstore.com
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                        <NavLink to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                                E
                            </div>
                            <span className="text-xl font-bold hidden sm:inline-block">EcomStore</span>
                        </NavLink>
                    </div>

                    {/* Search */}
                    <div className="hidden md:flex flex-1 max-w-md mx-4">
                        <SearchBar />
                        {/* <div className="relative w-full">
                            <Input placeholder="Search for products..." className="w-full pl-10 pr-4 py-2 rounded-full" />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div> */}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Button variant="ghost" size="icon" className="hidden sm:flex" asChild>
                            <NavLink to="/search">
                                <Search className="h-5 w-5" />
                                <span className="sr-only">Search</span>
                            </NavLink>
                        </Button>

                        {auth.loggedInUser && auth.loggedInUser.role === 'seller' ? <></> : <ShoppingCartPopover />}

                        <Button variant="ghost" size="icon" asChild>
                            <NavLink to="/wishlist">
                                <Heart className="h-5 w-5" />
                                <span className="sr-only">Wishlist</span>
                            </NavLink>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={() => {
                                if (auth.loggedInUser) {
                                    return
                                } else {
                                    navigate('/login')
                                }
                            }}>
                                <Button variant="ghost" size="icon">
                                    {auth.loggedInUser ? <img src={auth.loggedInUser.image} className="h-8 w-8 rounded-full border-none object-cover" /> : <User className="h-5 w-5" />}
                                    <span className="sr-only">Account</span>
                                </Button>
                            </DropdownMenuTrigger>
                            {
                                auth.loggedInUser && (
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <NavLink to={auth.loggedInUser ? auth.loggedInUser.role : 'login'}>Profile</NavLink>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <NavLink to="/orders">Orders</NavLink>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <NavLink to="/chat">Chats</NavLink>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>

                                            {/* <NavLink to={auth.loggedInUser ? '' : '/login'}>
                                                {auth.loggedInUser ? "Sign out" : "Sign In"}
                                            </NavLink> */}
                                            <Button variant='ghost' onClick={
                                                () => {
                                                    auth.loggedInUser ? LogOut() : navigate('/login')
                                                }
                                            }>
                                                {auth.loggedInUser ? 'Sign Out' : "Sign In"}
                                            </Button>

                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                )
                            }

                        </DropdownMenu>


                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="border-t hidden md:block">
                <div className="container">
                    <ul className="flex">
                        {[
                            { name: "Home", to: "/" },
                            {
                                name: "Categories",
                                to: "/categories",
                                megaMenu: true,
                                id: "categories",
                            },
                            { name: "Deals", to: "/deals" },
                            { name: "New Arrivals", to: "/new" },
                            { name: "Brands", to: "/brands" },
                            { name: "Clearance", to: "/clearance" },
                            { name: "Blog", to: "/blog" },
                            { name: "Contact", to: "/contact" },
                        ].map((item, index) => (
                            <li key={index} className="relative group">
                                {item.megaMenu ? (
                                    <>
                                        <button
                                            className="flex items-center gap-1 py-3 px-4 hover:text-primary border-b-2 border-transparent hover:border-primary"
                                            onMouseEnter={() => setActiveMegaMenu(item.id)}
                                            onClick={() => setActiveMegaMenu(activeMegaMenu === item.id ? null : item.id)}
                                        >
                                            {item.name} <ChevronDown className="h-4 w-4" />
                                        </button>
                                        {activeMegaMenu === item.id && (
                                            <div
                                                className="absolute left-0 w-full bg-background shadow-lg border rounded-b-lg p-6 z-50"
                                                style={{ width: "800px" }}
                                                onMouseLeave={() => setActiveMegaMenu(null)}
                                            >
                                                <div className="grid grid-cols-4 gap-6">
                                                    <div>
                                                        <h3 className="font-bold mb-3">Electronics</h3>
                                                        <ul className="space-y-2">
                                                            <li>
                                                                <NavLink to="/category/smartphones" className="text-muted-foreground hover:text-primary">
                                                                    Smartphones
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/laptops" className="text-muted-foreground hover:text-primary">
                                                                    Laptops
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/tablets" className="text-muted-foreground hover:text-primary">
                                                                    Tablets
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/headphones" className="text-muted-foreground hover:text-primary">
                                                                    Headphones
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/cameras" className="text-muted-foreground hover:text-primary">
                                                                    Cameras
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/smart-watches" className="text-muted-foreground hover:text-primary">
                                                                    Smart Watches
                                                                </NavLink>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold mb-3">Fashion</h3>
                                                        <ul className="space-y-2">
                                                            <li>
                                                                <NavLink to="/category/mens-clothing" className="text-muted-foreground hover:text-primary">
                                                                    Men's Clothing
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/womens-clothing" className="text-muted-foreground hover:text-primary">
                                                                    Women's Clothing
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/shoes" className="text-muted-foreground hover:text-primary">
                                                                    Shoes
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/accessories" className="text-muted-foreground hover:text-primary">
                                                                    Accessories
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/jewelry" className="text-muted-foreground hover:text-primary">
                                                                    Jewelry
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/watches" className="text-muted-foreground hover:text-primary">
                                                                    Watches
                                                                </NavLink>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold mb-3">Home & Kitchen</h3>
                                                        <ul className="space-y-2">
                                                            <li>
                                                                <NavLink to="/category/furniture" className="text-muted-foreground hover:text-primary">
                                                                    Furniture
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/appliances" className="text-muted-foreground hover:text-primary">
                                                                    Appliances
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/cookware" className="text-muted-foreground hover:text-primary">
                                                                    Cookware
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/bedding" className="text-muted-foreground hover:text-primary">
                                                                    Bedding
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/decor" className="text-muted-foreground hover:text-primary">
                                                                    Decor
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/lighting" className="text-muted-foreground hover:text-primary">
                                                                    Lighting
                                                                </NavLink>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="row-span-2">
                                                        <div className="relative h-full min-h-[200px] rounded-lg overflow-hidden">
                                                            <img
                                                                src="https://thevishnu.in/cdn/shop/articles/blog1_vishnu_1080x.png?v=1718008804"
                                                                alt="Featured Category"
                                                                className="object-cover h-full w-full"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                                                                <h3 className="text-white font-bold mb-2">Summer Collection</h3>
                                                                <Button size="sm" variant="secondary">
                                                                    Shop Now
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold mb-3">Beauty & Health</h3>
                                                        <ul className="space-y-2">
                                                            <li>
                                                                <NavLink to="/category/skincare" className="text-muted-foreground hover:text-primary">
                                                                    Skincare
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/makeup" className="text-muted-foreground hover:text-primary">
                                                                    Makeup
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/hair-care" className="text-muted-foreground hover:text-primary">
                                                                    Hair Care
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/fragrances" className="text-muted-foreground hover:text-primary">
                                                                    Fragrances
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/personal-care" className="text-muted-foreground hover:text-primary">
                                                                    Personal Care
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/health-supplements" className="text-muted-foreground hover:text-primary">
                                                                    Health Supplements
                                                                </NavLink>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold mb-3">Sports & Outdoors</h3>
                                                        <ul className="space-y-2">
                                                            <li>
                                                                <NavLink to="/category/exercise-equipment" className="text-muted-foreground hover:text-primary">
                                                                    Exercise Equipment
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/outdoor-recreation" className="text-muted-foreground hover:text-primary">
                                                                    Outdoor Recreation
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/sports-apparel" className="text-muted-foreground hover:text-primary">
                                                                    Sports Apparel
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/team-sports" className="text-muted-foreground hover:text-primary">
                                                                    Team Sports
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/camping-hiking" className="text-muted-foreground hover:text-primary">
                                                                    Camping & Hiking
                                                                </NavLink>
                                                            </li>
                                                            <li>
                                                                <NavLink to="/category/water-sports" className="text-muted-foreground hover:text-primary">
                                                                    Water Sports
                                                                </NavLink>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <NavLink
                                        to={item.to}
                                        className="flex items-center py-3 px-4 hover:text-primary border-b-2 border-transparent hover:border-primary"
                                    >
                                        {item.name}
                                    </NavLink>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    </>)
}

export default HomeHeaderNew