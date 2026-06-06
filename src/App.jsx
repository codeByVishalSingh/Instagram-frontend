

import Signup from "./components/Signup"
import { createBrowserRouter, RouterProvider} from "react-router-dom"
import Login from "./components/Login"
import ChatPage from "./components/ChatPage"
import EditProfile from "./components/EditProfile"
import Profile from "./components/Profile"
import Home from "./components/Home"
import MainLayout from "./components/MainLayout"


function App() {
 console.log("App component is mounting!");
const browserRouter = createBrowserRouter([
  
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: 'profile/:id',
        element:   <Profile /> 
      },
      {
        path: 'account/edit',
        element:  <EditProfile /> 
      },
      {
        path: 'chat',
        element:  <ChatPage /> 
      },
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
])
  return (
    <>
      
    <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
