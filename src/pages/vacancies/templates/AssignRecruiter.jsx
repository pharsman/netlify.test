import Popup from "masterComponents/Popup";
import MainButton from "masterComponents/MainButton";
import Loader from "masterComponents/Loader";
import CheckBox from "masterComponents/CheckBox";
import style from "@/pages/vacancies/style/AssignRecruiter.module.scss";
import { Fragment, useEffect, useState } from "react";
import { getRecruitersList, setAssignRecruiters } from "../api/VacanciesApi";
import { IconInfoCircle } from "@/assets/icons/other/IconInfoCircle";
import { useVacanciesStore } from "../store/VacanciesStore";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import Tooltip from "masterComponents/Tooltip";
import { storeActionTypes } from "../constants";
export const AssignRecruiter = () => {
  const { assignRecruiterTo, setAssignRecruiterTo, setActionTrigger } =
    useVacanciesStore((state) => state);
  const [data, setData] = useState(null);
  const [vacancyID, setVacancyID] = useState(null);
  const [loading, setLoading] = useState(false);
  const getRecruitersData = async () => {
    setLoading(true);
    await getRecruitersList().then((response) => {
      setLoading(false);
      if (response.data) {
        if (assignRecruiterTo?.recruiters) {
          setData(
            response.data.map((el) => ({
              ...el,
              selected: JSON.parse(assignRecruiterTo?.recruiters)
                ?.map((el) => el.UserID)
                .includes(el.UserID),
            }))
          );
        } else setData(response.data);
      }
    });
  };

  const updateUsersSelection = (userId, state) => {
    setData((prev) => {
      const newData = [...prev];
      newData.find((user) => user.UserID === userId)["selected"] = state;
      return newData;
    });
  };

  const assignRecruiters = async () => {
    const selectedRecruiters = data ?? [];
    await setAssignRecruiters({
      VacancyID: vacancyID ?? null,
      RecruitersJson: selectedRecruiters
        ? JSON.stringify(
            selectedRecruiters.map((user) => ({
              UserID: user.UserID,
              Assign: user.selected,
            }))
          )
        : [],
    }).then((response) => {
      if (response.Error || response.data.Error) return;
      setActionTrigger(storeActionTypes.REQUEST_ACTIONS.GET_VACANCY_BOARD_DATA);
      setAssignRecruiterTo(null);
    });
  };

  useUpdateEffect(() => {
    setVacancyID(assignRecruiterTo?.id);
    getRecruitersData();
  }, [assignRecruiterTo]);

  return (
    <Popup
      visible={!!vacancyID}
      size={"small"}
      options={{
        title: "Assign Recruiter",
        mode: "drawer",
      }}
    >
      <ul className={style.recruitersList}>
        <li className={style.listHead}>
          <div className={style.headTitle}>
            <span>Recruiter</span>
          </div>
          <div className={style.headTitle}>
            <Tooltip
              label={
                "Total sum of current open positions, including: Draft, in progress, paused and date expired  vacancy requests"
              }
            >
              <span>
                Cur.Positions <IconInfoCircle color={"#6F787B"} />
              </span>
            </Tooltip>
          </div>
          <div className={style.headTitle}>
            <Tooltip
              label={
                "The total count before the slash includes all vacancy records with statuses: Ongoing, Paused, Canceled and date Expired. The count after the slash represents closed vacancies."
              }
            >
              <span>
                Last 3 mo. Workload <IconInfoCircle color={"#6F787B"} />
              </span>
            </Tooltip>
          </div>
        </li>
        {loading ? (
          <div
            style={{
              display: "grid",
              placeItems: "center",
              marginTop: "7.5rem",
            }}
          >
            <Loader loading={loading} />
          </div>
        ) : (
          <>
            {data &&
              data.map((user, index) => {
                return (
                  <li key={index}>
                    <div className={style.userInfo}>
                      <CheckBox
                        change={(state) =>
                          updateUsersSelection(user.UserID, state)
                        }
                        checked={user?.selected}
                      />

                      <div
                        className={style.avatar}
                        style={{
                          background: user.AvatarUrl ? "" : "#E1E4E5",
                        }}
                      >
                        {user?.AvatarUrl ? (
                          <img src={user?.AvatarUrl} />
                        ) : (
                          <span style={{ color: "#00ADEE" }}>
                            {user.Name ? user.Name.split("")[0] : ""}
                          </span>
                        )}
                      </div>
                      <div className={style.info}>
                        <span>{user?.Name ?? ""}</span>
                        <span>{user?.Job ?? ""}</span>
                      </div>
                    </div>
                    <div>
                      {user.Vacancies.length ? (
                        <Tooltip
                          label={
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {user.Vacancies &&
                                user.Vacancies.map((el) => {
                                  return (
                                    <span>
                                      {el.VacancyName}
                                      {el.FreePositionsCount
                                        ? ` (${el.FreePositionsCount})`
                                        : ""}
                                    </span>
                                  );
                                })}
                            </div>
                          }
                        >
                          <span>{user.OpenPositionsCount}</span>
                        </Tooltip>
                      ) : (
                        <span>{user.OpenPositionsCount}</span>
                      )}
                    </div>
                    <div>
                      <span>
                        {user.OnGoingVacanciesCount}/{user.ClosedVacanciesCount}
                      </span>
                    </div>
                  </li>
                );
              })}
          </>
        )}
      </ul>

      <div className={style.actions}>
        <MainButton
          label={"Close"}
          type={"border"}
          size={"small"}
          customStyle={{ color: "#141719", borderColor: "#D1D5D6" }}
          onClick={() => setAssignRecruiterTo(null)}
        />
        <MainButton
          label={"Assign"}
          size={"small"}
          customStyle={{ color: "#ffffff", background: "#30ACD0" }}
          onClick={assignRecruiters}
        />
      </div>
    </Popup>
  );
};
