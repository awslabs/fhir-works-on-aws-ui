/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from "react";
import FhirBackend from "../../common/backend/FhirBackend";
import "./Create.scss";
import {
  Box,
  Button,
  Select,
  Container,
  SpaceBetween,
  Header,
  CodeEditor,
  CodeEditorProps,
} from "@awsui/components-react";
import { OptionDefinition } from "@awsui/components-react/internal/components/option/interfaces";
import samplePatientResource from "./sample-data/samplePatientResource.json";
import samplePractitionerResource from "./sample-data/samplePractitionerResource.json";
import sampleScheduleResource from "./sample-data/sampleScheduleResource.json";
import sampleObservationResource from "./sample-data/sampleObservationResource.json";
import { Results } from "../common/Results";
import ApiResponse, {
  defaultApiResponse,
} from "../../common/backend/ApiResponse";
import { CustomBreadCrumb } from "../common/CustomBreadCrumb";

export const Create: React.FC<{
  fhirBackend: FhirBackend;
}> = ({ fhirBackend }) => {
  const [createJSON, setCreateJSON] = React.useState("{}");
  const [loading, setLoading] = React.useState(true);
  const [isCreatingResource, setIsCreatingResource] = React.useState(false);
  const [isJsonValid, setIsJsonValid] = React.useState(true);
  const [
    selectedSampleDataOption,
    setSelectedSampleDataOption,
  ] = React.useState<OptionDefinition | null>(null);

  const [ace, setAce]: any = useState(undefined);
  const [apiResponse, setApiResponse] = useState<ApiResponse>(
    defaultApiResponse
  );

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

  async function createResource(body: any): Promise<any> {
    setIsCreatingResource(true);
    const response = await fhirBackend.create(body);
    setIsCreatingResource(false);
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

  function createForm() {
    return (
      <Box margin={{ bottom: "l" }} padding="l">
        <CustomBreadCrumb items={[{ text: "Create", href: "/create" }]} />
        <Container
          header={
            <Header
              className="leftPadded"
              variant="h2"
              description=""
              actions={
                <SpaceBetween direction="horizontal" size="xl">
                  <Select
                    className="sampleDataSelectionDropdown"
                    selectedOption={selectedSampleDataOption}
                    onChange={({ detail }) => {
                      setSelectedSampleDataOption(detail.selectedOption);
                      const stringCast = String(detail.selectedOption.value);
                      setCreateJSON(stringCast);
                    }}
                    options={[
                      { label: "-", value: "{}" },
                      {
                        label: "Sample Patient Resource Data",
                        value: JSON.stringify(samplePatientResource, null, 2),
                      },
                      {
                        label: "Sample Practitioner Resource Data",
                        value: JSON.stringify(
                          samplePractitionerResource,
                          null,
                          2
                        ),
                      },
                      {
                        label: "Sample Observation Resource Data",
                        value: JSON.stringify(sampleObservationResource, null, 2),
                      },
                      {
                        label: "Sample Schedule Resource Data",
                        value: JSON.stringify(sampleScheduleResource, null, 2),
                      },
                    ]}
                    placeholder="Load Sample Data"
                    selectedAriaLabel="Selected"
                  />
                  <Button
                    variant="primary"
                    disabled={!isJsonValid}
                    loading={isCreatingResource}
                    onClick={async () => {
                      const result = await createResource(
                        JSON.parse(createJSON)
                      );
                      setApiResponse(result);
                    }}
                  >
                    Create
                  </Button>
                </SpaceBetween>
              }
            >
              Create New FHIR Resource
            </Header>
          }
        >
          <CodeEditor
            ace={ace}
            language="json"
            value={createJSON}
            preferences={preferences}
            onPreferencesChange={(e) => setPreferences(e.detail)}
            onChange={(e) => setCreateJSON(e.detail.value)}
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
        createForm()
      )}
    </div>
  );
};
