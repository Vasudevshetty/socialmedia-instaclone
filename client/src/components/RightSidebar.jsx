import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

function RightSidebar() {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="w-1/4 my-5 p-14">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user._id}`}>
          <Avatar>
            <AvatarImage src={user.profilePic} alt={user.username} />
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className="text-sm font-semibold">
            <Link to={`/profile/${user._id}`}>{user.username}</Link>
          </h1>
          <span className="text-gray-600 text-sm">
            {user.bio || "bio here"}
          </span>
        </div>
      </div>
      <SuggestedUsers />
    </div>
  );
}

export default RightSidebar;
