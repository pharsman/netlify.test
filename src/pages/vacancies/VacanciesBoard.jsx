import style from "@/pages/vacancies/style/VacanciesBoard.module.scss";
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import {
  getVacancyForHeads,
  getVacancyForHr,
  getVacancyForRecruiters,
  setUpdateVacancyStatus,
} from "./api/VacanciesApi";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useVacanciesStore } from "./store/VacanciesStore";
import { storeActionTypes } from "./constants";
import SortableItem from "./components/SortableItem";
import Skeleton from "masterComponents/Skeleton";
import ScrollContainer from "react-indiana-drag-scroll";
import { useParams } from "react-router-dom";

export const VacanciesBoard = () => {
  const { mode } = useParams();
  const [loading, setLoading] = useState(false);
  const [vacancyData, setVacancyData] = useState(null);
  const [canDropToContainers, setCanDropToContainers] = useState([]);
  const { actionTrigger, setActionTrigger, setConfirmStatusChangeTo } =
    useVacanciesStore((state) => state);

  const [Draft, setDraft] = useState([]);
  const [RequestDraft, setRequestDraft] = useState([]);
  const [Requested, setRequested] = useState([]);
  const [InProgress, setInProgress] = useState([]);
  const [Paused, setPaused] = useState([]);
  const [DateExpired, setDateExpired] = useState([]);
  const [Canceled, setCanceled] = useState([]);
  const [Closed, setClosed] = useState([]);

  const getVacancyData = async () => {
    if (actionTrigger) setActionTrigger(null);
    try {
      setLoading(true);
      const caller =
        mode && mode == storeActionTypes.USER_MODES.HR
          ? getVacancyForHr
          : mode && mode == storeActionTypes.USER_MODES.RECRUITER
          ? getVacancyForRecruiters
          : getVacancyForHeads;
      const response = await caller();
      const data = response?.data || [];
      setLoading(false);
      data.forEach((obj) => {
        if (obj.Vacancies) {
          obj.Vacancies.forEach((el) => {
            el["StatusID"] = obj.StatusID;
          });
        }
      });

      setDraft(data.find((el) => el.StatusName === "Draft")?.Vacancies ?? []);
      setRequestDraft(
        data.find((el) => el.StatusName === "Request Draft")?.Vacancies ?? []
      );
      setRequested(
        data.find((el) => el.StatusName === "Requested")?.Vacancies ?? []
      );
      setInProgress(
        data.find((el) => el.StatusName === "In Progress")?.Vacancies ?? []
      );
      setPaused(data.find((el) => el.StatusName === "Paused")?.Vacancies ?? []);
      setDateExpired(
        data.find((el) => el.StatusName === "Date Expired")?.Vacancies ?? []
      );
      setCanceled(
        data.find((el) => el.StatusName === "Canceled")?.Vacancies ?? []
      );
      setClosed(data.find((el) => el.StatusName === "Closed")?.Vacancies ?? []);

      setVacancyData(
        data.map((el) => ({
          ...el,
          Vacancies: el.Vacancies.map((c) => ({
            ...c,
            CanChangeToStatuses: el.CanChangeToStatuses,
          })),
        }))
      );
    } catch (error) {
      console.error("Error fetching vacancy data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getColumnColor = (columnName) => {
    const colors = {
      InProgress: "#0CA474",
      Requested: "#30ACD0",
      RequestDraft: "#D18D22",
      Draft: "#D18D22",
      Paused: "#D93545",
      DateExpired: "#D93545",
      Canceled: "#D93545",
      Closed: "#0CA474",
    };
    return colors[columnName];
  };

  useEffect(() => {
    getVacancyData();
  }, []);

  useUpdateEffect(() => {
    if (
      actionTrigger === storeActionTypes.REQUEST_ACTIONS.GET_VACANCY_BOARD_DATA
    ) {
      getVacancyData();
    }
  }, [actionTrigger]);

  const handleListUpdate = async (targetKey, itemId) => {
    const newStatusID = storeActionTypes.STATUS_TYPES[targetKey.toUpperCase()];

    if (!itemId) return;

    if (
      newStatusID == storeActionTypes.STATUS_TYPES.PAUSED ||
      newStatusID == storeActionTypes.STATUS_TYPES.CANCELED
    ) {
      setConfirmStatusChangeTo({
        status: newStatusID,
        id: itemId,
      });
      return;
    }

    try {
      setLoading(true);
      await setUpdateVacancyStatus({
        VacancyID: Number(itemId),
        NewStatusID: newStatusID,
        Reason: null,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error updating vacancy status:", error);
    } finally {
      getVacancyData();
      setLoading(false);
    }
  };

  const renderSortableContainers = () => {
    const items = {
      RequestDraft,
      Requested,
      Draft,
      InProgress,
      Paused,
      DateExpired,
      Canceled,
      Closed,
    };

    return Object.keys(items).map((key) => (
      <div
        key={key}
        className={`${style.boardContainer} ${
          canDropToContainers.includes(
            storeActionTypes.STATUS_TYPES[key.toUpperCase()]
          )
            ? style.active
            : ""
        }`}
        data-status={key}
        data-allowed-drop-containers={JSON.stringify(
          vacancyData?.find((el) => el.StatusName.split(" ").join("") == key)
            ?.CanChangeToStatuses ?? []
        )}
      >
        <h2
          style={{
            color: getColumnColor(key),
          }}
          className={style.containerTitle}
        >
          {key && key?.replace(/([A-Z])/g, " $1").trim()}{" "}
          <span style={{ color: "var(--color-text-softer-default)" }}>
            {items[key] ? items[key].length : ""}
          </span>
        </h2>
        {loading ? (
          <Skeleton active={true} style={{ marginTop: "1rem" }} />
        ) : (
          ""
        )}
        <ReactSortable
          list={items[key]}
          disabled={mode == storeActionTypes.USER_MODES.MANAGER}
          setList={(newList, sortable) => {
            const targetStatus =
              sortable?.el?.parentNode?.getAttribute("data-status");
            const targetContainers = sortable?.el?.parentNode?.getAttribute(
              "data-allowed-drop-containers"
            );
            const allowedContainers = JSON.stringify(targetContainers) ?? [];
            if (
              !allowedContainers?.includes(
                storeActionTypes.STATUS_TYPES[targetStatus?.toUpperCase()]
              )
            ) {
              sortable?.sort(sortable.toArray());
              return;
            }
            switch (key) {
              case "Draft":
                setDraft(newList);
                break;
              case "RequestDraft":
                setRequestDraft(newList);
                break;
              case "Requested":
                setRequested(newList);
                break;
              case "InProgress":
                setInProgress(newList);
                break;
              case "Paused":
                setPaused(newList);
                break;
              case "DateExpired":
                setDateExpired(newList);
                break;
              case "Canceled":
                setCanceled(newList);
                break;
              case "Closed":
                setClosed(newList);
                break;
              default:
                break;
            }
          }}
          group="shared"
          filter=".no-drag"
          preventOnFilter={true}
          animation={200}
          // delayOnTouchStart={true}
          // delay={2000}
          onStart={(evt) => {
            const sourceStatus =
              evt.from.parentNode.getAttribute("data-status");
            const canChangeTo =
              vacancyData.find(
                (el) => el.StatusName.split(" ").join("") == sourceStatus
              ).CanChangeToStatuses ?? [];
            setCanDropToContainers(canChangeTo);
          }}
          onEnd={(evt) => {
            const sourceStatus =
              evt.from.parentNode.getAttribute("data-status");
            const itemId = evt.item.getAttribute("data-object-id") || null;
            const newStatus =
              evt.to.parentNode.getAttribute("data-status") || null;
            setCanDropToContainers([]);

            if (sourceStatus == newStatus) {
              return;
            }
            if (
              !canDropToContainers.includes(
                storeActionTypes.STATUS_TYPES[newStatus.toUpperCase()]
              )
            ) {
              return;
            } else {
              handleListUpdate(newStatus, itemId);
            }
          }}
        >
          {items[key].map((item) => (
            <div
              key={item.VacancyID}
              className={`${style.vacancyItem} ignore-drag-scroll`}
              data-key={key}
              data-object-id={item.VacancyID}
            >
              <SortableItem
                color={getColumnColor(key)}
                id={item.VacancyID}
                data={item}
                hideAddUser={
                  ["RequestDraft"].includes(key) ||
                  mode !== storeActionTypes.USER_MODES.HR
                }
              />
            </div>
          ))}
        </ReactSortable>
      </div>
    ));
  };

  return (
    <ScrollContainer
      className={`${style.boardWrapper} scroll-container`}
      ignoreElements={".ignore-drag-scroll"}
    >
      {renderSortableContainers()}
    </ScrollContainer>
  );
};
