import useUpdateEffect from "@/hooks/useUpdateEffect";
import Popup from "masterComponents/Popup";
import MainButton from "masterComponents/MainButton";
import { useVacanciesStore } from "../store/VacanciesStore";
import { useState } from "react";
import { getVacancyComments } from "../api/VacanciesApi";
import { __formatDate } from "@/utils/helpers";
import style from "@/pages/vacancies/style/VacancyComment.module.scss";
import Loader from "masterComponents/Loader";

export const VacancyComments = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { openVacancyComments, setOpenVacancyComments } = useVacanciesStore(
    (state) => state
  );

  const getComments = async () => {
    if (!openVacancyComments) return;
    setLoading(true);
    await getVacancyComments({
      VacancyID: openVacancyComments ?? null,
    }).then((response) => {
      setLoading(false);
      if (response.data) {
        setData(response.data?.Comments || []);
      }
    });
  };

  useUpdateEffect(() => {
    getComments();
  }, [openVacancyComments]);
  return (
    <Popup
      size={"small"}
      visible={!!openVacancyComments}
      onClickOutside={() => setOpenVacancyComments(null)}
      options={{
        title: "Comments",
        mode: "default",
      }}
    >
      <ul className={style.commentsList}>
        {loading ? (
          <div style={{ display: "grid", placeItems: "center", width: "100%" }}>
            <Loader loading={true} />
          </div>
        ) : (
          data &&
          data?.map((comment, index) => {
            return (
              <li key={index}>
                <h3>Commented By {comment?.AuthorName}</h3>
                <span>{__formatDate(comment?.CreateTime, "DD.MM.YYYY")}</span>
                <p>{comment?.Content ?? ""}</p>
              </li>
            );
          })
        )}
      </ul>
      <div
        style={{ display: "grid", placeItems: "center", marginTop: "0.75rem" }}
      >
        <MainButton
          onClick={() => setOpenVacancyComments(null)}
          label={"Cancel"}
          type={"border"}
          customStyle={{
            borderColor: "#D1D5D6",
            color: "#141719",
          }}
          size={"xs"}
        />
      </div>
    </Popup>
  );
};
