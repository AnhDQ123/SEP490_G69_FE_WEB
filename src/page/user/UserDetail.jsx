import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    CRow,
    CCol,
    CCard,
    CCardBody,
    CFormInput,
    CFormSelect,
    CButton,
    CImage,
} from "@coreui/react";
import {
    useGetUserByIdQuery,
    useActiveUserMutation,
    useInactiveUserMutation,
} from "../../service/userService.js";

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, error, isLoading } = useGetUserByIdQuery(id);
    const [activeUser, { isLoading: isActivating }] = useActiveUserMutation();
    const [inactiveUser, { isLoading: isDeactivating }] = useInactiveUserMutation();

    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        role: "",
        status: "active",
        createdAt: "",
        avatar: "",
    });

    useEffect(() => {
        if (data) {
            setUser({
                name: data.name || "",
                email: data.email || "",
                phone: data.phone || "",
                address: data.address || "",
                role: data.role || "",
                status: data.status || "active",
                createdAt: data.createdAt || "",
                avatar: data.avatar || "",
            });
        }
    }, [data]);

    const handleStatusChange = (e) => {
        setUser((prev) => ({ ...prev, status: e.target.value }));
    };

    const handleClickSave = async () => {
        try {
            console.log("User ID:", id, "Trạng thái:", user.status);
            if (user.status.toLowerCase() === "active") {
                await activeUser(id).unwrap();
                alert("✅ Kích hoạt tài khoản thành công!");
            } else if (user.status.toLowerCase() === "inactive") {
                await inactiveUser(id).unwrap();
                alert("⛔ Tạm dừng tài khoản thành công!");
            }
            navigate(-1, { state: { shouldRefetch: true } });
        } catch (err) {
            console.error("Lỗi khi cập nhật trạng thái:", err);
            alert("❌ Cập nhật thất bại! Vui lòng thử lại.");
        }
    };

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Lỗi khi lấy dữ liệu người dùng</p>;

    return (
        <CCard className="p-4 shadow-lg">
            <CCardBody>
                <CRow className="mb-3 d-flex align-items-center">
                    <CCol md={8}>
                        <h4 className="fw-bold">📌 Danh sách tài khoản {'>'} Người dùng</h4>
                    </CCol>
                    <CCol md={4} className="text-end">
                        <CImage
                            src={user.avatar}
                            className="border rounded-circle shadow-sm"
                            width={100}
                            height={100}
                            alt="Avatar"
                        />
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CCol md={6}>
                        <label className="fw-semibold">Họ Tên</label>
                        <CFormInput disabled value={user.name} />
                    </CCol>
                    <CCol md={6}>
                        <label className="fw-semibold">Vai trò</label>
                        <CFormInput disabled value={user.role} />
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CCol md={6}>
                        <label className="fw-semibold">SĐT</label>
                        <CFormInput disabled value={user.phone} />
                    </CCol>
                    <CCol md={6}>
                        <label className="fw-semibold">Địa chỉ</label>
                        <CFormInput disabled value={user.address} />
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CCol md={6}>
                        <label className="fw-semibold">Ngày tham gia</label>
                        <CFormInput disabled value={user.createdAt} />
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CCol md={6}>
                        <label className="fw-semibold">Trạng thái</label>
                        <CFormSelect value={user.status} onChange={handleStatusChange}>
                            <option value="ACTIVE">Hoạt động</option>
                            <option value="INACTIVE">Tạm dừng</option>
                        </CFormSelect>
                    </CCol>
                </CRow>

                <CRow className="text-center mt-4 justify-content-center">
                    <CCol md="auto" className="mb-2">
                        <CButton color="danger" className="py-2 px-3 fw-semibold">
                            🚨 Gửi cảnh báo
                        </CButton>
                    </CCol>
                    <CCol md="auto" className="mb-2">
                        <CButton color="secondary" className="py-2 px-3 fw-semibold" onClick={() => navigate(-1)}>
                            ⬅️ Quay lại
                        </CButton>
                    </CCol>
                    <CCol md="auto" className="mb-2">
                        <CButton
                            color="success"
                            className="py-2 px-3 fw-semibold"
                            onClick={handleClickSave}
                            disabled={isActivating || isDeactivating}
                        >
                            {(isActivating || isDeactivating) ? "Đang lưu..." : "💾 Lưu"}
                        </CButton>
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard>
    );
};

export default UserDetail;
