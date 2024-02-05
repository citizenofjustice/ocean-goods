import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main id="main-content" className="main-abs">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
