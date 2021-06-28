/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import Store from "store";
const accessTokenStateKey = "AccessTokenStateKey";
export function storeAccessTokenState(state: string): void {
  Store.set(accessTokenStateKey, state);
}

export function isAccessTokenValid(state: string): boolean {
  return Store.get(accessTokenStateKey) === state;
}

export function getAccessTokenState(): string {
  return Store.get(accessTokenStateKey);
}
