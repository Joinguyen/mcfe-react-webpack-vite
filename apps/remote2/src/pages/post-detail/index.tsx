import Header from "@/components/header";
import "./index.scss";
import CommentList from "@/components/comment-list";
import CommentWriter from "./components/comment-writer";
import Post from "@/components/post";
import { useQuery } from "@tanstack/react-query";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  blockUser,
  deletePostAPI,
  getMyInfo,
  getPostByID,
  pickOrUnpickPost,
} from "@/services/community";
import { useEffect, useState } from "react";
import header_bookmark_off_icon from "@/assets/icons/header_activity_bookmark_off.svg";
import header_bookmark_on_icon from "@/assets/icons/header_activity_bookmark_on.svg";
import more_action_icon from "@/assets/icons/more_action.svg";
import bookmark_success_modal_icon from "@/assets/icons/bookmark_success.svg";
import Modal from "@/components/modal";

type detailModalType =
  | "show_more"
  | "bookmark_success"
  | "confirm_delete"
  | false;

function PostDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const { data, refetch: refetchPostDetail } = useQuery({
    queryKey: ["postDetail_Query", id],
    queryFn: () => getPostByID(id).then((response) => response.data?.post),
  });

  const [parentID, setParentID] = useState(null);

  const [showModalType, setShowModalType] = useState<detailModalType>(false);

  const { data: myInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: () => getMyInfo().then((res) => res.data.user),
    staleTime: Infinity,
  });

  const [isPostPick, setIsPostPick] = useState<any>();

  useEffect(() => {
    setIsPostPick(data?.is_auth_user_picked);
  }, [data]);

  async function changePickStt() {
    const res = await pickOrUnpickPost(data.id);

    if (res.data.success) {
      refetchPostDetail();

      if (!isPostPick) {
        setShowModalType("bookmark_success");
      }
      setIsPostPick((preStt: any) => !preStt);
    }
  }

  return (
    <div className="wrap">
      <Header goBack={() => navigate("/board" + location.search)}>
        <>
          <button onClick={() => changePickStt()}>
            <img
              src={
                isPostPick ? header_bookmark_on_icon : header_bookmark_off_icon
              }
              alt="search icon"
            />
          </button>
          <button onClick={() => setShowModalType("show_more")}>
            <img src={more_action_icon} alt="profile icon" />
          </button>
        </>
      </Header>

      {showModalType.toString() == "bookmark_success" && (
        <PickSuccessModal onClose={() => setShowModalType(false)} />
      )}

      {showModalType.toString() == "show_more" && (
        <>
          {data.user_id == myInfo.id ? (
            <MyPostMoreModal
              onClose={() => setShowModalType(false)}
              postID={data?.id}
              setShowModalType={setShowModalType}
            />
          ) : (
            <OtherPersonPostMoreModal
              onClose={() => setShowModalType(false)}
              postUserID={data?.user_id}
              postID={data.id}
            />
          )}
        </>
      )}

      {showModalType.toString() == "confirm_delete" && (
        <ConfirmDeletePostModal
          postID={data?.id}
          onClose={() => setShowModalType(false)}
        />
      )}

      <main style={{ backgroundColor: "rgb(249, 250, 251)" }}>
        <div className="post_wrap">{data && <Post data={data} />}</div>

        {data?.id && (
          <div className="comment_wrap">
            <div className="comment_container">
              <CommentList postID={data?.id} setParentID={setParentID} />
            </div>

            <div className="comment_action">
              <CommentWriter
                postID={data?.id}
                parentID={parentID}
                setParentID={setParentID}
                refetchPostDetail={refetchPostDetail}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function MyPostMoreModal({ onClose, postID, setShowModalType }: any) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Modal
      modalBox={
        <div className="modal_box more_modal_box">
          <ul>
            <li
              onClick={() => navigate("/edit-post/" + postID + location.search)}
            >
              수정
            </li>
            <li onClick={() => setShowModalType("confirm_delete")}>삭제</li>
            <li onClick={() => onClose()}>취소</li>
          </ul>
        </div>
      }
    />
  );
}

function OtherPersonPostMoreModal({ onClose, postUserID, postID }: any) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const Authorization = searchParams.get("Authorization");
  const params: any = {
    type: 2,
    reportedUserId: postUserID,
    boardId: 1,
    postId: postID,
    userId,
    Authorization,
  };

  async function block() {
    const res = await blockUser(postUserID);
    if (res.data.success) navigate("/board" + location.search);
  }

  return (
    <Modal
      modalBox={
        <div className="modal_box more_modal_box">
          <ul>
            <li
              onClick={() => {
                navigate({
                  pathname: "/report",
                  search: `?${createSearchParams(params)}`,
                });
              }}
            >
              신고
            </li>
            <li onClick={() => block()}>이 사용자의 글 보지 않기</li>
            <li onClick={() => onClose()}>취소</li>
          </ul>
        </div>
      }
    />
  );
}

function PickSuccessModal({ onClose }: any) {
  return (
    <Modal
      content={
        <div className="modal_des_box">
          <img src={bookmark_success_modal_icon} alt="no image" />
          <p>차단된 사용자를 해제하시겠습니까?</p>
        </div>
      }
      footer={
        <>
          <button className="acceptButton" onClick={() => onClose()}>
            확인
          </button>
        </>
      }
    />
  );
}

function ConfirmDeletePostModal({ onClose, postID }: any) {
  const navigate = useNavigate();
  const location = useLocation();

  async function deletePost() {
    const res = await deletePostAPI(postID);
    if (res.data.success) navigate("/board" + location.search);
  }
  return (
    <Modal
      content={
        <div className="modal_des_box">
          <p>게시글을 삭제하시겠습니까?</p>
        </div>
      }
      footer={
        <>
          <button className="acceptButton" onClick={() => deletePost()}>
            확인
          </button>
          <button className="cancelButton" onClick={() => onClose()}>
            취소
          </button>
        </>
      }
    />
  );
}

export default PostDetail;
