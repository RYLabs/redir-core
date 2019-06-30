import * as querystring from "querystring";
import _fetch from "node-fetch";

type Request = { [key: string]: any };

export interface LoginAndPassword {
  login: string;
  password: string;
}

export interface AuthenticationHeader {
  basic?: LoginAndPassword;
  bearer?: string;
}

function base64Encode(str: string) {
  return Buffer.from(str).toString("base64");
}

function addHeader(request: Request, name: string, value: string) {
  if (!("headers" in request)) {
    request.headers = {};
  }
  request.headers[name] = value;
}

function addAuthentication(request: Request, auth: AuthenticationHeader) {
  const { basic, bearer } = auth;

  if (basic) {
    const { login, password } = basic;
    const authString = base64Encode([login, password].join(":"));
    addHeader(request, "Authorization", `Basic ${authString}`);
  } else if (bearer) {
    addHeader(request, "Authorization", `Bearer ${bearer}`);
  }
}

function doFetch(options: Request): Promise<string> {
  const { url, method, query, auth, headers, body } = options,
    request: Request = { url, method };

  if (headers) {
    request.headers = headers;
  }

  if (body) {
    request.body = body;
  }

  if (query) {
    delete options.query;
    const qs = querystring.stringify(query);
    if (url.indexOf("?") >= 0) {
      request.url = `${url}&${qs}`;
    } else {
      request.url = `${url}?${qs}`;
    }
  }

  if (auth) {
    addAuthentication(request, auth);
  }

  addHeader(request, "User-Agent", "redir.sh/fetcher <calvin@rylabs.io>");

  // debug("running fetch:", request);
  const _url = request.url;
  delete request.url;
  return _fetch(_url, request).then(res => res.text());
}

export default function fetch(options: Request | [Request]): Promise<string | string[]> {
  if (Array.isArray(options)) {
    return Promise.all(options.map(doFetch));
  } else {
    return doFetch(options);
  }
}
