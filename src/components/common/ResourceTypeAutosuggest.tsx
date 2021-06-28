/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { Autosuggest, AutosuggestProps } from "@awsui/components-react";
import { getResourceTypes } from "../../common/utils/MetaDataUtils";
import React, { Dispatch, SetStateAction } from "react";
import { useMetadata } from "../../stores/MetadataContext";
const ResourceTypeAutosuggest: React.FC<{
  setResourceType: Dispatch<SetStateAction<string>>;
  resourceType: string;
  isResourceTypeValid: boolean;
}> = ({ setResourceType, resourceType, isResourceTypeValid }) => {
  const { metadata } = useMetadata();

  const getAutoSuggestOptions = (): AutosuggestProps.Option[] => {
    const resourceTypes = getResourceTypes(metadata);
    return resourceTypes.map((resourceType) => {
      return { value: resourceType };
    });
  };

  return (
    <Autosuggest
      onChange={({ detail }) => {
        setResourceType(detail.value);
      }}
      value={resourceType}
      options={getAutoSuggestOptions()}
      enteredTextLabel={(resourceType) => `Resource: "${resourceType}"`}
      invalid={!isResourceTypeValid}
      placeholder="Enter resource type"
      empty="No resource types found"
      autoFocus={true}
    />
  );
};

export default ResourceTypeAutosuggest;
