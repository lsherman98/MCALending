import { type ParsedLocation, redirect } from "@tanstack/react-router";

import { pb } from "./pocketbase";

export const protectPage = (location?: ParsedLocation) => {
  if (!pb.authStore.isValid) {
    throw redirect({
      to: "/signin",
      search: {
        ["redirect"]: location?.href,
      },
    });
  }
};

export const getRedirectAfterSignIn = () =>
  new URLSearchParams(location.search).get("redirect") || "/";
