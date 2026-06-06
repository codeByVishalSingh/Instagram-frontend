import { useEffect, useState } from "react"; // Added useEffect
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { MoreHorizontal } from "lucide-react";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "../redux/postSilce.js";

const CommentDialog = ({ open, setOpen }) => {
    const [text, setText] = useState("");
    const { selectedPost, posts } = useSelector(store => store.post); // Added posts
    const [comment, setComment] = useState(selectedPost?.comments || []);
    const dispatch = useDispatch();

    // Sync local state when selectedPost changes
    useEffect(() => {
        setComment(selectedPost?.comments || []);
    }, [selectedPost]);

    const changeEventHandler = (e) => {
        setText(e.target.value);
    };

    const sendMessageHandler = async () => {
        try {
            const res = await axios.post(
                `http://localhost:3001/api/v1/post/${selectedPost._id}/comment`,
                { text },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            
            if (res.data.success) {
                const newComment = res.data.comment; // Ensure your backend sends back the created comment
                const updatedCommentData = [...comment, newComment];
                setComment(updatedCommentData);
                
                const updatedPostData = posts.map(p => 
                    p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
                );
                
                dispatch(setPosts(updatedPostData));
                toast.success("Comment added");
                setText("");
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to add comment");
        }
    };

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col">
                <div className="flex flex-1">
                    <div className="w-1/2">
                        <img src={selectedPost?.image} alt="post_img" className="w-full h-full object-cover rounded-l-lg" />
                    </div>

                    <div className="w-1/2 flex flex-col justify-between">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex gap-3 items-center">
                                <Link>
                                    <Avatar>
                                        <AvatarImage src={selectedPost?.author?.profilePic} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <Link className="font-semibold text-xs">{selectedPost?.author?.username}</Link>
                            </div>
                            <MoreHorizontal className="cursor-pointer" />
                        </div>
                        <hr />
                        <div className="flex-1 overflow-y-auto max-h-96 p-4">
                            {comment.map((c) => <Comment key={c._id} comment={c} />)}
                        </div>
                        <div className="p-4">
                            <div className="flex items-center gap-2">
                                <input type="text" value={text} onChange={changeEventHandler} placeholder="Add a comment..." className="w-full outline-none border text-sm border-gray-300 p-2 rounded" />
                                <button  disabled={!text.trim()} onClick={sendMessageHandler} className="text-blue-500 cursor-pointer  font-bold">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CommentDialog;