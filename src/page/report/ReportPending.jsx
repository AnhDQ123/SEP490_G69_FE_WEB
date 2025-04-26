import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {

    CCard,
    CCardHeader,
    CCardBody,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CButton,
    CImage,
    CBadge,
    CSpinner,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CForm,
    CFormInput,
    CFormTextarea,
    CFormSelect
} from "@coreui/react";
import { useGetReportByIdQuery } from "../../service/reportService";
import { useGetUserByIdQuery } from "../../service/userService";
import { useGetShopByIdQuery } from "../../service/shopService";

const ReportPending = () => {
    let { reportId } = useParams();

    // Lấy thông tin báo cáo
    const { data: reportData, error: reportError, isLoading: isReportLoading } = useGetReportByIdQuery(reportId);

    // Lấy thông tin người dùng từ báo cáo
    const customerUserId = reportData?.reporterId;
    const { data: userData, error: userError, isLoading: isUserLoading } = useGetUserByIdQuery(customerUserId, {
        skip: !customerUserId
    });

    // Lấy thông tin cửa hàng từ báo cáo
    const shopId = reportData?.reportItemId;
    const { data: shopData, error: shopError, isLoading: isShopLoading } = useGetShopByIdQuery(shopId, {
        skip: !shopId
    });

    // State lưu trữ trạng thái modal
    const [modalVisible, setModalVisible] = useState(false);
    const [solution, setSolution] = useState("");
    const [assignee, setAssignee] = useState("");

    // const [updateReportStatus] = useUpdateReportStatusMutation();
    const [status, setStatus] = useState(reportData?.status);

    useEffect(() => {
        if (reportData) setStatus(reportData.status);
    }, [reportData]);

    if (isReportLoading || isUserLoading || isShopLoading) {
        return (
            <div className="d-flex justify-content-center my-5">
                <CSpinner color="primary" />
                <span className="ms-2">Đang tải dữ liệu...</span>
            </div>
        );
    }

    if (reportError) return <p className="text-danger">Có lỗi khi lấy chi tiết báo cáo.</p>;
    if (userError) return <p className="text-danger">Có lỗi khi lấy thông tin người dùng.</p>;
    if (shopError) return <p className="text-danger">Có lỗi khi lấy thông tin cửa hàng.</p>;

    // Hàm mở modal
    const handleOpenModal = () => {
        setModalVisible(true);
    };

    // Hàm đóng modal
    const handleCloseModal = () => {
        setModalVisible(false);
    };

    // Hàm xử lý tranh chấp
    const handleSubmit = () => {
        // Xử lý thông tin trong modal (lưu trữ, gọi API, v.v)
        console.log("Giải quyết tranh chấp với thông tin:", { solution, assignee });

        // Đóng modal sau khi xử lý
        handleCloseModal();
    };

    return (
        <div>
            <h5 className="mb-4">Chi tiết tranh chấp đơn hàng</h5>

            <CCard>
                <CCardHeader>
                    Đơn hàng
                    {status === "PENDING" && <CBadge color="warning" className="ms-2">Chưa xử lý</CBadge>}
                </CCardHeader>
                <CCardBody>
                    <CTable bordered>
                        <CTableBody>
                            {/* Dòng 1: Tên người mua */}
                            <CTableRow>
                                <CTableDataCell><strong>Tên người mua:</strong> {userData?.name || 'Không xác định'}</CTableDataCell>
                            </CTableRow>

                            {/* Dòng 2: Lý do hoàn đơn */}
                            <CTableRow>
                                <CTableDataCell><strong>Lý do hoàn đơn:</strong> {reportData?.reason}</CTableDataCell>
                            </CTableRow>

                            {/* Dòng 3: Số điện thoại đặt hàng */}
                            <CTableRow>
                                <CTableDataCell><strong>Số điện thoại đặt hàng:</strong> {reportData?.phone || 'Không xác định'}</CTableDataCell>
                            </CTableRow>

                            {/* Dòng thông tin sản phẩm */}
                            <CTableRow>
                                <CTableDataCell colSpan={1}><strong>Sản phẩm trong đơn:</strong></CTableDataCell>
                            </CTableRow>

                            {/* Hiển thị các sản phẩm */}
                            {reportData?.orderItems?.map((item, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell>{item.productName} - {item.price.toLocaleString()} VNĐ - {item.quantity} - {(item.price * item.quantity).toLocaleString()} VNĐ</CTableDataCell>
                                </CTableRow>
                            ))}

                            {/* Tổng giá đơn hàng */}
                            <CTableRow>
                                <CTableDataCell><strong>Tổng giá:</strong> {reportData?.orderItems?.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()} VNĐ</CTableDataCell>
                            </CTableRow>

                            {/* Hình ảnh */}
                            <CTableRow>
                                <CTableDataCell>
                                    <strong>Hình ảnh:</strong>
                                    <div className="d-flex gap-2 mt-2">
                                        {reportData?.images?.map((src, index) => (
                                            <CImage key={index} src={src} width={70} thumbnail />
                                        ))}
                                    </div>
                                </CTableDataCell>
                            </CTableRow>
                        </CTableBody>

                    </CTable>
                </CCardBody>
            </CCard>

            <CCard className="mt-4">
                <CCardHeader>Thông tin cửa hàng</CCardHeader>
                <CCardBody>
                    <CTable bordered>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell style={{width: '200px'}}>Tên cửa hàng</CTableHeaderCell>
                                <CTableHeaderCell>Địa chỉ cửa hàng</CTableHeaderCell>
                                <CTableHeaderCell style={{width: '200px'}}>Số điện thoại</CTableHeaderCell>
                                <CTableHeaderCell style={{width: '200px'}}>Ảnh</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow>
                                <CTableDataCell>{shopData?.name}</CTableDataCell>
                                <CTableDataCell>{shopData?.address}</CTableDataCell>
                                <CTableDataCell>{shopData?.phone}</CTableDataCell>
                                <CTableDataCell>{shopData?.phone}</CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>

            <CCard className="mt-4">
                <CCardHeader>Thông tin người giao hàng</CCardHeader>
                <CCardBody>
                    <CTable bordered>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell style={{width: '200px'}}>Tên người giao hàng</CTableHeaderCell>
                                <CTableHeaderCell style={{width: '200px'}}>Số điện thoại</CTableHeaderCell>
                                <CTableHeaderCell style={{width: '200px'}}>Ảnh</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow>
                                <CTableDataCell>{shopData?.name}</CTableDataCell>
                                <CTableDataCell>{shopData?.phone}</CTableDataCell>
                                <CTableDataCell>{shopData?.phone}</CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>

            <div className="d-flex justify-content-end mt-4">
                <CButton color="danger" onClick={handleOpenModal}>Xử lý tranh chấp</CButton>
            </div>

            {/* Modal xử lý tranh chấp */}
            <CModal visible={modalVisible} onClose={handleCloseModal}>
                <CModalHeader onClose={handleCloseModal}>Xử lý tranh chấp</CModalHeader>
                <CModalBody>
                    <CForm>
                        <div className="mb-3">
                            <CFormTextarea
                                label="Cách xử lý"
                                value={solution}
                                onChange={(e) => setSolution(e.target.value)}
                                placeholder="Nhập cách xử lý"
                            />
                        </div>
                        <div className="mb-3">
                            <CFormSelect
                                label="Người chịu xử lý"
                                value={assignee}
                                onChange={(e) => setAssignee(e.target.value)}
                            >
                                <option value="">Chọn người xử lý</option>
                                <option value="shop">Cửa hàng</option>
                                <option value="user">Người dùng</option>
                                <option value="shipper">Người giao hàng</option>

                                {/* Thêm các tùy chọn người xử lý khác nếu cần */}
                            </CFormSelect>
                        </div>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleCloseModal}>Đóng</CButton>
                    <CButton color="primary" onClick={handleSubmit}>Xử lý</CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default ReportPending;
