import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { setAuthUser } from "../redux/auth.slice.js";
import { useState } from "react";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "../redux/postSilce.js";

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch(); 
    const [open, setOpen] = useState(false);

    const LogoutHandler = async () => {
        try { 
            const res = await axios.get("http://localhost:3001/api/v1/user/logout", { withCredentials: true });
            if (res.data.success) {
             
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate("/login");
                toast.success(res.data.message || "Logged out successfully");
            }
        } catch (error) {
            console.error("Logout error details:", error);
            // 🔑 FIXED: Added optional chaining (?.) so it won't crash if the server is offline
            const errMsg = error.response?.data?.message || "Could not connect to server.";
            toast.error(errMsg);
        }
    };

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            LogoutHandler();
        } else if (textType === 'Create') {
            setOpen(true);
        }
        else if ( textType === 'Profile'){
          navigate(`/profile/${user?._id}`)
        }
         else if ( textType === 'Home'){
          navigate("/")
        }
    };

    const SidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Explore" },
        { icon: <MessageCircle />, text: "Message" },
        { icon: <Heart />, text: "Notification" },
        { icon: <PlusSquare />, text: "Create" },
        {
            icon: (
                <Avatar className="w-6 h-6">
                    <AvatarImage src={user?.profilePic} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ), text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" },
    ];

    return (
        <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className="flex flex-col">
                <h1 className="my-8 pl-3 font-bold text-xl">Logo</h1>
                <div>
                    {
                        SidebarItems.map((item, index) => {
                            return (
                                <div onClick={() => sidebarHandler(item.text)} key={index} className="flex items-center gap-4 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3">
                                    {item.icon}
                                    <span>{item.text}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>
    );
};

export default LeftSidebar;