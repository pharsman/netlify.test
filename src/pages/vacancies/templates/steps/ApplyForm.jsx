import style from "@/pages/vacancies/style/steps/ApplyForm.module.scss";
import {
  getAassembleFormKeys,
  getAssembleFormFields,
  setAssembleFormFields,
} from "../../api/VacanciesApi";
import { useEffect, useState } from "react";
import IconExpandArrowColored from "@/assets/icons/other/IconExpandArrowColored";
import IconExpandArrow from "@/assets/icons/other/IconExpandArrow";
import Radio from "masterComponents/Radio";
import Loader from "masterComponents/Loader";
import FormInput from "masterComponents/FormInput";
import IconPlus from "@/assets/icons/other/IconPlus";
import IconMinusRed from "@/assets/icons/other/IconMinusRed";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useVacanciesStore } from "../../store/VacanciesStore";
import { storeActionTypes } from "../../constants";

export const ApplyForm = ({ vacancyID }) => {
  const [keysData, setKeysData] = useState([]);
  const [loading, setLoading] = useState(false);
  const requiredKeys = [
    "Name",
    "Surname",
    "PersonalNumber",
    "MobileNumber",
    "Email",
  ];
  const { actionTrigger, setActionTrigger, loadNextStep, loadPrevStep } =
    useVacanciesStore((state) => state);

  const getFormDetails = async () => {
    setLoading(true);
    try {
      await getAssembleFormFields({
        VacancyID: vacancyID ?? null,
      }).then((response) => {
        setLoading(false);
        const { data } = response;
        if (data) {
          const { FormFields, CustomFormFields } = data;
          console.log(data);

          setKeysData((prev) => {
            const newKeysData = [...prev];
            FormFields.forEach((e) => {
              let parent =
                newKeysData.find((key) => key.ID == e.FormFieldGroupID) || null;
              let nodeField =
                parent.FormFields.find((field) => field.ID == e.FormFieldID) ||
                null;
              let customField = newKeysData.find(
                (field) => field.Key == "AddParameter"
              );
              if (nodeField)
                nodeField["value"] = e.IsHidden
                  ? "HideOnWeb"
                  : e.IsRequired
                  ? "Required"
                  : "Optional";

              customField.FormFields = CustomFormFields?.map((field) => ({
                ID: field.ID,
                Name: field?.FieldName,
                Key: field?.FieldName,
              }));
            });
            return newKeysData;
          });
        }
      });
    } catch (error) {
      setLoading(false);
    }
  };

  const getKeysData = async () => {
    setLoading(true);
    try {
      await getAassembleFormKeys().then((response) => {
        setLoading(false);
        const { data } = response;
        const customField = [
          {
            ID: crypto.randomUUID(),
            Name: "Add Parameter",
            Key: "AddParameter",
            FormFields: [],
          },
        ];
        const dataMap = data.map((el) => {
          return {
            ...el,
            expanded: false,
            FormFields: el.FormFields.map((f) => ({
              ...f,
              value: requiredKeys.includes(f.ID) ? "Required" : "Optional",
            })),
          };
        });
        if (data) setKeysData([...dataMap, ...customField]);
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const setNodeExpand = (id) => {
    setKeysData((prev) => {
      const newKeysData = [...prev];
      const node = newKeysData.find((el) => el.ID == id);
      node["expanded"] = !node?.expanded ?? false;
      return newKeysData;
    });
  };

  const setKeyValue = (parentID, id, value) => {
    setKeysData((prev) => {
      const newKeysData = [...prev];
      let parent = newKeysData.find((el) => el.ID == parentID) ?? [];
      let currentKey = parent?.FormFields.find((el) => el.ID == id);
      currentKey.value = value;
      return newKeysData;
    });
  };

  const setCustomFieldValue = (id, value) => {
    setKeysData((prev) => {
      const newKeysData = [...prev];
      let parent = newKeysData.find((el) => el.Key == "AddParameter") ?? [];
      let currentKey = parent?.FormFields.find((el) => el.ID == id);
      currentKey.Name = value;
      currentKey.Key = value;
      return newKeysData;
    });
  };

  const deleteCustomField = (id) => {
    setKeysData((prev) => {
      const newKeysData = [...prev];
      let parent = newKeysData.find((el) => el.Key == "AddParameter") ?? null;
      parent.FormFields = parent?.FormFields.filter((el) => el.ID !== id);
      return newKeysData;
    });
  };

  const addCustomField = () => {
    setKeysData((prev) => {
      const newKeysData = [...prev];
      let parent = newKeysData.find((el) => el.Key == "AddParameter") ?? null;
      parent.FormFields.push({
        Name: "",
        Key: "",
        ID: crypto.randomUUID(),
      });
      return newKeysData;
    });
  };

  const sendRequest = async () => {
    if (!vacancyID) return;
    const flatData = keysData
      .filter((f) => f.Key !== "AddParameter")
      .flatMap((e) => e.FormFields);

    const customFields =
      keysData.find((f) => f.Key === "AddParameter")?.FormFields || [];

    const FormFieldsJson = JSON.stringify(
      flatData.map((el) => ({
        FormFieldID: el.ID,
        IsRequired: el.value == "Required" || requiredKeys.includes(el.Key),
        IsHidden: el.value == "HideOnWeb",
      }))
    );

    const CustomFormFieldsJson = JSON.stringify(
      customFields.map((e) => ({
        FieldName: e.Name,
      }))
    );

    const dataSet = {
      VacancyID: vacancyID,
      FormFieldsJson,
      CustomFormFieldsJson,
    };
    try {
      setLoading(true);
      await setAssembleFormFields(dataSet).then(() => {
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
    }
  };

  const initialCalls = async () => {
    await getKeysData();
  };

  useEffect(() => {
    initialCalls().then(() => getFormDetails());
  }, []);

  useUpdateEffect(() => {
    if (
      actionTrigger &&
      actionTrigger == storeActionTypes.REQUEST_ACTIONS.LOAD_NEXT_STEP
    ) {
      sendRequest().then(() => loadNextStep());
      setActionTrigger(null);
    } else if (
      actionTrigger == storeActionTypes.REQUEST_ACTIONS.LOAD_PREV_STEP
    ) {
      loadPrevStep();
      setActionTrigger(null);
    }
  }, [actionTrigger]);

  return (
    <div className={style.applyFormWrapper}>
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
        {keysData?.map((category, index) => {
          return (
            <li key={index} className={category.expanded ? style.expanded : ""}>
              <div className={style.topContent}>
                <h2>{category?.Name}</h2>
                <div
                  className={style.expandButtton}
                  onClick={() => setNodeExpand(category.ID)}
                >
                  {category?.expanded ? (
                    <IconExpandArrowColored />
                  ) : (
                    <IconExpandArrow />
                  )}
                </div>
              </div>
              {category.expanded && category.Key == "AddParameter" ? (
                <div className={style.innerContent}>
                  <div className={style.customFieldAdd}>
                    {category.FormFields.map((customField, i) => {
                      return (
                        <div key={i} className={style.singleCustomField}>
                          <FormInput
                            label={"Name Field"}
                            value={customField.Name}
                            onChange={(value) =>
                              setCustomFieldValue(customField.ID, value)
                            }
                          />
                          <div
                            className={style.deleteCustomField}
                            onClick={() => deleteCustomField(customField.ID)}
                          >
                            <IconMinusRed />
                          </div>
                        </div>
                      );
                    })}
                    <div
                      className={style.addFieldButton}
                      onClick={addCustomField}
                    >
                      <span>Add Text Type Parameters</span>
                      <IconPlus />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {category.expanded && category.Key !== "AddParameter" ? (
                <div className={style.innerContent}>
                  {category?.FormFields?.map((field, ind) => {
                    return (
                      <div className={style.singleField} key={ind}>
                        <div className={style.leftSide}>
                          <h3>{field?.Name}</h3>
                        </div>
                        <div className={style.rightSide}>
                          {requiredKeys.includes(field.Key) ? (
                            <div className={style.option}>
                              <Radio checked={true} disabled={true} />
                              <span>Required</span>
                            </div>
                          ) : (
                            <>
                              <div className={style.option}>
                                <Radio
                                  checked={field.value == "Required"}
                                  change={() =>
                                    setKeyValue(
                                      category.ID,
                                      field.ID,
                                      "Required"
                                    )
                                  }
                                />
                                <span>Required</span>
                              </div>
                              <div className={style.option}>
                                <Radio
                                  checked={field.value == "Optional"}
                                  change={() =>
                                    setKeyValue(
                                      category.ID,
                                      field.ID,
                                      "Optional"
                                    )
                                  }
                                />
                                <span>Optional</span>
                              </div>
                              <div className={style.option}>
                                <Radio
                                  checked={field.value == "HideOnWeb"}
                                  change={() =>
                                    setKeyValue(
                                      category.ID,
                                      field.ID,
                                      "HideOnWeb"
                                    )
                                  }
                                />
                                <span>Hide On Web</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                ""
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
