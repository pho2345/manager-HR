
import { customAPIAdd, customAPIGetOne, customAPIUpdate, customAPIUpdateMany } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, PageContainer, ProColumns, ProDescriptions, ProFormDatePicker, ProFormSwitch, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, Link, } from '@umijs/max';
import { Button, Col, Drawer, Form, message, Modal, Row, Typography } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
const { Text } = Typography;
import configText from '@/locales/configText';
const configDefaultText = configText;


function sleeper(ms: number) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}



const DescriptionCustom = (props: any) => {
  return (<><ProDescriptions
    column={props.quantityColumns || 1}
    title='Thông tin Mega'
    // request={async () => {
    //   const getUser = await customAPIGetOne(props?.id, props.api);
    //   return {
    //     data: getUser,
    //     success: true
    //   }
    // }}
    // params={{
    //   id: props?.id
    // }}
    dataSource={props?.data}

    columns={props.columns}
  ></ProDescriptions>
  </>)
}

const DescriptionTabMega = (props: any) => {
  return (<>
    <ProDescriptions
      column={1}
      dataSource={props?.data}
      columns={props.columns}
    ></ProDescriptions>
    <ProDescriptions
      column={1}
      title='Tích lũy'

      dataSource={props.data}
      columns={props.columnsHistory}
    ></ProDescriptions>
  </>)
}

const handleUpdate = async (fields: any, api: string) => {
  const hide = message.loading('Đang sửa...');
  try {
    await customAPIUpdateMany({
      data: {
        ...fields
      }
    }, api, null);
    hide();

    message.success('Sửa thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Sửa thất bại!');
    return false;
  }
};


const handleDisabled = async (fields: any, api: string) => {
  const hide = message.loading('Đang xử lí...');
  try {
    const mess = await customAPIAdd({
      ...fields
    }, api);
    hide();

    message.success(mess.message);
    return true;
  } catch (error) {
    hide();
    message.error('Sửa thất bại!');
    return false;
  }
};

const getInformation = async (id: any) => {
  const getUser = await customAPIGetOne(id, 'users/aleger');
  return getUser;
}


const updateConfig = async (values: any, id: number) => {
  await customAPIUpdate({
    ...values
  }, 'users/aleger/notify', id);
}


