import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";

import Navbar from "@/components/Layouts/Navbar";
import { useStore } from "@/store/root-store-context";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import PopupMessageBlock from "@/components/UI/PopupMessageBlock";

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
