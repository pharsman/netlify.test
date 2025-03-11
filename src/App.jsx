import("@/styles/main.scss");
import { routes } from "@/routes/routes.jsx";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ThemeManager from "./utils/theme-manager/theme";
import { useEffect } from "react";
import colorsJson from "./utils/theme-manager/colors.json";

const App = () => {
  const themeManager = new ThemeManager("light");
  const location = useLocation();
  const navigate = useNavigate();

  const postMessageToParent = () => {
    const routeObj = {};
    const queryObj = {};

    if (location.search.length) {
      const cleanedString = location.search.substring(1);
      const keyValuePairs = cleanedString.split("&");
      keyValuePairs.forEach((pair) => {
        const [key, value] = pair.split("=");
        const cleanedValue = value.replace(/\+/g, " ");
        queryObj[key] = cleanedValue;
      });
    }

    routeObj.query = queryObj;
    routeObj.path = location.pathname;

    try {
      window.parent.postMessage(
        {
          action: "navigationFromChild",
          value: routeObj,
        },

        "*"
      );
    } catch (e) {
      console.log("navigation From child error", e);
    }
  };

  const messageHandler = (event) => {
    const { data } = event;

    switch (data.action) {
      case "navigation":
        const { url } = data.payload;

        try {
          window.parent.postMessage(
            {
              action: "childProjectCheck",
              value: url,
            },

            "*"
          );
        } catch (e) {
          console.log("childCheck error", e);
        }
        console.warn("data.payload.query", data.payload.query);
        console.warn("data", data);
        console.warn("url", url);
        if (data.payload.query) {
          navigate({
            pathname: `/recruitment/oneadmin/front${url}`,
            search: createSearchParams({
              ...data.payload.query,
            }).toString(),
          });
        } else {
          navigate({
            pathname: `/recruitment/oneadmin/front${url}`,
            replace: true,
          });
        }
    }
  };

  useEffect(() => {
    themeManager.loadColors(colorsJson);
    themeManager.applyColors("light");
    try {
      window.parent.postMessage(
        {
          action: "childProjectLoaded",
          value: "child Project loadeeed",
        },
        "*"
      );
    } catch (e) {
      console.log("Child Project not Loaded", e);
    }

    window.addEventListener("message", messageHandler);

    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, []);

  useEffect(() => {
    postMessageToParent();
  }, [location]);

  return (
    <Routes>
      {routes.map((route) => {
        return (
          <Route key={route.path} path={route.path} element={route.element}>
            {route.children
              ? route.children.map((child) => (
                  <Route
                    key={child.path}
                    path={`${route.path}/${child.path}`}
                    element={child.element}
                  ></Route>
                ))
              : null}
          </Route>
        );
      })}
    </Routes>
  );
};

export default App;
