import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Card from "masterComponents/Card";
import style from "@/pages/vacancies/style/SortableItem.module.scss";
import Tooltip from "masterComponents/Tooltip";
import { __formatDate } from "@/utils/helpers";
import { useVacanciesStore } from "../store/VacanciesStore";
import { storeActionTypes } from "../constants";
import { RequestVacancy } from "../templates/RequestVacancy";
import { deleteRequestVacancy } from "../api/VacanciesApi";
export default function SortableItem({ id, data, color, hideAddUser }) {
  // const { attributes, listeners, setNodeRef, transform, transition } =
  //   useSortable({ id });

  // const style = {
  //   transform: CSS.Transform.toString(transform),
  //   transition,
  // };

  return (
    <div>
      <div>
        <Item id={id} data={data} color={color} hideAddUser={hideAddUser} />
      </div>
    </div>
  );
}

export function Item({ id, data, color, hideAddUser }) {
  const {
    setController,
    openCardActions,
    setActionTrigger,
    setOpenCardActions,
    setOpenVacancyDetails,
    setOpenVacancyComments,
    setAssignRecruiterTo,
  } = useVacanciesStore((state) => state);
  const recruiters = data?.Recruiters || [];
  const visibleRecruiters = recruiters.slice(0, 2) || [];
  const hiddenRecruiters = recruiters.slice(2, recruiters.length) || [];
  const cardActions = [
    {
      label: "Edit",
      type: "edit",
      event: (type, data) => handleActions(type, data),
      icon: () => "",
    },
    {
      label: "Delete",
      type: "delete",
      event: (type, data) => handleActions(type, data),
      icon: () => "",
    },
    {
      label: "Open",
      type: "open",
      event: (type, data) => handleActions(type, data),
      icon: () => (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.6665 7.33337L14.1332 1.8667"
            stroke="#141719"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.6668 4.5335V1.3335H11.4668"
            stroke="#141719"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.3335 1.3335H6.00016C2.66683 1.3335 1.3335 2.66683 1.3335 6.00016V10.0002C1.3335 13.3335 2.66683 14.6668 6.00016 14.6668H10.0002C13.3335 14.6668 14.6668 13.3335 14.6668 10.0002V8.66683"
            stroke="#141719"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: "See Comment",
      type: "see_comment",
      event: (type, data) => handleActions(type, data),
      icon: () => (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.66683 12.6668H5.3335C2.66683 12.6668 1.3335 12.0002 1.3335 8.66683V5.3335C1.3335 2.66683 2.66683 1.3335 5.3335 1.3335H10.6668C13.3335 1.3335 14.6668 2.66683 14.6668 5.3335V8.66683C14.6668 11.3335 13.3335 12.6668 10.6668 12.6668H10.3335C10.1268 12.6668 9.92683 12.7668 9.80016 12.9335L8.80016 14.2668C8.36016 14.8535 7.64016 14.8535 7.20016 14.2668L6.20016 12.9335C6.0935 12.7868 5.84683 12.6668 5.66683 12.6668Z"
            stroke="#141719"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.6641 7.33333H10.6701"
            stroke="#141719"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.99715 7.33333H8.00314"
            stroke="#141719"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.32967 7.33333H5.33566"
            stroke="#141719"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  const tooltipTemplate = () => {
    return (
      <div className={style.hiddenUsersListWrapper}>
        <ul className={style.hiddenUsersList}>
          {hiddenRecruiters &&
            hiddenRecruiters.map((recruiter, index) => {
              return (
                <li key={index}>
                  <div
                    key={index}
                    className={style.avatar}
                    style={{
                      background: recruiter.AvatarUrl ? "" : "#E1E4E5",
                      border: recruiter?.IsActive
                        ? `0.125rem solid #EFBD4E`
                        : "",
                      padding: recruiter?.IsActive ? `0.0625rem` : "",
                    }}
                  >
                    {recruiter?.AvatarUrl ? (
                      <img
                        style={{
                          borderRadius: recruiter?.IsActive ? "50%" : "",
                        }}
                        src={recruiter?.AvatarUrl}
                      />
                    ) : (
                      <span style={{ color: "#00ADEE" }}>
                        {recruiter.Name ? recruiter.Name.split("")[0] : ""}
                      </span>
                    )}
                  </div>
                  <span>{recruiter?.Name}</span>
                </li>
              );
            })}
        </ul>
      </div>
    );
  };

  const handleActions = async (type, data) => {
    switch (type) {
      case "edit": {
        setController({
          actionType: storeActionTypes.OPEN_MODAL,
          requestType: storeActionTypes.REQUEST_TYPES.REQUEST_VACANCY,
          modalOptions: {
            renderTemplate: () => <RequestVacancy editMode={true} ID={data} />,
          },
        });
        break;
      }
      case "open": {
        setOpenVacancyDetails(data);
        break;
      }
      case "delete": {
        await deleteRequestVacancy({ VacancyID: data }).then(() => {
          setActionTrigger(
            storeActionTypes.REQUEST_ACTIONS.GET_VACANCY_BOARD_DATA
          );
        });
        break;
      }
      case "see_comment": {
        setOpenVacancyComments(data);
        break;
      }
    }
  };

  return (
    <Card
      id={id}
      title={
        `${data?.FreePositionsCount ? `(${data.FreePositionsCount})` : ""} ${
          data?.JobName
        }` || "Job"
      }
      subTitle={data?.UnitHeadName || "Unit Head"}
      mode={"customTemplate"}
      cardStyle={{
        borderTop: `0.125rem solid ${color}`,
        maxHeight: "13rem",
      }}
      actions={cardActions.filter((el) => {
        if (
          [3, 4, 5, 6, 7, 8].includes(data.StatusID) &&
          ["edit", "delete"].includes(el.type)
        ) {
          return false;
        }

        if (el.type === "see_comment" && !data?.HaveComments) {
          return false;
        }

        return el; // Return the item itself
      })}
      onOutsideClick={() => (openCardActions ? setOpenCardActions(null) : null)}
      onExpand={() => setOpenCardActions(id)}
      actionsVisible={openCardActions === id}
      description={() => {
        return data.AdditionalDetails ? (
          <div className={style.cardMiddleContent}>
            <div className={style.topContentWrapper}>
              <p>
                Days Placed - <span>{data?.AdditionalDetails?.DaysPlaced}</span>
              </p>
              <p>
                End Date -{" "}
                <span>
                  {data?.AdditionalDetails?.EndDate
                    ? __formatDate(
                        data?.AdditionalDetails?.EndDate,
                        "DD.MM.YYYY"
                      )
                    : ""}
                </span>
                <svg
                  width="12"
                  height="13"
                  viewBox="0 0 12 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    marginLeft: "0.1875rem",
                    verticalAlign: "bottom",
                  }}
                >
                  <g clipPath="url(#clip0_2107_36320)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.28571 6.5C1.28571 3.89637 3.39637 1.78571 6 1.78571C6.25743 1.78571 6.50961 1.80629 6.75507 1.84577C7.10561 1.90213 7.43547 1.66367 7.49185 1.31313C7.54821 0.96259 7.30975 0.632727 6.95921 0.576357C6.64649 0.526069 6.32607 0.5 6 0.5C2.68629 0.5 0 3.18629 0 6.5C0 9.81371 2.68629 12.5 6 12.5C7.96313 12.5 9.70611 11.5565 10.7997 10.1009C11.0129 9.81714 10.9557 9.41411 10.6719 9.20086C10.388 8.98758 9.98503 9.04481 9.77177 9.32866C8.9106 10.4749 7.54173 11.2143 6 11.2143C3.39637 11.2143 1.28571 9.10366 1.28571 6.5ZM6.64286 3.5C6.64286 3.14496 6.35504 2.85714 6 2.85714C5.64496 2.85714 5.35714 3.14496 5.35714 3.5V6.92857C5.35714 7.15439 5.47562 7.36364 5.66925 7.47982L7.81211 8.76553C8.11655 8.9482 8.51144 8.84948 8.69409 8.54503C8.87674 8.24059 8.77809 7.84571 8.4736 7.66304L6.64286 6.56459V3.5ZM11.1867 5.00815C11.5373 4.95179 11.8671 5.19025 11.9235 5.54079C11.9738 5.85351 11.9999 6.17393 11.9999 6.5C11.9999 6.82607 11.9738 7.14649 11.9235 7.45921C11.8671 7.80975 11.5373 8.04821 11.1867 7.99185C10.8363 7.93547 10.5977 7.60561 10.6541 7.25507C10.6936 7.00961 10.7142 6.75743 10.7142 6.5C10.7142 6.24257 10.6936 5.99039 10.6541 5.74493C10.5977 5.39439 10.8363 5.06453 11.1867 5.00815ZM9.60086 1.70033C9.31697 1.48706 8.91403 1.54428 8.70077 1.82813C8.48748 2.11199 8.5447 2.51498 8.82857 2.72825C9.18557 2.9965 9.5034 3.31429 9.77169 3.67134C9.98494 3.95519 10.3879 4.01242 10.6718 3.79915C10.9556 3.58589 11.0128 3.1829 10.7996 2.89904C10.4586 2.44517 10.0547 2.04132 9.60086 1.70033Z"
                      fill="#141719"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2107_36320">
                      <rect
                        width="12"
                        height="12"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </p>
            </div>
            <div className={style.bottomContentWrapper}>
              <div className={style.numberPanel}>
                <p>View</p>
                <span>{data?.AdditionalDetails?.ViewsCount}</span>
              </div>
              <div className={style.numberPanel}>
                <p>Applied</p>
                <span>{data?.AdditionalDetails?.ApplicationsCount}</span>
              </div>
            </div>
          </div>
        ) : (
          ""
        );
      }}
    >
      <div className={style.cardBottomPanelWrapper}>
        <div className={style.leftSidePanel}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.00016 7.58366C7.96666 7.58366 8.75016 6.80016 8.75016 5.83366C8.75016 4.86716 7.96666 4.08366 7.00016 4.08366C6.03366 4.08366 5.25016 4.86716 5.25016 5.83366C5.25016 6.80016 6.03366 7.58366 7.00016 7.58366Z"
              stroke="#6F787B"
              strokeWidth="1.16667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.00016 12.8337C9.3335 10.5003 11.6668 8.41099 11.6668 5.83366C11.6668 3.25633 9.57749 1.16699 7.00016 1.16699C4.42283 1.16699 2.3335 3.25633 2.3335 5.83366C2.3335 8.41099 4.66683 10.5003 7.00016 12.8337Z"
              stroke="#6F787B"
              strokeWidth="1.16667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{data?.OfficeName ?? "Office"}</span>
        </div>
        <div className={style.rightSidePanel}>
          <div className={style.recruitersList}>
            {!hideAddUser ? (
              <div
                className={`${style.addRecruiter} no-drag`}
                onClick={() => {
                  setAssignRecruiterTo({
                    id: id,
                    recruiters: JSON.stringify(data?.Recruiters),
                  });
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.5 7H10.5"
                    stroke="#141719"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 10.5V3.5"
                    stroke="#141719"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ) : (
              ""
            )}

            {visibleRecruiters &&
              visibleRecruiters?.map((recruiter, index) => {
                return (
                  <Tooltip label={recruiter?.Name || ""} key={index}>
                    <div
                      className={style.avatar}
                      style={{
                        background: recruiter.AvatarUrl ? "" : "#E1E4E5",
                        border: recruiter?.IsActive
                          ? `0.125rem solid #EFBD4E`
                          : "",
                        padding: recruiter?.IsActive ? `0.0625rem` : "",
                      }}
                    >
                      {recruiter?.AvatarUrl ? (
                        <img
                          style={{
                            borderRadius: recruiter?.IsActive ? "50%" : "",
                          }}
                          src={recruiter?.AvatarUrl}
                        />
                      ) : (
                        <span style={{ color: "#00ADEE" }}>
                          {recruiter.Name ? recruiter.Name.split("")[0] : ""}
                        </span>
                      )}
                    </div>
                  </Tooltip>
                );
              })}
            {hiddenRecruiters && hiddenRecruiters?.length ? (
              <Tooltip
                color={"#FFFFFF"}
                label={tooltipTemplate(hiddenRecruiters)}
                trigger={["hover"]}
                placement={"bottomLeft"}
              >
                <span className={`${style.hiddenRecruitersCount} no-drag`}>
                  +{hiddenRecruiters.length}
                </span>
              </Tooltip>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
