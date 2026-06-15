import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "../redux/auth.slice";

import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import {  useEffect, useState } from "react";
import axios from "axios";
import { setMessages } from "../redux/chatSlice";


const ChatPage = ()=>{
    const [textMessage,setTextMessage] =useState("")
    const {user,suggestedUsers,selectedUser} = useSelector(store => store.auth)
     const {onlineUsers,messages} = useSelector(store =>store.chat)
    const dispatch = useDispatch()

   
const sendMessagehandler = async (receiverId) => {
    try {
        const res = await axios.post(`http://localhost:3001/api/v1/message/send/${receiverId}`, 
            { textMessage }, 
            { withCredentials: true }
        );

        if (res.data.success) {
            // FIX: Agar 'messages' undefined hai, toh [] use karo
            const currentMessages = Array.isArray(messages) ? messages : [];
            dispatch(setMessages([...currentMessages, res.data.newMessage]));
            setTextMessage("");
        }
    } catch (error) {
        console.log("Error sending message:", error);
    }
}
    useEffect(()=>{
        return ()=>{
            dispatch(setSelectedUser(null))
        }
    },[]);
    return(
        <div className="flex ml-[18%] h-screen">
           <section className="w-full md:w-1/4 my-8">
            <h1 className="font-bold mb-4 px-3 text-xl"> 
              {user?.username}
            </h1>
            <hr className="mb-4 border-gray-400" />
            <div className="overflow-y-auto h-[80vh]">
{
       suggestedUsers.map((suggestedUsers)=> {
        const isOnline = onlineUsers.includes(suggestedUsers?._id);
        return (
            <div onClick={()=> dispatch(setSelectedUser(suggestedUsers))} className="flex gap-3 items-center p-3 hover:bg-gray-100 cursor-pointer"> 
                <Avatar className="w-14 h-14"> 
                    <AvatarImage src={suggestedUsers?.profilePic} />
                    <AvatarFallback>VS</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                <span className="font-medium">{suggestedUsers?.username}</span>
                <span className={`text-xs font-blod ${isOnline ? 'text-green-700': 'text-red-700'}`}>{isOnline ? 'online':'offline'}</span>
                </div>
            </div>
        )
       })
}
            </div>
           </section>
           {
            selectedUser ? (
                <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
                    <div className="flex gap-3 items-center px-3 py-2 boreder-b border-gray-300 sticky top-0 bg-white z-10">
                        <Avatar>
                            <AvatarImage src={selectedUser?.username}/>
                            <AvatarFallback>
                                  VS
                            </AvatarFallback>
                        </Avatar>
                      <div className="flex flex-col">
                        <span>{selectedUser?.username}</span>
                      </div>
                    </div>
                    <Messages selectedUser={selectedUser}/>
                    <div className="flex items-center p-4 border-t-gray-400">
                      <input value={textMessage} onChange={(e)=> setTextMessage(e.target.value)} type="text" placeholder="Messages......" className="flex-1 mr-2 focus-visible:ring transparent" />
                   <Button onClick={()=> sendMessagehandler(selectedUser?._id)} className='cursor-pointer'>Send</Button>
                    </div>
                </section>
            ) :(
                <div className="flex flex-col items-center justify-center mx-auto">

                    <MessageCircleCode className="w-32 h-32 my-4"/>
                    <h1 className="font-medium text-xl">Your Message</h1>
                    <span>Sent a Message to start chat</span>
                </div>
            )
           }
        </div>
    )
}
export default ChatPage;