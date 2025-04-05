import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CForm,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CButton,
    CFormSelect,
    CPagination,
    CPaginationItem
} from '@coreui/react';
import { useGetAllReportsByStatusQuery } from '../../service/reportService';

const ReportList = () => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [statusFilter, setStatusFilter] = useState('PENDING');
    const [typeFilter, setTypeFilter] = useState('SHOP'); // New filter for report type
    const navigate = useNavigate();

    // Call API with both status and type filters
    const { data, error, isLoading } = useGetAllReportsByStatusQuery({
        status: statusFilter,
        reportType: typeFilter === 'ALL' ? undefined : typeFilter,
        page: 1,  // Thêm page vào dependencies
        size
    }, {
        refetchOnMountOrArgChange: true,  // Đảm bảo refetch khi args thay đổi
    });

    useEffect(() => {
        console.log("Current filters:", {
            statusFilter,
            typeFilter,
            page,
            size
        });
        if (data) {
            console.log("Report Data:", data);
        }
    }, [statusFilter, typeFilter, page, size, data]);

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Có lỗi xảy ra khi lấy danh sách báo cáo.</p>;

    const handleViewDetail = (report) => {
        if (report.reportType === "SHOP") {
            switch (report.status) {
                case "PENDING":
                    navigate(`/report-pending/${report.id}`);
                    break;
                case "COMPLETED":
                    navigate(`/report-completed/${report.id}`);
                    break;
                default:
                    alert("Trạng thái khiếu nại không hợp lệ!");
            }
        } else if (report.reportType === "BLOG") {
            switch (report.status) {
                case "PENDING":
                    navigate(`/blog-report-pending/${report.id}`);
                    break;
                case "COMPLETED":
                    navigate(`/blog-report-completed/${report.id}`);
                    break;
                default:
                    alert("Trạng thái khiếu nại không hợp lệ!");
            }
        } else if (report.reportType === "PRODUCT") {
            switch (report.status) {
                case "PENDING":
                    navigate(`/product-report-pending/${report.id}`);
                    break;
                case "COMPLETED":
                    navigate(`/product-report-completed/${report.id}`);
                    break;
                default:
                    alert("Trạng thái khiếu nại không hợp lệ!");
            }
        } else {
            alert("Loại báo cáo không hợp lệ!");
        }
    };

    return (
        <>
            {/* Filter section */}
            <CRow className="mb-3">
                <CTable>
                    <CTableBody>
                        <CTableRow>
                            <CTableDataCell>
                                <CFormSelect
                                    value={typeFilter}
                                    onChange={(e) => {
                                        setTypeFilter(e.target.value);
                                        setPage(1); // Reset về trang đầu khi thay đổi filter
                                    }}
                                >
                                    <option value="ALL">Tất cả</option>
                                    <option value="SHOP">Cửa hàng</option>
                                    <option value="PRODUCT">Sản phẩm</option>
                                    <option value="BLOG">Blog</option>
                                </CFormSelect>
                            </CTableDataCell>
                            <CTableDataCell>
                                <CFormSelect
                                    value={size}
                                    onChange={(e) => setSize(Number(e.target.value))}
                                >
                                    <option value="10">Hiển thị 10</option>
                                    <option value="20">Hiển thị 20</option>
                                    <option value="50">Hiển thị 50</option>
                                </CFormSelect>
                            </CTableDataCell>
                            <CTableDataCell>
                                <CFormSelect
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="PENDING">Chờ tiếp nhận</option>
                                    <option value="COMPLETED">Đã tiếp nhận</option>
                                </CFormSelect>
                            </CTableDataCell>
                        </CTableRow>
                    </CTableBody>
                </CTable>
            </CRow>

            {/* Reports list */}
            <CRow>
                <CTable striped hover>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Loại khiếu nại</CTableHeaderCell>
                            <CTableHeaderCell>Người tạo</CTableHeaderCell>
                            <CTableHeaderCell>Ngày tạo</CTableHeaderCell>
                            <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                            <CTableHeaderCell>Hành động</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {data?.content?.map((report) => (
                            <CTableRow key={report.id}>
                                <CTableDataCell>
                                    {report.reportType === 'SHOP' && 'Cửa hàng'}
                                    {report.reportType === 'PRODUCT' && 'Sản phẩm'}
                                    {report.reportType === 'BLOG' && 'Blog'}
                                </CTableDataCell>
                                <CTableDataCell>{report.reportedUserId?.username || report.reportedUserId?.userId}</CTableDataCell>
                                <CTableDataCell>
                                    {new Date(report.createdAt).toLocaleDateString()}
                                </CTableDataCell>
                                <CTableDataCell>
                                    {report.status === 'PENDING' && (
                                        <span className="badge bg-warning">Chờ xử lý</span>
                                    )}
                                    {report.status === 'COMPLETED' && (
                                        <span className="badge bg-success">Đã xử lý</span>
                                    )}
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color="info"
                                        size="sm"
                                        onClick={() => handleViewDetail(report)}
                                    >
                                        Xem chi tiết
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </CRow>

            {/* Pagination */}
            <CRow className="mt-3 d-flex justify-content-center">
                <CPagination align="center">
                    <CPaginationItem
                        disabled={page === 1}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    >
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
                    <CPaginationItem
                        disabled={page === data?.totalPages}
                        onClick={() => setPage((prev) => prev + 1)}
                    >
                        Sau
                    </CPaginationItem>
                </CPagination>
            </CRow>
        </>
    );
};

export default ReportList;