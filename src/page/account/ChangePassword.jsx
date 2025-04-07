import React, { useState } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CFormFeedback,
    CRow,
    CAlert,
} from '@coreui/react'

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    })

    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        setError('')
        setSuccess(false)

        const { currentPassword, newPassword, confirmNewPassword } = formData

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setError('Vui lòng điền đầy đủ thông tin.')
            return
        }

        if (newPassword !== confirmNewPassword) {
            setError('Mật khẩu mới không khớp.')
            return
        }

        // 🔐 Giả lập gửi dữ liệu
        console.log('Changing password...', formData)

        // Giả lập thành công
        setSuccess(true)
        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        })
        setSubmitted(false)
    }

    return (
        <CRow>
            <CCol xs={12} md={6} className="mx-auto">
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Đổi mật khẩu</strong>
                    </CCardHeader>
                    <CCardBody>
                        {error && <CAlert color="danger">{error}</CAlert>}
                        {success && <CAlert color="success">Mật khẩu đã được thay đổi thành công!</CAlert>}
                        <CForm onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="currentPassword">Mật khẩu hiện tại</CFormLabel>
                                <CFormInput
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    invalid={submitted && !formData.currentPassword}
                                />
                                <CFormFeedback invalid>Bắt buộc</CFormFeedback>
                            </div>

                            <div className="mb-3">
                                <CFormLabel htmlFor="newPassword">Mật khẩu mới</CFormLabel>
                                <CFormInput
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    invalid={submitted && !formData.newPassword}
                                />
                                <CFormFeedback invalid>Bắt buộc</CFormFeedback>
                            </div>

                            <div className="mb-3">
                                <CFormLabel htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</CFormLabel>
                                <CFormInput
                                    type="password"
                                    id="confirmNewPassword"
                                    name="confirmNewPassword"
                                    value={formData.confirmNewPassword}
                                    onChange={handleChange}
                                    invalid={submitted && !formData.confirmNewPassword}
                                />
                                <CFormFeedback invalid>Bắt buộc</CFormFeedback>
                            </div>

                            <CButton type="submit" color="primary">
                                Lưu thay đổi
                            </CButton>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default ChangePassword
