/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from "react";
import FhirBackend from "../../common/backend/FhirBackend";
import "./Delete.scss";
import {
  Box,
  Button,
  FormField,
  Container,
  SpaceBetween,
  Header,
  Input,
} from "@awsui/components-react";
import { useMetadata } from "../../stores/MetadataContext";
import { getResourceTypes } from "../../common/utils/MetaDataUtils";
import ResourceTypeAutosuggest from "../common/ResourceTypeAutosuggest";
import { Results } from "../common/Results";
import ApiResponse, {
  defaultApiResponse,
} from "../../common/backend/ApiResponse";
import { CustomBreadCrumb } from "../common/CustomBreadCrumb";

export const Delete: React.FC<{
  fhirBackend: FhirBackend;
}> = ({ fhirBackend }) => {
  const [resourceType, setResourceType] = React.useState("");
  const [isResourceTypeValid, setIsResourceTypeValid] = React.useState(false);
  const [resourceId, setResourceId] = React.useState("");
  const [isDeletingResource, setIsDeletingResource] = React.useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse>(
    defaultApiResponse
  );

  async function deleteResource(
    resourceType: string,
    resourceId: string
  ): Promise<any> {
    setIsDeletingResource(true);
    const response = await fhirBackend.delete(resourceType, resourceId);
    setIsDeletingResource(false);
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

  const { metadata } = useMetadata();

  function deleteForm() {
    return (
      <Box margin={{ bottom: "l" }} padding="l">
        <CustomBreadCrumb items={[{ text: "Delete", href: "/delete" }]} />
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
                    disabled={!isResourceTypeValid || resourceId.length === 0}
                    onClick={async () => {
                      const result = await deleteResource(
                        resourceType,
                        resourceId
                      );
                      setApiResponse(result);
                    }}
                    loading={isDeletingResource}
                  >
                    Delete
                  </Button>
                </SpaceBetween>
              }
            >
              Delete Existing FHIR Resource
            </Header>
          }
        >
          <h3 className="deleteSubHeader">
            You can delete an existing resource by providing the resource type
            and ID below
          </h3>

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
        <>
          <Box margin={{ bottom: "l" }} padding="l">
            <CustomBreadCrumb items={[{ text: "Delete", href: "/delete" }]} />
            <Results
              apiResponse={apiResponse}
              setApiResponse={setApiResponse}
            />
          </Box>
        </>
      ) : (
        deleteForm()
      )}
    </div>
  );
};
