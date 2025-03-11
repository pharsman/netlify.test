import Tabs from "masterComponents/Tabs";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
export const CandidateTabs = () => {
  const [activeTabKey, setActiveTabKey] = useState(1);

  const { pathname } = location;

  const isLocalhost = window.location.hostname === "localhost";

  const setActiveTab = () => {
    if (pathname.includes("currentCandidates")) {
      setActiveTabKey(1);
    } else if (pathname.includes("candidatesDataBase")) {
      setActiveTabKey(2);
    }
  };

  useEffect(() => {
    setActiveTab();
  }, []);

  return (
    <div>
      <Tabs
        style={{
          marginTop: "1rem",
        }}
        defaultActiveKey={activeTabKey}
        onItemClick={(state) => setActiveTabKey(state.key)}
        tabItems={[
          {
            key: 1,
            label: (
              <NavLink
                to={
                  isLocalhost
                    ? "/candidates/currentCandidates"
                    : "/recruitment/oneadmin/front/candidates/currentCandidates"
                }
              >
                <span
                  style={{
                    color: "var(--color-text-soft-default)",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_2384_26658)">
                      <path
                        d="M11.4677 14.8999C11.2877 14.1744 10.8775 13.5251 10.2967 13.0503C9.67737 12.5441 8.90212 12.2676 8.10229 12.2676C7.30245 12.2676 6.52722 12.5441 5.90793 13.0503C5.3271 13.5251 4.91697 14.1744 4.73694 14.8999"
                        stroke="#4D4D4E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.10188 12.2684C9.42091 12.2684 10.1629 11.5265 10.1629 10.2075C10.1629 8.88843 9.42091 8.14648 8.10188 8.14648C6.78284 8.14648 6.04089 8.88843 6.04089 10.2075C6.04089 11.5265 6.78284 12.2684 8.10188 12.2684Z"
                        stroke="#4D4D4E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.5337 5.22354C12.8527 5.22354 13.5947 4.48159 13.5947 3.16255C13.5947 1.84352 12.8527 1.10156 11.5337 1.10156C10.2146 1.10156 9.47266 1.84352 9.47266 3.16255C9.47266 4.48159 10.2146 5.22354 11.5337 5.22354Z"
                        stroke="#4D4D4E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.8992 7.85496C14.7192 7.12946 14.309 6.48009 13.7282 6.00534C13.109 5.49917 12.3337 5.22266 11.5338 5.22266C10.734 5.22266 9.95877 5.49917 9.33948 6.00534"
                        stroke="#4D4D4E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.46638 5.22354C3.14734 5.22354 2.4054 4.48159 2.4054 3.16255C2.4054 1.84352 3.14734 1.10156 4.46638 1.10156C5.78541 1.10156 6.52737 1.84352 6.52737 3.16255C6.52737 4.48159 5.78541 5.22354 4.46638 5.22354Z"
                        stroke="#4D4D4E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.10083 7.85496C1.28085 7.12946 1.691 6.48009 2.27182 6.00534C2.89111 5.49917 3.66635 5.22266 4.46618 5.22266C5.26601 5.22266 6.04126 5.49917 6.66055 6.00534"
                        stroke="#4D4D4E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2384_26658">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  Current Candidates
                </span>
              </NavLink>
            ),
          },
          {
            key: 2,
            label: (
              <NavLink
                to={
                  isLocalhost
                    ? "/candidates/candidatesDataBase"
                    : "/recruitment/oneadmin/front/candidates/candidatesDataBase"
                }
              >
                <span
                  style={{
                    color: "var(--color-text-soft-default)",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_2384_26670)">
                      <path
                        d="M6.14258 8.2657C6.14258 8.75834 6.33828 9.23081 6.68663 9.57915C7.03498 9.9275 7.50744 10.1232 8.00008 10.1232C8.49272 10.1232 8.96518 9.9275 9.31353 9.57915C9.66188 9.23081 9.85758 8.75834 9.85758 8.2657C9.85758 7.77306 9.66188 7.3006 9.31353 6.95225C8.96518 6.6039 8.49272 6.4082 8.00008 6.4082C7.50744 6.4082 7.03498 6.6039 6.68663 6.95225C6.33828 7.3006 6.14258 7.77306 6.14258 8.2657Z"
                        stroke="#555F62"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.00012 11.7148C6.31722 11.7148 4.89567 12.8339 4.43896 14.3684H11.5613C11.1046 12.8339 9.68303 11.7148 8.00012 11.7148Z"
                        stroke="#555F62"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.63147 13.3066V2.69229C1.63147 2.10608 2.10669 1.63086 2.6929 1.63086H5.57916C6.06621 1.63086 6.49076 1.96234 6.6089 2.43485L6.93861 3.75372H13.3072C13.8934 3.75372 14.3686 4.22894 14.3686 4.81515V13.3066C14.3686 13.8928 13.8934 14.368 13.3072 14.368H2.6929C2.10669 14.368 1.63147 13.8928 1.63147 13.3066Z"
                        stroke="#555F62"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2384_26670">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  Talent Data Base
                </span>
              </NavLink>
            ),
          },
        ]}
      />
    </div>
  );
};
