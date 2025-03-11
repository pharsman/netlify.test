import {
  getCandidateDetailsForCV,
  sentExportCV,
} from "../api/CandidateProfileApi";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Popup from "masterComponents/Popup";

export const GenerateCV = ({ onDone }) => {
  const { candidateID, vacancyID } = useParams();
  const [CVtemplate, setCVTemplate] = useState("");

  const getCandidateDetailsData = async () => {
    try {
      const response = await getCandidateDetailsForCV({
        CandidateID: Number(candidateID),
        VacancyID: Number(vacancyID),
      });
      if (!response || response.Error || response.data.Error) return;

      const { data } = response;
      let htmlData = "";
      htmlData = `
     <div style="width: 820px; background: #FFF; display: flex; justify-content: flex-start">
        <div style="width: 344px; background: #E9E6FD; padding: 30px; float: left;">
          <div style="margin-bottom: 12px;">
            <div style="display: inline-block; vertical-align: middle; margin-right: 12px;">
              <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.3333 14.791H4.66659C1.99992 14.791 1.33325 14.1243 1.33325 11.4577V6.12435C1.33325 3.45768 1.99992 2.79102 4.66659 2.79102H11.3333C13.9999 2.79102 14.6666 3.45768 14.6666 6.12435V11.4577C14.6666 14.1243 13.9999 14.791 11.3333 14.791Z" stroke="#4D4D4E" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9.33325 6.125H12.6666" stroke="#4D4D4E" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 8.79102H12.6667" stroke="#4D4D4E" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.3333 11.457H12.6666" stroke="#4D4D4E" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5.66663 8.31763C6.33305 8.31763 6.87329 7.77739 6.87329 7.11096C6.87329 6.44454 6.33305 5.9043 5.66663 5.9043C5.0002 5.9043 4.45996 6.44454 4.45996 7.11096C4.45996 7.77739 5.0002 8.31763 5.66663 8.31763Z" stroke="#4D4D4E" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7.99992 11.6782C7.90659 10.7115 7.13992 9.95151 6.17325 9.86484C5.83992 9.83151 5.49992 9.83151 5.15992 9.86484C4.19325 9.95818 3.42659 10.7115 3.33325 11.6782" stroke="#4D4D4E" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div style="display: inline-block; vertical-align: middle;">
              <span style="font-size: 12px; font-weight: 400; color: #6F787B; display: block;">
                Personal ID
              </span>
              <p style="font-size: 14px; font-weight: 500; color: #141719; margin-top: 4px">
                ${data?.Candidate?.PersonalNumber}
              </p>
            </div>
          </div>

          <div style="margin-bottom: 16px;">
            <div style="display: inline-block; vertical-align: middle; margin-right: 12px;">
              <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_3271_51343)">
                  <path d="M10.5945 2.35191C11.4261 1.65331 12.6652 1.75373 13.2962 2.63853C13.4647 2.87487 13.6645 3.15675 14.0094 3.58926C15.196 5.07712 15.196 7.23151 14.0028 8.71409C13.1221 9.80856 12.1984 10.9129 11.1661 11.9478C10.1336 12.9826 9.03188 13.9084 7.93998 14.7913C6.46088 15.9873 4.31157 15.9873 2.82721 14.7978C2.36684 14.4289 2.07963 14.2279 1.83583 14.0534C0.983149 13.443 0.863683 12.2458 1.52949 11.4348C2.05562 10.794 2.64145 10.1826 3.20664 9.58582C3.65686 9.11043 4.40874 9.07937 4.91972 9.4884C5.05716 9.59843 5.2278 9.74343 5.57378 10.0686C7.27169 9.05725 8.30072 8.01319 9.29125 6.34231C8.96295 5.9913 8.81816 5.81975 8.70745 5.68066C8.30009 5.16888 8.33032 4.41718 8.80741 3.96999C9.38887 3.42498 9.98061 2.86763 10.5945 2.35191Z" stroke="#4D4D4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_3271_51343">
                    <rect width="16" height="16" fill="white" transform="translate(0 0.791016)"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div style="display: inline-block; vertical-align: middle;">
              <span style="font-size: 12px; font-weight: 400; color: #6F787B; display: block;">
                Phone
              </span>
              <p style="font-size: 14px; font-weight: 500; color: #141719; margin-top: 4px">
                ${data?.Candidate?.MobileNumber}
              </p>
            </div>
          </div>
          
          <div style="margin-bottom: 16px;">
            <div style="display: inline-block; vertical-align: middle; margin-right: 12px;">
              <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.73169 4.70512C3.17939 6.10457 4.68728 7.40059 6.34457 8.54295C7.34319 9.23128 8.65655 9.23127 9.65515 8.54293C11.3125 7.40056 12.8203 6.10453 14.268 4.70508" stroke="#4D4D4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4.3931 3.14929C3.61667 3.22347 2.89283 3.51808 2.33961 3.98509C1.7864 4.45209 1.43645 5.06395 1.34683 5.72087C1.21439 6.72037 1.10181 7.74508 1.10181 8.79128C1.10181 9.83748 1.21439 10.8631 1.34683 11.8617C1.43645 12.5186 1.7864 13.1305 2.33961 13.5974C2.89283 14.0645 3.61667 14.3591 4.3931 14.4333C5.56636 14.5398 6.77162 14.6294 8.00006 14.6294C9.2285 14.6294 10.4338 14.5398 11.6082 14.4333C12.3846 14.3591 13.1084 14.0645 13.6616 13.5974C14.2149 13.1305 14.5648 12.5186 14.6544 11.8617C14.7847 10.8622 14.8983 9.83748 14.8983 8.79128C14.8983 7.74508 14.7857 6.71943 14.6533 5.72087C14.5637 5.06395 14.2137 4.45209 13.6606 3.98509C13.1073 3.51808 12.3834 3.22347 11.607 3.14929C10.4349 3.0428 9.22961 2.95312 8.00006 2.95312C6.77052 2.95312 5.56636 3.0428 4.3931 3.14929Z" stroke="#4D4D4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div style="display: inline-block; vertical-align: middle;">
              <span style="font-size: 12px; font-weight: 400; color: #6F787B; display: block;">
                Email
              </span>
              <p style="font-size: 14px; font-weight: 500; color: #141719; margin-top: 4px">
                ${data?.Candidate?.Email}
              </p>
            </div>
          </div>

          <div style="margin-bottom: 40px;">
            <div style="display: inline-block; vertical-align: middle; margin-right: 12px;">
              <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.73169 4.70512C3.17939 6.10457 4.68728 7.40059 6.34457 8.54295C7.34319 9.23128 8.65655 9.23127 9.65515 8.54293C11.3125 7.40056 12.8203 6.10453 14.268 4.70508" stroke="#4D4D4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4.3931 3.14929C3.61667 3.22347 2.89283 3.51808 2.33961 3.98509C1.7864 4.45209 1.43645 5.06395 1.34683 5.72087C1.21439 6.72037 1.10181 7.74508 1.10181 8.79128C1.10181 9.83748 1.21439 10.8631 1.34683 11.8617C1.43645 12.5186 1.7864 13.1305 2.33961 13.5974C2.89283 14.0645 3.61667 14.3591 4.3931 14.4333C5.56636 14.5398 6.77162 14.6294 8.00006 14.6294C9.2285 14.6294 10.4338 14.5398 11.6082 14.4333C12.3846 14.3591 13.1084 14.0645 13.6616 13.5974C14.2149 13.1305 14.5648 12.5186 14.6544 11.8617C14.7847 10.8622 14.8983 9.83748 14.8983 8.79128C14.8983 7.74508 14.7857 6.71943 14.6533 5.72087C14.5637 5.06395 14.2137 4.45209 13.6606 3.98509C13.1073 3.51808 12.3834 3.22347 11.607 3.14929C10.4349 3.0428 9.22961 2.95312 8.00006 2.95312C6.77052 2.95312 5.56636 3.0428 4.3931 3.14929Z" stroke="#4D4D4E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div style="display: inline-block; vertical-align: middle;">
              <span style="font-size: 12px; font-weight: 400; color: #6F787B; display: block;">
                Country/City
              </span>
              <p style="font-size: 14px; font-weight: 500; color: #141719; margin-top: 4px">
                ${data?.Candidate?.City} / ${data?.Candidate?.Country}
              </p>
            </div>
          </div>

          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 16px; font-weight: 700; color: #141719; margin-bottom: 16px;">Education</h2>

            ${(data?.Educations || [])
              .filter((education) => !education.IsCourse)
              .reduce((html, education) => {
                return (
                  html +
                  `
                  <div style="margin-bottom: 16px;">
                    <span style="font-size: 14px; font-weight: 500; color: #141719; border-left: 2px solid #FF8862; padding-left: 8px; display: block;">
                      ${education.FieldOfStudy}
                    </span>
                    <div style="padding-left: 8px; margin-top: 4px;">
                      <span style="font-size: 12px; font-weight: 400; color: #141719;">
                        ${
                          education.DegreeName ||
                          (education.IsCourse ? "Course" : "")
                        }
                      </span>
                      <span style="font-size: 12px; font-weight: 400; color: #141719; margin-left: 6px;">
                        ${education.InstitutionName}
                      </span>
                      <span style="font-size: 12px; font-weight: 400; color: #6F787B; margin-left: 6px;">
                        (${new Date(education.GraduationDate).getFullYear()})
                      </span>
                    </div>
                  </div>`
                );
              }, "")}
          </div>

          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 16px; font-weight: 700; color: #141719; margin-bottom: 16px;">Course and Trainings</h2>

            ${(data?.Educations || [])
              .filter((education) => education.IsCourse)
              .reduce((html, education) => {
                return (
                  html +
                  `
                  <div style="margin-bottom: 16px;">
                    <span style="font-size: 14px; font-weight: 500; color: #141719; border-left: 2px solid #FF8862; padding-left: 8px; display: block;">
                      ${education.FieldOfStudy}
                    </span>
                    <div style="padding-left: 8px; margin-top: 4px;">
                      <span style="font-size: 12px; font-weight: 400; color: #141719;">
                        ${
                          education.DegreeName ||
                          (education.IsCourse ? "Course" : "")
                        }
                      </span>
                      <span style="font-size: 12px; font-weight: 400; color: #141719; margin-left: 6px;">
                        ${education.InstitutionName}
                      </span>
                      <span style="font-size: 12px; font-weight: 400; color: #6F787B; margin-left: 6px;">
                        (${new Date(education.GraduationDate).getFullYear()})
                      </span>
                    </div>
                  </div>`
                );
              }, "")}
          </div>

          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 16px; font-weight: 700; color: #141719; margin-bottom: 16px;">Recommender</h2>

            ${(data?.Recommenders || []).reduce((html, recommender) => {
              return (
                html +
                `
                <div style="margin-bottom: 16px;">
                  <span style="font-size: 14px; font-weight: 500; color: #141719; border-left: 2px solid #FF8862; padding-left: 8px; display: block;">
                    ${recommender.FullName}
                  </span>
                  <div style="padding-left: 8px; margin-top: 4px;">
                    <span style="font-size: 12px;">
                      <a href="${recommender.LinkedinUrl}" style="font-size: 12px; font-weight: 400; color: #30ACD0;">LinkedIn</a>
                    </span>
                  </div>
                </div>`
              );
            }, "")}
          </div>
        </div>


        <div style="width: 476px; padding: 30px; float: left;">
           <div style="margin-bottom: 40px;">
                <div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; float: left; margin-right: 16px;">
                   <img src="${
                     data?.Candidate?.AvatarUrl
                   }" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;"/>
                </div>
                <div style="overflow: hidden;">
                  <span style="font-size: 24px; font-weight: 700; color: #141719;">${
                    data?.Candidate?.CandidateName
                  }</span>
                  <p style="margin-top: 8px; font-size: 14px; font-weight: 400; color: #6F787B;">${
                    data?.Candidate?.VacancyName
                  }</p>

                  <div style="margin-top: 6px;">
                    ${(data?.Tags || []).reduce((html, tag) => {
                      return (
                        html +
                        `<span style="font-size: 12px; font-weight: 500; color: #5E2650; border-radius: 15px; background: #F3E9F0; padding: 4px 8px; margin: 4px 8px 4px 0; display: inline-block;">${tag.Name}</span>`
                      );
                    }, "")}
                  </div>
                </div>
           </div>

          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 16px; font-weight: 700; color: #141719; margin-bottom: 16px;">Experiences</h2>

            ${(data?.Experiences || []).reduce((html, experience) => {
              return (
                html +
                `
                  <div style="margin-bottom: 16px;">
                    <span style="font-size: 14px; font-weight: 500; color: #141719; border-left: 2px solid #FF8862; padding-left: 8px; display: block;">
                      ${experience.JobName}
                    </span>
                    <div style="padding-left: 8px; margin-top: 4px;">
                      <span style="font-size: 12px; font-weight: 400; color: #141719;">
                        ${experience.CompanyName}
                      </span>
                      <span style="font-size: 12px; font-weight: 400; color: #141719; margin-left: 6px;">
                        ${experience.IndustryName}
                      </span>
                      <span style="font-size: 12px; font-weight: 400; color: #6F787B; margin-left: 6px;">
                        (${new Date(experience.StartDate).getFullYear()} - ${
                  experience.EndDate
                    ? new Date(experience.EndDate).getFullYear()
                    : "Present"
                })
                      </span>
                    </div>
                  </div>`
              );
            }, "")}
          </div>   

          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 16px; font-weight: 700; color: #141719; margin-bottom: 16px;">Competencies</h2>

            <div>
              ${(data?.Competencies || []).reduce((html, competency) => {
                return (
                  html +
                  `<span style="font-size: 12px; font-weight: 500; color: #FF8862; border-radius: 15px; background: #FFF1EC; padding: 4px 8px; margin: 4px 8px 4px 0; display: inline-block;">${competency.Name}</span>`
                );
              }, "")}
            </div>
          </div>

          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 16px; font-weight: 700; color: #141719; margin-bottom: 16px;">Skills</h2>

            <div>
              ${(data?.Skills || []).reduce((html, skill) => {
                return (
                  html +
                  `<span style="font-size: 12px; font-weight: 500; color: #FF8862; border-radius: 15px; background: #FFF1EC; padding: 4px 8px; margin: 4px 8px 4px 0; display: inline-block;">${skill.Name}</span>`
                );
              }, "")}
            </div>
          </div>

          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 16px; font-weight: 700; color: #141719; margin-bottom: 16px;">Languages</h2>

            <div>
              ${(data?.Languages || []).reduce((html, language) => {
                return (
                  html +
                  `<span style="font-size: 12px; font-weight: 500; color: #FF8862; border-radius: 15px; background: #FFF1EC; padding: 4px 8px; margin: 4px 8px 4px 0; display: inline-block;">${language.Name}</span>`
                );
              }, "")}
            </div>
          </div>

          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 16px; font-weight: 700; color: #141719; margin-bottom: 16px;">Additional Details</h2>

            <div>
              ${(data?.CustomFields || []).reduce((html, field) => {
                return (
                  html +
                  `<div style="margin-bottom: 12px;">
                    <span style="font-size: 12px; font-weight: 400; color: #6F787B; display: block;">${field.Name}</span>
                    <p style="font-size: 14px; font-weight: 500; color: #141719; margin-top: 4px">${field.Value}</p>
                  </div>`
                );
              }, "")}
            </div>
          </div>

        </div>
      </div>
      `;
      setCVTemplate(htmlData);
      sentExportRequest(htmlData);
    } catch (error) {
      console.log(error);
    }
  };

  const sentExportRequest = async (htmlData) => {
    try {
      if (!htmlData) {
        console.log("CV template is empty");
        return;
      }

      await sentExportCV({
        Html: htmlData,
      }).then((response) => {
        if (!response) {
          console.error("No response received");
          return;
        }
        if (response.Error) {
          console.error("Error in response:", response.Error);
          return;
        }
        if (response.data?.Error) {
          console.error("Error in response data:", response.data.Error);
          return;
        }

        const base64Data = response?.data ?? null;
        if (!base64Data) {
          console.error("No base64 data received");
          return;
        }

        try {
          const binaryData = atob(base64Data);
          const byteArray = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            byteArray[i] = binaryData.charCodeAt(i);
          }
          const blob = new Blob([byteArray], { type: "application/pdf" });

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "CV.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error processing PDF data:", error);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      onDone();
    }
  };

  useEffect(() => {
    getCandidateDetailsData();
  }, []);

  return (
    <div>
      <Popup
        visible={!!CVtemplate}
        options={{
          title: "",
          mode: "normal",
        }}
        size={"medium"}
      >
        <div dangerouslySetInnerHTML={{ __html: CVtemplate }} />
      </Popup>
    </div>
  );
};
