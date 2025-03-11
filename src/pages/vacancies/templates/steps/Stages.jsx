import { useEffect, useState } from "react";
import {
  getAssembleStages,
  getStageTypes,
  setAssembleVacancyStages,
} from "../../api/VacanciesApi";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useVacanciesStore } from "../../store/VacanciesStore";
import { storeActionTypes } from "../../constants";
import FormMultiSelectDropdown from "masterComponents/FormMultiSelectDropdown";
import { SortableStageItem } from "../../components/SortableStages";
import style from "@/pages/vacancies/style/steps/SortableStages.module.scss";
import Loader from "masterComponents/Loader";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { createNotification } from "masterComponents/Notification";
export const Stages = ({ vacancyID }) => {
  const [refreshDataSource, setRefreshDataSource] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dataStages, setDataStages] = useState([]);
  const [selectedStages, setSelectedStages] = useState([]);
  const { actionTrigger, loadNextStep, loadPrevStep, setActionTrigger } =
    useVacanciesStore((state) => state);

  const getStagesData = async () => {
    try {
      setLoading(true);
      const { data } = await getStageTypes();
      if (data) {
        const dataMap = data.map((stage, index) => ({
          ...stage,
          label: stage?.Name,
          id: stage.ID,
          selected: stage?.selected || stage.IsCommon,
          expanded: false,
          disabled: stage?.IsCommon,
          index,
        }));
        setDataStages(dataMap);
        if (dataMap.some((el) => el.IsCommon))
          setSelectedStages(dataMap.filter((el) => el.IsCommon));
      }
    } catch (error) {
      setLoading(true);
    }
  };

  const getStagesInfo = async () => {
    try {
      setLoading(true);
      await getAssembleStages({
        VacancyID: vacancyID,
      }).then((response) => {
        setLoading(false);
        if (response.data) {
          const stageItemIds =
            response?.data?.map((el) => el.StageTypeID) ?? [];
          setDataStages((prev) => {
            const newDataStages = [...prev];
            newDataStages.forEach((el) => {
              const currentItem =
                response?.data.find((stage) => stage.StageTypeID === el.ID) ??
                null;
              if (stageItemIds?.includes(el.ID)) {
                el["selected"] = true;
                el["index"] = currentItem?.Sort;
                el["itemsJson"] = JSON.stringify(
                  currentItem?.Criteria.map((c) => c.CriteriaID)
                );
              }
            });
            return newDataStages;
          });
          setRefreshDataSource((state) => (state += 1));
        }
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const setSelectedCriteriasToParent = (id, criterias) => {
    setSelectedStages((prev) => {
      const newSelectedStages = [...prev];
      const targetStage = newSelectedStages.find((el) => el.ID === id);

      if (targetStage) {
        const existingCriterias = targetStage?.itemsJson
          ? JSON.parse(targetStage?.itemsJson)
          : [];

        const mergedCriterias = Array.from(
          new Set([...existingCriterias, ...criterias])
        );
        targetStage.itemsJson = JSON.stringify(mergedCriterias);
      }

      return newSelectedStages;
    });
  };

  const sendRequest = async () => {
    let stageTypesJson = selectedStages.map((stage, index) => ({
      StageTypeID: stage.ID ?? null,
      Sort: index + 1,
      CriteriaIDs: stage.itemsJson ? JSON.parse(stage.itemsJson) : null,
    }));

    const dataSet = {
      VacancyID: vacancyID ?? null,
      StageTypesJson: JSON.stringify(stageTypesJson),
    };

    if (stageTypesJson.length === 0) {
      createNotification(
        "Please fill the stages",
        "error",
        3500,
        "top-right",
        2
      );

      setActionTrigger(null);
      return;
    }

    setLoading(true);
    try {
      await setAssembleVacancyStages(dataSet).then((response) => {});
      setLoading(false);
      loadNextStep();
      setActionTrigger(null);
    } catch (error) {
      setLoading(false);
      setActionTrigger(null);
    }
  };

  const selectStages = (data) => {
    setSelectedStages(data?.sort((a, b) => a.index - b.index));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = selectedStages.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = selectedStages.findIndex((item) => item.id === over.id);

      const reselectedStages = arrayMove(
        selectedStages,
        oldIndex,
        newIndex
      ).map((item, newIndex) => ({
        ...item,
        index: newIndex,
      }));

      setSelectedStages(reselectedStages);
    }
  };

  const setExpandItem = (id, state) => {
    setSelectedStages((prev) => {
      const newOrderedItems = [...prev];
      const currentItem = newOrderedItems.find((el) => el.id === id);
      currentItem.expanded = state;
      return newOrderedItems;
    });
  };

  useEffect(() => {
    getStagesData().then(() => {
      getStagesInfo();
    });
  }, []);

  useUpdateEffect(() => {
    if (
      actionTrigger &&
      actionTrigger == storeActionTypes.REQUEST_ACTIONS.LOAD_NEXT_STEP
    ) {
      sendRequest();
    } else if (
      actionTrigger == storeActionTypes.REQUEST_ACTIONS.LOAD_PREV_STEP
    ) {
      loadPrevStep();
      setActionTrigger(null);
    }
  }, [actionTrigger]);

  return (
    <>
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
      <div>
        <FormMultiSelectDropdown
          label={"Select Stages"}
          key={refreshDataSource}
          data={dataStages}
          withApply={false}
          size={"small"}
          change={selectStages}
          isRequired={true}
        />
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={selectedStages.map((item) => item.id)}>
          <div className={style.sortableItemsList} key={refreshDataSource}>
            {selectedStages.map((item, index) => (
              <SortableStageItem
                key={item.id}
                index={index}
                item={item}
                onExpand={setExpandItem}
                onCriteriaChange={setSelectedCriteriasToParent}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
};
