import style from "@/pages/candidates/style/CurrentCandidates.module.scss";
import { CandidateTabs } from "./components/CandidateTabs";
import { useRef, useState } from "react";
import Grid from "masterComponents/Grid";
import {
  getCandidateSummary,
  getCurrentCandidatesVacancyList,
  setCandidateLike,
  setCandidateShareWithHead,
  setCandidateBulkShareWithHead,
  setCandidateBulkMarkAsBlackListed,
  setCandidateBulkArchive,
} from "./api/CandidatesApi";
import { useEffect, useMemo } from "react";
import IconStar from "@/assets/icons/other/IconStar";
import IconLike from "@/assets/icons/other/IconLike";
import Tag from "masterComponents/Tag";
import Tooltip from "masterComponents/Tooltip";
import FormDropdown from "masterComponents/FormDropdown";
import { IconEdit } from "@/assets/icons/other/actions/IconEdit";
import { IconDataBase } from "@/assets/icons/other/actions/IconDataBase";
import { IconBlacklist } from "@/assets/icons/other/actions/IconBlacklist";
import { IconFollowUp } from "@/assets/icons/other/actions/IconFollowUp";
import { IconShare } from "@/assets/icons/other/actions/IconShare";
import { IconSendTask } from "@/assets/icons/other/actions/IconSendTask";
import { IconComment } from "@/assets/icons/other/actions/IconComment";
import { useCandidatesStore } from "./store/CandidatesStore";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { CandidateActionTypes } from "./constants";
import {
  setCandidateVacancyFavorite,
  setCandidateMarkAsBlackListed,
  setCandidateArchive,
} from "./api/CandidatesApi";
import { createNotification } from "masterComponents/Notification";
import { UsersContainer } from "../vacancies/components/UsersContainer";
import { useNavigate } from "react-router-dom";

