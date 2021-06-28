/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import React, { Dispatch, SetStateAction } from "react";
import { Button, Cards, Container, Header } from "@awsui/components-react";
import ReactJson from "react-json-view";
import ApiResponse, {
  defaultApiResponse,
} from "../../common/backend/ApiResponse";

export const Results: React.FC<{
  apiResponse: ApiResponse;
  setApiResponse: Dispatch<SetStateAction<ApiResponse>>;
}> = ({ apiResponse, setApiResponse }) => {
  return (
    <Container
      header={
        <Header variant="h2" description="">
          FHIR Resource
        </Header>
      }
    >
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
            id: "statusCode",
            title: "Status Code",
            content: apiResponse.statusCode,
          },
          {
            id: "headers",
            title: "Headers",
            content: apiResponse.headers,
          },
          {
            id: "body",
            title: "Body",
            content: apiResponse.body,
          },
        ]}
      />
      <Button
        onClick={() => {
          setApiResponse(defaultApiResponse);
        }}
      >
        Back
      </Button>
    </Container>
  );
};
