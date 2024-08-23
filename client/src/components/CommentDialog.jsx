import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

function CommentDialog({
  open,
  setOpen,
  author,
  comments,
  commentPostHandler,
}) {
  const [text, setText] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col outline-none"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              className="rounded-lg  w-full h-full aspect-square object-cover"
              src="https://res.cloudinary.com/djd4cvqxr/image/upload/v1724003654/jn4ze8z86cmtxuprrvln.jpg"
              alt="post_img"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src={author?.profilePic} alt="profile" />
                    <AvatarFallback>
                      {author.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">
                    {author.username}
                  </Link>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex items-center flex-col text-sm text-center outline-none">
                  <div className="text-[#ed4956] font-bold cursor-pointer">
                    Unfollow
                  </div>
                  <div className="font-bold cursor-pointer">
                    Add to favorites
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">comments</div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment"
                  className="border border-gray-300 outline-none p-2 rounded w-full"
                  value={text}
                  onChange={(e) => setText(e.target.value).trim()}
                />
                <Button
                  variant="outline"
                  onClick={commentPostHandler}
                  disabled={!text.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;
