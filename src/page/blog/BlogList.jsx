import React, { useState, useEffect } from 'react';
import {
    CRow,
    CCol,
    CTable,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CTableBody,
    CTableDataCell,
    CFormSelect,
} from '@coreui/react';
import { useGetBlogsQuery } from '../../service/blogService';
import { useNavigate } from 'react-router-dom';

const BlogList = () => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [blogs, setBlogs] = useState([]);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const navigate = useNavigate();

    const { data, error, isLoading } = useGetBlogsQuery({
        search,
        page: currentPage,
        size: pageSize,
    });

    useEffect(() => {
        console.log('Fetched data:', data);
        if (data && Array.isArray(data.content)) {
            const normalizedBlogs = data.content.map((blog, index) => ({
                ...blog,
                title: blog.title || `Blog ${index + 1}`,
                author: blog.author || 'Admin',
                status: blog.status || 'active',
                date: blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString()
                    : '',
            }));
            setBlogs(normalizedBlogs);
            setTotalBlogs(data.totalElements || data.content.length);
        }
    }, [data]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= Math.ceil(totalBlogs / pageSize)) {
            setCurrentPage(page);
        }
    };

    const handlePageSizeChange = (size) => {
        setPageSize(Number(size));
        setCurrentPage(1);
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error fetching blogs</p>;

    return (
        <>
            <CRow className="mb-4">
                <CTable>
                    <CTableBody>
                        <CTableRow>
                            <CTableDataCell>
                                <h5>Tìm kiếm</h5>
                            </CTableDataCell>
                            <CTableDataCell>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập tên blog"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </CTableDataCell>
                            <CTableDataCell>
                                <CFormSelect>
                                    <option value="0">Sắp xếp theo</option>
                                    <option value="1">Ngày đăng</option>
                                    <option value="2">Trạng thái</option>
                                </CFormSelect>
                            </CTableDataCell>
                        </CTableRow>
                    </CTableBody>
                </CTable>
            </CRow>

            <CRow>
                <CTable striped hover>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Tiêu đề</CTableHeaderCell>
                            <CTableHeaderCell>Tác giả</CTableHeaderCell>
                            <CTableHeaderCell>Ngày đăng</CTableHeaderCell>
                            <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                            <CTableHeaderCell>Hành động</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {blogs.length > 0 ? (
                            blogs.map((blog) => (
                                <CTableRow
                                    key={blog.id}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/blog/${blog.id}`)}
                                >
                                    <CTableDataCell>{blog.title}</CTableDataCell>
                                    <CTableDataCell>{blog.author}</CTableDataCell>
                                    <CTableDataCell>{blog.date}</CTableDataCell>
                                    <CTableDataCell>
                                        {blog.status === 'active' ? 'Hoạt động' : 'Bị chặn'}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        <button type="button" className="btn btn-info mb-3">
                                            Xem chi tiết
                                        </button>
                                    </CTableDataCell>
                                </CTableRow>
                            ))
                        ) : (
                            <CTableRow>
                                <CTableDataCell colSpan="5" className="text-center">
                                    Không có blog nào.
                                </CTableDataCell>
                            </CTableRow>
                        )}
                    </CTableBody>
                </CTable>
            </CRow>

            {/* ✅ Pagination Section - MỚI: Đưa ra ngoài bảng */}
            <CRow className="px-3 py-4 justify-content-between align-items-center">
                <CCol md="auto">
                    <button
                        className="btn btn-primary me-2"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="mx-2">{currentPage}</span>
                    <button
                        className="btn btn-primary"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage * pageSize >= totalBlogs}
                    >
                        Next
                    </button>
                </CCol>
                <CCol md="auto">
                    <CFormSelect
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(e.target.value)}
                        className="w-auto"
                    >
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </CFormSelect>
                </CCol>
            </CRow>
        </>
    );
};

export default BlogList;
