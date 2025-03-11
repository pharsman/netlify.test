import { useEffect, useState } from "react";
import { ApplyFormPreview } from "../../components/ApplyFormPreview";
import style from "@/pages/vacancies/style/Preview.module.scss";
export const Preview = ({ vacancyID }) => {
  useEffect(() => {
    document.querySelector(".mcPopup_global").style.width = "90%";
    return () => {
      document.querySelector(".mcPopup_global").style.width = "65.625rem";
    };
  }, []);

  return (
    <div className={style.previewWrapper}>
      <ApplyFormPreview vacancyID={vacancyID} />
    </div>
  );
};
