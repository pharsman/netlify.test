import style from "../style/Documents.module.scss";
import { useState, useEffect } from "react";
import Popup from "masterComponents/Popup";
import MainButton from "masterComponents/MainButton";
import FileUploader from "masterComponents/FileUploader";
import {
  getCandidateDocuments,
  uploadCandidateDocuments,
  deleteCandidateDocuments,
  getDocument,
  getResume,
} from "../api/CandidateProfileApi";
import { useParams } from "react-router-dom";

import Skeleton from "masterComponents/Skeleton";
import IconTrash from "@/assets/icons/other/IconTrash";
import { createNotification } from "masterComponents/Notification";

export const Documents = () => {
  const { candidateID, vacancyID } = useParams();
  const [loading, setLoading] = useState(false);

  const [popupVisible, setPopupVisible] = useState(false);
  const [fileData, setFileData] = useState([]);
  const [filesList, setFilesList] = useState([]);

  const handleUpload = async () => {
    if (!fileData) {
      return;
    }
    setLoading(true);
    try {
      await uploadCandidateDocuments({
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
        FilesJson: JSON.stringify(
          fileData.map((file) => ({
            FileName: file.fileName,
            FileType: file.type,
            FileData: file.base64,
            FileSize: file.size,
          }))
        ),
      });
      setPopupVisible(false);
      setFileData(null);
      getTabData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getTabData = async () => {
    try {
      setLoading(true);
      await getCandidateDocuments({
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
      }).then((response) => {
        if (!response?.data) {
          console.error("No response data received");
          return;
        }

        const { Files = [], Resume } = response.data;

        const resumeFile = Resume
          ? {
              ID: Resume.ID,
              Guid: Resume.Guid,
              FileName: Resume.FileName,
              FileType: Resume.FileType,
              FileUrl: Resume.FileUrl,
              isResume: true,
            }
          : null;

        const combinedFiles = resumeFile ? [...Files, resumeFile] : Files;

        setFilesList(combinedFiles);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileID) => {
    try {
      setLoading(true);
      await deleteCandidateDocuments({
        CandidateFileID: Number(fileID),
      }).then((response) => {
        if (!response || response.data.Error) return;
        getTabData();
        createNotification(
          "File deleted successfully",
          "success",
          3500,
          "top-right",
          2
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentData = async (fileData) => {
    if (!fileData?.Guid) return;

    const caller = fileData?.isResume ? getResume : getDocument;

    try {
      const response = await caller({
        Guid: fileData?.Guid,
      });

      if (
        !response?.data?.FileData ||
        !response?.data?.FileType ||
        !response?.data?.FileName
      ) {
        console.error("Invalid file data received");
        return;
      }

      const binaryData = atob(response.data.FileData);
      const byteArray = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        byteArray[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: response.data.FileType });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = response.data.FileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      createNotification(
        "Error downloading file",
        "error",
        3500,
        "top-right",
        2
      );
    }
  };
  useEffect(() => {
    getTabData();
  }, []);

  return (
    <div className={style.documentsTab}>
      <Popup
        visible={popupVisible}
        options={{ title: "Upload Document", mode: "normal" }}
        size={"small"}
      >
        <div className={style.uploaderWrapper}>
          <FileUploader
            dragAndDropText="Drag and drop files here or click to upload"
            maxSize={3145728}
            multiple={true}
            onChange={(files) => {
              setFileData(files);
            }}
          />
        </div>

        <div
          style={{
            marginTop: "2.0625rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <MainButton
            label={"Cancel"}
            type={"border"}
            size={"small"}
            customStyle={{ color: "#141719", borderColor: "#D1D5D6" }}
            onClick={() => {
              setPopupVisible(false);
              setFileData(null);
            }}
          />
          <MainButton
            label={"Save"}
            onClick={() => {
              handleUpload();
            }}
            loading={loading}
            size={"small"}
            customStyle={{
              background: "#30ACD0",
              border: "0.0625rem solid #30ACD0",
              color: "#fff",
            }}
          />
        </div>
      </Popup>
      <div className={style.documentTabHeader}>
        <h2>Documents</h2>
        <div
          className={style.addDocument}
          onClick={() => setPopupVisible(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.125rem"
            height="1.125rem"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="#6F787B"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M7 12.833c3.208 0 5.833-2.625 5.833-5.834S10.208 1.166 7 1.166 1.167 3.791 1.167 6.999 3.792 12.833 7 12.833M4.667 7h4.666M7 9.333V4.666"
            ></path>
          </svg>
        </div>
      </div>
      <div className={style.documentsContent}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 2 }} />
        ) : (
          <div className={style.filesList}>
            <div className={style.fileContainer}>
              {filesList?.length > 0 ? (
                filesList?.map((file, index) => (
                  <div key={index} className={style.fileItem}>
                    <div
                      className={style.fileItemName}
                      onClick={() => getDocumentData(file)}
                    >
                      <span>{file.FileName}</span>
                    </div>

                    <div
                      className={style.deleteFile}
                      onClick={() => handleDelete(file.CandidateFileID)}
                    >
                      <IconTrash />
                    </div>
                  </div>
                ))
              ) : (
                <div className={style.noFiles}>
                  No files found{" "}
                  <span onClick={() => setPopupVisible(true)}>
                    Click Here to Upload
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
