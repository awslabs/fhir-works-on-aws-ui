/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from "react";
import FhirBackend from "../../common/backend/FhirBackend";
import {
  Box,
  Button,
  Container,
  SpaceBetween,
  Header,
  CodeEditor,
  CodeEditorProps,
} from "@awsui/components-react";
import { Results } from "../common/Results";
import ApiResponse, {
  defaultApiResponse,
} from "../../common/backend/ApiResponse";
import { RouteComponentProps } from "react-router";
import { CustomBreadCrumb } from "../common/CustomBreadCrumb";

export const Update: React.FC<{
  fhirBackend: FhirBackend;
  routeComponentProps: RouteComponentProps;
}> = ({ fhirBackend, routeComponentProps }) => {
  const [updateJSON, setUpdateJSON] = React.useState("{}");
  const [loading, setLoading] = React.useState(true);
  const [isUpdatingResource, setIsUpdatingResource] = React.useState(false);
  const [isJsonValid, setIsJsonValid] = React.useState(true);
  const [updateEnabled, setUpdateEnabled] = React.useState(true);

  const [ace, setAce]: any = useState(undefined);
  const [apiResponse, setApiResponse] = useState<ApiResponse>(
    defaultApiResponse
  );

  async function readProvidedResource() {
    if (!routeComponentProps.location.state) {
      return;
    }

    let currResource: any;
    ({ resource: currResource } = routeComponentProps.location.state as {
      resource: any;
    });

    setUpdateJSON(JSON.stringify(currResource, null, "  "));
  }

  useEffect(
    () => {
      readProvidedResource();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    setUpdateEnabled(isJsonValid);
  }, [isJsonValid]);

  useEffect(() => {
    setLoading(true);
    import("ace-builds")
      .then((aceObject) =>
        import("ace-builds/webpack-resolver")
          .then(() => {
            setAce(aceObject);
            setLoading(false);
          })
          .catch(() => setLoading(false))
      )
      .catch(() => setLoading(false));
  }, []);

  async function updateResource(body: any): Promise<any> {
    setIsUpdatingResource(true);
    const response = await fhirBackend.update(body);
    setIsUpdatingResource(false);
    return response;
  }

  const i18nStrings = {
    loadingState: "Loading code editor",
    errorState: "There was an error loading the code editor.",
    errorStateRecovery: "Retry",

    editorGroupAriaLabel: "Code editor",
    statusBarGroupAriaLabel: "Status bar",

    cursorPosition: (row: any, column: any) => `Ln ${row}, Col ${column}`,
    errorsTab: "Errors",
    warningsTab: "Warnings",
    preferencesButtonAriaLabel: "Preferences",

    paneCloseButtonAriaLabel: "Close",

    preferencesModalHeader: "Preferences",
    preferencesModalCancel: "Cancel",
    preferencesModalConfirm: "Confirm",
    preferencesModalWrapLines: "Wrap lines",
    preferencesModalTheme: "Theme",
    preferencesModalLightThemes: "Light themes",
    preferencesModalDarkThemes: "Dark themes",
  };
  const [preferences, setPreferences] = React.useState<
    CodeEditorProps.Preferences | undefined
  >(undefined);

  function updateForm() {
    return (
      <Box margin={{ bottom: "l" }} padding="l">
        <CustomBreadCrumb items={[{ text: "Update", href: "/update" }]} />
        <Container
          header={
            <Header
              className="leftPadded"
              variant="h2"
              description=""
              actions={
                <SpaceBetween direction="horizontal" size="xl">
                  <Button
                    variant="primary"
                    loading={isUpdatingResource}
                    disabled={!updateEnabled}
                    onClick={async () => {
                      const response = await updateResource(
                        JSON.parse(updateJSON)
                      );
                      setApiResponse(response);
                    }}
                  >
                    Update
                  </Button>
                </SpaceBetween>
              }
            >
              Update Existing FHIR Resource
            </Header>
          }
        >
          <CodeEditor
            ace={ace}
            language="json"
            value={updateJSON}
            preferences={preferences}
            onPreferencesChange={(e) => setPreferences(e.detail)}
            onChange={(e) => setUpdateJSON(e.detail.value)}
            loading={loading}
            i18nStrings={i18nStrings}
            onValidate={(e) => {
              e.detail.annotations.length === 0
                ? setIsJsonValid(true)
                : setIsJsonValid(false);
            }}
          />
        </Container>
      </Box>
    );
  }

  return (
    <div>
      {apiResponse.statusCode ? (
        <Results apiResponse={apiResponse} setApiResponse={setApiResponse} />
      ) : (
        updateForm()
      )}
    </div>
  );
};
