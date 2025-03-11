import style from "@/pages/candidates/style/SharedToManager.module.scss";
import Grid from "masterComponents/Grid";
import { useRef, useState, useMemo } from "react";
import { getSharedToManagerCandidates } from "./api/CandidatesApi";
import { UsersContainer } from "../vacancies/components/UsersContainer";
import IconLike from "@/assets/icons/other/IconLike";
import Tooltip from "masterComponents/Tooltip";
import Tag from "masterComponents/Tag";
import { setCandidateLike } from "./api/CandidatesApi";
import IconComment from "@/assets/icons/other/IconComment";
import { useCandidatesStore } from "./store/CandidatesStore";
import { useNavigate } from "react-router-dom";
export const SharedToManager = () => {
  const [refreshDataSource, setRefreshDataSource] = useState(0);
  const { setViewCommentsTo } = useCandidatesStore();
  const navigate = useNavigate();
  const isLocalhost = window.location.hostname === "localhost";

  const getData = async (options) => {
    try {
      const response = await getSharedToManagerCandidates({
        ...options,
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

  const columns = [
    {
      columnKey: "CandidateID",
      columnName: "ID",
      dataType: "number",
      visible: true,
      allowFiltering: false,
      template: (row) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
      columnKey: "TotalScore",
      columnName: "Score",
      dataType: "string",
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
    {
      columnKey: "",
      columnName: "",
      dataType: "string",
      visible: true,
      allowFiltering: false,
      template: (row) => {
        return (
          <div
            onClick={() => {
              setViewCommentsTo({
                CandidateID: row?.data?.CandidateID,
                VacancyID: row?.data?.VacancyID,
              });
            }}
            style={{ display: "grid", placeItems: "center", cursor: "pointer" }}
          >
            <IconComment />
          </div>
        );
      },
    },
  ];

  const datagrid = useMemo(() => {
    return (
      <Grid
        customColumns={columns}
        withCustomActions={false}
        withColumnConfigure={true}
        disableOverflow={[7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20]}
        height={"100%"}
        withCustomStore={true}
        loadFunction={(options) => getData(options)}
        storeKey={"CandidateVacancyID"}
        keyExpr={"CandidateVacancyID"}
        filterOptions={{ headerFilter: false, filterRow: true }}
        scrollMode={"none"}
        withGrouping={false}
        onRowPrepared={(e) => {
          e.rowElement.style.borderLeft = `0.125rem solid ${e?.data?.Color}`;
        }}
      />
    );
  }, [refreshDataSource]);
  return <div className={style.sharedToManager}>{datagrid}</div>;
};