const TableList = (props: any) => {
  const [detailUser, setDetailUser] = useState<any>();
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm<any>();
  const actionRef = useRef<ActionType>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<boolean>();
  const [notifyWG, setNotifyWG] = useState<boolean>();
  const [notifyEmail, setNotifyEmail] = useState<boolean>();



  const confirm = (entity: any, messageConfirm: string, api: string) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: messageConfirm,
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        try {

          await handleDisabled({
            ...entity
          }, api);

        } catch (error) {

        }

      }
    });
  };

  const columnDetailUser: ProColumns<any>[] = [
    {
      key: 'code',
      dataIndex: 'code',
      // title: <FormattedMessage id='pages.searchTable.column.id' defaultMessage='ID' />,
      title: configDefaultText['page.DetailAleger.column.id'],
      renderText: (_, record: any) => record.id
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.username' defaultMessage='Tên đăng nhập' />,
      title: configDefaultText['page.DetailAleger.column.id'],
      dataIndex: 'username',
      valueType: 'textarea',
      key: 'username',
      renderText: (_, record) => record.username
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.email' defaultMessage='email' />,
      title: configDefaultText['page.DetailAleger.column.email'],
      dataIndex: 'email',
      valueType: 'textarea',
      key: 'email',
      renderText: (_, record) => record.email
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.fullname' defaultMessage='Tên đầy đủ' />,
      title: configDefaultText['page.DetailAleger.column.fullname'],
      dataIndex: 'fullname',
      valueType: 'textarea',
      key: 'fullname',
      renderText: (_, record) => record.fullname
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.phone' defaultMessage='Số điện thoại' />,
      title: configDefaultText['page.DetailAleger.column.phone'],
      dataIndex: 'phone',
      valueType: 'textarea',
      key: 'phone',
      renderText: (_, record) => record.phone
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.passport' defaultMessage='CCCD/HC' />,
      title: configDefaultText['page.DetailAleger.column.passport'],
      dataIndex: 'passport',
      valueType: 'textarea',
      key: 'passport',
      renderText: (_, record) => record?.passport
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.address' defaultMessage='Địa chỉ' />,
      title: configDefaultText['page.DetailAleger.column.address'],
      dataIndex: 'address',
      valueType: 'textarea',
      key: 'address',
      renderText: (_, record) => record?.address
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.birthdate' defaultMessage='Ngày sinh' />,
      title: configDefaultText['page.DetailAleger.column.birthdate'],
      dataIndex: 'birthdate',
      valueType: 'textarea',
      key: 'birthdate',
      renderText: (_, record: any) => record.birthdate ? moment(record?.birthdate).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY') : null
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.sex' defaultMessage='Giới tính' />,
      title: configDefaultText['page.DetailAleger.column.sex'],
      dataIndex: 'sex',
      valueType: 'textarea',
      key: 'sex',
      render: (_, record) => {
        switch (record?.sex) {
          case 'male':
            return (<><Text>Name</Text></>)
            break;
          case 'female':
            return (<><Text>Nữ</Text></>)
            break;
          default:
            return (<><Text>Khác</Text></>)
            break;
        }
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.firebaseUid' defaultMessage='Firebase UID' />,
      title: configDefaultText['page.DetailAleger.column.firebaseUid'],
      dataIndex: 'firebaseUid',
      valueType: 'textarea',
      key: 'firebaseUid',
      renderText: (_, record) => record?.firebaseUid
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.bank' defaultMessage='Tài khoản ngân hàng' />,
      title: configDefaultText['page.DetailAleger.column.bank'],
      dataIndex: 'bank',
      valueType: 'textarea',
      key: 'bank',
      renderText: (_, record) => record?.bank
    },

    {
      title: '',
      dataIndex: 'edit',
      valueType: 'textarea',
      key: 'edit',
      render: (_, record) => {
        return (<><Button
            onClick={() => {
              handleUpdateModalOpen(true);
              form.setFieldsValue({
                ...detailUser?.user
              })
            }}
          >Sửa Thông tin</Button>
          <Button
            type="primary"
            style={{
              marginLeft: '10px'
            }}
            onClick={() => confirm({
              userId: record?.id
            }, configDefaultText['page.DetailAleger.column.textConfirmDisable'], 'users/disabled')} danger
          >{record?.disabled ? configDefaultText['page.DetailAleger.column.openDisabled'] : configDefaultText['page.DetailAleger.column.disabled']}</Button></>)
        
      }
    },

  ];

  const columnDetailUserAle: ProColumns<any>[] = [

    {
      // title: <FormattedMessage id='pages.searchTable.column.ale' defaultMessage='Số dư ale' />,
      title: configDefaultText['page.DetailAleger.column.ale'],
      dataIndex: 'ale',
      valueType: 'textarea',
      key: 'ale',
      renderText: (_, text) => text?.ale.toLocaleString()
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.quantityAleRecharge' defaultMessage='Số ale đã nạp' />,
      title: configDefaultText['page.DetailAleger.column.quantityAleRecharge'],
      dataIndex: 'quantityAleRecharge',
      valueType: 'textarea',
      key: 'quantityAleRecharge',
      renderText: (_, text) => text?.quantityAleRecharge.toLocaleString()
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.aleUsed' defaultMessage='Số ale đã dùng' />,
      title: configDefaultText['page.DetailAleger.column.aleUsed'],
      dataIndex: 'aleUsed',
      valueType: 'textarea',
      key: 'aleUsed',
      renderText: (_, text) => text?.aleUsed.toLocaleString()
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage='ProduceAle' />,
      title: configDefaultText['page.DetailAleger.column.produceAle'],
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'produceAle',
      renderText: (_, text) => text?.produceAle.toLocaleString()
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.promoAle' defaultMessage='promoAle' />,
      title: configDefaultText['page.DetailAleger.column.promoAle'],
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'promoAle',
      renderText: (_, text) => text?.promoAle.toLocaleString()
    },
    {
      title: '',
      dataIndex: 'edit',
      valueType: 'textarea',
      key: 'edit',
      render: (_, record) => {
        return <Button>
          <Link to={`/web-aleger/mega/my-ale/` + record?.id}>{configDefaultText['page.DetailAleger.column.textTransactionAle']}</Link>
        </Button>
      }
    },

  ];

  const columnDetailUserMegaCurrent: ProColumns<any>[] = [
    {
      // title: <FormattedMessage id='pages.searchTable.column.totalCPassCurrent' defaultMessage='Tổng cPass Mega sở hữu' />,
      title: configDefaultText['page.DetailAleger.column.totalCPassCurrent'],
      dataIndex: 'totalCPassCurrent',
      valueType: 'textarea',
      key: 'totalCPassCurrent',
      renderText: (_, text) => text?.totalCPassCurrent?.toLocaleString() || 0
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.megaDeltaWeightCurrent' defaultMessage='Tổng tăng trọng tích lũy MegaΔP (kg)' />,
      title: configDefaultText['page.DetailAleger.column.megaDeltaWeightCurrent'],
      dataIndex: 'megaDeltaWeightCurrent',
      valueType: 'textarea',
      key: 'megaDeltaWeightCurrent',
      renderText: (_, text) => text?.megaDeltaWeightCurrent?.toLocaleString() || 0
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.produceAleCurrent' defaultMessage='Tổng ProduceAle đã chuyển đổi từ MegaΔP' />,
      title: configDefaultText['page.DetailAleger.column.megaDeltaWeightCurrent'],
      dataIndex: 'produceAleCurrent',
      valueType: 'textarea',
      key: 'megaWeightCurrent',
      renderText: (_, text) => text?.megaWeightCurrent?.toLocaleString() || 0
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.megaWeightCurrent' defaultMessage=' Tổng trọng lượng MegaP (kg)' />,
      title: configDefaultText['page.DetailAleger.column.megaDeltaWeightCurrent'],
      dataIndex: 'megaWeightCurrent',
      valueType: 'textarea',
      key: 'megaWeightCurrent',
      renderText: (_, text) => text?.megaWeightCurrent.toLocaleString()
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.megaECurrent' defaultMessage='Tổng giá trị tài sản MegaE (VNĐ)' />,
      title: configDefaultText['page.DetailAleger.column.megaECurrent'],
      dataIndex: 'megaECurrent',
      valueType: 'textarea',
      key: 'megaECurrent',
      renderText: (_, text) => text?.megaECurrent.toLocaleString()
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.megaCPRCurrent' defaultMessage='Tỷ suất lợi nhuận tích lũy MegaCPR (%)' />,
      title: configDefaultText['page.DetailAleger.column.megaECurrent'],
      dataIndex: 'megaCPRCurrent',
      valueType: 'textarea',
      key: 'megaCPRCurrent',
      renderText: (_, text) => text?.megaCPRCurrent
    },

  ];

  const columnDetailUserMegaHistory: ProColumns<any>[] = [
    {
      // title: <FormattedMessage id='pages.searchTable.column.totalCPassHistory' defaultMessage='Tổng cPass Mega sở hữu' />,
      title: configDefaultText['page.DetailAleger.column.totalCPassHistory'],
      dataIndex: 'totalCPassHistory',
      valueType: 'textarea',
      key: 'totalCPassHistory',
      renderText: (_, text) => text?.totalCPassHistory
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.megaDeltaWeightHistory' defaultMessage='Tổng tăng trọng tích lũy MegaΔP (kg)' />,
      title: configDefaultText['page.DetailAleger.column.megaDeltaWeightHistory'],
      dataIndex: 'megaDeltaWeightHistory',
      valueType: 'textarea',
      key: 'megaDeltaWeightHistory',
      renderText: (_, text) => text?.megaDeltaWeightHistory
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.produceAleHistory' defaultMessage='Tổng ProduceAle đã chuyển đổi từ MegaΔP' />,
      title: configDefaultText['page.DetailAleger.column.produceAleHistory'],
      dataIndex: 'produceAleHistory',
      valueType: 'textarea',
      key: 'megaWeightHistory',
      renderText: (_, text) => text?.megaWeightHistory
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.megaWeightHistory' defaultMessage='Tổng trọng lượng MegaP (kg)' />,
      title: configDefaultText['page.DetailAleger.column.megaWeightHistory'],
      dataIndex: 'megaWeightHistory',
      valueType: 'textarea',
      key: 'megaWeightHistory',
      renderText: (_, text) => text?.megaWeightHistory
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.megaEHistory' defaultMessage='Tổng giá trị tài sản MegaE (VNĐ)' />,
      title: configDefaultText['page.DetailAleger.column.megaEHistory'],
      dataIndex: 'megaEHistory',
      valueType: 'textarea',
      key: 'megaEHistory',
      renderText: (_, text) => text?.megaEHistory.toLocaleString()
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.megaCPRHistory' defaultMessage='Tỷ suất lợi nhuận tích lũy MegaCPR (%)' />,
      title: configDefaultText['page.DetailAleger.column.megaCPRHistory'],
      dataIndex: 'megaCPRHistory',
      valueType: 'textarea',
      key: 'megaCPRHistory',
      renderText: (_, text) => text?.megaCPRHistory
    },
    {
      title: '',
      dataIndex: 'edit',
      valueType: 'textarea',
      key: 'edit',
      render: (_, record) => {
        console.log(record);
        return <Button><Link to={`/web-aleger/mega/my-c-pass/` + record?.id}> My cPass
        </Link></Button>
      }
    },
  ];

  const columnDetailUserMegaConfig: ProColumns<any>[] = [
    {
      title: '',
      dataIndex: 'notification',
      valueType: 'textarea',
      key: 'notification',
      render: (_, text) => <ProFormSwitch label='Cho phép thông báo đẩy:' fieldProps={{
        checked: notification,
        onChange: (values) => {
          setNotification(values);
        }
      }} />
    },

    {
      title: '',
      dataIndex: 'report',
      valueType: 'textarea',
      key: 'report',
      render: (_, text) => <ProFormSwitch label='Nhận báo cáo tăng trọng định kỳ:' fieldProps={{
        checked: notifyWG,
        onChange: async (values) => {
          setNotifyWG(values);
          await sleeper(3000);
          updateConfig({
            notifyWG: values
          }, props?.currentRowUser);
        }
      }} />
    },

    {
      title: '',
      dataIndex: 'notificationEmail',
      valueType: 'textarea',
      key: 'notificationEmail',
      render: (_, text) => <ProFormSwitch label='Nhận thông báo bằng email:' fieldProps={{
        checked: notifyEmail,
        onChange: async (values) => {
          setNotifyEmail(values);
          await sleeper(3000);
          updateConfig({
            notifyEmail: values

          }, props?.currentRowUser);
        }
      }} />
    },

    {
      title: '',
      dataIndex: 'edit',
      valueType: 'textarea',
      key: 'edit',
      render: (_, record) => {
        return <Button
          onClick={() => {
            handleModalOpen(true);

          }}
        >{configDefaultText['page.DetailAleger.column.newAccount']}</Button>
      }
    },
  ];




  useEffect(() => {
    const getData = async () => {
      const getInfor = await getInformation(props?.currentRowUser);
      setDetailUser(getInfor);
      setNotification(getInfor?.config?.notification);
      setNotifyEmail(getInfor?.config?.notifyEmail);
      setNotifyWG(getInfor?.config?.notifyWG);
    }
    getData();
  }, [props?.currentRowUser]);

  // useEffect(() => {
  //   const getData = async () => {
  //     await updateConfig({
  //       notification, notifyEmail, notifyWG
  //     },  props?.currentRowUser);
  //   }
  //   getData();
  // }, [notification, notifyEmail, notifyWG]);

  return (
    <>
      <Drawer
        width={600}
        open={props.onDetail}
        onClose={() => {
          return props.onCloseDetail();
        }}
        closable={false}
      >
        <PageContainer
          tabList={[
            {
              tab: configDefaultText['page.DetailAleger.tab.information'],
              key: '1',
              children: DescriptionCustom({
                columns: columnDetailUser,
                data: detailUser?.user,
                //id: props?.currentRowUser,
                //api: 'users/find-admin'
              })
            },
            {
              tab: configDefaultText['page.DetailAleger.tab.ale'],
              key: '2',
              children: DescriptionCustom({
                columns: columnDetailUserAle,
                data: detailUser?.ale
                //id: props?.ale,
                //api: 'users/find-admin'
              })
            },

            {
              tab: configDefaultText['page.DetailAleger.tab.mega'],
              key: '3',
              children: DescriptionTabMega({
                columns: columnDetailUserMegaCurrent,
                columnsHistory: columnDetailUserMegaHistory,
                data: detailUser?.mega
                //id: props?.currentRowUser,
                //api: 'users/aleger'
              })
            },

            {
              tab: configDefaultText['page.DetailAleger.tab.config'],
              key: '4',
              children: DescriptionCustom({
                columns: columnDetailUserMegaConfig,
                data: detailUser?.config,
                //id: props?.currentRowUser,
                //api: 'users/find-admin'
                //quantityColumns: 2
              })
            },
          ]}
        />

        <ModalForm
          title="Tạo mới"
          open={createModalOpen}
          form={form}
          autoFocusFirstInput
          modalProps={{
            destroyOnClose: true,
            onCancel: () => {
              handleModalOpen(false)
            },
          }}
          submitTimeout={2000}
          onFinish={async (values) => {

            if (actionRef.current) {
              actionRef.current.reload();

            }
          }
          }

          submitter={{
            // render: (_, dom) => (
            //   <div style={{ marginBlockStart: '5vh' }}>
            //     {dom.pop()}
            //     {dom.shift()}
            //   </div>
            // ),
            searchConfig: {
              // resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
              // submitText: <FormattedMessage id='buttonAdd' defaultMessage='Thêm' />,
              resetText: configDefaultText['buttonClose'],
              submitText: configDefaultText['buttonAdd'],
            },
          }}
        >
          <Row gutter={24} className="m-0">
            <Col span={24} className="gutter-row p-0" >

            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormText
                className='w-full'
                name='fullname'
                // label={<FormattedMessage id='pages.detailMega.fullname' defaultMessage='Nhập họ tên' />}
                label={configDefaultText['page.DetailAleger.form.fullname']}
                placeholder={configDefaultText['page.DetailAleger.form.fullname']}
                rules={[
                  // { required: true, message: <FormattedMessage id='pages.detailMega.required.fullname' defaultMessage='Vui lòng nhập họ tên' /> },
                  { required: true, message: configDefaultText['page.DetailAleger.form.required.fullname'] },
                ]}
              />
            </Col>

            <Col span={12} className="gutter-row p-0" >
              <ProFormText
                className='w-full'
                name='email'
                // label={<FormattedMessage id='pages.detailMega.email' defaultMessage='Email' />}
                // placeholder='Nhập email'
                label={configDefaultText['page.DetailAleger.form.email']}
                placeholder={configDefaultText['page.DetailAleger.form.email']}
                rules={[
                  // { required: true, message: <FormattedMessage id='pages.detailMega.required.fullname' defaultMessage='Vui lòng nhập họ tên' /> },
                  { required: true, message: configDefaultText['page.DetailAleger.form.required.email'] },
                ]}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormText
                className='w-full'
                name='username'
                // label={<FormattedMessage id='pages.detailMega.username' defaultMessage='Nhập username' />}
                // placeholder='Nhập username'
                label={configDefaultText['page.DetailAleger.form.username']}
                placeholder={configDefaultText['page.DetailAleger.form.username']}
                rules={[
                  // { required: true, message: <FormattedMessage id='pages.detailMega.required.username' defaultMessage='Vui lòng nhập username' /> },
                  { required: true, message: configDefaultText['page.DetailAleger.form.required.username'] },
                ]}
              />
            </Col>

            <Col span={12} className="gutter-row p-0" >
              <ProFormText
                className='w-full'
                name='phone'
                // label={<FormattedMessage id='pages.detailMega.phone' defaultMessage='Số điện thoại' />}
                // placeholder='Nhập số điện thoại'
                label={configDefaultText['page.DetailAleger.form.phone']}
                placeholder={configDefaultText['page.DetailAleger.form.phone']}
                rules={[
                  // { required: true, message: <FormattedMessage id='pages.detailMega.required.phone' defaultMessage='Vui lòng nhập số điện thoại' /> },
                  { required: true, message: configDefaultText['page.DetailAleger.form.required.phone'] },
                ]}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormText
                className='w-full'
                name='password'
                // label={<FormattedMessage id='pages.detailMega.password' defaultMessage='Password' />}
                // placeholder='Nhập password'
                label={configDefaultText['page.DetailAleger.form.password']}
                placeholder={configDefaultText['page.DetailAleger.form.password']}
                rules={[
                  // { required: true, message: <FormattedMessage id='pages.detailMega.required.password' defaultMessage='Vui lòng nhập mật khẩu' /> },
                  { required: true, message: configDefaultText['page.DetailAleger.form.required.password'] },
                ]}
              />
            </Col>

            <Col span={12} className="gutter-row p-0" >
              <ProFormText
                className='w-full'
                name='confirmPassword'
                // label={<FormattedMessage id='pages.detailMega.confirmPassword' defaultMessage='Xác nhận password' />}
                // placeholder='Nhập password'
                label={configDefaultText['page.DetailAleger.form.confirmPassword']}
                placeholder={configDefaultText['page.DetailAleger.form.confirmPassword']}
                rules={[
                  // { required: true, message: <FormattedMessage id='pages.detailMega.required.confirmPassword' defaultMessage='Vui lòng nhập lại mật khẩu' /> },
                  { required: true, message: configDefaultText['page.DetailAleger.form.required.confirmPassword'] },
                ]}
              />
            </Col>
          </Row>


          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >


              <ProFormText
                className='w-full'
                name='address'
                // label={<FormattedMessage id='pages.detailMega.address' defaultMessage='Địa chỉ' />}
                // placeholder='Nhập địa chỉ'
                label={configDefaultText['page.DetailAleger.form.address']}
                placeholder={configDefaultText['page.DetailAleger.form.address']}
                rules={[
                  // { required: true, message: <FormattedMessage id='pages.detailMega.required.address' defaultMessage='Vui lòng nhập địa chỉ' /> },
                  { required: true, message: configDefaultText['page.DetailAleger.form.required.address'] },
                ]}
              />
            </Col>

            <Col span={12} className="gutter-row p-0" >
              <ProFormText
                className='w-full'
                name='passport'
                // label={<FormattedMessage id='pages.detailMega.passport' defaultMessage='CCCD/HC' />}
                // placeholder='Nhập số CCCD/HC'
                label={configDefaultText['page.DetailAleger.form.passport']}
                placeholder={configDefaultText['page.DetailAleger.form.passport']}
                rules={[
                  // { required: true, message: <FormattedMessage id='pages.detailMega.required.confirmPassword' defaultMessage='Vui lòng nhập số CCCD/HC' /> },
                  { required: true, message: configDefaultText['page.DetailAleger.form.required.passport'] },
                ]}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormDatePicker
                 fieldProps={{
                  style:{
                    width: '100%' 
                  }
                }}
                name='birthdate'
                // placeholder={`Ngày sinh`}
                // label={<FormattedMessage id='pages.detailMega.birthdate' defaultMessage='Ngày sinh' />}
                label={configDefaultText['page.DetailAleger.form.birthdate']}
                placeholder={configDefaultText['page.DetailAleger.form.birthdate']}
                rules={[
                  // { required: true, message: <FormattedMessage id='pages.detailMega.required.birthdate' defaultMessage='Vui lòng chọn ngày sinh' /> },
                  { required: true, message: configDefaultText['page.DetailAleger.form.required.birthdate'] },
                ]}
              />
            </Col>
          </Row>


        </ModalForm>

        <ModalForm
          title='Cập nhật'
          open={updateModalOpen}
          form={form}
          autoFocusFirstInput
          modalProps={{
            destroyOnClose: true,
            onCancel: () => {
              handleUpdateModalOpen(false)
            },
          }}
          submitTimeout={2000}
          onFinish={async (values) => {
            //await waitTime(2000);
            values.userId = props?.currentRowUser
            const success = await handleUpdate(values, 'users/update');
            if (success) {
              props.onReset();
              props.onCloseDetail();
              handleUpdateModalOpen(false);
              form.resetFields();
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
            return true;
          }}
          submitter={{
            // render: (_, dom) => (
            //   <div style={{ marginBlockStart: '5vh' }}>
            //     {dom.pop()}
            //     {dom.shift()}
            //   </div>
            // ),
            searchConfig: {
              // resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
              // submitText: <FormattedMessage id='buttonUpdate' defaultMessage='Update' />,
              resetText: configDefaultText['buttonClose'],
              submitText: configDefaultText['buttonUpdate'],
            },
          }}

        >


          <Row gutter={24} className="m-0">
            <Col span={8} className="gutter-row p-0" >
              <ProFormText
                className='w-full'
                name='fullname'
                // label={<FormattedMessage id='pages.detailMega.fullname' defaultMessage='Nhập họ tên' />}
                label={configDefaultText['page.DetailAleger.form.fullname']}
                placeholder={configDefaultText['page.DetailAleger.form.fullname']}
                rules={[
                  // { required: true, message: <FormattedMessage id='pages.detailMega.required.fullname' defaultMessage='Vui lòng nhập họ tên' /> },
                  { required: true, message: configDefaultText['page.DetailAleger.form.required.fullname'] },
                ]}
              />
            </Col>

            <Col span={8} className="gutter-row p-0" >
              <ProFormText
                className='w-full'
                name='email'
                // label={<FormattedMessage id='pages.detailMega.email' defaultMessage='Email' />}
                // placeholder='Nhập email'
                label={configDefaultText['page.DetailAleger.form.email']}
                placeholder={configDefaultText['page.DetailAleger.form.email']}
                rules={[
                  // { required: true, message: <FormattedMessage id='pages.detailMega.required.fullname' defaultMessage='Vui lòng nhập họ tên' /> },
                  { required: true, message: configDefaultText['page.DetailAleger.form.required.email'] },
                ]}
              />
            </Col>

            <Col span={8} className="gutter-row p-0" >
              <ProFormText
                className='w-full'
                name='phone'
                // label={<FormattedMessage id='pages.detailMega.phone' defaultMessage='Số điện thoại' />}
                // placeholder='Nhập số điện thoại'
                label={configDefaultText['page.DetailAleger.form.phone']}
                placeholder={configDefaultText['page.DetailAleger.form.phone']}
                rules={[
                  // { required: true, message: <FormattedMessage id='pages.detailMega.required.phone' defaultMessage='Vui lòng nhập số điện thoại' /> },
                  { required: true, message: configDefaultText['page.DetailAleger.form.required.phone'] },
                ]}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={8} className="gutter-row p-0" >
              <ProFormText
                className='w-full'
                name='address'
                // label={<FormattedMessage id='pages.detailMega.address' defaultMessage='Địa chỉ' />}
                // placeholder='Nhập địa chỉ'
                label={configDefaultText['page.DetailAleger.form.address']}
                placeholder={configDefaultText['page.DetailAleger.form.address']}
                rules={[
                  // { required: true, message: <FormattedMessage id='pages.detailMega.required.address' defaultMessage='Vui lòng nhập địa chỉ' /> },
                  { required: true, message: configDefaultText['page.DetailAleger.form.required.address'] },
                ]}
              />
            </Col>

            <Col span={8} className="gutter-row p-0" >
            <ProFormText
                className='w-full'
                name='passport'
                // label={<FormattedMessage id='pages.detailMega.passport' defaultMessage='CCCD/HC' />}
                // placeholder='Nhập số CCCD/HC'
                label={configDefaultText['page.DetailAleger.form.passport']}
                placeholder={configDefaultText['page.DetailAleger.form.passport']}
                rules={[
                  // { required: true, message: <FormattedMessage id='pages.detailMega.required.confirmPassword' defaultMessage='Vui lòng nhập số CCCD/HC' /> },
                  { required: true, message: configDefaultText['page.DetailAleger.form.required.passport'] },
                ]}
              />
            </Col>

            {/* <Col span={8} className="gutter-row p-0" >
              <ProFormText
                className='w-full'
                name='bank'
                label={configDefaultText['page.DetailAleger.form.bank']}
                placeholder={configDefaultText['page.DetailAleger.form.bank']}
                rules={[
                  // { required: true, message: <FormattedMessage id='pages.detailMega.required.bank' defaultMessage='Vui lòng nhập STK' /> },
                  { required: true, message: configDefaultText['page.DetailAleger.form.required.bank'] },
                ]}
              />
            </Col> */}
          </Row>


          <Row gutter={24} className="m-0">
            <Col span={8} className="gutter-row p-0" >
            <ProFormDatePicker
                 fieldProps={{
                  style:{
                    width: '100%' 
                  }
                }}
                name='birthdate'
                // placeholder={`Ngày sinh`}
                // label={<FormattedMessage id='pages.detailMega.birthdate' defaultMessage='Ngày sinh' />}
                label={configDefaultText['page.DetailAleger.form.birthdate']}
                placeholder={configDefaultText['page.DetailAleger.form.birthdate']}
                rules={[
                  // { required: true, message: <FormattedMessage id='pages.detailMega.required.birthdate' defaultMessage='Vui lòng chọn ngày sinh' /> },
                  { required: true, message: configDefaultText['page.DetailAleger.form.required.birthdate'] },
                ]}
              />
            </Col>

            <Col span={8} className="gutter-row p-0" >
              <ProFormDatePicker
                 fieldProps={{
                  style:{
                    width: '100%' 
                  }
                }}
                name='createdAt'
                placeholder={`Ngày tạo`}
                label={<FormattedMessage id='pages.detailMega.createdAt' defaultMessage='Ngày tạo' />}
                disabled
              />
            </Col>

            <Col span={8} className="gutter-row p-0" >

            </Col>
          </Row>

        </ModalForm>
      </Drawer>

    </>
  );
};

export default TableList;
