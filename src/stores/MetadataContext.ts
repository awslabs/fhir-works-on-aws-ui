/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import React, { useContext } from "react";

//https://www.pluralsight.com/guides/using-react's-context-api-with-typescript
export type MetadataContextType = {
  metadata: any;
};

export const MetadataContext = React.createContext<MetadataContextType>({
  metadata: {},
});

export const useMetadata = () => useContext(MetadataContext);
