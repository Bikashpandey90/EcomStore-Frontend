import HomeFooter from "@/components/footer/home-footer.component";
import HomeHeaderNew from "@/components/header/new-homeheader";
import { ScrollToTop } from "@/components/SmoothScroll/ScrollToTop";
import { Outlet } from "react-router-dom";

const HomePageLayout = () => {
    return <>
        <HomeHeaderNew />
        <ScrollToTop />
        <Outlet />
        <HomeFooter />
    </>;


}
export default HomePageLayout;