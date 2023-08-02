import Header from "@/components/header";
import search_icon from "@/assets/icons/search.svg";
import profile_icon from "@/assets/icons/profile.svg";
import Categories from "./components/categories-section";
import "./index.scss";
import PostList from "@/components/post-list";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllPost } from "@/services/community";
import scroll_top_icon from "@/assets/icons/scroll_top.svg";
import pencil_icon from "@/assets/icons/pencil.svg";

function Community() {
  const location = useLocation();
  const [postResponse, setPostResponse] = useState<any>(null);

  const boardData = localStorage.getItem("boardData");
  const [postList, setPostList] = useState<any[]>(
    JSON.parse(boardData || "[]") || []
  );

  const boardPage = localStorage.getItem("boardPage");
  const [page, setPage] = useState(JSON.parse(boardPage || "1") || 1);

  const boardCate = localStorage.getItem("boardchosenCategory");
  const [chosenCategory, setChosenCategory] = useState<number>(
    JSON.parse(boardCate || "0") || 0
  );
  const [isShowScrollTop, setIsShowScrollTop] = useState(false);

  const [isUseStorageData, setIsUseStorageData] = useState(true);
  const perPage = 30;

  const boardScroll = localStorage.getItem("boardScroll");

  useEffect(() => {
    if (isUseStorageData) {
      scrollTo(0, JSON.parse(boardScroll || "0"));
      setIsUseStorageData(false);
    }
  }, [postList]);

  const getData = async () => {
    const params = {
      ...(chosenCategory && { "postCategories[]": chosenCategory }),
      perPage,
      page: page,
    };
    const response = await getAllPost(params);
    if (response.data.success) {
      setPostList((preState) => {
        if (page == 1) {
          return response.data.posts.data;
        }

        const fisrtResponse = response.data.posts.data[0];
        const existedIdArr = preState?.reduce(
          (previousArray: any[], currentItem: any) => [
            ...previousArray,
            currentItem.id,
          ],
          []
        );
        if (
          existedIdArr.includes(fisrtResponse?.id) ||
          response.data.posts.data.length == 0
        )
          return preState;
        else return [...preState, ...response.data.posts.data];
      });
      setPostResponse(response.data.posts);
    }
  };

  function scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    if (isUseStorageData) {
      return;
    }

    if (
      page > postResponse?.current_page ||
      page == 1 ||
      (postResponse == undefined &&
        chosenCategory == JSON.parse(boardCate || "0"))
    )
      getData();
  }, [page, chosenCategory, isUseStorageData]);

  useEffect(() => {
    if (isUseStorageData) {
      return;
    }

    setPage(1);
  }, [chosenCategory]);

  function scrollFunction() {
    localStorage.setItem("boardScroll", JSON.stringify(window.scrollY));

    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      setIsShowScrollTop(true);
    } else {
      setIsShowScrollTop(false);
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", scrollFunction, false);
    return () => window.removeEventListener("scroll", scrollFunction, false);
  }, []);

  useEffect(() => {
    localStorage.setItem("boardData", JSON.stringify(postList));
  }, [postList]);

  useEffect(() => {
    localStorage.setItem("boardPage", JSON.stringify(page));
  }, [page]);

  useEffect(() => {
    localStorage.setItem("boardchosenCategory", JSON.stringify(chosenCategory));
  }, [chosenCategory]);

  return (
    <div className="wrap">
      <Header>
        <>
          <button>
            <Link to={`/search${location.search}`}>
              <img src={search_icon} alt="search icon" />
            </Link>
          </button>

          <button>
            <Link to={`/profile${location.search}`}>
              <img src={profile_icon} alt="profile icon" />
            </Link>
          </button>
        </>
      </Header>
      <div className="posts">
        <Categories
          chosenCategory={chosenCategory}
          setChosenCategory={setChosenCategory}
        />

        <PostList
          data={postList}
          newPage={() => setPage((page: any) => page + 1)}
          isLastPage={postResponse?.current_page >= postResponse?.last_page}
        />
      </div>

      <div
        className="floating_btn_wrap"
        style={{ bottom: "20px", transition: "bottom 0.5s ease 0s" }}
      >
        {isShowScrollTop && (
          <button
            className="floating_scroll_top_btn"
            onClick={() => scrollTop()}
          >
            <img src={scroll_top_icon} alt="스크롤 위로" />
          </button>
        )}
        <button className="floating_write_btn">
          <Link to={`/postwriter${location.search}`}>
            <img src={pencil_icon} alt="글쓰기" />
          </Link>
        </button>
      </div>
    </div>
  );
}

export default Community;
