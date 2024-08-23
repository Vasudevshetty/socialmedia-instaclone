import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useState } from "react";

function Post({ post }) {
  const [text, setText] = useState("");
  const [openComment, setOpenComment] = useState(false);

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author?.profilePic} alt="post image" />
            <AvatarFallback>
              {post.author.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1>{post.author.username}</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ed4956] font-bold"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to favorites
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit">
              Delete
            </Button>
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
          <FaRegHeart
            size={"22px"}
            className="cursor-pointer hover:text-gray-600"
          />
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
        <>
          <span
            onClick={() => setOpenComment(true)}
            className="cursor-pointer text-sm text-gray-400"
          >
            View all {post.comments.length} comments
          </span>
          <CommentDialog
            open={openComment}
            setOpen={setOpenComment}
            author={post.author}
            comments={post.comments}
          />
        </>
      )}
      <div className="flex items-center justify-between my-1">
        <input
          type="text"
          placeholder="Add a comment.."
          className="outline-none text-sm w-full"
          value={text}
          onChange={(e) => setText(e.target.value.trim())}
        />
        {text && <span className="text-[#3badf8]">Post</span>}
      </div>
    </div>
  );
}

export default Post;
