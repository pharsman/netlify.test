import { Fragment, useEffect, useRef, useState } from "react";
import FormDropdown from "masterComponents/FormDropdown";
import FormInput from "masterComponents/FormInput";
import CheckBox from "masterComponents/CheckBox";
import Radio from "masterComponents/Radio";
import Textarea from "masterComponents/Textarea";
import style from "@/pages/vacancies/style/steps/General.module.scss";
import Loader from "masterComponents/Loader";
import { useVacanciesStore } from "../../store/VacanciesStore";
import {
  getAssembleGeneral,
  getCities,
  getContractTypes,
  getCurrencies,
  getSalarieTypes,
  getWorkingTypes,
  setAssembleVacancyGeneralUpdate,
} from "../../api/VacanciesApi";
import { __collectKeyValuePairs, __findNodeByKey } from "@/utils/helpers";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { storeActionTypes } from "../../constants";
import { createNotification } from "masterComponents/Notification";

export const General = ({ vacancyID }) => {
  const [loading, setLoading] = useState(false);
  const [updateDataSource, setUpdateDataSource] = useState(1);
  const formRef = useRef(null);
  const { actionTrigger, loadNextStep, setActionTrigger } = useVacanciesStore(
    (state) => state
  );
  const initialData = [
    {
      component: FormDropdown,
      key: "JOB",
      props: {
        label: "Job",
        data: [],
        disabled: true,
        size: "small",
        withClear: true,
        isRequired: true,
        value: "",
      },
    },
    {
      component: FormDropdown,
      key: "ORGANIZATION",
      props: {
        label: "Organization",
        disabled: true,
        data: [],
        size: "small",
        withClear: true,
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
      key: "CITY",
      props: {
        label: "City",
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
      key: "WORK_TYPE",
      props: {
        label: "Work Type",
        data: [],
        size: "small",
        withClear: true,
        isRequired: true,
        value: "",
      },
    },
    {
      component: FormInput,
      key: "SCHEDULE_DETAILS",
      props: {
        label: "Schedule Details",
        size: "small",
        value: "",
      },
    },
    {
      component: FormDropdown,
      key: "SALARY_TYPE",
      props: {
        label: "Salary Type",
        data: [],
        size: "small",
        withClear: true,
        withFilter: true,
        isRequired: false,
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
            withClear: true,
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
      component: FormDropdown,
      key: "CONTRACT_TYPE",
      props: {
        label: "Contract Type",
        data: [],
        size: "small",
        withClear: true,
        withFilter: true,
        isRequired: true,
        value: "",
      },
    },
    {
      isGroup: true,
      key: "INTERNAL/EXTERNAL",
      children: [
        {
          component: CheckBox,
          key: "INTERNAL",
          title: "Internal",
          props: {
            size: "small",
            value: "",
          },
        },
        {
          component: CheckBox,
          key: "EXTERNAL",
          title: "External",
          props: {
            size: "small",
            value: "",
          },
        },
      ],
    },
    {
      component: "",
      key: "CUSTOM_FIELD_COMMENT",
      data: null,
    },
    {
      component: Textarea,
      key: "COMMENT",
      props: {
        placeholder: "Type comment here...",
        value: "",
        textareaStyle: {
          border: "0.0625rem solid #D1D5D6",
          resize: "none",
          width: "100%",
        },
      },
    },
    {
      isGroup: true,
      key: "PUBLIC/STAFF",
      children: [
        {
          component: Radio,
          key: "PUBLIC",
          title: "Public",
          props: {
            size: "small",
            value: "",
          },
        },
        {
          component: Radio,
          key: "STAFF",
          title: "Only for assigned staff",
          props: {
            size: "small",
            value: "",
          },
        },
      ],
    },
  ];
  const [data, setData] = useState([]);
  const originalData = useRef(null);
  const formatDate = (date) =>
    new Date(date)
      .toLocaleString("en-GB", { hour12: false })
      .replace(",", "")
      .replace(/\//g, ".");

  const getCurrenciesData = async () => {
    try {
      await getCurrencies().then((response) => {
        if (!response || response.Error || response.data.Error) return;
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

  const getCitiesData = async () => {
    try {
      await getCities().then((response) => {
        if (!response || response.Error || response.data.Error) return;
        setData((prev) => {
          const newData = [...prev];
          __findNodeByKey(newData, "key", "CITY").props.data =
            response?.data.map((el) => ({ id: el.ID, label: el.Name }));
          return newData;
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getContractTypesData = async () => {
    try {
      await getContractTypes().then((response) => {
        if (!response || response.Error || response.data.Error) return;
        setData((prev) => {
          const newData = [...prev];
          __findNodeByKey(newData, "key", "CONTRACT_TYPE").props.data =
            response?.data?.data.map((el) => ({ id: el.ID, label: el.Name }));
          return newData;
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getWorkingTypesData = async () => {
    try {
      await getWorkingTypes().then((response) => {
        if (!response || response.Error || response.data.Error) return;
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

  const getSingleVacancyData = async () => {
    if (!vacancyID) return;
    setLoading(true);
    try {
      await getAssembleGeneral({
        VacancyID: vacancyID ?? null,
      }).then((response) => {
        const data = response?.data || [];
        setLoading(false);
        if (response.data) {
          setFormValues(data);
          setUpdateDataSource((state) => (state += 1));
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const hasDataChanged = () => {
    const currentKeyValuePairs = __collectKeyValuePairs(data);
    return (
      JSON.stringify(originalData.current) !==
      JSON.stringify(currentKeyValuePairs)
    );
  };

  const setFormValues = async (details) => {
    setData((prev) => {
      const newData = [...prev];
      const getNode = (key, group = newData) =>
        __findNodeByKey(group, "key", key);

      const { General, Comments } = details || {};
      const {
        JobID,
        JobName,
        OrganizationID,
        OrganizationName,
        WorkingDetails,
        WorkingTypesJson,
        SalaryTypeID,
        SalaryMinAmount,
        SalaryMaxAmount,
        SalaryCurrencyID,
        FreePositionsCount,
        HaveBonus,
        IsNegotiable,
        IsExternal,
        CityID,
        ContractTypeID,
      } = General || {};
      const parsedWorkingTypes =
        JSON.parse(WorkingTypesJson || "[]")[0]?.ID || "";

      const publicGroup = getNode("INTERNAL/EXTERNAL");
      const amountGroup = getNode("AMOUNT/CURRENCY");
      const bonusesGroup = getNode("BONUSES/NEGOTIABLE");
      const jobElement = getNode("JOB");
      const orgElement = getNode("ORGANIZATION");

      jobElement.props = {
        ...jobElement.props,
        data: [{ label: JobName, id: JobID }],
        value: JobID,
      };
      orgElement.props = {
        ...orgElement.props,
        data: [{ label: OrganizationName, id: OrganizationID }],
        value: OrganizationID,
      };
      getNode("CITY").props.value = CityID;
      getNode("SCHEDULE_DETAILS").props.value = WorkingDetails;
      getNode("WORK_TYPE").props.value = parsedWorkingTypes;
      getNode("SALARY_TYPE").props.value = SalaryTypeID;
      getNode("OPEN_POSITION_QTY").props.value = FreePositionsCount;
      getNode("CUSTOM_FIELD_COMMENT").data = Comments;
      getNode("CONTRACT_TYPE").props.value = ContractTypeID;
      getNode("AMOUNT", amountGroup.children).props.value = `${
        SalaryMinAmount || ""
      }${SalaryMaxAmount ? ` ${SalaryMaxAmount}` : ""}`;

      getNode("CURRENCY", amountGroup.children).props.value = SalaryCurrencyID;
      getNode("ADDITIONAL_BONUS", bonusesGroup.children).props.value =
        HaveBonus;
      getNode("IS_NEGOTIABLE", bonusesGroup.children).props.value =
        IsNegotiable;

      if (IsExternal)
        getNode("EXTERNAL", publicGroup.children).props.value = true;
      else getNode("INTERNAL", publicGroup.children).props.value = true;

      originalData.current = __collectKeyValuePairs(newData);
      return newData;
    });
  };

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
            if (child.key === "PUBLIC") {
              group.children.find(
                (el) => el.key === "STAFF"
              ).props.value = false;
            }
            if (child.key === "STAFF") {
              group.children.find(
                (el) => el.key === "PUBLIC"
              ).props.value = false;
            }
            child.props.value = value;
          }
        }
      } else {
        const element = newData.find((el) => el.key === key);
        if (element) {
          element.props.value = value;
        }
      }

      return newData;
    });
  };

  const sendRequest = async (event) => {
    if (event) event.preventDefault();

    if (hasDataChanged()) {
      setLoading(true);

      const amountGroup = __findNodeByKey(data, "key", "AMOUNT/CURRENCY");
      const bonusesGroup = __findNodeByKey(data, "key", "BONUSES/NEGOTIABLE");
      const internalGroup = __findNodeByKey(data, "key", "INTERNAL/EXTERNAL");
      const publicGroup = __findNodeByKey(data, "key", "PUBLIC/STAFF");
      const amountInput = __findNodeByKey(amountGroup.children, "key", "AMOUNT")
        .props.value;
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
        VacancyID: vacancyID ?? null,
        JobID: __findNodeByKey(data, "key", "JOB").props.value ?? null,
        FreePositionsCount:
          __findNodeByKey(data, "key", "OPEN_POSITION_QTY").props.value ?? null,
        CityID: __findNodeByKey(data, "key", "CITY").props.value ?? null,
        WorkingTypesJson:
          JSON.stringify([
            __findNodeByKey(data, "key", "WORK_TYPE").props.value,
          ]) ?? null,
        WorkingDetails:
          __findNodeByKey(data, "key", "SCHEDULE_DETAILS").props.value ?? null,
        SalaryTypeID:
          __findNodeByKey(data, "key", "SALARY_TYPE").props.value ?? null,
        SalaryMinAmount: Number(amountValue?.min) ?? null,
        SalaryMaxAmount: Number(amountValue?.max) ?? null,
        SalaryCurrencyID:
          __findNodeByKey(amountGroup.children, "key", "CURRENCY").props
            .value ?? null,
        HaveBonus:
          __findNodeByKey(bonusesGroup.children, "key", "ADDITIONAL_BONUS")
            .props.value ?? null,
        IsNegotiable:
          __findNodeByKey(bonusesGroup.children, "key", "IS_NEGOTIABLE").props
            .value ?? null,
        ContractTypeID:
          __findNodeByKey(data, "key", "CONTRACT_TYPE").props.value ?? null,
        IsExternal:
          __findNodeByKey(internalGroup.children, "key", "EXTERNAL").props
            .value ?? false,
        Comment: __findNodeByKey(data, "key", "COMMENT").props.value ?? null,
        IsCommentPublic:
          __findNodeByKey(publicGroup.children, "key", "PUBLIC").props.value ??
          false,
      };

      try {
        await setAssembleVacancyGeneralUpdate(dataSet).then((response) => {
          setLoading(false);
          if (!response || response.Error || response.data.Error) {
            console.log("General, Request Error");
            setActionTrigger(null);
          } else {
            if (
              actionTrigger == storeActionTypes.REQUEST_ACTIONS.LOAD_NEXT_STEP
            ) {
              loadNextStep();
              setActionTrigger(null);
            }
          }
        });
      } catch (error) {
        setLoading(false);
        setActionTrigger(null);
      }
    } else {
      setActionTrigger(null);
      loadNextStep();
    }
  };

  const initialCalls = async () => {
    setLoading(true);
    setData(initialData);

    try {
      await Promise.all([
        getCitiesData(),
        getContractTypesData(),
        getWorkingTypesData(),
        getCurrenciesData(),
        getSalariesData(),
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialCalls().then(() => {
      getSingleVacancyData();
    });
  }, []);

  useUpdateEffect(() => {
    if (
      actionTrigger &&
      actionTrigger == storeActionTypes.REQUEST_ACTIONS.LOAD_NEXT_STEP
    ) {
      formRef.current.requestSubmit();
      setActionTrigger(null);

      // sendRequest().then(() => loadNextStep(), setActionTrigger(null));
    } else if (
      actionTrigger == storeActionTypes.REQUEST_ACTIONS.LOAD_PREV_STEP
    ) {
      setActionTrigger(null);
    }
  }, [actionTrigger]);

  return (
    <form onSubmit={sendRequest} ref={formRef}>
      <div className={style.stepsGeneral}>
        {loading ? (
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
                left: "30%",
                top: "30%",
              }}
            >
              <Loader loading={true} circleColor={"#30ACD0"} />
            </div>
          </div>
        ) : (
          ""
        )}
        <ul key={updateDataSource}>
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
                      {child.title ? (
                        <span className={style.checkBoxLabels}>
                          {child.title}
                        </span>
                      ) : null}
                    </Fragment>
                  ))}
                </div>
              ) : element.key === "CUSTOM_FIELD_COMMENT" ? (
                <div className={style.comments}>
                  {element.data
                    ? element.data.map((comment, index) => {
                        return (
                          <div key={index} className={style.singleComment}>
                            <h1>Commented By {comment?.AuthorName}</h1>
                            <span>{formatDate(comment.CreateTime)}</span>
                            <p>{comment?.Content}</p>
                          </div>
                        );
                      })
                    : ""}
                </div>
              ) : (
                <element.component
                  {...element.props}
                  value={element.props.value}
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
    </form>
  );
};
