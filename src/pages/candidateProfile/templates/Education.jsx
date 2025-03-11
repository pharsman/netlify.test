import IconEditProfile from "@/assets/icons/other/profile/IconEditProfile";
import style from "../style/Education.module.scss";
import {
  getCandidateEducationTab,
  updateCandidateEducationTab,
  updateCandidateLanguages,
  updateCandidateCompetencies,
  updateCandidateSkills,
} from "../api/CandidateProfileApi";
import {
  getCompetency,
  getSkills,
  setSkillCreate,
  setSkillDelete,
  setCompetencyCreate,
  setCompetencyDelete,
} from "@/pages/candidates/api/CandidatesApi";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Skeleton from "masterComponents/Skeleton";
import Tag from "masterComponents/Tag";
import MainButton from "masterComponents/MainButton";
import Popup from "masterComponents/Popup";
import FormDropdown from "masterComponents/FormDropdown";
import FormInput from "masterComponents/FormInput";
import { getDegrees } from "@/pages/candidates/api/CandidatesApi";
import { getLanguages } from "@/pages/candidates/api/CandidatesApi";
import Datepicker from "masterComponents/Datepicker";
import IconMinusRed from "@/assets/icons/other/IconMinusRed";
import FormMultiSelectDropdown from "masterComponents/FormMultiSelectDropdown";
import { CategoryCreateDropdown } from "@/pages/candidates/components/CategoryCreateDropdown";

