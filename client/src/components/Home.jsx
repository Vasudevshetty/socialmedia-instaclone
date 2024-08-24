import { Outlet } from "react-router-dom";
import Feed from "./Feed";
import RightSideBar from "./RightSidebar";
import useGetAllPosts from "@/hooks/useGetAllPosts";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";

function Home() {
  useGetAllPosts();
  useGetSuggestedUsers();

  return (
    <div className="flex">
      <div className="flex-grow w-4/5">
        <Feed />
        <Outlet />
      </div>
      <RightSideBar />
    </div>
  );
}

export default Home;
