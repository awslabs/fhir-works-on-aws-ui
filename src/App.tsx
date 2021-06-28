/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from "react";
import { AppLayout } from "@awsui/components-react";
import "@awsui/global-styles/index.css";
import { Navigation } from "./components/Navigation";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Landing } from "./components/landing/Landing";
import { Create } from "./components/create/Create";
import { Delete } from "./components/delete/Delete";
import { Update } from "./components/update/Update";
import { Read } from "./components/read/Read";
import { Search } from "./components/search/Search";
import FhirBackend from "./common/backend/FhirBackend";
import { Callback } from "./components/callback/Callback";
import { MetadataContext } from "./stores/MetadataContext";
import axios from "axios";
import ResourceMetadata from "./stores/ResourceMetadata";
import FWoABackend from "./common/backend/FWoABackend";
import { useHistory } from "react-router-dom";
import "./App.scss";

const Content = (
  fhirBackend: FhirBackend,
  accessToken: string,
  setAccessToken: Function
) => {
  return (
    <Switch>
      <Route
        path="/create"
        render={() => <Create fhirBackend={fhirBackend} />}
      />
      <Route
        path="/read"
        render={(props) => <Read fhirBackend={fhirBackend} />}
      />
      <Route
        path="/search"
        render={(props) => <Search fhirBackend={fhirBackend} />}
      />
      <Route
        path="/update"
        render={(props) => (
          <Update fhirBackend={fhirBackend} routeComponentProps={props} />
        )}
      />
      <Route
        path="/delete"
        render={(props) => <Delete fhirBackend={fhirBackend} />}
      />
      <Route
        path="/callback"
        render={() => <Callback setAccessToken={setAccessToken} />}
      />
      <Route
        path="/"
        render={() => <Landing isLoggedIn={accessToken !== ""} />}
      />
    </Switch>
  );
};

const ChildApp: React.FC = () => {
  const [navigationOpen, setNavigationOpen] = React.useState(false);
  const [accessToken, setAccessToken] = React.useState("");
  const fhirBackend = new FWoABackend(accessToken);

  const [metadata, setMetadata] = React.useState<ResourceMetadata[]>([]);

  const fhirServerUrl = process.env.REACT_APP_FHIR_SERVER_URL;

  const mapCapstatementToResources = (
    capStatement: any
  ): ResourceMetadata[] => {
    return capStatement.rest[0].resource.map((resource: any) => {
      return {
        type: resource.type,
        interaction: resource.interaction.map(
          (interaction: { code: string }) => {
            return interaction.code;
          }
        ),
        searchParam: resource.searchParam,
        searchInclude: resource.searchInclude,
        searchRevInclude: resource.searchRevInclude,
      };
    });
  };

  useEffect(
    () => {
      const fetchCapStatement = async () => {
        const result = await axios.get(`${fhirServerUrl}/metadata`);
        setMetadata(mapCapstatementToResources(result.data));
      };

      fetchCapStatement();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const history = useHistory();

  // using pathname to invoke useEffect method because tracking history doesn't work
  const [pathname, setPathname] = useState("/");
  useEffect(() => {
    if (
      accessToken === "" &&
      !["/", "/callback"].includes(history.location.pathname)
    ) {
      history.push("/");
    }
  }, [pathname, history, accessToken]);

  history.listen((location) => {
    setPathname(location.pathname);
  });

  return (
    <div className="awsui">
      {/*React Provider Context*/}
      {/*  https://reactjs.org/docs/context.html*/}
      <MetadataContext.Provider value={{ metadata }}>
        <AppLayout
          disableContentPaddings={true}
          content={Content(fhirBackend, accessToken, setAccessToken)}
          navigation={<Navigation />}
          navigationOpen={navigationOpen}
          onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
          toolsHide={true}
        />
      </MetadataContext.Provider>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      {/*  useHistory can only be used inside of Router, which is why we're creating ChildApp*/}
      <ChildApp />
    </Router>
  );
};

export default App;
