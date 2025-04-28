import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
    CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableBody,
    CTableRow, CTableHeaderCell, CTableDataCell, CButton, CImage,
    CBadge, CSpinner, CModal, CModalHeader, CModalBody, CModalFooter,
    CForm, CFormTextarea, CFormSelect
} from "@coreui/react";
import { useViewReturnOrderQuery } from "../../service/orderService";

const ReportPending = () => {
    const { id } = useParams();

    const { data: returnOrderData, error: returnOrderError, isLoading: isReturnOrderLoading } = useViewReturnOrderQuery(id);
    const [modalVisible, setModalVisible] = useState(false);
    const [solution, setSolution] = useState("");
    const [assignee, setAssignee] = useState("");
    const [successModalVisible, setSuccessModalVisible] = useState(false);

    const { order, image } = returnOrderData || {};
    const status = order?.status;

    if (isReturnOrderLoading) {
        return (
            <div className="d-flex justify-content-center my-5">
                <CSpinner color="primary" />
                <span className="ms-2">Đang tải dữ liệu...</span>
            </div>
        );
    }

    if (returnOrderError) return <p className="text-danger">❌ Lỗi khi lấy chi tiết đơn hoàn hàng.</p>;

    const handleOpenModal = () => setModalVisible(true);
    const handleCloseModal = () => setModalVisible(false);

    const handleSubmit = () => {
        console.log("Giải quyết tranh chấp:", { solution, assignee });
        handleCloseModal();
        setSuccessModalVisible(true);
        setTimeout(() => {
            setSuccessModalVisible(false);
        }, 2000);
    };


    return (
        <div>
            <h5 className="mb-4">Chi tiết tranh chấp đơn hàng</h5>

            {/* Đơn hàng */}
            <CCard>
                <CCardHeader>
                    Đơn hàng
                    {status === "PENDING" && <CBadge color="warning" className="ms-2">Chưa xử lý</CBadge>}
                </CCardHeader>
                <CCardBody>
                    <CTable bordered>
                        <CTableBody>
                            <CTableRow>
                                <CTableDataCell><strong>Tên người mua:</strong> {order?.ownerName || 'Không xác định'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong>Lý do hoàn đơn:</strong> {order?.reason || 'Không xác định'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell><strong>Số điện thoại đặt hàng:</strong> {order?.phone || 'Không xác định'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell colSpan={1}>
                                    <strong>Sản phẩm trong đơn:</strong>
                                    <CTable bordered className="mt-2">
                                        <CTableHead>
                                            <CTableRow>
                                                <CTableHeaderCell>Tên sản phẩm</CTableHeaderCell>
                                                <CTableHeaderCell>Số lượng</CTableHeaderCell>
                                                <CTableHeaderCell>Đơn giá</CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {order?.orderItem?.length > 0 ? (
                                                order.orderItem.map((item, index) => (
                                                    <CTableRow key={index}>
                                                        <CTableDataCell>{item.productName}</CTableDataCell>
                                                        <CTableDataCell>{item.quantity}</CTableDataCell>
                                                        <CTableDataCell>
                                                            {item.total ? item.total.toLocaleString() + ' đ' : '0 đ'}
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                ))
                                            ) : (
                                                <CTableRow>
                                                    <CTableDataCell colSpan={4} className="text-center">Không có sản phẩm</CTableDataCell>
                                                </CTableRow>
                                            )}
                                        </CTableBody>
                                    </CTable>
                                </CTableDataCell>
                            </CTableRow>

                            <CTableRow>
                                <CTableDataCell><strong>Tổng giá:</strong> {order?.total?.toLocaleString()} VNĐ</CTableDataCell>
                            </CTableRow>

                            <CTableRow>
                                <CTableDataCell>
                                    <strong>Hình ảnh:</strong>
                                    <div className="d-flex gap-2 mt-2">
                                        {image?.length > 0 ? (
                                            image.map((src, index) => (
                                                <CImage key={index} src={src} width={70} thumbnail />
                                            ))
                                        ) : (
                                            <div className="text-muted">Không có hình ảnh</div>
                                        )}
                                    </div>
                                </CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>

            {/* Cửa hàng */}
            <CCard className="mt-4">
                <CCardHeader>Thông tin cửa hàng</CCardHeader>
                <CCardBody>
                    <CTable bordered>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell style={{ width: '200px' }}>Tên cửa hàng</CTableHeaderCell>
                                <CTableHeaderCell>Địa chỉ cửa hàng</CTableHeaderCell>
                                <CTableHeaderCell style={{ width: '200px' }}>Số điện thoại</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow>
                                <CTableDataCell>{order?.shopName || 'Không xác định'}</CTableDataCell>
                                <CTableDataCell>{order?.shopAddress || 'Không xác định'}</CTableDataCell>
                                <CTableDataCell>Không xác định</CTableDataCell> {/* Không có số điện thoại shop trong API */}
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>

            {/* Shipper */}
            <CCard className="mt-4">
                <CCardHeader>Thông tin người giao hàng</CCardHeader>
                <CCardBody>
                    <CTable bordered>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell style={{ width: '200px' }}>Tên người giao hàng</CTableHeaderCell>
                                <CTableHeaderCell style={{ width: '200px' }}>Số điện thoại</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow>
                                <CTableDataCell>{order?.shipperName || 'Không xác định'}</CTableDataCell>
                                <CTableDataCell>{order?.shipperPhone || 'Không xác định'}</CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>

            {/* Modal xử lý tranh chấp */}
            <div className="d-flex justify-content-end mt-4">
                <CButton color="danger" onClick={handleOpenModal}>Xử lý tranh chấp</CButton>
            </div>

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
                            </CFormSelect>
                        </div>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleCloseModal}>Đóng</CButton>
                    <CButton color="primary" onClick={handleSubmit}>Xử lý</CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={successModalVisible} onClose={() => setSuccessModalVisible(false)}>
                <CModalHeader closeButton>Xử lý thành công</CModalHeader>
                <CModalBody>
                    Đã xử lý tranh chấp thành công!
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={() => setSuccessModalVisible(false)}>OK</CButton>
                </CModalFooter>
            </CModal>

        </div>
    );
};

export default ReportPending;
