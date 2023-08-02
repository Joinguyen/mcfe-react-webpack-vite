import { get_all_categories } from "@/services/community";
import "./index.scss";
import { useEffect, useState } from "react";
import filter_icon from "@/assets/icons/filter.svg";
import CategoryFilterModal from "../category-filter-modal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import React from "react";

function Categories({ chosenCategory, setChosenCategory }: any) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showCategories, setShowCategories] = useState<number[]>([]);

  const allCategories = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    setShowCategories(allCategories?.map((i) => i.id));
    if (!chosenCategory) setChosenCategory(0);
  }, [allCategories]);

  return (
    allCategories && (
      <div className="categories_section">
        <button
          className="filter_adjustment"
          onClick={() => setIsOpenModal(true)}
        >
          <img src={filter_icon} alt="filter icon" />
        </button>

        <ul className="filter_category_list">
          <li key="0" onClick={() => setChosenCategory(0)}>
            <input
              type="radio"
              id="0"
              name="postCategoryGroup"
              checked={0 === chosenCategory}
              onChange={() => {}}
            />
            <label htmlFor="0">전체</label>
          </li>
          {allCategories.map((i: any) => {
            const key_prefix = `category_list-`;
            if (showCategories.includes(i.id)) {
              const category_list_key = key_prefix + `${i.id}`;
              return (
                <li key={category_list_key}>
                  <input
                    type="radio"
                    id={category_list_key}
                    name="postCategoryGroup"
                    onClick={() => setChosenCategory(i.id)}
                    checked={i.id == chosenCategory}
                    onChange={() => {}}
                  />
                  <label htmlFor={category_list_key}>{i.name}</label>
                </li>
              );
            }
          })}
        </ul>

        {isOpenModal && (
          <CategoryFilterModal
            categories={allCategories}
            setIsOpenModal={setIsOpenModal}
            selectedCategories={showCategories}
            saveSelection={setShowCategories}
          />
        )}
      </div>
    )
  );
}

export default Categories;
