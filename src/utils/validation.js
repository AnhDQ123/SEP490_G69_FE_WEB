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

export const categoryValidationSchema = yup.object().shape({
    name: yup
        .string()
        .required("Tên danh mục là bắt buộc")  // Tên danh mục là bắt buộc
        .min(3, "Tên danh mục phải có ít nhất 3 ký tự"),  // Tối thiểu 3 ký tự

    description: yup
        .string()
        .required("Mô tả là bắt buộc")  // Mô tả là bắt buộc
        .max(500, "Mô tả không được vượt quá 500 ký tự"),  // Không vượt quá 500 ký tự

    image: yup
        .string()
        .url("Ảnh phải là một URL hợp lệ")
        .notRequired()  // Không yêu cầu nếu có file ảnh
        .test("image-or-imageFile", "Cần chọn một ảnh (URL hoặc file)", function(value) {
            const { imageFile } = this.parent;
            if (!value && !imageFile) {
                return false;  // Nếu cả URL và file ảnh đều không có thì báo lỗi
            }
            return true;
        }),

    imageFile: yup
        .mixed()
        .notRequired()  // Không yêu cầu nếu có URL ảnh
        .test("fileSize", "File quá lớn. Chọn một file nhỏ hơn 5MB", value => {
            return value ? value.size <= 5 * 1024 * 1024 : true;  // Kiểm tra kích thước file tối đa 5MB
        })
        .test("fileFormat", "Chỉ hỗ trợ các file ảnh (jpg, png, jpeg)", value => {
            return value ? ["image/jpg", "image/jpeg", "image/png"].includes(value.type) : true;  // Kiểm tra định dạng file
        })
        .test("image-or-imageFile", "Cần chọn một ảnh (URL hoặc file)", function(value) {
            const { image } = this.parent;
            if (!value && !image) {
                return false;  // Nếu cả URL và file ảnh đều không có thì báo lỗi
            }
            return true;
        })
});