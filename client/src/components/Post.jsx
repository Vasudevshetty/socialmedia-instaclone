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
            <AvatarImage src="" alt="post image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>username</h1>
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
        src="https://res.cloudinary.com/djd4cvqxr/image/upload/v1724003654/jn4ze8z86cmtxuprrvln.jpg"
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

      <span className="font-medium block mb-2">1k likes</span>
      <p>
        <span className="font-medium mr-2">username</span>caption
      </p>
      <span
        onClick={() => setOpenComment(true)}
        className="cursor-pointer text-sm text-gray-400"
      >
        View all 10 comments
      </span>
      <CommentDialog open={openComment} setOpen={setOpenComment} />
      <div className="flex items-center justify-between">
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
