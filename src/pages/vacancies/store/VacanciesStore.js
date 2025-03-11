import { create } from "zustand";

export const useVacanciesStore = create((set) => ({
  controller: {},
  actionTrigger: null,
  openCardActions: null,
  openVacancyDetails: null,
  openVacancyComments: null,
  assignRecruiterTo: null,
  confirmStatusChangeTo: null,
  exportVacancy: false,
  summary: {},
  searchValue: "",
  vacancyFormSteps: {
    data: [
      { id: 1, name: "General", subTitle: "Mandatory", isAllFilled: true },
      { id: 2, name: "Stages", subTitle: "Mandatory", isAllFilled: false },
      { id: 3, name: "JD", subTitle: "Mandatory", isAllFilled: false },
      { id: 4, name: "Placement", subTitle: "Mandatory", isAllFilled: false },
      { id: 5, name: "Apply Form", subTitle: "Mandatory", isAllFilled: false },
      { id: 6, name: "Preview", subTitle: "Mandatory", isAllFilled: false },
    ],
    currentStep: 1,
  },
  maxSteps: 6,
  minSteps: 1,
  setSummary: (action) => set(() => ({ summary: action })),
  setSearchValue: (action) => set(() => ({ searchValue: action })),
  setExportVacancy: (action) => set(() => ({ exportVacancy: action })),
  setConfirmStatusChangeTo: (action) =>
    set(() => ({ confirmStatusChangeTo: action })),
  setAssignRecruiterTo: (action) => set(() => ({ assignRecruiterTo: action })),
  setOpenVacancyComments: (action) =>
    set(() => ({ openVacancyComments: action })),
  setOpenCardActions: (action) => set(() => ({ openCardActions: action })),
  setActionTrigger: (action) => set(() => ({ actionTrigger: action })),
  setOpenVacancyDetails: (action) =>
    set(() => ({ openVacancyDetails: action })),
  setController: (newController) => set(() => ({ controller: newController })),
  updateVacancySteps: (id, updatedValues) =>
    set((state) => ({
      vacancyFormSteps: {
        ...state.vacancyFormSteps,
        data: state.vacancyFormSteps.data.map((step) =>
          step.id === id ? { ...step, ...updatedValues } : step
        ),
      },
    })),
  updateMultipleVacancySteps: (updates) =>
    set((state) => ({
      vacancyFormSteps: {
        ...state.vacancyFormSteps,
        data: state.vacancyFormSteps.data.map((step) => {
          const update = updates.find((u) => u.id === step.id);
          return update ? { ...step, ...update.values } : step;
        }),
      },
    })),

  setCurrentStep: (step) =>
    set((state) => ({
      vacancyFormSteps: {
        ...state.vacancyFormSteps,
        currentStep: step,
      },
    })),
  loadNextStep: () => {
    set((state) => {
      let stepCount = state.vacancyFormSteps.currentStep;
      if (stepCount < state.maxSteps) {
        return {
          vacancyFormSteps: {
            ...state.vacancyFormSteps,
            currentStep: stepCount + 1,
            data: state.vacancyFormSteps.data.map((step) =>
              step.id === stepCount ? { ...step, isAllFilled: true } : step
            ),
          },
          actionTrigger: null,
        };
      } else {
        return {
          vacancyFormSteps: {
            ...state.vacancyFormSteps,
            currentStep: state.maxSteps,
            data: state.vacancyFormSteps.data.map((step) =>
              step.id === stepCount ? { ...step, isAllFilled: true } : step
            ),
          },
          actionTrigger: null,
        };
      }
    });
  },
  loadPrevStep: () => {
    set((state) => {
      let stepCount = state.vacancyFormSteps.currentStep;
      if (stepCount <= state.minSteps) {
        return {
          vacancyFormSteps: {
            ...state.vacancyFormSteps,
            currentStep: state.minSteps,
          },
          actionTrigger: null,
        };
      } else {
        return {
          vacancyFormSteps: {
            ...state.vacancyFormSteps,
            currentStep: stepCount - 1,
          },
          actionTrigger: null,
        };
      }
    });
  },
}));
