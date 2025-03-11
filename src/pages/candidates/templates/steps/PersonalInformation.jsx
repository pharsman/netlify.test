import { Fragment, useEffect, useState } from "react";
import { UploadPhoto } from "../../components/UploadPhoto";
import Radio from "masterComponents/Radio";
import style from "@/pages/candidates/style/PersonalInformation.module.scss";
import FormInput from "masterComponents/FormInput";
import FormDropdown from "masterComponents/FormDropdown";
import Datepicker from "masterComponents/Datepicker";
import MainButton from "masterComponents/MainButton";
import IconTrash from "@/assets/icons/other/IconTrash";
import Loader from "masterComponents/Loader";
import {
  getCandidatePersonalInformation,
  getCities,
  getCountries,
  getCurrency,
  getGenders,
  getMobileCodes,
  getVacancyJobs,
  setCandidatePersonalInformation,
} from "../../api/CandidatesApi";
import { __findNodeByKey } from "@/utils/helpers";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useCandidatesStore } from "../../store/CandidatesStore";
import { CandidateActionTypes } from "../../constants";
export const PersonalInformation = ({ onLoadNextStep, onLoadPrevStep }) => {
  const [loading, setLoading] = useState(false);
  const [reloadDatepicker, setReloadDatepicker] = useState(1);
  const {
    actionTrigger,
    setActionTrigger,
    updateCandidateID,
    candidateIdInProgress,
    setCandidateIdInProgress,
  } = useCandidatesStore((state) => state);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const initialData = [
    {
      component: FormInput,
      key: "NAME",
      props: {
        label: "Name",
        size: "small",
        isRequired: true,
        value: "",
      },
    },
    {
      component: FormInput,
      key: "SURNAME",
      props: {
        label: "Surname",
        size: "small",
        isRequired: true,
        value: "",
      },
    },
    {
      component: FormDropdown,
      key: "JOB",
      props: {
        label: "Job",
        size: "small",
        data: [],
        isRequired: true,
        withClear: true,
        withFilter: true,
        value: "",
      },
    },
    {
      component: FormInput,
      key: "PERSONAL_ID",
      props: {
        label: "Personal ID",
        size: "small",
        hideArrows: true,
        inputType: "number",
        value: "",
      },
    },
    {
      isGroup: true,
      key: "PHONE/CODE",
      children: [
        {
          component: FormDropdown,
          key: "CODE",
          props: {
            label: "Code",
            data: [],
            size: "small",
            withClear: true,
            withFilter: true,
            value: "",
          },
        },
        {
          component: FormInput,
          key: "PHONE",
          props: {
            label: "Phone",
            size: "small",
            hideArrows: true,
            inputType: "number",
            value: "",
          },
        },
      ],
    },
    {
      component: FormInput,
      key: "EMAIL",
      props: {
        label: "Email",
        size: "small",
        inputType: "Email",
        value: "",
      },
    },
    {
      component: FormDropdown,
      key: "GENDER",
      props: {
        label: "Gender",
        data: [],
        size: "small",
        withClear: true,
        withFilter: true,
        value: "",
      },
    },
    {
      component: Datepicker,
      key: "BIRTH_DATE",
      props: {
        placeholder: "Birth Date",
        size: "large",
        value: "",
        valueFormat: "YYYY-MM-DD",
        format: "YYYY-MM-DD",
        allowClear: true,
      },
    },
    {
      component: FormDropdown,
      key: "COUNTRY",
      props: {
        label: "Country",
        data: [],
        size: "small",
        withClear: true,
        withFilter: true,
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
        value: "",
      },
    },
    {
      isGroup: true,
      key: "SALARY/CURRENCY",
      children: [
        {
          component: FormInput,
          key: "SALARY",
          props: {
            label: "Salary",
            size: "small",
            // placeholder: "Enter a range like 1000-6000",
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
            withClear: true,
            withFilter: true,
            value: "",
          },
        },
      ],
    },
  ];
  const [data, setData] = useState(null);

  const [image, setImage] = useState(null);
  const [socialProfiles, setSocialProfiles] = useState([]);
  const [candidateType, setCandidateType] = useState(null);
  const candidateTypes = {
    HEAD_HUNTING: "Headhunting",
    APPLIED: "Applied",
  };
  const getElement = (arr, key) => {
    return __findNodeByKey(arr, "key", key);
  };

  const getGendersData = async () => {
    await getGenders().then((response) => {
      const genders = response?.data?.data ?? null;
      if (!genders) return;

      setData((prev) => {
        const newData = [...prev];
        const genderElement = getElement(newData, "GENDER") ?? {};
        genderElement.props.data = genders.map((e) => ({
          id: e.ID,
          label: e.Name,
        }));
        return newData;
      });
    });
  };

  const getMobileCodesData = async () => {
    await getMobileCodes({
      PageSize: 100000,
    }).then((response) => {
      const codes = response?.data?.Codes ?? null;
      if (!codes) return;
      setData((prev) => {
        const newData = [...prev];
        const mobileGroup = getElement(newData, "PHONE/CODE") ?? {};
        const codeElement = getElement(mobileGroup.children, "CODE");
        codeElement.props.data = codes.map((e) => ({
          id: e.CountryID,
          label: `+(${e.MobileCode})`,
        }));
        return newData;
      });
    });
  };

  const getCountriesData = async () => {
    await getCountries({
      PageSize: 100000,
    }).then((response) => {
      const countries = response?.data?.Countries;
      if (!countries) return;
      setData((prev) => {
        const newData = [...prev];
        const countryElement = getElement(newData, "COUNTRY") ?? {};
        countryElement.props.data = countries.map((e) => ({
          id: e.ID,
          label: e.Name,
          ...e,
        }));
        return newData;
      });
    });
  };

  const getCitiesData = async (CountryCode) => {
    await getCities({
      PageSize: 100000,
      CountryCode: CountryCode ?? null,
    }).then((response) => {
      const cities = response?.data ?? null;
      if (!cities) return;
      setData((prev) => {
        const newData = [...prev];
        const cityElement = getElement(newData, "CITY") ?? {};
        cityElement.props.data = cities.map((e) => ({
          id: e.ID,
          label: e.Name,
        }));
        return newData;
      });
    });
  };

  const getCurrenciesData = async () => {
    await getCurrency({
      PageSize: 100000,
    }).then((response) => {
      const currencies = response?.data ?? null;
      if (!currencies) return;
      setData((prev) => {
        const newData = [...prev];
        const currencyGroup = getElement(newData, "SALARY/CURRENCY") ?? {};
        const currencyElement = getElement(currencyGroup.children, "CURRENCY");
        currencyElement.props.data = currencies.map((e) => ({
          id: e.ID,
          label: e.Name,
        }));
        return newData;
      });
    });
  };

  const getVacancyJobsData = async () => {
    await getVacancyJobs({
      PageSize: 100000,
    }).then((response) => {
      const jobs = response?.data ?? null;
      if (!jobs) return;
      setData((prev) => {
        const newData = [...prev];
        const jobElement = getElement(newData, "JOB") ?? {};
        jobElement.props.data = jobs.map((e) => ({
          id: e.VacancyID,
          label: `${e.VacancyName} - ${e.Status}`,
        }));
        return newData;
      });
    });
  };

  const getCandidateData = async () => {
    if (!updateCandidateID?.CandidateID && !candidateIdInProgress?.CandidateID)
      return;
    setLoading(true);
    try {
      await getCandidatePersonalInformation({
        CandidateID:
          updateCandidateID?.CandidateID || candidateIdInProgress?.CandidateID,
        VacancyID:
          updateCandidateID?.VacancyID || candidateIdInProgress?.VacancyID,
      })
        .then((response) => {
          if (!response || response.Error || response.data.Error) return;
          const data = response.data;

          setData((prev) => {
            const newData = [...prev];
            getElement(newData, "NAME").props.value = data?.FirstName;
            getElement(newData, "SURNAME").props.value = data?.LastName;
            getElement(newData, "JOB").props.value = data?.VacancyID;
            getElement(newData, "PERSONAL_ID").props.value =
              data?.PersonalNumber;

            getElement(newData, "EMAIL").props.value = data?.Email;
            getElement(newData, "GENDER").props.value = data?.GenderID;

            getElement(newData, "COUNTRY").props.value = data?.CountryID;
            getElement(newData, "CITY").props.value = data?.CityID;

            setCandidateType(
              data?.IsHeadHunting
                ? candidateTypes.HEAD_HUNTING
                : candidateTypes.APPLIED
            );

            getElement(newData, "BIRTH_DATE").props.value = data?.BirthDate;

            const mobileGroup = getElement(newData, "PHONE/CODE") ?? {};
            const codeElement = getElement(mobileGroup.children, "CODE");
            codeElement.props.value = data?.MobileCountryID;

            const phoneElement = getElement(mobileGroup.children, "PHONE");
            phoneElement.props.value = data?.MobileNumber;

            const salaryGroup = getElement(newData, "SALARY/CURRENCY") ?? {};
            const salaryElement = getElement(salaryGroup.children, "SALARY");
            salaryElement.props.value = data?.ExpectedSalaryAmount;

            const currencyElement = getElement(
              salaryGroup.children,
              "CURRENCY"
            );
            currencyElement.props.value = data?.ExpectedSalaryCurrencyID;

            const socialProfiles = data?.CandidateOtherLinksJson
              ? JSON.parse(data?.CandidateOtherLinksJson)
              : [];
            setSocialProfiles(
              socialProfiles.map((e) => ({
                link: e,
              }))
            );

            setAvatarUrl(data?.AvatarUrl);

            return newData;
          });
          setReloadDatepicker((state) => (state += 1));
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const initialCalls = async () => {
    setLoading(true);
    setData(initialData);

    try {
      await Promise.all([
        getGendersData(),
        getCurrenciesData(),
        getCitiesData(),
        getCountriesData(),
        getMobileCodesData(),
        getVacancyJobsData(),
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleValuesUpdate = async (
    key,
    value,
    isGrouped = false,
    groupKey = null
  ) => {
    if (key === "COUNTRY") {
      await getCitiesData(
        data
          ?.find((el) => el.key === "COUNTRY")
          ?.props?.data?.find((el) => el.id === value)?.Code
      );
    }
    setData((prev) => {
      const newData = [...prev];

      if (isGrouped && groupKey) {
        const group = newData.find((el) => el.key === groupKey);
        if (group && group.children) {
          const child = group.children.find((child) => child.key === key);
          if (child) {
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

  const addSocialProfile = () => {
    const fieldObject = {
      link: "",
    };
    setSocialProfiles((prev) => [...prev, fieldObject]);
  };

  const updateSocialProfileValues = (index, value) => {
    setSocialProfiles((prev) => {
      const newSocialProfile = [...prev];
      newSocialProfile.find((el, ind) => ind === index)["link"] = value;
      return newSocialProfile;
    });
  };

  const deleteSocialProfileField = (index) => {
    setSocialProfiles((prev) => {
      return prev.filter((el, ind) => ind != index);
    });
  };

  const sendRequest = async (skipNextAndClose = false) => {
    const findValue = (key) => {
      try {
        if (!key) return null;
        const element = data.find((el) => el?.key === key);
        if (!element?.props) return null;
        return element.props.value;
      } catch (error) {
        console.error("Error finding value:", error);
        return null;
      }
    };
    const findGroupValue = (groupKey, childKey) => {
      if (!groupKey || !childKey) return "";
      const group = data.find((el) => el.isGroup && el.key === groupKey);
      if (!group) return "";
      const child = group?.children?.find((child) => child.key === childKey);
      if (!child || !child.props) return "";
      return child.props.value || "";
    };

    const avatarImage = {
      ...image,
      FileData: image?.FileData
        ? image.FileData.replace(/^"|"$/g, "").replace(
            /^data:image\/[a-z]+;base64,/,
            ""
          )
        : null,
    };

    const dataSet = {
      VacancyID: findValue("JOB") !== undefined ? findValue("JOB") : null,
      CandidateID:
        updateCandidateID?.CandidateID !== undefined
          ? updateCandidateID.CandidateID
          : candidateIdInProgress?.CandidateID !== undefined
          ? candidateIdInProgress.CandidateID
          : null,
      IsHeadHunting:
        candidateType !== undefined
          ? candidateType === candidateTypes.HEAD_HUNTING
          : false,
      FirstName: findValue("NAME") !== undefined ? findValue("NAME") : null,
      LastName:
        findValue("SURNAME") !== undefined ? findValue("SURNAME") : null,
      PersonalNumber:
        findValue("PERSONAL_ID") !== undefined
          ? findValue("PERSONAL_ID")
          : null,
      MobileCountryID:
        findGroupValue("PHONE/CODE", "CODE") !== undefined
          ? findGroupValue("PHONE/CODE", "CODE")
          : null,
      MobileNumber:
        findGroupValue("PHONE/CODE", "PHONE") !== undefined
          ? findGroupValue("PHONE/CODE", "PHONE")
          : null,
      Email: findValue("EMAIL") !== undefined ? findValue("EMAIL") : null,
      GenderID: findValue("GENDER") !== undefined ? findValue("GENDER") : null,
      BirthDate:
        findValue("BIRTH_DATE") !== undefined ? findValue("BIRTH_DATE") : null,
      CountryID:
        findValue("COUNTRY") !== undefined ? findValue("COUNTRY") : null,
      CityID: findValue("CITY") !== undefined ? findValue("CITY") : null,
      ExpectedSalaryAmount:
        findGroupValue("SALARY/CURRENCY", "SALARY") !== undefined
          ? findGroupValue("SALARY/CURRENCY", "SALARY")
          : null,
      ExpectedSalaryCurrencyID:
        findGroupValue("SALARY/CURRENCY", "CURRENCY") !== undefined
          ? findGroupValue("SALARY/CURRENCY", "CURRENCY")
          : null,
      CandidateOtherLinksJson:
        socialProfiles !== undefined && socialProfiles.length
          ? JSON.stringify(
              socialProfiles
                .map((e) => (e?.link !== undefined ? e.link : null))
                .filter(Boolean)
            )
          : null,
      AvatarJson:
        image?.FileData !== undefined ? JSON.stringify(avatarImage) : null,
    };

    try {
      setLoading(true);
      await setCandidatePersonalInformation(dataSet).then((response) => {
        if (!response || response.Error || response.data.Error) return;
        setCandidateIdInProgress({
          CandidateID: response?.data?.CandidateID || null,
          VacancyID: findValue("JOB") || null,
        });
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
      getCandidateData();
    });
  }, []);

  return (
    <div className={style.personalInformationForm}>
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
      <ul className={style.avatarAndType}>
        <li className={style.imageUpload}>
          <UploadPhoto
            setImage={setImage}
            image={image?.FileData || avatarUrl}
          />
        </li>
        <li className={style.candidateType}>
          <div onClick={() => setCandidateType(candidateTypes.HEAD_HUNTING)}>
            <Radio
              checked={
                candidateType && candidateType == candidateTypes.HEAD_HUNTING
              }
            />
            <span>Headhunting</span>
          </div>
          <div onClick={() => setCandidateType(candidateTypes.APPLIED)}>
            <Radio
              checked={candidateType && candidateType == candidateTypes.APPLIED}
            />
            <span>Applied</span>
          </div>
        </li>
      </ul>
      <ul>
        {data &&
          data.map((element, index) => (
            <li
              key={index}
              className={`${
                element.key == "PHONE/CODE"
                  ? style.phoneNumber
                  : element.key == "SALARY/CURRENCY"
                  ? style.salary
                  : ""
              }`}
            >
              {element.isGroup ? (
                <div style={{ display: "flex", gap: "1rem" }}>
                  {element?.children.map((child, ind) => (
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
              ) : (
                <element.component
                  {...element.props}
                  value={element.props.value}
                  key={element.key === "BIRTH_DATE" ? reloadDatepicker : null}
                  defaultValue={element.props.value}
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
      <div className={style.socialMediaFields}>
        <h2>Soc Media Profiles</h2>
        <ul>
          {socialProfiles?.map((el, ind) => {
            return (
              <li key={ind} className={style.profileField}>
                <FormInput
                  label={"Link Here"}
                  value={el.link}
                  size={"small"}
                  onChange={(value) => updateSocialProfileValues(ind, value)}
                />
                <div
                  onClick={() => deleteSocialProfileField(ind)}
                  className={style.delete}
                >
                  <IconTrash />
                </div>
              </li>
            );
          })}
          <li>
            <MainButton
              onClick={addSocialProfile}
              label={"Add New Soc Media"}
              size={"xs"}
              customStyle={{
                background: "#4D4D4E",
                color: "#fff",
              }}
            />
          </li>
        </ul>
      </div>
    </div>
  );
};
