import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import style from "@/pages/vacancies/style/VacancyGrid.module.scss";
import Grid from "masterComponents/Grid";
import { deleteRequestVacancy, getVacancyList } from "./api/VacanciesApi";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useVacanciesStore } from "./store/VacanciesStore";
import { storeActionTypes } from "./constants";
import { RequestVacancy } from "./templates/RequestVacancy";
import { UsersContainer } from "./components/UsersContainer";

export const VacanciesGrid = () => {
  // const [gridData, setGridData] = useState([]);
  const {
    actionTrigger,
    setActionTrigger,
    setController,
    setOpenVacancyDetails,
    setOpenVacancyComments,
  } = useVacanciesStore((state) => state);
  const columns = [
    {
      columnKey: "VacancyID",
      columnName: "ID",
      dataType: "number",
      visible: true,
    },
    {
      columnKey: "JobName",
      columnName: "Job",
      dataType: "string",
      visible: true,
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
            <div style={{ display: "flex", gap: "6px" }}>
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
      columnName: "Unit Head",
      group: true,
      dataType: "string",
      visible: true,
    },
    {
      columnKey: "PositionCount",
      columnName: "Position Count",
      dataType: "number",
      visible: true,
    },
    {
      columnKey: "RequestDate",
      columnName: "Request Date",
      dataType: "date",
      visible: true,
    },
    {
      columnKey: "Recruiters",
      columnName: "Recruiters",
      dataType: "string",
      visible: true,
      template: (data) => recruitersTemplate(data?.data?.Recruiters),
    },
    {
      columnKey: "PlacementStartDate",
      columnName: "Placement StartDate",
      dataType: "date",
      visible: true,
    },
    {
      columnKey: "PlacementEndDate",
      columnName: "Placement EndDate",
      dataType: "date",
      visible: true,
    },
    {
      columnKey: "Status",
      columnName: "Status",
      dataType: "string",
      template: (data) => statusTemplate(data.data.Status),
      visible: true,
    },
  ];

  const [gridItemActions, setGridItemActions] = useState([
    {
      label: "Edit",
      type: "edit_item",
      event: (type, data) => handleActions(type, data),
      icon: () => "",
      disabledForKeys: [],
    },
    {
      label: "Delete",
      type: "delete_item",
      event: (type, data) => handleActions(type, data),
      icon: () => "",
      disabledForKeys: [],
    },
    {
      label: "Open",
      type: "open",
      event: (type, data) => handleActions(type, data),
      icon: () => null,
    },
    {
      label: "See Comment",
      type: "see_comment",
      event: (type, data) => handleActions(type, data),
      icon: () => null,
    },
  ]);

  const statusTemplate = (title) => {
    const hexToRGBA = (hex, opacity) => {
      if (!hex) return;
      return `rgba(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(
        hex.slice(3, 5),
        16
      )}, ${parseInt(hex?.slice(5, 7), 16)}, ${opacity})`;
    };

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
          background: title
            ? hexToRGBA(colors[title?.split(" ")?.join("")], 0.1)
            : "",
        }}
      >
        <span style={{ color: colors[title?.split(" ")?.join("")] }}>
          {title ?? ""}
        </span>
      </div>
    );
  };

  const recruitersTemplate = (data) => {
    const recruiters = data ? JSON.parse(data) : [];
    const visibleRecruiters = recruiters.slice(0, 3);
    const hiddenRecruiters = recruiters.slice(3, recruiters.length);

    return (
      <UsersContainer
        visibleRecruiters={visibleRecruiters}
        hiddenRecruiters={hiddenRecruiters}
      />
    );
  };

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

  const handleActions = async (type, data) => {
    console.log(data);
    switch (type) {
      case "edit_item": {
        setController({
          actionType: storeActionTypes.OPEN_MODAL,
          requestType: storeActionTypes.REQUEST_TYPES.REQUEST_VACANCY,
          modalOptions: {
            renderTemplate: () => (
              <RequestVacancy editMode={true} ID={data.VacancyID} />
            ),
          },
        });
        break;
      }
      case "open": {
        setOpenVacancyDetails(data.VacancyID);
        break;
      }
      case "delete_item": {
        await deleteRequestVacancy({ VacancyID: data.VacancyID }).then(() => {
          setActionTrigger(
            storeActionTypes.REQUEST_ACTIONS.GET_VACANCY_BOARD_DATA
          );
        });
        break;
      }
      case "see_comment": {
        setOpenVacancyComments(data.VacancyID);
        break;
      }
    }
  };

  const getData = async (options) => {
    if (actionTrigger) setActionTrigger(null);
    let data = [];
    await getVacancyList({
      ...options,
      group: options.group.filter((el) => el.selector !== "UnitHead"),
    }).then((response) => {
      // data = response.data.data;
      if (response?.data?.data[0].key && response?.data?.data[0].count) {
        data = response.data.data;
        return;
      }
      data = generateColorMap(
        response.data.data.reduce((acc, el) => {
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
        }, [])
      );

      if (response.data) {
        setGridItemActions((prev) => {
          const newGridItemActions = [...prev];
          ["edit_item", "delete_item"].forEach((action) => {
            newGridItemActions.find(
              (el) => el.type === action
            ).disabledForKeys = response.data.data
              .filter(
                (obj) =>
                  obj.Status !== "Requested" &&
                  obj.Status !== "Request Draft" &&
                  obj.Status !== "Draft"
              )
              ?.map((item) => item.VacancyID);
            console.log(newGridItemActions.find((el) => el.type === action));
          });
          return newGridItemActions;
        });
      }
    });

    return data;
  };

  const dataGrid = useMemo(() => {
    return (
      <Grid
        customColumns={columns}
        customActions={gridItemActions}
        withCustomActions={true}
        withCustomStore={true}
        loadFunction={(options) => getData(options)}
        storeKey={"VacancyID"}
        keyExpr={"VacancyID"}
        filterOptions={{ headerFilter: false, filterRow: true }}
        scrollMode={"none"}
        withGrouping={true}
        height="100%"
        onRowPrepared={(e) => {
          e.rowElement.style.borderLeft = `3px solid ${e?.data?.Color}`;
        }}
        // data={gridData}
      />
    );
  }, []);

  useEffect(() => {
    // getData();
  }, []);

  useUpdateEffect(() => {
    if (
      actionTrigger == storeActionTypes.REQUEST_ACTIONS.GET_VACANCY_BOARD_DATA
    ) {
      // getData();
    }
  }, [actionTrigger]);

  return <div className={style.vacancyGridWrapper}>{dataGrid}</div>;
};
