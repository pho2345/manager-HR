import DetailCPass from '@/pages/components/DetailCPass';
import DetailFair from '@/pages/components/DetailFair';
import DetailUser from '@/pages/Web-Aleger/components/DetailUser';
import {
  customAPIGet,
} from '@/services/ant-design-pro/api';
import { ReloadOutlined } from '@ant-design/icons';
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
import React, { useEffect, useRef, useState } from 'react';
import configText from '@/locales/configText';
const configDefaultText = configText;

const getLog = async (page: number, sizePage: number) => {
  const data = await customAPIGet(
    { page, 'size-page': sizePage },
    'log-transactions');
  return {
    data: data.data.log,
    total: data.data.total
  }
}



const TableList: React.FC = () => {
  const [showDetailCPass, setShowDetailCPass] = useState<boolean>(false);
  const [currentRowCPass, setCurrentRowCPass] = useState<any>();

  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);

  const [currentRowFair, setCurrentRowFair] = useState<any>();
  const [showDetailFair, setShowDetailFair] = useState<boolean>(false);


  const [loading, setLoading] = useState<boolean>(false);

  const [page, setPage] = useState<any>(1);
  const [totalLog, setTotalLog] = useState<any>();
  const [log, setLog] = useState<any>();

  const actionRef = useRef<ActionType>();

  // useEffect(() => {
  //   const getData = async () => {
  //     setLoading(true);
  //     const data = await getLog(1, 100);
  //     if (data) {
  //       setLog(data.data);
  //       setTotalLog(data.total);
  //       setLoading(false);

  //     }

  //   }
  //   getData();

  // }, []);

  useEffect(() => {
    const getData = async () => {
    setLoading(true);
      const data = await getLog(page, 1);
      if (data) {
        setLog(data.data);
        setTotalLog(data.total);
      }
      setLoading(false);
    }
    getData();
  }, [page]);

  const reloadTable = () => {
    const getData = async () => {
      setLoading(true);
      const data = await getLog(page, 1);
      if (data) {
        setLog(data.data);
        setTotalLog(data.total);
      }
      setLoading(false);
    }
    getData();
  }

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
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      valueType: 'textarea',
      key: 'createdAt',
      renderText: (_, text: any) => moment(text?.createdAt).format('HH:mm DD/MM/YYYY')
    },
  ];

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        rowKey='id'
        loading={loading}
        search={false}
        // request={async () => {
        //   const data = await customAPIGet(
        //     {
        //     },
        //     'log-transactions');
        //   return {
        //     data: data.data,
        //     success: true,
        //     total: data?.data?.length
        //   }
        // }
        // }
        dataSource={log}
        columns={columns}
        rowSelection={false}
        toolbar={{
          settings: [{
            key: 'reload',
            tooltip: 'Tải lại',
            icon: <ReloadOutlined />,
            onClick: () => {
              if (actionRef.current) {
                // actionRef.current.reload();
                reloadTable()
              }
            }
          }]
        }}


        pagination={{
          locale: {
            next_page: configDefaultText['nextPage'],
            prev_page: configDefaultText['prePage'],
          },
          total: totalLog,
          pageSize: 1,
          showTotal: (total, range) => {
            return `${range[range.length - 1]} / Tổng số: ${total}`
          },
          onChange(page, pageSize) {
            setPage(page);
          },
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
