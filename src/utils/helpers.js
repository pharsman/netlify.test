import { useEffect, useRef } from "react";

export const __debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const useUpdateEffect = (effect, deps) => {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    return effect();
  }, deps);
};

export const __findNodeByKey = (array, key, typeName) =>
  array?.find((element) => element[key] === typeName);

export const __formatDate = (dateOrTimestamp, format) => {
  let date;
  if (dateOrTimestamp instanceof Date) {
    date = dateOrTimestamp;
  } else if (typeof dateOrTimestamp === "number") {
    date = new Date(dateOrTimestamp);
  } else if (typeof dateOrTimestamp === "string") {
    date = new Date(dateOrTimestamp);
  } else {
    throw new Error("Invalid date or timestamp provided.");
  }

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

  const tokens = {
    YYYY: date.getUTCFullYear().toString(),
    MM: (date.getUTCMonth() + 1).toString().padStart(2, "0"),
    DD: date.getUTCDate().toString().padStart(2, "0"),
  };

  const formattedString = format
    .replace(/YYYY/g, tokens.YYYY)
    .replace(/MM/g, tokens.MM)
    .replace(/DD/g, tokens.DD);

  return formattedString;
};

export const __collectKeyValuePairs = (dataArray) => {
  const result = {};
  dataArray.forEach((item) => {
    if (item.isGroup) {
      item.children.forEach((child) => {
        result[child.key] = child.props?.value || child.value || "";
      });
    } else if (item.key && item.props) {
      result[item.key] = item.props.value || "";
    }
  });
  return result;
};
