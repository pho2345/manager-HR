
import { customAPIAdd, customAPIGetOne, customAPIUpdate, customAPIUpdateMany } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, PageContainer, ProColumns, ProDescriptions, ProForm, ProFormDatePicker, ProFormSwitch, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, Link, } from '@umijs/max';
import { Button, Drawer, Form, message, Modal, Typography } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
const { Text } = Typography;

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


const updateConfig = async (values: any,id: number) => {
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
      title: <FormattedMessage id='pages.searchTable.column.id' defaultMessage='ID' />,
      renderText: (_, record: any) => record.id
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.username' defaultMessage='Tên đăng nhập' />,
      dataIndex: 'username',
      valueType: 'textarea',
      key: 'username',
      renderText: (_, record) => record.username
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.email' defaultMessage='Email' />,
      dataIndex: 'email',
      valueType: 'textarea',
      key: 'email',
      renderText: (_, record) => record.email
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.fullname' defaultMessage='Tên đầy đủ' />,
      dataIndex: 'fullname',
      valueType: 'textarea',
      key: 'fullname',
      renderText: (_, record) => record.fullname
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.phone' defaultMessage='Số điện thoại' />,
      dataIndex: 'phone',
      valueType: 'textarea',
      key: 'phone',
      renderText: (_, record) => record.phone
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.passport' defaultMessage='CCCD/HC' />,
      dataIndex: 'passport',
      valueType: 'textarea',
      key: 'passport',
      renderText: (_, record) => record?.passport
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.address' defaultMessage='Địa chỉ' />,
      dataIndex: 'address',
      valueType: 'textarea',
      key: 'address',
      renderText: (_, record) => record?.address
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.birthdate' defaultMessage='Ngày sinh' />,
      dataIndex: 'birthdate',
      valueType: 'textarea',
      key: 'birthdate',
      renderText: (_, record: any) => record.birthdate ? moment(record?.birthdate).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY') : null
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.sex' defaultMessage='Giới tính' />,
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
      title: <FormattedMessage id='pages.searchTable.column.firebaseUid' defaultMessage='Firebase UID' />,
      dataIndex: 'firebaseUid',
      valueType: 'textarea',
      key: 'firebaseUid',
      renderText: (_, record) => record?.firebaseUid
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.bank' defaultMessage='Tài khoản ngân hàng' />,
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
        return [
          (<><Button
            onClick={() => {
              handleUpdateModalOpen(true);
              form.setFieldsValue({
                ...detailUser?.user
              })
            }}
          >Sửa Thông tin</Button></>),
          (<><Button
            type="primary"
            onClick={() => confirm({
              userId: record?.id
            }, `Chắc chắn muốn vô hiệu tài khoản của Aleger `, 'users/disabled')} danger
          >{record?.disabled ? `Mở vô hiệu hóa` : 'Vô hiệu hóa'}</Button></>)
        ]
      }
    },

  ];

  const columnDetailUserAle: ProColumns<any>[] = [

    {
      title: <FormattedMessage id='pages.searchTable.column.ale' defaultMessage='Số dư ale' />,
      dataIndex: 'ale',
      valueType: 'textarea',
      key: 'ale',
      renderText: (_, text) => text?.ale
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.quantityAleRecharge' defaultMessage='Số ale đã nạp' />,
      dataIndex: 'quantityAleRecharge',
      valueType: 'textarea',
      key: 'quantityAleRecharge',
      renderText: (_, text) => text?.quantityAleRecharge
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.aleUsed' defaultMessage='Số ale đã dùng' />,
      dataIndex: 'aleUsed',
      valueType: 'textarea',
      key: 'aleUsed',
      renderText: (_, text) => text?.aleUsed
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage='ProduceAle' />,
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'produceAle',
      renderText: (_, text) => text?.produceAle
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.promoAle' defaultMessage='promoAle' />,
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'promoAle',
      renderText: (_, text) => text?.promoAle
    },
    {
      title: '',
      dataIndex: 'edit',
      valueType: 'textarea',
      key: 'edit',
      render: (_, record) => {
        return <Button>
          <Link to={`/web-aleger/mega/my-ale/` + record?.id}>Giao dịch Ale</Link>
        </Button>
      }
    },

  ];

  const columnDetailUserMegaCurrent: ProColumns<any>[] = [
    {
      title: <FormattedMessage id='pages.searchTable.column.totalCPassCurrent' defaultMessage='Tổng cPass Mega sở hữu' />,
      dataIndex: 'totalCPassCurrent',
      valueType: 'textarea',
      key: 'totalCPassCurrent',
      renderText: (_, text) => text?.totalCPassCurrent
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.megaDeltaWeightCurrent' defaultMessage='Tổng tăng trọng tích lũy MegaΔP (kg)' />,
      dataIndex: 'megaDeltaWeightCurrent',
      valueType: 'textarea',
      key: 'megaDeltaWeightCurrent',
      renderText: (_, text) => text?.megaDeltaWeightCurrent
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.produceAleCurrent' defaultMessage='Tổng ProduceAle đã chuyển đổi từ MegaΔP' />,
      dataIndex: 'produceAleCurrent',
      valueType: 'textarea',
      key: 'megaWeightCurrent',
      renderText: (_, text) => text?.megaWeightCurrent
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.megaWeightCurrent' defaultMessage=' Tổng trọng lượng MegaP (kg)' />,
      dataIndex: 'megaWeightCurrent',
      valueType: 'textarea',
      key: 'megaWeightCurrent',
      renderText: (_, text) => text?.megaWeightCurrent
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.megaECurrent' defaultMessage='Tổng giá trị tài sản MegaE (VNĐ)' />,
      dataIndex: 'megaECurrent',
      valueType: 'textarea',
      key: 'megaECurrent',
      renderText: (_, text) => text?.megaECurrent
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.megaCPRCurrent' defaultMessage='Tỷ suất lợi nhuận tích lũy MegaCPR (%)' />,
      dataIndex: 'megaCPRCurrent',
      valueType: 'textarea',
      key: 'megaCPRCurrent',
      renderText: (_, text) => text?.megaCPRCurrent
    },

  ];

  const columnDetailUserMegaHistory: ProColumns<any>[] = [
    {
      title: <FormattedMessage id='pages.searchTable.column.totalCPassHistory' defaultMessage='Tổng cPass Mega sở hữu' />,
      dataIndex: 'totalCPassHistory',
      valueType: 'textarea',
      key: 'totalCPassHistory',
      renderText: (_, text) => text?.totalCPassHistory
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.megaDeltaWeightHistory' defaultMessage='Tổng tăng trọng tích lũy MegaΔP (kg)' />,
      dataIndex: 'megaDeltaWeightHistory',
      valueType: 'textarea',
      key: 'megaDeltaWeightHistory',
      renderText: (_, text) => text?.megaDeltaWeightHistory
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.produceAleHistory' defaultMessage='Tổng ProduceAle đã chuyển đổi từ MegaΔP' />,
      dataIndex: 'produceAleHistory',
      valueType: 'textarea',
      key: 'megaWeightHistory',
      renderText: (_, text) => text?.megaWeightHistory
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.megaWeightHistory' defaultMessage=' Tổng trọng lượng MegaP (kg)' />,
      dataIndex: 'megaWeightHistory',
      valueType: 'textarea',
      key: 'megaWeightHistory',
      renderText: (_, text) => text?.megaWeightHistory
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.megaEHistory' defaultMessage='Tổng giá trị tài sản MegaE (VNĐ)' />,
      dataIndex: 'megaEHistory',
      valueType: 'textarea',
      key: 'megaEHistory',
      renderText: (_, text) => text?.megaEHistory
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.megaCPRHistory' defaultMessage='Tỷ suất lợi nhuận tích lũy MegaCPR (%)' />,
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
      render: (_, text) => <ProFormSwitch  label='Cho phép thông báo đẩy:' fieldProps={{
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
      render: (_, text) => <ProFormSwitch label='Nhận báo cáo tăng trọng định kỳ:'  fieldProps={{
        checked: notifyWG,
        onChange: async (values) => {
          setNotifyWG(values);
          await sleeper(3000);
          updateConfig({
            notifyWG: values
          }, props?.currentRowUser);
        } 
      }}/>
    },

    {
      title: '',
      dataIndex: 'notificationEmail',
      valueType: 'textarea',
      key: 'notificationEmail',
      render: (_, text) => <ProFormSwitch label='Nhận thông báo bằng email:' fieldProps={{
        checked: notifyEmail, 
        onChange: async(values) => {
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
        >Tạo tài khoản mới</Button>
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
              tab: 'Thông tin',
              key: '1',
              children: DescriptionCustom({
                columns: columnDetailUser,
                data: detailUser?.user,
                //id: props?.currentRowUser,
                //api: 'users/find-admin'
              })
            },
            {
              tab: 'Ale',
              key: '2',
              children: DescriptionCustom({
                columns: columnDetailUserAle,
                data: detailUser?.ale
                //id: props?.ale,
                //api: 'users/find-admin'
              })
            },

            {
              tab: 'MEGA',
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
              tab: 'Thiết đặt riêng',
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
        >
          <ProForm.Group>
            <ProFormText width='md' name='fullname' label='Họ tên' placeholder='Nhập họ tên' />
            <ProFormText width='md' name='email' label='Email' placeholder='Nhập email' />
            <ProFormText width='md' name='username' label='Username' placeholder='Nhập username' />
            <ProFormText width='md' name='phone' label='Số điện thoại' placeholder='Nhập số điện thoại' />
            <ProFormText.Password width='md' name='password' label='Password' placeholder='Nhập password' />
            <ProFormText.Password width='md' name='confirmPassword' label='Xác nhận password' placeholder='Xác nhận password' />
            <ProFormText width='md' name='address' label='Địa chỉ' placeholder='Nhập địa chỉ' />
            <ProFormText width='md' name='passport' label='CCCD/HC' placeholder='Nhập CCCD/HC' />
            <ProFormText width='md' name='passport' label='CCCD/HC' placeholder='Nhập CCCD/HC' />
            <ProFormDatePicker width='md' name='birthdate' label='Ngày sinh' />
          </ProForm.Group>


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
        >
          <ProForm.Group>
            <ProFormText width='md' name='fullname' label='Họ tên' placeholder='Nhập họ tên' />
            <ProFormText width='md' name='email' label='Email' placeholder='Nhập email' />
            <ProFormText width='md' name='phone' label='Số điện thoại' placeholder='Nhập số điện thoại' />
            <ProFormText width='md' name='address' label='Địa chỉ' placeholder='Nhập địa chỉ' />
            <ProFormText width='md' name='passport' label='CCCD/HC' placeholder='Nhập CCCD/HC' />
            <ProFormText width='md' name='bank' label='Ngân hàng' placeholder='Chọn ngân hàng' />
            <ProFormText width='md' name='passport' label='CCCD/HC' placeholder='Nhập CCCD/HC' />
            <ProFormDatePicker width='md' name='createdAt' label='Ngày tạo' />
            <ProFormDatePicker width='md' name='birthdate' label='Ngày sinh' />
          </ProForm.Group>
        </ModalForm>
      </Drawer>

    </>
  );
};

export default TableList;
