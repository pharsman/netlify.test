import FormDropdown from "masterComponents/FormDropdown";
import { useCandidatesStore } from "../store/CandidatesStore";
import { useState, useEffect } from "react";
import MainButton from "masterComponents/MainButton";
import Popup from "masterComponents/Popup";
import {
  getVacancyJobs,
  setMoveCandidatesToCurrentList,
} from "../api/CandidatesApi";
import { createNotification } from "masterComponents/Notification";
import { CandidateActionTypes } from "../constants";
import Loader from "masterComponents/Loader";
import Tag from "masterComponents/Tag";

export const MoveToCurrentListModal = () => {
  const [loading, setLoading] = useState(false);
  const [vacancyJobs, setVacancyJobs] = useState([]);
  const [selectedVacancyJob, setSelectedVacancyJob] = useState(null);
  const { setMoveToCurrentList, moveToCurrentList, setActionTrigger } =
    useCandidatesStore();
  const [deleteCandidateIds, setDeleteCandidateIds] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVacancyJob) return;
    setLoading(true);
    try {
      await setMoveCandidatesToCurrentList({
        CandidatesJson: Array.isArray(moveToCurrentList?.CandidatesJson)
          ? JSON.stringify(
              moveToCurrentList.CandidatesJson.filter(
                (c) => !deleteCandidateIds.includes(c.CandidateID)
              ).map((c) => c.CandidateID)
            )
          : JSON.stringify([moveToCurrentList?.CandidateID]),
        NewVacancyID: selectedVacancyJob,
      }).then((response) => {
        if (!response || response.data?.Error || response.Error) return;
        setMoveToCurrentList(null);
        setActionTrigger(
          CandidateActionTypes.REQUEST_TYPES.RELOAD_CANDIDATES_DATA
        );
        createNotification(
          "Moved to current list",
          "success",
          1000,
          "top-right",
          2
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getVacancyJobsData = async () => {
    try {
      setLoading(true);
      await getVacancyJobs({
        PageSize: 100000,
      }).then((response) => {
        const jobs = response?.data ?? null;
        if (!jobs) return;
        setVacancyJobs(
          jobs.map((e) => ({
            id: e.VacancyID,
            label: `${e.VacancyName} - ${e.Status}`,
          }))
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVacancyJobsData();
  }, []);

  return (
    <Popup
      visible={true}
      options={{ title: "Move to current list", mode: "normal" }}
      size={"small"}
    >
      <form onSubmit={handleSubmit} style={{ height: "auto" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {moveToCurrentList?.CandidatesJson ? (
              moveToCurrentList.CandidatesJson.filter(
                (candidate) =>
                  !deleteCandidateIds.includes(candidate.CandidateID)
              ).map((candidate) => (
                <Tag
                  key={candidate.CandidateID}
                  label={candidate.CandidateName}
                  withIcon={false}
                  allowDelete={true}
                  onDelete={() => {
                    setDeleteCandidateIds([
                      ...deleteCandidateIds,
                      candidate.CandidateID,
                    ]);
                  }}
                />
              ))
            ) : moveToCurrentList?.CandidateName ? (
              <Tag label={moveToCurrentList.CandidateName} withIcon={false} />
            ) : null}
          </div>
          <FormDropdown
            label={"Job Vacancy"}
            data={vacancyJobs}
            selectedOptionID={selectedVacancyJob}
            fixedDropdown={true}
            skipSelected={true}
            withFilter={true}
            isRequired={true}
            withClear={true}
            selected={(option) => {
              setSelectedVacancyJob(option.id);
            }}
          />
          {loading ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Loader loading={true} circleColor={"#30ACD0"} />
            </div>
          ) : null}
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
              buttonType={"button"}
              customStyle={{ color: "#141719", borderColor: "#D1D5D6" }}
              onClick={() => {
                setMoveToCurrentList(null);
              }}
            />
            <MainButton
              label={"Move To Current List"}
              onClick={null}
              size={"small"}
              customStyle={{
                background: "#30ACD0",
                border: "0.0625rem solid #30ACD0",
                color: "#fff",
              }}
            />
          </div>
        </div>
      </form>
    </Popup>
  );
};
