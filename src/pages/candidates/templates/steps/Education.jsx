import style from "@/pages/candidates/style/Education.module.scss";
import MainButton from "masterComponents/MainButton";
import FormDropdown from "masterComponents/FormDropdown";
import FormInput from "masterComponents/FormInput";
import Datepicker from "masterComponents/Datepicker";
import IconMinus from "@/assets/icons/other/IconMinusRed";
import { __findNodeByKey } from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useCandidatesStore } from "../../store/CandidatesStore";
import { CandidateActionTypes } from "../../constants";
import {
  getCandidateEducations,
  getDegrees,
  setCandidateEducations,
} from "../../api/CandidatesApi";
import Loader from "masterComponents/Loader";

export const Education = ({ onLoadNextStep, onLoadPrevStep }) => {
  const [loading, setLoading] = useState(false);
  const {
    actionTrigger,
    setActionTrigger,
    updateCandidateID,
    candidateIdInProgress,
  } = useCandidatesStore((state) => state);
  const degreeList = useRef(null);
  const initialData = {
    academic: [
      {
        key: crypto.randomUUID(),
        children: [
          {
            component: FormDropdown,
            key: "DEGREE",
            props: {
              label: "Degree",
              size: "small",
              data: [],
              withClear: true,
              withFilter: true,
              value: "",
            },
          },
          {
            component: FormInput,
            key: "FIELD_OF_STUDY",
            props: {
              label: "Field of Study",
              size: "small",
              inputType: "text",
              value: "",
            },
          },
          {
            component: Datepicker,
            key: "GRADUATION_YEAR",
            props: {
              placeholder: "Graduation Year",
              size: "large",
              value: "",
              valueFormat: "YYYY-MM-DD",
              isRequired: true,
            },
          },
          {
            component: FormInput,
            key: "INSTITUTION_NAME",
            props: {
              label: "Institution Name",
              size: "small",
              inputType: "text",
              value: "",
            },
          },
        ],
      },
    ],
    courses: [
      {
        key: crypto.randomUUID(),
        children: [
          {
            component: FormInput,
            key: "FIELD_OF_STUDY",
            props: {
              label: "Field of Study",
              size: "small",
              inputType: "text",
              value: "",
            },
          },
          {
            component: FormInput,
            key: "INSTITUTION_NAME",
            props: {
              label: "Institution Name",
              size: "small",
              inputType: "text",
              value: "",
            },
          },
          {
            component: Datepicker,
            key: "GRADUATION_YEAR",
            props: {
              placeholder: "Graduation Year",
              size: "large",
              value: "",
              valueFormat: "YYYY-MM-DD",
              isRequired: true,
            },
          },
        ],
      },
    ],
  };
  const [dataAcademic, setDataAcademic] = useState([]);
  const [dataCourses, setDataCourses] = useState([]);

  const initialCalls = async () => {
    setLoading(true);
    try {
      await Promise.all([getDegreesData()]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getElement = (arr, key) => {
    return arr.find((e) => e.key === key);
  };

  const getDegreesData = async () => {
    await getDegrees({
      PageSize: 100000,
    }).then((response) => {
      if (response.data.data) {
        const degrees = response?.data?.data;
        degreeList.current = degrees.map((e) => ({
          id: e.ID,
          label: e.Name,
        }));
      }
    });
  };

  const addAcademicContainer = () => {
    setDataAcademic((prev) => {
      const newData = [...prev];
      const mapData = initialData.academic.map((e) => ({
        ...e,
        key: crypto.randomUUID(),
      }));

      mapData.forEach((container) => {
        const degreeElement = getElement(container.children, "DEGREE");
        if (degreeElement) {
          degreeElement.props.data = degreeList.current;
        }
      });

      return [...newData, ...mapData];
    });
  };

  const deleteAcademicContainer = (index) => {
    setDataAcademic((prev) => {
      const newData = [...prev];
      newData.splice(index, 1);
      return newData;
    });
  };

  const deleteCoursesContainer = (index) => {
    setDataCourses((prev) => {
      const newData = [...prev];
      newData.splice(index, 1);
      return newData;
    });
  };

  const addCoursesContainer = () => {
    setDataCourses((prev) => {
      const newData = [...prev];
      const mapData = initialData.courses.map((e) => ({
        ...e,
        key: crypto.randomUUID(),
      }));
      return [...newData, ...mapData];
    });
  };

  const handleValuesUpdate = (key, childKey, value, type) => {
    if (type === "academic") {
      setDataAcademic((prev) => {
        const newData = [...prev];
        const parent = getElement(newData, key);
        if (parent) {
          const element = getElement(parent.children, childKey);
          if (element) {
            element.props.value = value;
          }
          return newData;
        }
        return prev;
      });
    } else if (type === "courses") {
      setDataCourses((prev) => {
        const newData = [...prev];
        const parent = getElement(newData, key);
        if (parent) {
          const element = getElement(parent.children, childKey);
          if (element) {
            element.props.value = value;
          }
          return newData;
        }
        return prev;
      });
    }
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
      EducationsJson: JSON.stringify([
        ...dataAcademic.map((academic) => {
          const degreeElement = getElement(academic.children, "DEGREE");
          const fieldElement = getElement(academic.children, "FIELD_OF_STUDY");
          const institutionElement = getElement(
            academic.children,
            "INSTITUTION_NAME"
          );
          const graduationElement = getElement(
            academic.children,
            "GRADUATION_YEAR"
          );

          return {
            ID: null,
            DegreeID: degreeElement?.props?.value || null,
            FieldOfStudy: fieldElement?.props?.value || "",
            InstitutionName: institutionElement?.props?.value || "",
            GraduationDate: graduationElement?.props?.value || null,
          };
        }),
        ...dataCourses.map((course) => {
          const fieldElement = getElement(course.children, "FIELD_OF_STUDY");
          const institutionElement = getElement(
            course.children,
            "INSTITUTION_NAME"
          );
          const graduationElement = getElement(
            course.children,
            "GRADUATION_YEAR"
          );

          return {
            ID: null,
            DegreeID: null,
            FieldOfStudy: fieldElement?.props?.value || "",
            InstitutionName: institutionElement?.props?.value || "",
            GraduationDate: graduationElement?.props?.value || null,
          };
        }),
      ]),
    };

    try {
      setLoading(true);
      await setCandidateEducations(dataSet).then((response) => {
        if (!response || response.data.Error || response.Error) return;
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

  const getEducationData = async () => {
    if (!updateCandidateID?.CandidateID && !candidateIdInProgress?.CandidateID)
      return;

    try {
      setLoading(true);
      await getCandidateEducations({
        CandidateID:
          updateCandidateID?.CandidateID || candidateIdInProgress?.CandidateID,
        VacancyID:
          updateCandidateID?.VacancyID || candidateIdInProgress?.VacancyID,
      }).then((response) => {
        const educations = response.data;
        if (educations) {
          const academicData = [];
          const coursesData = [];

          educations.forEach((education) => {
            if (education.IsCourse) {
              const courseContainer = {
                ...initialData.courses[0],
                key: crypto.randomUUID(),
              };

              courseContainer.children.forEach((child) => {
                if (child.key === "FIELD_OF_STUDY") {
                  child.props.value = education.FieldOfStudy || "";
                } else if (child.key === "INSTITUTION_NAME") {
                  child.props.value = education.InstitutionName || "";
                } else if (child.key === "GRADUATION_YEAR") {
                  child.props.value = education.GraduationDate
                    ? education.GraduationDate.substring(0, 10)
                    : "";
                }
              });

              coursesData.push(courseContainer);
            } else {
              const academicContainer = {
                ...initialData.academic[0],
                key: crypto.randomUUID(),
              };

              academicContainer.children.forEach((child) => {
                if (child.key === "DEGREE") {
                  child.props.value = education.DegreeID || "";
                  child.props.data = degreeList.current;
                } else if (child.key === "FIELD_OF_STUDY") {
                  child.props.value = education.FieldOfStudy || "";
                } else if (child.key === "GRADUATION_YEAR") {
                  child.props.value = education.GraduationDate
                    ? education.GraduationDate.substring(0, 10)
                    : "";
                } else if (child.key === "INSTITUTION_NAME") {
                  child.props.value = education.InstitutionName || "";
                }
              });

              academicData.push(academicContainer);
            }
          });

          setDataAcademic(academicData);
          setDataCourses(coursesData);
        }
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
      getEducationData();
    });
  }, []);

  return (
    <div className={style.educationForm}>
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
      <div className={style.categoryWrapper}>
        <h2>Academic background</h2>
        <div className={style.containersWrapper}>
          {dataAcademic.map((container, index) => {
            return (
              <ul key={index} className={style.experienceContainer}>
                <div
                  className={style.delete}
                  onClick={() => deleteAcademicContainer(index)}
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
                              handleValuesUpdate(
                                container.key,
                                item.key,
                                obj.id,
                                "academic"
                              )
                            }
                            onChange={(value) =>
                              handleValuesUpdate(
                                container.key,
                                item.key,
                                value,
                                "academic"
                              )
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
            onClick={addAcademicContainer}
            label={"Add New Education +"}
            size={"xs"}
            customStyle={{
              flexShrink: 0,
              background: "#4D4D4E",
              color: "#fff",
              marginTop: "0.75rem",
            }}
          />
        </div>
      </div>
      <div className={style.categoryWrapper}>
        <h2>Course and trainings</h2>
        <div className={style.containersWrapper}>
          {dataCourses.map((container, index) => {
            return (
              <ul key={index} className={style.experienceContainer}>
                <div
                  className={style.delete}
                  onClick={() => deleteCoursesContainer(index)}
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
                              handleValuesUpdate(
                                container.key,
                                item.key,
                                obj.id,
                                "courses"
                              )
                            }
                            onChange={(value) =>
                              handleValuesUpdate(
                                container.key,
                                item.key,
                                value,
                                "courses"
                              )
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
            onClick={addCoursesContainer}
            label={"Add New Course or trainging +"}
            size={"xs"}
            customStyle={{
              flexShrink: 0,
              background: "#4D4D4E",
              color: "#fff",
              marginTop: "0.75rem",
            }}
          />
        </div>
      </div>
    </div>
  );
};
