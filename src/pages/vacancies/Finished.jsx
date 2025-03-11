import style from "@/pages/vacancies/style/FinishedVacancies.module.scss";
import { useEffect, useMemo, useState } from "react";
import {
  getFinishedVacancies,
  getFinishedVacanciesRecruiter,
  getSummary,
} from "./api/VacanciesApi";
import Grid from "masterComponents/Grid";
import FormDropdown from "masterComponents/FormDropdown";
import { UsersContainer } from "./components/UsersContainer";
import IconRenew from "@/assets/icons/other/IconRenew";
import { useVacanciesStore } from "./store/VacanciesStore";
import { ReOpenVacancy } from "./templates/ReOpenVacancy";
import { storeActionTypes } from "./constants";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useParams } from "react-router-dom";

export const Finished = () => {
  const { mode } = useParams();
  const isAdmin = mode ? mode == storeActionTypes.USER_MODES.HR : false;

  const { setController, actionTrigger, setActionTrigger, summary } =
    useVacanciesStore((state) => state);
  const [refreshDataSource, setRefreshDataSource] = useState(1);

  const columns = [
    {
      columnKey: "VacancyID",
      columnName: "ID",
      dataType: "number",
      visible: true,
    },
    {
      columnKey: "UnitHead",
      columnName: "Head",
      dataType: "string",
      group: true,
      visible: true,
    },
    {
      columnKey: "JobName",
      columnName: "Job",
      dataType: "string",
      visible: true,
    },
    {
      columnKey: "Office",
      columnName: "Office/Org",
      dataType: "string",
      visible: true,

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
      columnName: "Positions",
      dataType: "number",
      visible: true,
      width: "7.5rem",
    },
    {
      columnKey: "WorkTypes",
      columnName: "WorkTypes",
      dataType: "number",
      visible: true,

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
      columnKey: "DaysPlaced",
      columnName: "DaysPlaced",
      visible: true,

      dataType: "number",
    },
    {
      columnKey: "RequestDate",
      columnName: "RequestDate",
      visible: true,

      dataType: "date",
      // template: (data) => templateDate(data),
    },
    {
      columnKey: "ViewsCount",
      columnName: "Views",
      visible: false,
      dataType: "number",
    },
    {
      columnKey: "TotalApplied",
      columnName: "TotalApplied",
      dataType: "number",
      visible: false,
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
      template: (data) => templateStatus(data?.data?.Status),
      width: 120,
    },
    {
      columnKey: "VacancyHeadJson",
      columnName: "Head",
      dataType: "string",
      template: (data) => templateUsers(data, "VacancyHeadJson"),
      visible: true,
    },
    {
      columnKey: "PlacementType",
      columnName: "PlacementType",
      visible: true,
      dataType: "string",
    },
    {
      columnKey: "",
      columnName: "",
      visible: true,
      width: 120,
      dataType: "string",
      visible: !!isAdmin,
      template: (data) => {
        return (
          <div
            className={style.reNewIcon}
            onClick={() =>
              setController({
                actionType: storeActionTypes.OPEN_MODAL,
                requestType: storeActionTypes.REQUEST_TYPES.RE_OPEN_VACANCY,
                title: "Make Dublicate Request",
                modalOptions: {
                  renderTemplate: () => (
                    <ReOpenVacancy ID={data.data.VacancyID} />
                  ),
                },
              })
            }
          >
            <IconRenew />
          </div>
        );
      },
    },
  ];

  const templateUsers = (row, key) => {
    if (!row || !key) return;
    const users = row?.data[key] ? JSON.parse(row?.data[key]) : [];
    const visibleUsers = users.slice(0, 2).map((user) => {
      return {
        ID: user.ID,
        Name: user.HeadName || user.Name,
      };
    });
    const hiddenUsers = users.slice(2, users.length).map((user) => {
      return {
        ID: user.ID,
        Name: user.HeadName || user.Name,
      };
    });
    console.log(visibleUsers, hiddenUsers);

    return (
      <UsersContainer
        visibleRecruiters={visibleUsers}
        hiddenRecruiters={hiddenUsers}
      />
    );
  };

  const templateStatus = (title) => {
    const hexToRGBA = (hex, opacity) =>
      `rgba(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(
        hex.slice(3, 5),
        16
      )}, ${parseInt(hex.slice(5, 7), 16)}, ${opacity})`;
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
    return (
      <div
        className={style.statusTemplateContainer}
        style={{
          background: hexToRGBA(colors[title?.split(" ")?.join("")], 0.1),
        }}
      >
        <span style={{ color: colors[title?.split(" ")?.join("")] }}>
          {title ?? ""}
        </span>
      </div>
    );
  };

  const getData = async (options) => {
    let data;
    const caller = isAdmin
      ? getFinishedVacancies
      : getFinishedVacanciesRecruiter;
    await caller({
      ...options,
      group: options.group.filter((el) => el.selector !== "UnitHead"),
    }).then((response) => {
      if (response?.data?.data[0]?.key && response?.data?.data[0]?.count) {
        data = response.data.data;
        return;
      }

      data = response.data.data.reduce((acc, el) => {
        const foundGroup = acc.find((group) => group.key === el.UnitHead);

        if (foundGroup) {
          foundGroup.items.push(el);
        } else {
          acc.push({
            key: el.UnitHead,
            items: [el],
          });
        }

        return acc;
      }, []);
    });

    return data || [];
  };

  const dataGrid = useMemo(() => {
    return (
      <Grid
        withColumnConfigure={true}
        customColumns={columns}
        withCustomActions={false}
        withCustomStore={true}
        loadFunction={(options) => getData(options)}
        storeKey={"VacancyID"}
        keyExpr={"VacancyID"}
        filterOptions={{ headerFilter: true, filterRow: true }}
        scrollMode={"none"}
        withGrouping={true}
        height="100%"
        onRowPrepared={(e) => {
          e.rowElement.style.borderLeft = `0.1875rem solid ${e?.data?.Color}`;
        }}
      />
    );
  }, [refreshDataSource]);

  useUpdateEffect(() => {
    if (
      actionTrigger == storeActionTypes.REQUEST_ACTIONS.GET_VACANCY_BOARD_DATA
    ) {
      setRefreshDataSource((state) => (state += 1));
      setActionTrigger(null);
    }
  }, [actionTrigger]);

  return (
    <div>
      <div className={style.infoPanel}>
        <ul>
          {summary?.Finished
            ? Object.keys(summary?.Finished).map((key, index) => {
                return (
                  <li key={index}>
                    <div className={style.dotMark}></div>
                    <div>
                      <span>
                        {summary?.Finished ? summary?.Finished[key] : ""}
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
      <div style={{ marginTop: "1rem" }}>{dataGrid}</div>
    </div>
  );
};
