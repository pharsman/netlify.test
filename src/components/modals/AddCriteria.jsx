import { useEffect, useState } from "react";

import FormInput from "masterComponents/FormInput";
import CheckBox from "masterComponents/CheckBox";
import Tooltip from "masterComponents/Tooltip";
import Button from "../Button";

import { useStore } from "@/store/zuStore.js";
import { createCriteria, getScoreIndicators, updateCriteria } from "@/api/api";
import IconMinusRed from "@/assets/icons/other/IconTrash";

import { IconInfoCircle } from "@/assets/icons/other/IconInfoCircle";

import styles from "./modals.module.scss";

function AddCriteria() {
  const [formData, setFormData] = useState({
    Name: "",
    IsCommon: true,
    ScoreIndicatorsJson: [
      { Description: "description", MinScore: null, MaxScore: null },
    ],
  });

  const [dummyState, setDummyState] = useState(false);
  const setModalStatus = useStore((state) => state.setModalStatus);
  const modalStatus = useStore((state) => state.modalStatus);
  const runReloadCriteria = useStore(
    (state) => () => state.toggleReload("reloadCriteria")
  );

  const addCriteria = async () => {
    // Validate that all ScoreIndicators are filled
    const allIndicatorsValid = formData.ScoreIndicatorsJson.every(
      (indicator) =>
        indicator.Description.trim() !== "" &&
        indicator.MinScore !== null &&
        indicator.MaxScore !== null &&
        indicator.MinScore !== "" &&
        indicator.MaxScore !== ""
    );

    if (!allIndicatorsValid) {
      alert(
        "Please fill in all fields (Description, Min Score, and Max Score) for each indicator."
      );
      return;
    }

    let res;
    if (modalStatus.data) {
      res = await updateCriteria({
        ...formData,
        ScoreIndicatorsJson: JSON.stringify(formData.ScoreIndicatorsJson),
      });
    } else {
      res = await createCriteria({
        ...formData,
        ScoreIndicatorsJson: JSON.stringify(formData.ScoreIndicatorsJson),
      });
    }

    if (res.data) {
      setModalStatus(false, null);
      runReloadCriteria();
    }
  };

  const percentageCalc = (ind) => {
    const totalScore = formData.ScoreIndicatorsJson.reduce(
      (accumulator, currentValue) => {
        const range = currentValue.MaxScore - currentValue.MinScore;
        return accumulator + range;
      },
      0
    );

    return (
      ((formData.ScoreIndicatorsJson[ind].MaxScore -
        formData.ScoreIndicatorsJson[ind].MinScore) /
        totalScore) *
      100
    ).toFixed(1);
  };

  const getColor = (val) => {
    const normalizedVal = Math.max(0, Math.min(100, val));
    const hue = (normalizedVal / 100) * 120;
    return `hsl(${hue}, 100%, 70%)`;
  };

  const scoreIndicatorsGet = async () => {
    const resp = await getScoreIndicators(modalStatus.data.ID);
    setFormData((prevData) => ({
      ...prevData,
      ScoreIndicatorsJson: resp.data,
    }));
  };

  useEffect(() => {
    if (modalStatus.data) {
      scoreIndicatorsGet();
      setFormData((prevData) => ({
        ...prevData,
        Name: modalStatus.data.Name,
        IsCommon: modalStatus.data.IsCommon,
        ID: modalStatus.data.ID,
      }));
    }
  }, []);

  // Add this function to check if form is valid
  const isFormValid = () => {
    const allIndicatorsValid = formData.ScoreIndicatorsJson.every(
      (indicator) =>
        indicator.Description.trim() !== "" &&
        indicator.MinScore !== null &&
        indicator.MaxScore !== null &&
        indicator.MinScore !== "" &&
        indicator.MaxScore !== ""
    );

    return formData.Name.trim() && allIndicatorsValid;
  };

  return (
    <div className={styles.drawer}>
      <div className={styles.sectionContainer} style={{ marginBottom: "0px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: "4", marginRight: "16px" }}>
            <FormInput
              isRequired={true}
              label={"Criteria Title"}
              disabled={false}
              onChange={(value) => {
                setFormData({ ...formData, Name: value });
              }}
              value={formData.Name}
            />
          </div>
          <CheckBox
            disabled={false}
            checked={formData.IsCommon}
            isRequired={false}
            bgColor={"#30ACD0"}
            multipleChecked={false}
            change={(currentState) =>
              setFormData({ ...formData, IsCommon: currentState })
            }
          />
          <span
            style={{ marginLeft: "12px", marginRight: "8px", fontSize: "14px" }}
          >
            Is Common
          </span>
          <Tooltip
            label={
              "Is common criteria for all type job vacancy and distributes automatically"
            }
            placement={"left"}
          >
            <div>
              <IconInfoCircle color={"var(--color-icon-softer-default)"} />
            </div>
          </Tooltip>
        </div>
      </div>
      {formData.ScoreIndicatorsJson.length > 1 ? (
        formData.ScoreIndicatorsJson.map((criteria, ind) => (
          <div
            key={ind}
            style={{
              borderLeft: "1px solid var(--color-stroke-soft-initial)",
              paddingTop: "20px",
              marginLeft: "16px",
            }}
          >
            <p
              style={{
                marginLeft: "16px",
                color: "var(--color-text-soft-default)",
                fontSize: "12px",
                fontWeight: "700",
                lineHeight: "26px",
              }}
            >
              #{ind + 1} /{" "}
              <span
                style={{
                  backgroundColor: `${getColor(percentageCalc(ind))}`,
                  fontWeight: "700",
                  padding: "4px 6px",
                  borderRadius: "10px",
                  color: "#4D4D4E",
                }}
              >
                {percentageCalc(ind) !== "NaN" ? percentageCalc(ind) : "TBD"}%
              </span>
              <span
                style={{ cursor: "pointer", marginTop: "6px" }}
                onClick={() => {
                  setFormData((prevState) => {
                    const updatedIndicators = [
                      ...prevState.ScoreIndicatorsJson,
                    ];
                    updatedIndicators.splice(ind, 1); // Remove the indicator at the current index
                    return {
                      ...prevState,
                      ScoreIndicatorsJson: updatedIndicators,
                    };
                  });
                }}
              >
                <IconMinusRed color={"white"} />
              </span>
            </p>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingBottom: "0px",
                }}
              >
                <div className={styles.shortLine}></div>
                <textarea
                  className={styles.criteriaArea}
                  name="text"
                  placeholder="* Type description..."
                  rows={3}
                  cols={72}
                  value={formData.ScoreIndicatorsJson[ind].Description}
                  onChange={(e) => {
                    (formData.ScoreIndicatorsJson[ind].Description =
                      e.target.value),
                      setDummyState((prevState) => !prevState);
                  }}
                ></textarea>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "35px",
                  paddingTop: "16px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "var(--color-stroke-soft-initial)",
                    height: "38px",
                    width: "1px",
                    alignSelf: "start",
                    marginTop: "-16px",
                  }}
                ></div>
                <div className={styles.shortLine}></div>
                <div style={{ flex: 1 }}>
                  <FormInput
                    isRequired={true}
                    label={"Min Score"}
                    disabled={false}
                    inputType="number"
                    hideArrows={true}
                    onChange={(value) => {
                      (formData.ScoreIndicatorsJson[ind].MinScore = value),
                        setDummyState((prevState) => !prevState);
                    }}
                    value={formData.ScoreIndicatorsJson[ind].MinScore}
                  />
                </div>
                <div className={styles.shortLine}></div>
                <div style={{ flex: 1 }}>
                  <FormInput
                    isRequired={true}
                    label={"Max Score"}
                    disabled={false}
                    inputType="number"
                    hideArrows={true}
                    onChange={(value) => {
                      (formData.ScoreIndicatorsJson[ind].MaxScore = value),
                        setDummyState((prevState) => !prevState);
                    }}
                    value={formData.ScoreIndicatorsJson[ind].MaxScore}
                  />
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div style={{ display: "flex", marginTop: "16px", columnGap: "16px" }}>
          <div style={{ flex: 1 }}>
            <FormInput
              isRequired={true}
              label={"Min Score"}
              disabled={false}
              inputType="number"
              hideArrows={true}
              onChange={(value) => {
                (formData.ScoreIndicatorsJson[0].MinScore = value),
                  setDummyState((prevState) => !prevState);
              }}
              value={formData.ScoreIndicatorsJson[0].MinScore}
            />
          </div>
          <div style={{ flex: 1 }}>
            <FormInput
              isRequired={true}
              label={"Max Score"}
              disabled={false}
              inputType="number"
              hideArrows={true}
              onChange={(value) => {
                (formData.ScoreIndicatorsJson[0].MaxScore = value),
                  setDummyState((prevState) => !prevState);
              }}
              value={formData.ScoreIndicatorsJson[0].MaxScore}
            />
          </div>
        </div>
      )}
      <div>
        <Button
          onClick={() =>
            setFormData((prevState) => ({
              ...prevState,
              ScoreIndicatorsJson: [
                ...prevState.ScoreIndicatorsJson,
                { Description: "", MinScore: null, MaxScore: null },
              ],
            }))
          }
          label={"Add Indicator Option +"}
          customStyle={{
            marginTop: "16px",
            backgroundColor: "#4D4D4E",
            border: "1px solid #4D4D4E",
            color: "var(--color-text-strong-inverted)",
          }}
        ></Button>
      </div>
      <div>
        <Button
          label={"Close"}
          customStyle={{
            marginRight: "16px",
            backgroundColor: "transparent",
            border: "1px solid var(--color-stroke-strong-initial)",
            color: "var(--color-text-strong-default)",
          }}
          onClick={() => setModalStatus(false, null)}
        />
        <Button
          label={"Save"}
          onClick={() => addCriteria()}
          disabled={!isFormValid()}
        />
      </div>
    </div>
  );
}

export default AddCriteria;
