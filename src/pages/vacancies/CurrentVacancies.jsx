import Grid from "masterComponents/Grid";
import { useEffect, useMemo, useRef, useState } from "react";
import style from "@/pages/vacancies/style/CurrentVacancies.module.scss";
import Loader from "masterComponents/Loader";
import {
  getCurrentVacanciesForHr,
  getCurrentVacanciesForRecruiter,
  setShareWithManager,
  setUpdateVacancyStatus,
} from "./api/VacanciesApi";
import { UsersContainer } from "./components/UsersContainer";
import { __formatDate } from "@/utils/helpers";
import IconTimeLapse from "@/assets/icons/other/IconTimeLapse";
import IconAlarm from "@/assets/icons/other/IconAlarm";
import FormDropdown from "masterComponents/FormDropdown";
import MainButton from "masterComponents/MainButton";
import { useVacanciesStore } from "./store/VacanciesStore";
import { StepsController } from "./templates/steps/StepsController";
import { storeActionTypes } from "./constants";
import { RequestVacancy } from "./templates/RequestVacancy";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { createNotification } from "masterComponents/Notification";
import { VacanciesGrid } from "./VacanciesGrid";
import { useParams } from "react-router-dom";

export const CurrentVacancies = () => {
  const {
    confirmStatusChangeTo,
    setConfirmStatusChangeTo,
    setOpenVacancyComments,
    setAssignRecruiterTo,
    summary,
    setController,
    actionTrigger,
    setActionTrigger,
  } = useVacanciesStore((state) => state);
  const [refreshDataSource, setRefreshDataSource] = useState(1);
  const { mode } = useParams();
  const isAdmin = mode ? mode == storeActionTypes.USER_MODES.HR : false;
  const [hasNocommentOnKeys, setHasNocommentOnKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    {
      columnKey: "VacancyID",
      columnName: "ID",
      dataType: "number",
      visible: true,
      allowFiltering: false,
    },
    {
      columnKey: "UnitHead",
      columnName: "Head Of Unit",
      dataType: "string",
      group: true,
      visible: false,
    },
    {
      columnKey: "JobName",
      columnName: "Job",
      dataType: "string",
      visible: true,
      width: "320",
      template: (row) => {
        const isReopen = row?.data?.DuplicatedFromID;
        const isShared = row?.data?.IsShared;
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
            }}
          >
            <span style={{ color: "var(--color-text-strong-default)" }}>
              {row?.data.JobName}
            </span>
            <div style={{ display: "flex", gap: "0.375rem" }}>
              {isReopen ? (
                <span style={{ color: "#30ACD0" }}>Dublicate</span>
              ) : (
                ""
              )}
              {isShared ? <span style={{ color: "#30ACD0" }}>Shared</span> : ""}
            </div>
          </div>
        );
      },
    },
    {
      columnKey: "Office",
      columnName: "Office/Org",
      dataType: "string",
      visible: false,

      template: (data) => {
        return (
          <div className={style.templateOfficeOrg}>
            <h2>{data?.data?.Office}</h2>
            <span style={{}}>{data?.data?.Organization}</span>
          </div>
        );
      },
    },
    {
      columnKey: "PositionCount",
      columnName: "Position Count",
      dataType: "number",
      visible: true,
    },
    {
      columnKey: "WorkTypes",
      columnName: "WorkTypes",
      dataType: "number",
      visible: false,

      template: (data) => {
        return (
          <div className={style.workTypeTag}>
            <div></div>
            <span> {data?.data?.WorkTypes}</span>
          </div>
        );
      },
    },
    {
      columnKey: "Days Placed",
      columnName: "DaysPlaced",
      visible: true,
      width: "150",
      dataType: "number",
    },
    {
      columnKey: "ChannelsJson",
      columnName: "Channels",
      visible: true,
      dataType: "string",
      width: "150",
      template: (row) => {
        const channels = row?.data?.ChannelsJson;
        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
            {channels
              ? JSON.parse(channels).map((channel, index) => {
                  return channel.Url ? (
                    <a
                      key={index}
                      style={{
                        color: "#0266EF",
                        borderBottom: "0.0625rem solid #0266EF",
                        fontSize: "0.875rem",
                      }}
                      target="blank"
                      href={channel.Url}
                    >
                      {channel.Name}
                    </a>
                  ) : (
                    <span
                      style={{
                        color: "#0266EF",
                        borderBottom: "0.0625rem solid #0266EF",
                        fontSize: "0.875rem",
                      }}
                      key={index}
                    >
                      {channel.Name}
                    </span>
                  );
                })
              : ""}
          </div>
        );
      },
    },
    {
      columnKey: "RequestDate",
      columnName: "Request Date",
      visible: false,
      dataType: "date",
      template: (data) => templateDate(data),
    },
    {
      columnKey: "PlacementStartDate",
      columnName: "Placement Period",
      visible: true,
      dataType: "date",
      template: (data) => templatePlacementPeriod(data),
      width: "230",
    },
    {
      columnKey: "ViewsCount",
      columnName: "Views",
      visible: true,
      allowFiltering: false,
      dataType: "number",
    },
    {
      columnKey: "TotalApplied",
      columnName: "Total Applied",
      dataType: "number",
      visible: true,
      allowFiltering: false,
      template: (data) => {
        return (
          <div className={style.totalApplied}>
            <h2>{data?.data?.TotalApplied}</h2>
            <div>
              <span> {data?.data?.NewApplied} New </span>
            </div>
          </div>
        );
      },
    },
    {
      columnKey: "RecruitersJson",
      columnName: "Recruiters",
      dataType: "string",
      visible: true,
      template: (data) => templateUsers(data, "RecruitersJson"),
    },
    {
      columnKey: "Status",
      columnName: "Status",
      dataType: "string",
      visible: true,

      template: (data) => templateStatus(data),
      width: 200,
    },
    // {
    //   columnKey: "VacancyHeadJson",
    //   columnName: "Head",
    //   dataType: "string",
    //   template: (data) => templateUsers(data, "VacancyHeadJson"),
    // },
    {
      columnKey: "PlacementType",
      columnName: "Placement Type",
      visible: false,
      dataType: "string",
    },
    {
      columnKey: "",
      columnName: "Assemble",
      dataType: "string",
      visible: true,
      width: "10.5rem",
      template: (data) => {
        return (
          <MainButton
            disabled={data?.data.IsRecruiterUnassigned}
            label={"Assemble"}
            size={"small"}
            customStyle={{
              background: "#4D4D4E",
              color: "#FFF",
              borderRadius: "0.25rem",
              height: "2rem",
            }}
            onClick={() => {
              setController({
                actionType: storeActionTypes.OPEN_MODAL,
                requestType: storeActionTypes.REQUEST_TYPES.ASSEMBLE_VACANCY,
                additionalData: { jobName: data?.data?.JobName },
                modalOptions: {
                  renderTemplate: () => (
                    <StepsController vacancyID={data?.data?.VacancyID} />
                  ),
                  size: "large",
                },
              });
            }}
          />
        );
      },
    },
  ];

  const disabledCommentKeys = useMemo(
    () => hasNocommentOnKeys,
    [hasNocommentOnKeys]
  );

  const getData = async (options) => {
    let data;
    const caller =
      mode && mode == storeActionTypes.USER_MODES.HR
        ? getCurrentVacanciesForHr
        : mode && mode == storeActionTypes.USER_MODES.RECRUITER
        ? getCurrentVacanciesForRecruiter
        : null;

    if (!caller) return;
    await caller({
      ...options,
      group: options.group.filter((el) => el.selector !== "UnitHead"),
    }).then((response) => {
      if (response?.data?.data[0]?.key && response?.data?.data[0]?.count) {
        data = response.data.data;
        return;
      }
      data = response.data.data.reduce((acc, el) => {
        let foundGroup = acc.find((group) => group.key === el.UnitHead);

        if (!foundGroup) {
          foundGroup = {
            key: el.UnitHead,
            items: [],
          };
          acc.push(foundGroup);
        }

        if (!foundGroup.generatedColor) {
          foundGroup.generatedColor =
            "#" +
            ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
        }

        foundGroup.items.push({
          ...el,
          Color: foundGroup.generatedColor,
        });

        return acc;
      }, []);
    });
    return data;
  };

  const setUpdateStatus = async (id, status) => {
    await setUpdateVacancyStatus({
      VacancyID: id ?? null,
      NewStatusID: status ?? null,
    }).then((response) => {
      setRefreshDataSource((state) => (state += 1));
    });
  };

  const templateStatus = (row) => {
    const actionFilterIds = row?.data?.CanChangeToStatuses
      ? JSON.parse(row?.data?.CanChangeToStatuses).map((el) => Number(el))
      : [];
    const statusList = [
      {
        label: "Request Draft",
        color: "#D18D22",
        id: 1,
      },
      {
        label: "Requested",
        color: "#30ACD0",
        id: 2,
      },
      {
        label: "Draft",
        color: "#D18D22",
        id: 3,
      },
      {
        color: "#0CA474",
        label: "In Progress",
        id: 4,
      },
      {
        label: "Paused",
        color: "#D93545",
        id: 5,
      },
      {
        label: "Date Expired",
        color: "#D93545",
        id: 6,
      },
      {
        label: "Canceled",
        color: "#D93545",
        id: 7,
      },
      {
        label: "Closed",
        color: "#0CA474",
        id: 8,
      },
    ];

    return (
      <div style={{ width: "9.375rem" }}>
        <FormDropdown
          data={statusList.filter((el) =>
            [...actionFilterIds, row?.data?.StatusID].includes(el.id)
          )}
          size={"small"}
          label={"Status"}
          fixedDropdown={false}
          selectedOptionID={row?.data?.StatusID}
          selected={(obj) => {
            if (obj.id === row.data.StatusID) return;
            else if (![5, 7, 8].includes(obj.id)) {
              setUpdateStatus(row?.data?.VacancyID, obj.id);
              return;
            } else {
              setConfirmStatusChangeTo({
                status: obj.id,
                id: row?.data?.VacancyID,
              });
            }
          }}
        />
      </div>
    );
  };

  const templatePlacementPeriod = (row) => {
    const { PlacementStartDate, PlacementEndDate } = row.data;

    return (
      <>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>
            {PlacementStartDate
              ? __formatDate(PlacementStartDate, "DD.MM.YYYY")
              : ""}
          </span>
          {PlacementEndDate && PlacementStartDate ? "-" : ""}
          <span>
            {PlacementEndDate
              ? __formatDate(PlacementEndDate, "DD.MM.YYYY")
              : ""}
          </span>
          {row?.data?.IsRepost ? (
            <span>
              <IconTimeLapse />
            </span>
          ) : row?.data?.IsAlarmed ? (
            <span>
              <IconAlarm />
            </span>
          ) : null}
        </div>
      </>
    );
  };

  const templateDate = (row) => {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span>{__formatDate(row?.data?.RequestDate, "DD.MM.YYYY")}</span>
        {row?.data?.IsRepost ? (
          <IconTimeLapse />
        ) : row?.data?.IsAlarmed ? (
          <IconAlarm />
        ) : null}
      </div>
    );
  };

  const templateUsers = (row, key) => {
    const users = JSON.parse(row?.data[key]) || [];
    const visibleUsers = users.slice(0, 3);
    const hiddenUsers = users.slice(3, users.length);

    return (
      <UsersContainer
        visibleRecruiters={visibleUsers}
        hiddenRecruiters={hiddenUsers}
      />
    );
  };

  const shareTomanager = async (data) => {
    const head = data?.VacancyHeadJson
      ? JSON.parse(data?.VacancyHeadJson)
      : null;
    await setShareWithManager({
      VacancyID: data?.VacancyID,
      HeadUserID: head[0]?.UserID,
    }).then((response) => {
      if (response.Error || response.data.Error) return;
      else
        createNotification(
          `Successfully Shared With ${head?.HeadName} `,
          "success",
          1000,
          "top-right",
          2
        );
    });
  };

  const finishVacancy = (data) => {
    setConfirmStatusChangeTo({
      status: storeActionTypes.STATUS_TYPES.CLOSED,
      id: data?.VacancyID ?? null,
    });
  };

  useUpdateEffect(() => {
    if (
      actionTrigger == storeActionTypes.REQUEST_ACTIONS.GET_VACANCY_BOARD_DATA
    ) {
      setRefreshDataSource((state) => (state += 1));
      setActionTrigger(null);
    }
  }, [actionTrigger]);

  useEffect(() => {
    if (mode && mode == storeActionTypes.USER_MODES.MANAGER) return;

    const fetchDataFormCommentAvailability = async () => {
      setIsLoading(true);
      const resp =
        mode && mode == storeActionTypes.USER_MODES.HR
          ? await getCurrentVacanciesForHr()
          : mode && mode == storeActionTypes.USER_MODES.RECRUITER
          ? await getCurrentVacanciesForRecruiter()
          : null;
      setIsLoading(false);
      if (resp?.data?.data) {
        const noCommentKeys =
          resp?.data?.data
            .filter((e) => !e.HasComments)
            .map((e) => Number(e.VacancyID)) ?? [];

        setHasNocommentOnKeys(noCommentKeys);
      }
    };

    fetchDataFormCommentAvailability();
  }, []);

  const dataGrid = useMemo(() => {
    if (isLoading)
      return (
        <div
          style={{
            width: "100%",
            height: "75%",
            position: "absolute",
            zIndex: "50",
            background: "#ffffff70",
          }}
        >
          <div
            style={{
              width: "fit-content",
              position: "absolute",
              left: "50%",
              transform: "translate(-50%,-50%)",
              top: "50%",
            }}
          >
            <Loader loading={true} circleColor={"#30ACD0"} />
          </div>
        </div>
      );
    return (
      <Grid
        customColumns={columns}
        customActions={[
          {
            label: "Edit",
            type: "edit_item",
            icon: () => null,
            event: (type, data) =>
              setController({
                actionType: storeActionTypes.OPEN_MODAL,
                requestType: storeActionTypes.REQUEST_TYPES.REQUEST_VACANCY,
                modalOptions: {
                  renderTemplate: () => (
                    <RequestVacancy editMode={true} ID={data?.VacancyID} />
                  ),
                },
              }),
          },
          {
            label: "Share to Manager",
            type: "share",
            icon: () => null,
            event: (type, data) => shareTomanager(data),
          },
          {
            label: "Move to Finished",
            type: "finish",
            icon: () => null,
            event: (type, data) => finishVacancy(data),
          },
          {
            label: "Edit Recruiter",
            type: "edit_recruiter",
            icon: () => null,
            event: (type, data) => {
              setAssignRecruiterTo({
                id: data?.VacancyID,
                recruiters: data.RecruitersJson,
              });
            },
          },
          {
            label: "Link",
            type: "link",
            icon: () => null,
            event: null,
          },
          {
            label: "See Comment",
            type: "comment",
            icon: () => null,
            disabledForKeys: disabledCommentKeys,
            event: (type, data) => {
              setOpenVacancyComments(data?.VacancyID);
            },
          },
        ].filter((a, i) => {
        
          return isAdmin
            ? !["finish"].includes(a.type)
            : !["edit_recruiter"].includes(a.type);
        })}
        withCustomActions={true}
        withColumnConfigure={true}
        disableOverflow={[9, 10, 11]}
        height={"100%"}
        withCustomStore={true}
        loadFunction={(options) => getData(options)}
        storeKey={"VacancyID"}
        keyExpr={"VacancyID"}
        filterOptions={{ headerFilter: false, filterRow: true }}
        scrollMode={"none"}
        withGrouping={true}
        onRowPrepared={(e) => {
          e.rowElement.style.borderLeft = `0.125rem solid ${e?.data?.Color}`;
        }}
        // data={gridData}
      />
    );
  }, [
    confirmStatusChangeTo,
    refreshDataSource,
    disabledCommentKeys,
    isLoading,
  ]);
  return (
    <div>
      {mode && mode !== storeActionTypes.USER_MODES.MANAGER ? (
        <div className={style.infoPanel}>
          <ul>
            {summary?.Current
              ? Object.keys(summary?.Current).map((key, index) => {
                  return (
                    <li key={index}>
                      <div className={style.dotMark}></div>
                      <div>
                        <span>
                          {summary.Current ? summary.Current[key] : ""}
                        </span>
                        <h2>
                          {key
                            .split("_")
                            .filter((e) => e !== "_")
                            .join(" ")}
                        </h2>
                      </div>
                    </li>
                  );
                })
              : ""}
          </ul>
        </div>
      ) : (
        ""
      )}
      <div style={{ marginTop: "1rem" }} className={style.dataGridWrapper}>
        {isAdmin ? (
          dataGrid
        ) : mode == storeActionTypes.USER_MODES.MANAGER ? (
          <VacanciesGrid />
        ) : (
          dataGrid
        )}
      </div>
    </div>
  );
};
