import { useEffect, useState, useRef } from "react";
import { getCandidateBasicData } from "../api/CandidateProfileApi";
import { useParams } from "react-router-dom";
import style from "../style/CandidateBasicData.module.scss";
import Tag from "masterComponents/Tag";
import IconID from "@/assets/icons/other/profile/IconID";
import IconPhone from "@/assets/icons/other/profile/IconPhone";
import IconMail from "@/assets/icons/other/profile/IconMail";
import IconLocation from "@/assets/icons/other/profile/IconLocation";
import IconSalary from "@/assets/icons/other/profile/IconSalary";
import IconPerson from "@/assets/icons/other/profile/IconPerson";
import Tooltip from "masterComponents/Tooltip";
import IconAdd from "@/assets/icons/other/profile/IconAdd";
import {
  getCandidateNotes,
  deleteCandidateNote,
  updateCandidateNote,
} from "../api/CandidateProfileApi";
import IconActionDots from "@/assets/icons/other/IconActionDots";
import Popup from "masterComponents/Popup";
import MainButton from "masterComponents/MainButton";
import Textarea from "masterComponents/Textarea";
import Skeleton from "masterComponents/Skeleton";
import { createComment } from "@/pages/candidates/api/CandidatesApi";
import { useCandidateProfileStore } from "../store/CandidateProfileStore";
import { IconEdit } from "@/assets/icons/other/actions/IconEdit";
import { PROFILE_ACTIONS } from "../constants";
import IconTrash from "@/assets/icons/other/IconTrash";
import useUpdateEffect from "@/hooks/useUpdateEffect";

