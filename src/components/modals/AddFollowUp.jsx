import styles from "./modals.module.scss";
import { useState, useEffect } from "react";
import { useStore } from "@/store/zuStore";
import FormInput from "masterComponents/FormInput";
import FormDropdown from "masterComponents/FormDropdown";
import {
  createFollowUp,
  getCandidateStatuses,
  editFollowUp,
  getFollowUpPlaceHolders,
} from "@/api/api";

import Button from "../Button";

function AddFollowUp() {
  const setModalStatus = useStore((state) => state.setModalStatus);
  const modalStatus = useStore((state) => state.modalStatus);

  const [isTinymceLoaded, setIsTinymceLoaded] = useState(false);
  const [tinyEditor, setTinyEditor] = useState(null);
  const [updateContent, setUpdateContent] = useState();
  const [statuses, setStatuses] = useState();
  const [followUpPlaceholders, setFollowUpPlaceholders] = useState();
  const runReloadStages = useStore(
    (state) => () => state.toggleReload("reloadFollowUp")
  );

  // const templateParams = [
  //   {
  //     ID: 1,
  //     Key: "User",
  //     Value: [
  //       { Name: "Name", Value: "{*CandidateName*}" },
  //       { Name: "Surname", Value: "{*CandidateSurname*}" },
  //     ],
  //   },
  // ];

  const [formData, setFormData] = useState({
    Name: "",
    Body: "",
    VacancyStatusID: "",
  });

  useEffect(() => {
    if (modalStatus.data) {
      setUpdateContent(modalStatus.data?.Body);
    }
  }, [modalStatus.data]);

  /// setUpdateContent -ს იხმარ თუ გინდა რომ ჩატყვირთო რაიმე არსებული კონტენტი ბექიდან, მაგალითად ედიტისთვის

  const isDev =
    location.href.includes(".dev") || location.href.includes("localhost");

  const commonConfig = {
    baseURL: isDev
      ? "https://oneadmin.upgaming.dev/hr/editor/front/loader/loader.js"
      : "https://oneadmin.upgaming.com/hr/editor/front/loader/loader.js",
  };

  async function initTinymceEditor() {
    if (!isTinymceLoaded && !followUpPlaceholders) return;
    var editor = await new tinymceLoader(".tinymce-wrapper", {
      plugins: [
        "inlinecss",
        "image",
        "tinymcespellchecker",
        "table",
        "casechange",
        "checklist",
        "lists",
        /*'exportpdf', 'exportword',*/ "mergetags",
        "permanentpen",
        "code",
        "media",
        "mediaembed",
        "powerpaste",
      ],

      toolbar: [
        "mergetags staffbutton image paste casechange checklist permanentpen media code",
        "table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
      ],
      // custom_buttons: [
      //   {
      //     name: "staffbutton",
      //     text: "Insert Staff",
      //     content: "Staff Member: {staff}",
      //   },
      // ],

      powerpaste_allow_local_images: true,
      mergetags_prefix: "{*",
      mergetags_suffix: "*}",
      mergetags_list: followUpPlaceholders?.map((el) => ({
        title: el.Key,
        menu: el.Value.map((key) => ({
          title: key.Name,
          value: key.Value,
        })),
      })),
    });

    setTinyEditor(editor);
  }

  const getCandidateStatus = async () => {
    const resp = await getCandidateStatuses();
    setStatuses(
      resp.data.data.map((item) => ({ label: item.Name, id: item.ID }))
    );
    if (modalStatus.data) {
      setFormData({
        ...formData,
        Name: modalStatus.data?.Name,

        VacancyStatusID: modalStatus.data?.VacancyStatusID,
      });
    }
  };

  const followupPlaceholdersGet = async () => {
    const resp = await getFollowUpPlaceHolders();
    setFollowUpPlaceholders(resp.data);
  };

  useEffect(() => {
    followupPlaceholdersGet();
    getCandidateStatus();

    if (!window.tinymceLoader) {
      const script = document.createElement("script");

      script.src = commonConfig.baseURL;
      script.async = true;
      script.onload = () => setIsTinymceLoaded(true);

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  useEffect(() => {
    const setContentInEditor = async () => {
      if (tinyEditor && updateContent) {
        await tinyEditor.execute("setContent", true, updateContent);
      }
    };

    setContentInEditor();
  }, [tinyEditor, updateContent]);

  useEffect(() => {
    initTinymceEditor();
  }, [isTinymceLoaded, followUpPlaceholders]);

  const saveFollowUp = async () => {
    const editorText = await tinyEditor.execute("getContent");

    // Validate form data
    if (!formData.Name.trim() || !editorText.trim()) {
      alert("Please fill in both Template Name and content.");
      return;
    }

    const creationData = {
      Name: formData.Name,
      CandidateStatusID: formData.VacancyStatusID,
      Body: editorText,
    };

    let resp;

    if (modalStatus.data) {
      creationData.ID = modalStatus.data.ID;
    }

    if (modalStatus.data) {
      resp = await editFollowUp(creationData);
    } else {
      resp = await createFollowUp(creationData);
    }

    if (resp.Error) {
      console.log(resp.Error);
    } else {
      setModalStatus(false, null);
      runReloadStages();
    }
  };

  //asd4

  return (
    <>
      <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
        <div style={{ flex: "1" }}>
          <FormInput
            isRequired={true}
            label={"Template Name"}
            disabled={false}
            onChange={(value) => {
              setFormData({ ...formData, Name: value });
            }}
            value={formData.Name}
          />
        </div>
        <div style={{ flex: "1" }}>
          <FormDropdown
            isRequired={false}
            label={"Candidate's Status"}
            disabled={false}
            data={statuses}
            selected={(selectedOption) =>
              setFormData({ ...formData, VacancyStatusID: selectedOption.id })
            }
            fixedDropdown={true}
            selectedOptionID={
              formData.VacancyStatusID ? formData.VacancyStatusID : null
            }
          />
        </div>
      </div>
      <div className={`tinymce-wrapper ${styles.tinymceWrapper}`}></div>
      <div
        style={{ marginTop: "24px", display: "flex", justifyContent: "center" }}
      >
        <Button
          label={"Close"}
          customStyle={{
            marginRight: "16px",
            backgroundColor: "transparent",
            border: "1px solid var(--color-stroke-strong-initial)",
            color: "var(--color-text-strong-default)",
          }}
          onClick={() => setModalStatus(false, null)}
        />
        <Button label={"Save"} onClick={() => saveFollowUp()} />
      </div>
    </>
  );
}

export default AddFollowUp;
