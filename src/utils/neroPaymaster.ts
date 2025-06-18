import axios from 'axios';

const NERO_API_ENDPOINT = process.env.NEXT_PUBLIC_NERO_API_ENDPOINT as string;

export async function pmSupportedTokens(userOperation: any, apiKey: string, entryPoint: string) {
  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "pm_supported_tokens",
    params: [userOperation, apiKey, entryPoint],
  };
  const { data } = await axios.post(NERO_API_ENDPOINT, payload);
  return data.result;
}

export async function pmSponsorUserOp(userOperation: any, apiKey: string, entryPoint: string, context: any) {
  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "pm_sponsor_userop",
    params: [userOperation, apiKey, entryPoint, context],
  };
  const { data } = await axios.post(NERO_API_ENDPOINT, payload);
  return data.result;
}

export async function pmEntrypoints() {
  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "pm_entrypoints",
    params: ["entryPoint"],
  };
  const { data } = await axios.post(NERO_API_ENDPOINT, payload);
  return data.result;
}
