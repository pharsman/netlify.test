import { useEffect, useState } from "react";

import FormInput from "masterComponents/FormInput";
import CheckBox from "masterComponents/CheckBox";
import Textarea from "masterComponents/Textarea";
import Tooltip from "masterComponents/Tooltip";
import FormDropdown from "masterComponents/FormDropdown";
import Button from "../Button";
import arrow from "@/assets/icons/grid/arrow.svg";

import { useStore } from "@/store/zuStore.js";
import {
  createStage,
  updateStage,
  getCriteriaGroupsForDropdown,
} from "@/api/api";

import { IconInfoCircle } from "@/assets/icons/other/IconInfoCircle";

import styles from "./modals.module.scss";

function AddStage() {
  const [formData, setFormData] = useState({
    Name: "",
    IsCommon: null,
    Description: "",
    CriteriaGroupID: null,
  });
  const setModalStatus = useStore((state) => state.setModalStatus);
  const modalStatus = useStore((state) => state.modalStatus);
  const runReloadStages = useStore(
    (state) => () => state.toggleReload("reloadStages")
  );

  const [arr, setArray] = useState(null);

  const addSetupStage = async () => {
    if (modalStatus.data) {
      const resp = await updateStage({ ...formData, ID: modalStatus.data.ID });
      if (resp.data) {
        setModalStatus(false, null, null);
        runReloadStages();
      }
    } else {
      const resp = await createStage(formData);
      if (resp.data) {
        setModalStatus(false, null, null);
        runReloadStages();
      }
    }
  };

  const getArrayData = async () => {
    const resp = await getCriteriaGroupsForDropdown();
    setArray(resp.data.map((el) => ({ label: el.Name, id: el.ID })));
  };

  useEffect(() => {
    getArrayData();
    if (modalStatus.data) {
      setFormData({
        Name: modalStatus.data.Name,
        IsCommon: modalStatus.data.IsCommon,
        Description: modalStatus.data.Description,
        CriteriaGroupID: modalStatus.data.CriteriaGroupID,
      });
    }
  }, []);

  const checkTextareaOverflow = () => {
    const textarea = document
      .getElementById("myTextarea")
      ?.querySelector("textarea");
    if (textarea) {
      const isOverflowing = textarea.scrollHeight > textarea.clientHeight;
      console.log("Textarea is overflowing:", isOverflowing);
      const showArrow = document.getElementById("showarrow");

      if (isOverflowing) {
        showArrow.style.visibility = "visible";
      } else {
        showArrow.style.visibility = "hidden";
      }
    }
  };

  // Call checkTextareaOverflow whenever the description changes
  useEffect(() => {
    checkTextareaOverflow();
  }, [formData.Description]);

  return (
    <div className={styles.drawer}>
      <div className={styles.sectionContainer}>
        <FormInput
          isRequired={true}
          label="Stage Type Name"
          onChange={(value) => {
            setFormData({ ...formData, Name: value });
          }}
          value={formData.Name}
        />
      </div>
      <div className={styles.sectionContainer}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <CheckBox
            disabled={false}
            checked={formData.IsCommon}
            isRequired={false}
            bgColor={"#30ACD0"}
            change={(currentState) =>
              setFormData({ ...formData, IsCommon: currentState })
            }
          />
          <span
            style={{ marginLeft: "12px", marginRight: "8px", fontSize: "14px" }}
          >
            Is Common
          </span>
          <Tooltip
            label={
              "A particular stage is standart part of the process for every job vacancy"
            }
          >
            <div>
              <IconInfoCircle color={"var(--color-icon-softer-default)"} />
            </div>
          </Tooltip>
        </div>
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
          }}
        >
          <img src={arrow} alt="arrow" />
        </div>
      </div>
      <div className={styles.sectionContainer}>
        {arr && formData ? (
          <FormDropdown
            isRequired={false}
            label={"Scoring Criteria Group"}
            disabled={false}
            data={arr}
            selected={(selectedOption) =>
              setFormData({ ...formData, CriteriaGroupID: selectedOption.id })
            }
            fixedDropdown={true}
            selectedOptionID={
              formData.CriteriaGroupID ? formData.CriteriaGroupID : null
            }
          />
        ) : (
          <FormDropdown
            isRequired={false}
            label={"Scoring Criteria Group"}
            disabled={false}
            data={arr}
            selected={(selectedOption) =>
              setFormData({ ...formData, CriteriaGroupID: selectedOption.id })
            }
            fixedDropdown={true}
            selectedOptionID={null}
          />
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
          onClick={() => setModalStatus(false, null, null)}
        />
        <Button
          label={"Save"}
          onClick={() => addSetupStage()}
          disabled={!formData.Name.trim()}
        />
      </div>
    </div>
  );
}

export default AddStage;
