import React, { useEffect, useState } from "react";
import FormMultiSelectDropdown from "masterComponents/FormMultiSelectDropdown";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import IconDrag from "@/assets/icons/other/IconDrag";
import style from "@/pages/vacancies/style/steps/SortableStages.module.scss";
import IconExpandArrow from "@/assets/icons/other/IconExpandArrow";
import IconExpandArrowColored from "@/assets/icons/other/IconExpandArrowColored";
import { getCriteriaGroup } from "../api/VacanciesApi";
import Tag from "masterComponents/Tag";

export const SortableStageItem = ({
  index,
  item,
  onExpand,
  onCriteriaChange,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const [criterias, setCriterias] = useState([]);

  const getCurrentItemData = async () => {
    try {
      const response = await getCriteriaGroup({
        ID: item.CriteriaGroupID,
      });
      const chosenCriterias = JSON.parse(item?.itemsJson)
        ? JSON.parse(item?.itemsJson)
        : [];
      if (response?.data) {
        const dataMap = response.data.map((criteria) => ({
          ...criteria,
          id: criteria.CriteriaID,
          label: criteria.Name ?? "empty",
          selected:
            chosenCriterias.includes(criteria.CriteriaID) || criteria.Selected,
        }));
        setCriterias(dataMap);
      }
    } catch (error) {
      console.error("Error fetching criteria data:", error);
    }
  };

  // useEffect(() => {
  //   if (item.expanded) {
  //     if (criterias && criterias.length)
  //       setCriterias((prev) => {
  //         const newCriterias = [...prev];
  //         newCriterias.forEach((e) => (e["selected"] = false));
  //         return newCriterias;
  //       });
  //     // getCurrentItemData();
  //   }
  // }, [item.expanded]);

  useEffect(() => {
    getCurrentItemData();
  }, []);

  return (
    <div
      ref={setNodeRef}
      className={`${style.sortableItem} ${item.expanded ? style.expanded : ""}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
    >
      <div className={style.topContent}>
        <div className={style.leftSide}>
          <div {...listeners} className={style.grabIcon}>
            <span role="img" aria-label="drag">
              <IconDrag />
            </span>
          </div>

          <span className={style.orderIndex}>{index}</span>
          <span className={style.itemTitle}>{item.Name}</span>
        </div>

        <div className={style.rightSide}>
          {item?.IsCommon ? <span>Is Common</span> : ""}
          <div
            className={style.expandIcon}
            onClick={() => onExpand(item.id, !item.expanded)}
          >
            {item?.expanded ? <IconExpandArrowColored /> : <IconExpandArrow />}
          </div>
        </div>
      </div>

      <div
        className={style.bottomContent}
        style={{ display: item.expanded ? "flex" : "none" }}
      >
        <FormMultiSelectDropdown
          label="Criteria"
          data={criterias}
          withApply={false}
          fixedDropdown={true}
          change={(array) => {
            setCriterias((prev) => {
              const newCriterias = [...prev];
              newCriterias.forEach((el) => {
                if (array.map((e) => e.CriteriaID).includes(el.id))
                  el.selected = true;
                else el.selected = false;
              });
              return newCriterias;
            });
            onCriteriaChange(
              item?.ID,
              array.map((e) => e.CriteriaID)
            );
          }}
        />
        <ul className={style.criteriaTags}>
          {criterias &&
            criterias
              .filter((el) => el.selected)
              .map((criteria, ind) => {
                return (
                  <li key={ind}>
                    <Tag
                      label={criteria?.Name}
                      type={"yellow"}
                      withIcon={false}
                      allowDelete={false}
                    />
                  </li>
                );
              })}
        </ul>
      </div>
    </div>
  );
};
