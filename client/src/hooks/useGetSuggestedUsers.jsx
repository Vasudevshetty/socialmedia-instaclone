import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

function useGetSuggestedUsers() {
  const dispatch = useDispatch();
  useEffect(() => {
    async function getSuggestedUsers() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/user/suggested`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    }

    getSuggestedUsers();
  });
}

export default useGetSuggestedUsers;
