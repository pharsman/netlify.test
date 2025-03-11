import IconStar from "@/assets/icons/other/IconStar";
import style from "../style/CandidateCard.module.scss";
import IconActionDots from "@/assets/icons/other/IconActionDots";
import { cardActions } from "../static/cardActions";
import { useState, useRef, useEffect } from "react";
import Tag from "masterComponents/Tag";
import { useNavigate } from "react-router-dom";
import { useCandidatesStore } from "../store/CandidatesStore";
import {
  setCandidateShareWithHead,
  setCandidateVacancyFavorite,
  setCandidateMarkAsBlackListed,
  setCandidateArchive,
} from "../api/CandidatesApi";
import { createNotification } from "masterComponents/Notification";
import { CandidateActionTypes } from "../constants";

export const CandidateCard = ({ data, vacancyID }) => {
  const {
    setUpdateCandidateID,
    setActionTrigger,
    setSendFollowUpTo,
    setViewCommentsTo,
  } = useCandidatesStore();
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const actionsRef = useRef(null);
  const isLocalhost = window.location.hostname === "localhost";

  const navigate = useNavigate();
  const handleActions = (action) => {
    switch (action.type) {
      case "EDIT":
        setUpdateCandidateID({
          CandidateID: data.CandidateID,
          VacancyID: vacancyID,
        });
        break;
      case "SHARE_TO_MANAGER":
        setCandidateShareWithHead({
          CandidateID: data.CandidateID,
          VacancyID: vacancyID,
        }).then((response) => {
          if (!response || response.data?.Error || response.Error) return;
          setActionTrigger(
            CandidateActionTypes.REQUEST_TYPES.RELOAD_CANDIDATES_DATA
          );
          createNotification(
            "Shared to Manager",
            "success",
            1000,
            "top-right",
            2
          );
        });
        break;
      case "MARK_AS_BLACKLISTED":
        setCandidateMarkAsBlackListed({
          CandidateID: data.CandidateID,
          VacancyID: vacancyID,
        }).then((response) => {
          if (!response || response.data?.Error || response.Error) return;
          setActionTrigger(
            CandidateActionTypes.REQUEST_TYPES.RELOAD_CANDIDATES_DATA
          );
          createNotification(
            "Marked as Blacklisted",
            "success",
            1000,
            "top-right",
            2
          );
        });
        break;
      case "MOVE_TO_DATABASE":
        setCandidateArchive({
          CandidateID: data.CandidateID,
          VacancyID: vacancyID,
        }).then((response) => {
          if (!response || response.data?.Error || response.Error) return;
          setActionTrigger(
            CandidateActionTypes.REQUEST_TYPES.RELOAD_CANDIDATES_DATA
          );
          createNotification(
            "Moved to Database",
            "success",
            1000,
            "top-right",
            2
          );
        });
        break;
      case "SEND_FOLLOW_UP":
        setSendFollowUpTo({
          CandidateID: data.CandidateID,
          VacancyID: vacancyID,
        });
        break;
      case "SEE_COMMENT":
        setViewCommentsTo({
          CandidateID: data.CandidateID,
          VacancyID: vacancyID,
        });
        break;
    }
    setIsActionsOpen(false);
  };

  const toggleFavorite = async (CandidateID, VacancyID) => {
    await setCandidateVacancyFavorite({
      CandidateID,
      VacancyID,
    }).then((response) => {
      console.log(response);
      if (!response || response.data?.Error || response.Error) return;
      setActionTrigger(
        CandidateActionTypes.REQUEST_TYPES.RELOAD_CANDIDATES_DATA
      );
      createNotification(
        `${
          !response?.data?.IsFavorite ? "Removed from" : "Added to"
        } Favorites`,
        "success",
        1000,
        "top-right",
        2
      );
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setIsActionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={style.candidateCard}>
      <div className={style.actions} ref={actionsRef}>
        <div
          className={style.openActions}
          onClick={() => setIsActionsOpen(!isActionsOpen)}
        >
          <IconActionDots />
        </div>
        {isActionsOpen && (
          <div
            className={style.actionsDropdown}
            style={{ position: "absolute", top: "100%", left: "0" }}
          >
            {cardActions.map((action, index) => (
              <div
                key={index}
                className={style.actionItem}
                onClick={() => handleActions(action)}
              >
                <div className={style.actionIcon}>{action.svg}</div>
                <div className={style.actionName}>
                  <span>{action.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={style.candidateInfo}>
        <div className={style.candidateAvatar}>
          {!data?.AvatarUrl ? (
            <div
              className={style.noAvatar}
              onClick={() =>
                navigate(
                  `${
                    isLocalhost
                      ? "/candidateProfile"
                      : "/recruitment/oneadmin/front/candidateProfile"
                  }/${vacancyID}/${data?.CandidateID}`
                )
              }
            >
              <span>{data?.FullName.slice(0, 2)}</span>
            </div>
          ) : (
            <div
              className={style.avatar}
              onClick={() =>
                navigate(
                  `${
                    isLocalhost
                      ? "/candidateProfile"
                      : "/recruitment/oneadmin/front/candidateProfile"
                  }/${vacancyID}/${data?.CandidateID}`
                )
              }
            >
              <img src={data?.AvatarUrl} />
            </div>
          )}
        </div>
        <div className={style.candidateName}>
          <div>
            <span
              onClick={() =>
                navigate(
                  `${
                    isLocalhost
                      ? "/candidateProfile"
                      : "/recruitment/oneadmin/front/candidateProfile"
                  }/${vacancyID}/${data?.CandidateID}`
                )
              }
            >
              {data?.FullName}
            </span>
            <div
              style={{ cursor: "pointer" }}
              className={style.isFavourite}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(data?.CandidateID, vacancyID);
              }}
            >
              <IconStar isFilled={data?.IsFavorite} />
            </div>
          </div>
          <span className={style.score}>Score</span>
        </div>
      </div>
      <div className={style.tags}>
        {data?.Tags?.map((tag, index) => (
          <Tag
            key={index}
            label={tag.Name}
            withIcon={false}
            allowDelete={false}
            withTooltip={true}
            type={tag.Name === "Black List" ? "gray " : "red"}
          />
        ))}
        {data?.SeniorityName && (
          <Tag
            label={data?.SeniorityName}
            withIcon={false}
            allowDelete={false}
            withTooltip={true}
            type={"purple"}
          />
        )}
      </div>
    </div>
  );
};
