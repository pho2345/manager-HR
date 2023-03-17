import { customAPIGetOne, customAPIPostOne, customAPIUpdateMany } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';

import moment from 'moment';
import { FormattedMessage, useParams } from '@umijs/max';
import { Button, Typography, message, Modal, Space, Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import "./styles.css";
import DetailCPass from '../components/DetailCPass';
import DetailUser from '../components/DetailUser';
const { Text, } = Typography;


const handleUpdateMany = async (fields: any, api: string, id: any) => {
  const hide = message.loading('Đang cập nhật...');
  try {
    const updateTransaction = await customAPIUpdateMany(
      fields,
      api,
      id);
    hide();
    if (updateTransaction) {
      message.success('Cập nhật thành công');
    }
    return true;
  } catch (error) {
    hide();
    message.error('Cập nhật thất bại!');
    return false;
  }
};



const getFair = async (id: number) => {
  const fetchCPass = await customAPIGetOne(id, 'fairs/find-field', { 'field[0]': 'code' });
  return fetchCPass;
}



const TableListAssignCPass = () => {
  const actionRef = useRef<ActionType>();
  const [currentRowCPass, setCurrentRowCPass] = useState<any>();
  const [showDetailCPass, setShowDetailCPass] = useState<boolean>(false);
  const [selectedRowsCPass, setSelectedRowsCPass] = useState<any>([]);
  const [selectedRowsMega, setSelectedRowsMega] = useState<any>([]);



  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);
  const params = useParams<any>();
  const [fair, setFair] = useState<any>();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    console.log('selectedKeys', selectedKeys[0]);
  };
  const handleReset = (clearFilters: any) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value: any, record: any) => {
      if (record[dataIndex]) {
        console.log('vao day');
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
      }
      return null;
    }
    ,
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text: any) =>{

    // }

  });


  const confirm = (entity: any, message: string, api: string, id: any) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: message,
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {

        await handleUpdateMany({
          ...entity
        }, api, id);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    });
  };


  useEffect(() => {
    const fetchDataFair = async () => {
      const getFairData = await getFair(params.id);
      setFair(getFairData);
    }
    fetchDataFair();
  }, []);


  const columns: ProColumns<any>[] = [
    {
      key: 'code',
      dataIndex: 'code',
      title: <FormattedMessage id='pages.se archTable.column.cPass' defaultMessage='Thẻ tai|cPass' />,
      ...getColumnSearchProps('id'),
      render: (_, entity: any) => {
        return (
          <>
            <a
              onClick={() => {
                setCurrentRowUser(entity?.id);
                setShowDetailUser(true);
              }}>
              {entity?.fullname ? entity?.fullname : entity?.username}-{entity?.id}
            </a><br /> {entity?.phone}{`${entity?.email ? `|${entity?.email}` : null}`}
            <br /> CCCD/HC: {entity?.passport}
          </>
        );
      },


    },
    {
      title: <FormattedMessage id='pages.searchTable.column.buyCPass' defaultMessage='cPass đã mua trong đợt mở bán' />,
      dataIndex: 'buyCPass',
      valueType: 'textarea',
      key: 'buyCPass',
      render: (_, text) => {
        const cPass = text?.c_pass?.map((e: any) => {
          return (<> <a
            onClick={() => {
              setCurrentRowCPass(e?.id);
              setShowDetailCPass(true);
            }}>
            {e?.code}
          </a></>)
        });
        return (<>{cPass}</>);
      }
    },

  ];

  const columnCPass: ProColumns<any>[] = [
    {
      key: 'code',
      dataIndex: 'code',
      title: <FormattedMessage id='pages.searchTable.column.cPass' defaultMessage='Thẻ tai|cPass' />,
      ...getColumnSearchProps('code'),
      render: (_, entity: any) => {
        return (
          // <Text>{`${entity.code}|${entity.id}`}</Text>
          <a
            onClick={() => {
              setCurrentRowCPass(entity?.id);
              setShowDetailCPass(true);
            }}
          >
            {`${entity.code}|${entity.id}`}
          </a>

        );
      },

    },
    {
      title: <FormattedMessage id='pages.searchTable.column.farm' defaultMessage='Trang trại' />,
      dataIndex: 'farm',
      valueType: 'textarea',
      key: 'farm',
      ...getColumnSearchProps('farmName'),
      renderText: (_, text) => text.farmName ? text.farmName : null


    },
    {
      title: <FormattedMessage id='pages.searchTable.column.birthdate' defaultMessage='Ngày sinh' />,
      dataIndex: 'birthdate',
      valueType: 'textarea',
      key: 'birthdate',
      renderText: (_, text: any) => {
        return moment(text?.birthdate).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY');
      }

    },

    {
      title: <FormattedMessage id='pages.searchTable.column.firstWeight' defaultMessage='Pss(Kg)' />,
      dataIndex: 'firstWeight',
      valueType: 'textarea',
      key: 'firstWeight',
      renderText: (_, text: any) => text?.firstWeight
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.age' defaultMessage='Tuổi' />,
      dataIndex: 'age',
      valueType: 'textarea',
      key: 'age',
      renderText: (_, text: any) => {
        let age = `${text.age / 4 >= 1 ? `${text.age / 4}Th` : ''} ${text.age % 4 !== 0 ? (text.age % 4) + 'T' : ''}`;
        return age;

      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.bodyCondition' defaultMessage='Thể trạng' />,
      dataIndex: 'bodyCondition',
      valueType: 'textarea',
      key: 'bodyCondition',
      render: (_, text: any) => {
        switch (text?.bodyCondition) {
          case 'good':
            return (<Text style={{ color: '#00CC00' }}>Tốt</Text>);
          case 'malnourished':
            return (<Text>Suy dinh dưỡng</Text>);
          case 'weak':
            return (<Text style={{ color: '#FF9900' }}>Yếu</Text>);
          case 'sick':
            return (<Text style={{ color: '#FF3333' }}>Bệnh</Text>);
          case 'dead':
            return (<Text style={{ color: '#FF0000' }}>Chết</Text>)
          default:
            break;
        }
        return 'abc';
      },
      filters: true,
      onFilter: true,
      valueEnum: {
        good: {
          text: 'Tốt',
          value: 'good'
        },
        malnourished: {
          text: 'Suy dinh dưỡng',
          value: 'malnourished'
        },
        weak: {
          text: 'Yếu',
          value: 'weak'
        },
        sick: {
          text: 'Bệnh',
          value: 'sick'
        },
        dead: {
          text: 'Chết',
          value: 'dead'
        },
      },
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.pZero' defaultMessage='P0(kg)' />,
      dataIndex: 'pZero',
      valueType: 'textarea',
      key: 'pZero',
      renderText: (_, text: any) => {
        return text?.pZero;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.vs' defaultMessage='Vs(VNĐ)' />,
      dataIndex: 'vs',
      valueType: 'textarea',
      key: 'vs',
      renderText: (_, text: any) => {
        return text?.vs;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.vZero' defaultMessage='V0(VNĐ)' />,
      dataIndex: 'vZero',
      valueType: 'textarea',
      key: 'vZero',
      renderText: (_, text: any) => {
        return text?.vZero;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.megaS' defaultMessage='MegaS' />,
      dataIndex: 'megaS',
      valueType: 'textarea',
      key: 'megaS',
      render: (_, text: any) => text?.megaS
    },



  ];




  return (
    <>
      <ProTable
        headerTitle='Danh sách Mega'
        actionRef={actionRef}
        rowKey='id'
        search={false}
        rowClassName={

          (entity) => {
            return entity.classColor
          }
        }


        request={async () => {
          const data = await customAPIGetOne(params.id, 'users/list-and-cpass', {});
          //console.log('usersss', data);

          return {
            data: data,
            success: true,
            total: data?.length
          }
        }}
        toolBarRender={() => [
          <>

          </>
        ]}
        columns={columns}
        dataSource={fair?.c_passes}
        rowSelection={{
          onChange: (_, selectedRows: any) => {
            console.log(selectedRows);
            if (selectedRows.length > 1) {
              message.error('Chỉ được chọn 1 Mega!');

            }

            setSelectedRowsMega(selectedRows);
          },
          // getCheckboxProps: (record: any) => ({
          //   disabled: false, // Column configuration not to be checked
          //  //name: record.name,
          // }),
        }}
      />


      <ProTable
        headerTitle={(<>
          Đợt mở bán: {fair?.code}
        </>)}
        actionRef={actionRef}
        rowKey='id'
        search={false}
        rowClassName={
          (entity) => {
            return entity.classColor
          }
        }

        request={async () => {
          const data = await customAPIPostOne(params.id, 'fairs/cpass-not-owner', {});
          //console.log('usersss', data);
          const { c_passes } = data;
          return {
            data: c_passes,
            success: true,
            total: c_passes?.length
          }
        }}
        toolBarRender={() => [
          <>
            {selectedRowsCPass.length >= 1 && selectedRowsMega.length === 1 && (<Button
              type='primary'
              key='primary'
              onClick={() => {
                console.log(selectedRowsMega)
                const cPassId = selectedRowsCPass.map((e: any) => e.id);

                confirm(
                  {
                    data: {
                      cPassId: cPassId,
                      userId: selectedRowsMega[0]?.id
                    }
                  }, 'Bạn có muốn gán cPass cho Mega đã chọn không?', 'c-passes/update/assign', null);
              }}
            >
              <PlusOutlined /> <FormattedMessage id='pages.searchTable.add' defaultMessage='Thêm' />
            </Button>)}
          </>
        ]}
        columns={columnCPass}
        dataSource={fair?.c_passes}
        rowSelection={{
          onChange: (_, selectedRows: any) => {
            setSelectedRowsCPass(selectedRows);
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
      )}


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

    </>
  );
};

export default TableListAssignCPass;


