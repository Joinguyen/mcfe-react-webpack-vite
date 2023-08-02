import Header from "@/components/header";
import PostList from "@/components/post-list";
import "./index.scss";
import search_icon from "@/assets/icons/search.svg";
import { useEffect, useRef, useState } from "react";
import { getAllPost } from "@/services/community";
import NoData from "@/components/no-data";

function Searching() {
  const [search, setSearch] = useState("");
  const [postResponse, setPostResponse] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [postList, setPostList] = useState<any[]>([]);
  const searchInput: React.Ref<any> = useRef(null);

  async function searchAction() {
    const params = {
      searchText: search,
      perPage: 30,
      page: page,
    };
    const res = await getAllPost(params);
    if (res.data.success) {
      setPostResponse(res.data?.posts);

      const hightLightData = res.data?.posts?.data?.map((dt: any) => {
        return {
          ...dt,
          content: getHighlightedText(dt.content, search),
        };
      });

      // const newArrPost = {
      //   ...res.data.posts,
      //   data: hightLightData,
      // };

      setPostList((preState) => {
        if (page == 1) {
          return hightLightData;
        }

        const fisrtResponse = res.data?.posts.data[0];
        const existedIdArr = preState?.reduce(
          (previousArray: any[], currentItem: any) => [
            ...previousArray,
            currentItem.id,
          ],
          []
        );
        if (
          existedIdArr.includes(fisrtResponse?.id) ||
          res.data?.posts.data.length == 0
        )
          return preState;
        else return [...preState, ...hightLightData];
      });

      //setPostResponse(newArrPost);
    }
  }

  useEffect(() => {
    if (page !== 1) searchAction();
  }, [page]);

  function getHighlightedText(text: string, highlight: string) {
    const htmlString = text.replace(
      highlight,
      `<span style="background: #ffeaf7; color: #ff2eab">${highlight}</span>`
    );
    return htmlString;
  }

  const handleFocus = (event: any) => {
    event.target.select();
    setSearch("");
    setPage(1);
    setPostList([]);
  };

  return (
    <div className="searching-page">
      <Header />
      <div className="main">
        <section className="searchbar_wrap">
          <div className="searchbar_container">
            <input
              ref={searchInput}
              type="text"
              placeholder="궁금한 피드의 키워드를 입력해보세요."
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  searchAction();
                  searchInput?.current?.blur();
                }
              }}
              // onFocus={() => {
              //   setSearch("");
              //   setPage(1);
              // }}
              onFocus={handleFocus}
              autoFocus
            />
            <button onClick={() => searchAction()}>
              <img src={search_icon} alt="검색" />
            </button>
          </div>
        </section>
        {postResponse?.data?.length == 0 ? (
          <NoData text="검색된 글 없습니다." />
        ) : (
          <>
            {postResponse && postList.length > 0 && (
              <PostList
                data={postList}
                newPage={() => setPage((page) => page + 1)}
                isLastPage={
                  postResponse?.current_page === postResponse?.last_page
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Searching;
