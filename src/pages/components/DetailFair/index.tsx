
import { customAPIGetOne } from '@/services/ant-design-pro/api';
import { PageContainer, ProColumns, ProDescriptions } from '@ant-design/pro-components';
import {  Link,  } from '@umijs/max';
import { Drawer,  } from 'antd';
import moment from 'moment';
import React, {  } from 'react';
import configText from '@/locales/configText';
const configDefaultText = configText;


 const DescriptionCustom = (props: any) => {

  return (<><ProDescriptions
    column={1}
    title='Thông tin cPass'
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
      // title: <FormattedMessage id='pages.searchTable.column.cPassPublished' defaultMessage='cPass phát hành/Đã bán' />,
      title: configDefaultText['page.DetailFair.column.cPassPublished'],
      dataIndex: 'cPassPublished',
      valueType: 'textarea',
      key: 'cPassPublished',
      renderText: (_, text: any) => `${text?.cPassPublished}`
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.quantityMegeBuy' defaultMessage='Số lượng Mega đã góp vốn' />,
      title: configDefaultText['page.DetailFair.column.quantityMegeBuy'],
      dataIndex: 'cPassPublished',
      valueType: 'textarea',
      key: 'cPassPublished',
      renderText: (_, text: any) => null
    },

    {
      //  title: <FormattedMessage id='pages.searchTable.column.switchNotify' defaultMessage='Switch nhắc thanh toán:' />,
      title: configDefaultText['page.DetailFair.column.switchNotify'],
      dataIndex: 'switchNotify',
      valueType: 'textarea',
      key: 'switchNotify',
      renderText: (_, text: any) => null
    },

    {
      //  title: <FormattedMessage id='pages.searchTable.column.listCPass' defaultMessage='Switch nhắc thanh toán:' />,
      title: configDefaultText['page.DetailFair.column.listCPass'],
      dataIndex: 'switchNotify',
      valueType: 'textarea',
      key: 'switchNotify',
      render: () => (<>
         <Link to={`/web-c-pass/fairs/` + props?.fairId}>
             Danh sách cPass
           </Link>
      </>)
    },
  ];

  const columnsDetaiFair: ProColumns<any>[] = [
    {
      // title: <FormattedMessage id='pages.searchTable.column.status' defaultMessage='Tình Trạng' />,
      title: configDefaultText['page.DetailFair.column.status'],
      dataIndex: 'status',
      valueType: 'textarea',
      key: 'status',
      renderText: (_, text: any) => text?.status
    },
    {
      key: 'code',
      dataIndex: 'code',
      // title: <FormattedMessage id='pages.searchTable.column.fair' defaultMessage='Phiên mở bán' />,
      title: configDefaultText['page.DetailFair.column.fair'],
      render: (_, entity: any) => {
        return (
          // <Text>{`${entity.code}|${entity.id}`}</Text>
          <>
            {`${entity.code}|${entity.id}`}</>


        );
      },

    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.timeStart' defaultMessage='Ngày giờ mở bán' />,
      title: configDefaultText['page.DetailFair.column.timeStart'],
      dataIndex: 'timeStart',
      valueType: 'textarea',
      key: 'timeStart',
      renderText: (_, text) => {
        const weekday = 'T' + `${moment(text?.timeStart).weekday() + 1}`;
        return weekday + ' ' + moment(text?.timeStart).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY HH:mm:ss');
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.timeEnd' defaultMessage='Ngày giờ đóng bán' />,
      title: configDefaultText['page.DetailFair.column.timeEnd'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'timeEnd',
      renderText: (_, text: any) => {
        const weekday = 'T' + `${moment(text?.timeEnd).weekday() + 1}`;
        return weekday + ' ' + moment(text?.timeEnd).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY HH:mm:ss');
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.dateStartFeed' defaultMessage='Ngày bắt đầu nuôi' />,
      title: configDefaultText['page.DetailFair.column.timeEnd'],
      dataIndex: 'dateStartFeed',
      valueType: 'textarea',
      key: 'dateStartFeed',
      renderText: (_, text: any) => {
        {
          const weekday = 'T' + `${moment(text?.dateStartFeed).weekday() + 1}`;
          return weekday + ' ' + moment(text?.dateStartFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY HH:mm:ss');
        }
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.timeFeed' defaultMessage='Thời gian nuôi(Tuần)' />,
      title: configDefaultText['page.DetailFair.column.timeEnd'],
      dataIndex: 'timeFeed',
      valueType: 'textarea',
      key: 'timeFeed',
      renderText: (_, text: any) => text?.timeFeed
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.unitPriceMeat' defaultMessage='Đơn giá thịt(VNĐ/kg)' />,
      title: configDefaultText['page.DetailFair.column.timeEnd'],
      dataIndex: 'unitPriceMeat',
      valueType: 'textarea',
      key: 'unitPriceMeat',
      renderText: (_, text: any) => `${text?.unitPriceMeat}`
    },


    

  ];
  return (
    <>
      <Drawer
        width='50vh'
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
            
          ]}
        >
          

        </PageContainer>
      </Drawer>
    </>
  );
};

export default TableList;
