import API from "@/services/api";

export const subscribeNewsletter = async (email) => {
    const res = await API.post("api/v1/contact/subscribe/", { email });
    return res;
};
