import Popup from "masterComponents/Popup";
import style from "@/pages/candidates/style/AddCandidateModal.module.scss";
import ProgressIndicator from "masterComponents/ProgressIndicator";
import { useEffect, useState, useTransition } from "react";
import MainButton from "masterComponents/MainButton";
import IconForm from "@/assets/icons/other/form.svg";
import IconResume from "@/assets/icons/other/resume.svg";

import { PersonalInformation } from "../templates/steps/PersonalInformation";
import { Experience } from "../templates/steps/Experience";
import { Skills } from "../templates/steps/Skills";
import { Education } from "../templates/steps/Education";
import { Recommender } from "../templates/steps/Recommender";
import { getCandidateAssembleStepsCheck } from "../api/CandidatesApi";
import { useCandidatesStore } from "../store/CandidatesStore";
import { CandidateActionTypes } from "../constants";
import useUpdateEffect from "@/hooks/useUpdateEffect";
export const AddCandidateModal = ({ isOpen, onClose }) => {
  const {
    updateCandidateID,
    setUpdateCandidateID,
    setCandidateIdInProgress,
    actionTrigger,
  } = useCandidatesStore();
  const setActionTrigger = useCandidatesStore(
    (state) => state.setActionTrigger
  );
  const [showSteps, setShowSteps] = useState(false);
  const [steps, setSteps] = useState([
    {
      id: 1,
      name: "Personal Information",
      subTitle: "Mandatory",
      isAllFilled: true,
    },
    { id: 2, name: "Experience", subTitle: "Optional", isAllFilled: false },
    {
      id: 3,
      name: "Skills & Competencies",
      subTitle: "Optional",
      isAllFilled: false,
    },
    {
      id: 4,
      name: "Educational Background",
      subTitle: "Optional",
      isAllFilled: false,
    },
    {
      id: 5,
      name: "Professional Recommender",
      subTitle: "Optional",
      isAllFilled: false,
    },
  ]);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentStepTemplate, setCurrentStepTemplate] = useState(null);

  const loadNextStep = () => {
    try {
      if (currentStep < steps.length && steps[currentStep]) {
        setCurrentStep((prev) => prev + 1);
      } else if (currentStep >= steps.length) {
        console.warn("Already at last step");
      } else {
        console.error("Next step not found");
      }
    } catch (error) {
      console.error("Error loading next step:", error);
    }
  };

  const loadPrevStep = () => {
    try {
      if (currentStep > 1) {
        setCurrentStep((prev) => prev - 1);
      } else if (currentStep <= 1) {
        console.warn("Already at first step");
      } else {
        console.error("Previous step not found");
      }
    } catch (error) {
      console.error("Error loading previous step:", error);
    }
  };

  const checkSteps = async () => {
    if (!updateCandidateID?.CandidateID) return;
    try {
      await getCandidateAssembleStepsCheck({
        CandidateID: updateCandidateID?.CandidateID,
        VacancyID: updateCandidateID?.VacancyID,
      }).then((response) => {
        if (!response || response.Error || response.data.Error) return;
        const data = response.data;
        setSteps((prev) => {
          const newSteps = [...prev];
          newSteps[0].isAllFilled = data.HasPersonalInfo;
          newSteps[1].isAllFilled = data.HasExperience;
          newSteps[2].isAllFilled = data.HasSkillsAndCompetencies;
          newSteps[3].isAllFilled = data.HasEducation;
          newSteps[4].isAllFilled = data.HasRecommender;
          return newSteps;
        });
      });
    } catch (error) {
      console.error("Error checking steps:", error);
    }
  };

  useEffect(() => {
    checkSteps();
    switch (currentStep) {
      case 1: {
        setCurrentStepTemplate(
          <PersonalInformation
            onLoadNextStep={loadNextStep}
            onLoadPrevStep={loadPrevStep}
          />
        );
        break;
      }
      case 2: {
        setCurrentStepTemplate(
          <Experience
            onLoadNextStep={loadNextStep}
            onLoadPrevStep={loadPrevStep}
          />
        );
        break;
      }
      case 3: {
        setCurrentStepTemplate(
          <Skills onLoadNextStep={loadNextStep} onLoadPrevStep={loadPrevStep} />
        );
        break;
      }
      case 4: {
        setCurrentStepTemplate(
          <Education
            onLoadNextStep={loadNextStep}
            onLoadPrevStep={loadPrevStep}
          />
        );
        break;
      }
      case 5: {
        setCurrentStepTemplate(
          <Recommender
            onLoadNextStep={loadNextStep}
            onLoadPrevStep={loadPrevStep}
          />
        );
        break;
      }
    }
  }, [currentStep]);

  useUpdateEffect(() => {
    if (
      actionTrigger === CandidateActionTypes.REQUEST_TYPES.CLOSE_CANDIDATE_MODAL
    ) {
      setUpdateCandidateID(null);
      setCandidateIdInProgress(null);
      setActionTrigger(null);
      onClose(false);
    }
  }, [actionTrigger]);

  useUpdateEffect(() => {
    if (updateCandidateID) {
      setShowSteps(true);
      setCurrentStep(1);
      checkSteps();
    }
  }, [updateCandidateID]);

  return (
    <Popup
      visible={isOpen}
      width={showSteps ? "1050px" : ""}
      size={"small"}
      options={{
        title: "Add Candidate",
        description: showSteps
          ? null
          : "With the 'Complete a form' option, you can manually add a candidate. By uploading a resume, the AI will read and process the document",
        mode: "drawer",
      }}
    >
      <div className={style.wrapper}>
        {showSteps ? (
          <>
            <div className={style.steps}>
              <ProgressIndicator
                stepsData={steps}
                currentStep={currentStep}
                vertical={true}
                withIcons={true}
                independentStep={true}
                onStepClick={(step) => {
                  setCurrentStep(step.id);
                }}
              />
            </div>
            <div className={style.formContent}>
              <div className={style.formWrapper} key={currentStep}>
                {currentStepTemplate}
              </div>
              <div className={style.actions}>
                <div className={style.divider}>
                  <MainButton
                    label={"Close"}
                    size={"small"}
                    customStyle={{
                      marginRight: "16px",
                      backgroundColor: "transparent",
                      border: "1px solid var(--color-stroke-strong-initial)",
                      color: "var(--color-text-strong-default)",
                    }}
                    onClick={() => {
                      setActionTrigger(
                        CandidateActionTypes.REQUEST_TYPES
                          .RELOAD_CANDIDATES_DATA
                      );
                      setCandidateIdInProgress(null);
                      setUpdateCandidateID(null);
                      onClose(false);
                    }}
                  />
                  {currentStep !== 5 && (
                    <MainButton
                      label={"Save & Close"}
                      size={"small"}
                      customStyle={{
                        border: "1px solid #30ACD0",
                        color: "#30ACD0",
                        background: "transparent",
                      }}
                      onClick={() => {
                        setActionTrigger(
                          CandidateActionTypes.REQUEST_ACTIONS
                            .SAVE_REQUEST_AND_CLOSE
                        );
                      }}
                    />
                  )}
                </div>
                <div className={style.divider}>
                  {currentStep !== 1 && (
                    <MainButton
                      label={"Back"}
                      size={"small"}
                      type={"text"}
                      customStyle={{ color: "#141719" }}
                      onClick={() => {
                        setActionTrigger(
                          CandidateActionTypes.REQUEST_ACTIONS.LOAD_PREV_STEP
                        );
                      }}
                    />
                  )}
                  <MainButton
                    label={currentStep == 5 ? "Save & Close" : "Next"}
                    customStyle={{ background: "#30ACD0" }}
                    size={"small"}
                    onClick={() => {
                      setActionTrigger(
                        CandidateActionTypes.REQUEST_ACTIONS.LOAD_NEXT_STEP
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={style.chooseAddCandidateType}>
            <ul>
              <li onClick={() => setShowSteps(true)}>
                <div className={style.optionIcon}>
                  <img src={IconForm} />
                </div>
                <div className={style.optionInfo}>
                  <h2>Complete a Form</h2>
                  <p>
                    Description text about two ways how you can add candidate
                  </p>
                </div>
              </li>
              <li style={{ opacity: ".3", userSelect: "none" }}>
                <div className={style.optionIcon}>
                  <img src={IconResume} />
                </div>
                <div className={style.optionInfo}>
                  <h2>Upload a Resume</h2>
                  <p>
                    Description text about two ways how you can add candidate
                  </p>
                </div>
              </li>
            </ul>
            <div className={style.closeWrapper}>
              <MainButton
                label={"Close"}
                size={"small"}
                customStyle={{
                  marginRight: "16px",
                  backgroundColor: "transparent",
                  border: "1px solid var(--color-stroke-strong-initial)",
                  color: "var(--color-text-strong-default)",
                }}
                onClick={() => onClose(false)}
              />
            </div>
          </div>
        )}
      </div>
    </Popup>
  );
};
