import React, {useEffect, useState} from 'react';
import {
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
    CForm,
    CFormInput,
    CFormSelect,
    CButton,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CSpinner,
    CPagination,
    CPaginationItem
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import {
    useGetAllReportsByTypeQuery
} from '../../service/reportService.js';

const ReturnedOrderList = () => {
    const [reports, setReports] = useState([]);
    const [page, setPage] = useState(1); // Start with page 1
    const [searchParams, setSearchParams] = useState({
        startDate: '',
        endDate: '',
        reportType: 'ORDER',
        orderCode: '',
        page: 1, // API page starts at 0
        size: 10, // Default records per page set to 10
    });

    const { reportType, startDate, endDate, orderCode } = searchParams;

    // API hooks based on the status of the return order
    const { data, isLoading, isError } = useGetAllReportsByTypeQuery(searchParams);
    useEffect(() => {
        if (data) {
            setReports(data.content);
        }
    }, [data]);

    // Handle input change for search
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    // Handle search button click
    const handleSearch = () => {
        setSearchParams(prev => ({
            ...prev,
            page: 1 // Reset to first page on search
        }));
    };

    // Calculate total pages based on orders length
    const totalPages = Math.ceil((reports?.content?.length || 0) / searchParams.size);

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            setSearchParams(prev => ({
                ...prev,
                page: newPage - 1 // API expects page to be 0-based
            }));
        }
    };

    const navigate = useNavigate();

    return (
        <CCard>
            <CCardHeader>
                <h3>Quản lý tranh chấp</h3>
            </CCardHeader>
            <CCardBody>
                <CForm>
                    <CRow className="mb-3">
                        <CCol><CFormInput type="date" name="startDate" label="Ngày bắt đầu" onChange={handleInputChange} /></CCol>
                        <CCol><CFormInput type="date" name="endDate" label="Ngày kết thúc" onChange={handleInputChange} /></CCol>
                        <CCol><CFormInput type="text" name="orderCode" label="Mã đơn hàng" placeholder="Nhập mã đơn hàng..." onChange={handleInputChange} /></CCol>
                        <CCol>
                            <CFormSelect name="reportType" label="Loại báo cáo" onChange={handleInputChange}>
                                <option value="ORDER">Tất cả</option>
                                <option value="PENDING">Chờ xử lý</option>
                                <option value="CANCELLED">Từ chối xử lý</option>
                                <option value="COMPLETED">Đã xử lý</option>
                            </CFormSelect>
                        </CCol>
                        <CCol>
                            <CFormSelect
                                name="size"
                                label="Số lượng hiển thị"
                                value={searchParams.size}
                                onChange={handleInputChange}
                            >
                                <option value="10">Hiển thị 10</option>
                                <option value="20">Hiển thị 20</option>
                                <option value="50">Hiển thị 50</option>
                            </CFormSelect>
                        </CCol>
                        <CCol className="d-flex align-items-end">
                            <CButton color="primary" onClick={handleSearch}>Tìm kiếm</CButton>
                        </CCol>
                    </CRow>
                </CForm>

                {/* Display loading spinner while fetching data */}
                {isLoading && <CSpinner color="primary" />}

                {/* Handle Error */}
                {isError && <div>Đã xảy ra lỗi khi tải dữ liệu.</div>}

                <CTable striped hover className="mt-4">
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Mã đơn hàng</CTableHeaderCell>
                            <CTableHeaderCell>Loại báo cáo</CTableHeaderCell>
                            <CTableHeaderCell>Ngày tạo</CTableHeaderCell>
                            <CTableHeaderCell>Giá trị</CTableHeaderCell>
                            <CTableHeaderCell>Hành động</CTableHeaderCell> {/* Column for View Detail */}
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {/* Ensure reports is always an array */}
                        {(Array.isArray(reports) ? reports : []).slice((page - 1) * searchParams.size, page * searchParams.size).map((report, index) => (
                            <CTableRow key={index} style={{ cursor: 'pointer' }}>
                                <CTableDataCell>{report.reportCode}</CTableDataCell>
                                <CTableDataCell>{report.reportType}</CTableDataCell>
                                <CTableDataCell>{report.createdAt}</CTableDataCell>
                                <CTableDataCell>{report.value?.toLocaleString('vi-VN')} đ</CTableDataCell>
                                <CTableDataCell>
                                    <CButton color="info" onClick={() => navigate(`/report-pending/${report.reportItemId}`)}>
                                        Xem chi tiết
                                    </CButton>
                                </CTableDataCell>

                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>

                {/* Pagination */}
                <CRow className="mt-3 d-flex justify-content-center">
                    <CPagination align="center">
                        <CPaginationItem disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
                            Trước
                        </CPaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                            <CPaginationItem key={pageNumber} active={pageNumber === page} onClick={() => handlePageChange(pageNumber)}>
                                {pageNumber}
                            </CPaginationItem>
                        ))}
                        <CPaginationItem disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>
                            Sau
                        </CPaginationItem>
                    </CPagination>
                </CRow>
            </CCardBody>
        </CCard>
    );
};

export default ReturnedOrderList;