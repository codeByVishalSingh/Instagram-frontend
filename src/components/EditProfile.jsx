import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRef, useState, useEffect } from "react"; // useEffect add kiya
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "../redux/auth.slice";
import { toast } from "sonner";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef();
  const [loading, setLoading] = useState(false);
  
  // Local state for image display to ensure instant UI update
  const [localProfilePic, setLocalProfilePic] = useState(user?.profilePic);

  // Redux user update hone par local state sync karein
  useEffect(() => {
    setLocalProfilePic(user?.profilePic);
  }, [user]);

  const [input, setInput] = useState({
    profilePhoto: user?.profilePic,
    bio: user?.bio || "",
    gender: user?.gender || ""
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, profilePhoto: file });
      // Preview ke liye local state update karein
      setLocalProfilePic(URL.createObjectURL(file));
    }
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (input.profilePhoto instanceof File) {
      formData.append("profilePic", input.profilePhoto);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3001/api/v1/user/profile/edit",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        }
      );

      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user.bio,
          profilePic: res.data.user.profilePic,
          gender: res.data.user.gender
        };
        
        dispatch(setAuthUser(updatedUserData));
        toast.success(res.data.message);
        navigate(`/profile/${user?._id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-5">
            <Avatar>
              {/* Local state aur timestamp ka use karke instant update ensure kiya */}
              <AvatarImage 
                key={localProfilePic}
                src={localProfilePic ? `${localProfilePic}?t=${new Date().getTime()}` : ""} 
                alt="profile-photo" 
              />
              <AvatarFallback>VS</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-gray-600">{user?.bio || "bio here.."}</span>
            </div>
          </div>
          <input ref={imageRef} onChange={fileChangeHandler} type="file" className="hidden" />
          <Button onClick={() => imageRef?.current.click()} className="bg-[#0095f6] h-8 hover:bg-[#318bc] cursor-pointer">
            Change Photo
          </Button>
        </div>
        
        {/* Bio Section */}
        <div>
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <Textarea value={input.bio} onChange={(e) => setInput({ ...input, bio: e.target.value })} name="bio" className="focus-visible:ring-transparent" />
        </div>

        {/* Gender Section */}
        <div>
          <h1 className="font-bold mb-2">Gender</h1>
          <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end">
          {loading ? (
            <Button className="w-fit bg-[#0095f6] hover:bg-[#2aBccd]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button onClick={editProfileHandler} className="w-fit bg-[#0095f6] hover:bg-[#2aBccd]">
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};
export default EditProfile;