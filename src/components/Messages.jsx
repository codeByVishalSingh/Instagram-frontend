import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const Messages = ({selectedUser})=>{
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

            {
              [1,2,3,4].map((msg)=>{
                return (
                  <div className={`flex`}>
                    <div>
                     {msg}
                  </div>
                  </div>
                )
              })
            }
          </div>
        </div>
    )
}
export default Messages;