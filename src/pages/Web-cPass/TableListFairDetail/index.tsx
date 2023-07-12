import { customAPIDowload, customAPIDowloadPDF, customAPIGet, customAPIPostOne, customAPIUpdateMany } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import {

  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useParams } from '@umijs/max';
import { Button, Checkbox, Dropdown, Input, List, Menu, message, Modal, Space, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
const { Text, } = Typography;
import moment from 'moment';
import './styles.css';
import DetailUser from '@/pages/components/DetailUser';
import DetailCPass from '@/pages/components/DetailCPass';
import TableListAssignCPass from '../TableListAssignCPass';
import configText from '@/locales/configText';
const configDefaultText = configText;

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
  } catch (error: any) {
    hide();
    message.error(error?.response.data.error.message || 'Lỗi');
    return false;
  }
};

const getBodyCondition = async () => {
  const data = await customAPIGet(
    {
    },
    'body-conditions/get/option',
  );
  return data.data
}

const TableListFairDetail: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);
  const [codeCPass, setCodeCPass] = useState<any>(null);

  const [currentCPass, setCurrentCPass] = useState<any>();
  const [showModalMega, setShowModalMega] = useState<boolean>(false);
  const [fair, setFair] = useState<any>();
  const searchInput = useRef(null);
  const params = useParams();

  const [bodyCondition, setBodyCondition] = useState<any>();

  const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
  const [searchRange, setSearchRange] = useState<any>();
  const [searchRangeTo, setSearchRangeTo] = useState<any>();
  const [optionRangeSearch, setOptionRangeSearch] = useState<any>();


  useEffect(() => {
    const getValues = async () => {
      const optionBodyCondition = await getBodyCondition();
      setBodyCondition(optionBodyCondition);
    };
    getValues();
  }, []);

  const confirm = (entity: any, message: any, api: string, id: any) => {
    Modal.confirm({
      title: configDefaultText['titleConfirm'],
      icon: <ExclamationCircleOutlined />,
      content: message,
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        await handleUpdateMany({
          cPass: [entity.id],
          fairId: params?.id
        }, api, id);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    });
  };


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
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters,
      //close
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
    onFilter: (value?: any, record?: any) => {
      if (dataIndex === 'aleger') {
        if (record.megaOrder) {
          if (record.megaOrder['id'] && record.megaOrder['id'].toString().toLowerCase().includes(value.toLowerCase())) {
            return record.megaOrder['id'].toString().toLowerCase().includes(value.toLowerCase());
          }
          if (record.megaOrder['username'] && record.megaOrder['username'].toString().toLowerCase().includes(value.toLowerCase())) {
            return record.megaOrder['username'].toString().toLowerCase().includes(value.toLowerCase());
          }

          if (record.megaOrder['email'] && record.megaOrder['email'].toString().toLowerCase().includes(value.toLowerCase())) {
            return record.megaOrder['email'].toString().toLowerCase().includes(value.toLowerCase());
          }

          if (record.megaOrder['phone'] && record.megaOrder['phone'].toString().toLowerCase().includes(value.toLowerCase())) {
            return record.megaOrder['phone'].toString().toLowerCase().includes(value.toLowerCase());
          }

          if (record.megaOrder['passport'] && record.megaOrder['passport'].toString().toLowerCase().includes(value.toLowerCase())) {
            return record.megaOrder['passport'].toString().toLowerCase().includes(value.toLowerCase());
          }
        }
      }
      else {
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
      }

    }
    ,
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
          // allowClear={true}
        
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


  const columns: ProColumns<any>[] = [
    {
      key: 'code',
      dataIndex: 'code',
      title: <FormattedMessage id='pages.searchTable.column.cPass' defaultMessage='Thẻ tai|cPass' />,
      ...getColumnSearchProps('code'),
      render: (_, entity: any) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity.id);
              setShowDetail(true);
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
      renderText: (_, text) => text.farmName ? text.farmName : null


    },
    {
      title: <FormattedMessage id='pages.searchTable.column.birthdate' defaultMessage='Ngày sinh' />,
      dataIndex: 'birthdate',
      valueType: 'textarea',
      key: 'birthdate',
      renderText: (_, text: any) => {
        return moment(text?.birthdate).format('DD/MM/YYYY');
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.firstWeight' defaultMessage='Pss (kg)' />,
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
        let age = Math.floor(moment(moment()).diff(text?.birthdate, 'days') / 7);
        if (age === 0) {
          return 0;
        }
        let confiAge = `${age / 4 >= 1 ? `${Math.floor(age / 4)}Th` : ''} ${age % 4 !== 0 ? (age % 4) + 'T' : ''}`;
        return confiAge;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.bodyCondition' defaultMessage='Thể trạng' />,
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
      title: <FormattedMessage id='pages.searchTable.column.pZero' defaultMessage='P0 (kg)' />,
      dataIndex: 'pZero',
      valueType: 'textarea',
      key: 'pZero',
      renderText: (_, text: any) => {
        return text?.pZero;
      },
      ...getColumnSearchRange()
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.vs' defaultMessage='Vs (VNĐ)' />,
      dataIndex: 'vs',
      valueType: 'textarea',
      key: 'vs',
      renderText: (_, text: any) => {
        return text?.vs.toLocaleString();
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.vZero' defaultMessage='V0 (VNĐ)' />,
      dataIndex: 'vZero',
      valueType: 'textarea',
      key: 'vZero',
      renderText: (_, text: any) => {
        return text?.vZero.toLocaleString();
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.megaS' defaultMessage='MegaS (VNĐ)' />,
      dataIndex: 'megaS',
      valueType: 'textarea',
      key: 'megaS',
      render: (_, text: any) => text?.megaS.toLocaleString()
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.megaS' defaultMessage='Đã thanh toán' />,
      dataIndex: 'payment',
      valueType: 'textarea',
      key: 'payment',
      align: 'center',
      render: (_, text: any) => {
        if (text.check === 'owner') {
          return (<>
            <Checkbox checked disabled > </Checkbox>
          </>)
        }
        else {
          return (<>
            <Checkbox disabled checked={false}> </Checkbox>
          </>)
        }
       
      },
      filters: [
        {
          text: 'Đã thanh toán',
          value: 'payment'
        },
        {
          text: 'Đã quá hạn',
          value: 'expired'
        }
      ],
      onFilter: (value, record) => {
        if (value === 'payment') {
          if (record.owner) {
            return record
          }
        }
        else {
          if (record.classColor === 'background-red') {
            return record;
          }
        }
      },
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.mega' defaultMessage='Mega' />,
      dataIndex: 'mega',
      valueType: 'textarea',
      key: 'mega',
      render: (_, text: any) => {
        if (text.check === 'owner') {
          return (
            <a
              onClick={() => {
                setCurrentRowUser(text.owner.id);
                setShowDetailUser(true);
              }}
            >
              {`${text?.owner?.fullname ? text?.owner?.fullname : text?.owner?.username} - ${text?.owner.id}`}
            </a>
          )
        }
        if (text.check === 'order') {
          return (
            <a
              onClick={() => {
                setCurrentRowUser(text.megaOrder.id);
                setShowDetailUser(true);
              }}
            >
              {`${text?.megaOrder.fullname ? text?.megaOrder.fullname : text?.megaOrder.username} - ${text?.megaOrder.id}`}
            </a>
          )
        }
      },
      ...getColumnSearchProps('aleger')
    },



    {
      title: configDefaultText['page.listFair.titleOption'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      align: 'center',
      render: (_, entity: any) => {
        const menu = (
          <Menu>
            {entity.check === 'order' ? (<Menu.Item key="1"
              onClick={() => {
                confirm(entity, <>Loại bỏ Mega:<strong> { entity.megaOrder && entity.megaOrder.fullname ? entity.megaOrder.fullname : entity.megaOrder.username } - {entity.megaOrder.id}</strong> khỏi cPass:<strong> {entity.code}</strong></>, 'c-passes/update/removemega', null as any)
              }}
            >{configDefaultText['page.DetailCPass.menu.removeMega']}</Menu.Item>)
              : (<></>)
            }

            {entity.check === 'none' ? (
              <>
                <Menu.Item key="2"
                  onClick={() => {
                    setCurrentCPass(entity.id);
                    setCodeCPass(entity.code);
                   
                    setShowModalMega(true)
                  }}
                >{configDefaultText['page.DetailCPass.menu.assignMega']}</Menu.Item>

                <Menu.Item key="3"
                  onClick={() => confirm(entity, <>Loại bỏ cPass: <strong> {entity.code}</strong> khỏi phiên?</>, 'fairs/remove-cpasses', params.id)}
                >{configDefaultText['page.DetailCPass.menu.removeCPass']}</Menu.Item>
              </>

            ) : (<></>)}
          </Menu>
        );
        return (
          entity?.check === 'owner' ? (<></>) : (<>
            <Dropdown overlay={menu} trigger={['click']} placement='bottom'>
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()} >
                {configDefaultText['handle']}
              </a>
            </Dropdown>
          </>)
        )
      }
    },
  ];

  const listData = [
    {
      title: 'Đợt mở bán',
      value: fair?.code
    },
    {
      title: 'Ngày mở bán',
      value: fair?.timeStart ? `${moment(fair?.timeStart).format('DD/MM/YYYY HH:mm')}` : ''
    },
    {
      title: 'Ngày đóng bán',
      value: fair?.timeEnd ? `${moment(fair?.timeEnd).format('DD/MM/YYYY HH:mm')}` : ''
    },
    {
      title: 'Ngày bắt đầu nuôi',
      value: fair?.dateStartFeed ? `${moment(fair?.dateStartFeed).format('DD/MM/YYYY HH:mm')}` : ''
    },
  ];


 

  return (
    <>
      <ProTable
        headerTitle={(<>
          <div className='list-fair'>
            <List
              itemLayout="horizontal"
              dataSource={listData}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<span style={{
                      marginTop: '4px'
                    }}>{item.title}</span>}
                  />
                  <div>{item.value}</div>
                </List.Item>
              )}
            />
          </div>
        </>)}
        actionRef={actionRef}
        rowKey='id'
        search={false}
        rowClassName={
          (entity) => {
            return entity.classColor
          }
        }
        toolBarRender={() => {
          return [
            // eslint-disable-next-line react/jsx-no-undef
            <Button
              type='primary'
              key='excel'
              onClick={async () => {
                await customAPIDowload('fairs/cpass-of-fair/excel', params?.id, {

                });
              }}
            >
              <PlusOutlined /> Excel
            </Button>,

            <Button
              type='primary'
              key='primary'
              onClick={async () => {
                await customAPIDowloadPDF('fairs/cpass-of-fair/pdf', params?.id as any);
              }}
            >
              <PlusOutlined /> PDF
            </Button>,
          ]
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
            next_page: 'Trang sau',
            prev_page: 'Trang trước',
          },
          showTotal: (total, range) => {
            return `${range[range.length - 1]} / Tổng số: ${total}`
          }
        }}

        request={async () => {

          const data = await customAPIPostOne(params.id, 'fairs/cpass-of-fair', {});
          const { c_passes, ...other } = data;
          setFair({
            ...other
          });
          return {
            data: c_passes,
            success: true,
            total: c_passes.length
          };
        }}
        columns={columns}
        dataSource={fair?.c_passes}
        scroll={{
          x: window.innerWidth * 0.7
        }}
      />


      {currentRow && (
        <DetailCPass
          openModal={showDetail}
          idCPass={currentRow}
          closeModal={() => {
            setCurrentRow(undefined);
            setShowDetail(false);
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


      {
        currentCPass && (<>
          <TableListAssignCPass
            openModal={showModalMega}
            currentCPass={currentCPass}
            codeCPass={codeCPass}
            fairId={params?.id}
            onReload={
              () => {
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }
            onCloseModal={() => {
              setCurrentCPass(undefined);
              setShowModalMega(false);
            }}
          />
        </>)
      }
    </>

  );
};

export default TableListFairDetail;
