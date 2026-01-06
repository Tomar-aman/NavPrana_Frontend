export const normalizeApiError = (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const message =
        data?.message || data?.detail || error?.message || "Request failed";

    const normalizedError = new Error(message);
    normalizedError.status = status;
    normalizedError.details = data;

    return normalizedError;
};

export const getErrorMessage = (error, fallback = "Request failed") => {
    if (!error) return fallback;
    return error?.message || error?.details?.message || fallback;
};
