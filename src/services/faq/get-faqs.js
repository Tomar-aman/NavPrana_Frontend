import API from "@/services/api";

export const getFaqs = async () => {
    const res = await API.get("api/v1/contact/faqs/");
    return res.data;
};
