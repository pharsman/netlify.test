import style from "@/pages/candidates/style/Experience.module.scss";
import { useEffect, useRef, useState } from "react";
import Loader from "masterComponents/Loader";
import MainButton from "masterComponents/MainButton";
import FormDropdown from "masterComponents/FormDropdown";
import FormInput from "masterComponents/FormInput";
import {
  getCandidateExperience,
  getIndustries,
  setCandidateExperience,
} from "../../api/CandidatesApi";
import Datepicker from "masterComponents/Datepicker";
import { __findNodeByKey } from "@/utils/helpers";
import IconMinus from "@/assets/icons/other/IconMinusRed";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useCandidatesStore } from "../../store/CandidatesStore";
import { CandidateActionTypes } from "../../constants";

export const Experience = ({ onLoadNextStep, onLoadPrevStep }) => {
  const [loading, setLoading] = useState(false);
  const industriesList = useRef([]);
  const [data, setData] = useState([]);
  const {
    actionTrigger,
    setActionTrigger,
    updateCandidateID,
    candidateIdInProgress,
  } = useCandidatesStore((state) => state);
  const initialData = [
    {
      key: crypto.randomUUID(),
      children: [
        {
          component: FormInput,
          key: "JOB",
          props: {
            label: "Job",
            size: "small",
            inputType: "text",
            value: "",
          },
        },
        {
          component: FormInput,
          key: "COMPANY",
          props: {
            label: "Company",
            size: "small",
            inputType: "text",
            value: "",
          },
        },
        {
          component: Datepicker,
          key: "YEARS_OF_EXPERIENCE",
          props: {
            placeholder: "Years of Experience",
            size: "large",
            value: "",
            mode: "range",
            valueFormat: "YYYY-MM-DD",
          },
        },
        {
          component: FormDropdown,
          key: "INDUSTRY",
          props: {
            label: "Industry",
            data: [],
            size: "small",
            withClear: true,
            withFilter: true,
            value: "",
          },
        },
      ],
    },
  ];
  const getElement = (arr, key) => {
    return __findNodeByKey(arr, "key", key);
  };

  const getIndustriesData = async () => {
    await getIndustries().then((response) => {
      const industries = response?.data?.data ?? null;

      if (!industries) return;
      industriesList.current = industries;
      setData((prev) => {
        const newData = [...prev];
        newData.forEach((parent) => {
          const element = getElement(parent.children, "INDUSTRY");
          element.props.data = JSON.parse(
            JSON.stringify(
              industries.map((i) => ({
                label: i.Name,
                id: i.ID,
              }))
            )
          );
        });
        return newData;
      });
    });
  };

  const initialCalls = async () => {
    setLoading(true);
    // setData(initialData);

    try {
      await Promise.all([getIndustriesData()]);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleValuesUpdate = async (key, childKey, value) => {
    setData((prev) => {
      const newData = [...prev];
      const parent = getElement(newData, key);
      const element = getElement(parent.children, childKey);
      if (element) {
        element.props.value = value;
      }
      return newData;
    });
  };

  const addContainer = () => {
    setData((prev) => {
      const newData = [...prev];
      const mapData = initialData.map((e) => ({
        ...e,
        key: crypto.randomUUID(),
      }));
      getElement(mapData[0].children, "INDUSTRY").props.data = JSON.parse(
        JSON.stringify(
          industriesList.current.map((e) => ({
            label: e.Name,
            id: e.ID,
          }))
        )
      );
      return [...newData, ...mapData];
    });
  };

  const deleteContainer = (index) => {
    setData((prev) => {
      const newData = [...prev];
      newData.splice(index, 1);
      return newData;
    });
  };

  const sendRequest = async (skipNextAndClose = false) => {
    const dataSet = {
      CandidateID:
        updateCandidateID?.CandidateID ||
        candidateIdInProgress?.CandidateID ||
        null,
      VacancyID:
        updateCandidateID?.VacancyID ||
        candidateIdInProgress?.VacancyID ||
        null,
      ExperiencesJson: JSON.stringify(
        data.map((container) => ({
          ID: null,
          JobName: getElement(container.children, "JOB").props.value,
          CompanyName: getElement(container.children, "COMPANY").props.value,
          IndustryID: getElement(container.children, "INDUSTRY").props.value,
          StartDate: (() => {
            const value = getElement(container.children, "YEARS_OF_EXPERIENCE")
              .props.value;
            if (!value) return value;

            const date = Array.isArray(value) ? value[0] : value.from;
            if (!date) return date;

            return date.includes("-")
              ? date
              : new Date(date).toISOString().split("T")[0];
          })(),
          EndDate: (() => {
            const value = getElement(container.children, "YEARS_OF_EXPERIENCE")
              .props.value;
            if (!value) return value;

            const date = Array.isArray(value) ? value[1] : value.to;
            if (!date) return date;

            return date.includes("-")
              ? date
              : new Date(date).toISOString().split("T")[0];
          })(),
        }))
      ),
    };

    try {
      setLoading(true);
      await setCandidateExperience(dataSet).then((response) => {
        if (!response || response.Error || response.data.Error) return;
        if (skipNextAndClose) {
          setActionTrigger(
            CandidateActionTypes.REQUEST_TYPES.CLOSE_CANDIDATE_MODAL
          );

          setTimeout(() => {
            setActionTrigger(
              CandidateActionTypes.REQUEST_TYPES.RELOAD_CANDIDATES_DATA
            );
          }, 100);
        } else onLoadNextStep();
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setActionTrigger(null);
    }
  };

  const getExperienceData = async () => {
    if (!updateCandidateID?.CandidateID && !candidateIdInProgress?.CandidateID)
      return;

    try {
      setLoading(true);
      await getCandidateExperience({
        CandidateID:
          updateCandidateID?.CandidateID || candidateIdInProgress?.CandidateID,
        VacancyID:
          updateCandidateID?.VacancyID || candidateIdInProgress?.VacancyID,
      }).then((response) => {
        if (!response || response.Error || response.data.Error) return;
        const dataExperience = response.data;
        const dataMap = dataExperience.map((e) => ({
          key: crypto.randomUUID(),
          children: initialData[0].children.map((c) => {
            const updatedProps = {
              ...c.props,
              value:
                c.key === "YEARS_OF_EXPERIENCE"
                  ? e.StartDate && e.EndDate
                    ? [e.StartDate, e.EndDate]
                    : ""
                  : c.key === "JOB"
                  ? e.JobName
                  : c.key === "COMPANY"
                  ? e.CompanyName
                  : c.key === "INDUSTRY"
                  ? e.IndustryID
                  : "",
            };

            if (c.key === "INDUSTRY") {
              updatedProps.data = industriesList.current.map((i) => ({
                label: i.Name,
                id: i.ID,
              }));
            }

            return {
              ...c,
              props: updatedProps,
            };
          }),
        }));
        setData(dataMap);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useUpdateEffect(() => {
    if (
      actionTrigger &&
      (actionTrigger == CandidateActionTypes.REQUEST_ACTIONS.LOAD_NEXT_STEP ||
        actionTrigger ==
          CandidateActionTypes.REQUEST_ACTIONS.SAVE_REQUEST_AND_CLOSE)
    ) {
      sendRequest(
        actionTrigger ==
          CandidateActionTypes.REQUEST_ACTIONS.SAVE_REQUEST_AND_CLOSE
      );
    }
    if (
      actionTrigger &&
      actionTrigger == CandidateActionTypes.REQUEST_ACTIONS.LOAD_PREV_STEP
    ) {
      onLoadPrevStep();
      setActionTrigger(null);
    }
  }, [actionTrigger]);

  useEffect(() => {
    initialCalls().then(() => {
      getExperienceData();
    });
  }, []);

  return (
    <div className={style.experienceForm}>
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
      <div className={style.containersWrapper}>
        {data.map((container, index) => {
          return (
            <ul key={index} className={style.experienceContainer}>
              <div
                className={style.delete}
                onClick={() => deleteContainer(index)}
              >
                <IconMinus />
              </div>
              {container.children
                ? container.children.map((item, itemIndex) => {
                    return (
                      <li key={itemIndex}>
                        <item.component
                          {...item.props}
                          value={item.props.value}
                          defaultValue={item.props.value}
                          selectedOptionID={item.props.value}
                          selected={(obj) =>
                            handleValuesUpdate(container.key, item.key, obj.id)
                          }
                          onChange={(value) =>
                            handleValuesUpdate(container.key, item.key, value)
                          }
                        />
                      </li>
                    );
                  })
                : ""}
            </ul>
          );
        })}
        <MainButton
          onClick={addContainer}
          label={"Add New Experience +"}
          size={"xs"}
          customStyle={{
            flexShrink: 0,
            background: "#4D4D4E",
            color: "#fff",
          }}
        />
      </div>
    </div>
  );
};
