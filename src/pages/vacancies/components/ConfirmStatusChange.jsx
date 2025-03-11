import Popup from "masterComponents/Popup";
import MainButton from "masterComponents/MainButton";
import Textarea from "masterComponents/Textarea";
import { useVacanciesStore } from "../store/VacanciesStore";
import { setUpdateVacancyStatus } from "../api/VacanciesApi";
import { useState } from "react";
import { storeActionTypes } from "../constants";

export const ConfirmStatusChange = () => {
  const [textValue, setTextValue] = useState("");
  const { confirmStatusChangeTo, setConfirmStatusChangeTo, setActionTrigger } =
    useVacanciesStore((state) => state);

  const setUpdateStatus = async () => {
    await setUpdateVacancyStatus({
      VacancyID: confirmStatusChangeTo?.id ?? null,
      NewStatusID: confirmStatusChangeTo?.status ?? null,
      Reason: textValue ?? "",
    }).then((response) => {
      setConfirmStatusChangeTo(null);
      setActionTrigger(storeActionTypes.REQUEST_ACTIONS.GET_VACANCY_BOARD_DATA);
    });
  };

  return (
    <Popup
      visible={!!confirmStatusChangeTo}
      options={{ title: "Write a reason text", mode: "normal" }}
      size={"small"}
    >
      <Textarea
        onChange={(value) => setTextValue(value)}
        textareaStyle={{
          resize: "none",
          width: "100%",
          border: "0.0625rem solid #D1D5D6",
        }}
        placeholder={"Type comment here..."}
      />
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <MainButton
          label={"Cancel"}
          type={"border"}
          size={"small"}
          customStyle={{ color: "#141719", borderColor: "#D1D5D6" }}
          onClick={() => setConfirmStatusChangeTo(null)}
        />
        <MainButton
          label={"Confirm"}
          onClick={setUpdateStatus}
          size={"small"}
          customStyle={{
            background: "#D03053",
            border: "0.0625rem solid #D03053",
            color: "#fff",
          }}
        />
      </div>
    </Popup>
  );
};
