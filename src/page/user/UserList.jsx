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
    CPaginationItem, CButton,
} from '@coreui/react';
import { useSearchAndPaginationQuery } from "../../service/userService.js";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10); // Số lượng user trên mỗi trang

    const navigate = useNavigate();

    // Call Api
    const { data, error, isLoading } = useSearchAndPaginationQuery({ search, page, size });

    useEffect(() => {
        if (data) {
            setUsers(data.content);
        }
    }, [data]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error fetching users</p>;

    return (
        <>
            {/* Ô tìm kiếm và bộ lọc */}
            <CRow>
                <CTable>
                    <CTableBody>
                        <CTableRow>
                            <CTableDataCell>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập tên hoặc email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </CTableDataCell>
                            <CTableDataCell>
                                <CFormSelect>
                                    <option value="0">Sắp xếp theo</option>
                                    <option value="1">Thời gian</option>
                                    <option value="2">Trạng thái</option>
                                </CFormSelect>
                            </CTableDataCell>
                            <CTableDataCell>
                                <CButton
                                    color="primary"
                                    onClick={() => navigate('/adduser')}
                                >
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
                                onClick={() => navigate(`/user/${user.id}`)} // Chuyển hướng khi click vào user
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
                    <CPaginationItem disabled={page === 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
                        Trước
                    </CPaginationItem>

                    {Array.from({ length: data?.totalPages || 1 }, (_, i) => i + 1).map((pageNumber) => (
                        <CPaginationItem
                            key={pageNumber}
                            active={pageNumber === page}
                            onClick={() => setPage(pageNumber)}
                        >
                            {pageNumber}
                        </CPaginationItem>
                    ))}

                    <CPaginationItem disabled={page === data?.totalPages} onClick={() => setPage((prev) => prev + 1)}>
                        Sau
                    </CPaginationItem>
                </CPagination>
            </CRow>
        </>
    );
};

export default UserList;
