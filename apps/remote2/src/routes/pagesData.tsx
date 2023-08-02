import { routerType } from "@/types/router.types";
import Community from "@/pages/community";
import PostDetail from "@/pages/post-detail";
import Searching from "@/pages/searching";
import PostWriter from "@/pages/write-post";
import Profile from "@/pages/profile";
import Blocked from "@/pages/blocked";
import EditComment from "@/pages/edit-comment";
import EditProfile from "@/pages/edit-profile";
import Report from "@/pages/report";
import NotFoundPage from "@/pages/notFound";

const pagesData: routerType[] = [
  {
    path: "/board",
    element: <Community />,
    title: "home",
  },
  {
    path: "detail/:id",
    element: <PostDetail />,
    title: "post detail",
  },
  {
    path: "search",
    element: <Searching />,
    title: "search",
  },
  {
    path: "postwriter",
    element: <PostWriter />,
    title: "postwriter",
  },
  {
    path: "edit-post/:id",
    element: <PostWriter />,
    title: "edit-post",
  },
  {
    path: "edit-comment/:id",
    element: <EditComment />,
    title: "edit-comment",
  },
  {
    path: "profile",
    element: <Profile />,
    title: "profile",
  },
  {
    path: "edit-profile",
    element: <EditProfile />,
    title: "edit-profile",
  },
  {
    path: "blocked-user",
    element: <Blocked />,
    title: "block-user",
  },
  {
    path: "report",
    element: <Report />,
    title: "report",
  },
  {
    path: "404",
    element: <NotFoundPage />,
    title: "not found",
  },
];

export default pagesData;