export const Education = () => {
  const { candidateID, vacancyID } = useParams();
  const [educationTabData, setEducationTabData] = useState({});
  const [educationTabDataForEdit, setEducationTabDataForEdit] = useState({});
  const [competenceData, setCompetenceData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editType, setEditType] = useState(null);
  const degreeList = useRef([]);
  const [languagesData, setLanguagesData] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [refresh, setRefresh] = useState(1);

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

  const getLanguagesData = async () => {
    await getLanguages().then((response) => {
      if (response?.data?.Languages) {
        const languages = response?.data?.Languages;
        setLanguagesData(
          languages.map((e) => ({
            id: e.ID,
            label: e.Name,
            ...e,
          }))
        );
      }
    });
  };

  const getCompetenciesData = async () => {
    try {
      await getCompetency().then((response) => {
        const data = response?.data;
        if (!data) return;
        setCompetenceData(
          data.map((e) => ({
            label: e.Name,
            id: e.ID,
            delatable: e.Deletable,
            selected: false,
            isNew: false,
          }))
        );
      });
      setRefresh((state) => (state += 1));
    } catch (error) {
      console.log(error);
    }
  };

  const getSkillsData = async () => {
    try {
      await getSkills().then((response) => {
        const data = response?.data;
        if (!data) return;
        setSkillsData(
          data.map((e) => ({
            label: e.Name,
            id: e.ID,
            delatable: e.Deletable,
            selected: false,
            isNew: false,
          }))
        );
      });
      setRefresh((state) => (state += 1));
    } catch (error) {
      console.log(error);
    }
  };

  const getTabData = async () => {
    try {
      setLoading(true);
      await getCandidateEducationTab({
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
      }).then((response) => {
        console.log(response.data);
        setEducationTabData(response.data);
        setEducationTabDataForEdit(JSON.parse(JSON.stringify(response.data)));
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let dataSet;

    if (editType === "academic") {
      dataSet = {
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
        EducationsJson: JSON.stringify(
          educationTabDataForEdit.Educations.filter(
            (education) => !education.IsCourse
          ).map((education) => ({
            ID: education.ID || null,
            DegreeID: education.DegreeID || null,
            FieldOfStudy: education.FieldOfStudy,
            IsCourse: !education.DegreeID,
            InstitutionName: education.InstitutionName,
            GraduationDate: education.GraduationDate
              ? new Date(education.GraduationDate).toISOString().split("T")[0]
              : null,
          }))
        ),
      };
    }

    if (editType === "course") {
      dataSet = {
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
        EducationsJson: JSON.stringify(
          educationTabDataForEdit.Educations.filter(
            (education) => education.IsCourse
          ).map((education) => ({
            ID: education.ID || null,
            FieldOfStudy: education.FieldOfStudy,
            IsCourse: true,
            InstitutionName: education.InstitutionName,
            GraduationDate: education.GraduationDate
              ? new Date(education.GraduationDate).toISOString().split("T")[0]
              : null,
          }))
        ),
      };
    }

    if (editType === "language") {
      dataSet = {
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
        LanguagesJson: JSON.stringify(
          selectedLanguages.map((lang) => lang.Code)
        ),
      };
    }

    if (editType === "competence") {
      dataSet = {
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
        CompetenciesJson: JSON.stringify(
          competenceData
            .filter((comp) => comp?.selected)
            .map((comp) => comp?.id) || []
        ),
      };
    }

    if (editType === "skills") {
      dataSet = {
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
        SkillsJson: JSON.stringify(
          skillsData
            .filter((skill) => skill?.selected)
            .map((skill) => skill?.id) || []
        ),
      };
    }

    const caller = ["academic", "course"].includes(editType)
      ? updateCandidateEducationTab
      : editType === "language"
      ? updateCandidateLanguages
      : editType === "competence"
      ? updateCandidateCompetencies
      : editType === "skills"
      ? updateCandidateSkills
      : null;

    if (caller) {
      try {
        setLoading(true);
        await caller(dataSet).then((response) => {
          if (!response || response.Error || response.data.Error) return;
          console.log(response);
          getTabData();
          if (editType === "language") {
            setSelectedLanguages([]);
            setLanguagesData(
              languagesData.map((item) => ({
                ...item,
                selected: false,
              }))
            );
          }
          if (editType === "competence") {
            setCompetenceData(
              competenceData.map((item) => ({
                ...item,
                selected: false,
              }))
            );
          }
          if (editType === "skills") {
            setSkillsData(
              skillsData.map((item) => ({
                ...item,
                selected: false,
              }))
            );
          }
          setEditType(null);
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const addContainer = () => {
    if (editType === "academic") {
      setEducationTabDataForEdit((prev) => ({
        ...prev,
        Educations: [
          ...(prev.Educations || []),
          {
            IsCourse: false,
            FieldOfStudy: "",
            DegreeID: null,
            InstitutionName: "",
            GraduationDate: "",
            IsNew: true,
          },
        ],
      }));
    }

    if (editType === "course") {
      setEducationTabDataForEdit((prev) => ({
        ...prev,
        Educations: [
          ...(prev.Educations || []),
          {
            IsCourse: true,
            FieldOfStudy: "",
            InstitutionName: "",
            GraduationDate: "",
            IsNew: true,
          },
        ],
      }));
    }
  };

  const deleteContainer = (index) => {
    if (editType === "academic") {
      setEducationTabDataForEdit((prev) => ({
        ...prev,
        Educations: prev.Educations.filter((_, i) => i !== index),
      }));
    }

    if (editType === "course") {
      setEducationTabDataForEdit((prev) => ({
        ...prev,
        Educations: prev.Educations.filter((_, i) => i !== index),
      }));
    }
  };

  const handleValuesUpdate = (index, key, value) => {
    if (editType === "academic") {
      setEducationTabDataForEdit((prev) => {
        const newEducations = [...prev.Educations];
        newEducations[index] = {
          ...newEducations[index],
          [key]: value,
        };
        return {
          ...prev,
          Educations: newEducations,
        };
      });
    }

    if (editType === "course") {
      setEducationTabDataForEdit((prev) => {
        const newEducations = [...prev.Educations];
        newEducations[index] = {
          ...newEducations[index],
          [key]: value,
        };
        return {
          ...prev,
          Educations: newEducations,
        };
      });
    }
  };

  useEffect(() => {
    getDegreesData();
    getLanguagesData();
    getCompetenciesData();
    getSkillsData();
    getTabData();
  }, []);

  return (
    <>
      <Popup
        visible={editType}
        options={{ title: `Edit ${editType}`, mode: "normal" }}
        size={"small"}
        width={"700px"}
      >
        <form onSubmit={handleSubmit} style={{ height: "auto" }}>
          <div className={style.formContainer}>
            {editType === "academic" && (
              <div className={style.formRow}>
                {educationTabDataForEdit?.Educations?.filter(
                  (item) => !item?.IsCourse
                )?.map((item, i) => {
                  const actualIndex =
                    educationTabDataForEdit.Educations.findIndex(
                      (education) => education === item
                    );
                  return (
                    <div
                      key={item?.ID || actualIndex}
                      className={style.formRowItem}
                    >
                      <div
                        className={style.delete}
                        onClick={() => deleteContainer(actualIndex)}
                      >
                        <IconMinusRed />
                      </div>
                      <div>
                        <FormDropdown
                          label={"Degree"}
                          data={JSON.parse(JSON.stringify(degreeList.current))}
                          selectedOptionID={item?.DegreeID}
                          fixedDropdown={true}
                          selected={(obj) => {
                            handleValuesUpdate(actualIndex, "DegreeID", obj.id);
                          }}
                        />
                      </div>

                      <div>
                        <FormInput
                          label={"Field of Study"}
                          value={item?.FieldOfStudy}
                          onChange={(value) =>
                            handleValuesUpdate(
                              actualIndex,
                              "FieldOfStudy",
                              value
                            )
                          }
                        />
                      </div>
                      <div>
                        <FormInput
                          label={"Institution Name"}
                          value={item?.InstitutionName}
                          onChange={(value) =>
                            handleValuesUpdate(
                              actualIndex,
                              "InstitutionName",
                              value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Datepicker
                          placeholder={"Graduation Date"}
                          defaultValue={item?.GraduationDate}
                          valueFormat={"YYYY-MM-DD"}
                          onChange={(value) =>
                            handleValuesUpdate(
                              actualIndex,
                              "GraduationDate",
                              value
                            )
                          }
                        />
                      </div>
                    </div>
                  );
                })}
                <MainButton
                  onClick={() => addContainer()}
                  label={"Add New Education +"}
                  size={"xs"}
                  buttonType={"button"}
                  customStyle={{
                    flexShrink: 0,
                    background: "#4D4D4E",
                    color: "#fff",
                    marginTop: "0.75rem",
                  }}
                />
              </div>
            )}

            {editType === "course" && (
              <div className={style.formRow}>
                {educationTabDataForEdit?.Educations?.filter(
                  (item) => item?.IsCourse
                )?.map((item, i) => {
                  const actualIndex =
                    educationTabDataForEdit.Educations.findIndex(
                      (education) => education === item
                    );
                  return (
                    <div
                      key={item?.ID || actualIndex}
                      className={style.formRowItem}
                    >
                      <div
                        className={style.delete}
                        onClick={() => deleteContainer(actualIndex)}
                      >
                        <IconMinusRed />
                      </div>

                      <div>
                        <FormInput
                          label={"Field of Study"}
                          value={item?.FieldOfStudy}
                          onChange={(value) =>
                            handleValuesUpdate(
                              actualIndex,
                              "FieldOfStudy",
                              value
                            )
                          }
                        />
                      </div>
                      <div>
                        <FormInput
                          label={"Institution Name"}
                          value={item?.InstitutionName}
                          onChange={(value) =>
                            handleValuesUpdate(
                              actualIndex,
                              "InstitutionName",
                              value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Datepicker
                          placeholder={"Graduation Date"}
                          defaultValue={item?.GraduationDate}
                          valueFormat={"YYYY-MM-DD"}
                          onChange={(value) =>
                            handleValuesUpdate(
                              actualIndex,
                              "GraduationDate",
                              value
                            )
                          }
                        />
                      </div>
                    </div>
                  );
                })}
                <MainButton
                  onClick={() => addContainer()}
                  label={"Add New Course +"}
                  size={"xs"}
                  buttonType={"button"}
                  customStyle={{
                    flexShrink: 0,
                    background: "#4D4D4E",
                    color: "#fff",
                    marginTop: "0.75rem",
                  }}
                />
              </div>
            )}

            {editType === "language" && (
              <div>
                <FormMultiSelectDropdown
                  key={refresh}
                  label={"Language"}
                  data={languagesData}
                  withApply={false}
                  fixedDropdown={true}
                  change={(arr) => {
                    setSelectedLanguages(arr);
                  }}
                />
                <div
                  className={style.tagsList}
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  {selectedLanguages.map((item, index) => (
                    <Tag
                      key={index}
                      label={item?.label}
                      withIcon={false}
                      type={"red"}
                      allowDelete={true}
                      onDelete={() => {
                        const filteredLanguages = selectedLanguages.filter(
                          (_, i) => i !== index
                        );
                        setSelectedLanguages(filteredLanguages);

                        setLanguagesData((prevData) =>
                          prevData.map((item) => ({
                            ...item,
                            selected: filteredLanguages.find(
                              (lang) => lang.id === item.id
                            )
                              ? true
                              : false,
                          }))
                        );
                        setRefresh((state) => (state += 1));
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {editType === "competence" && (
              <div style={{ width: "100%" }}>
                <CategoryCreateDropdown
                  key={refresh}
                  width={"100%"}
                  label={"Competence"}
                  fixedDropdown={true}
                  items={competenceData}
                  onChange={async (arr) => {
                    const newItems = arr.filter((item) => item.isNew);
                    if (newItems.length > 0) {
                      for (const item of newItems) {
                        try {
                          const response = await setCompetencyCreate({
                            Name: item.label,
                          });
                          if (response?.data) {
                            const updatedArr = arr.map((arrItem) =>
                              arrItem === item
                                ? {
                                    ...arrItem,
                                    id: response.data.ID,
                                    isNew: false,
                                    delatable: response.data?.Deletable,
                                  }
                                : arrItem
                            );
                            setCompetenceData(updatedArr);
                          }
                        } catch (error) {
                          console.log(error);
                        }
                      }
                    } else {
                      setCompetenceData(arr);
                    }
                  }}
                  onDelete={async (value) => {
                    const response = await setCompetencyDelete({
                      ID: value.id,
                    });
                    if (!response || response.data.Error || response.Error)
                      return;
                    setCompetenceData((prev) =>
                      prev.filter((item) => item.id !== value.id)
                    );
                  }}
                />

                <div
                  className={style.tagsList}
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  {competenceData
                    .filter((item) => item.selected)
                    .map((item, index) => (
                      <Tag
                        key={index}
                        label={item?.label}
                        withIcon={false}
                        type={"red"}
                        allowDelete={item?.delatable}
                        onDelete={
                          item?.delatable
                            ? async () => {
                                const response = await setCompetencyDelete({
                                  ID: item.id,
                                });
                                if (
                                  !response ||
                                  response.data.Error ||
                                  response.Error
                                )
                                  return;
                                setCompetenceData((prev) =>
                                  prev.filter((comp) => comp.id !== item.id)
                                );
                              }
                            : undefined
                        }
                      />
                    ))}
                </div>
              </div>
            )}

            {editType === "skills" && (
              <div style={{ width: "100%" }}>
                <CategoryCreateDropdown
                  key={refresh}
                  width={"100%"}
                  label={"Skills"}
                  fixedDropdown={true}
                  items={skillsData}
                  onChange={async (arr) => {
                    const newItems = arr.filter((item) => item.isNew);
                    if (newItems.length > 0) {
                      for (const item of newItems) {
                        try {
                          const response = await setSkillCreate({
                            Name: item.label,
                          });
                          if (response?.data) {
                            const updatedArr = arr.map((arrItem) =>
                              arrItem === item
                                ? {
                                    ...arrItem,
                                    id: response.data.ID,
                                    isNew: false,
                                    delatable: response.data?.Deletable,
                                  }
                                : arrItem
                            );
                            setSkillsData(updatedArr);
                          }
                        } catch (error) {
                          console.log(error);
                        }
                      }
                    } else {
                      setSkillsData(arr);
                    }
                  }}
                  onDelete={async (value) => {
                    const response = await setSkillDelete({
                      ID: value.id,
                    });
                    if (!response || response.data.Error || response.Error)
                      return;
                    setSkillsData((prev) =>
                      prev.filter((item) => item.id !== value.id)
                    );
                  }}
                />

                <div
                  className={style.tagsList}
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  {skillsData
                    .filter((item) => item.selected)
                    .map((item, index) => (
                      <Tag
                        key={index}
                        label={item?.label}
                        withIcon={false}
                        type={"red"}
                        allowDelete={item?.delatable}
                        onDelete={
                          item?.delatable
                            ? async () => {
                                const response = await setSkillDelete({
                                  ID: item.id,
                                });
                                if (
                                  !response ||
                                  response.data.Error ||
                                  response.Error
                                )
                                  return;
                                setSkillsData((prev) =>
                                  prev.map((skill) =>
                                    skill.id === item.id
                                      ? { ...skill, selected: false }
                                      : skill
                                  )
                                );
                              }
                            : undefined
                        }
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <MainButton
              label={"Cancel"}
              type={"border"}
              size={"small"}
              buttonType={"button"}
              customStyle={{ color: "#141719", borderColor: "#D1D5D6" }}
              onClick={() => {
                setEditType(null);
                setEducationTabDataForEdit(
                  JSON.parse(JSON.stringify(educationTabData))
                );

                if (editType === "language") {
                  setLanguagesData(
                    languagesData.map((item) => ({
                      ...item,
                      selected: false,
                    }))
                  );
                  setSelectedLanguages([]);
                }

                if (editType === "competence") {
                  setCompetenceData(
                    competenceData.map((item) => ({
                      ...item,
                      selected: false,
                    }))
                  );
                }

                if (editType === "skills") {
                  setSkillsData(
                    skillsData.map((item) => ({
                      ...item,
                      selected: false,
                    }))
                  );
                }
              }}
            />
            <MainButton
              label={"Save"}
              onClick={() => null}
              size={"small"}
              loading={loading}
              buttonType={"submit"}
              customStyle={{
                background: "#30ACD0",
                border: "0.0625rem solid #30ACD0",
                color: "#fff",
              }}
            />
          </div>
        </form>
      </Popup>
      <div className={style.educationTab}>
        <div
          className={`${style.academicContainer} ${style.containerCommonStyle}`}
        >
          <div className={style.containerTop}>
            <h2>Academic Education</h2>
            <div
              className={style.editContainer}
              onClick={() => setEditType("academic")}
            >
              <IconEditProfile />
            </div>
          </div>

          <div className={style.containerBody}>
            {loading ? (
              <Skeleton active={true} paragraph={{ rows: 2 }} />
            ) : (
              <div className={style.academicContainerBodyContent}>
                {educationTabData?.Educations?.filter((item) => !item?.IsCourse)
                  ?.length ? (
                  educationTabData?.Educations?.filter(
                    (item) => !item?.IsCourse
                  )?.map((item, index) => (
                    <div className={style.academicItem} key={index}>
                      <div className={style.academicItemTitle}>
                        <span>{item?.FieldOfStudy}</span>
                      </div>
                      <div className={style.academicItemContent}>
                        <span>{item?.DegreeName}</span>
                        {item?.DegreeName && (
                          <div className={style.dotMark}></div>
                        )}
                        <span>{item?.InstitutionName}</span>
                        <span>{item?.GraduationDate?.substring(0, 10)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <span
                    className={style.emptyContainer}
                    style={{ marginTop: "1rem", display: "block" }}
                  >
                    This box is empty,{" "}
                    <span onClick={() => setEditType("academic")}>
                      click here
                    </span>{" "}
                    to start adding
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* /////////////////////////////// */}

        <div
          className={`${style.courseContainer} ${style.containerCommonStyle}`}
        >
          <div className={style.containerTop}>
            <h2>Course and Trainings</h2>
            <div
              className={style.editContainer}
              onClick={() => setEditType("course")}
            >
              <IconEditProfile />
            </div>
          </div>

          <div className={style.containerBody}>
            {loading ? (
              <Skeleton active={true} paragraph={{ rows: 2 }} />
            ) : (
              <div className={style.courseContainerBodyContent}>
                {educationTabData?.Educations?.filter((item) => item?.IsCourse)
                  ?.length ? (
                  educationTabData?.Educations?.filter(
                    (item) => item?.IsCourse
                  )?.map((item, index) => (
                    <div className={style.academicItem} key={index}>
                      <div className={style.academicItemTitle}>
                        <span>{item?.FieldOfStudy}</span>
                      </div>
                      <div className={style.academicItemContent}>
                        <span>{item?.DegreeName}</span>
                        {item?.DegreeName && (
                          <div className={style.dotMark}></div>
                        )}
                        <span>{item?.InstitutionName}</span>
                        <span>{item?.GraduationDate?.substring(0, 10)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <span
                    className={style.emptyContainer}
                    style={{ marginTop: "1rem", display: "block" }}
                  >
                    This box is empty,{" "}
                    <span onClick={() => setEditType("course")}>
                      click here
                    </span>{" "}
                    to start adding
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* /////////////////////////////// */}

        <div
          className={`${style.competenceContainer} ${style.containerCommonStyle}`}
        >
          <div className={style.containerTop}>
            <h2>Competencies</h2>
            <div
              className={style.editContainer}
              onClick={() => {
                setEditType("competence");
                setCompetenceData(
                  competenceData.map((item) => ({
                    ...item,
                    selected: educationTabData?.Competencies?.some(
                      (comp) => comp.CompetencyID === item.id
                    ),
                  }))
                );
              }}
            >
              <IconEditProfile />
            </div>
          </div>

          <div className={style.containerBody}>
            {loading ? (
              <Skeleton active={true} paragraph={{ rows: 2 }} />
            ) : (
              <div className={style.competenceContainerBodyContent}>
                <div className={style.tagsList}>
                  {educationTabData?.Competencies?.length ? (
                    educationTabData.Competencies.map((item, index) => (
                      <Tag
                        key={index}
                        label={item?.Name}
                        withIcon={false}
                        type={"red"}
                      />
                    ))
                  ) : (
                    <span className={style.emptyContainer}>
                      This box is empty,{" "}
                      <span
                        onClick={() => {
                          setEditType("competence");
                          setCompetenceData(
                            competenceData.map((item) => ({
                              ...item,
                              selected: educationTabData?.Competencies?.some(
                                (comp) => comp.CompetencyID === item.id
                              ),
                            }))
                          );
                        }}
                      >
                        click here
                      </span>{" "}
                      to start adding
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* /////////////////////////////// */}

        <div
          className={`${style.skillsContainer} ${style.containerCommonStyle}`}
        >
          <div className={style.containerTop}>
            <h2>Skills</h2>
            <div
              className={style.editContainer}
              onClick={() => {
                setEditType("skills");
                setSkillsData(
                  skillsData.map((item) => ({
                    ...item,
                    selected: educationTabData?.Skills?.some(
                      (skill) => skill.SkillID === item.id
                    ),
                  }))
                );
              }}
            >
              <IconEditProfile />
            </div>
          </div>

          <div className={style.containerBody}>
            {loading ? (
              <Skeleton active={true} paragraph={{ rows: 2 }} />
            ) : (
              <div className={style.skillsContainerBodyContent}>
                <div className={style.tagsList}>
                  {educationTabData?.Skills?.length ? (
                    educationTabData.Skills.map((item, index) => (
                      <Tag
                        key={index}
                        label={item?.Name}
                        withIcon={false}
                        type={"red"}
                      />
                    ))
                  ) : (
                    <span className={style.emptyContainer}>
                      This box is empty,{" "}
                      <span
                        onClick={() => {
                          setEditType("skills");
                          setSkillsData(
                            skillsData.map((item) => ({
                              ...item,
                              selected: educationTabData?.Skills?.some(
                                (skill) => skill.SkillID === item.id
                              ),
                            }))
                          );
                        }}
                      >
                        click here
                      </span>{" "}
                      to start adding
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* /////////////////////////////// */}

        <div
          className={`${style.languageContainer} ${style.containerCommonStyle}`}
        >
          <div className={style.containerTop}>
            <h2>Languages</h2>
            <div
              className={style.editContainer}
              onClick={() => {
                setEditType("language");
                setSelectedLanguages(
                  languagesData.reduce((acc, item) => {
                    const match = educationTabData?.Languages?.find(
                      (lang) => item.Code == lang.LanguageCode
                    );
                    if (match) {
                      item["selected"] = true;
                      acc.push(item.id);
                    }
                    return acc;
                  }, [])
                );
                setRefresh((state) => (state += 1));
              }}
            >
              <IconEditProfile />
            </div>
          </div>
          <div className={style.containerBody}>
            {loading ? (
              <Skeleton active={true} paragraph={{ rows: 2 }} />
            ) : (
              <div className={style.languageContainerBodyContent}>
                <div className={style.tagsList}>
                  {educationTabData?.Languages?.length ? (
                    educationTabData.Languages.map((item, index) => (
                      <Tag
                        key={index}
                        label={item?.Name}
                        withIcon={false}
                        type={"red"}
                      />
                    ))
                  ) : (
                    <span className={style.emptyContainer}>
                      This box is empty,{" "}
                      <span
                        onClick={() => {
                          setEditType("language");
                          setSelectedLanguages(
                            languagesData.reduce((acc, item) => {
                              const match = educationTabData?.Languages?.find(
                                (lang) => item.Code == lang.LanguageCode
                              );
                              if (match) {
                                item["selected"] = true;
                                acc.push(item.id);
                              }
                              return acc;
                            }, [])
                          );
                          setRefresh((state) => (state += 1));
                        }}
                      >
                        click here
                      </span>{" "}
                      to start adding
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