export const CandidateBasicData = () => {
  const { setActionTrigger, actionTrigger, setTotalScore } =
    useCandidateProfileStore();
  const { setStatusID, setCandidateEmail } = useCandidateProfileStore();
  const [addCommentVisible, setAddCommentVisible] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [personalData, setPersonalData] = useState({});
  const [personalDataLoading, setPersonalDataLoading] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const { candidateID, vacancyID } = useParams();
  const [notes, setNotes] = useState([]);
  const [editNoteID, setEditNoteID] = useState(null);

  const [noteActionVisibleOnID, setNoteActionVisibleOnID] = useState(null);
  const noteActionsRef = useRef(null);

  const getCandidateData = async () => {
    try {
      setPersonalDataLoading(true);
      const response = await getCandidateBasicData({
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
      });
      if (response?.data) setPersonalData(response?.data);
      setStatusID(response?.data?.StatusID);
      setCandidateEmail(response?.data?.Email);
      setTotalScore(response?.data?.Score);
    } catch (error) {
      console.log(error);
    } finally {
      setPersonalDataLoading(false);
    }
  };

  const sendComment = async () => {
    try {
      if (editNoteID) {
        await editNote(editNoteID);
        return;
      }
      setLoadingNotes(true);
      const response = await createComment({
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
        Content: commentValue,
      });
      if (!response || response.data?.Error || response.Error) return;
      setCommentValue("");
      setAddCommentVisible(false);
      getCandidateNotesData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingNotes(false);
    }
  };

  const getCandidateNotesData = async () => {
    try {
      setLoadingNotes(true);
      const response = await getCandidateNotes({
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
      });
      if (response?.data) setNotes(response?.data?.reverse());
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingNotes(false);
    }
  };

  const editNote = async (noteID) => {
    try {
      setLoadingNotes(true);
      const response = await updateCandidateNote({
        CandidateVacancyCommentID: Number(noteID),
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
        Content: commentValue,
      });
      if (!response || response.data?.Error || response.Error) return;
      setEditNoteID(null);
      getCandidateNotesData();
      setAddCommentVisible(false);
      setCommentValue("");
      setNoteActionVisibleOnID(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingNotes(false);
    }
  };

  const deleteNote = async (noteID) => {
    try {
      setLoadingNotes(true);
      setNoteActionVisibleOnID(null);
      const response = await deleteCandidateNote({
        CandidateVacancyCommentID: Number(noteID),
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
      });
      if (!response || response.data?.Error || response.Error) return;
      getCandidateNotesData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingNotes(false);
    }
  };

  useEffect(() => {
    getCandidateData();
    getCandidateNotesData();
  }, []);

  useUpdateEffect(() => {
    if (actionTrigger && actionTrigger === PROFILE_ACTIONS.RECALL_BASIC_DATA) {
      setActionTrigger(null);
      getCandidateData();
    }
  }, [actionTrigger]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        noteActionsRef.current &&
        !noteActionsRef.current.contains(event.target)
      ) {
        setNoteActionVisibleOnID(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Popup
        visible={addCommentVisible}
        options={{ title: "Add note", mode: "normal" }}
        size={"small"}
      >
        <Textarea
          textareaStyle={{ width: "100%" }}
          placeholder="Type comment here..."
          value={commentValue}
          onChange={(value) => setCommentValue(value)}
        />
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
            onClick={() => {
              setAddCommentVisible(false);
              setCommentValue("");
            }}
          />
          <MainButton
            label={"Save"}
            loading={loadingNotes}
            onClick={sendComment}
            size={"small"}
            customStyle={{
              background: "#30ACD0",
              border: "0.0625rem solid #30ACD0",
              color: "#fff",
            }}
          />
        </div>
      </Popup>
      <div className="">
        <div className={style.candidateBasicData}>
          <div className={style.candidateBasicDataHeader}>
            <div className={style.avatar}>
              <img src={personalData?.AvatarUrl} alt="avatar" />
            </div>
            <div className={style.nameAndInfo}>
              <h2>{personalData?.CandidateName}</h2>
              <span>{personalData?.VacancyName}</span>
              <span
                style={{
                  color:
                    Number(personalData?.Score) >= 70
                      ? "#0CA474"
                      : Number(personalData?.Score) >= 40
                      ? "#FF8862"
                      : "#E84C3D",
                  fontWeight: 500,
                }}
                className={style.score}
              >{`${
                personalData?.Score
                  ? personalData?.Score + " %"
                  : "Without Score"
              }`}</span>
            </div>
          </div>
          <div className={style.candidateStatuses}>
            {personalData?.Tags?.map((tag, index) => (
              <Tag key={index} label={"tag"} withIcon={false} />
            ))}
            {personalData?.SeniorityName && (
              <Tag
                label={personalData?.SeniorityName}
                withIcon={false}
                type={"purple"}
              />
            )}
          </div>
          <div className={style.candidateInfo}>
            <ul>
              <li>
                <div className={style.icon}>
                  <IconID />
                </div>
                <div className={style.info}>
                  <span>Personal ID</span>
                  {personalDataLoading ? (
                    <Skeleton
                      active={true}
                      paragraph={{ rows: 1, width: [120] }}
                    />
                  ) : (
                    <span>{personalData?.PersonalNumber}</span>
                  )}
                </div>
              </li>
              <li>
                <div className={style.icon}>
                  <IconPhone />
                </div>
                <div className={style.info}>
                  <span>Phone</span>
                  {personalDataLoading ? (
                    <Skeleton
                      active={true}
                      paragraph={{ rows: 1, width: [120] }}
                    />
                  ) : (
                    <span>{personalData?.MobileNumber}</span>
                  )}
                </div>
              </li>
              <li>
                <div className={style.icon}>
                  <IconMail />
                </div>
                <div className={style.info}>
                  <span>Email</span>
                  {personalDataLoading ? (
                    <Skeleton
                      active={true}
                      paragraph={{ rows: 1, width: [120] }}
                    />
                  ) : (
                    <span>{personalData?.Email}</span>
                  )}
                </div>
              </li>
              <li>
                <div className={style.icon}>
                  <IconLocation />
                </div>
                <div className={style.info}>
                  <span>Country/City</span>
                  {personalDataLoading ? (
                    <Skeleton
                      active={true}
                      paragraph={{ rows: 1, width: [120] }}
                    />
                  ) : (
                    <span>
                      {personalData?.Country && personalData?.City
                        ? `${personalData.Country}/${personalData.City}`
                        : personalData?.Country || personalData?.City}
                    </span>
                  )}
                </div>
              </li>
            </ul>
          </div>
          <div className={style.candidateLinks}>
            {personalData?.LinkedinUrl && (
              <a href={personalData?.LinkedinUrl} target="_blank">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <g clipPath="url(#clip0_3071_35456)">
                    <path
                      fill="#027BB6"
                      fillRule="evenodd"
                      d="M2.168 0h-.021A1.683 1.683 0 0 0 .5 1.637a1.7 1.7 0 0 0 1.668 1.675 1.674 1.674 0 0 0 1.636-1.686V1.61A1.674 1.674 0 0 0 2.167.001m-.01 4.306q-.115 0-.232-.004h-.001L1.69 4.3c-.149.001-.336.01-.515.066a.9.9 0 0 0-.52.41C.534 4.98.5 5.215.5 5.45v7.424c0 .236.036.476.16.68a.89.89 0 0 0 .538.398c.178.05.365.051.51.048.074-.001.136-.004.195-.006a6 6 0 0 1 .51 0c.059.002.12.005.194.006.143.003.33.002.508-.048a.88.88 0 0 0 .535-.4c.121-.204.156-.443.156-.678V5.449c0-.233-.035-.468-.15-.67a.9.9 0 0 0-.518-.413 1.7 1.7 0 0 0-.514-.067l-.232.003h-.003q-.116.003-.23.004m6.25.12a3 3 0 0 1 1.449-.25 3.47 3.47 0 0 1 3.64 3.61v5.057c0 .234-.034.472-.154.675a.88.88 0 0 1-.533.403c-.178.05-.365.051-.508.049l-.194-.007c-.082-.003-.16-.006-.26-.006-.099 0-.176.003-.258.006l-.195.007c-.143.002-.33.001-.508-.049a.88.88 0 0 1-.533-.403c-.12-.203-.153-.441-.153-.675v-3.96l.001-.042A.926.926 0 0 0 9.183 7.84a.935.935 0 0 0-.954 1.025l.002.049v3.959c0 .235-.035.474-.157.678a.88.88 0 0 1-.536.4c-.178.05-.366.051-.51.048-.074-.001-.136-.004-.196-.006a6 6 0 0 0-.259-.006c-.1 0-.177.003-.26.006l-.193.006a1.8 1.8 0 0 1-.509-.048.88.88 0 0 1-.533-.403c-.12-.204-.153-.441-.153-.675V5.449c0-.265.048-.53.203-.748a.95.95 0 0 1 .605-.376c.11-.022.25-.028.369-.03.13-.003.276 0 .419.002l.37.01c.14.005.255.009.335.009.342 0 .555.203.678.397q.237-.168.504-.287"
                      clipRule="evenodd"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_3071_35456">
                      <path fill="#fff" d="M0 0h14v14H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
              </a>
            )}
            {personalData?.PortfolioUrl && (
              <a href={personalData?.PortfolioUrl} target="_blank">
                Portfolio
              </a>
            )}
            {personalData?.OtherLinks?.map((link, index) => (
              <a href={link.Url} key={index} target="_blank">
                {
                  link.Url.replace(
                    /^(?:https?:\/\/)?(?:www\.)?([^/]+).*$/,
                    "$1"
                  ).split(".")[0]
                }
              </a>
            ))}
          </div>
        </div>
        <div className={style.salary}>
          <div>
            <div className={style.icon}>
              <IconSalary />
            </div>
            <div className={style.info}>
              <span>Salary Expectation</span>
              <span>{personalData?.SalaryExpectation}</span>
            </div>
          </div>
        </div>
        <div className={style.recruiter}>
          <div>
            <div className={style.icon}>
              <IconPerson />
            </div>
            <div className={style.info}>
              <span>Assigned Recruiter</span>
              {personalData?.Recruiter?.length > 0 && (
                <>
                  <span>
                    {personalData?.Recruiter[0]?.Name}
                    {personalData?.Recruiter?.length > 1 && (
                      <Tooltip
                        label={
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.25rem",
                              flexWrap: "wrap",
                            }}
                          >
                            {personalData?.Recruiter?.slice(1)
                              ?.map((r, i) => (
                                <span key={i}>{r?.Name || ""}</span>
                              ))
                              .filter(Boolean)}
                          </div>
                        }
                      >
                        <span className={style.moreRecruiters}>
                          +{personalData?.Recruiter?.length - 1}
                        </span>
                      </Tooltip>
                    )}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className={style.notes}>
          <div className={style.notesHeader}>
            <span>Notes</span>
            <span
              className={style.addNote}
              onClick={() => setAddCommentVisible(true)}
            >
              <IconAdd />
            </span>
          </div>
          <div className={style.notesList}>
            {loadingNotes ? (
              <Skeleton active={true} paragraph={{ rows: 3 }} />
            ) : (
              <>
                {notes.map((note, index) => (
                  <div key={index} className={style.note}>
                    <div className={style.top}>
                      <span>
                        {new Date(note?.CreateTime).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                      <div
                        className={style.noteAction}
                        onClick={() => setNoteActionVisibleOnID(note?.ID)}
                      >
                        <IconActionDots />
                      </div>
                      {noteActionVisibleOnID === note?.ID && (
                        <div
                          ref={noteActionsRef}
                          className={style.noteActionsList}
                        >
                          <div
                            onClick={() => {
                              setEditNoteID(note?.ID);
                              setCommentValue(note?.Content);
                              setAddCommentVisible(true);
                            }}
                          >
                            <IconEdit />
                            <span>Edit</span>
                          </div>
                          <div onClick={() => deleteNote(note?.ID)}>
                            <IconTrash />
                            <span>Delete</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={style.middle}>
                      <p>{note?.Content}</p>
                    </div>
                    <div className={style.bottom}>
                      <span>Created: {note.AuthorName}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
