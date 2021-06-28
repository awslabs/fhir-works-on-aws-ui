/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import FhirBackend from "./FhirBackend";
import { v4 as uuidv4 } from "uuid";
import cloneDeep from "clone-deep";
import ApiResponse from "./ApiResponse";
import queryString from "query-string";

export default class StubbedBackend implements FhirBackend {
  async read(resourceType: string, id: string): Promise<ApiResponse> {
    return Promise.resolve({
      statusCode: 200,
      body: {
        message: "Read succeeded",
        resourceType,
        id,
      },
      headers: {
        "content-length": "438",
        "content-type": "application/json; charset=utf-8",
        "last-modified": new Date().toISOString(),
      },
    });
  }

  async search(
    resourceType: string,
    searchParams: any,
    itemsPerPage: number,
    page: number
  ): Promise<ApiResponse> {
    const queryParams = queryString.stringify({
      ...searchParams.params,
      _include: searchParams.include,
      _revinclude: searchParams.revInclude,
    });

    const { REACT_APP_FHIR_SERVER_URL } = process.env;
    return Promise.resolve({
      statusCode: 200,
      body: {
        resourceType: "Bundle",
        id: "4ee9c386-3522-4e71-9965-04e80454ea65",
        meta: {
          lastUpdated: "2021-03-25T22:03:07.704Z",
        },
        type: "searchset",
        total: 1,
        link: [
          {
            relation: "self",
            url: `${REACT_APP_FHIR_SERVER_URL}?${queryParams}`,
          },
        ],
        entry: [
          {
            search: {
              mode: "match",
            },
            fullUrl: `${REACT_APP_FHIR_SERVER_URL}/Patient/0ef09d8c-10af-47d1-8cdf-5a05adacf58e`,
            resource: {
              gender: "male",
              active: true,
              birthDate: "1996-09-24",
              managingOrganization: {
                reference: "Organization/2.16.840.1.113883.19.5",
                display: "Good Health Clinic",
              },
              meta: {
                lastUpdated: "2021-03-25T21:33:30.261Z",
                versionId: "1",
              },
              name: [
                {
                  given: ["John"],
                  family: "Smith",
                },
              ],
              id: "0ef09d8c-10af-47d1-8cdf-5a05adacf58e",
              text: {
                div: '<div xmlns="http://www.w3.org/1999/xhtml"><p></p></div>',
                status: "generated",
              },
              resourceType: "Patient",
            },
          },
        ],
      },
      headers: {
        "content-length": "1564",
        "content-type": "application/json; charset=utf-8",
      },
    });
  }

  async create(body: any): Promise<ApiResponse> {
    const response = cloneDeep(body);
    response.meta = {
      versionId: "1",
      lastUpdated: new Date().toISOString(),
    };

    response.id = uuidv4();
    return Promise.resolve({
      body: response,
      headers: {
        "content-length": "438",
        "content-type": "application/json; charset=utf-8",
        "last-modified": "2021-03-25T21:24:27.368Z",
      },
      statusCode: 201,
    });
  }

  async delete(resourceType: string, id: string): Promise<ApiResponse> {
    const response = {
      resourceType: "OperationOutcome",
      text: {
        status: "generated",
        div:
          '<div xmlns="http://www.w3.org/1999/xhtml"><h1>Operation Outcome</h1><table border="0"><tr><td style="font-weight: bold;">INFORMATION</td><td>[]</td><td><pre>Successfully deleted 1 resource</pre></td></tr></table></div>',
      },
      issue: [
        {
          severity: "information",
          code: "informational",
          diagnostics: "Successfully deleted 1 resource",
        },
      ],
    };

    return Promise.resolve({
      body: response,
      headers: {
        "content-length": "438",
        "content-type": "application/json; charset=utf-8",
        "last-modified": new Date().toISOString(),
      },
      statusCode: 200,
    });
  }

  update(body: any): Promise<ApiResponse> {
    const response = cloneDeep(body);
    response.meta = {
      versionId: "2",
      lastUpdated: new Date().toISOString(),
    };

    return Promise.resolve({ body: response, headers: {}, statusCode: 200 });
  }
}
