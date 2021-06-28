/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from "react";
import FhirBackend from "../../common/backend/FhirBackend";
import {
  Button,
  Box,
  Container,
  FormField,
  Header,
  Input,
  SpaceBetween,
} from "@awsui/components-react";
import { Results } from "../common/Results";
import ApiResponse, {
  defaultApiResponse,
} from "../../common/backend/ApiResponse";
import ResourceTypeAutosuggest from "../common/ResourceTypeAutosuggest";
import { useMetadata } from "../../stores/MetadataContext";
import { getResourceTypes } from "../../common/utils/MetaDataUtils";
import { CustomBreadCrumb } from "../common/CustomBreadCrumb";

export const Read: React.FC<{
  fhirBackend: FhirBackend;
}> = ({ fhirBackend }) => {
  const [resourceType, setResourceType] = React.useState("");
  const [isResourceTypeValid, setIsResourceTypeValid] = React.useState(false);
  const [isReading, setIsReading] = React.useState(false);
  const [resourceId, setResourceId] = React.useState("");

  const [apiResponse, setApiResponse] = useState<ApiResponse>(
    defaultApiResponse
  );

  const { metadata } = useMetadata();

  async function readResource(
    resourceType: string,
    resourceId: string
  ): Promise<any> {
    setIsReading(true);
    const response = await fhirBackend.read(resourceType, resourceId);
    setIsReading(false);
    return response;
  }

  useEffect(
    () => {
      const isValid = getResourceTypes(metadata)
        .map((resource) => {
          return resource;
        })
        .includes(resourceType);
      setIsResourceTypeValid(isValid);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resourceType, resourceId]
  );

  function readForm() {
    return (
      <Box margin={{ bottom: "l" }} padding="l">
        <CustomBreadCrumb items={[{ text: "Read", href: "/read" }]} />

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
                    loading={isReading}
                    disabled={!isResourceTypeValid || resourceId === ""}
                    onClick={async () => {
                      const result = await readResource(
                        resourceType,
                        resourceId
                      );
                      setApiResponse(result);
                    }}
                  >
                    Read
                  </Button>
                </SpaceBetween>
              }
            >
              Read Existing FHIR Resource
            </Header>
          }
        >
          <FormField
            description=""
            label="Resource Type"
            className="inputObjectFormField"
          >
            <ResourceTypeAutosuggest
              setResourceType={setResourceType}
              resourceType={resourceType}
              isResourceTypeValid={isResourceTypeValid}
            />
          </FormField>
          <FormField
            description=""
            label="Resource ID"
            className="inputObjectFormField"
          >
            <Input
              value={resourceId}
              onChange={(event) => setResourceId(event.detail.value)}
              placeholder="Enter resource ID"
            />
          </FormField>
        </Container>
      </Box>
    );
  }

  return (
    <div>
      {apiResponse.statusCode ? (
        <Results apiResponse={apiResponse} setApiResponse={setApiResponse} />
      ) : (
        readForm()
      )}
    </div>
  );
};
