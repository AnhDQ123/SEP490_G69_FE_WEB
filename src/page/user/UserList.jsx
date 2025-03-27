import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // ✅ Thêm useLocation
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
    CModalFooter, CFormInput
} from '@coreui/react';
import { useSearchAndPaginationQuery, useAddUserMutation } from "../../service/userService.js";
import { useGetRolesQuery } from "../../service/roleService.js";
import { userValidationSchema } from "../../utils/validation.js";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [modal, setModal] = useState(false);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [role, setRole] = useState(null);
    const [roles, setRoles] = useState([]);

    const navigate = useNavigate();
    const location = useLocation(); // ✅ Lấy location để kiểm tra state

    const { data, error, isLoading, refetch } = useSearchAndPaginationQuery(
        { search, page, size },
        { refetchOnMountOrArgChange: true }
    );

    const { data: roleData, error: roleError, isLoading: isLoadingRoles } = useGetRolesQuery();

    useEffect(() => {
        if (data) {
            setUsers(data.content);
        }
    }, [data]);

    useEffect(() => {
        if (roleData) {
            setRoles(roleData);
            if (roleData.length > 0) {
                setRole(roleData[0].id);
            }
        }
    }, [roleData]);

    // ✅ Tự động refetch nếu quay lại từ UserDetail có cập nhật
    useEffect(() => {
        if (location.state?.shouldRefetch) {
            refetch();
        }
    }, [location.state]);

    const [addUser, { isLoading: isAdding }] = useAddUserMutation();

    const handleSubmit = async () => {
        try {
            await userValidationSchema.validate({ email, phone, username });

            const roleNumber = Number(role);
            if (!roles.some(r => r.id === roleNumber)) {
                alert("Vai trò không hợp lệ! Vui lòng chọn lại.");
                return;
            }

            const newUser = {
                email,
                phone,
                username,
                password: "defaultPass123",
                roleId: roleNumber,
            };

            await addUser(newUser).unwrap();
            alert("Thêm người dùng thành công!");

            setModal(false);
            setEmail('');
            setPhone('');
            setUsername('');
            setRole(roles.length > 0 ? roles[0].id : null);
        } catch (err) {
            if (err.name === "ValidationError") {
                alert(err.message);
            } else {
                alert("Lỗi khi thêm người dùng! Vui lòng thử lại.");
                console.error("Lỗi khi thêm user:", err);
            }
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
                                <CFormInput
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập tên hoặc thông tin cần tìm kiếm..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            setSearch(searchTerm);
                                        }
                                    }}
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
                        <input type="email" className="form-control" placeholder="Nhập email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label>Số điện thoại</label>
                        <input type="text" className="form-control" placeholder="Nhập số điện thoại (+84)" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label>Username</label>
                        <input type="text" className="form-control" placeholder="Nhập username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label>Vai trò</label>
                        {isLoadingRoles ? <p>Đang tải vai trò...</p> : roleError ? <p>Lỗi tải danh sách vai trò!</p> : (
                            <CFormSelect value={role} onChange={(e) => setRole(Number(e.target.value))}>
                                {roles.map((r) => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </CFormSelect>
                        )}
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setModal(false)}>Đóng</CButton>
                    <CButton color="primary" onClick={handleSubmit} disabled={isAdding}>{isAdding ? "Đang gửi..." : "Gửi"}</CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default UserList;
