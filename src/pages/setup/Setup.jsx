import { Outlet, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./pages.module.scss";
import { IconStages } from "@/assets/icons/setup/IconStages";
import { IconCriteria } from "@/assets/icons/setup/IconCriteria";
import { IconFollow } from "@/assets/icons/setup/IconFollow";
import { IconQuest } from "@/assets/icons/setup/IconQuest";
import ModalController from "@/components/modals/ModalController";

function Setup() {
  const [activeIndex, setActiveIndex] = useState(0);

  const tabs = [
    {
      path: "stages",
      label: "Stages",
      icon: <IconStages color={activeIndex === 0 ? "#ffffff" : "#555F62"} />,
    },
    {
      path: "criteria",
      label: "Criteria",
      icon: <IconCriteria color={activeIndex === 1 ? "#ffffff" : "#555F62"} />,
    },
    // {
    //   path: "questionnaires",
    //   label: "Questionnaires",
    //   icon: <IconQuest color={activeIndex === 2 ? "#ffffff" : "#555F62"} />,
    // },
    {
      path: "followup",
      label: "Follow Up",
      icon: <IconFollow color={activeIndex === 2 ? "#ffffff" : "#555F62"} />,
    },
  ];

  useEffect(() => {
    const activeTab = tabs.findIndex((tab) =>
      window.location.pathname.includes(tab.path)
    );
    setActiveIndex(activeTab);
  }, [window.location.pathname]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.centerTab}>
          <div className={styles.tabContainer}>
            <nav className={styles.tabLinks}>
              {tabs.map((tab, index) => (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  className={
                    activeIndex === index ? styles.activeTab : styles.tabLink
                  }
                  onClick={() => setActiveIndex(index)}
                >
                  {tab.icon}
                  <span style={{ marginLeft: "10px" }}>{tab.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
        <Outlet />
      </div>
      <ModalController />
    </>
  );
}

export default Setup;
