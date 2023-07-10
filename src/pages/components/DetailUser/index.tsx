
import { customAPIGetOne } from '@/services/ant-design-pro/api';
import { ProColumns, ProDescriptions } from '@ant-design/pro-components';
import {  Drawer, Typography  } from 'antd';
import moment from 'moment';
import React from 'react';
const {Text} = Typography;
import  configText from '@/locales/configText';
const configDefaultText = configText;

const TableList = (props: any) => {
  
  const columnDetailUser: ProColumns<any>[] = [
    {
      key: 'code',
      dataIndex: 'code',
      title: configDefaultText['page.DetailUser.column.id'],
      renderText: (_, entity: any) => entity.id
    },
    {
      title: configDefaultText['page.DetailUser.column.username'],
      dataIndex: 'username',
      valueType: 'textarea',
      key: 'username',
      renderText: (_, text) => text.username
    },
    {
      title: configDefaultText['page.DetailUser.column.email'],
      dataIndex: 'email',
      valueType: 'textarea',
      key: 'email',
      renderText: (_, text) => text.email
    },
    {
      title: configDefaultText['page.DetailUser.column.fullname'],
      dataIndex: 'fullname',
      valueType: 'textarea',
      key: 'fullname',
      renderText: (_, text) => text.fullname
    },
    {
      title: configDefaultText['page.DetailUser.column.phone'],
      dataIndex: 'phone',
      valueType: 'textarea',
      key: 'phone',
      renderText: (_, text) => text.phone
    },
    {
      title: configDefaultText['page.DetailUser.column.passport'],
      dataIndex: 'passport',
      valueType: 'textarea',
      key: 'passport',
      renderText: (_, text) => text?.passport
    },
    {
      title: configDefaultText['page.DetailUser.column.address'],
      dataIndex: 'address',
      valueType: 'textarea',
      key: 'address',
      renderText: (_, text) => text?.accountBank
    },
    {
      title: configDefaultText['page.DetailUser.column.birthdate'],
      dataIndex: 'birthdate',
      valueType: 'textarea',
      key: 'birthdate',
      renderText: (_, text: any) => text.birthdate ? moment(text?.birthdate).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY') : null
    },
    {
      title: configDefaultText['page.DetailUser.column.sex'],
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
      title: configDefaultText['page.DetailUser.column.firebaseUid'],
      dataIndex: 'firebaseUid',
      valueType: 'textarea',
      key: 'firebaseUid',
      renderText: (_, text) => text?.firebaseUid
    },

    {
      title: configDefaultText['page.DetailUser.column.bank'],
      dataIndex: 'bank',
      valueType: 'textarea',
      key: 'bank',
      renderText: (_, text) => text?.bank
    },

    {
      title: configDefaultText['page.DetailUser.column.ale'],
      dataIndex: 'ale',
      valueType: 'textarea',
      key: 'ale',
      renderText: (_, text) => text?.ale && text?.ale.toLocaleString()
    },

    {
      title: configDefaultText['page.DetailUser.column.quantityAleRecharge'],
      dataIndex: 'quantityAleRecharge',
      valueType: 'textarea',
      key: 'quantityAleRecharge',
      renderText: (_, text) => text?.quantityAleRecharge && text?.quantityAleRecharge.toLocaleString()
    },

    {
      title: configDefaultText['page.DetailUser.column.aleUsed'],
      dataIndex: 'aleUsed',
      valueType: 'textarea',
      key: 'aleUsed',
      renderText: (_, text) => text?.aleUsed && text?.aleUsed.toLocaleString()
    },

    {
      title: configDefaultText['page.DetailUser.column.produceAle'],
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'produceAle',
      renderText: (_, text) => text?.produceAle && text?.produceAle.toLocaleString()
    },
    {
      title: configDefaultText['page.DetailUser.column.promoAle'],
      dataIndex: 'promoAle',
      valueType: 'textarea',
      key: 'promoAle',
      renderText: (_, text) => text?.promoAle && text?.promoAle.toLocaleString()
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
            title={configDefaultText['page.DetailUser.column.infomationAleger']}
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
