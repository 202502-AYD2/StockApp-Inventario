/* eslint-disable @typescript-eslint/no-explicit-any */

const baseUrl =
  typeof window === 'undefined' ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000' : '';

const makePost = (url: string, body: string, options: { headers?: Record<string, string> }) => {
  const headers = options.headers || {};
  return fetch(url, {
    body,
    headers,
    method: 'POST',
  }).then((res) => {
    if (res.statusText === 'No Content') {
      return res;
    }
    return res.json();
  });
};

const makeJSONPost = (url: string, data: any, options: { headers: Record<string, string> }) => {
  const body = JSON.stringify(data);
  const headers = options.headers || {};
  headers['Content-Type'] = 'application/json';

  return makePost(url, body, { headers });
};

export const getUsers = async () => {
  try {
    const res = await fetch('/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch users');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getAuth0Token = async () => {
  const options = {
    method: 'POST',
    headers: {
      cookie:
        'did=s%253Av0%253Ae7a62f01-2147-453b-b564-6319ff155212.B29T4jO9N3TeNbGNRJTCzFr2PUNsSgyzE4Y3%252B2n98Hk; did_compat=s%253Av0%253Ae7a62f01-2147-453b-b564-6319ff155212.B29T4jO9N3TeNbGNRJTCzFr2PUNsSgyzE4Y3%252B2n98Hk',
      'Content-Type': 'application/json',
    },
    body: '{"client_id":"a4W0w701SsYcEWYeBGpQl6gsGsJxZdA2","client_secret":"G2Zj9nP_OU9PbxvGDCeGEwYQhUkYlpLQAyDm1KeP73xsvOCCK23Fo6eksqHd5gWV","audience":"https://inventarios20242.us.auth0.com/api/v2/","grant_type":"client_credentials"}',
  };

  const res = fetch('https://inventarios20242.us.auth0.com/oauth/token', options).then((res) =>
    res.json()
  );
  return res;
};

export const createAuth0User = async (data: any, token: any, tokenType: any) => {
  const url = `https://inventarios20242.us.auth0.com/api/v2/users`;
  const headers = {
    Authorization: `${tokenType} ${token}`,
  };
  const body = data;
  return makeJSONPost(url, body, { headers });
};

export const createUser = (data: any) => {
  const url = `/api/auth0`;
  const body = { data };
  return makeJSONPost(url, body, { headers: {} });
};

export const createProfile = (data: any) => {
  const url = `/api/profile`;
  const body = { ...data };
  return makeJSONPost(url, body, { headers: {} });
};

export const getProjects = async () => {
  const url = `${baseUrl}/api/projects`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {},
  });
  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }
  return res.json();
};
