import deleted_comment_icon from "@/assets/icons/deleted_comment.svg";
import more_action_icon from "@/assets/icons/more_action.svg";
import default_avatar from "@/assets/images/deafault_avatar.svg";
import {
  deleteComment,
  getCommentsByPostID,
  getMyInfo,
  getPostByID,
} from "@/services/community";
import { RootState } from "@/store";
import { elapsedTime } from "@/utils/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Modal from "../modal";
import Reaction from "../reaction";
import "./index.scss";

function Comment({ data, isReply, setParentID }: any) {
  //my comment - text - sua xoa
  // my comment - icon - xoa
  //other person comment - report

  //my post - edit, delete
  //other post - report, block

  const categories = useSelector((state: RootState) => state.categories);

  const { data: myInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: () => getMyInfo().then((res) => res.data.user),
    staleTime: Infinity,
  });

  const { data: postInfo } = useQuery({
    queryKey: ["postDetail_Query", data.post_id],
    queryFn: () =>
      getPostByID(data.post_id).then((response) => response.data?.post),
    staleTime: Infinity,
  });

  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);

  const postChip = categories?.filter(
    (cate: any) => cate.id == postInfo?.post_category_id
  )[0]?.name;

  return (
    <div className={isReply ? "child_comment" : ""}>
      {data.deleted_at ? (
        <div className="deleted_comment deleted_reply">
          <img src={deleted_comment_icon} alt="알림" /> 댓글 작성자가 댓글을
          삭제했어요.
        </div>
      ) : (
        <div className="new_comment">
          <div className="comment_user_img">
            <img
              src={data?.user?.profile_image?.url_340 || default_avatar}
              alt="프로필 이미지"
            />
          </div>
          <div className="comment_right">
            <div className="comment_info">
              <p>
                {data.user.name}
                <span
                  className="writer_chip"
                  style={{
                    backgroundColor: "rgb(255, 151, 213)",
                    color: "rgb(255, 255, 255)",
                  }}
                >
                  {postChip}
                </span>
                <span className="comment_time">
                  {elapsedTime(data.created_at)}
                </span>
              </p>
              <button onClick={() => setIsShowModal(true)}>
                <img src={more_action_icon} alt="more action icon" />
              </button>
              {isShowModal && (
                // eslint-disable-next-line react/jsx-no-useless-fragment
                <>
                  {myInfo.id === data.user.id ? (
                    <MyCommentModal
                      isIcon={data.content.includes("<img")}
                      onClose={() => setIsShowModal(false)}
                      openConfirm={() => setIsShowConfirmModal(true)}
                      cmtID={data.id}
                      postID={data.post_id}
                    />
                  ) : (
                    <OtherCommentModal
                      onClose={() => setIsShowModal(false)}
                      data={data}
                    />
                  )}
                </>
              )}

              {isShowConfirmModal && (
                <ConfirmModal
                  postID={data.post_id}
                  cmtID={data.id}
                  onClose={() => setIsShowConfirmModal(false)}
                />
              )}
            </div>
            <div
              className="comment_text"
              dangerouslySetInnerHTML={{
                __html: data.content.replace(/\n/g, "<br />"),
              }}
            />
            <div className="comment_activity">
              <Reaction
                like={data.emotion.like}
                dislike={data.emotion.dislike}
                isAuthorLike={data.is_auth_user_liked}
                isAuthorDislike={data.is_auth_user_disliked}
                postID={data.post_id}
                commentID={data.id}
              />
              {!isReply && (
                <button
                  className="comment_replay"
                  onClick={() => setParentID(data.id)}
                >
                  답글 1
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MyCommentModal({ isIcon, onClose, openConfirm, cmtID, postID }: any) {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const Authorization = searchParams.get("Authorization");

  const params: any = {
    commentId: cmtID,
    userId,
    Authorization,
  };

  return (
    <Modal
      modalBox={
        <div className="modal_box more_modal_box">
          <ul>
            {!isIcon && (
              <li
                onClick={() => {
                  navigate({
                    pathname: "/edit-comment/" + postID,
                    search: `?${createSearchParams(params)}`,
                  });
                }}
              >
                수정
              </li>
            )}
            <li
              onClick={() => {
                openConfirm();
                onClose();
              }}
            >
              삭제
            </li>
            <li onClick={() => onClose()}>취소</li>
          </ul>
        </div>
      }
    />
  );
}

function ConfirmModal({ postID, cmtID, onClose }: any) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  async function remove() {
    const res = await deleteComment(postID, cmtID);
    if (res.data.success) {
      await queryClient.prefetchQuery({
        queryKey: ["comments_Query", postID],
        queryFn: () =>
          getCommentsByPostID(postID).then(
            (response) => response.data.comments
          ),
      });
    }
    // getCommentsByPostID(postID).then((response) => {
    //   const comments = response.data.comments;
    //   dispatch(saveComments(comments));
    // });

    onClose();
  }

  return (
    <Modal
      content={
        <div className="modal_des_box">
          <p>차단된 사용자를 해제하시겠습니까?</p>
        </div>
      }
      footer={
        <>
          <button className="acceptButton" onClick={() => remove()}>
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

function OtherCommentModal({ onClose, data }: any) {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const Authorization = searchParams.get("Authorization");

  const params: any = {
    type: 3,
    reportedUserId: data.user.id,
    boardId: 1,
    postId: data.post_id,
    commentId: data.id,
    userId,
    Authorization,
  };

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
            <li onClick={() => onClose()}>취소</li>
          </ul>
        </div>
      }
    />
  );
}

export default Comment;
