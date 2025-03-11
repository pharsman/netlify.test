import {
  getCandidateMessages,
  sendCandidateMessage,
  sendCandidateMessageAsReceiver,
} from "../api/CandidateProfileApi";
import style from "../style/Messages.module.scss";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import FormDropdown from "masterComponents/FormDropdown";
import { getCandidateFollowUpContent } from "../api/CandidateProfileApi";
import Skeleton from "masterComponents/Skeleton";
import {
  getFollowUpContent,
  getFollowUps,
} from "@/pages/candidates/api/CandidatesApi";
import { useCandidateProfileStore } from "../store/CandidateProfileStore";
// import Search from "masterComponents/Search";
import Loader from "masterComponents/Loader";
import { createNotification } from "masterComponents/Notification";
import Tooltip from "masterComponents/Tooltip";
// import useUpdateEffect from "@/hooks/useUpdateEffect";

export const Messages = () => {
  const { candidateEmail } = useCandidateProfileStore();
  const { candidateID, vacancyID } = useParams();
  const [selectedSenderType, setSelectedSenderType] = useState(2);
  const [isFollowUpsVisible, setIsFollowUpsVisible] = useState(false);
  const [isFollowUpContentLoading, setIsFollowUpContentLoading] =
    useState(false);
  const [followUps, setFollowUps] = useState([]);
  const [messageValue, setMessageValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [selectedFollowUpId, setSelectedFollowUpId] = useState(null);
  const [subject, setSubject] = useState("");
  const messagesContentRef = useRef(null);
  //   const [searchMessages, setSearchMessages] = useState("");
  const [isEmojiesVisible, setIsEmojiesVisible] = useState(false);
  const emojies = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😙 ",
    "😚",
    "😋",
    "😛",
    "😎",
    "🥳",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "👋",
  ];

  const getFollowUpsData = async () => {
    try {
      await getFollowUps().then((response) => {
        if (!response || response.Error || response.data?.Error) return;
        const data = response.data.map((item) => ({
          label: `${item.Name} - ${item.CandidateStatusName}`,
          id: item.ID,
        }));
        setFollowUps(data);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const getTabData = async () => {
    try {
      setMessagesLoading(true);
      await getCandidateMessages({
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
      }).then((response) => {
        if (!response || response.Error || response.data?.Error) return;
        setMessages(response.data);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const getAndSetFollowUpContent = async (id) => {
    try {
      setIsFollowUpContentLoading(true);
      await getCandidateFollowUpContent({
        VacancyID: Number(vacancyID),
        CandidateID: Number(candidateID),
        FollowUpID: id,
      }).then((response) => {
        if (!response || response.Error || response.data?.Error) {
          setIsFollowUpsVisible(false);
          return;
        }
        const followUpContent = response.data[0] ? response.data[0] : null;
        setSelectedFollowUpId(id);
        setMessageValue(followUpContent?.BodyWithoutHtml);
        setIsFollowUpsVisible(false);
      });
    } catch (error) {
      console.log(error);
      setIsFollowUpsVisible(false);
    } finally {
      setIsFollowUpContentLoading(false);
    }
  };

  const sendMessage = async () => {
    if (
      !messageValue ||
      messageValue.trim() === "" ||
      messageValue.length < 1
    ) {
      createNotification(
        "Please enter a message",
        "error",
        3500,
        "top-right",
        2
      );
      return;
    }

    if (
      (subject.trim() === "" || subject.length < 1) &&
      selectedSenderType === 2
    ) {
      createNotification(
        "Please enter a subject",
        "error",
        3500,
        "top-right",
        2
      );
      return;
    }

    const caller =
      selectedSenderType === 1
        ? sendCandidateMessageAsReceiver
        : sendCandidateMessage;
    let dataSet;

    if (selectedSenderType === 1) {
      dataSet = {
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
        Body: messageValue,
      };
    }

    if (selectedSenderType === 2) {
      dataSet = {
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
        FollowUpID: selectedFollowUpId,
        ToEmail: candidateEmail,
        Subject: subject,
        Body: messageValue,
      };
    }
    setMessagesLoading(true);
    try {
      await caller(dataSet).then((response) => {
        if (!response || response.Error || response.data?.Error) return;
        setMessageValue("");
        getTabData();
        setSubject("");
        setSelectedFollowUpId(null);
        if (messagesContentRef.current) {
          messagesContentRef.current.scrollTo({
            top: messagesContentRef.current.scrollHeight + 300,
            behavior: "smooth",
          });
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    getFollowUpsData();
    getTabData();
  }, []);

  return (
    <div className={style.messages}>
      <div className={style.messagesHeader}>
        {/* <div className={style.searchMessagesField}>
          <Search
            placeholder="Search messages"
            size="small"
            change={(value) => setSearchMessages(value)}
          />
        </div> */}
        {/* <div className={style.searchMessages}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
          >
            <path
              stroke="#15181A"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M7.667 14a6.333 6.333 0 1 0 0-12.666 6.333 6.333 0 0 0 0 12.667M14.667 14.667l-1.334-1.333"
            ></path>
          </svg>
        </div> */}
      </div>

      <div className={style.messagesBody}>
        {messagesLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Loader loading={true} />
          </div>
        )}
        <div className={style.messagesContent} ref={messagesContentRef}>
          <ul>
            {messages?.map((msg, index) => {
              return (
                <li
                  key={index}
                  className={`${style.messageItem} ${
                    msg?.AsReceiver ? style.sender : style.receiver
                  }`}
                >
                  <div className={style.avatar}>
                    <img src={msg.AvatarUrl} alt="avatar" />
                  </div>
                  <div className={style.messageItemContent}>
                    <div className={style.messageDate}>{msg?.SendDate}</div>

                    <p>
                      <span className={style.msgSubject}>
                        To: <span>{msg?.ToEmail ?? "-"}</span>
                      </span>
                      <span className={style.msgSubject}>
                        Subject: <span>{msg?.subject ?? "Empty"}</span>
                      </span>
                      <span className={style.msg}>{msg?.Body}</span>
                    </p>
                    <div
                      className={`${style.messageStatus} ${
                        msg.IsSuccess ? style.success : style.failed
                      }`}
                    >
                      {msg.IsSuccess ? "Sent Successfully" : "Send Failed"}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className={style.messagesFooter}>
        <div className={style.senderType}>
          <FormDropdown
            key={selectedSenderType}
            label={"Send As"}
            data={[
              {
                label: "Receiver",
                id: 1,
              },
              {
                label: "Sender",
                id: 2,
              },
            ]}
            selectedOptionID={selectedSenderType}
            selected={(obj) => setSelectedSenderType(obj.id)}
          />
        </div>
        <div className={style.messageField}>
          <div className={style.messageFieldTo}>
            <span>to</span>
            <input
              type="text"
              placeholder="To"
              value={candidateEmail}
              readOnly={true}
            />
          </div>
          <div className={style.messageFieldSubject}>
            <input
              placeholder="Subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className={style.messageFieldArea}>
            {isFollowUpsVisible && followUps.length > 0 ? (
              <div className={style.chooseFollowUp}>
                {isFollowUpContentLoading && (
                  <Skeleton active={true} paragraph={{ rows: 1 }} />
                )}
                {followUps?.map((item, index) => (
                  <div
                    key={index}
                    className={style.followUpItem}
                    onClick={() => getAndSetFollowUpContent(item.id)}
                  >
                    <div>{item.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <textarea
                placeholder="Type text here or select feedback template"
                value={messageValue}
                onChange={(e) => setMessageValue(e.target.value)}
              />
            )}
          </div>
          <div className={style.messageFieldButtons}>
            <div className={style.messageAdditionalActions}>
              {followUps?.length > 0 && (
                <div onClick={() => setIsFollowUpsVisible(!isFollowUpsVisible)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <rect width="24" height="24" fill="#E9EBEC" rx="4"></rect>
                    <path
                      fill="#0F1215"
                      d="M18.18 9.673h-2.326l1.163-3.299a.582.582 0 0 0-1.1-.384l-1.32 3.683h-3.98l1.164-3.3a.582.582 0 1 0-1.1-.383l-1.32 3.683H6.545a.582.582 0 1 0 0 1.163h2.409l-.815 2.327H5.382a.582.582 0 0 0 0 1.164h2.327l-1.164 3.298a.582.582 0 0 0 1.1.384l1.32-3.682h3.98l-1.164 3.298a.582.582 0 1 0 1.1.384l1.32-3.682h2.816a.582.582 0 1 0 0-1.164H14.61l.814-2.327h2.758a.582.582 0 1 0 0-1.163m-4.805 3.49H9.373l.814-2.327h4.003z"
                    ></path>
                  </svg>
                </div>
              )}
              <div>
                <Tooltip
                  trigger={["click"]}
                  label={
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "0.5rem",
                      }}
                    >
                      {emojies?.map((e, i) => (
                        <div
                          style={{
                            cursor: "pointer",
                          }}
                          key={i}
                          onClick={() => setMessageValue(messageValue + e)}
                        >
                          {e}
                        </div>
                      ))}
                    </div>
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <rect width="24" height="24" fill="#E9EBEC" rx="4"></rect>
                    <path
                      stroke="#0F1215"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.98 18.667a6.667 6.667 0 1 0 0-13.333 6.667 6.667 0 0 0 0 13.333"
                    ></path>
                    <path
                      stroke="#0F1215"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.807 14.666A3.89 3.89 0 0 0 12 16.333c1.32 0 2.487-.66 3.193-1.667"
                    ></path>
                    <circle
                      cx="9.333"
                      cy="10.667"
                      r="0.667"
                      fill="#0F1215"
                    ></circle>
                    <circle
                      cx="14.667"
                      cy="10.667"
                      r="0.667"
                      fill="#0F1215"
                    ></circle>
                  </svg>
                </Tooltip>
              </div>
            </div>
            <div className={style.send} onClick={sendMessage}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#555F62"
                  d="M18.07 8.51 9.51 4.23C3.76 1.35 1.4 3.71 4.28 9.46l.87 1.74c.25.51.25 1.1 0 1.61l-.87 1.73c-2.88 5.75-.53 8.11 5.23 5.23l8.56-4.28c3.84-1.92 3.84-5.06 0-6.98m-3.23 4.24h-5.4c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h5.4c.41 0 .75.34.75.75s-.34.75-.75.75"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
