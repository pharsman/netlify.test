import { create } from "zustand";

export const useCandidatesStore = create((set) => ({
  actionTrigger: null,
  updateCandidateID: null,
  changeStatusTo: null,
  candidateIdInProgress: null,
  sendFollowUpTo: null,
  viewCommentsTo: null,
  moveToCurrentList: null,
  searchValue: "",
  setActionTrigger: (action) => set(() => ({ actionTrigger: action })),
  setUpdateCandidateID: (id) => set(() => ({ updateCandidateID: id })),
  setChangeStatusTo: (status) => set(() => ({ changeStatusTo: status })),
  setCandidateIdInProgress: (id) => set(() => ({ candidateIdInProgress: id })),
  setSendFollowUpTo: (id) => set(() => ({ sendFollowUpTo: id })),
  setViewCommentsTo: (data) => set(() => ({ viewCommentsTo: data })),
  setMoveToCurrentList: (data) => set(() => ({ moveToCurrentList: data })),
  setSearchValue: (value) => set(() => ({ searchValue: value })),
}));
