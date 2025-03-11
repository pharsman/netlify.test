import style from "@/pages/candidates/style/Recommender.module.scss";
import FormInput from "masterComponents/FormInput";
import { useEffect, useState } from "react";
import IconMinus from "@/assets/icons/other/IconMinusRed";
import MainButton from "masterComponents/MainButton";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useCandidatesStore } from "../../store/CandidatesStore";
import { CandidateActionTypes } from "../../constants";
import {
  setCandidateRecommenders,
  getCandidateRecommenders,
} from "../../api/CandidatesApi";
import Loader from "masterComponents/Loader";

export const Recommender = ({ onLoadNextStep, onLoadPrevStep }) => {
  const [loading, setLoading] = useState(false);
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
          key: "RECOMMENDER_NAME",
          props: {
            label: "Professional Recommender’s Name Surname",
            size: "small",
            inputType: "text",
            value: "",
          },
        },
        {
          component: FormInput,
          key: "LINKEDIN_PROFILE",
          props: {
            label: "LinkedIn Profile",
            size: "small",
            inputType: "text",
            value: "",
          },
        },
        {
          component: FormInput,
          key: "RECOMMENDER_JOB",
          props: {
            label: "Recommender’s Job",
            size: "small",
            inputType: "text",
            value: "",
          },
        },
        {
          component: FormInput,
          key: "CURRENT_COMPANY",
          props: {
            label: "Current company",
            size: "small",
            inputType: "text",
            value: "",
          },
        },
      ],
    },
  ];
  const [data, setData] = useState([]);

  const initialCalls = () => {
    getRecommenderData();
    // setData(initialData);
  };

  const getElement = (arr, key) => {
    return arr.find((e) => e.key === key);
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

  const deleteContainer = (index) => {
    setData((prev) => {
      const newData = [...prev];
      newData.splice(index, 1);
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
      return [...newData, ...mapData];
    });
  };

  const sendRequest = async () => {
    const dataSet = {
      CandidateID:
        updateCandidateID?.CandidateID ||
        candidateIdInProgress?.CandidateID ||
        null,
      VacancyID:
        updateCandidateID?.VacancyID ||
        candidateIdInProgress?.VacancyID ||
        null,
      RecommendersJson: JSON.stringify(
        data.map((recommender) => {
          const fullNameElement = getElement(
            recommender.children,
            "RECOMMENDER_NAME"
          );
          const linkedinElement = getElement(
            recommender.children,
            "LINKEDIN_PROFILE"
          );
          const jobElement = getElement(
            recommender.children,
            "RECOMMENDER_JOB"
          );
          const companyElement = getElement(
            recommender.children,
            "CURRENT_COMPANY"
          );

          return {
            ID: null,
            FullName: fullNameElement?.props?.value || "",
            LinkedinUrl: linkedinElement?.props?.value || "",
            Job: jobElement?.props?.value || null,
            CurrentCompany: companyElement?.props?.value || null,
          };
        })
      ),
    };

    try {
      setLoading(true);
      const recommendersData = JSON.parse(dataSet.RecommendersJson);
      if (
        recommendersData.length === 0 ||
        recommendersData.every(
          (rec) =>
            !rec.FullName && !rec.LinkedinUrl && !rec.Job && !rec.CurrentCompany
        )
      ) {
        dataSet.RecommendersJson = JSON.stringify([]);
      }

      await setCandidateRecommenders(dataSet).then((response) => {
        if (!response || response.data.Error || response.Error) return;
        setActionTrigger(
          CandidateActionTypes.REQUEST_TYPES.CLOSE_CANDIDATE_MODAL
        );

        setTimeout(() => {
          setActionTrigger(
            CandidateActionTypes.REQUEST_TYPES.RELOAD_CANDIDATES_DATA
          );
        }, 100);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setActionTrigger(null);
    }
  };

  const getRecommenderData = async () => {
    if (!updateCandidateID?.CandidateID && !candidateIdInProgress?.CandidateID)
      return;

    try {
      setLoading(true);
      await getCandidateRecommenders({
        CandidateID:
          updateCandidateID?.CandidateID || candidateIdInProgress?.CandidateID,
        VacancyID:
          updateCandidateID?.VacancyID || candidateIdInProgress?.VacancyID,
      }).then((response) => {
        if (!response || response.data.Error || response.Error) return;
        console.log(response.data);

        const mappedData = response.data.map((recommender) => ({
          ...initialData[0],
          key: crypto.randomUUID(),
          children: initialData[0].children.map((child) => ({
            ...child,
            props: {
              ...child.props,
              value:
                recommender[
                  {
                    RECOMMENDER_NAME: "FullName",
                    LINKEDIN_PROFILE: "LinkedinUrl",
                    RECOMMENDER_JOB: "Job",
                    CURRENT_COMPANY: "CurrentCompany",
                  }[child.key]
                ] || "",
            },
          })),
        }));

        setData(mappedData);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useUpdateEffect(() => {
    if (
      (actionTrigger &&
        actionTrigger == CandidateActionTypes.REQUEST_ACTIONS.LOAD_NEXT_STEP) ||
      actionTrigger ==
        CandidateActionTypes.REQUEST_ACTIONS.SAVE_REQUEST_AND_CLOSE
    ) {
      sendRequest();
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
    initialCalls();
  }, []);

  return (
    <div className={style.recommenderForm}>
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
          label={"Add new Recommender +"}
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
