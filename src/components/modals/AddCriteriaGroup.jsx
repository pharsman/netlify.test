import { useEffect, useState } from "react";

import FormInput from "masterComponents/FormInput";
import Tag from "masterComponents/Tag";
import Textarea from "masterComponents/Textarea";
import FormMultiSelectDropdown from "masterComponents/FormMultiSelectDropdown";
import Button from "../Button";

import { useStore } from "@/store/zuStore.js";
import {
  createCriteriaGroup,
  getCriteriaForDropdown,
  updateCriteriaGroup,
  getCriteriaGroup,
} from "@/api/api";

import arrow from "@/assets/icons/grid/arrow.svg";

import styles from "./modals.module.scss";

//asd

function AddCriteriaGroup() {
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    CriteriasJson: [],
  });
  const [ddData, setddData] = useState(null);
  const setModalStatus = useStore((state) => state.setModalStatus);
  const modalStatus = useStore((state) => state.modalStatus);
  const runReloadCriteriaGroup = useStore(
    (state) => () => state.toggleReload("reloadCriteriaGroup")
  );

  const addCriteriaGroup = async () => {
    if (modalStatus.data) {
      const resp = await updateCriteriaGroup({
        ...formData,
        ID: modalStatus.data.CriteriaGroupID,
        CriteriasJson: JSON.stringify(formData.CriteriasJson),
      });
      if (resp.data) {
        setModalStatus(false, null);
        runReloadCriteriaGroup();
      }
    } else {
      const resp = await createCriteriaGroup({
        ...formData,
        CriteriasJson: JSON.stringify(formData.CriteriasJson),
      });
      if (resp.data) {
        setModalStatus(false, null);
        runReloadCriteriaGroup();
      }
    }
  };

  const getDDdata = async () => {
    const resp = await getCriteriaForDropdown();
    setddData(resp.data.map((el) => ({ label: el.Name, id: el.ID })));
  };

  const getDDedit = async () => {
    const resp = await getCriteriaGroup(modalStatus.data.CriteriaGroupID);
    setddData(
      resp.data.map((el) => ({
        label: el.Name,
        id: el.CriteriaID,
        selected: el.Selected,
      }))
    );
  };

  const checkTextareaOverflow = () => {
    const textarea = document
      .getElementById("myTextarea")
      ?.querySelector("textarea");
    if (textarea) {
      const isOverflowing = textarea.scrollHeight > textarea.clientHeight;
      const showArrow = document.getElementById("showarrow");

      if (isOverflowing) {
        showArrow.style.visibility = "visible";
      } else {
        showArrow.style.visibility = "hidden";
      }
    }
  };

  useEffect(() => {
    if (modalStatus.data) {
      getDDedit();
      setFormData({
        Name: modalStatus.data.Name,
        Description: modalStatus.data.Description,
        CriteriaGroupID: null,
      });
    } else {
      getDDdata();
    }
    checkTextareaOverflow();
  }, []);

  useEffect(() => {
    checkTextareaOverflow();
  }, [formData.Description]);

  return (
    <div className={styles.drawer}>
      <div className={styles.sectionContainer}>
        <FormInput
          isRequired={true}
          label="Criteria Group Name"
          onChange={(value) => {
            setFormData({ ...formData, Name: value });
          }}
          value={formData.Name}
        />
      </div>

      <div
        className={styles.sectionContainer}
        id="myTextarea"
        style={{ position: "relative" }}
      >
        <Textarea
          placeholder="Type description here..."
          value={formData.Description}
          cols={40}
          onChange={(value) => {
            setFormData({ ...formData, Description: value });
          }}
        />
        <div
          id="showarrow"
          style={{
            position: "absolute",
            right: 2,
            bottom: 30,
            transform: "rotate(180deg)",
            visibility: "hidden",
          }}
        >
          <img src={arrow} alt="arrow" />
        </div>
      </div>
      <div className={styles.sectionContainer}>
        <FormMultiSelectDropdown
          isRequired={true}
          label={"Select criterias"}
          disabled={false}
          initialLoad={true}
          data={ddData}
          change={(selectedOptions) =>
            setFormData({
              ...formData,
              CriteriasJson: selectedOptions.map((el) => el.id),
            })
          }
          fixedDropdown={true}
        />
      </div>
      <div
        className={styles.sectionContainer}
        style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
      >
        {ddData &&
          ddData.map(
            (el) =>
              el.selected && (
                <div>
                  <Tag
                    id={el.id}
                    type={"coolBlue"}
                    label={el.label}
                    withIcon={false}
                    // allowDelete={true}
                    // onDelete={(id) =>
                    //   setddData()
                    // }
                  />
                </div>
              )
          )}
      </div>
      <div>
        <Button
          label={"Close"}
          customStyle={{
            marginRight: "16px",
            backgroundColor: "transparent",
            border: "1px solid var(--color-stroke-strong-initial)",
            color: "var(--color-text-strong-default)",
          }}
          onClick={() => setModalStatus(false, null)}
        />
        <Button
          label={"Save"}
          onClick={() => addCriteriaGroup()}
          disabled={!formData.Name.trim() || formData.CriteriasJson?.length < 1}
        />
      </div>
    </div>
  );
}

export default AddCriteriaGroup;
