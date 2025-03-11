import { useEffect, useMemo, useState, useCallback, useRef } from "react";

import Button from "@/components/Button";
import Card from "masterComponents/Card";
import Search from "masterComponents/Search";

import { useStore } from "@/store/zuStore";
import { getAllStages, deleteStage } from "@/api/api";
import { __debounce, useUpdateEffect } from "@/utils/helpers";

import empty from "@/assets/png/emptyFolder.png";

import styles from "./pages.module.scss";

function Stages() {
  const [search, setSearch] = useState("");
  const [activeCard, setActiveCard] = useState(null);
  const [stages, setStages] = useState([]);
  const setModalStatus = useStore((state) => state.setModalStatus);
  const reloadStages = useStore((state) => state.reloadStages);

  const stagesGet = async (val) => {
    const resp = await getAllStages(val);
    setStages(resp.data);
  };

  const stageDelete = async (id) => {
    const resp = await deleteStage(id);
    if (resp.data) {
      setStages((prevStages) => prevStages.filter((stage) => stage.ID !== id));
    }
  };

  const debouncedSearch = useCallback(
    __debounce((val) => {
      stagesGet(val);
    }, 500),
    []
  );

  useEffect(() => {
    stagesGet();
  }, [reloadStages]);

  useUpdateEffect(() => {
    debouncedSearch(search);
  }, [search]);

  return stages ? (
    <div className={styles.setupTabContainer}>
      <div
        style={{ display: "flex", justifyContent: "end", marginBottom: "24px" }}
      >
        <div style={{ marginRight: "12px" }}>
          <Search
            placeholder={"Search..."}
            value={search}
            size={"medium"}
            change={(value) => setSearch(value)}
          />
        </div>
        <Button
          label={"Add Stage"}
          customStyle={{ height: "46px" }}
          onClick={() => setModalStatus(true, "AddStage")}
        />
      </div>
      <div className={styles.stageCards}>
        {stages.map((card) => (
          <div style={{ width: "300px" }} key={JSON.stringify(card)}>
            <Card
              id={card.ID}
              title={card.Name}
              description={
                card.Description ? (
                  <span style={{ fontFamily: "Inter" }}>
                    {card.Description}
                  </span>
                ) : (
                  <span style={{ fontFamily: "Inter" }}>No description</span>
                )
              }
              onDelete={() => stageDelete(card.ID)}
              onEdit={(type, id) => setModalStatus(true, "AddStage", card)}
              actionsVisible={activeCard === card.ID}
              onExpand={() => setActiveCard(card.ID)}
              onOutsideClick={() => setActiveCard(null)}
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
                {card.CriteriaGroupName ? (
                  <p
                    style={{
                      backgroundColor: "var(--color-surface-low-initial)",
                      lineHeight: "20px",
                      fontSize: "12px",
                      padding: "2px",
                      fontFamily: "Inter",
                    }}
                  >
                    {card.CriteriaGroupName}
                  </p>
                ) : (
                  <div
                    onClick={() => setModalStatus(true, "AddStage", card)}
                    style={{
                      fontFamily: "Inter",
                      color: "#30ACD0",
                      fontSize: "12px",
                      fontWeight: "500",
                      textDecoration: "underline",
                      marginTop: "8px",
                    }}
                  >
                    + Criteria Group
                  </div>
                )}
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
    </div>
  ) : (
    <div className={styles.setupTabContainer}>
      <div className={styles.noStages}>
        <div className={styles.noStageContainer}>
          <img src={empty} alt="empty" />
          <p
            style={{
              marginTop: "24px",
              marginBottom: "32px",
              fontWeight: "500",
              fontSize: "16px",
            }}
          >
            Stage types are empty
          </p>
          <Button
            label="Add Stage"
            onClick={() => setModalStatus(true, "AddStage")}
          ></Button>
        </div>
      </div>
    </div>
  );
}

export default Stages;
