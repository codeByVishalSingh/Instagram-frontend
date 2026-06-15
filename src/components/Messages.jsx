import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import useGetAllMessage from "../hooks/useGetAllMessages";
import useGetRealTimeChat from  "../hooks/useGetRealTimeChat"
const Messages = ({selectedUser})=>{

  
  useGetRealTimeChat();
  useGetAllMessage();

  const {messages} = useSelector(store =>store.chat)
  const {user} = useSelector(store => store.auth)
    return(
        <div className="overflow-y-auto flex-1 p-4">
          <div className="flex justify-center"> 
            <div className="flex flex-col items-center justify-center">
          <Avatar className="h-30 w-30">
            <AvatarImage src={selectedUser?.profilePic} />
            <AvatarFallback>VS</AvatarFallback>
          </Avatar>
          <span>{selectedUser.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}><Button className="h-8 my-2 cursor-pointer" variant="secondary">View Profile</Button></Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">

         // Messages.jsx mein sahi code:
{messages && messages.map((msg) => {
  return (
    <div key={msg._id} className={`flex ${msg.senderId === user?._id ? 'justify-end': 'justify-start'}`}>
      <div className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId === user?._id ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'}`}>
   
         {msg.message} 
      </div>
    </div>
  )
})}
          </div>
        </div>
    )
}
export default Messages;