import Header from "@/components/header";
import "./index.scss";
import writer_select_category from "@/assets/icons/writer_select_category.svg";
import writer_warning_mark from "@/assets/icons/writer_warning_mark.svg";
import writer_close_warning from "@/assets/icons/writer_close_warning.svg";
import writer_close_image from "@/assets/icons/writer_close_image.svg";
import writer_upload_image from "@/assets/icons/writer_upload_image.svg";
import privacy_arrow_down_icon from "@/assets/icons/privacy_arrow_down.svg";
import { useRef, useState } from "react";
import Modal from "@/components/modal";
import {
  EditPost,
  getPostByID,
  get_all_categories,
  writeNewPost,
} from "@/services/community";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function PostWriter() {
  const multipleImageRef = useRef<HTMLInputElement>(null);

  const [postImages, setPostImages] = useState<any[]>([]);
  const [postContent, setPostContent] = useState("");
  const [isSecret, setIsSecret] = useState(0);
  const [chosenCategory, setChosenCategory] = useState<any>();
  const [isShowModal, setIsShowModal] = useState<number | boolean>(false);
  const [removedImageIds, setRemoveImageIds] = useState<any[]>([]);

  let { id: postID } = useParams();
  const isEdit = !!postID;
  if (isEdit) {
    const results = useQueries({
      queries: [
        {
          queryKey: ["categories_Query"],
          queryFn: () =>
            get_all_categories().then(
              (response) => response.data.postCategories
            ),
          staleTime: Infinity,
        },
        {
          queryKey: ["postDetail_Query", postID],
          queryFn: () =>
            getPostByID(postID).then((response: any) => response.data?.post),
          onSuccess: (data: any) => {
            setPostImages(data.images);
            setPostContent(data.content);
            setIsSecret(data.is_secret);
          },
          enabled: !(postImages?.length > 0 || postContent),
        },
      ],
    });

    if (results[0].isSuccess && results[1].isSuccess && !chosenCategory) {
      const listCate = results[0].data;
      const postData = results[1].data;

      const chosenCate = listCate?.filter(
        (cate: any) => cate.id == postData?.post_category_id
      )[0];

      setChosenCategory(chosenCate);
    }
  }

  const openFileDialog = () => {
    if (postImages.length >= 10) {
      alert("이미지는 최대 10장까지 첨부 가능합니다.");
      return;
    }
    multipleImageRef.current?.click();
  };

  const handleFileSelect = (e: any) => {
    const fileArray = e.target.files;

    if (postImages.length + fileArray?.length > 10) {
      alert("이미지는 최대 10장까지 첨부 가능합니다.");
      return;
    }

    let chosenImages: any[] = [];
    for (let i = 0; i < fileArray.length; i++) {
      let file = fileArray[i];
      chosenImages.push({
        file: file,
        url: URL.createObjectURL(file),
        size: file.size,
      });
    }
    setPostImages((preState) => [...preState, ...chosenImages]);
  };

  const removeAFile = (index: number, file: any) => {
    const newArr = postImages.filter((i, ind) => ind !== index);
    setPostImages(newArr);

    if (file?.id) setRemoveImageIds((preState) => [...preState, file.id]);
  };

  const totalSize = postImages.reduce(
    (previousValue, current) => previousValue + current.size,
    0
  );

  return (
    <div className="wrap post-writer-container">
      <Header
        title={
          <h2 onClick={() => setIsShowModal(1)}>
            <div>
              <div>{isSecret ? "나만보기" : "전체보기"}</div>
            </div>
            <img src={privacy_arrow_down_icon} alt="arrow" />
          </h2>
        }
      >
        <button
          className="header_activity_right_btn"
          onClick={() => setIsShowModal(3)}
        >
          등록
        </button>
      </Header>
      {isShowModal == 1 && (
        <PrivacyModal
          onClose={() => setIsShowModal(false)}
          setIsSecret={setIsSecret}
        />
      )}

      <button className="select_category" onClick={() => setIsShowModal(2)}>
        <span>{chosenCategory?.name || "게시글의 주제를 선택해 주세요."}</span>
        <img src={writer_select_category} alt="icon select category" />
      </button>
      {isShowModal == 2 && (
        <CategoriesModal
          setChosenCategory={setChosenCategory}
          onClose={() => setIsShowModal(false)}
        />
      )}

      {isShowModal == 3 && (
        <ConfirmModal
          postID={postID}
          onClose={() => setIsShowModal(false)}
          isEdit={isEdit}
          isSecret={isSecret}
          chosenCategory={chosenCategory}
          postContent={postContent}
          postImages={postImages}
          removedImageIds={removedImageIds}
        />
      )}

      <main>
        <section className="write_post_wrap">
          <div>
            <div className="write_post_container">
              <Warning />
              <div className="write_post_img">
                {postImages.map((img, index) => (
                  <div key={`images-list-${index}`}>
                    <img src={img.url} />
                    <button onClick={() => removeAFile(index, img)}>
                      <img src={writer_close_image} alt="writer close image" />
                    </button>
                    <span>{(img.size / (1024 * 1024)).toFixed(2)}MB</span>
                  </div>
                ))}
              </div>
              <div className="board_row">
                <div className="write_post_content" style={{ height: "50vh" }}>
                  <textarea
                    placeholder="눈팅러의 이야기를 들려주세요."
                    value={postContent}
                    onChange={(e) => {
                      setPostContent(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div>
              <input
                type="file"
                ref={multipleImageRef}
                style={{ display: "none" }}
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => handleFileSelect(e)}
                multiple
              />
            </div>
            <button
              className="write_post_footer"
              onClick={() => openFileDialog()}
            >
              <img src={writer_upload_image} alt="upload image" />
              <p>
                {postImages.length}/10
                <span>
                  ({(totalSize / (1024 * 1024)).toFixed(2)}MB / 100MB){" "}
                </span>
              </p>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function Warning() {
  const [isShow, setIsShow] = useState(true);
  return (
    <>
      {isShow && (
        <div className="board_row">
          <div className="write_post_warning">
            <p className="write_post_warning_title">
              <img src={writer_warning_mark} alt="writer warning mark" />글 작성
              주의사항
              <button onClick={() => setIsShow(false)}>
                <img src={writer_close_warning} alt="writer close warning" />
              </button>
            </p>
            <p className="write_post_warning_content">
              눈팅 앱에서 규정한 운영규칙 위반 내용의 게시물 작성 시 커뮤니티
              이용에 제한이 생길 수 있습니다.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function PrivacyModal({ onClose, setIsSecret }: any) {
  return (
    <Modal
      modalBox={
        <div className="modal_box set_privacy_modal_box">
          <ul>
            <li
              onClick={() => {
                setIsSecret(1);
                onClose();
              }}
            >
              <div style={{ verticalAlign: "inherit" }}>
                <div style={{ verticalAlign: "inherit" }}>나만보기</div>
              </div>
            </li>
            <li
              onClick={() => {
                setIsSecret(0);
                onClose();
              }}
            >
              <div style={{ verticalAlign: "inherit" }}>
                <div style={{ verticalAlign: "inherit" }}>전체보기</div>
              </div>
            </li>
            <li onClick={() => onClose()}>
              <div style={{ verticalAlign: "inherit" }}>
                <div style={{ verticalAlign: "inherit" }}>취소</div>
              </div>
            </li>
          </ul>
        </div>
      }
    />
  );
}

function CategoriesModal({ setChosenCategory, onClose }: any) {
  const { data: allCategories } = useQuery({
    queryKey: ["categories_Query"],
    queryFn: () =>
      get_all_categories().then((response) => response.data.postCategories),
    staleTime: Infinity,
  });

  return (
    <Modal
      header={
        <div>
          <h3>주제 선택</h3>
          <p>게시글의 주제를 선택해 주세요.</p>
        </div>
      }
      content={
        <div className="modal_box_content select_category_modal_box_content">
          <ul className="select_category_list">
            {allCategories?.map((category: any) => (
              <li
                key={`categoryKey-${category.id}`}
                onClick={() => {
                  setChosenCategory(category);
                  onClose();
                }}
              >
                <button>
                  <span />
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
}

function ConfirmModal({
  postID,
  onClose,
  isEdit,
  isSecret,
  chosenCategory,
  postContent,
  postImages,
  removedImageIds,
}: any) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const submitPost = async () => {
    if (!chosenCategory) {
      onClose();
      alert("게시글의 주제를 선택해 주세요.");
      return;
    }

    if (!postContent) {
      onClose();
      alert("게시글을 입력해 주세요.");
      return;
    }

    let formData = new FormData();
    formData.append("isSecret", isSecret.toString());
    formData.append("postCategoryId", chosenCategory.id);
    formData.append("subject", "default subject");
    formData.append("content", postContent);
    for (let i = 0; i < postImages.length; i++) {
      if (postImages[i]?.file)
        formData.append("uploadedImages[]", postImages[i].file);
    }
    removedImageIds.forEach((imageId: any) => {
      if (imageId) formData.append("removedImageIds[]", imageId);
    });

    const res = isEdit
      ? await EditPost(formData, postID)
      : await writeNewPost(formData);
    if (res.data.success) {
      const id = postID || res.data.newPost.id;
      await queryClient.prefetchQuery({
        queryKey: ["postDetail_Query", id],
        queryFn: () => getPostByID(id).then((response) => response.data?.post),
      });
      navigate("/detail/" + id + location.search);
    }
  };

  return (
    <Modal
      content={
        <div className="modal_des_box">
          <p>게시글을 등록하시겠습니까?</p>
        </div>
      }
      footer={
        <>
          <button className="acceptButton" onClick={() => submitPost()}>
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

export default PostWriter;
