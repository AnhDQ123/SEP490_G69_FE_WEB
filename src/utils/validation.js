import * as yup from "yup";

export const userValidationSchema = yup.object().shape({
    email: yup
        .string()
        .required("Email là bắt buộc")
        .email("Email không hợp lệ. Phải chứa '@'"),

    phone: yup
        .string()
        .required("Số điện thoại là bắt buộc")
        .matches(/^0[0-9]{9}$/, "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số"),

    username: yup.string().required("Username là bắt buộc"),
});
