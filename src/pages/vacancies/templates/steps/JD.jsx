import style from "@/pages/vacancies/style/steps/JD.module.scss";
import FormDropdown from "masterComponents/FormDropdown";
import { useEffect, useRef, useState } from "react";
import { createNotification } from "masterComponents/Notification";

import Loader from "masterComponents/Loader";
import {
  getAssembleDocumentTemplateDetails,
  getDocumentContent,
  getRecruitmentDocumentTemplates,
  setUpdateAssembleDocument,
} from "../../api/VacanciesApi";
import { useVacanciesStore } from "../../store/VacanciesStore";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { storeActionTypes } from "../../constants";

export const JD = ({ vacancyID }) => {
  const isDev =
    location.href.includes(".dev") || location.href.includes("localhost");
  const { actionTrigger, loadNextStep, loadPrevStep, setActionTrigger } =
    useVacanciesStore((state) => state);

  const [documentTemplates, setDocumentTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasTemplateAssigned = useRef(false);
  const [selectedDocumentTemplate, setSelectedDocumentTemplate] =
    useState(null);
  const [tinyEditor, setTinyEditor] = useState(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const commonConfig = {
    baseURL: isDev
      ? "https://oneadmin.upgaming.dev/hr/editor/front/loader/loader.js"
      : "https://oneadmin.upgaming.com/hr/editor/front/loader/loader.js",
  };

  const initTinymceEditor = async () => {
    const editor = await new tinymceLoader(".tinymce-wrapper", {
      plugins: [
        "inlinecss",
        "image",
        "tinymcespellchecker",
        "table",
        "casechange",
        "checklist",
        "lists",
        "mergetags",
        "permanentpen",
        "code",
        "media",
        "mediaembed",
        "powerpaste",
      ],
      toolbar: [
        "mergetags image paste casechange checklist permanentpen media code",
        "table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
      ],
      powerpaste_allow_local_images: true,
      mergetags_prefix: "{*",
      mergetags_suffix: "*}",
    });
    editor.iframe.style.height = "46.875rem";
    setTinyEditor(editor);
    setIsEditorReady(true);
  };

  const getTemplates = async () => {
    setLoading(true);
    try {
      const response = await getRecruitmentDocumentTemplates();
      if (response.data) {
        const dataMap = response.data.map((template) => ({
          label: template?.DocumentName,
          id: template?.DocumentID,
          ...template,
        }));
        setDocumentTemplates(dataMap);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getAndSetDocumentTemplate = async (documentTemplate) => {
    if (!documentTemplate.DocumentGuid) return;
    setSelectedDocumentTemplate(documentTemplate.id);
    setLoading(true);
    try {
      const response = await getDocumentContent({
        GUID: documentTemplate?.DocumentGuid ?? null,
      });
      if (tinyEditor && isEditorReady) {
        tinyEditor.execute("setContent", true, response.data.Content);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentTemplateDetails = async () => {
    if (!vacancyID || !isEditorReady) return;
    setLoading(true);
    try {
      const response = await getAssembleDocumentTemplateDetails({
        VacancyID: vacancyID,
      });
      if (response.data && tinyEditor) {
        const { Content } = response.data;
        tinyEditor.execute("setContent", true, Content);
        setSelectedDocumentTemplate(response?.data?.ExternalDocumentID);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async () => {
    if (!vacancyID || !tinyEditor) return;
    const documentName =
      documentTemplates.find((el) => el.DocumentID === selectedDocumentTemplate)
        ?.DocumentName || null;
    const documentContent = await tinyEditor.execute("getContent");

    if (!documentContent || documentContent.length < 1) {
      createNotification(
        `Please Fill The Document`,
        "error",
        3000,
        "top-right",
        2
      );
      setActionTrigger(null);
      return;
    }

    const dataSet = {
      VacancyID: vacancyID ?? null,
      ExternalDocumentID: selectedDocumentTemplate ?? null,
      ExternalDocumentName: documentName ?? null,
      Content: documentContent ?? null,
    };
    setLoading(true);
    try {
      await setUpdateAssembleDocument(dataSet);
      loadNextStep();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const initialCalls = async () => {
    await getTemplates();
    if (isEditorReady) {
      await getDocumentTemplateDetails();
    }
  };

  useEffect(() => {
    if (!window.tinymceLoader) {
      const script = document.createElement("script");
      script.src = commonConfig.baseURL;
      script.async = true;

      script.onload = () => initTinymceEditor();

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  useEffect(() => {
    if (isEditorReady) initialCalls();
  }, [isEditorReady]);

  useUpdateEffect(() => {
    if (
      actionTrigger &&
      actionTrigger === storeActionTypes.REQUEST_ACTIONS.LOAD_NEXT_STEP
    ) {
      sendRequest();
      setActionTrigger(null);
    } else if (
      actionTrigger === storeActionTypes.REQUEST_ACTIONS.LOAD_PREV_STEP
    ) {
      loadPrevStep();
      setActionTrigger(null);
    }
  }, [actionTrigger]);

  return (
    <div className={style.jdWrapper}>
      {loading && (
        <div
          style={{
            width: "100%",
            height: "75%",
            position: "absolute",
            zIndex: "50",
            background: "#ffffff70",
          }}
        >
          <div
            style={{
              width: "fit-content",
              position: "absolute",
              left: "30%",
              top: "30%",
            }}
          >
            <Loader loading={true} circleColor={"#30ACD0"} />
          </div>
        </div>
      )}
      <div className={style.topContent}>
        <FormDropdown
          skipPreselectTrigger={true}
          label={"JD"}
          data={documentTemplates}
          withClear={true}
          selected={(obj) => getAndSetDocumentTemplate(obj)}
          selectedOptionID={selectedDocumentTemplate}
        />
      </div>
      <div className={style.bottomContent}>
        <div className="tinymce-wrapper"></div>
      </div>
    </div>
  );
};
