import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main id="main-content" className="main-abs mx-1 my-4">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
