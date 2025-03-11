import IconLocation from "@/assets/icons/other/profile/IconLocation";
import style from "./CareerCard.module.scss";
import Tooltip from "masterComponents/Tooltip";
import { __formatDate } from "@/utils/helpers";
import { useState } from "react";
import CareerModal from "../CareerModal/CareerModal";
import Tag from "masterComponents/Tag";

const CareerCard = ({ card, listReload }) => {
  const [OpenPopup, setOpenPopup] = useState(false);

  const AvatarUrl =
    card.HeadsJson && card.HeadsJson.length > 0
      ? JSON.parse(card.HeadsJson)[0]?.AvatarUrl ?? null
      : null;

  const FirstLetter =
    card.HeadsJson && card.HeadsJson.length > 0 > 0
      ? JSON.parse(card.HeadsJson)[0]?.HeadName.split(" ")[0][0]
      : "-";

  const ViewPreview = async () => {
    setOpenPopup(true);
  };

  return (
    <div className={style.careerCardContainer}>
      <div
        className={style.careerCardContext}
        style={{ backgroundColor: card.colorScheme.OutsideColor }}
      >
        <div className={style.careerCardHeader}>
          <div className={style.careerCardTitles}>
            <h2 className={style.careerCardTitle}>
              {card?.VacancyName ?? ""}{" "}
              <span className={style.cardTitleCount}>
                ({card?.FreePositionsCount ?? ""})
              </span>{" "}
              {card?.IsApplied && (
                <span className={style.appliedTag}>Applied</span>
              )}
            </h2>
            <p className={style.careerCardSubtitle}>
              {card?.OrgUnitName ?? ""}
            </p>
          </div>
          <div
            className={style.careerCardAvatar}
            style={
              card?.HeadsJson && JSON.parse(card.HeadsJson).length > 1
                ? { cursor: "pointer" }
                : {}
            }
          >
            <Tooltip
              label={() => {
                return (
                  <div className={style.cardTooltipContent}>
                    <h3>test</h3>
                    {card?.HeadsJson &&
                      JSON.parse(card.HeadsJson).map((el, index) => {
                        return <p key={index}> {el.HeadName}</p>;
                      })}
                  </div>
                );
              }}
            >
              {AvatarUrl ? (
                <img
                  style={{
                    borderRadius: "50%",
                    width: "2rem",
                    height: "2rem",
                  }}
                  src={AvatarUrl}
                />
              ) : (
                <div
                  style={{
                    background: "#E1E4E5",
                    color: "#00ADEE",
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {FirstLetter}
                </div>
              )}
            </Tooltip>
            {card?.HeadsJson && JSON.parse(card.HeadsJson).length > 1 && (
              <span className={style.cardAvatarCount}>
                {" "}
                +{JSON.parse(card.HeadsJson).length - 1}
              </span>
            )}
          </div>
        </div>
        <div className={style.careerCardContent}>
          <div
            className={style.cardInfoContent}
            style={{ backgroundColor: card.colorScheme.InsideColor }}
          >
            <p className={style.cardInfo}>Work Type</p>
            <p className={style.cardInfo}>{card?.WorkTypes ?? "-"}</p>
          </div>
          <div
            className={style.cardInfoContent}
            style={{ backgroundColor: card.colorScheme.InsideColor }}
          >
            <p className={style.cardInfo}>End Date</p>
            <p className={style.cardInfo}>
              {card?.EndDate ? __formatDate(card?.EndDate, "DD.MM.YYYY") : "-"}
            </p>
          </div>
        </div>
      </div>
      <div className={style.careerCardFooter}>
        <p className={style.careerPlace}>
          <IconLocation />
          Tbilisi, Head Office
        </p>
        <div className={style.careerViewButton} onClick={ViewPreview}>
          View
        </div>
      </div>
      {OpenPopup && (
        <CareerModal
          listReload={listReload}
          setOpenPopup={setOpenPopup}
          vacancyID={card?.VacancyID}
        />
      )}
    </div>
  );
};

export default CareerCard;
