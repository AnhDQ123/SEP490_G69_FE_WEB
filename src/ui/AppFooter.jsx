import React from 'react'
import { CFooter, CContainer } from '@coreui/react'

const AppFooter = () => {
    return (
        <CFooter className="py-3 mt-4 border-top">
            <CContainer fluid className="px-4 d-flex justify-content-between align-items-center">
                <div>
                    <span className="text-body-secondary">© {new Date().getFullYear()} FastF&B.</span>
                </div>
                <div>
                    <a href="/terms" className="text-decoration-none text-body-secondary me-3">
                        Điều khoản dịch vụ
                    </a>
                    <a href="/privacy" className="text-decoration-none text-body-secondary">
                        Chính sách bảo mật
                    </a>
                </div>
            </CContainer>
        </CFooter>
    )
}

export default AppFooter