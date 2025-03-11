import { useState, useRef, useEffect } from "react";
import Popup from "masterComponents/Popup";
import MainButton from "masterComponents/MainButton";
import Textarea from "masterComponents/Textarea";
import { useCandidatesStore } from "../store/CandidatesStore";
import { getComments, createComment } from "../api/CandidatesApi";
import Loader from "masterComponents/Loader";
export const CandidateComments = () => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const { viewCommentsTo, setViewCommentsTo } = useCandidatesStore();
  const [loading, setLoading] = useState(false);

  const sendComment = async () => {
    try {
      setLoading(true);
      const response = await createComment({
        CandidateID: viewCommentsTo.CandidateID,
        VacancyID: viewCommentsTo.VacancyID,
        Content: comment,
      });
      if (!response || response.data?.Error || response.Error) return;
      setComment("");
      getCommentsData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getCommentsData = async () => {
    try {
      setLoading(true);
      const response = await getComments({
        CandidateID: viewCommentsTo.CandidateID,
        VacancyID: viewCommentsTo.VacancyID,
      });
      if (!response || response.data?.Error || response.Error) return;
      setComments(response?.data?.reverse());
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCommentsData();
  }, [viewCommentsTo]);

  return (
    <Popup
      visible={true}
      options={{ title: "Comments", mode: "normal" }}
      size={"small"}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <Textarea
          textareaStyle={{ width: "100%" }}
          placeholder="Type comment here..."
          value={comment}
          onChange={(value) => setComment(value)}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            maxHeight: "300px",
            overflowY: "auto",
            position: "relative",
          }}
        >
          {loading ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                position: comments.length ? "absolute" : "static",
                zIndex: comments.length ? "50" : "auto",
                background: comments.length ? "#ffffff70" : "transparent",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Loader loading={true} circleColor={"#30ACD0"} />
            </div>
          ) : (
            ""
          )}
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div
                style={{
                  borderRadius: "0.25rem",
                  border: "0.0625rem solid var(--color-stroke-softer-initial)",
                  background: " var(--color-surface-canvas-initial)",
                  padding: "0.5rem 0.75rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
                key={comment.ID}
              >
                <span style={{ color: "#30ACD0", fontSize: "0.875rem" }}>
                  {comment?.AuthorName}
                </span>
                <span
                  style={{
                    color: "var(--color-text-softer-default)",
                    fontSize: "0.875rem",
                  }}
                >
                  {comment?.CreateTime &&
                    new Date(comment.CreateTime).toISOString().split("T")[0]}
                </span>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--color-text-strong-default)",
                  }}
                >
                  {comment?.Content}
                </p>
              </div>
            ))
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "grid",
                placeItems: "center",
              }}
            >
              {!loading ? <span>No comments yet</span> : ""}
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: "1rem",
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
            onClick={() => setViewCommentsTo(null)}
          />
          <MainButton
            label={"Save"}
            onClick={sendComment}
            size={"small"}
            customStyle={{
              background: "#30ACD0",
              border: "0.0625rem solid #30ACD0",
              color: "#fff",
            }}
          />
        </div>
      </div>
    </Popup>
  );
};
