import "./index.scss";
import Post from "../post/index";
import { PostListType } from "@/types/components.type";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import InfiniScrollSpinner from "@/components/infiniteScrollSpinner";
import InfiniteScroll from "react-infinite-scroll-component";

function PostList({ data, newPage, isLastPage }: PostListType) {
  return (
    <div>
      <InfiniteScroll
        dataLength={data.length}
        next={() => newPage()}
        hasMore={!isLastPage}
        loader={<InfiniScrollSpinner />}
        endMessage={
          <div className="no_more_post_content">
            더이상 게시글이 존재하지 않네요.
            <br />
            다른 게시글을 찾아볼까요?
            <br />
          </div>
        }
      >
        {data?.map((post) => (
          <Post data={post} key={`keypost-${post.id}`} />
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default PostList;
