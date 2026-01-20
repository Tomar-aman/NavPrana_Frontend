import API from "@/services/api";

export const getContactInfo = async () => {
    const res = await API.get("api/v1/contact/contact-info/");
    return res.data;
};
