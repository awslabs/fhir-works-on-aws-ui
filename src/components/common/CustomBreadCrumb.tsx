/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import React from "react";
import { BreadcrumbGroup } from "@awsui/components-react";
import { useHistory } from "react-router-dom";
export const CustomBreadCrumb: React.FC<{
  items: { text: string; href: string }[];
}> = ({ items }) => {
  const history = useHistory();
  return (
    <BreadcrumbGroup
      items={[
        { text: "FHIR Works UI", href: "/" },
        { text: "FHIR Resources", href: "/" },
      ].concat(items)}
      ariaLabel="Breadcrumbs"
      onClick={(e) => {
        e.preventDefault();
        history.push(e.detail.href);
      }}
    />
  );
};
