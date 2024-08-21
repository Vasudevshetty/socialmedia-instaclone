import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function MainLayout() {
  return (
    <div>
      <Sidebar />
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
