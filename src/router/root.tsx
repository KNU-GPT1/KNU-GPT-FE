import { createBrowserRouter } from "react-router";


import {lazy, Suspense } from "react";

const Loading = () => <div>Loading....</div>
const Chat = lazy(() => import("../pages/chatPage"))
const GuestPage = lazy(() => import("../pages/guestPage"))
const LoginPage = lazy(() => import("../pages/loginPage"))



const router = createBrowserRouter([
    {
        path: "/",
        children: [
            { index: true, 
              element: <Suspense fallback={<Loading/>}><GuestPage/></Suspense> 
            },
            {
                path: "chat",
                element: <Suspense fallback={<Loading/>}><Chat/></Suspense>
            },
            {
                path: "login",
                element: <Suspense fallback={<Loading/>}><LoginPage/></Suspense>
            },
        ],
    },

]);

export default router