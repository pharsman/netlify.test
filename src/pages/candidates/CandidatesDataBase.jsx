import style from "@/pages/candidates/style/CurrentCandidates.module.scss";
import { CandidateTabs } from "./components/CandidateTabs";
import { useRef, useState, useMemo } from "react";
import IconStar from "@/assets/icons/other/IconStar";
import IconLike from "@/assets/icons/other/IconLike";
import Grid from "masterComponents/Grid";
import { IconEdit } from "@/assets/icons/other/actions/IconEdit";
import { IconDataBase } from "@/assets/icons/other/actions/IconDataBase";
import { IconBlacklist } from "@/assets/icons/other/actions/IconBlacklist";
import { IconComment } from "@/assets/icons/other/actions/IconComment";
import {
  setCandidateVacancyFavorite,
  setCandidateLike,
  setCandidateMarkAsBlackListed,
} from "./api/CandidatesApi";
import { createNotification } from "masterComponents/Notification";
import Tooltip from "masterComponents/Tooltip";
import Tag from "masterComponents/Tag";
import { getArchivedCandidates } from "./api/CandidatesApi";
import { useCandidatesStore } from "./store/CandidatesStore";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { UsersContainer } from "../vacancies/components/UsersContainer";
import { CandidateActionTypes } from "./constants";
import { useNavigate } from "react-router-dom";

export const CandidatesDataBase = () => {
  const navigate = useNavigate();
  const {
    setUpdateCandidateID,
    setViewCommentsTo,
    setMoveToCurrentList,
    setActionTrigger,
    actionTrigger,
  } = useCandidatesStore();
  const [selectedQuickFilter, setSelectedQuickFilter] = useState(2);
  const [refreshDataSource, setRefreshDataSource] = useState(0);
  const [selectedRowsData, setSelectedRowsData] = useState([]);

  const isLocalhost = window.location.hostname === "localhost";

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

  const columns = [
    {
      columnKey: "CandidateVacancyID",
      columnName: "ID",
      dataType: "number",
      visible: true,
      allowFiltering: false,
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

            <span>{row?.data?.CandidateVacancyID}</span>
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
      columnKey: "SalaryExpectation",
      columnName: "Salary Expectation",
      dataType: "string",
      visible: false,
      allowFiltering: false,
    },
    {
      columnKey: "Age",
      columnName: "Age",
      dataType: "number",
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
      columnKey: "VacancyName",
      columnName: "Job Position",
      dataType: "string",
      visible: true,
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
        console.log(sortStages);
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
      template: (row) => {
        return (
          <div
            style={{
              display: "grid",
              placeItems: "center",
              padding: "0.25rem 0.5rem",
              borderRadius: "1.5rem",
              backgroundColor: getStatusColorByLabel(row?.data?.Status),
            }}
          >
            <span
              style={{
                fontSize: "0.875rem",
                color: "#fff",
              }}
            >
              {row?.data?.Status}
            </span>
          </div>
        );
      },
    },
  ];

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

  const getStatusColorByLabel = (label) => {
    switch (label) {
      case "Without Status":
        return "#808080";
      case "Offer Accepted":
        return "#0CA474";
      case "Hired":
        return "#0CA474";
      case "On Hold":
        return "#D08B30";
      case "Reserved":
        return "#D08B30";
      case "Offer Rejected":
        return "#E74C3C";
      case "Candidate Refusal":
        return "#D03053";
      case "Offered":
        return "#0CA474";
      case "Under Review":
        return "#D08B30";
      case "Rejected":
        return "#D03053";
      default:
        return "#808080";
    }
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

  const getData = async (options) => {
    try {
      const response = await getArchivedCandidates({
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

  useUpdateEffect(() => {
    if (
      actionTrigger &&
      actionTrigger ===
        CandidateActionTypes.REQUEST_TYPES.RELOAD_CANDIDATES_DATA
    ) {
      setRefreshDataSource((state) => (state += 1));
      setActionTrigger(null);
    }
  }, [actionTrigger]);

  useUpdateEffect(() => {
    setRefreshDataSource((state) => (state += 1));
  }, [selectedQuickFilter]);

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
            label: "Move to Current List",
            type: "MOVE_TO_CURRENT",
            icon: () => <IconDataBase />,
            event: (type, data) => {
              setMoveToCurrentList({
                CandidateID: data.CandidateID,
                CandidateName: data.CandidateName,
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
        disableOverflow={[7, 8, 9, 10, 11, 12, 13]}
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

  const moveToCurrentListBulk = async () => {
    setMoveToCurrentList({
      CandidatesJson: selectedRowsData.map((item) => ({
        CandidateID: item.CandidateID,
        CandidateName: item.CandidateName,
      })),
    });
  };

  return (
    <div className={style.archivedCandidatesContent}>
      <CandidateTabs />
      <div className={style.quickFilters} style={{ marginTop: "1.5rem" }}>
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
      <div className={`${style.quickActions} ${style.quickActionWithLength}`}>
        <span>{selectedRowsData.length} selected</span>

        <ul>
          <li
            className={style.quickAction}
            onClick={() => moveToCurrentListBulk()}
          >
            <span>Move To Current List</span>
          </li>
        </ul>
      </div>
      <div
        style={{ height: `calc(100vh - 10rem)` }}
        className={style.datagridContainer}
      >
        {datagrid}
      </div>
    </div>
  );
};
