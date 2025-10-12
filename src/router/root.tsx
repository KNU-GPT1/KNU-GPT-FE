import { createBrowserRouter } from "react-router";


import {lazy, Suspense } from "react";

const Loading = () => <div>Loading....</div>
const Chat = lazy(() => import("../pages/chatPage"))



const router = createBrowserRouter([
    {
        path: "/",
        children: [
            { index: true, 
              element: <Suspense fallback={<Loading/>}><Chat/></Suspense> 
            },
         ],
    },

]);

export default router