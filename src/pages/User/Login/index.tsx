import Footer from '@/components/Footer';
import { login } from '@/services/ant-design-pro/api';
//import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import {
  //AlipayCircleOutlined,
  LockOutlined,//
  //MobileOutlined,
  // TaobaoCircleOutlined,
  UserOutlined,
  //WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,

  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Link, history, useModel } from '@umijs/max';
import { Alert, message, Tabs } from 'antd';

import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import configText from '@/locales/configText';
const configDefaultText = configText;

// const ActionIcons = () => {
//   const langClassName = useEmotionCss(({ token }) => {
//     return {
//       marginLeft: '8px',
//       color: 'rgba(0, 0, 0, 0.2)',
//       fontSize: '24px',
//       verticalAlign: 'middle',
//       cursor: 'pointer',
//       transition: 'color 0.3s',
//       '&:hover': {
//         color: token.colorPrimaryActive,
//       },
//     };
//   });

//   return (
//     <>
//       <AlipayCircleOutlined key="AlipayCircleOutlined" className={langClassName} />
//       <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={langClassName} />
//       <WeiboCircleOutlined key="WeiboCircleOutlined" className={langClassName} />
//     </>
//   );
// };

// const Lang = () => {
//   const langClassName = useEmotionCss(({ token }) => {
//     return {
//       width: 42,
//       height: 42,
//       lineHeight: '42px',
//       position: 'fixed',
//       right: 16,
//       borderRadius: token.borderRadius,
//       ':hover': {
//         backgroundColor: token.colorBgTextHover,
//       },
//     };
//   });

//   return (
//     <div className={langClassName} data-lang>
//       {SelectLang && <SelectLang />}
//     </div>
//   );
// };

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>();
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });


  const fetchUserInfo = async (currentUser: API.CurrentUser) => {
    console.log('currentUser', currentUser)
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s: any) => ({
          ...s,
          currentUser: currentUser,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      const msg = await login({ ...values, type })
      
      // await fetchUserInfo(msg);
      if (msg) {
        
        const defaultLoginSuccessMessage = configDefaultText['pages.login.successLogin']
        localStorage.setItem('access_token', msg?.data?.token || '');
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo(msg?.data as API.CurrentUser);
        const urlParams = new URL(window.location.href).searchParams;
        if(msg?.data?.role === 'ADMIN') {
          history.push(urlParams.get('redirect') || '/');
        }
        else {
          history.push('/profile/basic');
        }
        return;
      }

      setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = configDefaultText['pages.login.failure'];
      // intl.formatMessage({
      //   id: 'pages.login.failure',
      //   defaultMessage: 'Failure',
      // });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
   
  };
  // const { status, type: loginType } = userLoginState;

  return (
    <div className={containerClassName}>
      {/* <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: 'Login',
          })}
          - {Settings.title}
        </title>
      </Helmet> */}
      {/* <Lang /> */}
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          // logo={<img alt="logo" src="/logo.svg" />}
          // title="Ant Design"
          // subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          // initialValues={{
          //   autoLogin: true,
          // }}
          // actions={[
          //   <FormattedMessage
          //     key="loginWith"
          //     id="pages.login.loginWith"
          //     defaultMessage="Login With"
          //   />,
          //   <ActionIcons key="icons" />,
          // ]}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
          submitter={{
            searchConfig: {
              submitText: configDefaultText['pages.login.title']
            }
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: configDefaultText['pages.login.title']
              },
            
            ]}
          />

          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={configDefaultText['pages.login.accountLogin.username']}
                // {intl.formatMessage({
                //   id: 'pages.login.username.placeholder',
                //   defaultMessage: 'Username',
                // })}
                rules={[
                  {
                    required: true,
                    message: configDefaultText['pages.login.required.username']
                    // (
                    //   <FormattedMessage
                    //     id="pages.login.username.required"
                    //     defaultMessage="Username required"
                    //   />
                    // ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={configDefaultText['pages.login.accountLogin.password']}
                // {intl.formatMessage({
                //   id: 'pages.login.password.placeholder',
                //   defaultMessage: 'Passwrod',
                // })}
                rules={[
                  {
                    required: true,
                    message: configDefaultText['pages.login.required.password']
                    // (
                    //   <FormattedMessage
                    //     id="pages.login.password.required"
                    //     defaultMessage="Password required"
                    //   />
                    // ),
                  },
                ]}
              />
            </>
          )}

         
        
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              {/* <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" /> */}
              {configDefaultText['pages.login.accountLogin.remember']}
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
              
            >
              <Link to={'/user/forget-password'}>{configDefaultText['pages.login.accountLogin.forgetPassword']}</Link>
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