export const CurrentCandidates = () => {
  const navigate = useNavigate();
  const {
    actionTrigger,
    setUpdateCandidateID,
    setActionTrigger,
    changeStatusTo,
    setChangeStatusTo,
    setSendFollowUpTo,
    setViewCommentsTo,
  } = useCandidatesStore();
  const [selectedQuickFilter, setSelectedQuickFilter] = useState(2);
  // const [loading, setLoading] = useState(false);
  const [refreshDataSource, setRefreshDataSource] = useState(1);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const isLocalhost = window.location.hostname === "localhost";
  const [summary, setSummary] = useState({});
  // const statusesList = useRef([]);
  const quickFilters = useRef([
    {
      key: 1,
      label: "Last 24 Hours",
    },
    {
      key: 2,
      label: "Last 7 Days",
    },
    {
      key: 3,
      label: "Last 30 Days",
    },
    {
      key: 4,
      label: "Last 90 Days",
    },
  ]);

  const quickActions = useRef([
    {
      key: 1,
      label: "Move to Data Base",
      type: "MOVE_TO_DATABASE",
    },
    {
      key: 2,
      label: "Mark as Blacklisted",
      type: "MARK_AS_BLACKLISTED",
    },
    {
      key: 3,
      label: "Send Follow Up",
      type: "SEND_FOLLOW_UP",
    },
    {
      key: 4,
      label: "Share to Manager",
      type: "SHARE_TO_MANAGER",
    },
  ]);

  const columns = [
    {
      columnKey: "CandidateID",
      columnName: "ID",
      dataType: "number",
      visible: true,
      allowFiltering: false,
      width: 80,
      template: (row) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span
              style={{
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
              }}
              onClick={() =>
                toggleFavorite(row?.data?.CandidateID, row?.data?.VacancyID)
              }
            >
              <IconStar isFilled={row?.data?.IsFavorite} />
            </span>

            <span>{row?.data?.CandidateID}</span>
          </div>
        );
      },
    },
    {
      columnKey: "CandidateName",
      columnName: "Candidate",
      dataType: "string",
      visible: true,
      allowFiltering: false,
      template: (row) => {
        const tagsArray = row?.data?.TagsJson
          ? JSON.parse(row?.data?.TagsJson)
          : [];
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
              }}
              onClick={() =>
                toggleLike(row?.data?.CandidateID, row?.data?.VacancyID)
              }
            >
              <IconLike isFilled={row?.data?.IsLiked} />
            </span>
            <Tooltip label={row?.data?.CandidateName}>
              <span
                onClick={() =>
                  navigate(
                    `${
                      isLocalhost
                        ? "/candidateProfile"
                        : "/recruitment/oneadmin/front/candidateProfile"
                    }/${row?.data?.VacancyID}/${row?.data?.CandidateID}`
                  )
                }
                style={{
                  fontSize: "0.875rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "6.25rem",
                  cursor: "pointer",
                }}
              >
                {row?.data?.CandidateName}
              </span>
            </Tooltip>
            {tagsArray
              ? tagsArray.map((tag) => (
                  <Tag
                    label={tag?.TagName}
                    withIcon={false}
                    allowDelete={false}
                    type="red"
                    withTooltip={true}
                  />
                ))
              : null}
          </div>
        );
      },
      width: 250,
    },
    {
      columnKey: "Age",
      columnName: "Age",
      dataType: "number",
      visible: false,
      allowFiltering: false,
    },
    {
      columnKey: "VacancyName",
      columnName: "Job Position",
      dataType: "string",
      visible: true,
      allowFiltering: false,
    },
    {
      columnKey: "SalaryExpectation",
      columnName: "Salary Expectation",
      dataType: "string",
      visible: false,
      allowFiltering: false,
    },

    {
      columnKey: "UnitName",
      columnName: "Unit",
      dataType: "string",
      visible: true,
      allowFiltering: false,
    },
    {
      columnKey: "CandidateCompany",
      columnName: "Company",
      dataType: "string",
      visible: false,
      allowFiltering: false,
    },
    {
      columnKey: "CandidateGender",
      columnName: "Gender",
      dataType: "string",
      visible: false,
      allowFiltering: false,
    },
    {
      columnKey: "RecruitersJson",
      columnName: "Recruiter",
      dataType: "string",
      visible: false,
      allowFiltering: false,
      width: 150,
      template: (row) => {
        const recruiters = row?.data?.RecruitersJson
          ? JSON.parse(row?.data?.RecruitersJson)
          : [];

        console.log(recruiters);
        const visibleRecruiters = recruiters.slice(0, 2);
        const hiddenRecruiters = recruiters.slice(2);
        return (
          <UsersContainer
            visibleRecruiters={visibleRecruiters}
            hiddenRecruiters={hiddenRecruiters}
          />
        );
      },
    },
    {
      columnKey: "Seniority",
      columnName: "Rank",
      dataType: "string",
      visible: true,
      allowFiltering: false,
      template: (row) => {
        return (
          <div style={{ display: "grid", placeItems: "center" }}>
            <Tag
              label={row?.data?.Seniority || "No Status"}
              withIcon={false}
              withTooltip={true}
              allowDelete={false}
              type="purple"
            />
          </div>
        );
      },
    },
    {
      columnKey: "TotalScore",
      columnName: "Score",
      dataType: "number",
      visible: false,
      allowFiltering: false,
    },
    {
      columnKey: "StagesJson",
      columnName: "Stages",
      dataType: "string",
      visible: true,
      allowFiltering: false,
      width: 350,
      template: (row) => {
        const stages = row?.data?.StagesJson
          ? JSON.parse(row?.data?.StagesJson)
          : [];
        const sortStages = stages.sort((a, b) => a.Sort - b.Sort);
        return (
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: "0.625rem",
              alignItems: "center",
              justifyContent: "flex-start",
              overflow: "scroll",
              padding: "1rem 0",
            }}
          >
            {sortStages.map((stage) => (
              <Tooltip
                label={() => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                    }}
                  >
                    <span style={{ fontSize: "0.875rem" }}>{stage?.Name}</span>
                    <span style={{ fontSize: "0.875rem" }}>
                      {stage?.FromDate?.substring(0, 10)}
                      {stage?.FromDate && stage?.ToDate && " / "}
                      {stage?.ToDate?.substring(0, 10)}
                    </span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "#FCD066",
                        fontWeight: "bold",
                      }}
                    >
                      Score {stage?.Score || "0"}
                    </span>
                  </div>
                )}
              >
                <div
                  className={`${style.stageDotMark} ${
                    stage.IsSkipped
                      ? ""
                      : stage.Type === "Current"
                      ? style.current
                      : stage.Type === "Done"
                      ? style.passed
                      : ""
                  }`}
                ></div>
              </Tooltip>
            ))}
          </div>
        );
      },
    },
    {
      columnKey: "ApplyDate",
      columnName: "Apply Date",
      dataType: "string",
      visible: true,
      allowFiltering: false,
    },
    {
      columnKey: "Status",
      columnName: "Status",
      dataType: "string",
      visible: true,
      allowFiltering: false,
      width: 200,
      template: (row) => statusTemplate(row),
    },
  ];

  const statusTemplate = (row) => {
    if (row?.data?.StatusID) {
      return (
        <div>
          <FormDropdown
            label={"Status"}
            data={[
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
            ]}
            selectedOptionID={row?.data?.StatusID}
            fixedDropdown={false}
            skipSelected={true}
            selected={(option) => {
              setChangeStatusTo({
                CandidateID: row?.data?.CandidateID,
                VacancyID: row?.data?.VacancyID,
                StatusID: option.id,
              });
            }}
          />
        </div>
      );
    }
  };

  // const getStatuses = async () => {
  //   await getCandidateStatuses().then((response) => {
  //     if (!response || response.data?.Error || response.Error) return;
  //     console.log(response.data);
  //     statusesList.current = response?.data?.data.map((item) => ({
  //       key: item.ID,
  //       label: item.Name,
  //     }));
  //   });
  // };

  const toggleFavorite = async (CandidateID, VacancyID) => {
    await setCandidateVacancyFavorite({
      CandidateID,
      VacancyID,
    }).then((response) => {
      console.log(response);
      if (!response || response.data?.Error || response.Error) return;
      setRefreshDataSource((state) => (state += 1));
      createNotification(
        `${
          !response?.data?.IsFavorite ? "Removed from" : "Added to"
        } Favorites`,
        "success",
        1000,
        "top-right",
        2
      );
    });
  };

  const toggleLike = async (CandidateID, VacancyID) => {
    await setCandidateLike({
      CandidateID,
      VacancyID,
    }).then((response) => {
      if (!response || response.data?.Error || response.Error) return;

      console.log(response.data);
      setRefreshDataSource((state) => (state += 1));
    });
  };

  const getSummary = async () => {
    await getCandidateSummary().then((response) => {
      if (!response || response.data?.Error || response.Error) return;
      setSummary(response.data);
    });
  };

  const handleBulkActions = async (type) => {
    if (selectedRowsData.length === 0) return;
    switch (type) {
      case "SHARE_TO_MANAGER":
        await setCandidateBulkShareWithHead({
          CandidateVacancyIDs: JSON.stringify(
            selectedRowsData.map((row) => ({
              CandidateID: row.CandidateID,
              VacancyID: row.VacancyID,
            }))
          ),
        }).then((response) => {
          if (!response || response.data?.Error || response.Error) return;
          setRefreshDataSource((state) => (state += 1));
          createNotification(
            "Shared to Manager",
            "success",
            1000,
            "top-right",
            2
          );
        });
        break;
      case "MARK_AS_BLACKLISTED":
        await setCandidateBulkMarkAsBlackListed({
          CandidateVacancyIDs: JSON.stringify(
            selectedRowsData.map((row) => ({
              CandidateID: row.CandidateID,
              VacancyID: row.VacancyID,
            }))
          ),
        }).then((response) => {
          if (!response || response.data?.Error || response.Error) return;
          setRefreshDataSource((state) => (state += 1));
          createNotification(
            "Marked as Blacklisted",
            "success",
            1000,
            "top-right",
            2
          );
        });
        break;
      case "MOVE_TO_DATABASE":
        await setCandidateBulkArchive({
          CandidateVacancyIDs: JSON.stringify(
            selectedRowsData.map((row) => ({
              CandidateID: row.CandidateID,
              VacancyID: row.VacancyID,
            }))
          ),
        }).then((response) => {
          if (!response || response.data?.Error || response.Error) return;
          setRefreshDataSource((state) => (state += 1));
          createNotification(
            "Moved to Database",
            "success",
            1000,
            "top-right",
            2
          );
        });
        break;
      case "SEND_FOLLOW_UP":
        setSendFollowUpTo({
          CandidateID: selectedRowsData.map((row) => row.CandidateID),
          VacancyID: selectedRowsData.map((row) => row.VacancyID),
        });
        break;
    }
  };

  const getData = async (options) => {
    try {
      const response = await getCurrentCandidatesVacancyList({
        ...options,
        FunctionParameters: JSON.stringify({
          CreatedAfterDate:
            selectedQuickFilter === 1
              ? new Date(new Date().setDate(new Date().getDate() - 1))
                  .toISOString()
                  .split("T")[0]
              : selectedQuickFilter === 2
              ? new Date(new Date().setDate(new Date().getDate() - 7))
                  .toISOString()
                  .split("T")[0]
              : selectedQuickFilter === 3
              ? new Date(new Date().setDate(new Date().getDate() - 30))
                  .toISOString()
                  .split("T")[0]
              : selectedQuickFilter === 4
              ? new Date(new Date().setDate(new Date().getDate() - 90))
                  .toISOString()
                  .split("T")[0]
              : null,
        }),
      });
      if (!response || response.data?.Error || response.Error) return;
      response.data.data = response.data.data.map((item) => ({
        ...item,
        ApplyDate: item.ApplyDate
          ? new Date(item.ApplyDate).toISOString().split("T")[0]
          : null,
      }));

      return {
        data: response.data.data,
        totalCount: response.data.totalCount || 0,
      };
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const datagrid = useMemo(() => {
    return (
      <Grid
        customColumns={columns}
        customActions={[
          {
            label: "Edit",
            type: "EDIT",
            icon: () => <IconEdit />,
            event: (type, data) => {
              setUpdateCandidateID({
                CandidateID: data.CandidateID,
                VacancyID: data.VacancyID,
              });
            },
          },
          {
            label: "Move to Data Base",
            type: "MOVE_TO_DATABASE",
            icon: () => <IconDataBase />,
            event: async (type, data) => {
              await setCandidateArchive({
                CandidateID: data.CandidateID,
                VacancyID: data.VacancyID,
              }).then((response) => {
                if (!response || response.data?.Error || response.Error) return;
                setRefreshDataSource((state) => (state += 1));
                createNotification(
                  "Moved to Database",
                  "success",
                  1000,
                  "top-right",
                  2
                );
              });
            },
          },
          {
            label: "Mark as Blacklisted",
            type: "MARK_AS_BLACKLISTED",
            icon: () => <IconBlacklist />,

            event: async (type, data) => {
              await setCandidateMarkAsBlackListed({
                CandidateID: data.CandidateID,
                VacancyID: data.VacancyID,
              }).then((response) => {
                if (!response || response.data?.Error || response.Error) return;
                setRefreshDataSource((state) => (state += 1));
                createNotification(
                  "Marked as Blacklisted",
                  "success",
                  1000,
                  "top-right",
                  2
                );
              });
            },
          },
          {
            label: "Send Follow Up",
            type: "SEND_FOLLOW_UP",
            icon: () => <IconFollowUp />,
            event: async (type, data) => {
              await setSendFollowUpTo({
                CandidateID: data.CandidateID,
                VacancyID: data.VacancyID,
              });
            },
          },
          {
            label: "Share to Manager",
            type: "SHARE_TO_MANAGER",
            icon: () => <IconShare />,
            event: async (type, data) => {
              await setCandidateShareWithHead({
                CandidateID: data.CandidateID,
                VacancyID: data.VacancyID,
              }).then((response) => {
                if (!response || response.data?.Error || response.Error) return;
                setRefreshDataSource((state) => (state += 1));
                createNotification(
                  "Shared to Manager",
                  "success",
                  1000,
                  "top-right",
                  2
                );
              });
            },
          },
          // {
          //   label: "Send Task",
          //   type: "SEND_TASK",
          //   icon: () => <IconSendTask />,
          // },
          {
            label: "See Comment",
            type: "SEE_COMMENT",
            icon: () => <IconComment />,
            event: (type, data) => {
              setViewCommentsTo({
                CandidateID: data.CandidateID,
                VacancyID: data.VacancyID,
              });
            },
          },
        ]}
        withCustomActions={true}
        withColumnConfigure={true}
        disableOverflow={[7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20]}
        height={"100%"}
        withCustomStore={true}
        loadFunction={(options) => getData(options)}
        storeKey={"CandidateVacancyID"}
        keyExpr={"CandidateVacancyID"}
        filterOptions={{ headerFilter: false, filterRow: true }}
        scrollMode={"none"}
        withGrouping={true}
        selection={{ mode: "multiple" }}
        selectionChanged={(e) => {
          setSelectedRowsData(e.selectedRowsData);
        }}
        onRowPrepared={(e) => {
          e.rowElement.style.borderLeft = `0.125rem solid ${e?.data?.Color}`;
        }}
      />
    );
  }, [refreshDataSource]);

  useEffect(() => {
    // getStatuses();
    getSummary();
  }, []);

  useUpdateEffect(() => {
    setRefreshDataSource((state) => (state += 1));
  }, [selectedQuickFilter]);

  useUpdateEffect(() => {
    if (
      actionTrigger ===
      CandidateActionTypes.REQUEST_TYPES.RELOAD_CANDIDATES_DATA
    ) {
      setRefreshDataSource((state) => (state += 1));
      setActionTrigger(null);
    }
  }, [actionTrigger]);

  return (
    <div className={style.currentCandidatesContent}>
      <div className={style.currentCandidatesHeader}>
        <CandidateTabs />

        <div className={style.summaryWrapper}>
          {summary &&
            Object.entries(summary).map(([key, value], index) => {
              const labels = {
                CurrentCandidateVacanciesCount: "Current Candidates",
                ArchivedCandidateVacanciesCount: "Archived Candidates",
                TotalApply: "Total Apply",
                PublishedVacancies: "Published Vacancies",
                OpenJobsCount: "Open Jobs",
                OpenPositionsCount: "Open Positions",
              };

              return (
                <div key={index} className={style.infoPanelCount}>
                  <div className={style.mark}></div>
                  <div>
                    <span>{value}</span>
                    <span>{labels[key] || key}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className={style.currentCandidatesGrid}>
        <div className={style.gridQuickActions}>
          <div className={style.quickFilters}>
            <ul>
              {quickFilters.current.map((filter) => (
                <li
                  key={filter.key}
                  className={`${style.quickFilter} ${
                    selectedQuickFilter === filter.key ? style.active : ""
                  }`}
                  onClick={() => setSelectedQuickFilter(filter.key)}
                >
                  <span>{filter.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={style.quickActionsList}>
            <ul>
              <li>
                <span>{selectedRowsData?.length || 0} Selected</span>
              </li>

              {quickActions.current.map((action) => (
                <li
                  key={action.key}
                  onClick={() => handleBulkActions(action.type)}
                >
                  <span>{action.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          style={{ height: `calc(100vh - 10rem)` }}
          className={style.datagridContainer}
        >
          {datagrid}
        </div>
      </div>
    </div>
  );
};
