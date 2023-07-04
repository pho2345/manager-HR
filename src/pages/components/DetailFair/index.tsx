
import { customAPIGetOne } from '@/services/ant-design-pro/api';
import { PageContainer, ProColumns, ProDescriptions } from '@ant-design/pro-components';
import {  Link,  } from '@umijs/max';
import { Button, Drawer, } from 'antd';
import moment from 'moment';
import React, {  } from 'react';
import configText from '@/locales/configText';
import Mega from './components/Mega';
const configDefaultText = configText;


 const DescriptionCustom = (props: any) => {

  return (<><ProDescriptions
    
    column={1}
    request={async () => {
      const getFair =  await customAPIGetOne(props.fairId, 'fairs/fairadmin', {});
      return {
        data: getFair,
        success: true
      }
    }}
    params={{
      id: props.fairId
    }}
    columns={props.columns}
  ></ProDescriptions>
  </>)
}

const TableList = (props: any) => {
  const columnsDetailCPass: ProColumns<any>[] = [
    {
      title: configDefaultText['page.DetailFair.column.cPassPublished'],
      dataIndex: 'cPassPublished',
      valueType: 'textarea',
      key: 'cPassPublished',
      renderText: (_, text: any) => `${text?.cPassPublished}/${text?.quantitySellCpass}`
    },

    {
      title: configDefaultText['page.DetailFair.column.totalRemain'],
      dataIndex: 'cPassPublished',
      valueType: 'textarea',
      key: 'cPassPublished',
      renderText: (_, text: any) => `${text?.totalRemain.toLocaleString()}`
    },

    {
      title: configDefaultText['page.DetailFair.column.totalSell'],
      dataIndex: 'cPassPublished',
      valueType: 'textarea',
      key: 'cPassPublished',
      renderText: (_, text: any) => `${text?.totalSell.toLocaleString()}`
    },

    {
      title: configDefaultText['page.DetailFair.column.quantityMegeBuy'],
      dataIndex: 'cPassPublished',
      valueType: 'textarea',
      key: 'cPassPublished',
      renderText: (_, text: any) => `${text?.mega}`
    },

    {
      dataIndex: 'switchNotify',
      valueType: 'textarea',
      key: 'switchNotify',
      render: () => (<>
        <Button> <Link to={`/web-c-pass/fairs/` + props?.fairId}>
             Danh sách cPass
           </Link></Button>
      </>)
    },
  ];

  const columnsDetaiFair: ProColumns<any>[] = [
    {
      title: configDefaultText['page.DetailFair.column.status'],
      dataIndex: 'status',
      valueType: 'textarea',
      key: 'status',
      renderText: (_, text: any) => {
        switch (text?.status) {
          case 'noOpen':
            return 'Chưa mở'
            break;
          case 'opening':
            return 'Đang mở'
            break;
          case 'closed':
            return 'Đã đóng'
            break;
          default:
            break;
        }
      },
    },
    {
      key: 'code',
      dataIndex: 'code',
      title: configDefaultText['page.DetailFair.column.fair'],
      render: (_, entity: any) => {
        return (
          <>
            {`${entity.code}|${entity.id}`}</>
        );
      },

    },

    {
      title: configDefaultText['page.DetailFair.column.timeStart'],
      dataIndex: 'timeStart',
      valueType: 'textarea',
      key: 'timeStart',
      renderText: (_, text) =>  {
        let indexWeek = moment(text?.timeStart).weekday();
        let weekday = 'T' + `${moment(text?.timeStart).weekday() + 1}`;
        if(indexWeek === 0) {
          weekday = 'CN';
        }
        return weekday + ' ' + moment(text?.timeStart).format('DD/MM/YYYY HH:mm:ss');
    }
    },

    {
      title: configDefaultText['page.DetailFair.column.timeEnd'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'timeEnd',
      renderText: (_, text: any) =>  {
        let indexWeek = moment(text?.timeEnd).weekday();
        let weekday = 'T' + `${moment(text?.timeEnd).weekday() + 1}`;
        if(indexWeek === 0) {
          weekday = 'CN';
        }
        return weekday + ' ' + moment(text?.timeEnd).format('DD/MM/YYYY HH:mm:ss');
    }
    },

    {
      title: configDefaultText['page.DetailFair.column.dateStartFeed'],
      dataIndex: 'dateStartFeed',
      valueType: 'textarea',
      key: 'dateStartFeed',
      renderText: (_, text: any) => {
        {
          let indexWeek = moment(text?.dateStartFeed).weekday();
          let weekday = 'T' + `${moment(text?.dateStartFeed).weekday() + 1}`;
          if(indexWeek === 0) {
            weekday = 'CN';
          }
          return weekday + ' ' + moment(text?.dateStartFeed).format('DD/MM/YYYY HH:mm:ss');
      }
      }
    },

    {
      title: configDefaultText['page.DetailFair.column.timeFeed'],
      dataIndex: 'timeFeed',
      valueType: 'textarea',
      key: 'timeFeed',
      renderText: (_, text: any) => text?.timeFeed
    },

    {
      title: configDefaultText['page.DetailFair.column.unitPriceMeat'],
      dataIndex: 'unitPriceMeat',
      valueType: 'textarea',
      key: 'unitPriceMeat',
      renderText: (_, text: any) => `${text?.unitPriceMeat?.toLocaleString()}`
    },
  ];
  return (
    <>
      <Drawer
        // width='50vh'
        width={window.innerWidth * 0.5}
        open={props.openModal}
        onClose={() => {
          props.closeModal();
        }}
        closable={false}
      >

        <PageContainer
          tabList={[
            {
              tab: 'Chi tiết',
              key: '1',
              children: DescriptionCustom({
                columns: columnsDetaiFair, 
                fairId: props?.fairId
              })
              
            },
            {
              tab: 'cPass',
              key: '2',
              children: DescriptionCustom({
                columns: columnsDetailCPass, 
                fairId: props?.fairId
              })
            },
            {
              tab: 'Mega',
              key: '3',
              children: <Mega
                fairId = {props?.fairId}
              />
            },
          ]}
        >
        </PageContainer>
      </Drawer>
    </>
  );
};

export default TableList;
