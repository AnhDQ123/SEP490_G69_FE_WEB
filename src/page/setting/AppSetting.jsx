import React, { useState } from 'react';
import { CCard, CCardBody, CForm, CFormLabel, CFormInput, CButton, CCol, CRow, CContainer } from '@coreui/react';

const AppSetting = () => {
    const [appName, setAppName] = useState('Fast F&B');
    const [icon, setIcon] = useState(null);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleIconChange = (e) => {
        setIcon(e.target.files[0]);
    };

    return (
        <CContainer>
            <CRow className="mt-4">
                <CCol xs={12} md={6}>
                    <CCard>
                        <CCardBody>
                            <CForm>
                                <CRow>
                                    <CCol xs={12}>
                                        <CFormLabel htmlFor="appName">Tên ứng dụng</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="appName"
                                            value={appName}
                                            onChange={(e) => setAppName(e.target.value)}
                                        />
                                    </CCol>
                                </CRow>

                                <CRow className="mt-3">
                                    <CCol xs={12}>
                                        <CFormLabel htmlFor="appIcon">Icon ứng dụng</CFormLabel>
                                        <CFormInput
                                            type="file"
                                            id="appIcon"
                                            onChange={handleIconChange}
                                        />
                                    </CCol>
                                </CRow>

                                <CRow className="mt-3">
                                    <CCol xs={12}>
                                        <CFormLabel htmlFor="communityStandard">Tiêu chuẩn cộng đồng</CFormLabel>
                                        <CFormInput
                                            type="file"
                                            id="communityStandard"
                                            onChange={handleFileChange}
                                        />
                                    </CCol>
                                </CRow>

                                <CRow className="mt-3">
                                    <CCol xs={12}>
                                        <CFormLabel htmlFor="appInfo">Giới thiệu về Fast F&B</CFormLabel>
                                        <CFormInput
                                            type="file"
                                            id="appInfo"
                                            onChange={handleFileChange}
                                        />
                                    </CCol>
                                </CRow>

                                <CRow className="mt-4">
                                    <CCol xs={12} className="d-flex justify-content-end">
                                        <CButton color="primary" type="submit">Lưu</CButton>
                                    </CCol>
                                </CRow>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
    );
};

export default AppSetting;
