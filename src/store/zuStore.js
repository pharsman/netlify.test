import { create } from "zustand";

export const useStore = create((set) => ({
  modalStatus: { visible: false, renderCase: null, data: null },
  reloadStages: false,
  reloadCriteria: false,
  reloadCriteriaGroup: false,
  reloadFollowUp: false,

  setModalStatus: (isModalOpen, renderCase, data) => {
    set({
      modalStatus: { visible: isModalOpen, renderCase: renderCase, data: data },
    });
  },

  toggleReload: (key) => {
    set((state) => ({ [key]: !state[key] }));
  },
}));
