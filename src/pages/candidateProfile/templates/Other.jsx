import style from "../style/Other.module.scss";
import { getCandidateCustomFields } from "../api/CandidateProfileApi";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Skeleton from "masterComponents/Skeleton";
import IconEditProfile from "@/assets/icons/other/profile/IconEditProfile";
import FormInput from "masterComponents/FormInput";
import IconAccept from "@/assets/icons/other/IconAccept";
import IconDecline from "@/assets/icons/other/IconDecline";
import { updateCustomField } from "../api/CandidateProfileApi";

export const Other = () => {
  const { candidateID, vacancyID } = useParams();
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fieldEditVisible, setFieldEditVisible] = useState(null);
  const [fieldValue, setFieldValue] = useState("");

  const getTabData = async () => {
    try {
      setLoading(true);
      await getCandidateCustomFields({
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
      }).then((response) => {
        if (!response || response.Error || response.data.Error) return;
        setCustomFields(response?.data);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateCustomFieldValue = async (fieldID, value) => {
    try {
      await updateCustomField({
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
        FieldID: fieldID,
        Value: value,
      }).then((response) => {
        if (!response || response.Error || response.data.Error) return;
        setFieldEditVisible(null);
        setFieldValue(null);
        getTabData();
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTabData();
  }, []);

  return (
    <div className={style.otherTab}>
      <div className={style.otherTabHeader}>
        <h2>Candidate Supplemental Details</h2>
      </div>
      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : (
        <div className={style.otherTabContent}>
          {customFields.length > 0 ? (
            customFields.map((field, index) => (
              <div className={style.fieldContainer} key={index}>
                <div className={style.fieldName}>
                  <span>{field.FieldName}</span>
                  <div
                    className={style.editIcon}
                    onClick={() => {
                      setFieldEditVisible(field.FieldID);
                      setFieldValue(field.FieldValue);
                    }}
                  >
                    <IconEditProfile />
                  </div>
                </div>
                <div className={style.fieldValue}>
                  {fieldEditVisible === field.FieldID ? (
                    <div className={style.editField}>
                      <FormInput
                        label={field.FieldName}
                        value={fieldValue}
                        onChange={(value) => {
                          setFieldValue(value);
                        }}
                        size={"small"}
                      />
                      <div
                        className={style.acceptIcon}
                        onClick={() =>
                          updateCustomFieldValue(field.FieldID, fieldValue)
                        }
                      >
                        <IconAccept />
                      </div>
                      <div
                        className={style.declineIcon}
                        onClick={() => {
                          setFieldEditVisible(null);
                          setFieldValue(null);
                        }}
                      >
                        <IconDecline />
                      </div>
                    </div>
                  ) : (
                    <span>{field.FieldValue}</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className={style.noData}>No data</div>
          )}
        </div>
      )}
    </div>
  );
};
