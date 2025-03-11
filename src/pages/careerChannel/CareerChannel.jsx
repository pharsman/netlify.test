import { useEffect, useState } from "react";
import style from "./CareerChannel.module.scss";
import Search from "masterComponents/Search";
import Loader from "masterComponents/Loader";
import CareerCard from "./components/CareerCard/CareerCard";
import { getAllInternal } from "./api/CareerApi";
import { useDebounce } from "@/hooks/useDebounce";

const CareerChannel = () => {
  const [Loading, setLoading] = useState(true);
  const [SearchValue, setSearchValue] = useState("");
  const [CardsData, setCardsData] = useState([]);

  const setDebouncedValue = useDebounce();

  const getCardColor = (type) => {
    const Colors = {
      Full: { OutsideColor: "#F8FCFE", InsideColor: "#EAF5FB" },
      Half: { OutsideColor: "#FCF6FD", InsideColor: "#F6ECF8" },
      Remote: { OutsideColor: "#FEF7EB", InsideColor: "#F7EEDF" },
      Intern: { OutsideColor: "#FCEFEC", InsideColor: "#F1E0DC" },
      Hybrid: { OutsideColor: "#ECEFFC", InsideColor: "#DFE3F4" },
      Test: { OutsideColor: "#FBFBFB", InsideColor: "#ececec" },
    };
    return Colors[type?.split(" ")[0]] || Colors.Test;
  };

  const AllInternal = async (searchWord) => {
    setLoading(true);

    const resp = await getAllInternal({ SearchWord: searchWord });
    const cardsWithColors = resp.data.map((card) => ({
      ...card,
      colorScheme: getCardColor(card.WorkTypes),
    }));
    setCardsData(cardsWithColors);
    setLoading(false);
  };

  const HandleSearch = (value) => {
    AllInternal(value);
  };

  useEffect(() => {
    AllInternal();
  }, []);

  return (
    <div className={style.CareerChannelContainer}>
      <div className={style.careerHeader}>
        <h1 className={style.careerHeaderTitle}>Career</h1>
        <div className={style.careerChannelSearch}>
          <Search
            value={SearchValue}
            change={(value) => {
              setSearchValue(value);
              setDebouncedValue(() => HandleSearch(value), 500);
            }}
          />
        </div>
      </div>
      {Loading && (
        <div
          style={{
            position: "fixed",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Loader loading={true} />
        </div>
      )}
      <div className={style.careerList}>
        {CardsData.length > 0 &&
          CardsData.map((card, index) => {
            return (
              <div style={{ height: "8.8125rem" }} key={index}>
                <CareerCard listReload={() => AllInternal()} card={card} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CareerChannel;
