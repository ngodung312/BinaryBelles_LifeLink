import React, { useContext } from 'react'
import { AuthContext } from '../../context/authContext';
import { Header } from 'antd/es/layout/layout'
import { useNavigate } from 'react-router-dom';
import { Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

export const NavBar = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const avatarImg = '';

    const avatarProps = avatarImg ? {
        src: avatarImg,
    } : {
        icon: <UserOutlined />,
    };

    const navigate = useNavigate();


    const handleLogout = () => {
        try {
            logout();
            navigate('/login');
        } catch (err) {
            console.log(err);
        }
    }

    const onClick = ({ key }) => {
        if (key === 'logout') {
            handleLogout()
        } else {
            navigate('/my-profile');
        }
    };

    const items = [
        {
            key: 'profile',
            label: 'My Profile',
            icon: (<UserOutlined />),
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: (<LogoutOutlined />),
        },
    ];
    return (
        <Header
            style={{
                padding: "0 3vb",
                backgroundColor: "#3B9FF7",
            }}
        >
            <div className='d-flex flex-row justify-content-end align-items-center' 
                style={{
                    height: 'inherit',
                    lineHeight: '1.25rem',
                }}>
                {/* <h6 className='m-0'>{currentUser.first_name}</h6> */}
                <h6 className='m-0 px-3' style={{
                    color: "#FEFEFA",
                    fontSize: "1.25rem",
                }}>Hi, User!</h6>
                <Dropdown menu={{ items, onClick }} placement="bottomRight">
                    <Avatar {...avatarProps} size='large' />
                </Dropdown>
            </div>
        </Header>
    )
}
