import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import axios from "axios";
import { toast } from "sonner";

function Signup() {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isloading, setIsLoading] = useState(true);

  function inputEventChangeHandler(e) {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/user/register`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setInput({ username: "", email: "", password: "" });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="shadow-lg flex flex-col gap-5 p-8 min-w-[30%]"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">Logo</h1>
          <p className="text-center text-sm">Signup to share memories</p>
        </div>
        <div>
          <Label>Username</Label>
          <Input
            type="text"
            name="username"
            value={input.username}
            className="focus-visible:ring-transparent my-2"
            onChange={inputEventChangeHandler}
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={inputEventChangeHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <Label>password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={inputEventChangeHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <Button type="submit">Signup</Button>
      </form>
    </div>
  );
}

export default Signup;
