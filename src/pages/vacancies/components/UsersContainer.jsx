import Tooltip from "masterComponents/Tooltip";
import style from "@/pages/vacancies/style/UsersContainer.module.scss";
export const UsersContainer = ({ visibleRecruiters, hiddenRecruiters }) => {
  const tooltipTemplate = (hiddenRecruiters) => {
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
                      padding: recruiter?.IsActive ? `0.125rem` : "",
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
  return (
    <div className={style.recruitersList}>
      {visibleRecruiters &&
        visibleRecruiters?.map((recruiter, index) => {
          return (
            <Tooltip label={recruiter?.Name || ""} key={index}>
              <div
                className={style.avatar}
                style={{
                  background: recruiter.AvatarUrl ? "" : "#E1E4E5",
                  border: recruiter?.IsActive ? `0.125rem solid #EFBD4E` : "",
                  padding: recruiter?.IsActive ? `0.125rem` : "",
                }}
              >
                {recruiter?.AvatarUrl ? (
                  <img
                    style={{ borderRadius: recruiter?.IsActive ? "50%" : "" }}
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
          <span className={style.hiddenRecruitersCount}>
            +{hiddenRecruiters.length}
          </span>
        </Tooltip>
      ) : (
        ""
      )}
    </div>
  );
};
