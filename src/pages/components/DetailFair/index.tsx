
import { customAPIGetOne } from '@/services/ant-design-pro/api';
import { PageContainer, ProColumns, ProDescriptions } from '@ant-design/pro-components';
import { FormattedMessage, Link,  } from '@umijs/max';
import { Drawer,  } from 'antd';
import moment from 'moment';
import React, {  } from 'react';



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
      title: <FormattedMessage id='pages.searchTable.column.cPassPublished' defaultMessage='cPass phát hành/Đã bán' />,
      dataIndex: 'cPassPublished',
      valueType: 'textarea',
      key: 'cPassPublished',
      renderText: (_, text: any) => `${text?.cPassPublished}`
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.quantityMegeBuy' defaultMessage='Số lượng Mega đã góp vốn:' />,
      dataIndex: 'cPassPublished',
      valueType: 'textarea',
      key: 'cPassPublished',
      renderText: (_, text: any) => null
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.switchNotify' defaultMessage='Switch nhắc thanh toán:' />,
      dataIndex: 'switchNotify',
      valueType: 'textarea',
      key: 'switchNotify',
      renderText: (_, text: any) => null
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.switchNotify' defaultMessage='Switch nhắc thanh toán:' />,
      dataIndex: 'switchNotify',
      valueType: 'textarea',
      key: 'switchNotify',
      render: (_, text: any) => (<>
         <Link to={`/fairs/` + props?.fairId}>
             Danh sách cPass
           </Link>
      </>)
    },
  ];

  const columnsDetaiFair: ProColumns<any>[] = [
    {
      title: <FormattedMessage id='pages.searchTable.column.status' defaultMessage='Tình Trạng' />,
      dataIndex: 'status',
      valueType: 'textarea',
      key: 'status',
      renderText: (_, text: any) => text?.status
    },
    {
      key: 'code',
      dataIndex: 'code',
      title: <FormattedMessage id='pages.searchTable.column.fair' defaultMessage='Phiên mở bán' />,
      render: (_, entity: any) => {
        return (
          // <Text>{`${entity.code}|${entity.id}`}</Text>
          <>
            {`${entity.code}|${entity.id}`}</>


        );
      },

    },

    {
      title: <FormattedMessage id='pages.searchTable.column.timeStart' defaultMessage='Ngày giờ mở bán' />,
      dataIndex: 'timeStart',
      valueType: 'textarea',
      key: 'timeStart',
      renderText: (_, text) => {
        const weekday = 'T' + `${moment(text?.timeStart).weekday() + 1}`;
        return weekday + ' ' + moment(text?.timeStart).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY HH:mm:ss');
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.timeEnd' defaultMessage='Ngày giờ đóng bán' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'timeEnd',
      renderText: (_, text: any) => {
        const weekday = 'T' + `${moment(text?.timeEnd).weekday() + 1}`;
        return weekday + ' ' + moment(text?.timeEnd).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY HH:mm:ss');
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.dateStartFeed' defaultMessage='Ngày bắt đầu nuôi' />,
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
      title: <FormattedMessage id='pages.searchTable.column.timeFeed' defaultMessage='Thời gian nuôi(Tuần)' />,
      dataIndex: 'timeFeed',
      valueType: 'textarea',
      key: 'timeFeed',
      renderText: (_, text: any) => text?.timeFeed
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.unitPriceMeat' defaultMessage='Đơn giá thịt(VNĐ/kg)' />,
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
