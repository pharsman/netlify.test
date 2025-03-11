import Grid from "masterComponents/Grid";
import { useEffect, useMemo, useState } from "react";
import { getRequestListsHr } from "./api/VacanciesApi";
import { UsersContainer } from "./components/UsersContainer";
import { useVacanciesStore } from "./store/VacanciesStore";
import IconAddCircle from "@/assets/icons/other/IconAddCircle";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { storeActionTypes } from "./constants";

export const Requested = () => {
  const [refreshDataSource, setRefreshDataSource] = useState(1);
  const { setAssignRecruiterTo, actionTrigger, setActionTrigger } =
    useVacanciesStore((state) => state);
  const columns = [
    {
      columnKey: "VacancyID",
      columnName: "ID",
      dataType: "number",
      allowFiltering: false,
    },
    {
      columnKey: "JobName",
      columnName: "Job",
      dataType: "string",
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
      columnKey: "UnitHead",
      columnName: "UnitHead",
      dataType: "string",
      group: true,
    },
    {
      columnKey: "Office",
      columnName: "Office",
      dataType: "string",
    },

    {
      columnKey: "Organization",
      columnName: "Organization",
      dataType: "string",
    },
    {
      columnKey: "PositionCount",
      columnName: "Position Count",
      dataType: "number",
    },
    {
      columnKey: "PreviousRecruitersJson",
      columnName: "Previous Recruiter",
      dataType: "string",
      template: (data) => {
        const users = data.data.PreviousRecruitersJson
          ? JSON.parse(data.data.PreviousRecruitersJson)
          : [];
        const usersMap = users.map((el) => ({
          Name: el.Name,
          AvatarUrl: el.AvatarUrl,
        }));
        const visibleUsers = usersMap.slice(0, 3);
        const hiddenUsers = usersMap.slice(3, usersMap.length);
        return (
          <UsersContainer
            visibleRecruiters={visibleUsers}
            hiddenRecruiters={hiddenUsers}
          />
        );
      },
    },
    {
      columnKey: "VacancyHeadJson",
      columnName: "VacancyHeadJson",
      allowFiltering: false,
      dataType: "string",
      template: (data) => {
        const users = data.data.VacancyHeadJson
          ? JSON.parse(data.data.VacancyHeadJson)
          : [];
        const usersMap = users.map((el) => ({
          Name: el.HeadName,
          AvatarUrl: el.AvatarUrl,
        }));
        const visibleUsers = usersMap.slice(0, 3);
        const hiddenUsers = usersMap.slice(3, usersMap.length);
        return (
          <UsersContainer
            visibleRecruiters={visibleUsers}
            hiddenRecruiters={hiddenUsers}
          />
        );
      },
    },
    {
      columnKey: "",
      columnName: "Recruiter",
      template: (data) => {
        return (
          <div
            style={{
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              width: "fit-content",
              margin: "auto",
            }}
            onClick={() => setAssignRecruiterTo({ id: data.data.VacancyID })}
          >
            <IconAddCircle />
          </div>
        );
      },
    },
  ];

  const generateColorMap = (data) => {
    const colorMap = {};
    const generateRandomColor = () => {
      return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    };
    return data.map((item) => {
      const { UnitHead } = item;

      if (!colorMap[UnitHead]) {
        colorMap[UnitHead] = generateRandomColor();
      }
      return {
        ...item,
        Color: colorMap[UnitHead],
      };
    });
  };

  const getData = async (options) => {
    let data;

    await getRequestListsHr({
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
  useUpdateEffect(() => {
    if (
      actionTrigger == storeActionTypes.REQUEST_ACTIONS.GET_VACANCY_BOARD_DATA
    ) {
      setRefreshDataSource((state) => (state += 1));
      setActionTrigger(null);
    }
  }, [actionTrigger]);
  const dataGrid = useMemo(() => {
    return (
      <Grid
        customColumns={columns}
        withCustomActions={false}
        withCustomStore={true}
        loadFunction={(options) => getData(options)}
        storeKey={"VacancyID"}
        keyExpr={"VacancyID"}
        filterOptions={{ headerFilter: false, filterRow: true }}
        scrollMode={"none"}
        withGrouping={true}
        height="100%"
        onRowPrepared={(e) => {
          e.rowElement.style.borderLeft = `0.1875rem solid ${e?.data?.Color}`;
        }}
        // data={gridData}
      />
    );
  }, [refreshDataSource]);
  return <div>{dataGrid}</div>;
};
