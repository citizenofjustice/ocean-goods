import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="content-scroll main-abs">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
