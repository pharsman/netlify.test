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
import { createNotification } from "masterComponents/Notification";

import {
  getOffices,
  getUnits,
  getHeadOfUnit,
  getJobs,
  getWorkingTypes,
  getCurrencies,
  getSalarieTypes,
  setVacancyRequest,
  getSingleVacancyDetails,
  setVacancyUpdate,
} from "../api/VacanciesApi";

import Loader from "masterComponents/Loader";
import { __findNodeByKey } from "@/utils/helpers";
import { storeActionTypes } from "../constants";
export const RequestVacancy = ({ editMode, ID }) => {
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
      component: Textarea,
      key: "WORKING_SCHEDULE_DETAILS",
      props: {
        placeholder: "Working Schedule Details",
        size: "small",
        value: "",
        textareaStyle: {
          border: "0.0625rem solid #D1D5D6",
          resize: "vertical !important",
          width: "100%",
          height: "3.75rem",
        },
      },
    },
    {
      component: FormDropdown,
      key: "SALARY_TYPE",
      props: {
        label: "Salary Type",
        withClear: true,
        data: [],
        size: "small",
        value: "",
      },
    },
    {
      isGroup: true,
      key: "AMOUNT/CURRENCY",
      children: [
        {
          component: FormInput,
          key: "AMOUNT",
          props: {
            label: "Amount",
            size: "small",
            // placeholder: "Enter a range like 1000-6000",
            value: "",
          },
        },
        {
          component: FormDropdown,
          key: "CURRENCY",
          props: {
            label: "Currency",
            withClear: true,
            data: [],
            size: "small",
            value: "",
          },
        },
      ],
    },
    {
      isGroup: true,
      key: "BONUSES/NEGOTIABLE",
      children: [
        {
          component: CheckBox,
          key: "ADDITIONAL_BONUS",
          title: "Additional Bonus",
          props: {
            size: "small",
            value: "",
          },
        },
        {
          component: CheckBox,
          key: "IS_NEGOTIABLE",
          title: "Is Negotiable",
          props: {
            size: "small",
            value: "",
          },
        },
      ],
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
        const jobElement = __findNodeByKey(newData, "key", "JOB") ?? null;
        const maxPos = jobElement
          ? jobElement.props.data.find((e) => e.id == jobElement.props.value)
              ?.freePositions
          : null;
        const element = newData.find((el) => el.key === key);
        if (element) {
          if (element.key === "OPEN_POSITION_QTY" && maxPos && value > maxPos) {
            element.props.value = maxPos;
          } else {
            element.props.value = value;
          }
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

  const getOfficesData = async () => {
    try {
      await getOffices().then((response) => {
        if (!response.data) return;
        setData((prev) => {
          const newData = [...prev];
          __findNodeByKey(newData, "key", "OFFICE").props.data =
            response?.data.map((el) => ({ id: el.ID, label: el.Name }));
          return newData;
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getUnitsData = async (OfficeID) => {
    try {
      await getUnits({
        OfficeID: OfficeID,
      }).then((response) => {
        if (!response.data) return;

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
    } catch (error) {
      console.log(error);
    }
  };

  const getHeadOfUnitData = async (OrgUnitID) => {
    try {
      await getHeadOfUnit({
        OrgUnitID,
      }).then((response) => {
        if (!response.data) return;

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
    } catch (error) {
      console.log(error);
    }
  };

  const getJobsData = async (OrgUnitID) => {
    if (!OrgUnitID) return;
    try {
      await getJobs({ OrgUnitID }).then((response) => {
        if (!response.data) return;

        setData((prev) => {
          const newData = [...prev];
          __findNodeByKey(newData, "key", "JOB").props.data =
            response?.data.map((el) => ({
              id: el.ID,
              label: el.Name,
              freePositions: el?.FreePositions,
            }));
          return newData;
        });
      });
    } catch (error) {
      console.log(error);
    }
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
    try {
      await getWorkingTypes().then((response) => {
        setData((prev) => {
          const newData = [...prev];
          __findNodeByKey(newData, "key", "WORK_TYPE").props.data =
            response?.data?.data.map((el) => ({ id: el.ID, label: el.Name }));
          return newData;
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrenciesData = async () => {
    try {
      await getCurrencies().then((response) => {
        setData((prev) => {
          const newData = [...prev];
          const group = __findNodeByKey(newData, "key", "AMOUNT/CURRENCY");
          __findNodeByKey(group.children, "key", "CURRENCY").props.data =
            response?.data.map((el) => ({ id: el.ID, label: el.Name }));
          return newData;
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getSalariesData = async () => {
    try {
      await getSalarieTypes().then((response) => {
        setData((prev) => {
          const newData = [...prev];
          __findNodeByKey(newData, "key", "SALARY_TYPE").props.data =
            response?.data?.data.map((el) => ({ id: el.ID, label: el.Name }));
          return newData;
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getAndSetFilterValues = async (parametersData) => {
    setLoading(true);
    try {
      await getUnitsData(parametersData?.OfficeID);
      await getHeadOfUnitData(parametersData?.OrgUnitID);
      await getJobsData(parametersData?.OrgUnitID);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    setData((prev) => {
      const newData = [...prev];
      __findNodeByKey(newData, "key", "UNIT").props.value =
        parametersData?.OrgUnitID;
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
      __findNodeByKey(newData, "key", "JOB").props.value =
        parametersData?.JobID;
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
    try {
      await getSingleVacancyDetails({
        VacancyID: ID ?? null,
      }).then((response) => {
        const data = response?.data || [];
        setLoading(false);
        if (response.data) {
          setDetails(data);
          getAndSetFilterValues(data);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // const parseRange = (input) => {
  //   const sanitizedInput = input.replace(/[^0-9\s_\-]/g, "");
  //   const rangePattern = /^(\d+)[\s_\-]+(\d+)$/;
  //   const match = sanitizedInput.match(rangePattern);

  //   if (match) {
  //     const min = parseInt(match[1], 10);
  //     const max = parseInt(match[2], 10);
  //     return { min, max };
  //   } else {
  //     return {
  //       error:
  //         "Invalid input. Please provide a range in the format '3000-6000', '300 500', or '1200_300'.",
  //     };
  //   }
  // };

  const parseRange = (input) => {
    const sanitizedInput = input.replace(/[^0-9\s_\-]/g, "");

    const rangePattern = /^(\d+)[\s_\-]*(\d+)?$/;
    const match = sanitizedInput.match(rangePattern);

    if (match) {
      const min = parseInt(match[1], 10);
      const max = match[2] ? parseInt(match[2], 10) : null;

      if (max !== null && min > max) {
        return {
          error:
            "Invalid range. The first number must be less than or equal to the second.",
        };
      }
      return max ? { min, max } : { min };
    } else {
      return {
        error:
          "Invalid input. Please provide a number or a range in the format '3000-6000', '300 500', or '1200_300'.",
      };
    }
  };

  const sendRequest = async (event, isDraft) => {
    event.preventDefault();
    setLoading(true);
    const getValue = (key, groupKey = null) => {
      const target = groupKey
        ? __findNodeByKey(
            __findNodeByKey(data, "key", groupKey).children,
            "key",
            key
          )
        : __findNodeByKey(data, "key", key);
      return target?.props?.value;
    };
    const amountInput = getValue("AMOUNT", "AMOUNT/CURRENCY");
    let amountValue = null;

    if (
      amountInput?.trim() === "" ||
      (amountInput.length && !parseRange(amountInput)?.error)
    ) {
      if (amountInput.trim() !== "") {
        amountValue = parseRange(amountInput);
      }
    } else {
      setLoading(false);
      setActionTrigger(null);
      createNotification(
        `Please provide a range in the format 'xxxx-xxxxx', 'xxx xxx', or 'xxx_xxx'`,
        "warning",
        3000,
        "top-right",
        2
      );
      return;
    }

    const dataSet = {
      VacancyID: editMode ? ID : null,
      OfficeID: getValue("OFFICE") ?? null,
      UnitHeadsJson: getValue("HEAD_OF_UNIT")
        ? JSON.stringify(getValue("HEAD_OF_UNIT")?.map((el) => el.id))
        : null,
      JobID: getValue("JOB") ?? null,
      FreePositionsCount: getValue("OPEN_POSITION_QTY") ?? null,
      WorkingTypesJson: JSON.stringify([getValue("WORK_TYPE")]) ?? null,
      WorkingDetails: getValue("WORKING_SCHEDULE_DETAILS") ?? null,
      SalaryTypeID: getValue("SALARY_TYPE") ?? null,
      SalaryMinAmount: Number(amountValue?.min) ?? null,
      SalaryMaxAmount: Number(amountValue?.max) ?? null,
      SalaryCurrencyID: getValue("CURRENCY", "AMOUNT/CURRENCY") ?? null,
      HaveBonus: getValue("ADDITIONAL_BONUS", "BONUSES/NEGOTIABLE") ?? null,
      IsNegotiable: getValue("IS_NEGOTIABLE", "BONUSES/NEGOTIABLE") ?? null,
      JobStartDate: getValue("JOB_START_DATE") ?? null,
      Comment: getValue("COMMENT") ?? null,
      StatusID: isDraft
        ? storeActionTypes.STATUS_TYPES.REQUESTDRAFT
        : storeActionTypes.STATUS_TYPES.REQUESTED,
    };

    try {
      const apiCaller = editMode ? setVacancyUpdate : setVacancyRequest;
      await apiCaller(dataSet).then((response) => {
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
    setData((prev) => {
      const newData = [...prev];
      const amountGroup = __findNodeByKey(newData, "key", "AMOUNT/CURRENCY");
      const bonusesGroup = __findNodeByKey(
        newData,
        "key",
        "BONUSES/NEGOTIABLE"
      );
      __findNodeByKey(newData, "key", "OFFICE").props.value = details?.OfficeID;

      __findNodeByKey(newData, "key", "OPEN_POSITION_QTY").props.value =
        details?.FreePositionsCount;
      __findNodeByKey(newData, "key", "WORK_TYPE").props.value = details
        ?.WorkingTypes[0]
        ? details.WorkingTypes[0].WorkingTypeID
        : "";
      __findNodeByKey(newData, "key", "WORKING_SCHEDULE_DETAILS").props.value =
        details?.WorkingDetails;
      __findNodeByKey(newData, "key", "SALARY_TYPE").props.value =
        details?.SalaryTypeID;
      __findNodeByKey(amountGroup.children, "key", "AMOUNT").props.value = `${
        details?.SalaryMinAmount ?? ""
      } ${details?.SalaryMaxAmount ?? ""}`;
      __findNodeByKey(amountGroup.children, "key", "CURRENCY").props.value =
        details?.SalaryCurrencyID;
      __findNodeByKey(
        bonusesGroup.children,
        "key",
        "ADDITIONAL_BONUS"
      ).props.value = details?.HaveBonus;
      __findNodeByKey(
        bonusesGroup.children,
        "key",
        "IS_NEGOTIABLE"
      ).props.value = details?.IsNegotiable;
      __findNodeByKey(newData, "key", "JOB_START_DATE").props.value =
        details?.JobStartDate;

      // __findNodeByKey(newData, "key", "COMMENT").props.value = details
      //   ?.Comments[0]
      //   ? details?.Comments[0].Content
      //   : "";

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

    try {
      await Promise.all([
        getOfficesData(),
        getWorkingTypesData(),
        getCurrenciesData(),
        getSalariesData(),
      ]);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    initialCalls().then(() => {
      if (editMode && ID) {
        getSingleVacancyData();
        skipAutoTrigger.current = true;
      }
    });
  }, []);

  useUpdateEffect(() => {
    if (
      actionTrigger == storeActionTypes.REQUEST_ACTIONS.SEND_REQUEST_VACANCY ||
      actionTrigger ==
        storeActionTypes.REQUEST_ACTIONS.SEND_REQUEST_VACANCY_AS_DRAFT ||
      actionTrigger ==
        storeActionTypes.REQUEST_ACTIONS.SEND_REQUEST_VACANCY_UPDATE
    ) {
      formRef.current.requestSubmit();
      setActionTrigger(null);
      // sendRequest(
      //   actionTrigger ===
      //     storeActionTypes.REQUEST_ACTIONS.SEND_REQUEST_VACANCY_AS_DRAFT
      // );
    }
    // else if (
    //   actionTrigger ==
    //   storeActionTypes.REQUEST_ACTIONS.SEND_REQUEST_VACANCY_UPDATE
    // ) {
    //   sendRequest(false);
    // }
  }, [actionTrigger]);

  return (
    <form
      ref={formRef}
      onSubmit={(event) =>
        sendRequest(
          event,
          actionTrigger ==
            storeActionTypes.REQUEST_ACTIONS.SEND_REQUEST_VACANCY_AS_DRAFT
        )
      }
    >
      <div style={{ height: "100%" }}>
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
                <>
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
                  {element.key === "HEAD_OF_UNIT" ? (
                    <span className={style.unitInfoText}>
                      {"Potential Interviewer for Manager Interview Stage"}
                    </span>
                  ) : (
                    ""
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
};
