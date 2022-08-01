export type FromAPIArgs = {
  url: string;
  method: "GET" | "POST" | "DELETE" | "PUT";
  body?: unknown;
  headers?: HeadersInit;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bodyFunc?: (body: any) => string;
};

export async function fromAPIGeneral(args: FromAPIArgs) {
  const { url, method, body, headers, bodyFunc } = args;
  const thisBodyFunc = !bodyFunc ? JSON.stringify : bodyFunc;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: thisBodyFunc(body),
  });

  if (!res.ok)
    throw new Error(
      `Request failed with code: ${res.status}, message: ${res.statusText}, ${await res.text()}`,
    );
  return res;
}

export async function fromAPIJson<ResponseType>(args: FromAPIArgs) {
  const res = await fromAPIGeneral(args);
  return (await res.json()) as ResponseType;
}

export async function fromAPIString(args: FromAPIArgs) {
  const res = await fromAPIGeneral(args);
  return await res.text();
}

export async function fromAPIBlob(args: FromAPIArgs) {
  const res = await fromAPIGeneral(args);
  return await res.blob();
}
