import "./index.scss";
import Header from "@/components/header";
import noonting_edit_icon from "@/assets/icons/noonting_edit.svg";
import Modal from "@/components/modal";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  deleteAvatar,
  getMyInfo,
  patchName,
  uploadAvatar,
} from "@/services/community";
import default_avatar from "@/assets/images/deafault_avatar.svg";

function EditProfile() {
  const imageRef = useRef<HTMLInputElement>(null);

  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [isShowImageModal, setIsShowImageModal] = useState(false);
  const [avatar, setAvatar] = useState<any>({
    file: null,
    url: "",
    type: "old",
  });
  const [name, setName] = useState<string>("");

  useQuery({
    queryKey: ["myInfo"],
    queryFn: () => getMyInfo().then((res) => res.data.user),
    onSuccess: (data) => {
      setName(data.name);
      const avatarInfo = {
        file: null,
        url: data.profile_image?.url_180,
        type: "old",
      };
      setAvatar(avatarInfo);
    },
    enabled: !(name || avatar.url),
  });

  const setDefaultAvatar = () => {
    setAvatar({ type: "default" });
  };

  const handleFileSelect = (e: any) => {
    const file = e.target.files[0];
    const avatarInfo = {
      file: file,
      url: URL.createObjectURL(file),
      type: "new",
    };
    setAvatar(avatarInfo);
    setIsShowImageModal(false);
  };

  async function submitEdit() {
    if (name.length < 3) {
      alert("닉네임은 3글자 이상 입력해주세요.");
      setIsShowConfirmModal(false);
      return;
    }

    await patchName(name);
    switch (avatar.type) {
      case "old":
        break;
      case "default":
        await deleteAvatar();
        break;
      case "new":
        let formData = new FormData();
        formData.append("uploadedImage", avatar.file);
        await uploadAvatar(formData);
        break;
    }
    setIsShowConfirmModal(false);
  }

  return (
    <div className="wrap">
      <Header title="프로필 수정">
        <button
          className="header_activity_right_btn"
          onClick={() => setIsShowConfirmModal(true)}
        >
          수정
        </button>
      </Header>

      {isShowConfirmModal && (
        <ConfirmModal
          onClose={() => setIsShowConfirmModal(false)}
          submitEdit={submitEdit}
        />
      )}

      {isShowImageModal && (
        <ImageSelectModal
          onClose={() => setIsShowImageModal(false)}
          setDefaultAvatar={setDefaultAvatar}
          imageRef={imageRef}
        />
      )}

      <main>
        <section className="edit_profile_wrap">
          <div className="edit_profile_container">
            <div
              className="profile_img"
              onClick={() => setIsShowImageModal(true)}
            >
              <img src={avatar?.url || default_avatar} alt="프로필 이미지" />
              <button>
                <img src={noonting_edit_icon} alt="수정" />
              </button>
              <input
                type="file"
                accept="image/png, image/gif, image/jpeg"
                style={{ display: "none" }}
                ref={imageRef}
                onChange={(e) => handleFileSelect(e)}
              />
            </div>
            <div className="nickname_box">
              <p>닉네임</p>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ConfirmModal({ onClose, submitEdit }: any) {
  return (
    <Modal
      content={
        <div className="modal_des_box">
          <p>수정하시겠습니까?</p>
        </div>
      }
      footer={
        <>
          <button className="acceptButton" onClick={() => submitEdit()}>
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

function ImageSelectModal({ onClose, setDefaultAvatar, imageRef }: any) {
  return (
    <Modal
      modalBox={
        <div className="modal_box more_modal_box">
          <ul>
            <li onClick={() => imageRef?.current?.click()}>앨범에서 선택</li>
            <li
              onClick={() => {
                setDefaultAvatar();
                onClose();
              }}
            >
              기본 이미지로 변경
            </li>
            <li onClick={() => onClose()}>취소</li>
          </ul>
        </div>
      }
    />
  );
}

export default EditProfile;
