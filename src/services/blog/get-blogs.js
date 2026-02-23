import API from "@/services/api";

export const getBlogs = async () => {
    const res = await API.get("api/v1/blogs/");
    return res.data;
};

export const getBlogBySlug = async (slug) => {
    const res = await API.get(`api/v1/blogs/${slug}/`);
    return res.data;
};

export const getBlogCategories = async () => {
    const res = await API.get("api/v1/blogs/categories/");
    return res.data;
};
