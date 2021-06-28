/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import ResourceMetadata from "../../stores/ResourceMetadata";

export function getResourceTypes(metadata: ResourceMetadata[]): string[] {
  return metadata
    .map((resource: any) => {
      return resource.type;
    })
    .sort();
}
