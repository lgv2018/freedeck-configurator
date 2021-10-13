import { useSimpleReducer } from "@bitovi/use-simple-reducer";
import React from "react";
import { HiDocumentAdd } from "react-icons/hi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { GlobalSettings } from "./components/GeneralSettings";
import { Header } from "./containers/Header";
import { Login } from "./components/Login";
import { Page } from "./components/Page";
import { ContentBody } from "./containers/ContentBody";
import { Main } from "./containers/Main";
import { colors } from "./definitions/colors";
import { useShowLogin, useShowSettings } from "./hooks/states";
import { FDIconButtonFixed } from "./lib/components/Button";
import { createButtonBody, createImageBody } from "./lib/configFile/createBody";
import { createFooter } from "./lib/configFile/createFooter";
import { createHeader } from "./lib/configFile/createHeader";
import { loadConfigFile } from "./lib/configFile/loadConfigFile";
import { download } from "./lib/download";
import { AddEventListeners } from "./lib/eventListeners";
import {
  AppDispatchContext,
  appReducer,
  AppState,
  AppStateContext,
  IAppReducer,
} from "./states/appState";
import {
  ConfigDispatchContext,
  configReducer,
  ConfigState,
  ConfigStateContext,
  IConfigReducer,
} from "./states/configState";

const StyledToastContainer = styled(ToastContainer).attrs({
  // custom props
})`
  .Toastify__toast-container {
  }
  .Toastify__toast {
    background-color: ${colors.accentDark};
    border: 1px solid ${colors.accent};
  }
  .Toastify__toast--error {
  }
  .Toastify__toast--warning {
  }
  .Toastify__toast--success {
  }
  .Toastify__toast-body {
    color: ${colors.brightWhite};
  }
  .Toastify__progress-bar {
    background-color: ${colors.gray};
  }
`;

const App: React.FC<{
  defaultConfigState: ConfigState;
  defaultAppState: AppState;
}> = ({ defaultConfigState, defaultAppState }) => {
  const [configState, configDispatch] = useSimpleReducer<
    ConfigState,
    IConfigReducer
  >(defaultConfigState, configReducer);

  const [appState, appDispatch] = useSimpleReducer<AppState, IAppReducer>(
    defaultAppState,
    appReducer
  );

  AddEventListeners({ appDispatchContext: appDispatch });

  const [showSettings, setShowSettings] = useShowSettings();
  const [showLogin, setShowLogin] = useShowLogin();

  const createConfigBuffer = async (): Promise<Buffer> =>
    Buffer.concat([
      createHeader(
        configState.width,
        configState.height,
        configState.brightness,
        configState.buttonSettingsPages.length
      ),
      createButtonBody(configState.buttonSettingsPages),
      createImageBody(
        configState.displaySettingsPages.map((page) =>
          page.map((display) => display.convertedImage)
        )
      ),
      createFooter(configState),
    ]);
  return (
    <ConfigStateContext.Provider value={configState}>
      <ConfigDispatchContext.Provider value={configDispatch}>
        <AppStateContext.Provider value={appState}>
          <AppDispatchContext.Provider value={appDispatch}>
            <Main>
              {
                <Header
                  loadConfigFile={(filesOrBuffer) =>
                    loadConfigFile(filesOrBuffer, configDispatch.setState)
                  }
                  saveConfigFile={async () => {
                    if (configState.displaySettingsPages.length === 0) return;
                    const completeBuffer = await createConfigBuffer();

                    completeBuffer && download(completeBuffer);
                  }}
                  setShowSettings={setShowSettings}
                  createConfigBuffer={createConfigBuffer}
                  openLogin={() => setShowLogin(true)}
                />
              }
              <ContentBody>
                {configState.displaySettingsPages.map(
                  (imagePage, pageIndex) => (
                    <Page pageIndex={pageIndex} key={pageIndex} />
                  )
                )}
              </ContentBody>
              <GlobalSettings
                visible={showSettings}
                setClose={() => setShowSettings(false)}
                onClose={async () =>
                  configDispatch.updateAllDefaultBackImages(
                    await configState.defaultBackDisplay
                  )
                }
                readyToSave={!!configState.buttonSettingsPages.length}
                loadConfigFile={(buffer: Buffer) =>
                  loadConfigFile(buffer, configDispatch.setState)
                }
                getConfigBuffer={createConfigBuffer}
              />
              <Login visible={showLogin} setClose={() => setShowLogin(false)} />
              <StyledToastContainer />
              <FDIconButtonFixed
                icon="hi/HiDocumentAdd"
                size={3}
                type="cta"
                onClick={() => configDispatch.addPage(undefined)}
              >
                Add Page
              </FDIconButtonFixed>
            </Main>
          </AppDispatchContext.Provider>
        </AppStateContext.Provider>
      </ConfigDispatchContext.Provider>
    </ConfigStateContext.Provider>
  );
};

export default App;
