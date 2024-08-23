import { Outlet } from "react-router-dom";
import Feed from "./Feed";
import RightSideBar from "./RightSidebar";
import useGetAllPosts from "@/hooks/useGetAllPosts";

function Home() {
  useGetAllPosts();
  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightSideBar />
    </div>
  );
}

export default Home;
