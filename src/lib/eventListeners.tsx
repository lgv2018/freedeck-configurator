import { CloudDownloadIcon, XIcon } from "@heroicons/react/outline";
import { useEffect } from "react";
import toast from "react-hot-toast";

import { IAppDispatch } from "../states/appState";
import { FDButton } from "./components/Button";
import { createToast } from "./createToast";
import { isMacOS } from "./util";

export const AddEventListeners = ({
  appDispatchContext,
}: {
  appDispatchContext: IAppDispatch;
}) => {
  const { setCtrl } = appDispatchContext;
  return useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e: Event) => {
      e.preventDefault();
      if (!localStorage.getItem("closedPWACTA"))
        createToast({
          text: "You can install the configurator to have it offline! Click here to install",
          danger: (t) => (
            <FDButton
              onClick={() => {
                localStorage.setItem("closedPWACTA", "true");
                toast.dismiss(t.id);
              }}
              prefix={<XIcon className="h-4 w-4" />}
            >
              Close
            </FDButton>
          ),
          primary: (t) => (
            <FDButton
              type="primary"
              onClick={() => {
                localStorage.setItem("closedPWACTA", "true");
                toast.dismiss(t.id);
                (e as any).prompt();
              }}
              prefix={<CloudDownloadIcon className="h-4 w-4" />}
            >
              Install
            </FDButton>
          ),
        });
    });
    const onKeyUpDown = (event: KeyboardEvent) => {
      if (isMacOS) {
        setCtrl(event.metaKey);
      } else {
        setCtrl(event.ctrlKey);
      }
    };
    document.addEventListener("keydown", onKeyUpDown);
    document.addEventListener("keyup", onKeyUpDown);
    window.onblur = () => setCtrl(false);
    // eslint-disable-next-line
  }, []); // only execute on page load
};