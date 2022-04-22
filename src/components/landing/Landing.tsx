/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import {
  Box,
  Button,
  Container,
  Grid,
  Header,
  SpaceBetween,
} from "@awsui/components-react";
import React from "react";
import "./Landing.scss";
import { v4 as uuidv4 } from "uuid";
import { storeAccessTokenState } from "../../common/utils/AccessTokenUtil";

export const Landing: React.FC<{
  isLoggedIn: boolean;
}> = ({ isLoggedIn }) => {
  return (
    <Box margin={{ bottom: "l" }} padding="xs">
      <Grid
        gridDefinition={[{ colspan: { xxs: 12 } }]}
        className="custom-home__header"
      >
        <Box padding={{ vertical: "xxl" }}>
          <Grid
            gridDefinition={[
              {
                offset: { l: 2, xxs: 1 },
                colspan: { l: 8, xxs: 10 },
              },
              {
                colspan: { xl: 6, l: 5, s: 6, xxs: 10 },
                offset: { l: 2, xxs: 1 },
              },
              {
                colspan: { xl: 2, l: 2, s: 3, xxs: 10 },
                offset: { s: 1, xxs: 1 },
              },
            ]}
          >
            <Box fontWeight="light" padding={{ top: "xs" }}>
              <span className="custom-home__category">
                Electronic Healthcare Information
              </span>
            </Box>
            <div className="custom-home__header-title">
              <Box
                variant="h1"
                fontWeight="bold"
                padding="n"
                fontSize="display-l"
                color="inherit"
              >
                FHIR Works Demo
              </Box>
              <Box
                fontWeight="light"
                padding={{ bottom: "s" }}
                fontSize="display-l"
                color="inherit"
              >
                Manage the exchange of healthcare information electronically
              </Box>
              <Box variant="p" fontWeight="light">
                <span className="custom-home__header-sub-title">
                  FHIR Works on AWS is a framework to deploy a FHIR server on
                  AWS. The power of this framework is being able to customize
                  and add in additional FHIR functionality for your unique
                  use-case. This website is an example front end client of the
                  FHIR server.
                </span>
              </Box>
            </div>
            <Container
              className="center-header"
              header={<Header variant="h2">Get Started</Header>}
            >
              <SpaceBetween size="xl">
                {isLoggedIn ? (
                  "You Are Logged In"
                ) : (
                  <>
                    <Box fontSize="heading-s">
                      To start making CRUD requests to the server, please login
                      first.
                    </Box>
                    <Box>
                      <Button
                        variant="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          const {
                            REACT_APP_AUTH_URL,
                            REACT_APP_CLIENT_ID,
                          } = process.env;
                          const authUrl = new URL(
                            `${REACT_APP_AUTH_URL}/login` || ""
                          );
                          authUrl.searchParams.append("response_type", "token");
                          const stateValue = uuidv4();
                          storeAccessTokenState(stateValue);
                          authUrl.searchParams.append("state", stateValue);
                          authUrl.searchParams.append(
                            "client_id",
                            REACT_APP_CLIENT_ID || ""
                          );
                          authUrl.searchParams.append(
                            "scope",
                            "profile openid"
                          );
                          authUrl.searchParams.append(
                            "redirect_uri",
                            encodeURI(`${window.location.href}callback`)
                          );
                          window.location.href = authUrl.href;
                        }}
                      >
                        Login
                      </Button>
                    </Box>
                  </>
                )}
              </SpaceBetween>
            </Container>
          </Grid>
        </Box>
      </Grid>
      <Grid gridDefinition={[{ colspan: { xxs: 12 } }]}>
        <Box padding={{ vertical: "xxl" }}>
          <Grid
            gridDefinition={[
              {
                offset: { l: 2, xxs: 1 },
                colspan: { l: 8, xxs: 10 },
              },
              {
                colspan: { xl: 8, l: 8, s: 10, xxs: 10 },
                offset: { l: 2, xxs: 1 },
              },
            ]}
          ></Grid>
        </Box>
      </Grid>
    </Box>
  );
};
