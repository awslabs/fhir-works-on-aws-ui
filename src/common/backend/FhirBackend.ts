/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import ApiResponse from "./ApiResponse";

export default interface FhirBackend {
  read(resourceType: string, id: string): Promise<ApiResponse>;
  create(body: any): Promise<ApiResponse>;
  update(body: any): Promise<ApiResponse>;
  delete(resourceType: string, id: string): Promise<ApiResponse>;
  search(
    resourceType: string,
    searchParams: any,
    itemsPerPage: number,
    page: number
  ): Promise<ApiResponse>;
}
