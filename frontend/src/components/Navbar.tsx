import MobileNavbar from "@/components/navbars/MobileNavbar";
import { useMediaQuery } from "react-responsive"; // 또는 custom hook 사용

const Navbar = () => {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1023 });

    if (isMobile) return <MobileNavbar />;
};

export default Navbar;