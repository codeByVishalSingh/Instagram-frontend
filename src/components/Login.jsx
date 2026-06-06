import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/auth.slice.js";


const Login =()=>{

    const [input ,setInput] = useState({
       
        email: "",
        password: "",
    })
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
const changeEventHandler = (e) => {
  setInput({
    ...input,
    [e.target.name]: e.target.value
  });
}
const signupHandler = async (e) => {
      e.preventDefault();
    try {
        setLoading(true)

        const res = await axios.post(
            "http://localhost:3001/api/v1/user/login",
            input,
            {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }
        );
          if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
                setInput({
                  
                    email: "",
                    password: ""
                });
            }

        console.log(res.data);

    } catch (error) {
    // Check if error.response exists before accessing its data
    if (error.response && error.response.data) {
        toast.error(error.response.data.message || "An error occurred");
        console.log(error.response.data);
    } else {
        // Fallback for network errors or when server doesn't return a response
        toast.error("Something went wrong. Please try again later.");
        console.log(error.message);
    }
} finally {
    setLoading(false);
}
}
    return(
            <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={signupHandler}  className='shadow-lg flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>LOGO</h1>
                    <p className='text-sm text-center'>Login to see photos & videos from your friends</p>
                </div>
                
                <div>
                    <span className='font-medium'>Email</span>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                <div>
                    <span className='font-medium'>Password</span>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                {
                    loading ? (
                        <Button>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin">
                                please wait
                            </Loader2>
                        </Button>
                    ) :(
                         <Button type='submit'>Login </Button>
                    )
                }
                  
                <span className="text-center">Does not have an account?<Link to="/signup" className="text-blue-600">Signup</Link></span>
    
                </form>
        </div>
    )
}

export default Login;