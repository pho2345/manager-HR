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
import { FormattedMessage, history, useIntl, useModel } from '@umijs/max';
import { Alert, message, Tabs } from 'antd';

import React, { useState } from 'react';
import { flushSync } from 'react-dom';

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
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
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

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s: any) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const msg = await login({ ...values, type });

      if (msg.jwt) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: 'Login succes',
        });
        localStorage.setItem('access_token', msg.jwt);
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
      console.log(msg);
      
      setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: 'Failure',
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  const { status, type: loginType } = userLoginState;

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
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: intl.formatMessage({
                  id: 'pages.login.accountLogin.tab',
                  defaultMessage: 'Login',
                }),
              },
              // {
              //   key: 'mobile',
              //   label: intl.formatMessage({
              //     id: 'pages.login.phoneLogin.tab',
              //     defaultMessage: 'Login Phone',
              //   }),
              // },
            ]}
          />

          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: 'Error Message',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="identifier"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: 'Username',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="Username required"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: 'Passwrod',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="Password required"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          {status === 'error' && loginType === 'mobile' && <LoginMessage content="Mobile" />}
          {type === 'mobile' && (
            // <>
            //   <ProFormText
            //     fieldProps={{
            //       size: 'large',
            //       prefix: <MobileOutlined />,
            //     }}
            //     name="mobile"
            //     placeholder={intl.formatMessage({
            //       id: 'pages.login.phoneNumber.placeholder',
            //       defaultMessage: 'Phone Number',
            //     })}
            //     rules={[
            //       {
            //         required: true,
            //         message: (
            //           <FormattedMessage
            //             id="pages.login.phoneNumber.required"
            //             defaultMessage="Phone Number required"
            //           />
            //         ),
            //       },
            //       {
            //         pattern: /^1\d{10}$/,
            //         message: (
            //           <FormattedMessage
            //             id="pages.login.phoneNumber.invalid"
            //             defaultMessage="Phone Number invalid"
            //           />
            //         ),
            //       },
            //     ]}
            //   />
            //   <ProFormCaptcha
            //     fieldProps={{
            //       size: 'large',
            //       prefix: <LockOutlined />,
            //     }}
            //     captchaProps={{
            //       size: 'large',
            //     }}
            //     placeholder={intl.formatMessage({
            //       id: 'pages.login.captcha.placeholder',
            //       defaultMessage: 'Captcha',
            //     })}
            //     captchaTextRender={(timing, count) => {
            //       if (timing) {
            //         return `${count} ${intl.formatMessage({
            //           id: 'pages.getCaptchaSecondText',
            //           defaultMessage: 'Get Captcha',
            //         })}`;
            //       }
            //       return intl.formatMessage({
            //         id: 'pages.login.phoneLogin.getVerificationCode',
            //         defaultMessage: 'Verifycation Code',
            //       });
            //     }}
            //     name="captcha"
            //     rules={[
            //       {
            //         required: true,
            //         message: (
            //           <FormattedMessage
            //             id="pages.login.captcha.required"
            //             defaultMessage="Captcha required"
            //           />
            //         ),
            //       },
            //     ]}
            //     onGetCaptcha={async (phone) => {
            //       const result = await getFakeCaptcha({
            //         phone,
            //       });
            //       if (!result) {
            //         return;
            //       }
            //       message.success('Success');
            //     }}
            //   />
            // </>
            <></>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
