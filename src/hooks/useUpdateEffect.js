import { useEffect, useRef } from "react";

export default function useUpdateEffect(callback, dependencies) {
  const InitialRender = useRef(true);

  useEffect(() => {
    if (InitialRender.current) {
      InitialRender.current = false;
      return;
    }
    return callback();
  }, dependencies);
}
