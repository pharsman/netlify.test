import style from "@/pages/candidates/style/UploadPhoto.module.scss";
import IconPhoto from "@/assets/icons/other/photo.svg";
import { useEffect, useState } from "react";
export const UploadPhoto = ({ setImage, image }) => {
  const getFiles = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload only image files.");
        return;
      }

      const reader = new FileReader();
      let base64Image;

      reader.onload = function (e) {
        base64Image = e.target.result;
        console.log(base64Image);

        const imgElement = document.getElementById("preview");
        imgElement.src = base64Image;
        imgElement.style.display = "block";

        setImage({
          FileData: base64Image,
          FileName: file.name,
          FileSize: file.size,
          FileType: file.type,
        });
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No file selected");
    }
  };

  //   useEffect(() => {
  //     if(image){

  //     }
  //   },[])

  return (
    <div className={style.uploadPhotoContent}>
      <input
        id={"upload-avatar-image"}
        type="file"
        hidden
        onChange={getFiles}
      />
      <label htmlFor="upload-avatar-image" className={style.uploadIcon}>
        <img
          className={`${image ? style.avatar : ""}`}
          src={image ? image : IconPhoto}
          alt="avatar"
        />
      </label>
      <img
        id={"preview"}
        className={style.uploadedPhoto}
        style={{ display: "none" }}
      />
    </div>
  );
};
