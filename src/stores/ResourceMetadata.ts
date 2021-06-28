/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
export default interface ResourceMetadata {
  type: string;
  interaction: { code: string };
  searchParam: {
    name: string;
    definition: string;
    type: string;
    documentation: string;
  }[];
  searchInclude: string[];
  revInclude: string[];
}
