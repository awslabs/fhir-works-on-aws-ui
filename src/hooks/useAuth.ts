/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { useState, useEffect } from "react";

// Example of a hook. This can be used to store accessToken received from Cognito
export const useAuth = () => {
  const fhirServerUrl = process.env.REACT_APP_FHIR_SERVER_URL;
  const authUrl = process.env.REACT_APP_AUTH_URL;

  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    console.log("url", window.location.href);
  }, []);

  return {
    accessToken,
  };
};
