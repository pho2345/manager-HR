
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,

} from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useIntl, useParams } from '@umijs/max';
import { Drawer} from 'antd';
import React, { useRef, useState } from 'react';
import { customAPIGet } from '@/services/ant-design-pro/api';
import "./styles.css";
import moment from 'moment';






const TableList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();
  const params = useParams<number>();





  const intl = useIntl();

  const columns: ProColumns<any>[] = [
    {
      title: <FormattedMessage id='pages.searchTable.column.codeTransaction' defaultMessage='Mã giao dịch' />,
      key: 'code',
      dataIndex: 'atrributes',
      render: (_, record: any) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(record?.code);
              setShowDetail(true);
            }}
          >
            {record?.code}
          </a>
        );
      },
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.active' defaultMessage='Hoạt động' />,
      dataIndex: 'active',
      valueType: 'textarea',
      key: 'active',
      renderText: (_, record: any) => record?.active 
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.receiver' defaultMessage='Người nhận' />,
      dataIndex: 'receiver',
      valueType: 'textarea',
      key: 'receiver',
      renderText: (_, record: any) => record?.ale || `N/A`
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.ale' defaultMessage='Ale' />,
      dataIndex: 'ale',
      valueType: 'textarea',
      key: 'ale',
      renderText: (_, record: any) => record?.ale || `N/A`
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage='ProduceAle' />,
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'produceAle',
      renderText: (_, record: any) => record?.produceAle || `N/A`
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.promoAle' defaultMessage='PromoAle' />,
      dataIndex: 'promoAle',
      valueType: 'textarea',
      key: 'promoAle',
      renderText: (_, record: any) => record?.promoAle || `N/A`
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.rateFee' defaultMessage='Phí giao dịch(%)' />,
      dataIndex: 'rateFee',
      valueType: 'textarea',
      key: 'rateFee',
      renderText: (_, record: any) => record?.rateFee || `N/A`
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.fee' defaultMessage='Phí(VNĐ)' />,
      dataIndex: 'fee',
      valueType: 'textarea',
      key: 'fee',
      renderText: (_, record: any) => record?.fee || `N/A`
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.location' defaultMessage='Vị trí' />,
      dataIndex: 'location',
      valueType: 'textarea',
      key: 'location',
      renderText: (_, record: any) => record?.location || `N/A`
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.createdAt' defaultMessage='Thời gian phát sinh' />,
      dataIndex: 'createdAt',
      valueType: 'textarea',
      key: 'createdAt',
      renderText: (_, record: any) => moment(record?.createdAt).format('DD/MM/YYYY HH:MM:ss')
    },



  ];

  return (
    <PageContainer
      onBack={() => window.history.back()}
    >
      <ProTable
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey='id'
        search={false}
       
        request={() =>
          customAPIGet(
            { 'user-id': params?.id },
            'transactions/myale',
          )
        }
        columns={columns}
        rowSelection={false}
        
      />
    





      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
