import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import { useLogoutMutation } from '../slices/userApiSlice';
import { logout } from '../slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Menu, Dropdown } from 'antd';
import {
  AppstoreOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LoginOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import '../Header.css';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { keyword: urlKeyword } = useParams();

    const [logoutApi] = useLogoutMutation();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
    const [keyword, setKeyword] = useState(urlKeyword || "");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const { cartItems } = useSelector(state => state.cart);
    const { userInfo } = useSelector(state => state.user);

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
            dispatch(logout());
            setIsMobileMenuOpen(false);
            setIsSidebarOpen(false);
            navigate("/login");
            toast.success("Logged Out Successfully");
        } catch (error) {
            toast.error(error?.data?.message || error?.error);
        }
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleMouseEnter = () => {
        setIsSidebarOpen(true);
    };

    const handleMouseLeave = () => {
        setIsSidebarOpen(false);
    };

    useEffect(() => {
        const elementsToToggle = [
            '.content-wrapper',
            '.content-table',
            '.content-menu',
            '.footer-wrapper',
            '.main-header'
        ];
        
        elementsToToggle.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                if (isSidebarOpen) {
                    element.classList.remove('sidebar-closed');
                } else {
                    element.classList.add('sidebar-closed');
                }
            }
        });
    }, [isSidebarOpen]);

    const accountMenu = (
        <Menu>
            <Menu.Item key="profile">
                <Link to="/profile">Profile</Link>
            </Menu.Item>
            <Menu.Item key="logout" onClick={handleLogout}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <nav className={`main-header navbar navbar-expand navbar-white navbar-light ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="pushmenu" href="#" onClick={toggleSidebar}>
                            {isSidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                        </a>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    {userInfo && (
                        <li className="nav-item">
                            <Dropdown overlay={accountMenu} trigger={['click']}>
                                <a className="nav-link" onClick={e => e.preventDefault()}>
                                    <UserOutlined /> {userInfo.name}
                                </a>
                            </Dropdown>
                        </li>
                    )}
                </ul>
            </nav>
            <div className="menu" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <Menu 
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={!isSidebarOpen}
                >
                    <div className={`brand-link flex justify-center mb-12 ${isSidebarOpen ? 'brand-link--active' : ''}`}>
                        <img src="../../public/images/icon.png" alt="Admin Logo" className={`brand-image img-circle mr-2`} />
                        <div className={`brand-text text-white ${isSidebarOpen ? '' : 'hide'}`}>SE LAB</div>
                    </div>
                    
                    <Menu.Item key="1" icon={<HomeOutlined />}>
                        <Link to="/">
                            Home
                        </Link>
                    </Menu.Item>
                    {userInfo && (
                        <Menu.Item key="2" icon={<ShoppingCartOutlined />}>
                            <Link to="/cart">
                                Cart
                            </Link>
                        </Menu.Item>
                    )}
                    {!userInfo && (
                        <Menu.Item key="3" icon={<LoginOutlined />}>
                            <Link to="/login">
                                Sign in
                            </Link>
                        </Menu.Item>
                    )}
                    {userInfo && userInfo.isAdmin && (
                        <Menu.SubMenu key="sub2" icon={<AppstoreOutlined />} title="Admin">
                            <Menu.Item key="9"><Link to="/admin/users">Users</Link></Menu.Item>
                            <Menu.Item key="10"><Link to="/admin/products">Products</Link></Menu.Item>
                            <Menu.SubMenu key="sub3" icon={<UnorderedListOutlined />} title="Request list"> 
                            <Menu.Item key="11"><Link to="/admin/orders">Pending</Link></Menu.Item>
                            <Menu.Item key="12"><Link to="/admin/confirm">Confirm</Link></Menu.Item>
                            <Menu.Item key="13"><Link to="/admin/cancel">Cancel</Link></Menu.Item>
                        </Menu.SubMenu>
                        </Menu.SubMenu>
                    )}
                </Menu>
            </div>
        </>
    );
}

export default Header;
