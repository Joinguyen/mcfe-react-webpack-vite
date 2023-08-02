import Modal from "@/components/modal";
import "./index.scss";
import Header from "@/components/header";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBlackList } from "@/services/community";
import default_avatar from "@/assets/images/deafault_avatar.svg";
import { removeOfBlockedList } from "@/services/community";
import NoData from "@/components/no-data";

function Blocked() {
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["blockedList_Query"],
    queryFn: () => getBlackList().then((response) => response.data.blacklists),
  });

  const [selectedUser, setSelectedUser] = useState<any>();

  return (
    <div className="wrap">
      <div>
        <Header title=" 차단된 사용자 " />

        {isShowConfirmModal && (
          <ConfirmModal
            onClose={() => setIsShowConfirmModal(false)}
            blacklistItemID={selectedUser?.id}
            refetchList={refetch}
          />
        )}

        <main>
          {data?.length == 0 ? (
            <NoData text="차단 목록이 없습니다." />
          ) : (
            <section className="blocked_user_wrap">
              <div className="blocked_user_container">
                <ul>
                  {data?.map((item: any) => (
                    <li key={`block-user-${item.id}`}>
                      <img
                        src={item.profile_image?.url_180 || default_avatar}
                        alt="프로필 이미지"
                      />
                      <p>{item?.blocked_user?.name}</p>
                      <button
                        onClick={() => {
                          setSelectedUser(item);
                          setIsShowConfirmModal(true);
                        }}
                      >
                        해제
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function ConfirmModal({ onClose, blacklistItemID, refetchList }: any) {
  async function remove() {
    await removeOfBlockedList(blacklistItemID);
    refetchList();
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

export default Blocked;
