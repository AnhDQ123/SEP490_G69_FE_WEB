import React from 'react'
import {
  CAvatar,
  CBadge,
  CButton,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

// import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  const toLoginFunc = () => {
    window.location.href = '/#/login'
  }
  return (

          <CButton color="primary" className="me-2" onClick={toLoginFunc} >Đăng xuất</CButton>
  )
}

export default AppHeaderDropdown
