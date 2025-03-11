import { useState, useEffect } from "react";
import FormMultiSelectDropdown from "masterComponents/FormMultiSelectDropdown";
import Popup from "masterComponents/Popup";
import MainButton from "masterComponents/MainButton";
import Datepicker from "masterComponents/Datepicker";
import {
  getVacancyJobs,
  exportCandidateVacancies,
  getUnits,
} from "../api/CandidatesApi";
import Loader from "masterComponents/Loader";
import { useLocation } from "react-router-dom";

export const ExportFile = ({ isOpen, onClose }) => {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);
  const [vacancies, setVacancies] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedVacancies, setSelectedVacancies] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [applyPeriod, setApplyPeriod] = useState({
    from: null,
    to: null,
  });

  const getVacanciesData = async () => {
    try {
      await getVacancyJobs({
        PageSize: 1000000,
      }).then((response) => {
        const jobs = response?.data ?? null;
        console.log(jobs);
        if (!jobs) return;
        setVacancies(
          jobs.map((e) => ({
            id: e.VacancyID,
            label: `${e.VacancyName} - ${e.Status}`,
          }))
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getUnitsData = async () => {
    try {
      await getUnits({
        PageSize: 1000000,
      }).then((response) => {
        const units = response?.data ?? null;
        if (!units) return;
        setUnits(
          units.map((e) => ({
            id: e.ID,
            label: e.Name,
          }))
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  const exportFile = async () => {
    const isArchived = pathname.toLowerCase().includes("candidatesdatabase");
    const dataSet = {
      IsActive: !isArchived,
      FromDate: applyPeriod?.from || null,
      ToDate: applyPeriod?.to || null,
      VacanciesJson: selectedVacancies.length
        ? JSON.stringify(selectedVacancies.map((v) => v.id))
        : null,
      OrgUnitsJson: selectedUnits.length
        ? JSON.stringify(selectedUnits.map((u) => u.id))
        : null,
    };
    try {
      setLoading(true);
      await exportCandidateVacancies(dataSet).then((response) => {
        const base64Data = response?.data ?? null;
        if (!base64Data) return;
        const binaryData = atob(base64Data);
        const byteArray = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          byteArray[i] = binaryData.charCodeAt(i);
        }
        const blob = new Blob([byteArray], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "candidates.xlsx";
        document.body.appendChild(a);
        a.click();
        onClose();
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const initialCalls = async () => {
    try {
      setLoading(true);
      await Promise.all([getVacanciesData(), getUnitsData()]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      initialCalls();
    }
  }, [isOpen]);

  return (
    <Popup
      visible={isOpen}
      options={{ title: "Export File", mode: "normal" }}
      size={"small"}
    >
      {loading && (
        <div style={{ display: "grid", placeItems: "center", width: "100%" }}>
          <Loader loading={loading} />
        </div>
      )}
      <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
        <div>
          <Datepicker
            placeholder="Apply Period"
            valueFormat={"YYYY-MM-DD"}
            mode={"range"}
            onChange={(value) => {
              setApplyPeriod({
                from: value?.from ? value?.from : null,
                to: value?.to ? value?.to : null,
              });
            }}
          />
        </div>
        <div>
          <FormMultiSelectDropdown
            label={"Job Position"}
            fixedDropdown={true}
            data={vacancies}
            withApply={false}
            change={(arr) => setSelectedVacancies(arr)}
          />
        </div>
        <div>
          <FormMultiSelectDropdown
            label={"Unit"}
            fixedDropdown={true}
            data={units}
            withApply={false}
            change={(arr) => setSelectedUnits(arr)}
          />
        </div>
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
          customStyle={{ color: "#141719", borderColor: "#D1D5D6" }}
          onClick={onClose}
        />
        <MainButton
          label={"Download"}
          onClick={exportFile}
          size={"small"}
          loading={loading}
          customStyle={{
            background: "#30ACD0",
            border: "0.0625rem solid #30ACD0",
            color: "#fff",
          }}
        />
      </div>
    </Popup>
  );
};
