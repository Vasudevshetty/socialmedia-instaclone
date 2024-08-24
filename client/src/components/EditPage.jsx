import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { setAuthUser } from "@/redux/authSlice";

function EditPage() {
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePic: user?.profilePic,
    bio: user?.bio,
    gender: user?.gender,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function fileChangeHandler(e) {
    const file = e.target.files[0];
    if (file) setInput({ ...input, profilePic: file });
  }

  function selectChangeHandler(value) {
    setInput({ ...input, gender: value });
  }

  async function handleEditSumbit() {
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (input.profilePic) formData.append("profilePic", input.profilePic);
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/user/profile/edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(
          setAuthUser({
            ...user,
            bio: res.data.user.bio,
            profilePic: res.data.user.profilePic,
            gender: res.data.user.gender,
          })
        );
        navigate(`/profile/${user._id}`);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex max-w-2xl mx-auto pl-10 my-8">
      <section className="flex flex-col gap-6 w-full ">
        <h1 className="font-bold text-xl">Edit Profile</h1>

        <div className="flex items-center justify-between p-4 bg-gray-100 rounded-xl my-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={user.profilePic} alt={user.username} />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-sm font-bold">{user.username}</h1>
              <span className="text-gray-600">{user.bio || "bio here"}</span>
            </div>
          </div>

          <input
            type="file"
            hidden
            accept="image/*"
            onChange={fileChangeHandler}
            ref={imageRef}
          />
          <Button
            className="bg-[#0095f6] h-8 hover:bg-[#318bc7]"
            onClick={() => imageRef.current.click()}
          >
            Change photo
          </Button>
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <Textarea
            name="bio"
            className="focus-visible:ring-transparent"
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
          />
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Gender</h1>
          <Select
            defaultValue={input?.gender}
            onValueChange={selectChangeHandler}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue value={input.gender} />
            </SelectTrigger>
            <SelectContent className="">
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="ml-auto">
          {!loading ? (
            <Button
              className="w-fit bg-[#0095f6] h-8 hover:bg-[#318bc7]"
              onClick={handleEditSumbit}
            >
              Submit
            </Button>
          ) : (
            <Button className="w-fit bg-[#0095f6] h-8 hover:bg-[#318bc7] flex items-center gap-2">
              <Loader2 className="animate-spin" />
              Please Wait
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

export default EditPage;
