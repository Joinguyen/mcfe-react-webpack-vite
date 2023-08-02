import close_white_icon from "@/assets/icons/close_white.svg";
import send_icon from "@/assets/icons/send.svg";
import smiley_icon from "@/assets/icons/smiley.svg";
import {
  commentIconOnPost,
  commentOnPost,
  getAllEmoticonPackages,
  getCommentsByPostID,
  get_All_Emoicon_By_PackageID,
} from "@/services/community";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import "./index.scss";

function CommentWriter({
  postID,
  parentID,
  setParentID,
  refetchPostDetail,
}: any) {
  const [textValue, setTextValue] = useState("");
  const [isShowIconModal, setIsShowIconModal] = useState(false);
  const [selectedPackgeID, setSelectedPackageID] = useState();
  const [chosenIcon, setChosenIcon] = useState<any>();
  const queryClient = useQueryClient();

  const sendMessage = async () => {
    if (!textValue && !chosenIcon) {
      alert("댓글을 입력해주세요.");
      return;
    }

    let response;
    if (chosenIcon !== undefined) {
      const payload = {
        emoticonId: chosenIcon?.id,
        ...(parentID && { parentCommentId: parentID }),
        size: 100,
      };
      response = await commentIconOnPost(postID, payload);
    } else {
      const payload = {
        content: textValue,
        ...(parentID && { parentCommentId: parentID }),
      };
      response = await commentOnPost(postID, payload);
    }

    if (response?.data?.success) {
      setTextValue("");
      setIsShowIconModal(false);
      setChosenIcon(undefined);

      // getCommentsByPostID(postID).then((response) => {
      //   const comments = response.data.comments;
      //   dispatch(saveComments(comments));
      //   setParentID(null);
      // });
      refetchPostDetail();

      await queryClient.prefetchQuery({
        queryKey: ["comments_Query", postID],
        queryFn: () =>
          getCommentsByPostID(postID).then(
            (response) => response.data.comments
          ),
      });

      setParentID(null);
    }
  };

  const { data: iconPackages } = useQuery({
    queryKey: ["iconPackages_Query"],
    queryFn: () =>
      getAllEmoticonPackages().then(
        (response: any) => response.data?.emoticonPackages?.data
      ),
    onSuccess: (data) => {
      setSelectedPackageID(data[0].id);
    },
    staleTime: Infinity,
  });

  const { data: showIcons } = useQuery({
    queryKey: ["iconsByPackgeID_Query", selectedPackgeID],
    queryFn: () =>
      get_All_Emoicon_By_PackageID(selectedPackgeID).then(
        (response: any) => response.data?.emoticonPackage?.emoticons
      ),
    staleTime: Infinity,
    enabled: selectedPackgeID !== undefined,
  });

  return (
    <>
      <div className="comment_write">
        {isShowIconModal && chosenIcon && (
          <div className="emoticon_preview">
            <button onClick={() => setChosenIcon(undefined)}>
              <img src={close_white_icon} alt="닫기" />
            </button>
            <img src={chosenIcon?.url_340} alt="이모티콘" />
          </div>
        )}
        <div>
          <textarea
            //type="text"
            placeholder="이모티콘 보내기"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onFocus={() => {
              // setIsShowIconModal(false);
              //setChosenIcon(undefined);
            }}
          />
          {!textValue && (
            <button onClick={() => setIsShowIconModal(true)}>
              <img src={smiley_icon} alt="등록" />
            </button>
          )}
          <button onClick={() => sendMessage()}>
            <img src={send_icon} alt="등록" />
          </button>
        </div>
      </div>

      {isShowIconModal && (
        <div className="comment_emoticon">
          <div className="emoticon_filter">
            <ul>
              {iconPackages?.map((iconPackage: any) => (
                <li
                  key={`iconPackages-${iconPackage.id}`}
                  onClick={() => {
                    setSelectedPackageID(iconPackage.id);
                  }}
                  className={iconPackage.id == selectedPackgeID ? "active" : ""}
                >
                  <div>
                    <img src={iconPackage.main_emoticon.url} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="emoticon_container">
            <ul>
              {showIcons?.map((emoicon: any) => (
                <li
                  key={`emoicon-${emoicon.id}`}
                  onClick={() => setChosenIcon(emoicon)}
                >
                  <img src={emoicon?.url_340} alt="이모티콘" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default CommentWriter;
