export const __getFormFields = (fieldArray) => {
  return fieldArray.map((data) => {
    switch (data.Type) {
      case "date":
        return {
          ...data,
          required: data.IsRequired,
          component: "Datepicker",
          label: data.Name,
          placeholder: data.Name,
          value: "",
          msgVisible: false,
          format: "YYYY-MM-DD",
          valueFormat: "YYYY-MM-DD",
        };
      case "dropdown":
        return {
          ...data,
          isRequired: data.IsRequired,
          component: "FormDropdown",
          label: data.Name,
          selectedOptionID: null,
          data: [],
          value: "",
          msgVisible: false,
        };
      case "multiselect":
        return {
          ...data,
          isRequired: data.IsRequired,
          component: "FormMultiSelectDropdown",
          label: data.Name,
          data: [],
          value: "",
          msgVisible: false,
        };
      case "email":
        return {
          ...data,
          isRequired: data.IsRequired,
          component: "FormInput",
          label: data.Name,
          type: "email",
          value: "",
          msgVisible: false,
        };
      case "number":
        return {
          ...data,
          isRequired: data.IsRequired,
          component: "FormInput",
          label: data.Name,
          type: "number",
          inputType: "number",
          hideArrows: true,
          value: "",
          msgVisible: false,
          data: [],
        };
      case "text":
        return {
          ...data,
          isRequired: data.IsRequired,
          component: "FormInput",
          label: data.Name,
          type: "text",
          value: "",
          msgVisible: false,
          subField:
            data.Key === "SalaryExpectation"
              ? {
                  isRequired: true,
                  component: "FormDropdown",
                  label: "Currency",
                  selectedOptionID: null,
                  data: [],
                  value: "",
                  msgVisible: false,
                }
              : null,
        };
      case "phone":
        return {
          ...data,
          isRequired: data.IsRequired,
          component: "FormInput",
          label: data.Name,
          type: "number",
          value: "",
          msgVisible: false,
          subField: {
            isRequired: true,
            component: "FormDropdown",
            label: "Code",
            selectedOptionID: null,
            data: [],
            value: "",
            msgVisible: false,
          },
        };
      case "upload":
        return {
          ...data,
          isRequired: data.IsRequired,
          component: "FileUploader",
          value: "",
          msgVisible: false,
        };
      default:
        return {
          ...data,
          isRequired: data.IsRequired,
          component: "FormInput",
          label: data.Name,
          type: "text",
          value: "",
          msgVisible: false,
          Key: "CustomJSON",
          CustomJSONID: data.ID,
        };
    }
  });
};
