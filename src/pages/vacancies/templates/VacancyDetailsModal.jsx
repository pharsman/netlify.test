import Popup from "masterComponents/Popup";
import { useEffect, useState } from "react";
import { getVacancyDetails } from "../api/VacanciesApi";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useVacanciesStore } from "../store/VacanciesStore";
import MainButton from "masterComponents/MainButton";
import style from "@/pages/vacancies/style/VacancyDetailsModal.module.scss";
import { __formatDate } from "@/utils/helpers";
import Loader from "masterComponents/Loader";

export const VacancyDetailsModal = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { openVacancyDetails, setOpenVacancyDetails } = useVacanciesStore(
    (state) => state
  );
  const getVacancyDetailsData = async () => {
    if (!openVacancyDetails) return;
    setLoading(true);
    await getVacancyDetails({
      VacancyID: openVacancyDetails && openVacancyDetails,
    }).then((response) => {
      setLoading(false);
      if (response.data) setData(response.data);
      console.log("details_response", response.data);
    });
  };

  useUpdateEffect(() => {
    getVacancyDetailsData();
  }, [openVacancyDetails]);

  return (
    <Popup
      visible={!!openVacancyDetails}
      size={"small"}
      onClickOutside={() => setOpenVacancyDetails(null)}
      options={{
        title: "",
        mode: "default",
      }}
    >
      <div className={style.detailsContentWrapper}>
        {loading ? (
          <div style={{ display: "grid", placeItems: "center", width: "100%" }}>
            <Loader loading={true} />
          </div>
        ) : (
          <div className={style.detailsContent}>
            <h1>
              {data?.JobName ?? ""}{" "}
              {data?.FreePositionsCount ? ` (${data?.FreePositionsCount})` : ""}
              {data?.IsReOpened ? <span>Re_opened</span> : ""}
              {data?.IsShared ? <span>Shared</span> : ""}
            </h1>
            <p style={{ marginTop: "6px" }}>{data?.OrgUnitName}</p>
            <ul className={style.detailsList}>
              <li>
                <span>Office</span>
                <span> {data?.OfficeName} </span>
              </li>

              <li>
                <span>Head Of Unit</span>
                <span>{data?.VacancyHeads}</span>
              </li>

              <li>
                <span>Work Type</span>
                <span>{data?.WorkingTypes}</span>
              </li>

              <li>
                <span>Working Schedule Details</span>
                <span>{data?.WorkingDetails}</span>
              </li>

              <li>
                <span>Salary</span>
                <span>
                  {data?.SalaryMinAmount ?? ""} {data?.SalaryMaxAmount ?? ""}
                  {" " + data?.SalaryCurrency ?? ""}
                  {data?.SalaryType ? ` (${data?.SalaryType})` : ""}
                </span>
              </li>

              <li>
                <span>Additional Bonuses</span>
                <span>{data?.HaveBonus ? "Yes" : "No"}</span>
              </li>

              <li>
                <span>Job Start Date</span>
                <span>
                  {data?.JobStartDate
                    ? __formatDate(data?.JobStartDate, "MM.DD.YYYY")
                    : ""}
                </span>
              </li>
            </ul>
            <div className={style.comment}>
              <span>Comment</span>
              <p>{data?.Comments[0] ? data?.Comments[0].Content : ""}</p>
            </div>
          </div>
        )}

        <div className={style.action}>
          <MainButton
            onClick={() => setOpenVacancyDetails(null)}
            label={"Close"}
            type={"border"}
            customStyle={{
              borderColor: "#D1D5D6",
              color: "#141719",
            }}
            size={"xs"}
          />
        </div>
      </div>
    </Popup>
  );
};
