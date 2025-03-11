import { useEffect, useState } from "react";
import { useStore } from "@/store/zuStore.js";
import Popup from "masterComponents/Popup";

import { useLocation } from "react-router-dom";

import AddStage from "./AddStage.jsx";
import AddCriteria from "./AddCriteria.jsx";
import AddCriteriaGroup from "./AddCriteriaGroup.jsx";
import AddFollowUp from "./AddFollowUp.jsx";

export default function ModalController() {
  const modalStatus = useStore((state) => state.modalStatus);
  const setModalStatus = useStore((state) => state.setModalStatus);

  let renderer = modalStatus.renderCase;
  let size;
  let modalName;
  let mode;

  if (renderer === "AddStage") {
    size = "xs";
    modalName = "Add Stage Type";
    mode = "drawer";
  } else if (renderer === "AddCriteria") {
    size = "small";
    modalName = "Add Criteria";
    mode = "drawer";
  } else if (renderer === "AddFollowUp") {
    size = "medium";
    modalName = "Add Follow Up";
    mode = "drawer";
  } else if (renderer === "AddCriteriaGroup") {
    size = "xs";
    modalName = "Add Criteria Group";
    mode = "drawer";
  }

  const renderfunc = () => {
    switch (renderer) {
      case "AddStage":
        return <AddStage></AddStage>;
      case "AddCriteria":
        return <AddCriteria></AddCriteria>;
      case "AddCriteriaGroup":
        return <AddCriteriaGroup></AddCriteriaGroup>;
      case "AddFollowUp":
        return <AddFollowUp></AddFollowUp>;
      default:
        return false;
    }
  };

  const location = useLocation();

  useEffect(() => {
    setModalStatus(false, null, null);
  }, [location]);

  return (
    <Popup
      visible={modalStatus.visible}
      size={size}
      onClickOutside={() => setModalStatus(false, null, null)}
      options={{
        title: modalName,
        type: renderer === "deleteNode" ? "error" : null,
        mode: mode ? mode : "default",
      }}
    >
      {renderfunc()}
    </Popup>
  );
}
