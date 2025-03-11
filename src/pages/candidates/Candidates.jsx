import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import style from "@/pages/candidates/style/Candidates.module.scss";
import MainButton from "masterComponents/MainButton";
import Button from "@/components/Button";
import Search from "masterComponents/Search";
import IconExport from "@/assets/icons/other/IconExport";
import { AddCandidateModal } from "./components/AddCandidateModal";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useCandidatesStore } from "./store/CandidatesStore";
import { CandidateStatusChange } from "./components/CandidateStatusChange";
import { SendFollowUpModal } from "./components/SendFollowUpModal";
import { CandidateComments } from "./components/CandidateComments";
import { MoveToCurrentListModal } from "./components/MoveToCurrentListModal";
import { ExportFile } from "./components/ExportFile";
export const Candidates = () => {
  const {
    updateCandidateID,
    changeStatusTo,
    sendFollowUpTo,
    viewCommentsTo,
    moveToCurrentList,
    searchValue,
    setSearchValue,
  } = useCandidatesStore();
  const [reloadModal, setReloadModal] = useState(1);
  const [exportFileOpen, setExportFileOpen] = useState(false);
  const { pathname } = location;
  const navigate = useNavigate();
  const [isAddCandidateOpen, setIsCandidateOpen] = useState(false);
  const [activeTabPath, setactiveTabPath] = useState();
  const tabs = [
    {
      path: "candidatesBoard",
      icon: (
        <svg
          width="1rem"
          height="1rem"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 2.73301V13.2663C9 14.2663 9.42667 14.6663 10.4867 14.6663H13.18C14.24 14.6663 14.6667 14.2663 14.6667 13.2663V2.73301C14.6667 1.73301 14.24 1.33301 13.18 1.33301H10.4867C9.42667 1.33301 9 1.73301 9 2.73301Z"
            fill="#AAB0B2"
          />
          <path
            d="M1.33325 2.73301V13.2663C1.33325 14.2663 1.75992 14.6663 2.81992 14.6663H5.51325C6.57325 14.6663 6.99992 14.2663 6.99992 13.2663V2.73301C6.99992 1.73301 6.57325 1.33301 5.51325 1.33301H2.81992C1.75992 1.33301 1.33325 1.73301 1.33325 2.73301Z"
            fill="#AAB0B2"
          />
        </svg>
      ),
    },
    {
      path: "currentCandidates",
      icon: (
        <svg
          width="1rem"
          height="1rem"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.2666 9H2.73325C1.73325 9 1.33325 9.42667 1.33325 10.4867V13.18C1.33325 14.24 1.73325 14.6667 2.73325 14.6667H13.2666C14.2666 14.6667 14.6666 14.24 14.6666 13.18V10.4867C14.6666 9.42667 14.2666 9 13.2666 9Z"
            fill="#AAB0B2"
          />
          <path
            d="M13.2666 1.33301H2.73325C1.73325 1.33301 1.33325 1.75967 1.33325 2.81967V5.51301C1.33325 6.57301 1.73325 6.99967 2.73325 6.99967H13.2666C14.2666 6.99967 14.6666 6.57301 14.6666 5.51301V2.81967C14.6666 1.75967 14.2666 1.33301 13.2666 1.33301Z"
            fill="#AAB0B2"
          />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    const traverseAndHighlight = (element) => {
      if (element.nodeType === Node.TEXT_NODE) {
        const originalText = element.textContent;

        if (searchValue) {
          const regex = new RegExp(`(${searchValue})`, "gi");
          if (regex.test(originalText)) {
            const wrapper = document.createElement("span");
            wrapper.innerHTML = originalText.replace(
              regex,
              (match) =>
                `<mark style="background-color: orange;">${match}</mark>`
            );
            element.parentNode.replaceChild(wrapper, element);
          }
        }
      } else if (
        element.nodeType === Node.ELEMENT_NODE &&
        element.tagName !== "SCRIPT" &&
        element.tagName !== "STYLE"
      ) {
        Array.from(element.childNodes).forEach(traverseAndHighlight);
      }
    };

    const rootElement = document.body;
    traverseAndHighlight(rootElement);

    return () => {
      const marks = document.querySelectorAll("mark");
      marks.forEach((mark) => {
        const parent = mark.parentNode;
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
        parent.normalize();
      });
    };
  }, [searchValue, pathname]);

  useEffect(() => {
    if (pathname.includes("candidatesBoard")) {
      setactiveTabPath(tabs[0].path);
    } else if (pathname.includes("currentCandidates")) {
      setactiveTabPath(tabs[1].path);
    }
  }, [pathname, tabs]);

  useUpdateEffect(() => {
    if (updateCandidateID) {
      setIsCandidateOpen(true);
    }
  }, [updateCandidateID]);

  return (
    <div className={style.candidatesContent}>
      {exportFileOpen && (
        <ExportFile
          isOpen={exportFileOpen}
          onClose={() => setExportFileOpen(false)}
        />
      )}

      {changeStatusTo && changeStatusTo?.CandidateID && (
        <CandidateStatusChange />
      )}
      {sendFollowUpTo && Object.keys(sendFollowUpTo).length > 0 && (
        <SendFollowUpModal />
      )}
      {viewCommentsTo && Object.keys(viewCommentsTo).length > 0 && (
        <CandidateComments />
      )}
      {moveToCurrentList && Object.keys(moveToCurrentList).length > 0 && (
        <MoveToCurrentListModal />
      )}
      <AddCandidateModal
        key={reloadModal}
        isOpen={isAddCandidateOpen}
        onClose={() => {
          setIsCandidateOpen(false);
          setReloadModal((state) => (state += 1));
        }}
      />
      <header className={style.candidatesCommonHeader}>
        <h1>Talent Pool</h1>
        <div className={style.candidatesSearch}>
          <Search
            value={searchValue}
            change={(value) => setSearchValue(value)}
          />
        </div>
        <div className={style.candidatesTabAndAction}>
          {!pathname.toLowerCase().includes("sharedtomanager") && (
            <>
              <MainButton
                label={"Export"}
                icon={<IconExport />}
                iconPosition={"right"}
                size={"small"}
                type={"border"}
                onClick={() => setExportFileOpen(true)}
                customStyle={{
                  color: "#141719",
                  border: " 0.0625rem solid #D1D5D6",
                  height: "2.325rem",
                }}
              />

              <nav>
                {tabs?.map((tab, index) => {
                  return (
                    <NavLink
                      key={index}
                      to={tab.path}
                      className={`${
                        activeTabPath === tab.path ? style.activeTab : ""
                      } ${style.singleTab}`}
                      onClick={() => setactiveTabPath(tab.path)}
                    >
                      {tab.icon}
                    </NavLink>
                  );
                })}
              </nav>
              <Button
                label={"Add Candidate"}
                customStyle={{
                  height: "2.5rem",
                  borderRadius: "0.375rem",
                }}
                onClick={() => setIsCandidateOpen(true)}
              />
            </>
          )}
        </div>
      </header>
      <Outlet />
    </div>
  );
};
