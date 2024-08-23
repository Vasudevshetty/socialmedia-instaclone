import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

function CommentDialog({ open, setOpen, post, commentPostHandler }) {
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
              src={post?.image}
              alt="post_img"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src={post.author?.profilePic} alt="profile" />
                    <AvatarFallback>
                      {post.author?.username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">
                    {post.author.username}
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
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {post.comments.length > 0 ? (
                post.comments.map((comment, index) => (
                  <div key={index} className="flex">
                    <Comment comment={comment} />
                  </div>
                ))
              ) : (
                <div className="text-lg text-center p-1">Add a comment :)</div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment"
                  className="border border-gray-300 outline-none p-2 rounded w-full"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    commentPostHandler(text);
                    setText("");
                  }}
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

function Comment({ comment }) {
  return (
    <div className="my-2 w-full">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={comment?.author?.profilePic} />
          <AvatarFallback>
            {comment?.author?.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className="font-semi-bold text-sm flex gap-2 w-full">
          {comment?.author?.username}
          <span className="text-sm text-gray-400 w-1/2">{comment?.text}</span>
        </h1>
      </div>
    </div>
  );
}
