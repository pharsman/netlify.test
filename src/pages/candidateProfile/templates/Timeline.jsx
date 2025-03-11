import style from "../style/Timeline.module.scss";
import { useParams } from "react-router-dom";
import { getCandidateTimeline } from "../api/CandidateProfileApi";
import { useState, useEffect, useRef } from "react";
import IconActionDots from "@/assets/icons/other/IconActionDots";
import Skeleton from "masterComponents/Skeleton";
import Popup from "masterComponents/Popup";
import MainButton from "masterComponents/MainButton";
import {
  getCandidateFeedback,
  getCandidateVacancyStageDetails,
} from "../api/CandidateProfileApi";
import Loader from "masterComponents/Loader";

export const Timeline = () => {
  const { candidateID, vacancyID } = useParams();
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupDetailsVisible, setPopupDetailsVisible] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [vacancyStageDetails, setVacancyStageDetails] = useState(null);
  const [vacancyStageDetailsLoading, setVacancyStageDetailsLoading] =
    useState(false);

  const getTabData = async () => {
    try {
      setLoading(true);

      await getCandidateTimeline({
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
      }).then((response) => {
        setTimelineData(
          response?.data.map((e) => ({
            ...e,
            actionVisibleID: crypto.randomUUID(),
          }))
        );
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
    }
  };

  const getStatusColorByLabel = (label) => {
    switch (label) {
      case "Without Status":
        return "#808080";
      case "Offer Accepted":
        return "#0CA474";
      case "Hired":
        return "#0CA474";
      case "On Hold":
        return "#D08B30";
      case "Reserved":
        return "#D08B30";
      case "Offer Rejected":
        return "#E74C3C";
      case "Candidate Refusal":
        return "#D03053";
      case "Offered":
        return "#0CA474";
      case "Under Review":
        return "#D08B30";
      case "Rejected":
        return "#D03053";
      default:
        return "#808080";
    }
  };

  const getAndSetFeedback = async () => {
    try {
      setFeedbackLoading(true);
      setPopupVisible(true);
      await getCandidateFeedback({
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
      }).then((response) => {
        setFeedback(response?.data);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const getAndSetDetails = async () => {
    try {
      setVacancyStageDetailsLoading(true);
      setPopupDetailsVisible(true);
      await getCandidateVacancyStageDetails({
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
      }).then((response) => {
        setVacancyStageDetails(response?.data);
        console.log(response?.data);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setVacancyStageDetailsLoading(false);
    }
  };

  useEffect(() => {
    getTabData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".actionDropdownTimeline")) {
        setActionsVisible(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={style.timelineTab}>
      <Popup
        visible={popupDetailsVisible}
        options={{ title: "Stages & Score", mode: "normal" }}
        size={"medium"}
      >
        <div className={style.stageScoreContent}>
          {vacancyStageDetailsLoading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Loader loading={true} />
            </div>
          ) : (
            <div className={style.stagingDetails}>
              <div className={style.stageComments}>
                {vacancyStageDetails?.Comments?.map((comment, index) => (
                  <div className={style.stageComment} key={index}>
                    <span>
                      {new Date(comment?.CreateTime).toLocaleDateString(
                        "en-US",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </span>
                    <p>{comment?.Content}</p>
                    <span>Author: {comment?.AuthorName}</span>
                  </div>
                ))}
              </div>
              <div className={style.stageDetails}>
                {vacancyStageDetails?.Stages?.map((stage, index) => (
                  <div className={style.stageDetail} key={index}>
                    <span>{stage?.Name}</span>
                    <p>
                      {stage?.Score ? "Score -" : "Without Score"}{" "}
                      <span
                        style={{
                          color:
                            stage?.Score >= 75
                              ? "#10B77F"
                              : stage?.Score >= 50
                              ? "#FFA800"
                              : "#FF4D4F",
                        }}
                      >
                        {stage?.Score ? stage?.Score + " %" : ""}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <MainButton
            label={"Close"}
            type={"border"}
            size={"small"}
            customStyle={{ color: "#141719", borderColor: "#D1D5D6" }}
            onClick={() => setPopupDetailsVisible(false)}
          />
        </div>
      </Popup>
      <Popup
        visible={popupVisible}
        options={{ title: "Feedbacks", mode: "normal" }}
        size={"small"}
      >
        <div className={style.feedbackContent}>
          {feedbackLoading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Loader loading={true} />
            </div>
          ) : (
            <>
              {feedback && Object.keys(feedback).length > 0 ? (
                <>
                  <span>
                    {new Date(feedback?.CreateDate)
                      .toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                      .replace(/\//g, ".")}
                  </span>
                  <p>{feedback?.Body}</p>
                </>
              ) : (
                <p>No feedback available</p>
              )}
            </>
          )}
        </div>

        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <MainButton
            label={"Close"}
            type={"border"}
            size={"small"}
            customStyle={{ color: "#141719", borderColor: "#D1D5D6" }}
            onClick={() => setPopupVisible(false)}
          />
        </div>
      </Popup>
      <div className={style.timelineHeader}>
        <h2>Applicant Timeline</h2>
      </div>

      <div className={style.timelineContent}>
        {loading ? (
          <Skeleton active={true} paragraph={{ rows: 4 }} />
        ) : (
          <ul>
            {timelineData.length > 0 &&
              timelineData.map((item, index) => (
                <li key={index} className={style.timelineItem}>
                  <h2 className={style.timelineTitle}>
                    {item.IsCurrent && "Current"}{" "}
                    {new Date(item?.ApplyDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </h2>
                  <div className={style.timelineItemContent}>
                    <div className={style.left}>
                      <span
                        style={{
                          color: getStatusColorByLabel(item?.StatusName),
                        }}
                        className={style.status}
                      >
                        {item?.StatusName}
                      </span>
                      <h3 className={style.jobTitle}>{item?.VacancyName}</h3>

                      <span className={style.assignedTo}>
                        Assigned To: <span>{item?.Recruiters}</span>
                      </span>
                    </div>
                    <div className={style.right}>
                      <div className={style.lastStage}>
                        <span>Last Stage</span>
                        <span>
                          <div className={style.dotMark}></div>
                          {item?.StageName}
                        </span>
                      </div>

                      <div className={style.score}>
                        <span>Score</span>
                        <h1
                          style={{
                            color:
                              item?.Score >= 75
                                ? "#10B77F"
                                : item?.Score >= 50
                                ? "#FFA800"
                                : "#FF4D4F",
                          }}
                        >
                          {item?.Score}
                        </h1>
                      </div>
                      <div className={style.actions}>
                        <div
                          className={`${style.actionButton} actionDropdownTimeline`}
                          onClick={() =>
                            setActionsVisible(item?.actionVisibleID)
                          }
                        >
                          <IconActionDots />
                        </div>
                        {actionsVisible === item?.actionVisibleID && (
                          <div
                            className={`${style.actionDropdown} actionDropdownTimeline`}
                          >
                            <div
                              className={style.actionItem}
                              onClick={() => {
                                getAndSetFeedback();
                              }}
                            >
                              <span>Feedback</span>
                            </div>
                            <div
                              className={style.actionItem}
                              onClick={() => getAndSetDetails()}
                            >
                              <span>Stages & Scoring</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};
