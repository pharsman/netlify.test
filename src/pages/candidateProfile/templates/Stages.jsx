import { IconInfoCircle } from "@/assets/icons/other/IconInfoCircle";
import style from "../style/Stages.module.scss";
import {
  getCandidateStages,
  updateCandidateStageScores,
  skipCandidateCurrentStage,
} from "../api/CandidateProfileApi";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SliderRange from "masterComponents/SliderRange";
import { IconArrowDown } from "@/assets/icons/other/IconArrowDown";
import FormInput from "masterComponents/FormInput";
import Loader from "masterComponents/Loader";
import MainButton from "masterComponents/MainButton";
import Button from "@/components/Button";
import { moveCandidateToNextStage } from "../api/CandidateProfileApi";
import { createNotification } from "masterComponents/Notification";
import { STAGE_STATUS_TYPES, PROFILE_ACTIONS } from "../constants";
import { useCandidateProfileStore } from "../store/CandidateProfileStore";

export const Stages = () => {
  const { candidateID, vacancyID } = useParams();
  const [stages, setStages] = useState([]);
  const [stageTabs, setStageTabs] = useState([]);
  const [currentStageTab, setCurrentStageTab] = useState(null);
  const [currentStageTabData, setCurrentStageTabData] = useState([]);
  const [refreshSlider, setRefreshSlider] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasCurrentStage, setHasCurrentStage] = useState(false);
  const [skipAndMoveDisabled, setSkipAndMoveDisabled] = useState(false);
  const { setActionTrigger } = useCandidateProfileStore();
  const [reload, setReload] = useState(0);

  const getStages = async () => {
    try {
      setLoading(true);
      await getCandidateStages({
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
      }).then((response) => {
        if (!response || response.Error || response.data.Error) return;
        setStages(response.data);
        setStageTabs(
          response.data
            .sort((a, b) => a.Sort - b.Sort)
            .map((stage) => ({
              StageName: stage.StageName,
              VacancyStageID: stage.VacancyStageID,
              Sort: stage.Sort,
              StageDescription: stage.StageDescription,
              Type: stage.Type,
              CandidateVacancyStageID: stage.CandidateVacancyStageID,
            }))
        );

        const currentStage = response.data.find(
          (e) => e.Type === STAGE_STATUS_TYPES.CURRENT
        );
        const doneStage = response.data.find(
          (e) => e.Type === STAGE_STATUS_TYPES.DONE
        );

        if (response?.data?.length) {
          if (currentStage || doneStage) {
            setHasCurrentStage(true);
            setCurrentStageTab(
              response.data
                ?.filter((stage) => stage.Type === STAGE_STATUS_TYPES.DONE)
                .pop()?.VacancyStageID || currentStage?.VacancyStageID
            );
          } else {
            setHasCurrentStage(false);
            setCurrentStageTab(response.data[0].VacancyStageID);
          }
        }

        setReload((state) => (state += 1));
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const setScoringValueToScoringCriteria = (
    value,
    criteriaID,
    criteriaScoreIndicatorID
  ) => {
    setCurrentStageTabData((prevData) => {
      return prevData.map((criteria) => {
        if (criteria.CriteriaID === criteriaID) {
          return {
            ...criteria,
            ScoreIndicators: criteria.ScoreIndicators.map((indicator) => {
              if (
                indicator.CriteriaScoreIndicatorID === criteriaScoreIndicatorID
              ) {
                return {
                  ...indicator,
                  Score: value,
                };
              }
              return indicator;
            }),
          };
        }
        return criteria;
      });
    });
  };

  const expandCriteria = (e) => {
    e.target.closest(`.${style.criteriaItem}`).classList.toggle(style.expanded);
  };

  const setUpdateCandidateStageScores = async (recallStages = true) => {
    const candidateVacancyStageID = stageTabs.find(
      (e) => e.VacancyStageID === currentStageTab
    )?.CandidateVacancyStageID;

    const dataSet = {
      CandidateVacancyStageID: candidateVacancyStageID,
      CriteriaScoreIndicatorsJson: JSON.stringify(
        currentStageTabData.flatMap((criteria) =>
          criteria.ScoreIndicators.map((indicator) => ({
            CriteriaScoreIndicatorID: indicator.CriteriaScoreIndicatorID,
            Score: indicator.Score || 0,
          }))
        )
      ),
    };
    try {
      setLoading(true);
      const response = await updateCandidateStageScores(dataSet);
      if (!response || response.Error || response.data.Error) return;
      if (recallStages) getStages();
      setActionTrigger(PROFILE_ACTIONS.RECALL_BASIC_DATA);
      createNotification(
        "Stage scores updated successfully",
        "success",
        3500,
        "top-right",
        2
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const setSkipCandidateCurrentStage = async () => {
    try {
      setLoading(true);
      await skipCandidateCurrentStage({
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
      }).then((response) => {
        if (!response || response.Error || response.data.Error) return;
        getStages();
        createNotification(
          "Stage skipped successfully",
          "success",
          3500,
          "top-right",
          2
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const moveToNextStage = async (recallStages = false, sendScores = false) => {
    try {
      setLoading(true);
      if (sendScores) await setUpdateCandidateStageScores(false);

      await moveCandidateToNextStage({
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
      }).then(async (response) => {
        if (!response || response.Error || response.data.Error) return;
        if (recallStages) getStages();
        createNotification(
          "Stage moved successfully",
          "success",
          3500,
          "top-right",
          2
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const setButtonDisabled = () => {
    const currentStage = stages.find(
      (stage) => stage.VacancyStageID === currentStageTab
    );
    if (currentStage?.Type === STAGE_STATUS_TYPES.DONE) return true;

    return false;
  };

  const getCriteriaScore = (VacancyStageID, CriteriaID) => {
    const stage = stages.find(
      (stage) => stage.VacancyStageID === VacancyStageID
    );
    if (!stage) return 0;

    const criteria = stage.Criterias?.find(
      (criteria) => criteria.CriteriaID === CriteriaID
    );
    return criteria?.Score ? `${criteria.Score}%` : 0;
  };

  useEffect(() => {
    getStages();
  }, []);

  useEffect(() => {
    if (stageTabs.length > 0 && currentStageTab) {
      const currentStage = stages.find(
        (stage) => stage.VacancyStageID === currentStageTab
      );
      if (currentStage) {
        setCurrentStageTabData(
          currentStage?.Criterias?.map((e) => ({
            ...e,
            updateKey: crypto.randomUUID(),
          }))
        );
        setRefreshSlider((state) => (state += 1));
        setSkipAndMoveDisabled(setButtonDisabled());
      }

      const elements = document.querySelectorAll(`.expandableCriteriaItem`);
      if (elements) {
        elements.forEach((element) => {
          element.classList.remove(style.expanded);
        });
      }
    }
  }, [currentStageTab]);

  return (
    <div className={style.stagesTab}>
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#ffffff70",
            width: "100%",
            height: "100%",
            zIndex: 1000,
          }}
        >
          <Loader loading={true} />
        </div>
      )}
      {!hasCurrentStage && (
        <div className={style.noStage}>
          <IconInfoCircle color={"#555F62"} />
          <p>
            Click "Start" to assign new candidate to the first stage and begin
            the process.
          </p>
          <Button
            label="Start"
            size="small"
            onClick={() => moveToNextStage(true)}
          />
        </div>
      )}
      <div
        className={`${style.stagesContent} ${
          !hasCurrentStage ? style.disabled : ""
        }`}
      >
        <div className={style.stageTabs}>
          {stageTabs?.map((stage, index) => {
            return (
              <div
                key={index}
                className={`${style.stageTab} ${
                  currentStageTab === stage?.VacancyStageID ? style.active : ""
                }`}
                onClick={() => setCurrentStageTab(stage?.VacancyStageID)}
              >
                <div className={style.left}>
                  <div
                    className={`${style.circleMark} ${
                      stage?.Type === STAGE_STATUS_TYPES.DONE
                        ? style.done
                        : stage?.Type === STAGE_STATUS_TYPES.CURRENT
                        ? style.current
                        : ""
                    }`}
                  ></div>

                  <div className={style.stageName}>
                    <h2>{stage?.StageName}</h2>
                    {/* <p>{stage?.StageDescription || "No desc"}</p> */}
                    <span>{stage?.Type}</span>
                  </div>
                </div>

                <div className={style.stageOrder}>{stage?.Sort}</div>
              </div>
            );
          })}
          {/* {totalScore && (
            <div className={style.totalScore}>
              <span>{totalScore + `${totalScore ? " %" : ""}`}</span>
            </div>
          )} */}
        </div>
        {currentStageTabData?.length > 0 && (
          <div className={style.stageCriterias}>
            {currentStageTabData?.map((criteria, index) => {
              return (
                <div
                  key={index}
                  className={`${style.criteriaItem} expandableCriteriaItem`}
                >
                  <div className={style.criteriaHeader}>
                    <h3>{criteria?.CriteriaName}</h3>
                    <div className={style.criteriaHeaderRight}>
                      <span key={criteria?.Score}>
                        {getCriteriaScore(
                          currentStageTab,
                          criteria?.CriteriaID
                        )}
                      </span>
                      <div
                        className={style.expandIcon}
                        onClick={(e) => expandCriteria(e)}
                      >
                        <IconArrowDown
                          color={"#141719"}
                          width={"1.125rem"}
                          height={"1.125rem"}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={style.criteriaScoring}>
                    {criteria?.ScoreIndicators.map((scoring, index) => {
                      return (
                        <div key={index} className={style.scoringItem}>
                          <div className={style.scoringHeader}>
                            <h3>{scoring?.Description}</h3>
                            <div className={style.scoreInput}>
                              <FormInput
                                inputType="number"
                                label={"Score"}
                                size="small"
                                hideArrows={true}
                                value={scoring?.Score || 0}
                                onChange={(value) => {
                                  if (value > scoring?.MaxScore) {
                                    value = scoring?.MaxScore;
                                  }
                                  if (value < scoring?.MinScore) {
                                    value = scoring?.MinScore;
                                  }
                                  value = value.toString().replace(/^0+/, "");
                                  if (value === "") value = "0";

                                  setScoringValueToScoringCriteria(
                                    value,
                                    criteria.CriteriaID,
                                    scoring.CriteriaScoreIndicatorID
                                  );
                                  setRefreshSlider((state) => (state += 1));
                                }}
                              />
                            </div>
                          </div>
                          <div className={style.scoringBody}>
                            <SliderRange
                              key={refreshSlider}
                              min={scoring?.MinScore || 0}
                              max={scoring?.MaxScore || 10}
                              value={scoring?.Score || 0}
                              dotColor={"#f9f9f9"}
                              withResult={false}
                              railStyle={{
                                background: "#E3E3E8",
                                height: "0.5rem",
                              }}
                              trackStyle={{
                                background: "#30ACD0",
                                height: "0.5rem",
                              }}
                              onChange={(value) =>
                                setScoringValueToScoringCriteria(
                                  value,
                                  scoring.CriteriaID,
                                  scoring.CriteriaScoreIndicatorID
                                )
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className={style.stageActions}>
              <MainButton
                label="Save"
                size="small"
                type={"border"}
                customStyle={{
                  color: "#30ACD0",
                  border: " 0.0625rem solid #30ACD0",
                }}
                onClick={() => {
                  setUpdateCandidateStageScores();
                }}
              />
              <div>
                <MainButton
                  label="Skip"
                  size="small"
                  type={"text"}
                  disabled={skipAndMoveDisabled}
                  customStyle={{
                    color: "#30ACD0",
                  }}
                  onClick={() => {
                    setSkipCandidateCurrentStage();
                  }}
                />
                <MainButton
                  label="Done Stage"
                  size="small"
                  disabled={skipAndMoveDisabled}
                  type={"background"}
                  customStyle={{
                    color: "#fff",
                    background: "#30ACD0",
                  }}
                  onClick={() => {
                    moveToNextStage(true, true);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
