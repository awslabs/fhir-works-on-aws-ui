/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { useEffect, useState } from "react";
import queryString from "query-string";
import {
  getAccessTokenState,
  isAccessTokenValid,
} from "../../common/utils/AccessTokenUtil";
import { useHistory } from "react-router-dom";

export const Callback: React.FC<{ setAccessToken: Function }> = ({
  setAccessToken,
}) => {
  const history = useHistory();
  useEffect(
    () => {
      const parsedHash = queryString.parse(history.location.hash);
      const { state, id_token } = parsedHash;
      // Context: https://auth0.com/docs/protocols/state-parameters
      if (!isAccessTokenValid(state as string)) {
        setErrorMessage(
          `Returned state for access token did not match sent state for access token. 
        Sent State: ${getAccessTokenState()}, Returned State: ${state}`
        );
      }
      setAccessToken(id_token);
      history.push("/");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [errorMessage, setErrorMessage] = useState("");
  return <div>${errorMessage}</div>;
};
// export default withRouter(Callback);
