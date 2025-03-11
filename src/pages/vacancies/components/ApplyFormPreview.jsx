import style from "@/pages/vacancies/style/ApplyFormPreview.module.scss";
import {
  exportAssembledDocument,
  getAssemblePreview,
  setUpdateVacancyStatus,
} from "../api/VacanciesApi";
import { useEffect, useRef, useState } from "react";
import Loader from "masterComponents/Loader";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useVacanciesStore } from "../store/VacanciesStore";
import { storeActionTypes } from "../constants";
import { createNotification } from "masterComponents/Notification";
import { gerPreviewInternal } from "@/pages/careerChannel/api/CareerApi";
import { __getFormFields } from "../getFormFields";

import FormInput from "masterComponents/FormInput";
import FormMultiSelectDropdown from "masterComponents/FormMultiSelectDropdown";
import Datepicker from "masterComponents/Datepicker";
import FormDropdown from "masterComponents/FormDropdown";
import FileUploader from "masterComponents/FileUploader";
import MainButton from "masterComponents/MainButton";

import {
  getGenders,
  getCountries,
  getCities,
  getDegrees,
  getLanguages,
  getIndustries,
  getMobileCodes,
  getCurrency,
} from "@/pages/candidates/api/CandidatesApi";

export const ApplyFormPreview = ({
  vacancyID,
  assemble = true,
  onFieldChange,
  onFieldApply,
  setRenderedFields,
  ButtonLoading,
  Cities,
  CountryCode,
}) => {
  const {
    exportVacancy,
    setExportVacancy,
    actionTrigger,
    setActionTrigger,
    setController,
    loadPrevStep,
  } = useVacanciesStore((state) => state);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);
  const [general, setGeneral] = useState(null);
  const getData = async () => {
    setLoading(true);
    try {
      await (assemble ? getAssemblePreview : gerPreviewInternal)({
        VacancyID: vacancyID ?? null,
      }).then((response) => {
        setLoading(false);
        const { data } = response;
        if (data) {
          const { General, FormFields, CustomFormFields } = data;
          let merge = [...FormFields, ...CustomFormFields].sort(
            (a, b) => a.FormFieldID - b.FormFieldID
          );

          if (!assemble) {
            merge = __getFormFields(merge);

            if (merge.some((el) => el.Key === "Gender")) {
              getGenders()
                .then((resp) => {
                  merge.find((el) => el.Key === "Gender").data =
                    resp.data.data.map((el) => ({
                      ...el,
                      id: el.ID,
                      label: el.Name,
                    }));
                })
                .finally(() => {
                  setRenderedFields((state) => !state);
                });
            }
            if (merge.some((el) => el.Key === "Country")) {
              getCountries()
                .then((resp) => {
                  merge.find((el) => el.Key === "Country").data =
                    resp.data.Countries.map((el) => ({
                      ...el,
                      id: el.ID,
                      label: el.Name,
                    }));
                })
                .finally(() => {
                  setRenderedFields((state) => !state);
                });
            }
            if (merge.some((el) => el.Key === "City")) {
              getCities()
                .then((resp) => {
                  merge.find((el) => el.Key === "City").data = resp.data.map(
                    (el) => ({
                      ...el,
                      id: el.ID,
                      label: el.Name,
                    })
                  );
                })
                .finally(() => {
                  setRenderedFields((state) => !state);
                });
            }
            if (merge.some((el) => el.Key === "Degree")) {
              getDegrees()
                .then((resp) => {
                  merge.find((el) => el.Key === "Degree").data =
                    resp.data.data.map((el) => ({
                      ...el,
                      id: el.ID,
                      label: el.Name,
                    }));
                })
                .finally(() => {
                  setRenderedFields((state) => !state);
                });
            }
            if (merge.some((el) => el.Key === "LanguagesSpoken")) {
              getLanguages()
                .then((resp) => {
                  merge.find((el) => el.Key === "LanguagesSpoken").data =
                    resp.data.Languages.map((el) => ({
                      ...el,
                      id: el.ID,
                      label: el.Name,
                    }));
                })
                .finally(() => {
                  setRenderedFields((state) => !state);
                });
            }
            if (merge.some((el) => el.Key === "Industry")) {
              getIndustries()
                .then((resp) => {
                  merge.find((el) => el.Key === "Industry").data =
                    resp.data.data.map((el) => ({
                      ...el,
                      id: el.ID,
                      label: el.Name,
                    }));
                })
                .finally(() => {
                  setRenderedFields((state) => !state);
                });
            }
            if (merge.some((el) => el.Key === "MobileNumber")) {
              getMobileCodes()
                .then((resp) => {
                  merge.find((el) => el.Key === "MobileNumber").subField.data =
                    resp.data.Codes.map((el) => ({
                      id: el.CountryID,
                      label: `+(${el.MobileCode})`,
                      countryName: el.CountryName,
                    }));
                })
                .finally(() => {
                  setRenderedFields((state) => !state);
                });
            }
            if (merge.some((el) => el.Key === "SalaryExpectation")) {
              getCurrency()
                .then((resp) => {
                  merge.find(
                    (el) => el.Key === "SalaryExpectation"
                  ).subField.data = resp.data.map((el) => ({
                    id: el.ID,
                    label: el.Name,
                  }));
                })
                .finally(() => {
                  setRenderedFields((state) => !state);
                });
            }
          }

          setFields(merge);
          setGeneral(General);
        }
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const initialCalls = async () => {
    await getData();
  };

  useEffect(() => {
    if (!assemble) {
      let cityField = fields.find((el) => el.Key === "City");
      let countryField = fields.find((el) => el.Key === "Country");

      if (CountryCode) {
        if (countryField || countryField.value === "") {
          countryField.selectedOptionID = countryField.data.find(
            (el) => el.Code === CountryCode
          ).ID;
        }
      }

      if (Cities.length > 0) {
        if (cityField) {
          cityField.data = Cities;
          // cityField.selectedOptionID = null;
          // cityField.value = "";
          // cityField.msgVisible = false;
        }
      }
      setRenderedFields((state) => !state);
    }
  }, [Cities, CountryCode]);

  const sendRequest = async (status) => {
    setActionTrigger(null);

    try {
      await setUpdateVacancyStatus({
        VacancyID: vacancyID ?? null,
        NewStatusID: status ?? null,
      }).then((response) => {
        if (response.Error || response.data.Error) return;
        setActionTrigger(null);
        setController({ actionType: storeActionTypes.CLOSE_MODAL });
        createNotification(
          `Published Successfully`,
          "success",
          3000,
          "top-right",
          2
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  const FieldChange = (value, field) => {
    if (onFieldChange && typeof onFieldChange === "function") {
      onFieldChange(value, field);
    }
    setRenderedFields((state) => !state);
  };

  const FieldApply = () => {
    if (onFieldApply && typeof onFieldApply === "function") {
      onFieldApply(fields);
    }
    setRenderedFields((state) => !state);
  };

  useUpdateEffect(() => {
    if (actionTrigger == storeActionTypes.REQUEST_ACTIONS.LOAD_NEXT_STEP) {
      sendRequest(4);
    }
    if (
      actionTrigger ==
      storeActionTypes.REQUEST_ACTIONS.SEND_REQUEST_VACANCY_AS_DRAFT
    ) {
      sendRequest(3);
    }

    if (actionTrigger == storeActionTypes.REQUEST_ACTIONS.LOAD_PREV_STEP) {
      loadPrevStep();
      setActionTrigger(null);
    }
  }, [actionTrigger]);

  useUpdateEffect(() => {
    if (exportVacancy) {
      exportDocument();
      setExportVacancy(false);
    }
  }, [exportVacancy]);

  const exportDocument = async () => {
    const htmlTemplate = `
    <div style="width: 100%;display: flex; justify-content: space-between; align-items: flex-start; flex-direction: row; gap: 2rem; position: relative;">
      <div style="width:100%">
        <h1 style="color: #333; font-size: 1.25rem; font-weight: 700;">${
          general?.VacancyName
        }</h1>
        <div style="margin-top: 1rem;">${general?.VacancyDescription}</div>
        <table style="width: 100%; margin-top: 2rem; border-collapse: collapse;">
          <tbody>
            ${["Organization", "Salary Type", "Amount", "Working Schedule"]
              .map((label, index) => {
                const values = [
                  general?.Organization,
                  general?.SalaryType,
                  general?.Amount,
                  general?.WorkingSchedule,
                ];
                return `
                <tr style="border-bottom: 0.0625rem solid #888;">
                  <td style="color: #888; font-size: 0.875rem; font-weight: 400; padding: 0.75rem 0.5rem;">${label}</td>
                  <td style="color: #333; font-size: 0.875rem; text-align: right; max-width: 50%; overflow: hidden; text-overflow: ellipsis; word-break: break-word; font-weight: 400; padding: 0.75rem 0.5rem;">
                    ${values[index] || "N/A"}
                  </td>
                </tr>`;
              })
              .join("")}
          </tbody>
        </table>
      </div>
      </div>
    `;

    const downloadBase64 = (base64Data, fileName = "exportedDocument") => {
      const link = document.createElement("a");
      link.href = `data:application/octet-stream;base64,${base64Data}`;
      link.download = `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    try {
      await exportAssembledDocument({
        Html: htmlTemplate,
      }).then((response) => {
        if (response.data) {
          downloadBase64(response.data);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initialCalls();
  }, []);
  return (
    <div className={style.preview}>
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
      <div
        className={style.details}
        style={
          !assemble
            ? {
                height: "calc(100vh - 8rem)",
                maxHeight: "initial",
                overflow: "auto",
              }
            : {}
        }
      >
        <h1>{general?.VacancyName}</h1>
        <div
          className={style.renderDocument}
          dangerouslySetInnerHTML={{ __html: general?.VacancyDescription }}
        />

        <ul className={style.additionalDetails}>
          {general?.Organization ? (
            <li>
              <span>Organization</span>
              <span> {general?.Organization} </span>
            </li>
          ) : (
            ""
          )}
          {general?.SalaryType ? (
            <li>
              <span>Salary Type</span>
              <span> {general?.SalaryType} </span>
            </li>
          ) : (
            ""
          )}

          {general?.WorkingSchedule ? (
            <li>
              <span>Working Schedule</span>
              <span> {general?.WorkingSchedule} </span>
            </li>
          ) : (
            ""
          )}

          {general?.Amount ? (
            <li>
              <span>Amount </span>
              <span> {general?.Amount} </span>
            </li>
          ) : (
            ""
          )}
        </ul>
      </div>
      {assemble ? (
        <>
          {fields && fields.length ? (
            <div className={style.applyFormPreviewWrapper}>
              <h1>Apply Form</h1>
              <ul>
                {fields?.map((el, index) => (
                  <li key={index}>
                    <span>
                      {el.Name}{" "}
                      {el.IsRequired ? (
                        <font style={{ color: "red" }}>*</font>
                      ) : (
                        ""
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            ""
          )}
        </>
      ) : (
        <div
          className={style.applyFormPreviewWrapper}
          style={{
            height: "calc(100vh - 8rem)",
            maxHeight: "initial",
            overflow: "initial",
          }}
        >
          <h1 style={{ marginBottom: "16px" }}>Apply Form</h1>
          <div
            style={{ height: "88%" }}
            className={style.applyFormPreviewContent}
          >
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                overflow: "auto",
                height: "100%",
              }}
            >
              {fields?.map((el, index) => (
                <li key={index}>
                  {el.component === "FormInput" && (
                    <div style={el.subField ? { display: "flex" } : {}}>
                      {el.subField && (
                        <div style={{ flex: "1" }}>
                          <FormDropdown
                            {...el.subField}
                            msg={{
                              type: "error",
                              visible: el.subField.msgVisible,
                            }}
                            selected={(value) =>
                              FieldChange(value, el.subField)
                            }
                            withClear={true}
                            withFilter={true}
                            fixedDropdown={true}
                            selectedOptionID={null}
                          />
                        </div>
                      )}
                      <div style={el.subField ? { flex: "2" } : {}}>
                        <FormInput
                          {...el}
                          msg={{
                            type: "error",
                            visible: el.msgVisible,
                          }}
                          onChange={(value) => FieldChange(value, el)}
                        />
                      </div>
                    </div>
                  )}
                  {el.component === "Datepicker" && (
                    <Datepicker
                      {...el}
                      msg={{
                        type: "error",
                        visible: el.msgVisible,
                      }}
                      allowClear={true}
                      onChange={(value) => FieldChange(value, el)}
                      onClear={() => FieldChange("", el)}
                    />
                  )}
                  {el.component === "FormDropdown" && (
                    <FormDropdown
                      {...el}
                      msg={{
                        type: "error",
                        visible: el.msgVisible,
                      }}
                      selected={(value) => FieldChange(value, el, fields)}
                      withClear={true}
                      withFilter={true}
                      fixedDropdown={true}
                    />
                  )}
                  {el.component === "FormMultiSelectDropdown" && (
                    <FormMultiSelectDropdown
                      {...el}
                      msg={{
                        type: "error",
                        visible: el.msgVisible,
                      }}
                      initialRender={false}
                      change={(value) => FieldChange(value, el)}
                    />
                  )}
                  {el.component === "FileUploader" && (
                    <FileUploader
                      {...el}
                      msg={{
                        type: "error",
                        visible: el.msgVisible,
                      }}
                      multiple={el.Multiple}
                      onChange={(value) => FieldChange(value, el)}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
          <MainButton
            label={"Apply"}
            customStyle={{
              backgroundColor: "#30ACD0",
              borderRadius: "4px",
              width: "100%",
              marginTop: "1rem",
            }}
            loading={ButtonLoading}
            onClick={FieldApply}
          />
        </div>
      )}
    </div>
  );
};
