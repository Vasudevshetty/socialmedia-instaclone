import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

function useGetUserProfile(userId) {
  const dispatch = useDispatch();

  useEffect(() => {
    async function getUserProfile() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/user/${userId}/profile`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    }
    getUserProfile();
  }, [userId, dispatch]);
}

export default useGetUserProfile;
