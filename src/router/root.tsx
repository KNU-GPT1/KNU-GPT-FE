import { createBrowserRouter } from "react-router";


import { lazy, Suspense } from "react";

const Loading = () => <div>Loading....</div>
const Chat = lazy(() => import("../pages/chatPage"))
const Signup = lazy(() => import("../pages/SignupPage"))
const Login = lazy(() => import("../pages/LoginPage"))
const DesignTest = lazy(() => import("../pages/DesignTestPage"))



const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Chat />
          </Suspense>
        ),
      },
      {
        path: "signup",
        element: (
          <Suspense fallback={<Loading />}>
            <Signup />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "design-test",
        element: (
          <Suspense fallback={<Loading />}>
            <DesignTest />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router