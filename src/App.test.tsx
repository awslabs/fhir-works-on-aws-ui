/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("Checks Amazon text is on homepage", () => {
  render(<App />);
  const linkElement = screen.getAllByText(/Amazon/i);
  expect(linkElement.length).toBeGreaterThan(0);
});
