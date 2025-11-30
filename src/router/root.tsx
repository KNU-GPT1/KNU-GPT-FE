import { createBrowserRouter, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { lazy, Suspense } from "react";
import { getAuthToken } from "../api/auth";

const Loading = () => <div>Loading....</div>
const Chat = lazy(() => import("../pages/chatPage"))
const Signup = lazy(() => import("../pages/SignupPage"))
const Login = lazy(() => import("../pages/LoginPage"))
const DesignTest = lazy(() => import("../pages/DesignTestPage"))
const GuestPage = lazy(() => import("../pages/guestPage"))

// 로그인 상태에 따라 페이지를 결정하는 컴포넌트
function AuthCheck() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      navigate('/chat');
    } else {
      navigate('/guest');
    }
  }, [navigate]);

  // 리디렉션이 발생하기 전까지는 아무것도 렌더링하지 않음
  return null;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthCheck />,
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/signup",
    element: (
      <Suspense fallback={<Loading />}>
        <Signup />
      </Suspense>
    ),
  },
  {
    path: "/design",
    element: (
      <Suspense fallback={<Loading />}>
        <DesignTest />
      </Suspense>
    ),
  },
  {
    path: "/guest",
    element: (
      <Suspense fallback={<Loading />}>
        <GuestPage />
      </Suspense>
    ),
  },
  {
    path: "/chat",
    element: (
      <Suspense fallback={<Loading />}>
        <Chat />
      </Suspense>
    ),
  },
]);

export default router;