import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";

function CreatePost({ open, setOpen }) {
  const { user } = useSelector((store) => store.auth);
  const [postFile, setPostFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [postPreview, setPostPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef();

  async function fileChangeHandler(e) {
    const file = e.target.files[0];
    if (file) {
      setPostFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setPostPreview(dataUrl);
    }
  }

  async function createPostHandler() {
    const formData = new FormData();
    formData.append("caption", caption);
    if (postFile) formData.append("image", postFile);

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/post/addpost`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setCaption("");
        setPostFile(null);
        setOpen(false);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="outline-none"
      >
        <DialogHeader className="text-center font-semibold">
          Create new post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePic} alt={user?.username} />
            <AvatarFallback>{user?.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user?.username}</h1>
            <span className="text-gray-600 text-xs">{user?.bio}</span>
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent"
          placeholder="Text goes here.."
        />
        {postPreview && (
          <div className="w-full h-64 flex items-center justify-between">
            <img
              src={postPreview}
              alt="preview image"
              className="object-cover h-full w-full rounded-md"
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileRef}
          onChange={fileChangeHandler}
        />
        <Button
          className="w-fit mx-auto hover:bg-[#258bcf] bg-[#0095f6]"
          onClick={() => fileRef.current.click()}
        >
          Select from computer
        </Button>
        {postPreview &&
          (!isLoading ? (
            <Button
              className="w-fit mx-auto hover:bg-[#258bcf] bg-[#0095f6]"
              onClick={createPostHandler}
              type="submit"
            >
              Post
            </Button>
          ) : (
            <Button className="w-fit mx-auto hover:bg-[#258bcf] bg-[#0095f6]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
}

export default CreatePost;
