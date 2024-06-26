import { outLogin } from '@/services/ant-design-pro/api';
import { LogoutOutlined, MailOutlined, SyncOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { history, useModel } from '@umijs/max';
import { Avatar, Spin } from 'antd';
import { setAlpha } from '@ant-design/pro-components';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  setOpenApproval: (value: boolean) => void;
  setOpenMail: (value: boolean) => void;
};

const Name = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const nameClassName = useEmotionCss(({ token }) => {
    return {
      width: '70px',
      height: '48px',
      overflow: 'hidden',
      lineHeight: '48px',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      [`@media only screen and (max-width: ${token.screenMD}px)`]: {
        display: 'none',
      },
    };
  });

  return <span className={`${nameClassName} anticon`}>{currentUser?.username}</span>;
};

const AvatarLogo = () => {
  const { initialState } = useModel('@@initialState');
  //const { currentUser } = initialState  || {};

  const avatarClassName = useEmotionCss(({ token }) => {
    return {
      marginRight: '8px',
      color: token.colorPrimary,
      verticalAlign: 'top',
      background: setAlpha(token.colorBgContainer, 0.85),
      [`@media only screen and (max-width: ${token.screenMD}px)`]: {
        margin: 0,
      },
    };
  });

  return <Avatar size="small" className={avatarClassName} src={'https://imgupscaler.com/images/samples/animal-after.webp'} alt="avatar" />;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, setOpenApproval, setOpenMail }) => {


  const loginOut = async () => {
    await outLogin();
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;

    const redirect = urlParams.get('redirect');


    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
  };

  const actionClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s: any) => ({ ...s, currentUser: undefined }));
        });
        loginOut();
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={actionClassName}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser?.username) {
    return loading;
  }

  const menuItems = [
    ...(currentUser.role === 'EMPLOYEE'
      ? [
        {
          key: 'center',
          icon: <SyncOutlined />,
          label: 'Đổi mật khẩu',
          onClick: () => setOpenApproval(true),
        },

        {
          key: 'center',
          icon: <MailOutlined />,
          label: 'Đổi email',
          onClick: () => setOpenMail(true),
        },

      ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: onMenuClick,
    },
  ];

  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        // onClick: onMenuClick,
        items: menuItems
      }}
    >
      <span className={actionClassName}>
        <AvatarLogo />
        <Name />
      </span>
      
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
