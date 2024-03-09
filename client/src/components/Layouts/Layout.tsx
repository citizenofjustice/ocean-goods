import { observer } from "mobx-react-lite";
import PopupMessageBlock from "../UI/PopupMessageBlock";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useStore } from "../../store/root-store-context";
import { Suspense } from "react";
import LoadingSpinner from "../UI/LoadingSpinner";

const Layout = observer(() => {
  const { alert } = useStore();
  const { popup } = alert;

  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingSpinner />}>
        <main className="content-scroll main-abs">
          <Outlet />
          {popup && (
            <div className="fixed bottom-[2rem] w-full">
              <PopupMessageBlock
                popup={popup}
                onClose={() => alert.clearPopup()}
              />
            </div>
          )}
        </main>
      </Suspense>
    </>
  );
});

export default Layout;
