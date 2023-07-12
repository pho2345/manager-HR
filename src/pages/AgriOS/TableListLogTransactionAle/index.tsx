import DetailCPass from '@/pages/components/DetailCPass';
import DetailFair from '@/pages/components/DetailFair';
import DetailUser from '@/pages/Web-Aleger/components/DetailUser';
import {
  customAPIGet,
} from '@/services/ant-design-pro/api';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';

import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import configText from '@/locales/configText';
import { Button, Input, message, Space } from 'antd';
const configDefaultText = configText;


const getLog = async (page: number, sizePage: number, filter: any) => {
  console.log(filter);
  const data = await customAPIGet(
    { page, 'size-page': sizePage, ...filter },
    'log-transaction-ales');
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
  // const searchInput = useRef<InputRef>(null);

  const [filtered, setFiltered] = useState<any>({
    admin: null,
    aleger: null,
    receiver: null,
    qr: null,
  });

  const actionRef = useRef<ActionType>();

  const [filters, setFilters] = useState<any>({
    admin: null,
    aleger: null,
    receiver: null,
    qr: null,
  });

  const getData = async (page: number ,filters: any) => {
    setLoading(true);
    try {
      const data = await getLog(page, 100, filters);
      if (data) {
        setLog(data.data);
        setTotalLog(data.total);
      }
    } catch (error: any) {
      message.error(error?.response.data.error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData(page, filters);
  }, [page]);

  const reloadTable = async (page: number, filters: any) => {
    await getData(page, filters);
  };
  
  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: () => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          placeholder={`Tìm kiếm`}
          value={filters[dataIndex]}
          onChange={(e: any) => {
            setFilters((prevFilters: any) => ({
              ...prevFilters,
              [dataIndex]: e.target.value,
            }));

            setFiltered((preFitered: any) => ({
              ...preFitered,
              [dataIndex]: true
            }));

          }}
          onPressEnter={() => {
            getData(page, filters);
          }}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => {
              getData(page, filters);
            }}
            icon={<SearchOutlined />}
            size='small'
            style={{
              width: 90,
            }}
          >
            Tìm
          </Button>
          <Button
            onClick={async () => {

                setFilters((prevFilters: any) => {
                  return {
                    ...prevFilters,
                    [dataIndex]: null
                  }
              });

              setFiltered((preFitered: any) => ({
                ...preFitered,
                [dataIndex]: false
              }));

              let filter = {
                ...filters,
                [dataIndex]: null
              }
              
              
              reloadTable(page, filter);
            }}
            size='small'
            style={{
              width: 90,
            }}
          >
            Làm mới
          </Button>
        </Space>
      </div>
    ),
    filterIcon: () => {
      return (
        <SearchOutlined
          style={{
            color: filtered[dataIndex] ? '#1890ff' : undefined,
          }}
        />
      );
    },
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
      }
    },
  });


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
      ...getColumnSearchProps('admin')
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
    }, {
      title: configDefaultText['page.logTransactionAle.colums.qr'],
      dataIndex: 'qr',
      valueType: 'textarea',
      key: 'qr',
      renderText: (_, text: any) => text?.qr,
      ...getColumnSearchProps('qr')
    },

    {
      title: configDefaultText['page.logTransactionAle.colums.aleger'],
      dataIndex: 'aleger',
      valueType: 'textarea',
      key: 'aleger',
      renderText: (_, text: any) => text?.sender,
      ...getColumnSearchProps('aleger')
    },

    {
      title: configDefaultText['page.logTransactionAle.colums.receiver'],
      dataIndex: 'receiver',
      valueType: 'textarea',
      key: 'receiver',
      renderText: (_, text: any) => text?.receiver,
      ...getColumnSearchProps('receiver')
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
        scroll={{
          x: window.innerWidth * 0.8
        }}
        actionRef={actionRef}
        rowKey='id'
        loading={loading}
        search={false}

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
                reloadTable(page, filters)
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
          pageSize: 100,
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
