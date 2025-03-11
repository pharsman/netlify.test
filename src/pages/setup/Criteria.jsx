import { useCallback, useEffect, useState } from "react";

import Button from "@/components/Button";
import Card from "masterComponents/Card";
import Search from "masterComponents/Search";
import Tabs from "masterComponents/Tabs";
import Tooltip from "masterComponents/Tooltip";

import { __debounce } from "@/utils/helpers";

import { useStore } from "@/store/zuStore";
import {
  getAllCriteria,
  deleteCriteria,
  getAllCriteriaGroupExtended,
  deleteCriteriaGroup,
} from "@/api/api";

import empty from "@/assets/png/emptyFolder.png";
import styles from "./pages.module.scss";
import { useUpdateEffect } from "@/utils/helpers";

function Criteria() {
  const [search, setSearch] = useState("");
  const [searchGroup, setSearchGroup] = useState("");
  const [activeCard, setActiveCard] = useState(null);
  /// const [activeCardDetails, setActiveCardDetails] = useState(null);
  const [activeCardGroup, setActiveCardGroup] = useState(null);
  const [currentTab, setCurrentTab] = useState(1);
  const [criteria, setCriteria] = useState([]);
  const [criteriaGroups, setCriteriaGroups] = useState([]);
  const setModalStatus = useStore((state) => state.setModalStatus);
  const reloadCriteria = useStore((state) => state.reloadCriteria);
  const reloadCriteriaGroup = useStore((state) => state.reloadCriteriaGroup);

  const renderTip = (card) => {
    const totalMaxScore = card.ScoreIndicators.reduce(
      (acc, curr) => acc + curr.MaxScore,
      0
    );

    const getColor = (val) => {
      const normalizedVal = Math.max(0, Math.min(100, val));
      const hue = (normalizedVal / 100) * 120;
      return `hsl(${hue}, 100%, 70%)`;
    };

    return (
      <div
        style={{
          width: "150px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {card.ScoreIndicators?.map((el) => (
          <div>
            {((el.MaxScore / totalMaxScore) * 100).toFixed(1) !== "NaN" && (
              <p
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0px",
                }}
              >
                <span style={{ fontWeight: "600" }}>{el.Description}</span>
                <span
                  style={{
                    color: getColor((el.MaxScore / totalMaxScore) * 100),
                  }}
                >
                  {((el.MaxScore / totalMaxScore) * 100).toFixed(1)}%
                </span>
              </p>
            )}
            <p style={{ lineHeight: "16px" }}>
              {el.MinScore} - {el.MaxScore}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderTipGroup = (card) => {
    return (
      <div
        style={{
          width: "150px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {card.Criterias?.slice(0, 12).map((el, ind) => (
          <div>
            <p>
              {ind + 1}. {el.Name}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderCriterias = () => {
    return criteria.length > 0 ? (
      <div className={styles.stageCards}>
        {criteria.map((card) => (
          <div style={{ width: "300px" }} key={JSON.stringify(card)}>
            <Card
              id={card.ID}
              title={card.Name}
              description={
                <span style={{ fontFamily: "Inter" }}>
                  Max Score - {card.MaxScore}
                </span>
              }
              onDelete={(type, id) => criteriaDelete(card.ID)}
              onEdit={(type, id) => setModalStatus(true, "AddCriteria", card)}
              actionsVisible={activeCard === card.ID}
              onExpand={() => setActiveCard(card.ID)}
              onOutsideClick={() => setActiveCard(null)}
              // footerStyle={{ border: "none" }}
              cardStyle={{
                border: "1px solid var(--color-stroke-softer-initial)",
                maxHeight: "none",
              }}
              footerStyle={{ padding: "10px" }}
              alignActions="right"
              mode={"customTemplate"}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  // onClick={() => setActiveCardDetails(card.ID)}
                  style={{
                    color: "#30ACD0",
                    fontSize: "12px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    fontFamily: "Inter",
                    zIndex: "3",
                  }}
                >
                  <Tooltip label={renderTip(card)} placement={"bottom"}>
                    <span style={{ marginRight: "8px" }}>Details</span>{" "}
                  </Tooltip>
                </div>
                {card.IsCommon && (
                  <div
                    style={{
                      color: "#D08B30",
                      fontSize: "12px",
                      fontFamily: "Inter",
                      fontWeight: "500",
                    }}
                  >
                    • Is Common
                  </div>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
    ) : (
      <div className={styles.noStages}>
        <div className={styles.noStageContainer} style={{ marginTop: "20vh" }}>
          <img src={empty} alt="empty" />
          <p
            style={{
              marginTop: "24px",
              marginBottom: "32px",
              fontWeight: "500",
              fontSize: "16px",
              fontFamily: "Inter",
            }}
          >
            Criteria are empty
          </p>
          <Button
            label="Add Criteria"
            onClick={() => setModalStatus(true, "AddCriteria")}
          ></Button>
        </div>
      </div>
    );
  };

  const renderCriteriaGroups = () => {
    return criteriaGroups.length > 0 ? (
      <div className={styles.stageCards}>
        {criteriaGroups.map((card) => (
          <div style={{ width: "300px" }} key={JSON.stringify(card)}>
            <Card
              id={card.CriteriaGroupID}
              title={card.Name}
              description={card.Description}
              onDelete={(type, id) => criteriaGroupDelete(card.CriteriaGroupID)}
              onEdit={(type, id) =>
                setModalStatus(true, "AddCriteriaGroup", card)
              }
              actionsVisible={activeCardGroup === card.CriteriaGroupID}
              onExpand={() => setActiveCardGroup(card.CriteriaGroupID)}
              onOutsideClick={() => setActiveCardGroup(null)}
              footerStyle={{ border: "none" }}
              cardStyle={{
                border: "1px solid var(--color-stroke-softer-initial)",
              }}
              alignActions="right"
              mode={"customTemplate"}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "end",
                }}
              >
                <div
                  style={{
                    color: "#30ACD0",
                    fontSize: "12px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Tooltip label={renderTipGroup(card)} placement={"bottom"}>
                    <span style={{ marginRight: "8px" }}>Group Details</span>
                  </Tooltip>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    ) : (
      <div className={styles.noStages}>
        <div className={styles.noStageContainer} style={{ marginTop: "20vh" }}>
          <img src={empty} alt="empty" />
          <p
            style={{
              marginTop: "24px",
              marginBottom: "32px",
              fontWeight: "500",
              fontSize: "16px",
              fontFamily: "Inter",
            }}
          >
            Criteria groups are empty
          </p>
          <Button
            label="Add Criteria Group"
            onClick={() => setModalStatus(true, "AddCriteriaGroup")}
          ></Button>
        </div>
      </div>
    );
  };

  const tabs = [
    { key: 1, label: "Criteria" },
    { key: 2, label: "Criteria Groups" },
  ];

  const getCriterias = async (val) => {
    const res = await getAllCriteria(val);
    setCriteria(res.data);
  };

  const getCriteriaGroup = async (val) => {
    const res = await getAllCriteriaGroupExtended(val);
    setCriteriaGroups(res.data);
  };

  const criteriaDelete = async (id) => {
    const resp = await deleteCriteria(id);
    if (resp.data) {
      setCriteria((prevStages) =>
        prevStages.filter((criteria) => criteria.ID !== id)
      );
    }
  };

  const criteriaGroupDelete = async (id) => {
    const resp = await deleteCriteriaGroup(id);
    if (resp.data) {
      setCriteriaGroups((prevStages) =>
        prevStages.filter((criteria) => criteria.ID !== id)
      );
    }
  };

  useEffect(() => {
    getCriterias();
  }, [reloadCriteria]);

  useEffect(() => {
    getCriteriaGroup();
  }, [reloadCriteriaGroup]);

  const debouncedSearch = useCallback(
    __debounce((val) => {
      getCriterias(val);
    }, 500),
    []
  );

  const debouncedSearchGroup = useCallback(
    __debounce((val) => {
      getCriteriaGroup(val);
    }, 500),
    []
  );

  useUpdateEffect(() => {
    debouncedSearch(search);
  }, [search]);

  useUpdateEffect(() => {
    debouncedSearchGroup(searchGroup);
  }, [searchGroup]);

  return (
    <div className={styles.setupTabContainer}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <Tabs
          tabItems={tabs}
          itemColor={"var(--color-text-softer-default)"}
          barColorG={"var(--color-text-softer-default)"}
          itemActiveColor={"var(--color-text-soft-default)"}
          onItemClick={(val) => setCurrentTab(val.key)}
          defaultActiveKey={currentTab}
        ></Tabs>
        <div style={{ marginRight: "12px", marginLeft: "12px" }}>
          {currentTab === 1 ? (
            <Search
              placeholder={"Search..."}
              value={search}
              size={"medium"}
              change={(value) => setSearch(value)}
            />
          ) : (
            <Search
              placeholder={"Search..."}
              value={searchGroup}
              size={"medium"}
              change={(value) => setSearchGroup(value)}
            />
          )}
        </div>
        <Button
          label={currentTab === 1 ? "Add Criteria" : "Add Criteria Group"}
          customStyle={{ height: "46px", fontFamily: "Inter", width: "180px" }}
          onClick={() =>
            currentTab === 1
              ? setModalStatus(true, "AddCriteria")
              : setModalStatus(true, "AddCriteriaGroup")
          }
        />
      </div>
      {currentTab === 1 ? renderCriterias() : renderCriteriaGroups()}
    </div>
  );
}

export default Criteria;
