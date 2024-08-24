import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function SuggestedUsers() {
  const { suggestedUsers } = useSelector((store) => store.auth);
  return (
    <div className="my-10">
      <div className="flex items-center text-sm gap-2">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>

      <div>
        {suggestedUsers.map((user) => (
          <div
            key={user._id}
            className="my-5 flex items-center justify-between gap-3"
          >
            <Link to={`/profile/${user._id}`} className="flex gap-3 ">
              <Avatar>
                <AvatarImage src={user.profilePic} alt={user.username} />
                <AvatarFallback>
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="text-sm">
                <h1 className="font-bold ">{user.username}</h1>
                <span className=" text-gray-600">
                  {user.bio || "bio here.."}
                </span>
              </div>
            </Link>
            <span className="text-[#3badf8] cursor-pointer text-xs font-bold hover:text-[#3495d6]">
              Follow
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuggestedUsers;
