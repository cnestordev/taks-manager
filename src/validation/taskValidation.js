import * as Yup from "yup";

export const TaskSchema = Yup.object().shape({
    title: Yup.string().required("Title is required").min(3, "Title is too short"),
    description: Yup.string().required("Description is required").min(10, "Description must be at least 10 characters long"),
    priority: Yup.string().required("Priority is required"),
});
