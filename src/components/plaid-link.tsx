// APP COMPONENT
// Upon rendering of App component, make a request to create and
// obtain a link token to be used in the Link component
import { createLinkToken, setAccessToken } from "@/lib/api/api";
import { useCurrentDealStore } from "@/lib/stores/current-deal-store";
import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
const PlaidLink = () => {
  const { currentDeal } = useCurrentDealStore();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const generateToken = async () => {
    const data = await createLinkToken();
    setLinkToken(data.link_token);
  };

  useEffect(() => {
    generateToken();
  }, []);

  return linkToken != null ? <Link linkToken={linkToken} deal={currentDeal?.id} /> : <></>;
};

// LINK COMPONENT
// Use Plaid Link and pass link token and onSuccess function
// in configuration to initialize Plaid Link
interface LinkProps {
  linkToken: string | null;
  deal?: string;
}

const Link: React.FC<LinkProps> = (props: LinkProps) => {
  const onSuccess = React.useCallback(async (public_token: any, _: any) => {
    await setAccessToken(public_token, props.deal);
  }, []);

  const config: Parameters<typeof usePlaidLink>[0] = {
    token: props.linkToken!,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <button onClick={() => open()} disabled={!ready}>
      Link account
    </button>
  );
};
export default PlaidLink;
