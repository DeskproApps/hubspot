export const ACCESS_TOKEN_PATH = "oauth/global/access_token";
export const REFRESH_TOKEN_PATH = "oauth/global/refresh_token";

export const placeholders = {
    CLIENT_ID: "__client_id__",
    CLIENT_SECRET: "__client_secret__",
    REDIRECT_URI: "__redirect_uri__",
    TOKEN: `__global_access_token.json("[accessToken]")__`,
    REFRESH_TOKEN: `__global_access_token.json("[refreshToken]")__`,
    TOKEN_IN_STATE: `[[${ACCESS_TOKEN_PATH}]]`,
    REFRESH_TOKEN_IN_STATE: `[[${REFRESH_TOKEN_PATH}]]`,
};

export const BASE_URL = "https://api.hubapi.com";
