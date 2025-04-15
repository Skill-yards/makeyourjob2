
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant", // or "smooth" if you want a transition
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
