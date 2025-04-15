
// components/Layout.jsx
import React from "react";
import ScrollToTop from "@/utils/scrollToTop";

const Layout = ({ children }) => {
  return (
    <>
      <ScrollToTop />
      {children}
    </>
  );
};

export default Layout;
