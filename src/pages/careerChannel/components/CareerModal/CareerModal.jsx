import { ApplyFormPreview } from "@/pages/vacancies/components/ApplyFormPreview";
import style from "./CareerModal.module.scss";
import Popup from "masterComponents/Popup";
import { useRef, useState } from "react";
import { createNotification } from "masterComponents/Notification";
import { getCities, getCountries, setCareerApply } from "../../api/CareerApi";
import { __formatDate } from "@/utils/helpers";

const CareerModal = ({ setOpenPopup, vacancyID, listReload }) => {
  const [RenderedFields, setRenderedFields] = useState(false);

  const [ButtonLoading, setButtonLoading] = useState(false);

  const [CountryCode, setCountryCode] = useState(null);
  const [Cities, setCities] = useState([]);

  const CustomJSON = useRef([]);

  const onFieldChange = (value, field, fields) => {
    field.value = value;

    if (field.isRequired || field.required) {
      if (field.msgVisible) {
        field.msgVisible = false;
      }
    }

    if (field.Key === "Country") {
      if (value) {
        getCities({ CountryCode: value.Code })
          .then((resp) => {
            setCities(
              resp.data.map((el) => ({
                ...el,
                id: el.ID,
                label: el.Name,
              }))
            );
          })
          .finally(() => {
            setRenderedFields((state) => !state);
          });
      }
    }
    if (field.Key === "City") {
      setCountryCode(value?.CountryCode ? value?.CountryCode : null);
    }

    if (field.Key === "CustomJSON") {
      const existingIndex = CustomJSON.current.findIndex(
        (item) => item.VacancyCustomFieldID === field.CustomJSONID
      );

      if (!value || value === "" || value === null || value === undefined) {
        if (existingIndex > -1) {
          CustomJSON.current.splice(existingIndex, 1);
        }
      } else {
        if (existingIndex > -1) {
          CustomJSON.current[existingIndex].FieldValue = value;
        } else {
          CustomJSON.current.push({
            VacancyCustomFieldID: field.CustomJSONID,
            FieldValue: value,
          });
        }
      }
    }
  };

  const onFieldApply = (fields) => {
    fields.forEach((field) => {
      let checkFields =
        field.value === "" ||
        field.value === null ||
        !field.value ||
        field.value.length === 0;

      if (field.IsRequired || field.required) {
        field.msgVisible = checkFields;

        if (field.subField) {
          field.subField.msgVisible = checkFields;
        }

        if (checkFields && field.component === "FileUploader") {
          createNotification(
            "Please upload a file",
            "error",
            2000,
            "bottom-center",
            2
          );
        }
      }
    });
    const allMsgVisibleFalse = fields.every((item) => !item.msgVisible);

    if (!allMsgVisibleFalse) return;

    let obj = {
      VacancyID: vacancyID,
      FirstName: fields.find((field) => field.Key === "Name")?.value ?? null,
      LastName: fields.find((field) => field.Key === "Surname")?.value ?? null,
      PersonalNumber:
        fields.find((field) => field.Key === "PersonalNumber")?.value ?? null,
      MobileCountryID:
        fields.find((field) => field.Key === "MobileNumber")?.subField?.value
          ?.id ?? null,
      MobileNumber:
        fields.find((field) => field.Key === "MobileNumber")?.value ?? null,
      Email: fields.find((field) => field.Key === "Email")?.value ?? null,
      Address: fields.find((field) => field.Key === "Address")?.value ?? null,
      GenderID:
        fields.find((field) => field.Key === "Gender")?.value?.id ?? null,
      BirthDate:
        fields.find((field) => field.Key === "BirthDate")?.value ?? null,
      CountryID:
        fields.find((field) => field.Key === "Country")?.value?.id ?? null,
      CityID: fields.find((field) => field.Key === "City")?.value?.id ?? null,
      CandidatesNote:
        fields.find((field) => field.Key === "CandidatesNote")?.value ?? null,
      SalaryExpectationCurrencyID:
        fields.find((field) => field.Key === "SalaryExpectation")?.subField
          ?.value?.id ?? null,
      SalaryExpectation:
        fields.find((field) => field.Key === "SalaryExpectation")?.value ??
        null,
      LinkedInProfile:
        fields.find((field) => field.Key === "LinkedInProfile")?.value ?? null,
      PortfolioURL:
        fields.find((field) => field.Key === "PortfolioURL")?.value ?? null,
      ResumeJson:
        fields.find((field) => field.Key === "UploadResume")?.value.length > 0
          ? JSON.stringify({
              FileName: fields.find((field) => field.Key === "UploadResume")
                ?.value[0].fileName,
              FileType: fields.find((field) => field.Key === "UploadResume")
                ?.value[0].type,
              FileData: fields.find((field) => field.Key === "UploadResume")
                ?.value[0].base64,
              FileSize: fields.find((field) => field.Key === "UploadResume")
                ?.value[0].size,
            })
          : null,
      CurrentJobTitle:
        fields.find((field) => field.Key === "CurrentJobTitle")?.value ?? null,
      CurrentEmployer:
        fields.find((field) => field.Key === "CurrentEmployer")?.value ?? null,
      IndustryID:
        fields.find((field) => field.Key === "Industry")?.value?.id ?? null,
      YearsOfExperience:
        fields.find((field) => field.Key === "YearsOfExperience")?.value ??
        null,
      FieldOfStudy:
        fields.find((field) => field.Key === "FieldOfStudy")?.value ?? null,
      DegreeID:
        fields.find((field) => field.Key === "Degree")?.value?.id ?? null,
      InstitutionName:
        fields.find((field) => field.Key === "InstitutionName")?.value ?? null,
      GraduationYear:
        fields.find((field) => field.Key === "GraduationYear")?.value ?? null,
      LanguagesJson:
        fields.find((field) => field.Key === "LanguagesSpoken")?.value.length >
        0
          ? JSON.stringify(
              fields
                .find((field) => field.Key === "LanguagesSpoken")
                ?.value.map((el) => el.id)
            )
          : null,
      RecommenderName:
        fields.find((field) => field.Key === "RecommenderNameSurname")?.value ??
        null,
      RecommenderLinkedinUrl:
        fields.find((field) => field.Key === "RecommenderLinkedInProfile")
          ?.value ?? null,

      CustomFieldsJson:
        CustomJSON.current.length > 0
          ? JSON.stringify(CustomJSON.current)
          : null,
    };

    let params = Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== null && value !== "")
    );

    if (allMsgVisibleFalse) {
      setButtonLoading(true);
      setCareerApply(params).then((resp) => {
        setButtonLoading(false);
        if (!resp.data.error) {
          setOpenPopup(false);
          listReload();
          createNotification(
            "Application submitted successfully",
            "success",
            2000,
            "bottom-center",
            2
          );
        }
      });
    }
  };

  const CloseModal = () => {
    setOpenPopup(false);
    setCountryCode(null);
    setCities([]);
  };

  return (
    <Popup
      visible={true}
      options={{ title: "Career Modal", mode: "drawer" }}
      onClickOutside={CloseModal}
      size={"large"}
    >
      <div className={style.CareerModalContainer}>
        <ApplyFormPreview
          assemble={false}
          vacancyID={vacancyID}
          onFieldChange={onFieldChange}
          onFieldApply={onFieldApply}
          setRenderedFields={setRenderedFields}
          ButtonLoading={ButtonLoading}
          Cities={Cities}
          CountryCode={CountryCode}
        />
      </div>
    </Popup>
  );
};

export default CareerModal;
