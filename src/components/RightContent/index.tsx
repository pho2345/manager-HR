import { useEmotionCss } from '@ant-design/use-emotion-css';
import { useModel } from '@umijs/max';
import React, { memo } from 'react';
import Avatar from './AvatarDropdown';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Col, Row, Form, FormInstance, message } from 'antd';
import { patch } from '@/services/ant-design-pro/api';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const className = useEmotionCss(() => {
    return {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      gap: 8,
    };
  });

  const actionClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      float: 'right',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      cursor: 'pointer',
      padding: '0 12px',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const [openApproval, setOpenApproval] = React.useState(false);
  const [openMail, setOpenMail] = React.useState(false);
  const [form] = Form.useForm<FormInstance>();

  const handleChangePassword = async ({ password, rePassword }: any) => {
    try {
      if (password !== rePassword) {
        message.error('Mật khẩu không trùng khớp');
        return false;
      }

      const changedPassword = await patch(`${SERVER_URL_CONFIG}/ca-nhan/tai-khoan/doi-mat-khau`, {
        matkhau: password,
      });

      if (changedPassword) {
        message.success('Đổi mật khẩu thành công');
        setOpenApproval(false);
        return true;
      }
    } catch (error) {
      message.error('Thất bại');
      return false;
    }
  }


  
  const handleChangeMail = async ({ mail }: any) => {
    try {
    

      const changedMail = await patch(`${SERVER_URL_CONFIG}/ca-nhan/tai-khoan/doi-email`, {
        email: mail,
      });

      if (changedMail) {
        message.success('Đổi mail thành công');
        setOpenMail(false);
        return true;
      }
    } catch (error) {
      message.error('Thất bại');
      return false;
    }
  }




  return (
    <div className={className}>
      {/* <span
        className={actionClassName}
        // onClick={() => {
        //   window.open('https://pro.ant.design/docs/getting-started');
        // }}
      >
        <QuestionCircleOutlined /> 
      </span> */}
      <Avatar setOpenApproval={setOpenApproval} setOpenMail={setOpenMail} />

      <ModalForm
        title={'Đổi mật khẩu'}
        form={form}
        width={window.innerWidth * 0.3}
        open={openApproval}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setOpenApproval(false);
          },
        }}
        onFinish={handleChangePassword}

        submitter={{
          searchConfig: {
            resetText: "Đóng",
            submitText: "Xác nhận",
          },
        }}
      >
        <Row gutter={24} >
          <Col span={24} >
            <ProFormText.Password
              label={"Mật khẩu mới"}
              fieldProps={{
                // variant: 'outlined',
                minLength: 6,
              }}
              name='password'
              placeholder={`Mật khẩu`}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu mới"
                },
              ]}
            />
          </Col>
          <Col span={24} >
            <ProFormText.Password
              label={"Nhập lại mật khẩu mới"}
              fieldProps={{
                // variant: 'outlined',
                minLength: 6,
              }}

              name='rePassword'
              placeholder={`Nhập lại mật khẩu mới`}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập lại mật khẩu mới"
                },
              ]}
            />
          </Col>
        </Row>
      </ModalForm>

      <ModalForm
        title={'Đổi email'}
        form={form}
        width={window.innerWidth * 0.3}
        open={openMail}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setOpenApproval(false);
          },
        }}
        onFinish={handleChangeMail}

        submitter={{
          searchConfig: {
            resetText: "Đóng",
            submitText: "Xác nhận",
          },
        }}
      >
        <Row gutter={24} >
          <Col span={24} >
            <ProFormText
              label={"Email mới"}
              fieldProps={{
                // variant: 'outlined',
              
              }}
             
              name='mail'
              placeholder={`Email mới`}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email mới"
                },
              ]}
            />
          </Col>
        </Row>
      </ModalForm>
      {/* <SelectLang className={actionClassName} /> */}
    </div>
  );
};
export default memo(GlobalHeaderRight);
