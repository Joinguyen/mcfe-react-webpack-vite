import "./index.scss";
import Modal from "@/components/modal";
import { CategoryFilterModalType } from "@/types/components.type";
import { useState } from "react";

function CategoryFilterModal({
  categories,
  setIsOpenModal,
  selectedCategories,
  saveSelection,
}: CategoryFilterModalType) {
  const [selection, setSelection] = useState<number[]>(selectedCategories);

  return (
    <Modal
      header={
        <>
          <h3>전체 주제 목록</h3>
          <p>관심있는 주제에 체크하여 게시글을 둘러보세요.</p>
        </>
      }
      content={
        <ul className="modal_content_filter">
          {categories.map((i) => {
            const selectionKey = `category_selection-${i.id.toString()}`;

            return (
              <li key={selectionKey}>
                <input
                  type="checkbox"
                  id={selectionKey}
                  onChange={() => {
                    if (!selection.includes(i.id))
                      setSelection((preState) => [...preState, i.id]);
                    else
                      setSelection((preState) =>
                        preState.filter((item) => item != i.id)
                      );
                  }}
                  defaultChecked={selectedCategories.includes(i.id)}
                />
                <label htmlFor={selectionKey}>
                  {i.name}
                  <span />
                </label>
              </li>
            );
          })}
        </ul>
      }
      footer={
        <>
          <button
            className="acceptButton"
            style={{ marginBottom: "10px" }}
            onClick={() => {
              saveSelection(selection);
              setIsOpenModal(false);
            }}
          >
            설정완료
          </button>
          <button
            className="cancelButton"
            onClick={() => setIsOpenModal(false)}
          >
            취소
          </button>
        </>
      }
    />
  );
}

export default CategoryFilterModal;
