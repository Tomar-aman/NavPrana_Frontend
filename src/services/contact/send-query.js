import API from "@/services/api";

export const sendContactQuery = async (data) => {
    const res = await API.post("api/v1/contact/send-query/", data);
    // Return both status and data for further handling
    return { status: res.status, data: res.data };
};
