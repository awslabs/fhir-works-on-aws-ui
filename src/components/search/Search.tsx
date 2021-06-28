/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from "react";
import FhirBackend from "../../common/backend/FhirBackend";
import {
  Box,
  Button,
  FormField,
  Container,
  SpaceBetween,
  Header,
  TagEditor,
  Multiselect,
} from "@awsui/components-react";
import { OptionDefinition } from "@awsui/components-react/internal/components/option/interfaces";
import { TagEditorProps } from "@awsui/components-react/tag-editor/interfaces";
import { useMetadata } from "../../stores/MetadataContext";
import { getResourceTypes } from "../../common/utils/MetaDataUtils";
import ResourceTypeAutosuggest from "../common/ResourceTypeAutosuggest";
import { SearchResults } from "./SearchResults";
import ApiResponse, {
  defaultApiResponse,
} from "../../common/backend/ApiResponse";
import { CustomBreadCrumb } from "../common/CustomBreadCrumb";

export const Search: React.FC<{
  fhirBackend: FhirBackend;
}> = ({ fhirBackend }) => {
  // SearchResults page uses AWS Tables. AWS Tables requires a static number of table items. Therefore let's pull
  // the maximum number of results that are supported
  const itemsPerPage = 10000;
  const [resourceType, setResourceType] = React.useState("");
  const [isResourceTypeValid, setIsResourceTypeValid] = React.useState(false);
  const [maxSearchParamLimit, setMaxSearchParamLimit] = React.useState(0);
  const [isSearching, setIsSearching] = React.useState(false);

  const [allRevIncludeOptions, setAllRevIncludeOptions] = React.useState(
    [] as ReadonlyArray<OptionDefinition>
  );

  const [
    selectedRevIncludeOptions,
    setSelectedRevIncludeOptions,
  ] = React.useState([] as ReadonlyArray<OptionDefinition>);

  const [allIncludeOptions, setAllIncludeOptions] = React.useState(
    [] as ReadonlyArray<OptionDefinition>
  );

  const [selectedIncludeOptions, setSelectedIncludeOptions] = React.useState(
    [] as ReadonlyArray<OptionDefinition>
  );

  const [apiResponse, setApiResponse] = useState<ApiResponse>(
    defaultApiResponse
  );

  const { metadata } = useMetadata();

  const [searchParams, setSearchParams] = useState(
    [] as ReadonlyArray<TagEditorProps.Tag>
  );

  const enUS = {
    keyPlaceholder: "Select a Search Parameter",
    valuePlaceholder: "Enter value",
    addButton: "Add new search parameter",
    removeButton: "Remove",
    undoButton: "",
    undoPrompt: "",
    loading: "",
    keyHeader: "Search Parameter",
    valueHeader: "Value",
    optional: "Required",
    keySuggestion: "",
    valueSuggestion: "",
    emptyTags: "",
    tooManyKeysSuggestion: "You have more search params than can be displayed",
    tooManyValuesSuggestion:
      "You have more search param values than can be displayed",
    keysSuggestionLoading: "",
    keysSuggestionError: "",
    valuesSuggestionLoading: "",
    valuesSuggestionError: "",
    emptyKeyError: "You must specify a search parameter",
    maxKeyCharLengthError:
      "The maximum number of characters you can use in a search param is 128.",
    maxValueCharLengthError:
      "The maximum number of characters you can use in a search param value is 256.",
    duplicateKeyError: "You must specify a unique search param.",
    invalidKeyError:
      "Invalid key. search params can only contain alphanumeric characters, spaces and any of the following: _.:/=+@-",
    invalidValueError:
      "Invalid value. search param values can only contain alphanumeric characters, spaces and any of the following: _.:/=+@-",
    awsPrefixError: "Cannot start with aws:",
    tagLimit: (availableTags: any) => {
      if (availableTags === 1) {
        return "You can add 1 more search parameter.";
      } else {
        return "You can add " + availableTags + " more search parameters.";
      }
    },
    tagLimitReached: (tagLimit: any) => {
      if (tagLimit === 0) {
        return "Please select a resource to add new search parameters";
      } else {
        return "Max number of search parameters reached for this resource type";
      }
    },
    tagLimitExceeded: (availableTags: any) =>
      "You have exceeded the number of search parameters for this resource type. Please remove some search parameters before continuing.",
    enteredKeyLabel: (availableTags: any) => "",
    enteredValueLabel: (availableTags: any) => "",
  };

  function getSearchIncludeKeys() {
    let resourceTypeToSearchIncludesKey: any = {};
    metadata.forEach((resource: any) => {
      resourceTypeToSearchIncludesKey[resource.type] = resource.searchInclude;
    });
    return resourceTypeToSearchIncludesKey;
  }

  function getRevIncludesKeys() {
    let resourceTypeToSearchRevIncludesKey: any = {};
    metadata.forEach((resource: any) => {
      resourceTypeToSearchRevIncludesKey[resource.type] =
        resource.searchRevInclude;
    });

    return resourceTypeToSearchRevIncludesKey;
  }

  function getSearchParamKeys() {
    let resourceTypeToSearchParamKey: any = {};
    metadata.forEach((resource: any) => {
      resourceTypeToSearchParamKey[resource.type] = resource.searchParam
        ? resource.searchParam.map((param: any) => {
            return param.name;
          })
        : [];
    });
    return resourceTypeToSearchParamKey;
  }

  async function searchResource(): Promise<any> {
    let finalSearchParams: any = {};
    finalSearchParams["include"] = selectedIncludeOptions.map((option) => {
      return option.value;
    });
    finalSearchParams["revInclude"] = selectedRevIncludeOptions.map(
      (option) => {
        return option.value;
      }
    );
    finalSearchParams.params = {};
    searchParams.forEach((searchParam: any) => {
      finalSearchParams.params[searchParam.key] = searchParam.value;
    });

    setIsSearching(true);
    const response = await fhirBackend.search(
      resourceType,
      finalSearchParams,
      itemsPerPage,
      1
    );
    setIsSearching(false);
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

      // Reset selected include and revInclude options when user picks a new resourceType
      setSelectedIncludeOptions([]);
      setSelectedRevIncludeOptions([]);
      // Reset search params
      setSearchParams([]);

      if (isValid) {
        // Update Includes Options
        const includeKeys = getSearchIncludeKeys()[resourceType] ?? [];
        const tempOptionsIncludeList = includeKeys.map((key: string) => {
          return {
            label: key,
            value: key,
          };
        });
        setAllIncludeOptions(tempOptionsIncludeList);

        // Update Reverse Includes Options
        const revIncludeKeys = getRevIncludesKeys()[resourceType] ?? [];
        const tempOptionsRevIncludeList = revIncludeKeys.map((key: string) => {
          return {
            label: key,
            value: key,
          };
        });
        setAllRevIncludeOptions(tempOptionsRevIncludeList);
      }

      // Update Tag Editor
      setMaxSearchParamLimit(isValid ? 20 : 0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resourceType]
  );

  function searchForm() {
    return (
      <Box margin={{ bottom: "l" }} padding="l">
        <CustomBreadCrumb items={[{ text: "Search", href: "/search" }]} />
        <Container
          header={
            <Header
              className="leftPadded"
              variant="h2"
              actions={
                <SpaceBetween direction="horizontal" size="xl">
                  <Button
                    loading={isSearching}
                    variant="primary"
                    disabled={!isResourceTypeValid}
                    onClick={async () => {
                      const result = await searchResource();
                      setApiResponse(result);
                    }}
                  >
                    Search
                  </Button>
                </SpaceBetween>
              }
            >
              Search FHIR Resource
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
          {/*Could also choose to use Attribute Editor*/}
          <h3>Search Parameters</h3>
          <TagEditor
            i18nStrings={enUS}
            tags={searchParams}
            onChange={(event) => {
              setSearchParams(event.detail.tags);
            }}
            keysRequest={(key) => {
              return Promise.resolve(getSearchParamKeys()[resourceType]);
            }}
            className="searchParamsFormField"
            tagLimit={maxSearchParamLimit}
          />
          <h3>Includes</h3>
          <Multiselect
            selectedOptions={selectedIncludeOptions}
            onChange={(event) => {
              setSelectedIncludeOptions(event.detail.selectedOptions);
            }}
            options={allIncludeOptions}
            filteringType="auto"
            placeholder="Choose a include parameter"
            selectedAriaLabel="Selected"
            disabled={!isResourceTypeValid}
          />
          <h3>Reverse Includes</h3>
          <Multiselect
            selectedOptions={selectedRevIncludeOptions}
            onChange={(event) => {
              setSelectedRevIncludeOptions(event.detail.selectedOptions);
            }}
            options={allRevIncludeOptions}
            filteringType="auto"
            placeholder="Choose a reverse include parameter"
            selectedAriaLabel="Selected"
            disabled={!isResourceTypeValid}
          />
        </Container>
      </Box>
    );
  }

  return (
    <div>
      {apiResponse.statusCode ? (
        <SearchResults
          fhirBackend={fhirBackend}
          apiResponse={apiResponse}
          setApiResponse={setApiResponse}
        />
      ) : (
        searchForm()
      )}
    </div>
  );
};
