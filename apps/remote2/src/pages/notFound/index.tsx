import "./index.scss";
import not_found_images from "@/assets/images/not_found.svg";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="wrap">
      <div className="notFound">
        <section>
          <img src={not_found_images} alt="페이지를 찾을 수 없음 이미지" />
          <hgroup>
            <h1>페이지를 찾을 수 없습니다!</h1>
            <p>
              잠시후 다시 접속하시거나 권한 혹은 <br /> 페이지 주소가 정확한지
              확인하여 주시기 바랍니다.
            </p>
          </hgroup>
          <button onClick={() => navigate(-1)}>이전 페이지로 가기</button>
        </section>
      </div>
    </div>
  );
}

export default NotFoundPage;
