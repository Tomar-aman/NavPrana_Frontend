import API from "@/services/api";

export const getSocialMediaLinks = async () => {
    try {
        const res = await API.get("api/v1/contact/social-media-links/");
        return res.data;
    }
    catch (error) {
        console.error("Error fetching social media links:", error);
        return [];
    }
};
