import Search from "masterComponents/Search";
import Button from "@/components/Button.jsx";
import MainButton from "masterComponents/MainButton";
import style from "@/pages/vacancies/style/Vacancies.module.scss";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Popup from "masterComponents/Popup";
import { useVacanciesStore } from "./store/VacanciesStore";
import { storeActionTypes } from "./constants";
import ProgressIndicator from "masterComponents/ProgressIndicator";
import { RequestVacancy } from "./templates/RequestVacancy";
import { VacancyDetailsModal } from "./templates/VacancyDetailsModal";
import { VacancyComments } from "./templates/VacancyComments";
import { HrTabs } from "./components/HrTabs";
import { AssignRecruiter } from "./templates/AssignRecruiter";
import IconExport from "@/assets/icons/other/IconExport";
import { ConfirmStatusChange } from "./components/ConfirmStatusChange";
import { useParams } from "react-router-dom";
import {
  getExportCurrentListForHr,
  getExportCurrentListForRecruiter,
  getExportFinishedListForHr,
  getExportFinishedListForRecruiter,
  getExportListForManager,
  getExportRequestedListForHr,
  getSummary,
} from "./api/VacanciesApi";
import useUpdateEffect from "@/hooks/useUpdateEffect";

export const Vacancies = () => {
  const {
    controller,
    setController,
    vacancyFormSteps,
    confirmStatusChangeTo,
    setSummary,
    setCurrentStep,
    setActionTrigger,
    searchValue,
    setSearchValue,
    setExportVacancy,
    updateMultipleVacancySteps,
  } = useVacanciesStore((state) => state);
  const { pathname } = location;
  const { mode } = useParams();
  const isAdmin = mode ? mode == storeActionTypes.USER_MODES.HR : false;
  const navigate = useNavigate();
  const [exportLoading, setExportLoading] = useState(false);
  const initialModalOptions = {
    visible: false,
    size: "medium",
    options: {
      title: "Assemble Vacancy",
      mode: "drawer",
    },
  };
  const [modalOptions, setModalOptions] = useState({});
  const [activeTabPath, setactiveTabPath] = useState();
  const tabs = [
    {
      path: "vacanciesBoard",
      icon: (
        <svg
          width="1rem"
          height="1rem"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 2.73301V13.2663C9 14.2663 9.42667 14.6663 10.4867 14.6663H13.18C14.24 14.6663 14.6667 14.2663 14.6667 13.2663V2.73301C14.6667 1.73301 14.24 1.33301 13.18 1.33301H10.4867C9.42667 1.33301 9 1.73301 9 2.73301Z"
            fill="#AAB0B2"
          />
          <path
            d="M1.33325 2.73301V13.2663C1.33325 14.2663 1.75992 14.6663 2.81992 14.6663H5.51325C6.57325 14.6663 6.99992 14.2663 6.99992 13.2663V2.73301C6.99992 1.73301 6.57325 1.33301 5.51325 1.33301H2.81992C1.75992 1.33301 1.33325 1.73301 1.33325 2.73301Z"
            fill="#AAB0B2"
          />
        </svg>
      ),
    },
    {
      path: "currentVacancies",
      icon: (
        <svg
          width="1rem"
          height="1rem"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.2666 9H2.73325C1.73325 9 1.33325 9.42667 1.33325 10.4867V13.18C1.33325 14.24 1.73325 14.6667 2.73325 14.6667H13.2666C14.2666 14.6667 14.6666 14.24 14.6666 13.18V10.4867C14.6666 9.42667 14.2666 9 13.2666 9Z"
            fill="#AAB0B2"
          />
          <path
            d="M13.2666 1.33301H2.73325C1.73325 1.33301 1.33325 1.75967 1.33325 2.81967V5.51301C1.33325 6.57301 1.73325 6.99967 2.73325 6.99967H13.2666C14.2666 6.99967 14.6666 6.57301 14.6666 5.51301V2.81967C14.6666 1.75967 14.2666 1.33301 13.2666 1.33301Z"
            fill="#AAB0B2"
          />
        </svg>
      ),
    },
  ];

  const resetModalAndStoreValues = () => {
    setCurrentStep(1);
    setController({});
    updateMultipleVacancySteps(
      Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        values: {
          isAllFilled: false,
        },
      }))
    );
  };

  const getSummaryData = () => {
    getSummary()
      .then((response) => {
        if (response?.data) {
          const summaryData = response.data || {};
          setSummary({
            Current: {
              Open_Job: summaryData.Current?.OpenJobs ?? "0",
              Open_Position: summaryData.Current?.OpenPositions ?? "0",
              Total_View: summaryData.Current?.TotalViews ?? "0",
              Total_Applied: summaryData.Current?.TotalApplied ?? "0",
            },
            Requested: {
              Total: summaryData?.Requested?.Count ?? "0",
            },
            Finished: {
              Total_Job: summaryData.Finished?.TotalJobs ?? "0",
              Total_Applied: summaryData.Finished?.TotalApplied ?? "0",
              Total_Position: summaryData.Finished?.TotalPositions ?? "0",
            },
          });
        } else {
          setSummary({ Current: {}, Finished: {}, Requested: {} });
        }
      })
      .catch((error) => {
        console.error("Error fetching summary data:", error);
        setSummary({ Current: {}, Finished: {}, Requested: {} });
      });
  };

  const handleStoreUpdate = () => {
    if (controller.modalOptions)
      setModalOptions((prev) => ({ ...prev, ...controller.modalOptions }));
    switch (controller.actionType) {
      case storeActionTypes.OPEN_MODAL:
        setModalOptions((prev) => ({
          ...prev,
          visible: true,
          additionalData: controller.additionalData ?? null,
          options: {
            ...prev.options,
            title: controller.title ? controller.title : prev.options.title,
          },
          requestType: controller.requestType,
          width:
            storeActionTypes.REQUEST_TYPES.ASSEMBLE_VACANCY ==
            controller.requestType
              ? "65.625rem"
              : null,
          size: [
            storeActionTypes.REQUEST_TYPES.REQUEST_VACANCY,
            storeActionTypes.REQUEST_TYPES.RE_OPEN_VACANCY,
          ].includes(controller.requestType)
            ? "small"
            : controller.modalOptions.size || "medium",
        }));
        break;
      case storeActionTypes.CLOSE_MODAL:
        setModalOptions(initialModalOptions);
        resetModalAndStoreValues();
        break;
    }
  };

  const exportDocuments = async () => {
    const downloadBase64 = (base64Data, fileName = "exportedDocument") => {
      const link = document.createElement("a");
      link.href = `data:application/octet-stream;base64,${base64Data}`;
      link.download = `${fileName}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    try {
      setExportLoading(true);

      if (pathname) {
        let base64Response = null;

        if (pathname.includes("currentVacancies")) {
          if (mode === storeActionTypes.USER_MODES.HR) {
            await getExportCurrentListForHr().then(
              (resp) => (base64Response = resp.data)
            );
          } else {
            await getExportCurrentListForRecruiter().then(
              (resp) => (base64Response = resp.data)
            );
          }
        } else if (pathname.includes("finishedVacancies")) {
          if (mode === storeActionTypes.USER_MODES.HR) {
            await getExportFinishedListForHr().then(
              (resp) => (console.log(resp), (base64Response = resp.data))
            );
          } else {
            await getExportFinishedListForRecruiter().then(
              (resp) => (base64Response = resp.data)
            );
          }
        } else if (pathname.includes("requestedVacancies")) {
          if (mode === storeActionTypes.USER_MODES.HR) {
            await getExportRequestedListForHr().then(
              (resp) => (base64Response = resp.data)
            );
          } else {
            await getExportListForManager().then(
              (resp) => (base64Response = resp.data)
            );
          }
        }

        if (base64Response && typeof base64Response === "string") {
          downloadBase64(base64Response, "exportedDocument");
        } else {
          console.error("No base64 data returned from the request.");
        }

        setExportLoading(false);
      } else {
        console.error("Pathname is not defined.");
      }
    } catch (error) {
      setExportLoading(false);
      console.error("An error occurred while exporting documents:", error);
    }
  };

  useEffect(() => {
    const traverseAndHighlight = (element) => {
      if (element.nodeType === Node.TEXT_NODE) {
        const originalText = element.textContent;

        if (searchValue) {
          const regex = new RegExp(`(${searchValue})`, "gi");
          if (regex.test(originalText)) {
            const wrapper = document.createElement("span");
            wrapper.innerHTML = originalText.replace(
              regex,
              (match) =>
                `<mark style="background-color: orange;">${match}</mark>`
            );
            element.parentNode.replaceChild(wrapper, element);
          }
        }
      } else if (
        element.nodeType === Node.ELEMENT_NODE &&
        element.tagName !== "SCRIPT" &&
        element.tagName !== "STYLE"
      ) {
        Array.from(element.childNodes).forEach(traverseAndHighlight);
      }
    };

    const rootElement = document.body;
    traverseAndHighlight(rootElement);

    return () => {
      const marks = document.querySelectorAll("mark");
      marks.forEach((mark) => {
        const parent = mark.parentNode;
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
        parent.normalize();
      });
    };
  }, [searchValue, pathname]);

  useUpdateEffect(() => {
    getSummaryData();
  }, [pathname]);

  useEffect(() => {
    getSummaryData();
    setactiveTabPath(
      pathname.includes("vacanciesBoard") ? tabs[0].path : tabs[1].path
    );
    setModalOptions(initialModalOptions);
  }, []);

  useEffect(() => {
    handleStoreUpdate();
  }, [controller]);

  useEffect(() => {
    // console.log(vacancyFormSteps);
  }, [vacancyFormSteps]);

  return (
    <div className={style.vacanciesContent}>
      {confirmStatusChangeTo?.status &&
      [5, 7, 8].includes(confirmStatusChangeTo?.status) ? (
        <ConfirmStatusChange />
      ) : (
        ""
      )}

      <VacancyDetailsModal />
      <VacancyComments />
      <AssignRecruiter />
      <Popup
        {...modalOptions}
        headerSlot={() => {
          return (
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              {modalOptions.requestType ==
              storeActionTypes.REQUEST_TYPES.ASSEMBLE_VACANCY ? (
                <div
                  style={{
                    background: "rgba(48, 172, 208, 0.10)",
                    borderRadius: "1.5rem",
                    display: "grid",
                    placeItems: "center",
                    padding: "0.75rem",
                    fontWeight: "500",
                  }}
                >
                  <span style={{ color: "#30ACD0", fontSize: "0.875rem" }}>
                    {modalOptions?.additionalData?.jobName}
                  </span>
                </div>
              ) : (
                ""
              )}
              {vacancyFormSteps.currentStep == 6 ? (
                <MainButton
                  label={"Export"}
                  icon={<IconExport />}
                  iconPosition={"right"}
                  size={"small"}
                  type={"border"}
                  loading={exportLoading}
                  onClick={() => setExportVacancy(true)}
                  customStyle={{
                    color: "#141719",
                    border: " 0.0625rem solid #D1D5D6",
                    height: "2.325rem",
                  }}
                />
              ) : (
                ""
              )}
            </div>
          );
        }}
      >
        <div className={style.modalContentWrapper}>
          <div className={style.modalTop}>
            {modalOptions?.requestType ==
            storeActionTypes.REQUEST_TYPES.ASSEMBLE_VACANCY ? (
              <div className={style.modalSteps}>
                <ProgressIndicator
                  stepsData={vacancyFormSteps?.data}
                  currentStep={vacancyFormSteps?.currentStep}
                  vertical={true}
                  withIcons={true}
                  independentStep={true}
                  onStepClick={(step) => {
                    setCurrentStep(step.id);
                  }}
                />
              </div>
            ) : (
              ""
            )}
            <div className={style.modalContent} style={{ width: "100%" }}>
              {modalOptions?.renderTemplate && modalOptions.renderTemplate()}
            </div>
          </div>

          <div className={style.modalActions}>
            <MainButton
              label={"Close"}
              type={"border"}
              size={"small"}
              customStyle={{ color: "#141719", borderColor: "#D1D5D6" }}
              onClick={() =>
                setController({ actionType: storeActionTypes.CLOSE_MODAL })
              }
            />
            <div>
              {modalOptions?.requestType ==
              storeActionTypes.REQUEST_TYPES.REQUEST_VACANCY ? (
                <MainButton
                  label={"Save As Draft"}
                  type={"border"}
                  size={"small"}
                  customStyle={{ color: "#30ACD0", borderColor: "#30ACD0" }}
                  onClick={() => {
                    setActionTrigger(
                      storeActionTypes.REQUEST_ACTIONS
                        .SEND_REQUEST_VACANCY_AS_DRAFT
                    );
                  }}
                />
              ) : modalOptions?.requestType ==
                storeActionTypes.REQUEST_TYPES.RE_OPEN_VACANCY ? (
                ""
              ) : (
                <MainButton
                  label={"Back"}
                  type={"text"}
                  size={"small"}
                  customStyle={{ color: "#141719" }}
                  onClick={() =>
                    setActionTrigger(
                      storeActionTypes.REQUEST_ACTIONS.LOAD_PREV_STEP
                    )
                  }
                />
              )}
              {vacancyFormSteps.currentStep == 6 ? (
                <MainButton
                  label={"Save As Draft"}
                  size={"small"}
                  type={"border"}
                  customStyle={{
                    border: "0.0625rem solid #30ACD0",
                    color: "#30ACD0",
                  }}
                  onClick={() => {
                    setActionTrigger(
                      storeActionTypes.REQUEST_ACTIONS
                        .SEND_REQUEST_VACANCY_AS_DRAFT
                    );
                  }}
                />
              ) : (
                ""
              )}
              <MainButton
                label={
                  modalOptions?.requestType ==
                  storeActionTypes.REQUEST_TYPES.REQUEST_VACANCY
                    ? "Save"
                    : modalOptions?.requestType ==
                      storeActionTypes.REQUEST_TYPES.RE_OPEN_VACANCY
                    ? "Re Open"
                    : vacancyFormSteps.currentStep == 6
                    ? "Publish"
                    : "Next"
                }
                size={"small"}
                customStyle={{ background: "#30ACD0" }}
                onClick={() =>
                  setActionTrigger(
                    modalOptions?.requestType ==
                      storeActionTypes.REQUEST_TYPES.ASSEMBLE_VACANCY
                      ? storeActionTypes.REQUEST_ACTIONS.LOAD_NEXT_STEP
                      : storeActionTypes.REQUEST_ACTIONS.SEND_REQUEST_VACANCY
                  )
                }
              />
            </div>
          </div>
        </div>
      </Popup>
      <header className={style.vacanciesCommonHeader}>
        <h1>Vacancies</h1>
        <div className={style.vacanciesSearch}>
          <Search
            value={searchValue}
            change={(value) => setSearchValue(value)}
          />
        </div>
        <div className={style.vacanciesTabAndAction}>
          {isAdmin && !pathname.includes("vacanciesBoard") ? (
            <MainButton
              label={"Export"}
              icon={<IconExport />}
              iconPosition={"right"}
              size={"small"}
              type={"border"}
              loading={exportLoading}
              onClick={exportDocuments}
              customStyle={{
                color: "#141719",
                border: " 0.0625rem solid #D1D5D6",
                height: "2.325rem",
              }}
            />
          ) : (
            ""
          )}
          <nav>
            {tabs.map((tab, index) => {
              return (
                <NavLink
                  key={index}
                  to={`${tab.path}/${
                    isAdmin ? "hr" : mode && mode?.toLowerCase()
                  }`}
                  className={`${
                    activeTabPath === tab.path ? style.activeTab : ""
                  } ${style.singleTab}`}
                  onClick={() => setactiveTabPath(tab.path)}
                >
                  {tab.icon}
                </NavLink>
              );
            })}
          </nav>
          {mode !== storeActionTypes.USER_MODES.RECRUITER ? (
            <Button
              onClick={() =>
                setController({
                  actionType: storeActionTypes.OPEN_MODAL,
                  requestType: storeActionTypes.REQUEST_TYPES.REQUEST_VACANCY,
                  modalOptions: {
                    renderTemplate: () => <RequestVacancy />,
                  },
                })
              }
              label={"Request Vacancy"}
              customStyle={{
                height: "2.5rem",
                borderRadius: "0.375rem",
              }}
            />
          ) : (
            ""
          )}
        </div>
      </header>

      {(isAdmin || mode == storeActionTypes.USER_MODES.RECRUITER) &&
      activeTabPath !== "vacanciesBoard" ? (
        <div className={style.additionalPanel}>
          <HrTabs />
        </div>
      ) : (
        ""
      )}

      <Outlet />
    </div>
  );
};
