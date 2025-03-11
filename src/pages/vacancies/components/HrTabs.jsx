import Tabs from "masterComponents/Tabs";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { storeActionTypes } from "../constants";
import { useVacanciesStore } from "../store/VacanciesStore";

export const HrTabs = () => {
  const { pathname } = location;
  const [activeTabKey, setActiveTabKey] = useState(1);
  const { mode } = useParams();
  const isAdmin = (mode && mode == storeActionTypes.USER_MODES.HR) || false;

  const { summary } = useVacanciesStore((state) => state);

  const setActiveTab = (key) => {
    switch (true) {
      case pathname.includes("currentVacancies"): {
        setActiveTabKey(1);
        break;
      }
      case pathname.includes("requestedVacancies"): {
        setActiveTabKey(2);
        break;
      }
      case pathname.includes("finishedVacancies"): {
        setActiveTabKey(3);
        break;
      }
    }
  };
  useEffect(() => {
    setActiveTab();
  }, []);
  return (
    <Tabs
      defaultActiveKey={activeTabKey}
      onItemClick={(state) => setActiveTabKey(state.key)}
      tabItems={[
        {
          key: 1,
          label: (
            <NavLink
              to={
                isAdmin
                  ? "currentVacancies/hr"
                  : mode && mode == storeActionTypes.USER_MODES.RECRUITER
                  ? "currentVacancies/recruiter"
                  : mode && mode == storeActionTypes.USER_MODES.MANAGER
                  ? "currentVacancies/manager"
                  : "currentVacancies/manager"
              }
            >
              <span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_2107_43964)">
                    <path
                      d="M14.8992 14.8995L12.4313 12.4316"
                      stroke="#4D4D4E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.586 14.0711C11.7365 14.0711 14.0713 11.7364 14.0713 7.58587C14.0713 3.43529 11.7365 1.10059 7.586 1.10059C3.43542 1.10059 1.10072 3.43529 1.10072 7.58587C1.10072 11.7364 3.43542 14.0711 7.586 14.0711Z"
                      stroke="#4D4D4E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.94994 12.7849C4.11944 11.9502 4.57231 11.1997 5.23182 10.6607C5.89133 10.1216 6.71692 9.82715 7.56869 9.82715C8.42047 9.82715 9.24605 10.1216 9.90556 10.6607C10.5651 11.1997 11.0179 11.9502 11.1875 12.7849V13.272C10.2133 13.7977 9.00595 14.0709 7.58607 14.0709C6.14924 14.0709 4.93002 13.7911 3.94994 13.2531V12.7849Z"
                      stroke="#4D4D4E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.58599 7.99987C8.99626 7.99987 9.78954 7.20659 9.78954 5.79632C9.78954 4.38605 8.99626 3.59277 7.58599 3.59277C6.17572 3.59277 5.38245 4.38605 5.38245 5.79632C5.38245 7.20659 6.17572 7.99987 7.58599 7.99987Z"
                      stroke="#4D4D4E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
                Current Vacancies
                {summary?.Current?.Open_Job ? (
                  <h4
                    style={{
                      background: "#4D4D4E",
                      borderRadius: "0.875rem",
                      padding: "0 0.5rem",
                      color: "#fff",
                      fontWeight: "400",
                      fontSize: "0.75rem",
                    }}
                  >
                    {summary?.Current?.Open_Job}
                  </h4>
                ) : (
                  ""
                )}
              </span>
            </NavLink>
          ),
        },
        {
          key: 2,
          label: (
            <NavLink
              to={
                isAdmin
                  ? "requestedVacancies/hr"
                  : mode && mode == storeActionTypes.USER_MODES.RECRUITER
                  ? "requestedVacancies/recruiter"
                  : mode && mode == storeActionTypes.USER_MODES.MANAGER
                  ? "requestedVacancies/manager"
                  : "requestedVacancies/manager"
              }
            >
              <span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_2107_43974)">
                    <path
                      d="M6.21504 9.69814C5.37657 9.27892 4.53812 8.44045 4.1189 7.60203C4.53812 6.76355 5.37657 5.92509 6.21504 5.50586"
                      stroke="#555F62"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.98837 9.69814C9.82684 9.27892 10.6653 8.44045 11.0845 7.60203C10.6653 6.76355 9.82684 5.92509 8.98837 5.50586"
                      stroke="#555F62"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.6343 14.6337L12.2612 12.2607"
                      stroke="#555F62"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.60171 13.838C11.5927 13.838 13.8376 11.5931 13.8376 7.6021C13.8376 3.61113 11.5927 1.36621 7.60171 1.36621C3.61074 1.36621 1.36581 3.61113 1.36581 7.6021C1.36581 11.5931 3.61074 13.838 7.60171 13.838Z"
                      stroke="#555F62"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
                Requested
                {summary?.Requested?.Total ? (
                  <h4
                    style={{
                      background: "#4D4D4E",
                      borderRadius: "0.875rem",
                      padding: "0 0.5rem",
                      color: "#fff",
                      fontWeight: "400",
                      fontSize: "0.75rem",
                    }}
                  >
                    {summary?.Requested?.Total}
                  </h4>
                ) : (
                  ""
                )}
              </span>
            </NavLink>
          ),
        },
        {
          key: 3,
          label: (
            <NavLink
              to={
                isAdmin
                  ? "finishedVacancies/hr"
                  : mode && mode == storeActionTypes.USER_MODES.RECRUITER
                  ? "finishedVacancies/recruiter"
                  : mode && mode == storeActionTypes.USER_MODES.MANAGER
                  ? "finishedVacancies/manager"
                  : "finishedVacancies/manager"
              }
            >
              <span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_2107_43984)">
                    <path
                      d="M4.82941 9.85498C4.89597 10.362 5.31158 10.7602 5.82061 10.8092C6.39689 10.8646 6.99241 10.9194 7.60173 10.9194C8.21105 10.9194 8.80657 10.8646 9.38285 10.8092C9.89188 10.7602 10.3075 10.362 10.3741 9.85498C10.4308 9.42293 10.4809 8.9784 10.4809 8.52464C10.4809 8.07086 10.4308 7.62634 10.3741 7.19429C10.3075 6.68726 9.89188 6.28908 9.38285 6.24009C8.80657 6.18464 8.21105 6.12988 7.60173 6.12988C6.99241 6.12988 6.39689 6.18464 5.82061 6.24009C5.31158 6.28908 4.89597 6.68726 4.82941 7.19429C4.7727 7.62634 4.7226 8.07086 4.7226 8.52464C4.7226 8.9784 4.7727 9.42293 4.82941 9.85498Z"
                      stroke="#555F62"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.4021 6.19114V5.48479C6.4021 4.82225 6.9392 4.28516 7.60174 4.28516C8.26428 4.28516 8.80138 4.82225 8.80138 5.48479V6.19114"
                      stroke="#555F62"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.6341 14.6337L12.2611 12.2607"
                      stroke="#555F62"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.60174 13.838C11.5927 13.838 13.8376 11.5931 13.8376 7.6021C13.8376 3.61113 11.5927 1.36621 7.60174 1.36621C3.61077 1.36621 1.36584 3.61113 1.36584 7.6021C1.36584 11.5931 3.61077 13.838 7.60174 13.838Z"
                      stroke="#555F62"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
                Finished
                {summary?.Finished?.Total_Job ? (
                  <h4
                    style={{
                      background: "#4D4D4E",
                      borderRadius: "0.875rem",
                      padding: "0 0.5rem",
                      color: "#fff",
                      fontWeight: "400",
                      fontSize: "0.75rem",
                    }}
                  >
                    {summary?.Finished?.Total_Job}
                  </h4>
                ) : (
                  ""
                )}
              </span>
            </NavLink>
          ),
        },
      ].filter((navlink) => {
        return isAdmin
          ? navlink
          : mode == storeActionTypes.USER_MODES.RECRUITER
          ? ![2].includes(navlink.key)
          : false;
      })}
    />
  );
};
