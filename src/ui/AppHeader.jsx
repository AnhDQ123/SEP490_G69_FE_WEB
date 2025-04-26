import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilContrast,
  cilMenu,
  cilMoon,
  cilSun,
  cilUser,
} from '@coreui/icons'

import { AppHeaderDropdown } from './header/index'
import AppBreadcrumb from './AppBreadcrumb.jsx'

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('core-free-react-admin-template-theme')
  const { id } = useParams()
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const navigate = useNavigate()

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
      headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
      <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
        <CContainer className="border-bottom px-4" fluid>
          <CHeaderToggler
              onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
              style={{ marginInlineStart: '-14px' }}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
          <CHeaderNav>
            <li className="nav-item py-1">
              <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
            </li>

            {/* Toggle màu sáng/tối */}
            <CDropdown variant="nav-item" placement="bottom-end">
              <CDropdownToggle caret={false}>
                {colorMode === 'dark' ? (
                    <CIcon icon={cilMoon} size="lg" />
                ) : colorMode === 'auto' ? (
                    <CIcon icon={cilContrast} size="lg" />
                ) : (
                    <CIcon icon={cilSun} size="lg" />
                )}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem
                    active={colorMode === 'light'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('light')}
                >
                  <CIcon className="me-2" icon={cilSun} size="lg" /> Light
                </CDropdownItem>
                <CDropdownItem
                    active={colorMode === 'dark'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('dark')}
                >
                  <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>

            <li className="nav-item py-1">
              <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
            </li>

            {/* Menu thông tin tài khoản */}
            <CDropdown variant="nav-item" placement="bottom-end">
              <CDropdownToggle caret={true} className="d-flex align-items-center">
                <CIcon icon={cilUser} size="lg" className="me-2" />
                Tài khoản
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem as="button" type="button" onClick={() => navigate(`/user-information/${id}`)}>
                  Thông tin người dùng
                </CDropdownItem>
                <CDropdownItem as="button" type="button" onClick={() => navigate('/change-password')}>
                  Đổi mật khẩu
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>

            <AppHeaderDropdown />
          </CHeaderNav>
        </CContainer>
        <CContainer className="px-4" fluid>
          <AppBreadcrumb />
        </CContainer>
      </CHeader>
  )
}

export default AppHeader
