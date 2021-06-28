/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import FhirBackend from "./FhirBackend";
import axios, { AxiosError, AxiosInstance } from "axios";
import ApiResponse, { defaultApiResponse } from "./ApiResponse";
import queryString from "query-string";

export default class FWoABackend implements FhirBackend {
  private accessToken: string;
  private client: AxiosInstance;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    const { REACT_APP_API_KEY, REACT_APP_FHIR_SERVER_URL } = process.env;
    this.client = axios.create({
      baseURL: REACT_APP_FHIR_SERVER_URL,
      headers: {
        "x-api-key": REACT_APP_API_KEY,
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
  }

  async read(resourceType: string, id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.get(`/${resourceType}/${id}`);
      return {
        statusCode: response.status,
        headers: response.headers,
        body: response.data,
      };
    } catch (e: any) {
      return this.handleError(e);
    }
  }

  handleError(e: any): ApiResponse {
    const error: AxiosError = e;
    const response: ApiResponse = error.response
      ? {
          statusCode: error.response.status,
          body: error.response.data,
          headers: error.response.headers,
        }
      : defaultApiResponse;
    return response;
  }

  async create(body: any): Promise<ApiResponse> {
    const resourceType = body.resourceType;
    try {
      const response = await this.client.post(`/${resourceType}`, body);
      return {
        statusCode: response.status,
        headers: response.headers,
        body: response.data,
      };
    } catch (e: any) {
      return this.handleError(e);
    }
  }

  async delete(resourceType: string, id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.delete(`/${resourceType}/${id}`);
      return {
        statusCode: response.status,
        headers: response.headers,
        body: response.data,
      };
    } catch (e: any) {
      return this.handleError(e);
    }
  }

  async update(body: any): Promise<ApiResponse> {
    const resourceType = body.resourceType;
    const id = body.id;
    try {
      const response = await this.client.put(`/${resourceType}/${id}`, body);
      return {
        statusCode: response.status,
        headers: response.headers,
        body: response.data,
      };
    } catch (e: any) {
      return this.handleError(e);
    }
  }
  async search(
    resourceType: string,
    searchParams: { params: any; include: string[]; revInclude: string[] },
    itemsPerPage: number,
    page: number
  ): Promise<ApiResponse> {
    const queryParams = queryString.stringify({
      ...searchParams.params,
      _include: searchParams.include,
      _revinclude: searchParams.revInclude,
      _count: itemsPerPage,
      _getpagesoffset: page > 1 ? itemsPerPage * (page - 1) : 0,
    });
    try {
      const response = await this.client.get(`/${resourceType}?${queryParams}`);
      return {
        statusCode: response.status,
        headers: response.headers,
        body: response.data,
      };
    } catch (e: any) {
      return this.handleError(e);
    }
  }
}
