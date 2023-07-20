import { customAPIGet, customAPIGetOne, customAPIPostOne } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';

import moment from 'moment';
import { Button, Typography, message, Space, Input, Modal } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import "./styles.css";
import DetailCPass from '@/pages/components/DetailCPass';
import DetailUser from '@/pages/components/DetailUser';
import ConfirmAssign from './components/ConfirmAssign';
const { Text, } = Typography;
import configText from '@/locales/configText';
const configDefaultText = configText;

const handleUpdateMany = async (fields: any, api: string, id: any) => {
  const hide = message.loading('Đang cập nhật...');
  console.log(fields);
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
  } catch (error: any) {
    hide();
    message.error(error?.response?.data?.error?.message || 'Lỗi');
    return false;
  }
};



const getFair = async (id: number) => {
  const fetchCPass = await customAPIGetOne(id, 'fairs/find-field', { 'field[0]': 'code' });
  return fetchCPass;
}


const getBodyCondition = async () => {
  const data = await customAPIGet(
    {
    },
    'body-conditions/get/option',
  );
  return data.data
}



const TableListAssignCPass = (props: any) => {
  const actionRef = useRef<ActionType>();
  const actionRefMega = useRef<ActionType>();
  const [currentRowCPass, setCurrentRowCPass] = useState<any>();
  const [showDetailCPass, setShowDetailCPass] = useState<boolean>(false);
  const [selectedRowsCPass, setSelectedRowsCPass] = useState<any>([]);
  const [selectedRowsMega, setSelectedRowsMega] = useState<any>([]);
  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);
  const [fair, setFair] = useState<any>();
  const searchInput = useRef(null);
  const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
  const [searchRange, setSearchRange] = useState<any>();
  const [searchRangeTo, setSearchRangeTo] = useState<any>();
  const [optionRangeSearch, setOptionRangeSearch] = useState<any>();
  const [bodyCondition, setBodyCondition] = useState<any>([]);

  const [showConfirmAssign, setShowConfirmAssign] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      const getOption = await getBodyCondition();
      setBodyCondition(getOption);
    };
    getData();
  }, [])

  const handleSearch = (selectedKeys: any, confirm: any) => {
    confirm();
  };
  const handleReset = (clearFilters: any, confirm: any) => {
    clearFilters();
    confirm({
      closeDropdown: false,
    });
  };

  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters
      // , close
    }: any) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={configDefaultText['search']}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Làm mới
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
      if (record[dataIndex] && record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())) {
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
      }
      if (record['fullname'] && record['fullname'].toString().toLowerCase().includes(value.toLowerCase())) {
        return record['fullname'].toString().toLowerCase().includes(value.toLowerCase());
      }

      if (record['email'] && record['email'].toString().toLowerCase().includes(value.toLowerCase())) {
        return record['email'].toString().toLowerCase().includes(value.toLowerCase());
      }

      if (record['passport'] && record['passport'].toString().toLowerCase().includes(value.toLowerCase())) {
        return record['passport'].toString().toLowerCase().includes(value.toLowerCase());
      }

      return null;
    },
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
      }
    },
  });



  const handleSearchRange = (selectedKeys: any, confirm: any) => {
    confirm();
  };


  const handleResetRange = (clearFilters: any, confirm: any) => {
    clearFilters();
    setShowRangeTo(false);
    setSearchRange(null);
    setSearchRangeTo(null);
    setOptionRangeSearch(null);
    confirm({
      closeDropdown: false,
    });
  };


  const getColumnSearchRange = () => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters,
      //close
    }: any) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <ProFormDigit
          placeholder={`Cân nặng ${showRangeTo ? `từ` : ``}`}
          fieldProps={{
            onChange: (e: any) => {
              setSearchRange(e);
            },
            value: searchRange
          }}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        {
          showRangeTo && (<ProFormDigit
            // allowClear={true}
            placeholder={`Cân nặng đến`}
            fieldProps={{
              onChange: (e: any) => {
                setSearchRangeTo(e);
              }
            }}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />)
        }
        <ProFormSelect
          options={[
            {
              value: 'lesser',
              label: 'Nhỏ hơn'
            },
            {
              value: 'greater',
              label: 'Lớn hơn'
            },
            {
              value: 'range',
              label: 'Khoảng'
            }
          ]}
          fieldProps={{
            onChange: (value) => {
              if (value === 'range') {
                setOptionRangeSearch(value);
                setShowRangeTo(true);
              }
              else {
                setShowRangeTo(false);
                setOptionRangeSearch(value);
              }
            },
            value: optionRangeSearch
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              if (optionRangeSearch !== 'range') {
                setSelectedKeys([JSON.stringify([optionRangeSearch, searchRange])])
              }
              else {
                setSelectedKeys([JSON.stringify([optionRangeSearch, searchRange, searchRangeTo])])
              }
              handleSearchRange(selectedKeys, confirm);
            }}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleResetRange(clearFilters, confirm)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Làm mới
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
      if (typeof value === 'string') {
        const convertValue = JSON.parse(value);
        if (convertValue[0] === 'lesser') {
          if (record.pZero < convertValue[1]) {
            return record;
          }
        }
        else if (convertValue[0] === 'greater') {
          if (record.pZero > convertValue[1]) {
            return record;
          }
        }
        else {
          if (record.pZero >= convertValue[1] && record.pZero <= convertValue[2]) {
            return record
          }
        }
      }
      return null;
    }
    ,
  });


  const confirm = (entity: any, message: any, api: string, id: any) => {
    Modal.confirm({
      title: configDefaultText['titleConfirm'],
      icon: <ExclamationCircleOutlined />,
      content: message,
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {

        const update = await handleUpdateMany({
          ...entity,
          fairId: props.fairId
        }, api, id);
        if (update) {
          props.onCloseModal();

          if (actionRef.current && actionRefMega.current) {
            setSelectedRowsCPass([]);
            setSelectedRowsMega([]);
            actionRef.current?.reloadAndRest?.();
            actionRefMega.current?.reloadAndRest?.();
          }
        }

      }
    });
  };


  useEffect(() => {
    const fetchDataFair = async () => {
      const getFairData = await getFair(props.fairId as any);
      setFair(getFairData);
    }
    fetchDataFair();
  }, []);

  function renderTableAlert(selectedRowKeys: any) {
    return (
      <Fragment>
        Đã chọn <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> mục&nbsp;&nbsp;
      </Fragment>
    );
  }


  function renderTableAlertOption(selectedRowKeys: any, onCleanSelected: any) {
    if (selectedRowKeys && selectedRowKeys.length > 0 && selectedRowsMega && selectedRowsMega.length === 1) {
      return (
        <>
          <Fragment>
            <Button
              type='primary'
              key='primary'
              onClick={() => {
                setShowConfirmAssign(true);
              }}
            >
              <PlusOutlined /> Chỉ định
            </Button>
          </Fragment>
        </>
      );
    }
    else {
      return <></>
    }

  }



  const columns: ProColumns<any>[] = [
    {
      key: 'code',
      dataIndex: 'code',
      title: configDefaultText['page.addMegaAndAssign.column.aleger'],
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
            </a>

            {(entity?.phone || entity?.email) ? <br /> : ''}  {entity?.phone}{entity?.phone && entity.email ? `|` : ''}{entity?.email}
            {entity?.passport ? <><br />CCCD/HC:{entity?.passport}</> : ``}
          </>
        );
      },
    },
    {
      title: configDefaultText['page.addMegaAndAssign.column.buyCPass'],
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
      title: configDefaultText['page.addMegaAndAssign.column.cPass'],
      ...getColumnSearchProps('code'),
      render: (_, entity: any) => {
        return (
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
      title: configDefaultText['page.addMegaAndAssign.column.farm'],
      dataIndex: 'farm',
      valueType: 'textarea',
      key: 'farm',
      ...getColumnSearchProps('farmName'),
      renderText: (_, text) => text.farmName ? text.farmName : null


    },
    {
      title: configDefaultText['page.addMegaAndAssign.column.birthdate'],
      dataIndex: 'birthdate',
      valueType: 'textarea',
      key: 'birthdate',
      renderText: (_, text: any) => {
        return moment(text?.birthdate).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY');
      }

    },

    {
      title: configDefaultText['page.addMegaAndAssign.column.firstWeight'],
      dataIndex: 'firstWeight',
      valueType: 'textarea',
      key: 'firstWeight',
      renderText: (_, text: any) => text?.firstWeight
    },
    {
      title: configDefaultText['page.addMegaAndAssign.column.age'],
      dataIndex: 'age',
      valueType: 'textarea',
      key: 'age',
      renderText: (_, text: any) => {
        let age = Math.floor(moment(moment()).diff(text?.birthdate, 'days') / 7);
        if (age === 0) {
          return `0`;
        }
        let confiAge = `${age / 4 >= 1 ? `${Math.floor(age / 4)}Th` : ''} ${age % 4 !== 0 ? (age % 4) + 'T' : ''}`;
        return confiAge;
      }
    },
    {
      title: configDefaultText['page.addMegaAndAssign.column.bodyCondition'],
      dataIndex: 'bodyCondition',
      valueType: 'textarea',
      key: 'bodyCondition',
      render: (_, text: any) => {
        return (<Text style={{ color: text?.colorBodyCondition }}>{text?.textBodyCondition}</Text>);
      },
      filters: bodyCondition,
      onFilter: true,

    },
    {
      title: configDefaultText['page.addMegaAndAssign.column.pZero'],
      dataIndex: 'pZero',
      valueType: 'textarea',
      key: 'pZero',
      renderText: (_, text: any) => {
        return text?.pZero;
      },
      ...getColumnSearchRange()
    },
    {
      title: configDefaultText['page.addMegaAndAssign.column.vs'],
      dataIndex: 'vs',
      valueType: 'textarea',
      key: 'vs',
      renderText: (_, text: any) => {
        return text?.vs.toLocaleString();
      }
    },
    {
      title: configDefaultText['page.addMegaAndAssign.column.vZero'],
      dataIndex: 'vZero',
      valueType: 'textarea',
      key: 'vZero',
      renderText: (_, text: any) => {
        return text?.vZero.toLocaleString();
      }
    },
    {
      title: configDefaultText['page.addMegaAndAssign.column.megaS'],
      dataIndex: 'megaS',
      valueType: 'textarea',
      key: 'megaS',
      render: (_, text: any) => text?.megaS.toLocaleString()
    },
  ];




  return (
    <>
      <ProTable
        toolbar={{
          settings: [{
            key: 'reload',
            tooltip: configDefaultText['reload'],
            icon: <ReloadOutlined />,
            onClick: () => {
              if (actionRefMega.current) {
                actionRefMega.current.reload();
              }
            }
          }]
        }}
        headerTitle={configDefaultText['page.addMegaAndAssign.titleAleger']}
        actionRef={actionRefMega}
        rowKey='id'
        search={false}
        rowClassName={
          (entity) => {
            return entity.classColor
          }
        }

        scroll={{
          x: window.innerWidth * 0.75
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

        request={async () => {
          const data = await customAPIGetOne(props.fairId, 'users/list-and-cpass', {});
          return {
            data: data,
            success: true,
            total: data?.length
          }
        }}
        columns={columns}
        dataSource={fair?.c_passes}
        rowSelection={{
          onChange: (_, selectedRows: any) => {
            setSelectedRowsMega(selectedRows);
          },
          type: 'radio'
        }}

        tableAlertRender={false}
        tableAlertOptionRender={false}
      />


      <ProTable
        headerTitle={(<>
          {configDefaultText['fair']} {fair?.code}
        </>)}
        actionRef={actionRef}
        rowKey='id'
        search={false}
        rowClassName={
          (entity) => {
            return entity.classColor
          }
        }
        scroll={{
          x: window.innerWidth * 0.75
        }}

        request={async () => {
          const data = await customAPIPostOne(props.fairId, 'fairs/cpass-not-owner', {});
          const { c_passes } = data;
          return {
            data: c_passes,
            success: true,
            total: c_passes?.length
          }
        }}
        columns={columnCPass}
        dataSource={fair?.c_passes}
        rowSelection={{
          onChange: (_, selectedRows: any) => {
            setSelectedRowsCPass(selectedRows);
          },
        }}

        toolbar={{
          settings: [{
            key: 'reload',
            tooltip: configDefaultText['reload'],
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

        tableAlertRender={({ selectedRowKeys }: any) => {
          return renderTableAlert(selectedRowKeys);
        }}

        tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }: any) => {
          return renderTableAlertOption(selectedRowKeys, onCleanSelected)
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
        />)
      }

      {
        showConfirmAssign && (
          <ConfirmAssign
            openModal={showConfirmAssign}
            cPass={selectedRowsCPass}
            mega={selectedRowsMega[0]}
            fairId={props.fairId}
            onCloseModal={() => {
              setShowConfirmAssign(false);
              actionRef.current?.reloadAndRest?.();
              setCurrentRowCPass([])
            }}
          />
        )
      }
    </>
  );
};

export default TableListAssignCPass;


