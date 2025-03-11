import style from "@/pages/candidates/style/Skills.module.scss";
import { useState, useEffect, useRef } from "react";
import FormDropdown from "masterComponents/FormDropdown";
import FormMultiSelectDropdown from "masterComponents/FormMultiSelectDropdown";
import { CategoryCreateDropdown } from "@/pages/candidates/components/CategoryCreateDropdown";
import {
  getCandidateSkills,
  getLanguages,
  getSeniorities,
  getSkills,
  setCandidateSkills,
  getCompetency,
  setCompetencyCreate,
  setCompetencyDelete,
  setSkillCreate,
  setSkillDelete,
} from "../../api/CandidatesApi";
import Loader from "masterComponents/Loader";
import Tag from "masterComponents/Tag";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useCandidatesStore } from "../../store/CandidatesStore";
import { CandidateActionTypes } from "../../constants";
export const Skills = ({ onLoadNextStep, onLoadPrevStep }) => {
  const [loading, setLoading] = useState(false);
  const { actionTrigger, setActionTrigger, candidateIdInProgress } =
    useCandidatesStore((state) => state);
  const { updateCandidateID } = useCandidatesStore((state) => state);
  const preSelectedSkills = useRef([]);
  const preSelectedCompetencies = useRef([]);

  const initialData = [
    {
      component: FormDropdown,
      key: "SENIORITY",
      props: {
        label: "Seniority",
        size: "small",
        withClear: true,
        data: [],
        value: "",
      },
    },
    {
      component: FormMultiSelectDropdown,
      key: "LANGUAGE",
      props: {
        label: "Languages Spoken",
        size: "small",
        data: [],
        withApply: false,
        value: "",
      },
    },
    {
      component: CategoryCreateDropdown,
      key: "SKILLS",
      props: {
        label: "Skills",
        items: [],
        value: "",
      },
    },
    {
      component: CategoryCreateDropdown,
      key: "COMPETENCIES",
      props: {
        label: "Competencies",
        items: [],
        value: "",
      },
    },
  ];
  const [data, setData] = useState();
  const getElement = (arr, key) => {
    return arr.find((el) => el.key === key);
  };

  const handleValuesUpdate = async (key, value) => {
    if (key === "SKILLS" || key === "COMPETENCIES") {
      const newItems = value.filter((item) => item.isNew);

      if (newItems.length > 0) {
        for (const item of newItems) {
          try {
            if (key === "SKILLS") {
              await setSkillCreate({ Name: item.label });
            } else {
              await setCompetencyCreate({ Name: item.label });
            }
          } catch (error) {
            console.log(error);
          }
        }

        if (key === "SKILLS") {
          await getSkillsData();
        } else {
          await getCompetenciesData();
        }
        return;
      }

      const selectedItems = value
        .filter((item) => item.selected)
        .map((item) => item.id);
      if (key === "SKILLS") {
        preSelectedSkills.current = selectedItems;
      } else {
        preSelectedCompetencies.current = selectedItems;
      }
    }

    setData((prev) => {
      const newData = [...prev];

      const element = newData.find((el) => el.key === key);
      if (element) {
        if (element.component === CategoryCreateDropdown) {
          element.props.items = value;
        } else {
          element.props.value = value;
        }
      }

      return newData;
    });
  };

  const getSenioritiesData = async () => {
    try {
      await getSeniorities().then((response) => {
        const data = response?.data?.data;
        if (!data) return;
        setData((prev) => {
          const newData = [...prev];
          const seniorityElement = getElement(newData, "SENIORITY");
          seniorityElement.props.data = data.map((e) => ({
            label: e.Name,
            id: e.ID,
          }));
          return newData;
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getLanguagesData = async () => {
    try {
      await getLanguages({
        PageSize: 5000,
      }).then((response) => {
        const data = response?.data?.Languages;
        if (!data) return;
        setData((prev) => {
          const newData = [...prev];
          const languagesElement = getElement(newData, "LANGUAGE");
          languagesElement.props.data = data.map((e) => ({
            label: e.Name,
            id: e.ID,
            code: e.Code,
          }));
          return newData;
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getCompetenciesData = async () => {
    try {
      await getCompetency().then((response) => {
        const data = response?.data;
        if (!data) return;
        setData((prev) => {
          const newData = [...prev];
          const competenciesElement = getElement(newData, "COMPETENCIES");
          competenciesElement.props.items = data.map((e) => ({
            label: e.Name,
            id: e.ID,
            delatable: e.Deletable,
            selected: preSelectedCompetencies.current.includes(e.ID),
            isNew: false,
          }));
          return newData;
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getSkillsData = async () => {
    try {
      await getSkills().then((response) => {
        const data = response?.data;
        if (!data) return;
        setData((prev) => {
          const newData = [...prev];
          const skillsElement = getElement(newData, "SKILLS");
          skillsElement.props.items = data.map((e) => ({
            label: e.Name,
            id: e.ID,
            delatable: e.Deletable,
            selected: preSelectedSkills.current.includes(e.ID),
            isNew: false,
          }));
          return newData;
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const initialCalls = async () => {
    setLoading(true);
    setData(initialData);
    try {
      await Promise.all([
        getSenioritiesData(),
        getCompetenciesData(),
        getSkillsData(),
        getLanguagesData(),
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (skipNextAndClose = false) => {
    if (!data) return;

    const seniorityElement = getElement(data, "SENIORITY");
    const languagesElement = getElement(data, "LANGUAGE");
    const skillsElement = getElement(data, "SKILLS");
    const competenciesElement = getElement(data, "COMPETENCIES");

    const dataSet = {
      CandidateID:
        updateCandidateID?.CandidateID ||
        candidateIdInProgress?.CandidateID ||
        null,
      VacancyID:
        updateCandidateID?.VacancyID ||
        candidateIdInProgress?.VacancyID ||
        null,
      SeniorityID: seniorityElement.props.value,
      LanguagesJson: JSON.stringify(
        languagesElement.props.data
          ?.filter((item) => item.selected)
          .map((item) => item.code) || []
      ),
      SkillsJson: JSON.stringify(
        skillsElement.props.items
          ?.filter((item) => item.selected)
          .map((item) => item.id) || []
      ),
      CompetenciesJson: JSON.stringify(
        competenciesElement.props.items
          ?.filter((item) => item.selected)
          .map((item) => item.id) || []
      ),
    };

    try {
      setLoading(true);
      await setCandidateSkills(dataSet).then((response) => {
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
      setActionTrigger(null);
      setLoading(false);
    }
  };

  const getCandidateSkillsData = async () => {
    // if (!updateCandidateID?.CandidateID || !candidateIdInProgress?.CandidateID)
    // return;
    try {
      setLoading(true);
      await getCandidateSkills({
        CandidateID:
          updateCandidateID?.CandidateID || candidateIdInProgress?.CandidateID,
        VacancyID:
          updateCandidateID?.VacancyID || candidateIdInProgress?.VacancyID,
      }).then((response) => {
        const data = response?.data;
        setData((prev) => {
          const newData = [...prev];

          const seniorityElement = getElement(newData, "SENIORITY");
          const languagesElement = getElement(newData, "LANGUAGE");
          const skillsElement = getElement(newData, "SKILLS");
          const competenciesElement = getElement(newData, "COMPETENCIES");

          if (data?.Seniority) {
            seniorityElement.props.value = data.Seniority.ID;
          }

          if (data?.Languages) {
            languagesElement.props.data = languagesElement.props.data.map(
              (item) => {
                const found = data.Languages.find(
                  (lang) => lang.Code === item.code
                );
                return {
                  ...item,
                  selected: !!found,
                };
              }
            );
          }
          if (data?.Skills) {
            const selectedSkillIds = [];
            data?.Skills.forEach((skill) => {
              const found = skillsElement.props.items.find(
                (item) => item.id == Number(skill.ID)
              );
              if (found) {
                found.selected = true;
                selectedSkillIds.push(found.id);
              }
            });
            preSelectedSkills.current = selectedSkillIds;
          }
          if (data?.Competencies) {
            const selectedCompetencyIds = [];
            data?.Competencies.forEach((competency) => {
              const found = competenciesElement.props.items.find(
                (item) => item.id == Number(competency.ID)
              );
              if (found) {
                found.selected = true;
                selectedCompetencyIds.push(found.id);
              }
            });
            preSelectedCompetencies.current = selectedCompetencyIds;
          }
          return newData;
        });
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
      getCandidateSkillsData();
    });
  }, []);

  return (
    <div className={style.skillsForm}>
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
      <ul>
        {data?.map((element, index) => {
          return (
            <li key={index}>
              <element.component
                {...element.props}
                value={element.props.value}
                items={element.props.items}
                selectedOptionID={element.props.value}
                selected={(obj) => handleValuesUpdate(element.key, obj.id)}
                change={(state) => handleValuesUpdate(element.key, state)}
                onChange={(arr) => handleValuesUpdate(element.key, arr)}
                onDelete={(item) => {
                  if (element.key === "SKILLS") {
                    setSkillDelete({ ID: item.id });
                    getSkillsData();
                  } else {
                    setCompetencyDelete({ ID: item.id });
                    getCompetenciesData();
                  }
                  handleValuesUpdate(
                    element.key,
                    element.props.items.filter((i) => i.id !== item.id)
                  );
                }}
              />
              {element.key === "SKILLS" &&
                Array.isArray(element?.props?.items) &&
                element.props.items.some((e) => e.selected) && (
                  <div className={style.skillsTags}>
                    {element.props?.items
                      ?.filter((item) => item.selected)
                      .map((item) => (
                        <Tag
                          key={item.id}
                          label={item.label}
                          type={"yellow"}
                          withIcon={false}
                          allowDelete={item.delatable}
                          withTooltip={false}
                          onDelete={() => {
                            const updatedItems = element.props.items.map(
                              (i) => {
                                if (i.id === item.id) {
                                  return { ...i, selected: false };
                                }
                                return i;
                              }
                            );
                            setSkillDelete({ ID: item.id });
                            handleValuesUpdate(element.key, updatedItems);
                          }}
                        />
                      ))}
                  </div>
                )}
              {element.key === "COMPETENCIES" &&
                Array.isArray(element?.props?.items) &&
                element.props.items.some((e) => e.selected) && (
                  <div className={style.skillsTags}>
                    {element.props?.items
                      ?.filter((item) => item.selected)
                      .map((item) => (
                        <Tag
                          key={item.id}
                          label={item.label}
                          type={"yellow"}
                          withIcon={false}
                          allowDelete={item.delatable}
                          withTooltip={false}
                          onDelete={() => {
                            const updatedItems = element.props.items.map(
                              (i) => {
                                if (i.id === item.id) {
                                  return { ...i, selected: false };
                                }
                                return i;
                              }
                            );
                            setCompetencyDelete({ ID: item.id });
                            handleValuesUpdate(element.key, updatedItems);
                          }}
                        />
                      ))}
                  </div>
                )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
