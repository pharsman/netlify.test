import { Fragment, useEffect, useRef, useState } from "react";
import FormDropdown from "masterComponents/FormDropdown";
import FormMultiSelectDropdown from "masterComponents/FormMultiSelectDropdown";
import FormInput from "masterComponents/FormInput";
import CheckBox from "masterComponents/CheckBox";
import Datepicker from "masterComponents/Datepicker";
import Textarea from "masterComponents/Textarea";
import { useVacanciesStore } from "../store/VacanciesStore";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import style from "@/pages/vacancies/style/RequestVacancy.module.scss";
import {
  getOffices,
  getUnits,
  getJobs,
  getHeadOfUnit,
  getWorkingTypes,
  getForDuplicate,
  setDuplicateVacancy,
} from "../api/VacanciesApi";
import { ApplyFormPreview } from "../components/ApplyFormPreview";

import Loader from "masterComponents/Loader";
import { __findNodeByKey } from "@/utils/helpers";
import { storeActionTypes } from "../constants";
export const ReOpenVacancy = ({ ID }) => {
  const [previewMode, setPreviewMode] = useState(false);
  const initialData = [
    {
      component: FormDropdown,
      key: "OFFICE",
      props: {
        label: "Office",
        data: [],
        size: "small",
        withClear: true,
        withFilter: true,
        isRequired: true,
        value: "",
      },
    },
    {
      component: FormDropdown,
      key: "UNIT",
      props: {
        label: "Unit",
        data: [],
        size: "small",
        withClear: true,
        withFilter: true,
        isRequired: true,
        value: "",
      },
    },
    {
      component: FormMultiSelectDropdown,
      key: "HEAD_OF_UNIT",
      props: {
        label: "Head Of Unit",
        data: [],
        size: "small",
        value: "",
        isRequired: true,
        withApply: false,
      },
    },
    {
      component: FormDropdown,
      key: "JOB",
      props: {
        label: "Job",
        data: [],
        withClear: true,
        size: "small",
        withFilter: true,
        isRequired: true,
        value: "",
      },
    },
    {
      component: FormInput,
      key: "OPEN_POSITION_QTY",
      props: {
        label: "Open Position Qty",
        size: "small",
        inputType: "number",
        acceptNegativeNumbers: false,
        isRequired: true,
        value: "",
      },
    },
    {
      component: FormDropdown,
      key: "WORK_TYPE",
      props: {
        label: "Work Type",
        withClear: true,
        data: [],
        size: "small",
        value: "",
      },
    },
    {
      component: Datepicker,
      key: "JOB_START_DATE",
      props: {
        placeholder: "Job Start Date",
        data: [],
        size: "large",
        valueFormat: "YYYY-MM-DD",
        value: "",
      },
    },
    {
      component: FormMultiSelectDropdown,
      key: "PREV_RECRUITER",
      props: {
        label: "Previous Recruiter",
        data: [],
        size: "small",
        withFilter: false,
        value: "",
        disabled: true,
      },
    },
    {
      component: Textarea,
      key: "COMMENT",
      props: {
        placeholder: "Type comment here...",
        value: "",
        textareaStyle: {
          border: "0.0625rem solid #D1D5D6",
          resize: "vertical",
          width: "100%",
        },
      },
    },
  ];
  const [updateSource, setUpdateSource] = useState(1);
  const [data, setData] = useState([]);
  const formRef = useRef(null);
  const [details, setDetails] = useState(null);
  const [trigger, setTrigger] = useState(false);
  const [loading, setLoading] = useState(false);
  const skipAutoTrigger = useRef(false);
  const { actionTrigger, setActionTrigger, setController } = useVacanciesStore(
    (state) => state
  );
  const handleValuesUpdate = async (
    key,
    value,
    isGrouped = false,
    groupKey = null
  ) => {
    setData((prev) => {
      const newData = [...prev];

      if (isGrouped && groupKey) {
        const group = newData.find((el) => el.key === groupKey);
        if (group && group.children) {
          const child = group.children.find((child) => child.key === key);
          if (child) {
            child.props.value = value;
          }
        }
      } else {
        const element = newData.find((el) => el.key === key);
        if (element) {
          element.props.value = value;
        }
        if (key === "JOB" && element.props.data.length > 0 && value) {
          __findNodeByKey(newData, "key", "OPEN_POSITION_QTY").props.value =
            element.props.data.find((f) => f.id === value)?.freePositions;
        }
      }

      return newData;
    });

    if (!skipAutoTrigger.current) {
      if (key === "OFFICE") {
        clearFilterElementValues();
        await getUnitsData(value);
      }
      if (key === "UNIT") {
        await getHeadOfUnitData(value);

        await getJobsData(value);
      }
    }
  };

  const getHeadOfUnitData = async (OrgUnitID) => {
    await getHeadOfUnit({
      OrgUnitID,
    }).then((response) => {
      setData((prev) => {
        const newData = [...prev];
        __findNodeByKey(newData, "key", "HEAD_OF_UNIT").props.data =
          response?.data.map((el) => ({
            id: el.ID,
            label: el.Name,
            isHead: el.IsHead,
          }));
        return newData;
      });
    });
  };

  const getOfficesData = async () => {
    await getOffices().then((response) => {
      setData((prev) => {
        const newData = [...prev];
        __findNodeByKey(newData, "key", "OFFICE").props.data =
          response?.data.map((el) => ({ id: el.ID, label: el.Name }));
        return newData;
      });
    });
  };

  const getUnitsData = async (OfficeID) => {
    await getUnits({
      OfficeID: OfficeID,
    }).then((response) => {
      setData((prev) => {
        const newData = [...prev];
        const element = __findNodeByKey(newData, "key", "UNIT");
        element.props.data = response?.data.map((el) => ({
          id: el.ID,
          label: el.Name,
        }));
        return newData;
      });
    });
  };

  const getJobsData = async (OrgUnitID) => {
    if (!OrgUnitID) return;
    await getJobs({ OrgUnitID }).then((response) => {
      setData((prev) => {
        const newData = [...prev];
        __findNodeByKey(newData, "key", "JOB").props.data = response?.data.map(
          (el) => ({
            id: el.ID,
            label: el.Name,
            freePositions: el?.FreePositions,
          })
        );
        return newData;
      });
    });
  };

  const clearFilterElementValues = () => {
    setData((prev) => {
      const newData = [...prev];
      ["UNIT", "HEAD_OF_UNIT", "JOB"].forEach((el) => {
        if (["UNIT", "JOB"].includes(el)) {
          __findNodeByKey(newData, "key", el).props.data = [];
          setTrigger(true);
        } else {
          __findNodeByKey(newData, "key", el).props.data.forEach(
            (n) => (n["selected"] = false)
          );
        }
        __findNodeByKey(newData, "key", el).props.value = "";
      });
      return newData;
    });
  };

  const getWorkingTypesData = async () => {
    await getWorkingTypes().then((response) => {
      setData((prev) => {
        const newData = [...prev];
        __findNodeByKey(newData, "key", "WORK_TYPE").props.data =
          response?.data?.data.map((el) => ({ id: el.ID, label: el.Name }));
        return newData;
      });
    });
  };

  const getAndSetFilterValues = async (parametersData) => {
    console.log(parametersData);
    setLoading(true);
    await getUnitsData(parametersData?.OfficeID);
    await getHeadOfUnitData(parametersData?.OrgUnitID);
    await getJobsData(parametersData?.OrgUnitID);
    setLoading(false);
    setData((prev) => {
      const newData = [...prev];
      __findNodeByKey(newData, "key", "UNIT").props.value =
        parametersData?.OrgUnitID;
      __findNodeByKey(newData, "key", "JOB").props.value =
        parametersData?.JobID;
      __findNodeByKey(newData, "key", "HEAD_OF_UNIT").props?.data?.map(
        (node) => {
          if (
            parametersData?.VacancyHeads &&
            parametersData.VacancyHeads.map((el) => el.UserID)?.includes(
              node.id
            )
          )
            node["selected"] = true;
        }
      );
      return newData;
    });
    setUpdateSource((state) => (state += 1));
    setTimeout(() => {
      skipAutoTrigger.current = false;
    }, 1000);
  };

  const getSingleVacancyData = async () => {
    if (!ID) return;
    setLoading(true);
    await getForDuplicate({
      VacancyID: ID ?? null,
    }).then((response) => {
      const data = response?.data || [];
      setLoading(false);
      if (response.data) {
        setDetails(data);
        getAndSetFilterValues(data);
      }
    });
  };

  const sendRequest = async (event) => {
    event.preventDefault();
    setLoading(true);
    const getValue = (key) =>
      __findNodeByKey(data, "key", key).props.value ?? null;

    const dataSet = {
      FromVacancyID: ID ?? null,
      OfficeID: getValue("OFFICE") ?? null,
      JobID: getValue("JOB") ?? null,
      FreePositionsCount: getValue("OPEN_POSITION_QTY") ?? null,
      JobStartDate: getValue("JOB_START_DATE") ?? null,
      Comment: getValue("COMMENT") ?? null,
      UnitHeadsJson:
        JSON.stringify(getValue("HEAD_OF_UNIT")?.map((el) => el.id)) ?? null,
      WorkingTypesJson: getValue("WORK_TYPE")
        ? JSON.stringify([getValue("WORK_TYPE")])
        : null,
    };
    try {
      await setDuplicateVacancy(dataSet).then((response) => {
        if (response.data.Error) {
          setLoading(false);
          setActionTrigger(null);
          return;
        }
        setLoading(false);
        setActionTrigger(
          storeActionTypes.REQUEST_ACTIONS.GET_VACANCY_BOARD_DATA
        );
        setController({ actionType: storeActionTypes.CLOSE_MODAL });
      });
    } catch (error) {
      setLoading(false);
      setActionTrigger(null);
    }
  };

  const setFormValues = async () => {
    console.info(details);
    setData((prev) => {
      const newData = [...prev];
      __findNodeByKey(newData, "key", "OFFICE").props.value = details?.OfficeID;

      __findNodeByKey(newData, "key", "PREV_RECRUITER").props.data =
        details?.PrevRecruiters?.map((el) => ({
          label: el?.FullName,
          id: el.UserID,
          selected: true,
        }));
      __findNodeByKey(newData, "key", "OPEN_POSITION_QTY").props.value = "";
      __findNodeByKey(newData, "key", "WORK_TYPE").props.value = details
        ?.WorkingTypes[0]
        ? details.WorkingTypes[0].WorkingTypeID
        : "";
      __findNodeByKey(newData, "key", "JOB_START_DATE").props.value = "";
      __findNodeByKey(newData, "key", "COMMENT").props.value = "";
      return prev;
    });
  };

  useEffect(() => {
    if (trigger)
      setTimeout(() => {
        setTrigger(false);
      }, 100);
  }, [trigger]);

  useEffect(() => {
    if (!details) return;
    setFormValues();
  }, [details]);

  const initialCalls = async () => {
    setLoading(true);
    setData(initialData);

    await Promise.all([getOfficesData(), getWorkingTypesData()]);

    setLoading(false);
  };

  useEffect(() => {
    initialCalls().then(() => {
      if (ID) {
        getSingleVacancyData();
        skipAutoTrigger.current = true;
      }
    });
  }, []);

  useUpdateEffect(() => {
    if (
      actionTrigger == storeActionTypes.REQUEST_ACTIONS.SEND_REQUEST_VACANCY
    ) {
      formRef.current.requestSubmit();
      setActionTrigger(null);
    }
  }, [actionTrigger]);

  useEffect(() => {
    if (previewMode)
      document.querySelector(".mcPopup_global").style.width = "90%";
    else document.querySelector(".mcPopup_global").style.width = "";
  }, [previewMode]);

  return (
    <>
      <form ref={formRef} onSubmit={(event) => sendRequest(event)}>
        {previewMode ? <ApplyFormPreview vacancyID={ID} /> : ""}
        <div
          style={{ height: "100%", display: previewMode ? "none" : "initial" }}
        >
          {loading ? (
            <div
              style={{
                width: "100%",
                height: "75%",
                display: "grid",
                placeItems: "center",
                position: "absolute",
                zIndex: "50",
                background: "#ffffff70",
              }}
            >
              <Loader loading={true} circleColor={"#30ACD0"} />
            </div>
          ) : (
            ""
          )}
          <ul
            key={updateSource}
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {data.map((element, index) => (
              <li
                key={index}
                className={`${
                  element.key === "AMOUNT/CURRENCY"
                    ? style.amountCurrecnlyField
                    : ""
                }`}
              >
                {element.isGroup ? (
                  <div style={{ display: "flex", gap: "1rem" }}>
                    {element.children.map((child, ind) => (
                      <Fragment key={ind}>
                        <child.component
                          {...child.props}
                          checked={child.props.value}
                          selectedOptionID={child.props.value}
                          selected={(obj) =>
                            handleValuesUpdate(
                              child.key,
                              obj.id,
                              true,
                              element.key
                            )
                          }
                          change={(state) =>
                            handleValuesUpdate(
                              child.key,
                              state,
                              true,
                              element.key
                            )
                          }
                          onChange={(value) =>
                            handleValuesUpdate(
                              child.key,
                              value,
                              true,
                              element.key
                            )
                          }
                        />
                        {child.title ? <span>{child.title}</span> : null}
                      </Fragment>
                    ))}
                  </div>
                ) : (
                  <element.component
                    {...element.props}
                    triggerClear={
                      ["UNIT", "JOB"].includes(element.key) ? trigger : ""
                    }
                    value={element.props.value}
                    defaultValue={element.props.value}
                    selectedOptionID={element.props.value}
                    selected={(obj) =>
                      handleValuesUpdate(element.key, obj.id, false)
                    }
                    change={(state) =>
                      handleValuesUpdate(element.key, state, false)
                    }
                    onChange={(value) =>
                      handleValuesUpdate(element.key, value, false)
                    }
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
        {!loading ? (
          <span
            className={style.preview}
            onClick={() => setPreviewMode((state) => !state)}
            disabled={true}
          >
            {previewMode ? "Back" : "Preview"}
          </span>
        ) : (
          ""
        )}
      </form>
    </>
  );
};
