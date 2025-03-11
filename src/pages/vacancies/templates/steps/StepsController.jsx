import { useEffect, useState } from "react";
import { useVacanciesStore } from "../../store/VacanciesStore";
import { General } from "./General";
import { Stages } from "./Stages";
import { getStepsComplitionStatus } from "../../api/VacanciesApi";
import { Placement } from "./Placement";
import { JD } from "./JD";
import { ApplyForm } from "./ApplyForm";
import { Preview } from "./Preview";

export const StepsController = ({ vacancyID }) => {
  const { vacancyFormSteps, updateMultipleVacancySteps } = useVacanciesStore(
    (state) => state
  );
  useEffect(() => {
    try {
      getStepsComplitionStatus({
        VacancyID: vacancyID,
      }).then((response) => {
        if (response.data) {
          console.log(response.data);
          updateMultipleVacancySteps([
            {
              id: 1,
              values: {
                isAllFilled: response.data?.HasGeneral,
              },
            },
            {
              id: 2,
              values: {
                isAllFilled: response.data?.HasStages,
              },
            },
            {
              id: 3,
              values: {
                isAllFilled: response.data?.HasDescription,
              },
            },
            {
              id: 4,
              values: {
                isAllFilled: response.data?.HasPlacement,
              },
            },
            {
              id: 5,
              values: {
                isAllFilled: response.data?.HasApplyForm,
              },
            },
            {
              id: 6,
              values: {
                isAllFilled:
                  response.data?.HasApplyForm && response.data?.HasDescription,
              },
            },
          ]);
        }
      });
    } catch (err) {
      console.error("Error fetching steps completion status:", err);
    } finally {
      console.log("step complition statuses done !");
    }
  }, [vacancyID]);

  const setTemplateRender = () => {
    switch (vacancyFormSteps.currentStep) {
      case 1: {
        return <General vacancyID={vacancyID} />;
      }
      case 2: {
        return <Stages vacancyID={vacancyID} />;
      }
      case 3: {
        return <JD vacancyID={vacancyID} />;
      }
      case 4: {
        return <Placement vacancyID={vacancyID} />;
      }
      case 5: {
        return <ApplyForm vacancyID={vacancyID} />;
      }
      case 6: {
        return <Preview vacancyID={vacancyID} />;
      }
    }
  };

  return setTemplateRender();
};
