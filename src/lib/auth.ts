import { type ParsedLocation, redirect } from "@tanstack/react-router";

import { pb } from "./pocketbase";
import { AUTH_CONSTANTS } from "./constants";

export const protectPage = (location?: ParsedLocation) => {
  if (!pb.authStore.isValid) {
    throw redirect({
      to: "/signin",
      search: {
        [AUTH_CONSTANTS.REDIRECT_PARAM]: location?.href,
      },
    });
  }
};

export const getRedirectAfterSignIn = () =>
  new URLSearchParams(location.search).get(AUTH_CONSTANTS.REDIRECT_PARAM) || "/";
