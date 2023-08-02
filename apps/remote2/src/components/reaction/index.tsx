import "./index.scss";
import like_icon from "@/assets/icons/like.svg";
import dislike_icon from "@/assets/icons/dislike.svg";
import like_active_icon from "@/assets/icons/like_active.svg";
import dislike_active_icon from "@/assets/icons/dislike_active.svg";
import { useState } from "react";
import { likeAPI, dislikeAPI } from "@/services/community";

function Reaction({
  like,
  dislike,
  isAuthorLike,
  isAuthorDislike,
  postID,
  commentID,
}: any) {
  const [like_count, setLike] = useState(like);
  const [dislike_count, setDislike] = useState(dislike);

  const likeAction = async () => {
    await likeAPI(postID, commentID);
    switch (activeButton) {
      case -1:
        setActiveButton(1);
        setLike((like: any) => like + 1);
        break;
      case 1:
        setActiveButton(-1);
        setLike((like: any) => like - 1);
        break;
      case 2:
        setActiveButton(1);
        setLike((like: any) => like + 1);
        setDislike((dislike: any) => dislike - 1);
        break;
    }
  };

  const dislikeAction = async () => {
    await dislikeAPI(postID, commentID);
    switch (activeButton) {
      case -1:
        setActiveButton(2);
        setDislike((dislike: any) => dislike + 1);
        break;
      case 1:
        setActiveButton(2);
        setDislike((dislike: any) => dislike + 1);
        setLike((like: any) => like - 1);
        break;
      case 2:
        setActiveButton(-1);
        setDislike((dislike: any) => dislike - 1);
        break;
    }
  };

  const [activeButton, setActiveButton] = useState(() => {
    if (isAuthorLike) return 1;
    if (isAuthorDislike) return 2;
    return -1;
  });

  return (
    <>
      <button
        className={
          activeButton == 1
            ? "thumb_btn active_post active_pressed"
            : "thumb_btn active_post"
        }
        onClick={() => likeAction()}
      >
        <img
          src={activeButton == 1 ? like_active_icon : like_icon}
          className="thumb_img"
        />

        <span className="thumb_text">
          {like_count > 0 ? like_count : "좋아요"}
        </span>
      </button>

      <button
        className={
          activeButton == 2
            ? "thumb_btn active_post active_pressed"
            : "thumb_btn active_post"
        }
        onClick={() => dislikeAction()}
      >
        <img
          src={activeButton == 2 ? dislike_active_icon : dislike_icon}
          className="thumb_img"
        />
        <span className="thumb_text">
          {dislike_count > 0 ? dislike_count : "싫어요"}
        </span>
      </button>
    </>
  );
}

export default Reaction;
