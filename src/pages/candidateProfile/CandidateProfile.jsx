import { useParams } from "react-router-dom";
import style from "./style/CandidateProfile.module.scss";
import IconBackArrow from "@/assets/icons/other/IconBackArrow";
import { useNavigate } from "react-router-dom";
import FormDropdown from "masterComponents/FormDropdown";
import MainButton from "masterComponents/MainButton";
import { useEffect, useState } from "react";
import { useCandidateProfileStore } from "./store/CandidateProfileStore";
import { CandidateBasicData } from "./components/CandidateBasicData";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { setCandidateVacancyStatus } from "../candidates/api/CandidatesApi";
import { createNotification } from "masterComponents/Notification";
import { Experience } from "./templates/Experience";
import { Education } from "./templates/Education";
import { Documents } from "./templates/Documents";
import { Messages } from "./templates/Messages";
import { Timeline } from "./templates/Timeline";
import { Other } from "./templates/Other";
import { Stages } from "./templates/Stages";
import { GenerateCV } from "./components/GenerateCV";

export const CandidateProfile = () => {
  const { vacancyID, candidateID } = useParams();
  const [sendCV, setSendCV] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const { tabs, currentTab, setCurrentTab, statusID } =
    useCandidateProfileStore();
  const [statuses, setStatuses] = useState([
    {
      label: "Without Status",
      id: 1,
      color: "#808080",
    },
    {
      label: "Offer Accepted",
      id: 2,
      color: "#0CA474",
    },
    {
      label: "Hired",
      id: 3,
      color: "#0CA474",
    },
    {
      label: "On Hold",
      id: 4,
      color: "#D08B30",
    },
    {
      label: "Reserved",
      id: 5,
      color: "#D08B30",
    },
    {
      label: "Offer Rejected",
      id: 6,
      color: "#E74C3C",
    },
    {
      label: "Candidate Refusal",
      id: 7,
      color: "#D03053",
    },
    {
      label: "Offered",
      id: 8,
      color: "#0CA474",
    },
    {
      label: "Under Review",
      id: 9,
      color: "#D08B30",
    },
    {
      label: "Rejected",
      id: 10,
      color: "#D03053",
    },
  ]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const navigate = useNavigate();

  if (!vacancyID || !candidateID) {
    return;
  }

  const changeStatus = async (id, prevStatus) => {
    try {
      await setCandidateVacancyStatus({
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
        NewStatusID: id,
        Reason: "",
      }).then((response) => {
        if (!response || response.data?.Error || response.Error) {
          setSelectedStatus(prevStatus);
          setRefresh((prev) => prev + 1);
          return;
        }
        createNotification(
          "Status changed successfully",
          "success",
          3500,
          "top-right",
          2
        );
        setSelectedStatus(id);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useUpdateEffect(() => {
    setSelectedStatus(statusID);
    setRefresh((prev) => prev + 1);
  }, [statusID]);

  useEffect(() => {
    return () => {
      // setCurrentTab(1);
    };
  }, []);

  return (
    <div className={style.profileContentWrapper}>
      <div className={style.profileHeader}>
        <div className={style.goBack} onClick={() => navigate(-1)}>
          <div>
            <IconBackArrow />
          </div>
          <span>Back</span>
        </div>
        <div className={style.exportAndStatus}>
          <div>
            <FormDropdown
              key={refresh}
              label={"Status"}
              data={statuses}
              selectedOptionID={selectedStatus}
              skipSelected={true}
              size={"small"}
              selected={(option) => {
                changeStatus(option.id, selectedStatus);
              }}
            />
          </div>
          <div>
            <MainButton
              label={"Generate CV"}
              size={"small"}
              type={"background"}
              onClick={() => setSendCV(true)}
              loading={sendCV}
              customStyle={{
                color: "var(--color-text-strong-inverted)",
                background: "var(--color-surface-high-inverted-initial)",
              }}
            />
          </div>
        </div>
      </div>
      <div className={style.profileBody}>
        <div className={style.profileMainDetails}>
          <CandidateBasicData />
        </div>
        <div className={style.profileBodyContent}>
          <div className={style.profileTabs}>
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`${style.profileTab} ${
                  currentTab === tab.id ? style.active : ""
                }`}
                onClick={() => setCurrentTab(tab.id)}
              >
                <span>{tab.label}</span>
              </div>
            ))}
          </div>
          <div className={style.profileContent}>
            {sendCV && <GenerateCV onDone={() => setSendCV(false)} />}
            {currentTab === 1 && <Stages />}
            {currentTab === 2 && <Experience />}
            {currentTab === 3 && <Education />}
            {currentTab === 4 && <Documents />}
            {currentTab === 5 && <Messages />}
            {currentTab === 6 && <Timeline />}
            {currentTab === 7 && <Other />}
          </div>
        </div>
      </div>
    </div>
  );
};
