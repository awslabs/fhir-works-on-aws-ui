/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import React, { Dispatch, SetStateAction, useEffect } from "react";
import {
  Button,
  Toggle,
  Container,
  Header,
  Table,
  Box,
  Pagination,
  CollectionPreferences,
  SpaceBetween,
  TextFilter,
  Cards,
} from "@awsui/components-react";
import ApiResponse, {
  defaultApiResponse,
} from "../../common/backend/ApiResponse";
import FhirBackend from "../../common/backend/FhirBackend";
import { Results } from "../common/Results";
import { flatten } from "flat";
import { useCollection } from "@awsui/collection-hooks";
import { useHistory } from "react-router-dom";
import "./SearchResults.scss";
import ReactJson from "react-json-view";

export const SearchResults: React.FC<{
  fhirBackend: FhirBackend;
  apiResponse: ApiResponse;
  setApiResponse: Dispatch<SetStateAction<ApiResponse>>;
}> = ({ fhirBackend, apiResponse, setApiResponse }) => {
  const [selectedItems, setSelectedItems] = React.useState([] as any[]);
  const [previewPaneToggle, setPreviewPaneToggle] = React.useState(false);
  const [selectedJSON, setSelectedJSON] = React.useState();
  const [tableItems, setTableItems] = React.useState([] as any[]);
  const history = useHistory();
  const [readOrDeleteResponse, setReadOrDeleteResponse] = React.useState(
    defaultApiResponse as ApiResponse
  );
  const [loadingReadResult, setLoadingReadResult] = React.useState(false);
  const [loadingDeleteResult, setLoadingDeleteResult] = React.useState(false);
  const [tableColumnDefinitions, setTableColumnDefinitions] = React.useState(
    [] as any[]
  );
  const [preferences, setPreferences] = React.useState({
    visibleContent: ["id", "resourceType"],
  });
  const [
    visibleContentPreferenceOptions,
    setVisibleContentPreferenceOptions,
  ] = React.useState([] as any[]);

  function getTableItemsFromAPIResponse() {
    function convertValueToString(myObj: any) {
      Object.keys(myObj).forEach(function (key) {
        typeof myObj[key] == "object"
          ? convertValueToString(myObj[key])
          : (myObj[key] = String(myObj[key]));
      });
    }

    const entryList = apiResponse.body.entry;

    let tempItemList: any[] = [];
    entryList.forEach((entry: any) => {
      let tempObj = flatten(entry.resource);
      convertValueToString(tempObj);
      tempItemList.push(tempObj);
    });
    setTableItems(tempItemList);
  }

  /**
   * Stores visible content preferences in React state.
   *
   *
   * @example
   * [
   *   {
   *     id: "resourceIDColumn",
   *     label: "resourceIDColumn",
   *   },
   *   {
   *     id: "resourceTypeColumn",
   *     label: "resourceTypeColumn",
   *   },
   *]
   */
  function populateVisibleContentPreferenceOptions() {
    let tempColumnList: {
      id: any;
      label: any;
      editable: boolean;
    }[] = [];
    const allColumnNameSet = new Set();

    tableItems.forEach((tableItem) => {
      Object.keys(tableItem).forEach((tableItemKey) => {
        allColumnNameSet.add(tableItemKey);
      });
    });

    allColumnNameSet.forEach((columnName: any) => {
      let editable = true;
      if (columnName === "id" || columnName === "resourceType") {
        editable = false;
      }
      tempColumnList.push({
        id: columnName,
        label: columnName,
        editable: editable,
      });
    });

    // Move column id to the be the first column in the table
    const idColumn = tempColumnList.find((column) => {
      return column.id === "id";
    });
    const resourceTypeColumn = tempColumnList.find((column) => {
      return column.id === "resourceType";
    });
    tempColumnList = tempColumnList.filter((column) => {
      return column.id !== "id" && column.id !== "resourceType";
    });
    if (idColumn) {
      tempColumnList.unshift(idColumn);
    }
    if (resourceTypeColumn) {
      tempColumnList.unshift(resourceTypeColumn);
    }

    if (!previewPaneToggle) {
      setPreferences({
        visibleContent: Array.from(allColumnNameSet) as string[],
      });
    } else {
      setPreferences({
        visibleContent: ["id", "resourceType"],
      });
    }
    setVisibleContentPreferenceOptions(tempColumnList);
  }

  function updateResource() {
    history.push({
      pathname: "/update",
      state: {
        resource: selectedJSON,
      },
    });
    return;
  }

  async function readResource() {
    const resourceType = selectedItems[0].resourceType;
    const resourceID = selectedItems[0].id;

    setLoadingReadResult(true);
    const response = await fhirBackend.read(resourceType, resourceID);
    setLoadingReadResult(false);
    setReadOrDeleteResponse(response);
  }

  async function deleteResource() {
    const resourceType = selectedItems[0].resourceType;
    const resourceID = selectedItems[0].id;

    setLoadingDeleteResult(true);
    const response = await fhirBackend.delete(resourceType, resourceID);
    setLoadingDeleteResult(false);
    setReadOrDeleteResponse(response);

    setTableItems(
      tableItems.filter(function (obj) {
        return obj.id !== resourceID;
      })
    );
  }

  /**
   * Stores column definitions in React state.
   *
   *
   * @example
   * [
   *   {
   *     id: "resourceIDColumn",
   *     header: "Resource ID",
   *     cell: (e: any) => e.id,
   *     sortingField: "id",
   *   },
   *   {
   *     id: "gender",
   *     header: "gender",
   *     cell: (e: any) => e.gender,
   *     sortingField: "gender",
   *   },
   *]
   */
  function populateColumnDefinitions() {
    let tempColumnList: {
      id: any;
      header: any;
      cell: any;
      sortingField: any;
    }[] = [];
    const allColumnNameSet = new Set();

    tableItems.forEach((tableItem) => {
      Object.keys(tableItem).forEach((tableItemKey) => {
        allColumnNameSet.add(tableItemKey);
      });
    });

    allColumnNameSet.forEach((columnName: any) => {
      tempColumnList.push({
        id: columnName,
        header: columnName,
        cell: (e: any) => e[columnName],
        sortingField: columnName,
      });
    });

    // Move column id to the be the first column in the table
    const idColumn = tempColumnList.find((column) => {
      return column.header === "id";
    });
    const resourceTypeColumn = tempColumnList.find((column) => {
      return column.header === "resourceType";
    });
    tempColumnList = tempColumnList.filter((column) => {
      return column.header !== "id" && column.header !== "resourceType";
    });
    if (idColumn) {
      tempColumnList.unshift(idColumn);
    }
    if (resourceTypeColumn) {
      tempColumnList.unshift(resourceTypeColumn);
    }

    setTableColumnDefinitions(tempColumnList);
  }

  useEffect(
    () => {
      getTableItemsFromAPIResponse();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiResponse]
  );

  useEffect(
    () => {
      populateColumnDefinitions();
      populateVisibleContentPreferenceOptions();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tableItems, previewPaneToggle]
  );

  function EmptyState({
    title,
    subtitle,
    action,
  }: {
    title: any;
    subtitle: any;
    action: any;
  }) {
    return (
      <Box textAlign="center" color="inherit">
        <Box variant="strong" textAlign="center" color="inherit">
          {title}
        </Box>
        <Box variant="p" padding={{ bottom: "s" }} color="inherit">
          {subtitle}
        </Box>
        {action}
      </Box>
    );
  }

  const {
    items,
    actions,
    paginationProps,
    filteredItemsCount,
    filterProps,
  } = useCollection(tableItems, {
    filtering: {
      empty: (
        <EmptyState
          title="No Resources"
          subtitle="No FHIR resources to display."
          action={<Button>Create resource</Button>}
        />
      ),
      noMatch: (
        <EmptyState
          title="No matches"
          subtitle="We can’t find a match."
          action={
            <Button onClick={() => actions.setFiltering("")}>
              Clear filter
            </Button>
          }
        />
      ),
    },
    pagination: { pageSize: 20 },
    sorting: {},
    selection: {},
  });

  function getMatchesCountText(count: number | undefined) {
    if (count === undefined || count === 0) {
      return "no matches found";
    } else {
      return `${count} matches found`;
    }
  }

  function searchResults() {
    return (
      <Container
        header={
          <Header
            variant="h2"
            description=""
            actions={
              <SpaceBetween direction="horizontal" size="xl">
                <Toggle
                  onChange={({ detail }) =>
                    setPreviewPaneToggle(detail.checked)
                  }
                  checked={previewPaneToggle}
                >
                  Preview Pane
                </Toggle>
              </SpaceBetween>
            }
          >
            FHIR Search Result
          </Header>
        }
      >
        <div className={previewPaneToggle ? "flex-parent" : ""}>
          <div className={previewPaneToggle ? "flex-child" : ""}>
            <Table
              trackBy="id"
              ariaLabels={{
                selectionGroupLabel: "Items selection",
                allItemsSelectionLabel: ({ selectedItems }) => {
                  return "";
                },
                itemSelectionLabel: ({ selectedItems }, item) => {
                  return "itemSelectionLabel";
                },
              }}
              sortingDisabled={true}
              columnDefinitions={tableColumnDefinitions}
              items={items}
              loadingText="Loading resources"
              selectedItems={selectedItems}
              selectionType="single"
              resizableColumns
              visibleColumns={preferences.visibleContent}
              empty={
                <Box textAlign="center" color="inherit">
                  <b>No resources</b>
                  <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                    No FHIR resources to display.
                  </Box>
                  <Button
                    onClick={() => {
                      history.push({
                        pathname: "/create",
                      });
                    }}
                  >
                    Create resource
                  </Button>
                </Box>
              }
              header={
                <Header
                  counter={`${tableItems.length}`}
                  actions={
                    <SpaceBetween direction="horizontal" size="xl">
                      <Button
                        variant="primary"
                        onClick={readResource}
                        loading={loadingReadResult}
                        disabled={selectedItems.length !== 1}
                      >
                        Read
                      </Button>
                      <Button
                        variant="normal"
                        onClick={updateResource}
                        disabled={selectedItems.length !== 1}
                      >
                        Update
                      </Button>
                      <Button
                        variant="normal"
                        onClick={(e) =>
                          window.confirm(
                            "Are you sure you wish to delete the resource with id: " +
                              selectedItems[0].id +
                              "?"
                          ) && deleteResource()
                        }
                        loading={loadingDeleteResult}
                        disabled={selectedItems.length !== 1}
                      >
                        Delete
                      </Button>
                    </SpaceBetween>
                  }
                >
                  Total FHIR Resources
                </Header>
              }
              pagination={
                <Pagination
                  {...paginationProps}
                  ariaLabels={{
                    nextPageLabel: "Next page",
                    previousPageLabel: "Previous page",
                    pageLabel: (pageNumber) =>
                      `Page ${pageNumber} of all pages`,
                  }}
                />
              }
              filter={
                <TextFilter
                  {...filterProps}
                  countText={getMatchesCountText(filteredItemsCount)}
                  filteringAriaLabel="Filter FHIR resource"
                />
              }
              preferences={
                <CollectionPreferences
                  title="Preferences"
                  onConfirm={({ detail }) => setPreferences(detail as any)}
                  confirmLabel="Confirm"
                  cancelLabel="Cancel"
                  preferences={preferences}
                  visibleContentPreference={{
                    title: "Visible Object Properties",
                    options: [
                      {
                        label: "",
                        options: visibleContentPreferenceOptions,
                      },
                    ],
                  }}
                />
              }
              onSelectionChange={({ detail }) => {
                setSelectedItems(detail.selectedItems);

                const entryList = apiResponse.body.entry;
                entryList.forEach((entry: any) => {
                  if (entry.resource.id === detail.selectedItems[0].id) {
                    setSelectedJSON(entry.resource);
                    return;
                  }
                });
              }}
            />
          </div>
          {previewPaneToggle ? previewPane() : null}
        </div>
        <Button
          id="back-button"
          onClick={() => {
            setApiResponse(defaultApiResponse);
          }}
        >
          Back
        </Button>
      </Container>
    );
  }

  function previewPane() {
    return (
      <div className={previewPaneToggle ? "flex-child" : ""}>
        <Cards
          cardDefinition={{
            header: (item: { id: string; title: string; content: any }) => (
              <h4>{item.title}</h4>
            ),
            sections: [
              {
                content: (item) =>
                  item.id === "statusCode" ? (
                    item.content
                  ) : (
                    <ReactJson
                      src={item.content}
                      enableClipboard={(copy) => {
                        // Remove quotes when copying string
                        // https://github.com/mac-s-g/react-json-view/issues/217#issuecomment-459215632
                        const container = document.createElement("textarea");
                        const val: any = copy.src;

                        container.innerHTML =
                          typeof val === "string"
                            ? val
                            : JSON.stringify(val, null, 2);

                        document.body.appendChild(container);
                        container.select();
                        // copy the same quote-less value back to the clipboard
                        document.execCommand("copy");
                        document.body.removeChild(container);
                      }}
                    />
                  ),
              },
            ],
          }}
          cardsPerRow={[{ cards: 1 }]}
          items={[
            {
              id: "body",
              title: "Selected Item Preview",
              content: selectedJSON,
            },
          ]}
        />
      </div>
    );
  }
  function results() {
    if (readOrDeleteResponse.statusCode) {
      return (
        <Results
          apiResponse={readOrDeleteResponse}
          setApiResponse={setReadOrDeleteResponse}
        />
      );
    } else {
      return searchResults();
    }
  }

  return results();
};
