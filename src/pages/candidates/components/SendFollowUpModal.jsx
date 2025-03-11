import FormDropdown from "masterComponents/FormDropdown";
import { useCandidatesStore } from "../store/CandidatesStore";
import { useState, useRef, useEffect } from "react";
import Popup from "masterComponents/Popup";
import MainButton from "masterComponents/MainButton";
import {
  getFollowUps,
  getFollowUpContent,
  sendFollowUp as sendFollowUpApi,
} from "../api/CandidatesApi";
import { createNotification } from "masterComponents/Notification";
export const SendFollowUpModal = () => {
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);
  const [followUps, setFollowUps] = useState([]);
  const { sendFollowUpTo, setSendFollowUpTo } = useCandidatesStore();
  const [followUpContent, setFollowUpContent] = useState(null);

  const handleSendFollowUp = () => {
    if (!selectedFollowUp) return;
    sendFollowUpApi({
      CandidateVacancyIDs: JSON.stringify([
        ...(Array.isArray(sendFollowUpTo?.CandidateID)
          ? sendFollowUpTo.CandidateID.map((candidateId, index) => ({
              CandidateID: candidateId,
              VacancyID: sendFollowUpTo.VacancyID[index],
            }))
          : [
              {
                CandidateID: sendFollowUpTo?.CandidateID,
                VacancyID: sendFollowUpTo?.VacancyID,
              },
            ]),
      ]),
      FollowUpID: selectedFollowUp?.id,
    }).then((response) => {
      if (!response || response.Error || response.data.Error) return;
      createNotification(
        `Successfully Sent Follow Up`,
        "success",
        1000,
        "top-right",
        2
      );
      setSendFollowUpTo(null);
    });
  };

  useEffect(() => {
    getFollowUps({
      CandidateID: sendFollowUpTo?.CandidateID,
      VacancyID: sendFollowUpTo?.VacancyID,
    }).then((response) => {
      if (!response || response.Error || response.data.Error) return;
      const dataMap = response.data.map((el) => ({
        id: el.ID,
        label: el.Name,
      }));
      setFollowUps(dataMap);
    });
  }, [sendFollowUpTo]);

  useEffect(() => {
    if (selectedFollowUp?.id) {
      getFollowUpContent({
        FollowUpID: selectedFollowUp?.id,
      }).then((response) => {
        if (!response || response.Error || response.data.Error) return;
        setFollowUpContent(response.data[0] ? response.data[0] : null);
      });
    } else {
      setFollowUpContent(null);
    }
  }, [selectedFollowUp]);

  return (
    <Popup
      visible={true}
      options={{ title: "Send Follow Up", mode: "normal" }}
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
          label={"Follow Up"}
          data={followUps}
          selectedOptionID={selectedFollowUp?.id}
          fixedDropdown={true}
          skipSelected={true}
          withClear={true}
          selected={(option) => {
            setSelectedFollowUp(option);
          }}
        />
        {followUpContent?.BodyWithoutHtml && (
          <div
            style={{
              marginTop: "1rem",
              borderRadius: "0.25rem",
              border: "0.0625rem solid var(--color-stroke-softer-initial)",
              background: "var(--color-surface-canvas-initial)",
              padding: "1rem",
              maxHeight: "18.75rem",
              overflowY: "auto",
            }}
          >
            <span
              style={{
                color: "var(--color-text-strong-dark)",
                fontSize: "0.875rem",
                wordWrap: "break-word",
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: followUpContent?.Body }}
              />
            </span>
          </div>
        )}

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
            onClick={() => setSendFollowUpTo(null)}
          />
          <MainButton
            label={"Send"}
            onClick={handleSendFollowUp}
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
