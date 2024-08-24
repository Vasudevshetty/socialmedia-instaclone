import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";

function Post({ post }) {
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [openComment, setOpenComment] = useState(false);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [isLiking, setIsLiking] = useState(false);

  async function likeOrDislikePostHandler() {
    try {
      const likedStatus = liked ? "dislike" : "like";
      setIsLiking(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/post/${
          post._id
        }/${likedStatus}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setLiked((liked) => !liked);
        const updatedPosts = posts.map((toUpdate) =>
          toUpdate._id === post._id
            ? {
                ...toUpdate,
                likes: liked
                  ? toUpdate.likes.filter((id) => id !== user._id)
                  : [...post.likes, user._id],
              }
            : toUpdate
        );
        dispatch(setPost(updatedPosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setIsLiking(false);
    }
  }
  async function commentPostHandler(dialogText) {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/post/${post._id}/comment`,
        { text: text ? text : dialogText },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedPosts = posts.map((toUpdate) =>
          toUpdate._id === post._id
            ? {
                ...toUpdate,
                comments: [res.data.comment, ...toUpdate.comments],
              }
            : toUpdate
        );
        dispatch(setPost(updatedPosts));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      toast.error(error.resopnse?.data?.message);
    }
  }

  async function deletePostHandler() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/post/delete/${post._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        const updatedPosts = posts.filter(
          (postToDelete) => postToDelete._id !== post._id
        );
        dispatch(setPost(updatedPosts));
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error);
    }
  }

  return (
    <div className="my-8 w-full max-w-sm mx-auto relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author?.profilePic} alt="post image" />
            <AvatarFallback>
              {post.author.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <h1>{post.author.username}</h1>
            {post.author._id === user._id && <Badge variant={"secondary"}>Author</Badge>}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center outline-none">
            {post.author._id !== user._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ed4956] font-bold"
              >
                Unfollow
              </Button>
            )}
            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to favorites
            </Button>
            {post.author._id === user._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit"
                onClick={deletePostHandler}
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post.image}
        alt="post_img"
      />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {!liked ? (
            <FaRegHeart
              size={"22px"}
              className="cursor-pointer hover:text-gray-600"
              onClick={likeOrDislikePostHandler}
            />
          ) : (
            <FaHeart
              size={"22px"}
              fill="#e1306c"
              className="cursor-pointer hover:text-gray-600"
              onClick={likeOrDislikePostHandler}
            />
          )}
          <MessageCircle
            className="cursor-pointer hover:text-gray-600"
            onClick={() => setOpenComment(true)}
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>

      <span className="font-medium block mb-2">{post.likes.length} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author.username}</span>
        {post.caption}
      </p>
      {post.comments.length > 0 && (
        <span
          onClick={() => setOpenComment(true)}
          className="cursor-pointer text-sm text-gray-400"
        >
          View all {post.comments.length} comments
        </span>
      )}
      <CommentDialog
        open={openComment}
        setOpen={setOpenComment}
        post={post}
        text={text}
        setText={text}
        commentPostHandler={commentPostHandler}
      />
      <div className="flex items-center justify-between my-1 p-2 border border-gray-300 rounded">
        <input
          type="text"
          placeholder="Add a comment.."
          className="outline-none text-sm w-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {text && (
          <button className="text-[#3badf8]" onClick={commentPostHandler}>
            Post
          </button>
        )}
      </div>

      {isLiking && (
        <div className="absolute top-[40%] right-[40%] animate-ping duration-900">
          <FaHeart
            size={80}
            className="bg-clip-text opacity-6"
            fill="#e1306c"
          />
        </div>
      )}
    </div>
  );
}

export default Post;
