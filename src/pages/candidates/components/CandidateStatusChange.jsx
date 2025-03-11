import { useState, useRef } from "react";
import Popup from "masterComponents/Popup";
import MainButton from "masterComponents/MainButton";
import Textarea from "masterComponents/Textarea";
import FormDropdown from "masterComponents/FormDropdown";
import { useCandidatesStore } from "../store/CandidatesStore";
import { setCandidateVacancyStatus } from "../api/CandidatesApi";
import { CandidateActionTypes } from "../constants";
export const CandidateStatusChange = () => {
  const { changeStatusTo, setChangeStatusTo, setActionTrigger } =
    useCandidatesStore();
  const [comment, setComment] = useState("");
  const selectedStatus = useRef(changeStatusTo?.StatusID);
  const [statuses, setStatuses] = useState([
    {
      label: "Without Status",
      id: 1,
    },
    {
      label: "Offer Accepted",
      id: 2,
    },
    {
      label: "Hired",
      id: 3,
    },
    {
      label: "On Hold",
      id: 4,
    },
    {
      label: "Reserved",
      id: 5,
    },
    {
      label: "Offer Rejected",
      id: 6,
    },
    {
      label: "Candidate Refusal",
      id: 7,
    },
    {
      label: "Offered",
      id: 8,
    },
    {
      label: "Under Review",
      id: 9,
    },
    {
      label: "Rejected",
      id: 10,
    },
  ]);

  const changeStatus = async () => {
    const dataSet = {
      CandidateID: changeStatusTo?.CandidateID,
      VacancyID: changeStatusTo?.VacancyID,
      NewStatusID: selectedStatus.current,
      Reason: comment,
    };

    try {
      await setCandidateVacancyStatus(dataSet).then((response) => {
        if (!response || response.data?.Error || response.Error) return;
        setChangeStatusTo(null);
        setActionTrigger(
          CandidateActionTypes.REQUEST_TYPES.RELOAD_CANDIDATES_DATA
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Popup
      visible={true}
      options={{ title: "Change Status", mode: "normal" }}
      size={"small"}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <FormDropdown
          label={"Status"}
          data={statuses}
          selectedOptionID={selectedStatus.current}
          fixedDropdown={true}
          skipSelected={true}
          selected={(option) => {
            selectedStatus.current = option.id;
          }}
        />

        <Textarea
          textareaStyle={{ width: "100%" }}
          placeholder="Type comment here..."
          value={comment}
          onChange={(value) => setComment(value)}
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
            onClick={() => {
              setChangeStatusTo(null);
              setActionTrigger(
                CandidateActionTypes.REQUEST_TYPES.RELOAD_CANDIDATES_DATA
              );
            }}
          />
          <MainButton
            label={"Save"}
            onClick={changeStatus}
            size={"small"}
            customStyle={{
              background: "#30ACD0",
              border: "0.0625rem solid #30ACD0",
              color: "#fff",
            }}
          />
        </div>
      </div>
    </Popup>
  );
};
