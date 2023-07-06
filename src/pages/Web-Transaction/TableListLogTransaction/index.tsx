import DetailCPass from '@/pages/components/DetailCPass';
import DetailFair from '@/pages/components/DetailFair';
import DetailUser from '@/pages/Web-Aleger/components/DetailUser';
import {
  customAPIDowload,
  customAPIGet,
  customAPIPost,
} from '@/services/ant-design-pro/api';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';

// import { FormattedMessage, useIntl } from '@umijs/max';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import configText from '@/locales/configText';
import { Button } from 'antd';
const configDefaultText = configText;








const TableList: React.FC = () => {
  const [showDetailCPass, setShowDetailCPass] = useState<boolean>(false);
  const [currentRowCPass, setCurrentRowCPass] = useState<any>();

  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);

  const [currentRowFair, setCurrentRowFair] = useState<any>();
  const [showDetailFair, setShowDetailFair] = useState<boolean>(false);

  const [filterStatus, setFilterStatus] = useState<any>();
  const [showDowloadFile, setShowDowloadFile] = useState<boolean>(false);


  const actionRef = useRef<ActionType>();





  // const intl = useIntl();

  const columns: ProColumns<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      title: configDefaultText['page.logTransaction.colums.code'],
      key: 'code',
      dataIndex: 'code',
      render: (_, entity: any) => {
        return (
          <>
            {entity?.code}
          </>
        );
      },
      filters: true,
      filterSearch: true,
      onFilter: true,
      //valueEnum: filterCode
    },
    {
      title: configDefaultText['page.logTransaction.colums.types'],
      dataIndex: 'types',
      valueType: 'textarea',
      key: 'types',
      renderText: (_, text: any) => {
        return (text?.type);
      }
    },
    {
      title: configDefaultText['page.logTransaction.colums.methodPayment'],
      dataIndex: 'methodPayment',
      valueType: 'textarea',
      key: 'methodPayment',
      render: (_, text: any) => {
          return (
            <>{text?.methodPayment}</>
          )
      },
    },
   
    {
      title: configDefaultText['page.logTransaction.colums.adminUser'],
      dataIndex: 'adminUser',
      valueType: 'textarea',
      key: 'adminUser',
      render: (_, text: any) => 
        <>
          {text?.adminUser}
      </>,
    },

    {
      title: configDefaultText['page.logTransaction.colums.action'],
      dataIndex: 'action',
      valueType: 'textarea',
      key: 'action',
      renderText: (_, text: any) => text?.content
    },


    {
      title: configDefaultText['page.logTransaction.colums.statusFrom'],
      dataIndex: 'statusFrom',
      valueType: 'textarea',
      key: 'statusFrom',
      renderText: (_, text: any) => text?.textStatusFrom
    },
    {
      title: configDefaultText['page.logTransaction.colums.statusTo'],
      dataIndex: 'statusTo',
      valueType: 'textarea',
      key: 'statusTo',
      renderText: (_, text: any) => text?.textStatusTo
    },

    {
      title: configDefaultText['page.logTransaction.colums.user'],
      dataIndex: 'user',
      valueType: 'textarea',
      key: 'user',
      renderText: (_, text: any) => text?.users
    },
  ];

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        rowKey='id'
        search={false}
        toolBarRender={() => {
          return showDowloadFile ? [
            <Button
              type='primary'
              key='primary'
              onClick={async () => {
                await customAPIDowload('transactions/follow/excel');
              }}
            >
              <PlusOutlined /> Excel
            </Button>,
          ] : []
        }}
        request={async () => {
          const data = await customAPIGet(
            {

            },
            'log-transactions');


          return {
            data: data.data,
            success: true,
            total: data?.data?.length
          }
        }
        }
        columns={columns}
        rowSelection={false}
        toolbar={{
          settings: [{
            key: 'reload',
            tooltip: 'Tải lại',
            icon: <ReloadOutlined />,
            onClick: () => {
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }]
        }}



        pagination={{
          locale: {
            next_page: configDefaultText['nextPage'],
            prev_page: configDefaultText['prePage'],
          },
          showTotal: (total, range) => {
            return `${range[range.length - 1]} / Tổng số: ${total}`
          }
        }}



      />



      {currentRowCPass && (
        <DetailCPass
          openModal={showDetailCPass}
          idCPass={currentRowCPass}
          closeModal={() => {
            setCurrentRowCPass(undefined);
            setShowDetailCPass(false);
          }}
        />
      )
      }

      {currentRowUser && (
        <DetailUser
          onDetail={showDetailUser}
          currentRowUser={currentRowUser}
          onCloseDetail={() => {
            setCurrentRowUser(undefined);
            setShowDetailUser(false);
          }}
        />
      )
      }

      {currentRowFair && (
        <DetailFair
          openModal={showDetailFair}
          fairId={currentRowFair}
          closeModal={() => {
            setCurrentRowFair(undefined);
            setShowDetailFair(false);
          }}
        />
      )
      }


    </PageContainer>
  );
};

export default TableList;
