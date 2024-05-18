import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { createStore } from "redux";
import { Provider } from "react-redux";
import authReducer from "./redux/authRedux";
import App from "./App";

const store = createStore(authReducer);

function disableRightClickAndCtrlShortcut() {
  function preventDefaultHandler(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  useEffect(() => {
    const preventDefaultForRightClick = (event) => {
      if (event.button === 2) {
        preventDefaultHandler(event);
      }
    };

    const preventDefaultForCtrlShortcut = (event) => {
      if (event.ctrlKey && (event.key === "c" || event.key === "u" || event.key === "i")) {
        preventDefaultHandler(event);
      }
    };

    document.addEventListener("contextmenu", preventDefaultForRightClick);
    document.addEventListener("keydown", preventDefaultForCtrlShortcut);

    return () => {
      document.removeEventListener("contextmenu", preventDefaultForRightClick);
      document.removeEventListener("keydown", preventDefaultForCtrlShortcut);
    };
  }, []);
}

function handleInspectDetection() {
  function handleKeyDown(event) {
    if (event.ctrlKey && event.shiftKey && event.key === "I") {
      event.preventDefault();
      return false;
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}

function handleKeyDown(event) {
  if (
    (event.ctrlKey && event.shiftKey && event.key === "I") ||
    (!event.shiftKey && !event.altKey && event.ctrlKey && event.key !== "F12") ||
    (!event.shiftKey && !event.altKey && event.key === "F12")
  ) {
    event.preventDefault();
    return false;
  }
}


const Root = () => {
  handleInspectDetection();
  disableRightClickAndCtrlShortcut();

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="App">
      <Provider store={store}>
        <App />
      </Provider>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);