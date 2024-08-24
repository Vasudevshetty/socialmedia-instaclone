import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { useState } from "react";

function Profile() {
  const { id } = useParams();
  useGetUserProfile(id);
  const { userProfile, user } = useSelector((store) => store.auth);
  const [activeTab, setActiveTab] = useState("posts");

  const isLoggedInUserProfile = userProfile._id === user._id;
  const isFollowed = user.following.includes(userProfile._id);
  const navigate = useNavigate();

  const toDisplayPosts =
    activeTab === "posts" ? userProfile.posts : userProfile.bookmarks;

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={userProfile.profilePic}
                alt={userProfile.username}
              />
              <AvatarFallback>
                {userProfile.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                      onClick={() => navigate("/account/edit")}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      View Archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Ad Tools
                    </Button>
                  </>
                ) : !isFollowed ? (
                  <Button className="bg-[#0096f6] hover:bg-[#3192d2] text-white font-bold h-8">
                    Follow
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Unfollow
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Message
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <p className="flex gap-1 items-center">
                <span className="font-semibold">
                  {userProfile.posts.length}
                </span>
                <span>posts</span>
              </p>
              <p className="flex gap-1 items-center">
                <span className="font-semibold">
                  {userProfile.followers.length}
                </span>
                <span>followers</span>
              </p>
              <p className="flex gap-1 items-center">
                <span className="font-semibold">
                  {userProfile.following.length}
                </span>
                <span>following</span>
              </p>
            </div>
            <div className="flex my-2 flex-col gap-2">
              <span className="font-semibold">
                {userProfile.bio || "Bio here..."}
              </span>
              <Badge className="w-fit" variant="secondary">
                <AtSign />
                <span className="pl-1">{userProfile.username}</span>
              </Badge>
            </div>
          </section>
        </div>

        <div className="border-t border-t-gray-200">
          <div className="flex gap-10 items-center justify-center">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("saved")}
            >
              SAVED
            </span>
            <span
              className="py-3 cursor-pointer"
              //   onClick={() => setActiveTab("reels")}
            >
              REELS
            </span>
            <span
              className="py-3 cursor-pointer"
              //   onClick={() => setActiveTab("tags")}
            >
              TAGS
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {toDisplayPosts.map((post, index) => (
              <div key={index} className="relative group cursor-pointer">
                <img
                  src={post.image}
                  alt="post image"
                  className="rounded-sm my-2 w-full aspect-square object-cover"
                />
                <div className="absolute rounded inset-0 flex  items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-white space-x-4">
                    <button className="flex items-center gap-1">
                      <Heart />
                      <span>{post.likes.length}</span>
                    </button>
                    <button className="flex items-center gap-1">
                      <MessageCircle />
                      <span>{post.comments.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
