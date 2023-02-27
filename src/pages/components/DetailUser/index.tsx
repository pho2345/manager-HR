
import { customAPIGetOne } from '@/services/ant-design-pro/api';
import { ProColumns, ProDescriptions } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import {  Drawer, Typography  } from 'antd';
import moment from 'moment';
import React from 'react';
const {Text} = Typography;


const TableList = (props: any) => {

  

  const intl = useIntl();

  const columnDetailUser: ProColumns<any>[] = [
    {
      key: 'code',
      dataIndex: 'code',
      title: <FormattedMessage id='pages.searchTable.column.id' defaultMessage='ID' />,
      renderText: (_, entity: any) => entity.id
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.username' defaultMessage='Tên đăng nhập' />,
      dataIndex: 'username',
      valueType: 'textarea',
      key: 'username',
      renderText: (_, text) => text.username
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.email' defaultMessage='Email' />,
      dataIndex: 'email',
      valueType: 'textarea',
      key: 'email',
      renderText: (_, text) => text.email
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.fullname' defaultMessage='Tên đầy đủ' />,
      dataIndex: 'fullname',
      valueType: 'textarea',
      key: 'fullname',
      renderText: (_, text) => text.fullname
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.phone' defaultMessage='Số điện thoại' />,
      dataIndex: 'phone',
      valueType: 'textarea',
      key: 'phone',
      renderText: (_, text) => text.phone
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.passport' defaultMessage='CCCD/HC' />,
      dataIndex: 'passport',
      valueType: 'textarea',
      key: 'passport',
      renderText: (_, text) => text?.passport
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.address' defaultMessage='Địa chỉ' />,
      dataIndex: 'address',
      valueType: 'textarea',
      key: 'address',
      renderText: (_, text) => text?.accountBank
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.birthdate' defaultMessage='Ngày sinh' />,
      dataIndex: 'birthdate',
      valueType: 'textarea',
      key: 'birthdate',
      renderText: (_, text: any) => text.birthdate ? moment(text?.birthdate).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY') : null
      
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.sex' defaultMessage='Giới tính' />,
      dataIndex: 'sex',
      valueType: 'textarea',
      key: 'sex',
      render: (_, text) => {
        switch (text?.sex) {
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
      renderText: (_, text) => text?.firebaseUid
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.bank' defaultMessage='Tài khoản ngân hàng' />,
      dataIndex: 'bank',
      valueType: 'textarea',
      key: 'bank',
      renderText: (_, text) => text?.bank
    },

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





  ];


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
        {props?.currentRowUser && (
          <><ProDescriptions
            column={2}
            title='Thông tin Mega'
            request={async () => {
              console.log('thong tin user');
            const getUser = await customAPIGetOne(props?.currentRowUser, 'users/find-admin');
              //setImage(getCPass?.photos);
              return {
                data: getUser,
                success: true
              }
            }}
            params={{
              id: props?.currentRowUser, 
            }}
            columns={columnDetailUser}
          ></ProDescriptions>
          </>
        )
        }
      </Drawer>

    </>
  );
};

export default TableList;
