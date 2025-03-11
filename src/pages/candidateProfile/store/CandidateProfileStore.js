import { create } from "zustand";

export const useCandidateProfileStore = create((set) => ({
  actionTrigger: null,
  statusID: null,
  currentTab: 1,
  candidateEmail: null,
  totalScore: 0,
  tabs: [
    {
      label: "Stages",
      id: 1,
    },
    {
      label: "Experience",
      id: 2,
    },
    {
      label: "Education",
      id: 3,
    },
    {
      label: "Documents",
      id: 4,
    },
    {
      label: "Messages",
      id: 5,
    },
    {
      label: "Applicant Timeline",
      id: 6,
    },
    {
      label: "Other",
      id: 7,
    },
  ],
  setActionTrigger: (action) => set(() => ({ actionTrigger: action })),
  setCurrentTab: (tab) => set(() => ({ currentTab: tab })),
  setStatusID: (statusID) => set(() => ({ statusID: statusID })),
  setCandidateEmail: (email) => set(() => ({ candidateEmail: email })),
  setTotalScore: (score) => set(() => ({ totalScore: score })),
}));
