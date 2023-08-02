import { useState } from "react";
import "./index.scss";
import Header from "@/components/header";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { reportPostAndComment } from "@/services/community";
import Modal from "@/components/modal";

function Report() {
  const [text, setText] = useState<string>("");
  const [reason, setReason] = useState<string>("잘못된 정보");
  const [isShowModal, setIsShowModal] = useState(false);

  const reportType = [
    {
      id: "wrongInfo",
      value: "잘못된 정보",
    },
    {
      id: "unrelated",
      value: "관계없는 내용",
    },
    {
      id: "adult",
      value: "음란물/외설적 내용",
    },
    {
      id: "swearing",
      value: "욕설/비방 표현",
    },
    {
      id: "copyright",
      value: "저작권 침해",
    },
    {
      id: "etc",
      value: "기타",
    },
  ];

  return (
    <div className="wrap">
      <Header title="신고하기">
        <button
          className="header_activity_right_btn"
          onClick={() => setIsShowModal(true)}
        >
          신고
        </button>
      </Header>
      {isShowModal && (
        <ConfirmModal
          reason={reason}
          text={text}
          onClose={() => setIsShowModal(false)}
        />
      )}
      <main>
        <section className="report_wrap">
          <div className="report_container">
            <h3>신고사유</h3>
            <ul>
              {reportType.map((report) => (
                <li
                  key={`report-radio-${report.id}`}
                  onClick={() => setReason(report.value)}
                >
                  <input
                    type="radio"
                    id={report.id}
                    name="report-type-group"
                    checked={reason == report.value}
                    onChange={() => {}}
                  />
                  <span />
                  <label htmlFor={report.id}>{report.value}</label>
                </li>
              ))}

              <li>
                <textarea
                  placeholder="신고사유를 입력해 주세요."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

function ConfirmModal({ onClose, reason, text }: any) {
  const [searchParams] = useSearchParams();

  async function report() {
    const res = await reportPostAndComment({
      type: searchParams.get("type"), //1report user 2report post 3report comment
      reportedUserId: searchParams.get("reportedUserId"),
      boardId: searchParams.get("boardId"),
      postId: searchParams.get("postId"),
      commentId: searchParams.get("commentId"),
      reason: reason,
      reasonDetail: text,
    });

    if (res.data.success) window.history.back();
  }

  return (
    <Modal
      content={
        <div className="modal_des_box">
          <p>신고하시겠습니까?</p>
        </div>
      }
      footer={
        <>
          <button className="acceptButton" onClick={() => report()}>
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

export default Report;
