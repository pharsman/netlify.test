import { useEffect, useMemo, useState, useCallback, useRef } from "react";

import Button from "@/components/Button";
import Card from "masterComponents/Card";
import Search from "masterComponents/Search";

import { useStore } from "@/store/zuStore";
import { getFollowUp, deleteFollowUp } from "@/api/api";
import { __debounce, useUpdateEffect } from "@/utils/helpers";

import empty from "@/assets/png/emptyFolder.png";

import styles from "./pages.module.scss";

function FollowUp() {
  const [search, setSearch] = useState("");
  const [activeCard, setActiveCard] = useState(null);
  const [followUp, setFollowUp] = useState();
  const setModalStatus = useStore((state) => state.setModalStatus);
  const reloadFollowUp = useStore((state) => state.reloadFollowUp);

  const followupGet = async (val) => {
    const resp = await getFollowUp(val);
    setFollowUp(resp.data);
  };

  const followupDelete = async (id) => {
    const resp = await deleteFollowUp(id);
    if (resp.data) {
      setFollowUp((prevStages) =>
        prevStages.filter((stage) => stage.ID !== id)
      );
    }
  };
  const getColorByStatus = (statusID) => {
    const colors = {
      1: "#D03030",
      2: "#0ca474",
      3: "#0ca474",
      4: "#30ACD0",
      5: "#FF8862",
      6: "#D03030",
      7: "#D03030",
      8: "#FF8862",
    };
    return colors[statusID] || "#D03030"; // Default to white if status ID is not found
  };

  const debouncedSearch = useCallback(
    __debounce((val) => {
      followupGet(val);
    }, 500),
    []
  );

  useEffect(() => {
    followupGet();
  }, [reloadFollowUp]);
  //reload followup

  useUpdateEffect(() => {
    debouncedSearch(search);
  }, [search]);

  return followUp?.length > 0 ? (
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
          label={"Add Follow Up"}
          customStyle={{ height: "46px" }}
          onClick={() => setModalStatus(true, "AddFollowUp")}
        />
      </div>
      <div className={styles.stageCards}>
        {followUp.map((card) => (
          <div style={{ width: "300px" }} key={JSON.stringify(card)}>
            <Card
              id={card.ID}
              title={
                <span>
                  {card.Name}
                  <span
                    style={{
                      fontSize: "12px",
                      backgroundColor:
                        getColorByStatus(card.CandidateStatusID) + "20", // Make opacity half
                      color: getColorByStatus(card.CandidateStatusID),
                      marginLeft: "8px",
                      padding: "4px 8px",
                      borderRadius: "16px",
                      display: "inline-block",
                    }}
                  >
                    {card.CandidateStatusName}
                  </span>
                </span>
              }
              description={card.Description}
              onDelete={() => followupDelete(card.ID)}
              onEdit={(type, id) => setModalStatus(true, "AddFollowUp", card)}
              actionsVisible={activeCard === card.ID}
              onExpand={() => setActiveCard(card.ID)}
              onOutsideClick={() => setActiveCard(null)}
              footerStyle={{ border: "none" }}
              cardStyle={{
                border: "1px solid var(--color-stroke-softer-initial)",
              }}
              alignActions="right"
              mode={"customTemplate"}
            ></Card>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className={styles.setupTabContainer}>
      <div className={styles.noStages}>
        <div className={styles.noStageContainer}>
          <img src={empty} alt="empty" style={{ marginTop: "224px" }} />
          <p
            style={{
              marginBottom: "32px",
              fontWeight: "500",
              fontSize: "16px",
              marginTop: "24px",
            }}
          >
            Follow Ups types are empty
          </p>
          <Button
            label="Add Stage"
            onClick={() => setModalStatus(true, "AddFollowUp")}
          ></Button>
        </div>
      </div>
    </div>
  );
}

export default FollowUp;
