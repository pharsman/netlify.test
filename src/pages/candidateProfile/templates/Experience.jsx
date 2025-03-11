import style from "../style/Experience.module.scss";
import {
  getCandidateExperienceTab,
  updateCandidateExperienceTab,
  updateCandidateRecommendersTab,
} from "../api/CandidateProfileApi";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import IconEditProfile from "@/assets/icons/other/profile/IconEditProfile";
import Skeleton from "masterComponents/Skeleton";
import MainButton from "masterComponents/MainButton";
import Popup from "masterComponents/Popup";
import FormDropdown from "masterComponents/FormDropdown";
import FormInput from "masterComponents/FormInput";
import Datepicker from "masterComponents/Datepicker";
import IconMinusRed from "@/assets/icons/other/IconMinusRed";
import { useRef } from "react";
import { getIndustries } from "@/pages/candidates/api/CandidatesApi";
import useUpdateEffect from "@/hooks/useUpdateEffect";

export const Experience = () => {
  const { candidateID, vacancyID } = useParams();
  const [tabData, setTabData] = useState([]);
  const [tabDataForEdit, setTabDataForEdit] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editType, setEditType] = useState(null);
  const industriesList = useRef([]);
  const getTabData = async () => {
    setLoading(true);
    try {
      const response = await getCandidateExperienceTab({
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
      });
      if (!response || response.data?.Error || response.Error) return;
      setTabData(response.data);
      setTabDataForEdit(JSON.parse(JSON.stringify(response.data)));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let dataSet = {};

    if (editType === "experience") {
      dataSet = {
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
        ExperiencesJson: JSON.stringify(
          tabDataForEdit.Experiences.map((exp) => ({
            ID: exp.ExperienceID || null,
            JobName: exp.JobName,
            CompanyName: exp.CompanyName,
            IndustryID: exp.IndustryID,
            StartDate: exp.StartDate
              ? new Date(exp.StartDate).toISOString().split("T")[0]
              : "",
            EndDate: exp.EndDate
              ? new Date(exp.EndDate).toISOString().split("T")[0]
              : "",
          }))
        ),
      };
    }

    if (editType === "recommenders") {
      dataSet = {
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
        RecommendersJson: JSON.stringify(
          tabDataForEdit.Recommenders.map((rec) => ({
            ID: rec.RecommenderID || null,
            FullName: rec.FullName,
            LinkedinUrl: rec.LinkedinUrl,
            Job: rec.Job,
            CurrentCompany: rec.CurrentCompany,
          }))
        ),
      };
    }

    const caller =
      editType === "experience"
        ? updateCandidateExperienceTab
        : editType === "recommenders"
        ? updateCandidateRecommendersTab
        : null;

    try {
      setLoading(true);
      const response = await caller(dataSet);
      if (!response || response.data?.Error || response.Error) return;
      setEditType(null);
      getTabData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteContainer = (index) => {
    if (editType === "experience") {
      setTabDataForEdit((prev) => {
        const newData = { ...prev };
        newData.Experiences = newData.Experiences.filter((_, i) => i !== index);
        return newData;
      });
    }
    if (editType === "recommenders") {
      setTabDataForEdit((prev) => {
        const newData = { ...prev };
        newData.Recommenders = newData.Recommenders.filter(
          (_, i) => i !== index
        );
        return newData;
      });
    }
  };

  const getIndustriesData = async () => {
    await getIndustries().then((response) => {
      const industries = response?.data?.data ?? null;

      if (!industries) return;
      industriesList.current = industries.map((i) => ({
        label: i.Name,
        id: i.ID,
      }));
    });
  };

  const addContainer = () => {
    if (editType === "experience") {
      setTabDataForEdit((prev) => {
        const newData = { ...prev };
        newData.Experiences.push({
          JobName: "",
          CompanyName: "",
          StartDate: "",
          EndDate: "",
          IndustryName: "",
          IsNew: true,
        });
        return newData;
      });
    }
    if (editType === "recommenders") {
      setTabDataForEdit((prev) => {
        const newData = { ...prev };
        newData.Recommenders.push({
          FullName: "",
          LinkedinUrl: "",
          Job: "",
          CurrentCompany: "",
          IsNew: true,
        });
        return newData;
      });
    }
  };

  const handleValuesUpdate = (index, key, value) => {
    setTabDataForEdit((prev) => {
      const newData = { ...prev };
      if (editType === "experience") {
        newData.Experiences[index][key] = value;
      }
      if (editType === "recommenders") {
        newData.Recommenders[index][key] = value;
      }
      return newData;
    });
  };

  useEffect(() => {
    getTabData();
    getIndustriesData();
  }, []);

  useUpdateEffect(() => {
    if (!editType) setTabDataForEdit(JSON.parse(JSON.stringify(tabData)));
  }, [editType]);

  return (
    <>
      <Popup
        visible={editType}
        options={{ title: `Edit ${editType}`, mode: "normal" }}
        size={"small"}
        width={"700px"}
      >
        <form className={style.tabForm} onSubmit={handleSubmit}>
          {editType === "experience" && (
            <div className={style.formContainers}>
              {tabDataForEdit?.Experiences?.map((experience, index) => (
                <>
                  <div className={style.editContainer} key={index}>
                    <div
                      className={style.delete}
                      onClick={() => deleteContainer(index)}
                    >
                      <IconMinusRed />
                    </div>
                    <div>
                      <FormInput
                        label={"Job"}
                        value={experience?.JobName}
                        onChange={(value) =>
                          handleValuesUpdate(index, "JobName", value)
                        }
                      />
                    </div>

                    <div>
                      <FormInput
                        label={"Company"}
                        value={experience?.CompanyName}
                        onChange={(value) =>
                          handleValuesUpdate(index, "CompanyName", value)
                        }
                      />
                    </div>

                    <div>
                      <Datepicker
                        placeholder={"Start Date"}
                        defaultValue={experience?.StartDate}
                        valueFormat={"YYYY-MM-DD"}
                        mode={"range"}
                        onChange={(value) => {
                          handleValuesUpdate(index, "StartDate", value?.from);
                          handleValuesUpdate(index, "EndDate", value?.to);
                        }}
                      />
                    </div>
                    <div>
                      <FormDropdown
                        key={experience?.IndustryID}
                        label={"Industry"}
                        fixedDropdown={true}
                        data={JSON.parse(
                          JSON.stringify(industriesList.current)
                        )}
                        selectedOptionID={experience?.IndustryID}
                        selected={(obj) =>
                          handleValuesUpdate(index, "IndustryID", obj.id)
                        }
                      />
                    </div>
                  </div>
                </>
              ))}
              <MainButton
                onClick={addContainer}
                label={"Add New Experience +"}
                size={"xs"}
                buttonType={"button"}
                customStyle={{
                  flexShrink: 0,
                  background: "#4D4D4E",
                  color: "#fff",
                }}
              />
            </div>
          )}

          {editType === "recommenders" && (
            <div className={style.formContainers}>
              {tabDataForEdit?.Recommenders?.map((recommender, index) => (
                <div className={style.editContainer} key={index}>
                  <div
                    className={style.delete}
                    onClick={() => deleteContainer(index)}
                  >
                    <IconMinusRed />
                  </div>
                  <div>
                    <FormInput
                      label={"Professional Recommender's Name Surname"}
                      value={recommender?.FullName}
                      isRequired={true}
                      onChange={(value) =>
                        handleValuesUpdate(index, "FullName", value)
                      }
                    />
                  </div>

                  <div>
                    <FormInput
                      label={"LinkedIn Profile"}
                      value={recommender?.LinkedinUrl}
                      isRequired={true}
                      onChange={(value) =>
                        handleValuesUpdate(index, "LinkedinUrl", value)
                      }
                    />
                  </div>

                  <div>
                    <FormInput
                      label={"Recommender's Job"}
                      value={recommender?.Job}
                      onChange={(value) =>
                        handleValuesUpdate(index, "Job", value)
                      }
                    />
                  </div>
                  <div>
                    <FormInput
                      label={"Current company"}
                      value={recommender?.CurrentCompany}
                      onChange={(value) =>
                        handleValuesUpdate(index, "CurrentCompany", value)
                      }
                    />
                  </div>
                </div>
              ))}

              <MainButton
                onClick={addContainer}
                label={"Add New Recommender +"}
                size={"xs"}
                buttonType={"button"}
                customStyle={{
                  flexShrink: 0,
                  background: "#4D4D4E",
                  color: "#fff",
                }}
              />
            </div>
          )}

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
              onClick={() => setEditType(null)}
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

      <div className={style.experience}>
        <div className={style.experiencesContainer}>
          <div className={style.experienceHeader}>
            <h2>Experience</h2>

            {tabData?.Experiences?.length > 0 && (
              <div
                className={style.editExperience}
                onClick={() => setEditType("experience")}
              >
                <IconEditProfile />
              </div>
            )}
          </div>
          <div className={style.experienceContent}>
            {loading ? (
              <Skeleton active={true} paragraph={{ rows: 2 }} />
            ) : tabData?.Experiences?.length === 0 ? (
              <span className={style.emptyContainer}>
                This box is empty,{" "}
                <span onClick={() => setEditType("experience")}>
                  click here
                </span>{" "}
                to start adding
              </span>
            ) : (
              tabData?.Experiences?.map((experience, index) => (
                <div className={style.experienceItem} key={index}>
                  <div className={style.jobName}>
                    <span>{experience?.JobName}</span>
                  </div>
                  <div className={style.details}>
                    <span>{experience?.CompanyName}</span>
                    <div className={style.dotMark}></div>
                    <span>{experience?.IndustryName}</span>
                    <span className={style.date}>
                      (
                      {new Date(experience?.StartDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          year: "numeric",
                        }
                      )}{" "}
                      -{" "}
                      {new Date(experience?.EndDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={style.recommendersContainer}>
          <div className={style.recommendersHeader}>
            <h2>Recommenders</h2>
            {tabData?.Recommenders?.length > 0 && (
              <div
                className={style.editRecommenders}
                onClick={() => setEditType("recommenders")}
              >
                <IconEditProfile />
              </div>
            )}
          </div>
          <div className={style.recommendersContent}>
            <div className={style.recommendersList}>
              {loading ? (
                <Skeleton active={true} paragraph={{ rows: 2 }} />
              ) : tabData?.Recommenders?.length === 0 ? (
                <span className={style.emptyContainer}>
                  This box is empty,{" "}
                  <span onClick={() => setEditType("recommenders")}>
                    click here
                  </span>{" "}
                  to start adding
                </span>
              ) : (
                tabData?.Recommenders?.map((recommender, index) => (
                  <div className={style.recommenderItem} key={index}>
                    <div className={style.recommenderInfo}>
                      <span>{recommender?.FullName}</span>
                    </div>
                    <div className={style.recommenderDetails}>
                      <span>{recommender?.Job}</span>
                      <div className={style.dotMark}></div>
                      <span>{recommender?.CurrentCompany}</span>
                    </div>
                    <div className={style.link}>
                      {recommender?.LinkedinUrl && (
                        <a href={recommender?.LinkedinUrl} target="_blank">
                          See LinkedIn Profile
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
