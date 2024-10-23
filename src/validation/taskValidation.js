import * as Yup from "yup";

export const TaskSchema = Yup.object().shape({
    title: Yup.string().required("Title is required").min(3, "Title is too short"),
    description: Yup.string().required("Description is required").min(10, "Description must be at least 10 characters long"),
    addedUsers: Yup.array().of(Yup.string().matches(/^[0-9a-fA-F]{24}$/, "Invalid user ID")).notRequired()
});
