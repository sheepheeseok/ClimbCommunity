import MobileNavbar from "@/components/navbars/MobileNavbar";
import { useMediaQuery } from "react-responsive"; // 또는 custom hook 사용
import PCNavBar from "./navbars/PCNavBar";

const Navbar = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1023 });
  const isPc = useMediaQuery({ minWidth: 1024 });

  if (isMobile) return <MobileNavbar />;
  if (isPc) return <PCNavBar />;
};

export default Navbar;