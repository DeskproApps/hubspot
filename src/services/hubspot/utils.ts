export const isResponseError = (response: Response) => {
    return (response.status < 200 || response.status >= 400);
}
