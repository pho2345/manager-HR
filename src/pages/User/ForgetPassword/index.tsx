import Footer from '@/components/Footer';
import { login } from '@/services/ant-design-pro/api';
import {
  LockOutlined,
  UserOutlined,
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
import configText from '@/locales/configText';
const configDefaultText = configText;


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



  const handleSubmit = async (values: API.LoginParams) => {
    try {
      const msg = await login({ ...values, type })
     

    } catch (error) {
      const defaultLoginFailureMessage = configDefaultText['pages.login.failure'];
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
   
  };

  return (
    <div className={containerClassName}>
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
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
          submitter={{
            searchConfig: {
              submitText: "Xác nhận"
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
                label: "Quên mật khẩu"
              },
            
            ]}
          />

          {type === 'account' && (
            <>
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={"Email"}
                // {intl.formatMessage({
                //   id: 'pages.login.username.placeholder',
                //   defaultMessage: 'Username',
                // })}
                rules={[
                  {
                    required: true,
                    message: "Email"

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
           
            <a
              style={{
                float: 'right',
              }}
              
            >
              <Link to={'/user/login'}>Đăng nhập</Link>
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
