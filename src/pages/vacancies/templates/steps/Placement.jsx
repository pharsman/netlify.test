import { useEffect, useRef, useState } from "react";
import {
  getAssemblePlacementChannels,
  getAssemblePlacementData,
  getAssemblePlacementDetails,
  setAssemblePlacement,
} from "../../api/VacanciesApi";
import FormMultiSelectDropdown from "masterComponents/FormMultiSelectDropdown";
import style from "@/pages/vacancies/style/steps/Placement.module.scss";
import Datepicker from "masterComponents/Datepicker";
import CheckBox from "masterComponents/CheckBox";
import Tooltip from "masterComponents/Tooltip";
import { IconInfoCircle } from "@/assets/icons/other/IconInfoCircle";
import Tag from "masterComponents/Tag";
import { useVacanciesStore } from "../../store/VacanciesStore";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { storeActionTypes } from "../../constants";
import FormInput from "masterComponents/FormInput";
import Loader from "masterComponents/Loader";

export const Placement = ({ vacancyID }) => {
  const { actionTrigger, setActionTrigger, loadNextStep, loadPrevStep } =
    useVacanciesStore((state) => state);
  const [relatedVacancies, setRelatedVacancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState([]);
  const [refreshDataSource, setRefreshDataSource] = useState(0);

  const [publishDate, setPublishDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [autoRepost, setAutoRepost] = useState(false);
  const [autoRepostValue, setAutoRepostValue] = useState("");
  const [alarm, setAlarm] = useState(false);
  const [alarmValue, setAlarmValue] = useState("");

  const formRef = useRef(null);

  const getDropdownData = async () => {
    try {
      await getAssemblePlacementData().then((response) => {
        const { data } = response;
        const dataMap = data.map((el) => ({
          id: el.VacancyID,
          label: el.VacancyName,
        }));
        setRelatedVacancies(dataMap);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getChannels = async () => {
    try {
      await getAssemblePlacementChannels().then((response) => {
        const { data } = response?.data;
        const dataMap = data.map((el) => ({
          id: el.ID,
          label: el?.Name,
          ulr: el.Url,
        }));
        setChannels(dataMap);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const setSelectedItems = (selected, type) => {
    const selectedIds = selected.map((el) => el.id);
    switch (type) {
      case 1:
        setChannels((prev) => {
          const newChannels = [...prev];
          newChannels.forEach((el) => {
            if (selectedIds.includes(el.id)) el["selected"] = true;
            else el["selected"] = false;
          });
          return newChannels;
        });
        break;

      case 2:
        setRelatedVacancies((prev) => {
          const newRelatedVacancies = [...prev];
          newRelatedVacancies.forEach((el) => {
            if (selectedIds.includes(el.id)) el["selected"] = true;
            else el["selected"] = false;
          });
          return newRelatedVacancies;
        });
        break;
    }
  };

  const renderSelectedChannels = () => {
    if (!channels || !channels.length) return;
    const selectedChanels = channels.filter((el) => el.selected);

    return selectedChanels.map((channel, index) => (
      <Tag
        key={index}
        label={channel?.label ?? "empty"}
        type={"yellow"}
        allowDelete={false}
        withIcon={false}
      />
    ));
  };

  const renderSelectedRelatedVacancies = () => {
    if (!relatedVacancies || !relatedVacancies.length) return;
    const selectedChanels = relatedVacancies.filter((el) => el.selected);

    return selectedChanels.map((vacancy, index) => (
      <Tag
        key={index}
        label={vacancy?.label ?? "empty"}
        type={"yellow"}
        allowDelete={false}
        withIcon={false}
      />
    ));
  };

  const sendRequest = async (event) => {
    event.preventDefault();
    const placementsJson =
      channels?.filter((el) => el && el.selected).map((e) => e.id) || [];
    const relatedVacanciesJson =
      relatedVacancies?.filter((el) => el && el.selected).map((e) => e.id) ||
      [];
    const dataSet = {
      VacancyID: vacancyID ?? null,
      PlacementsJson: placementsJson ? JSON.stringify(placementsJson) : null,
      RelatedVacanciesJson: relatedVacanciesJson
        ? JSON.stringify(relatedVacanciesJson)
        : null,
      StartDate: publishDate,
      EndDate: endDate,
      RepostQty: autoRepost ? Number(autoRepostValue) : null,
      AlarmBeforeDays: alarm ? Number(alarmValue) : null,
    };

    try {
      setLoading(true);
      await setAssemblePlacement(dataSet).then((response) => {
        if (!response || response.Error || response.data.Error) {
          console.log("Placements, Request Error");
          setActionTrigger(null);
        } else {
          loadNextStep();
        }
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getPlacementData = async () => {
    if (!vacancyID) return;
    try {
      setLoading(true);
      await getAssemblePlacementDetails({
        VacancyID: vacancyID,
      }).then((response) => {
        const { data } = response;
        if (data) {
          const relatedVacancyIds =
            data?.RelatedVacancies?.map((el) => el.RelatedVacancyID) || [];
          const placementIds =
            data?.Placements?.map((el) => el.PlacementChannelID) || [];

          setRelatedVacancies((prev) => {
            const newRelatedVacancies = [...prev];
            newRelatedVacancies.forEach((e) => {
              if (relatedVacancyIds.includes(e.id)) e["selected"] = true;
              else e["selected"] = false;
            });
            return newRelatedVacancies;
          });

          setChannels((prev) => {
            const newChannels = [...prev];
            newChannels.forEach((e) => {
              if (placementIds.includes(e.id)) e["selected"] = true;
              else e["selected"] = false;
            });
            return newChannels;
          });

          setPublishDate(data?.PublishInfo?.StartDate);
          setEndDate(data?.PublishInfo?.EndDate);

          setAutoRepost(!!data?.PublishInfo.RepostQty);
          setAlarm(!!data?.PublishInfo.AlarmBeforeDays);
          setAutoRepostValue(data?.PublishInfo.RepostQty);
          setAlarmValue(data?.PublishInfo.AlarmBeforeDays);
        }
        setLoading(false);
        setRefreshDataSource((state) => (state += 1));
      });
    } catch (error) {
      setLoading(false);
    }
  };

  const initialCalls = async () => {
    setLoading(true);
    Promise.all([await getDropdownData(), await getChannels()]);
    setLoading(false);
  };
  useEffect(() => {
    initialCalls().then(() => {
      getPlacementData();
    });
  }, []);

  useUpdateEffect(() => {
    if (
      actionTrigger &&
      actionTrigger == storeActionTypes.REQUEST_ACTIONS.LOAD_NEXT_STEP
    ) {
      formRef.current.requestSubmit();
      setActionTrigger(null);
    } else if (
      actionTrigger == storeActionTypes.REQUEST_ACTIONS.LOAD_PREV_STEP
    ) {
      loadPrevStep();
      setActionTrigger(null);
    }
  }, [actionTrigger]);

  return (
    <div className={style.placementsWrapper}>
      {loading ? (
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
      ) : (
        ""
      )}
      <form key={refreshDataSource} ref={formRef} onSubmit={sendRequest}>
        <ul>
          <li>
            <FormMultiSelectDropdown
              label={"Placement Channels"}
              isRequired={true}
              data={channels}
              withApply={false}
              change={(arr) => {
                setSelectedItems(arr, 1);
              }}
            />
            <div className={style.tagsList}>{renderSelectedChannels()}</div>
          </li>
          <li>
            <FormMultiSelectDropdown
              label={"Select Related Vacancies"}
              withApply={false}
              data={relatedVacancies}
              change={(arr) => {
                setSelectedItems(arr, 2);
              }}
            />
            <div className={style.tagsList}>
              {renderSelectedRelatedVacancies()}
            </div>
          </li>
          <li>
            <Datepicker
              placeholder={"Publish Date"}
              size={"large"}
              valueFormat={"YYYY-MM-DD"}
              onChange={(date) => setPublishDate(date)}
              onClear={setPublishDate}
              defaultValue={publishDate}
              allowClear={true}
            />
          </li>
          <li>
            <Datepicker
              placeholder={"End Date"}
              size={"large"}
              valueFormat={"YYYY-MM-DD"}
              onChange={(date) => setEndDate(date)}
              onClear={setEndDate}
              defaultValue={endDate}
              allowClear={true}
            />
          </li>
          <li className={style.checkBoxField}>
            <div>
              <div>
                <CheckBox checked={autoRepost} change={setAutoRepost} />
                <span>Auto - Repost</span>
                <Tooltip
                  label={
                    "Vacancy will automatically repost for the same duration after the end date"
                  }
                >
                  <div className={style.iconWrapper}>
                    <IconInfoCircle color={"#6F787B"} />
                  </div>
                </Tooltip>
              </div>
              {autoRepost ? (
                <div>
                  <FormInput
                    label={"Cycle qty"}
                    value={autoRepostValue}
                    onChange={setAutoRepostValue}
                    size={"small"}
                    inputType={"number"}
                    hideArrows={true}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              <div>
                <CheckBox checked={alarm} change={setAlarm} />
                <span>Set Alarm Before X days</span>
              </div>
              {alarm ? (
                <div>
                  <FormInput
                    label={"Days"}
                    value={alarmValue}
                    onChange={setAlarmValue}
                    size={"small"}
                    inputType={"number"}
                    hideArrows={true}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
};
