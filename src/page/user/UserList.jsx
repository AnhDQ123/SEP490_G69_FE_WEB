import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CFormSelect,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CPagination,
    CPaginationItem,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter
} from '@coreui/react';
import { useSearchAndPaginationQuery, useAddUserMutation } from "../../service/userService.js";
import { useGetRolesQuery } from "../../service/roleService.js"; // Import API lấy danh sách role

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [modal, setModal] = useState(false);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState(null); // Ban đầu không chọn role
    const [roles, setRoles] = useState([]); // Lưu danh sách role từ API

    const navigate = useNavigate();

    // API lấy danh sách người dùng
    const { data, error, isLoading } = useSearchAndPaginationQuery({ search, page, size });

    // API lấy danh sách role từ roleService.js
    const { data: roleData, error: roleError, isLoading: isLoadingRoles } = useGetRolesQuery();

    useEffect(() => {
        if (data) {
            setUsers(data.content);
        }
    }, [data]);

    // Lưu danh sách role vào state khi API trả về dữ liệu
    useEffect(() => {
        if (roleData) {
            setRoles(roleData);
            if (roleData.length > 0) {
                setRole(roleData[0].id); // Mặc định chọn role đầu tiên
            }
        }
    }, [roleData]);

    // API thêm người dùng
    const [addUser, { isLoading: isAdding }] = useAddUserMutation();

    const handleSubmit = async () => {
        try {
            const roleNumber = Number(role);

            // Kiểm tra role hợp lệ
            if (!roles.some(r => r.id === roleNumber)) {
                alert("Vai trò không hợp lệ! Vui lòng chọn lại.");
                return;
            }

            const newUser = {
                email,
                password: "defaultPass123",
                phone: "0123456789",
                username: email.split('@')[0],
                role_id: roleNumber,
            };

            console.log("Dữ liệu gửi lên API:", newUser);

            await addUser(newUser).unwrap();
            alert("Thêm người dùng thành công!");

            // Reset form và đóng modal
            setModal(false);
            setEmail('');
            setRole(roles.length > 0 ? roles[0].id : null);
        } catch (err) {
            alert("Lỗi khi thêm người dùng! Vui lòng thử lại.");
            console.error("Lỗi khi thêm user:", err);
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error fetching users</p>;

    return (
        <>
            {/* Ô tìm kiếm và bộ lọc */}
            <CRow className="mb-3">
                <CTable>
                    <CTableBody>
                        <CTableRow>
                            <CTableDataCell>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tìm kiếm theo email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </CTableDataCell>
                            <CTableDataCell>
                                <CFormSelect value={size} onChange={(e) => setSize(Number(e.target.value))}>
                                    <option value="10">Hiển thị 10</option>
                                    <option value="20">Hiển thị 20</option>
                                    <option value="50">Hiển thị 50</option>
                                </CFormSelect>
                            </CTableDataCell>
                            <CTableDataCell>
                                <CButton color="primary" onClick={() => setModal(true)}>
                                    Thêm người quản lý
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    </CTableBody>
                </CTable>
            </CRow>

            {/* Danh sách người dùng */}
            <CRow>
                <CTable striped hover>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Tên người dùng</CTableHeaderCell>
                            <CTableHeaderCell>SĐT</CTableHeaderCell>
                            <CTableHeaderCell>Email</CTableHeaderCell>
                            <CTableHeaderCell>Ngày tham gia</CTableHeaderCell>
                            <CTableHeaderCell>Vai trò</CTableHeaderCell>
                            <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {users.map((user, index) => (
                            <CTableRow
                                key={index}
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/user/${user.id}`)}
                            >
                                <CTableDataCell className="fw-bold">{user.name}</CTableDataCell>
                                <CTableDataCell>{user.phone}</CTableDataCell>
                                <CTableDataCell>{user.email}</CTableDataCell>
                                <CTableDataCell>{user.created_at}</CTableDataCell>
                                <CTableDataCell>{user.role}</CTableDataCell>
                                <CTableDataCell>{user.status}</CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </CRow>

            {/* Phân trang */}
            <CRow className="mt-3 d-flex justify-content-center">
                <CPagination align="center">
                    <CPaginationItem disabled={page === 1} onClick={() => setPage(prev => Math.max(prev - 1, 1))}>
                        Trước
                    </CPaginationItem>
                    {Array.from({ length: data?.totalPages || 1 }, (_, i) => i + 1).map((pageNumber) => (
                        <CPaginationItem key={pageNumber} active={pageNumber === page} onClick={() => setPage(pageNumber)}>
                            {pageNumber}
                        </CPaginationItem>
                    ))}
                    <CPaginationItem disabled={page === data?.totalPages} onClick={() => setPage(prev => prev + 1)}>
                        Sau
                    </CPaginationItem>
                </CPagination>
            </CRow>

            {/* Modal thêm người quản lý */}
            <CModal visible={modal} onClose={() => setModal(false)}>
                <CModalHeader onClose={() => setModal(false)}>
                    <CModalTitle>Thêm Người Quản Lý</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Nhập email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Vai trò</label>
                        {isLoadingRoles ? (
                            <p>Đang tải vai trò...</p>
                        ) : roleError ? (
                            <p>Lỗi tải danh sách vai trò!</p>
                        ) : (
                            <CFormSelect value={role} onChange={(e) => setRole(Number(e.target.value))}>
                                {roles.map((r) => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </CFormSelect>
                        )}
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setModal(false)}>
                        Đóng
                    </CButton>
                    <CButton color="primary" onClick={handleSubmit} disabled={isAdding}>
                        {isAdding ? "Đang gửi..." : "Gửi"}
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default UserList;
