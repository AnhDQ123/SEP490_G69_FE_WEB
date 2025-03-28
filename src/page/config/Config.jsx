import React, { useState } from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CFormSelect,
    CFormLabel,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CButton,
    CRow,
    CCol,
    CFormInput,
    CModalFooter,
    CFormCheck,
    CModalHeader,
    CModal,
    CModalBody,
} from '@coreui/react';

const Config = () => {
    const [configOptions, setConfigOptions] = useState([
        { value: 'shippingFee', label: 'Phí ship' },
        { value: 'rejectReason', label: 'Lý do từ chối nhận hàng' },
        { value: 'returnReason', label: 'Lý do từ chối trả hàng' },
    ]);

    const [configType, setConfigType] = useState('shippingFee');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAddConfigTypeModal, setShowAddConfigTypeModal] = useState(false);
    const [newConfigTypeLabel, setNewConfigTypeLabel] = useState('');

    const [newItemName, setNewItemName] = useState('');
    const [newItemValue, setNewItemValue] = useState('');
    const [newItemTime, setNewItemTime] = useState('');
    const [newItemWeather, setNewItemWeather] = useState('');
    const [newItemPublished, setNewItemPublished] = useState(true);

    // Dynamic config data storage
    const [configData, setConfigData] = useState({
        shippingFee: [
            {
                id: 1,
                name: 'Giao hàng tiêu chuẩn',
                value: '30,000 VND',
                published: true,
                time: 'Sáng',
                weather: 'Trời nắng',
            },
            {
                id: 2,
                name: 'Giao hàng nhanh',
                value: '50,000 VND',
                published: true,
                time: 'Chiều',
                weather: 'Mọi thời tiết',
            },
        ],
        rejectReason: [
            { id: 1, name: 'Khách không có nhà', value: 'Khách không có nhà', published: true },
            { id: 2, name: 'Không đặt hàng', value: 'Không đặt hàng', published: false },
        ],
        returnReason: [
            { id: 1, name: 'Sản phẩm bị lỗi', value: 'Sản phẩm bị lỗi', published: true },
            { id: 2, name: 'Không đúng mô tả', value: 'Không đúng mô tả', published: true },
        ],
    });

    const getDataList = () => configData[configType] || [];

    const setDataList = (updatedList) => {
        setConfigData((prev) => ({
            ...prev,
            [configType]: updatedList,
        }));
    };

    const handleAddModal = () => {
        if (!newItemName || !newItemValue) return;

        const newItem = {
            id: Date.now(),
            name: newItemName,
            value: newItemValue,
            published: newItemPublished,
            ...(configType === 'shippingFee' && {
                time: newItemTime,
                weather: newItemWeather,
            }),
        };

        const updatedList = [...getDataList(), newItem];
        setDataList(updatedList);

        // Reset form
        setNewItemName('');
        setNewItemValue('');
        setNewItemTime('');
        setNewItemWeather('');
        setNewItemPublished(true);
        setShowAddModal(false);
    };

    const handleAddConfigType = () => {
        if (!newConfigTypeLabel.trim()) return;

        const newKey = newConfigTypeLabel
            .toLowerCase()
            .replace(/ /g, '_')
            .replace(/[^a-z0-9_]/g, '');

        if (configOptions.some((opt) => opt.value === newKey)) return;

        setConfigOptions([...configOptions, { value: newKey, label: newConfigTypeLabel }]);
        setConfigData((prev) => ({ ...prev, [newKey]: [] }));
        setNewConfigTypeLabel('');
        setConfigType(newKey);
        setShowAddConfigTypeModal(false);
    };

    const renderTable = () => {
        const data = getDataList();

        return (
            <>
                <CRow className="justify-content-between mb-3">
                    <CCol><h5>Danh sách cấu hình</h5></CCol>
                    <CCol className="text-end">
                        <CButton size="sm" color="primary" onClick={() => setShowAddModal(true)}>
                            Thêm mới
                        </CButton>
                    </CCol>
                </CRow>

                <CTable striped hover responsive>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Name</CTableHeaderCell>
                            <CTableHeaderCell>Value</CTableHeaderCell>
                            {configType === 'shippingFee' && (
                                <>
                                    <CTableHeaderCell>Giờ giao hàng</CTableHeaderCell>
                                    <CTableHeaderCell>Thời tiết</CTableHeaderCell>
                                </>
                            )}
                            <CTableHeaderCell>Published</CTableHeaderCell>
                            <CTableHeaderCell>Edit</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {data.map((item) => (
                            <CTableRow key={item.id}>
                                <CTableDataCell>{item.name}</CTableDataCell>
                                <CTableDataCell>{item.value}</CTableDataCell>
                                {configType === 'shippingFee' && (
                                    <>
                                        <CTableDataCell>{item.time || '-'}</CTableDataCell>
                                        <CTableDataCell>{item.weather || '-'}</CTableDataCell>
                                    </>
                                )}
                                <CTableDataCell>{item.published ? '✔️' : ''}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton size="sm" color="secondary">Edit</CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </>
        );
    };

    return (
        <CCard>
            <CCardHeader>
                <CRow className="align-items-end justify-content-between">
                    <CCol md={4}>
                        <CFormLabel>Chọn loại cấu hình</CFormLabel>
                        <CFormSelect
                            value={configType}
                            onChange={(e) => setConfigType(e.target.value)}
                        >
                            {configOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </CFormSelect>
                    </CCol>
                    <CCol md="auto" className="text-end">
                        <CButton size="sm" color="info" onClick={() => setShowAddConfigTypeModal(true)}>
                            Thêm loại cấu hình
                        </CButton>
                    </CCol>
                </CRow>
            </CCardHeader>

            <CCardBody>
                {renderTable()}
            </CCardBody>

            {/* Modal Thêm nội dung cấu hình */}
            <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
                <CModalHeader closeButton>
                    <strong>Thêm cấu hình mới</strong>
                </CModalHeader>
                <CModalBody>
                    <CFormLabel>Tên cấu hình</CFormLabel>
                    <CFormInput
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Nhập tên cấu hình..."
                        className="mb-3"
                    />
                    <CFormLabel>Giá trị / Nội dung</CFormLabel>
                    <CFormInput
                        value={newItemValue}
                        onChange={(e) => setNewItemValue(e.target.value)}
                        placeholder="Nhập giá trị..."
                        className="mb-3"
                    />
                    {configType === 'shippingFee' && (
                        <>
                            <CFormLabel>Giờ giao hàng</CFormLabel>
                            <CFormInput
                                value={newItemTime}
                                onChange={(e) => setNewItemTime(e.target.value)}
                                placeholder="Ví dụ: Sáng, Chiều, Tối"
                                className="mb-3"
                            />
                            <CFormLabel>Thời tiết</CFormLabel>
                            <CFormInput
                                value={newItemWeather}
                                onChange={(e) => setNewItemWeather(e.target.value)}
                                placeholder="Ví dụ: Nắng, Mưa nhẹ, Mọi thời tiết"
                                className="mb-3"
                            />
                        </>
                    )}
                    <CFormCheck
                        label="Hiển thị (Published)"
                        checked={newItemPublished}
                        onChange={(e) => setNewItemPublished(e.target.checked)}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowAddModal(false)}>Hủy</CButton>
                    <CButton color="primary" onClick={handleAddModal}>Lưu</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal Thêm loại cấu hình */}
            <CModal visible={showAddConfigTypeModal} onClose={() => setShowAddConfigTypeModal(false)}>
                <CModalHeader closeButton>
                    <strong>Thêm loại cấu hình</strong>
                </CModalHeader>
                <CModalBody>
                    <CFormLabel>Tên loại cấu hình mới</CFormLabel>
                    <CFormInput
                        value={newConfigTypeLabel}
                        onChange={(e) => setNewConfigTypeLabel(e.target.value)}
                        placeholder="Ví dụ: Ghi chú đặc biệt"
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowAddConfigTypeModal(false)}>Hủy</CButton>
                    <CButton color="primary" onClick={handleAddConfigType}>Lưu</CButton>
                </CModalFooter>
            </CModal>
        </CCard>
    );
};

export default Config;
