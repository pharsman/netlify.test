import style from "@/pages/candidates/style/CandidatesBoard.module.scss";
import FormMultiSelectDropdown from "masterComponents/FormMultiSelectDropdown";
import {
  getCandidatesBoard,
  getVacanciesList,
  setCandidateStage,
} from "./api/CandidatesApi";
import { useState, useEffect, useRef } from "react";
import { IconInfoCircle } from "@/assets/icons/other/IconInfoCircle";
import ScrollContainer from "react-indiana-drag-scroll";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { IconArrowDown } from "@/assets/icons/other/IconArrowDown";
import CheckBox from "masterComponents/CheckBox";
import IconDelete from "@/assets/icons/other/IconDelete";
import { ReactSortable } from "react-sortablejs";
import { CandidateCard } from "./components/CandidateCard";
import Loader from "masterComponents/Loader";
import { CandidateActionTypes } from "./constants";
import { useCandidatesStore } from "./store/CandidatesStore";

export const CandidatesBoard = () => {
  const { actionTrigger, setActionTrigger } = useCandidatesStore();
  const [vacanciesList, setVacanciesList] = useState([]);
  const [selectedFilteredVacancies, setSelectedFilteredVacancies] = useState(
    []
  );
  const [isFilteresApplied, setIsFilteresApplied] = useState(false);
  const [selectedFilteredVacancy, setSelectedFilteredVacancy] = useState(null);
  const [isVacanciesListVisible, setIsVacanciesListVisible] = useState(false);
  const dropdownRef = useRef(null);
  const [boardData, setBoardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [infoPanelCounts, setInfoPanelCounts] = useState([]);

  const getVacanciesListData = async () => {
    try {
      setLoading(true);
      await getVacanciesList().then((response) => {
        if (!response || response.Error || response.data.Error) return;
        const data = response.data.map((item) => ({
          name: item.VacancyName,
          label: `${item.OrgUnitName} - ${item.VacancyName}`,
          id: item.VacancyID,
          selected: false,
          unitName: item.OrgUnitName,
        }));
        setVacanciesList(data);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    setIsFilteresApplied(true);
    setSelectedFilteredVacancy(
      selectedFilteredVacancies[0].id ? selectedFilteredVacancies[0].id : null
    );
    getBoardData({
      VacancyID: selectedFilteredVacancies[0].id
        ? selectedFilteredVacancies[0].id
        : null,
    });
  };

  const getBoardData = async (params) => {
    setLoading(true);
    try {
      await getCandidatesBoard(params).then((response) => {
        if (!response || response.Error || response.data.Error) return;
        setBoardData(response.data);
        console.log(response.data);
        const panelCounts = response.data.map((item) => ({
          name: item.StageName,
          count: item.CandidatesCount,
        }));
        setInfoPanelCounts([
          ...[
            {
              name: "Total Apply",
              count: panelCounts.reduce((sum, stage) => sum + stage.count, 0),
            },
          ],
          ...panelCounts,
        ]);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = async (CandidateID, VacancyID, NewStageID) => {
    try {
      setLoading(true);
      await setCandidateStage({
        CandidateID: Number(CandidateID),
        VacancyID: Number(VacancyID),
        NewStageID: Number(NewStageID),
      }).then((response) => {
        if (!response || response.Error || response.data.Error) return;
        getBoardData({
          VacancyID: selectedFilteredVacancy,
        });
      });
    } catch (error) {
      console.log(error);
      getBoardData({
        VacancyID: selectedFilteredVacancy,
      });
    } finally {
      setLoading(false);
    }
  };

  const initialCalls = async () => {
    await getVacanciesListData();
  };

  useUpdateEffect(() => {
    if (
      actionTrigger ===
      CandidateActionTypes.REQUEST_TYPES.RELOAD_CANDIDATES_DATA
    ) {
      getBoardData({
        VacancyID: selectedFilteredVacancy,
      });
      setActionTrigger(null);
    }
  }, [actionTrigger]);

  useUpdateEffect(() => {
    if (selectedFilteredVacancy) {
      getBoardData({
        VacancyID: selectedFilteredVacancy,
      });
    }
  }, [selectedFilteredVacancy]);

  useUpdateEffect(() => {
    if (selectedFilteredVacancies.every((e) => !e.selected)) {
      setIsFilteresApplied(false);
    }
  }, [selectedFilteredVacancies]);

  useEffect(() => {
    if (isFilteresApplied) {
      setIsVacanciesListVisible(false);
    } else {
      setSelectedFilteredVacancy(null);
      setSelectedFilteredVacancies((prev) => {
        prev.forEach((item) => {
          item.selected = false;
        });
        return prev;
      });
      setVacanciesList((prev) => {
        prev.forEach((item) => {
          item.selected = false;
        });
        return prev;
      });
    }
  }, [isFilteresApplied]);

  useEffect(() => {
    initialCalls();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsVacanciesListVisible(false);
      }
    };

    const handleScroll = () => {
      setIsVacanciesListVisible(false);
    };

    window.addEventListener("scroll", handleScroll);

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={style.candidatesBoardContent}>
      {isFilteresApplied ? (
        <div className={style.candidatesBoard}>
          <div className={style.candidatesBoardHeader}>
            {infoPanelCounts.map((item, index) => (
              <div key={index} className={style.infoPanelCount}>
                <div className={style.mark}></div>
                <div>
                  <span>{item.count}</span>
                  <span>{item.name}</span>
                </div>
              </div>
            ))}
          </div>
          <ScrollContainer
            className={`${style.filterTabs} scroll-container`}
            ignoreElements={".ignore-drag-scroll"}
          >
            <div className={style.selectedFiltersDropdown} ref={dropdownRef}>
              <div
                className={style.selectedFiltersDropdownLabel}
                onClick={() =>
                  setIsVacanciesListVisible(!isVacanciesListVisible)
                }
              >
                <span>Jobs</span>
                <IconArrowDown />
              </div>
              {isVacanciesListVisible && (
                <div
                  className={style.selectedFiltersDropdownContent}
                  style={{
                    position: "fixed",
                    top:
                      dropdownRef.current?.getBoundingClientRect().bottom +
                      "px",
                    left:
                      dropdownRef.current?.getBoundingClientRect().left + "px",
                  }}
                >
                  <ul>
                    {selectedFilteredVacancies.map((item, index) => (
                      <li
                        key={index}
                        onClick={() =>
                          setSelectedFilteredVacancies((prev) => {
                            const newList = [...prev];
                            newList[index].selected = !item.selected;
                            if (newList.some((v) => v.selected)) {
                              if (
                                newList.find(
                                  (v) => v.id === selectedFilteredVacancy
                                )?.selected
                              ) {
                              } else {
                                setSelectedFilteredVacancy(
                                  newList.find((v) => v.selected).id
                                );
                              }
                            }
                            return newList;
                          })
                        }
                      >
                        <div className={style.checkboxContainer}>
                          <CheckBox checked={item.selected} />
                        </div>
                        <span>{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <ul>
              {selectedFilteredVacancies
                .filter((item) => item.selected)
                .map((item, index) => (
                  <li
                    className={
                      item.id === selectedFilteredVacancy ? style.active : ""
                    }
                    key={index}
                    onClick={() => setSelectedFilteredVacancy(item.id)}
                  >
                    <div>
                      <span>{item.name}</span>
                      <span>{item.unitName}</span>
                    </div>

                    <div
                      className={style.removeFilter}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFilteredVacancies((prev) => {
                          const newList = [...prev];
                          const itemToUnselect = newList.find(
                            (vacancy) => vacancy.id === item.id
                          );
                          if (itemToUnselect) {
                            itemToUnselect.selected = false;
                          }
                          if (newList.some((v) => v.selected)) {
                            if (
                              newList.find(
                                (v) => v.id === selectedFilteredVacancy
                              )?.selected
                            ) {
                            } else {
                              setSelectedFilteredVacancy(
                                newList.find((v) => v.selected).id
                              );
                            }
                          }
                          return newList;
                        });
                        setVacanciesList((prev) => {
                          return prev.map((vacancy) => {
                            if (vacancy.id === item.id) {
                              return { ...vacancy, selected: false };
                            }
                            return vacancy;
                          });
                        });
                      }}
                    >
                      <svg
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.2088 4.4396C12.0679 4.44293 11.934 4.50191 11.8364 4.60366L8.01352 8.42658L4.1906 4.60366C4.14088 4.55242 4.08138 4.51167 4.01562 4.48385C3.94986 4.45603 3.87919 4.44169 3.80779 4.44169C3.70162 4.44171 3.59788 4.47341 3.50985 4.53274C3.42181 4.59207 3.35347 4.67631 3.31359 4.7747C3.27371 4.87309 3.2641 4.98114 3.28598 5.08502C3.30787 5.1889 3.36025 5.28389 3.43643 5.35783L7.25935 9.18075L3.43643 13.0037C3.38525 13.0528 3.34438 13.1117 3.31623 13.1768C3.28808 13.2419 3.27321 13.312 3.27249 13.383C3.27177 13.4539 3.28521 13.5243 3.31203 13.59C3.33885 13.6557 3.37851 13.7154 3.42869 13.7656C3.47886 13.8158 3.53854 13.8554 3.60424 13.8822C3.66993 13.9091 3.74032 13.9225 3.81127 13.9218C3.88223 13.9211 3.95232 13.9062 4.01746 13.878C4.08259 13.8499 4.14146 13.809 4.1906 13.7578L8.01352 9.93492L11.8364 13.7578C11.8856 13.809 11.9444 13.8499 12.0096 13.878C12.0747 13.9062 12.1448 13.9211 12.2158 13.9218C12.2867 13.9225 12.3571 13.9091 12.4228 13.8822C12.4885 13.8554 12.5482 13.8158 12.5983 13.7656C12.6485 13.7154 12.6882 13.6557 12.715 13.59C12.7418 13.5243 12.7553 13.4539 12.7545 13.383C12.7538 13.312 12.739 13.2419 12.7108 13.1768C12.6827 13.1117 12.6418 13.0528 12.5906 13.0037L8.76768 9.18075L12.5906 5.35783C12.6682 5.28341 12.7215 5.18728 12.7435 5.08203C12.7655 4.97679 12.7552 4.86735 12.714 4.76807C12.6727 4.66879 12.6024 4.5843 12.5122 4.52568C12.4221 4.46707 12.3163 4.43706 12.2088 4.4396Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </li>
                ))}
            </ul>
          </ScrollContainer>
          <div className={style.board}>
            {loading ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  zIndex: "50",
                  background: "#ffffff70",
                }}
              >
                <div
                  style={{
                    width: "fit-content",
                    position: "absolute",
                    left: "50%",
                    top: "30%",
                  }}
                >
                  <Loader loading={true} circleColor={"#30ACD0"} />
                </div>
              </div>
            ) : (
              ""
            )}
            {boardData.map((stage, index) => {
              return (
                <div
                  key={index}
                  className={`${style.stageContainer} stageContainer`}
                  data-newstageid={stage.StageID}
                >
                  <h2>
                    {stage.StageName} <span>({stage.CandidatesCount})</span>
                  </h2>
                  <ReactSortable
                    list={stage.Candidates}
                    setList={(newList) => {
                      setBoardData((prev) => {
                        const updatedData = [...prev];
                        updatedData[index].Candidates = newList;
                        return updatedData;
                      });
                    }}
                    onEnd={(e) => {
                      if (e.from !== e.to) {
                        handleStageChange(
                          e.item?.dataset?.candidateid || null,
                          e.item?.dataset?.vacancyid || null,
                          e.to?.closest(".stageContainer")?.dataset
                            ?.newstageid || null
                        );
                      }
                    }}
                    group="shared"
                    animation={200}
                  >
                    {stage.Candidates.length > 0 ? (
                      stage.Candidates.map((candidate) => (
                        <div
                          key={candidate.CandidateID}
                          data-candidateid={candidate.CandidateID}
                          data-vacancyid={selectedFilteredVacancy}
                          data-newstageid={stage.StageID}
                          className={style.candidateItem}
                        >
                          <CandidateCard
                            data={candidate}
                            vacancyID={selectedFilteredVacancy}
                          />
                        </div>
                      ))
                    ) : (
                      <div className={style.noCandidates}>
                        <IconInfoCircle />
                        <h2>No candidates are assigned to this stage.</h2>
                      </div>
                    )}
                  </ReactSortable>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={style.selectVacancies}>
          <div className={style.selectVacanciesContent}>
            <div className={style.selectVacanciesTitle}>
              <IconInfoCircle />
              <span>
                Choose any job vacancy to appear on the candidates pipeline
                board
              </span>
            </div>
            <div className={style.selectVacanciesDropdown}>
              <FormMultiSelectDropdown
                label={"Select Jobs"}
                data={vacanciesList}
                change={(selected) => {
                  setSelectedFilteredVacancies(
                    vacanciesList.map((item) => ({
                      ...item,
                      selected: selected.some((s) => s.id === item.id),
                    }))
                  );
                }}
                buttonBgColor={"#30ACD0"}
                onApplyClick={applyFilters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
