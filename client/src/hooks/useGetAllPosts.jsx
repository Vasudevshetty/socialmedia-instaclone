import { setPost } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

function useGetAllPosts() {
  const dispatch = useDispatch();
  useEffect(() => {
    async function getAllPosts() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/post/all`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setPost(res.data.posts));
        }
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    }
    getAllPosts();
  });
}

export default useGetAllPosts;
