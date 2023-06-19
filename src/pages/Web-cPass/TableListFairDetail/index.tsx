import { customAPIDowload, customAPIDowloadPDF, customAPIPostOne, customAPIUpdateMany } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import {

  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useParams } from '@umijs/max';
import { Button, Checkbox, Dropdown, Input, List, Menu, message, Modal, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
const { Text, } = Typography;
import moment from 'moment';
import "./styles.css";
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
  } catch (error) {
    hide();
    message.error('Cập nhật thất bại!');
    return false;
  }
};

const TableListFairDetail: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);
  // const [selectedRowsState, setSelectedRows] = useState<number[]>([]);

  const [currentCPass, setCurrentCPass] = useState<any>();
  const [showModalMega, setShowModalMega] = useState<boolean>(false);
  const [fair, setFair] = useState<any>();
  const searchInput = useRef(null);
  const params = useParams();

  const confirm = (entity: any, message: string, api: string, id: any) => {
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
    //setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
    //console.log('selectedKeys', selectedKeys[0]);
  };
  const handleReset = (clearFilters: any, confirm: any) => {
    clearFilters();
    //setSearchText('');
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
    onFilter: (value: any, record: any) => {
      console.log('value', dataIndex)
      if (typeof value !== 'number') {
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
      }

    }
    ,
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
        // setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text: any) =>{
    // }
  });


  const columns: ProColumns<any>[] = [
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
      title: <FormattedMessage id='pages.searchTable.column.pZero' defaultMessage='P0 (kg)' />,
      dataIndex: 'pZero',
      valueType: 'textarea',
      key: 'pZero',
      renderText: (_, text: any) => {
        return text?.pZero;
      }
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
      dataIndex: 'megaS',
      valueType: 'textarea',
      key: 'megaS',
      align: 'center',
      render: (_, text: any) => {
        if (text.check === 'owner') {
          return (<>
            <Checkbox checked disabled > </Checkbox>
          </>)
        }
        return (<>
          <Checkbox disabled > </Checkbox>
        </>)

      }
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
      }
    },



    {
      // title: <FormattedMessage id='page.listFair.titleOption' defaultMessage='Thao tác' />,
      title: configDefaultText['page.listFair.titleOption'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      align: 'center',
      render: (_, entity: any) => {
        const menu = (
          <Menu>
            {entity.check === 'order' ? (<Menu.Item key="1"
              onClick={() => confirm(entity, configDefaultText['page.DetailCPass.message.removeCPassMega'], 'c-passes/update/removemega', null as any)}
            >{configDefaultText['page.DetailCPass.menu.removeMega']}</Menu.Item>)
              : (<></>)
            }

            {entity.check === 'none' ? (
              <>
                <Menu.Item key="2"
                  onClick={() => {
                    setCurrentCPass(entity.id);
                    setShowModalMega(true)
                  }}
                >{configDefaultText['page.DetailCPass.menu.assignMega']}</Menu.Item>

                <Menu.Item key="3"
                  onClick={() => confirm(entity, configDefaultText['page.DetailCPass.message.removeCPassFair'], 'fairs/remove-cpasses', params.id)}
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
      {/* <Text>{`Đợt mở bán: ${fair?.code}`}</Text>
      <Text>{`Ngày mở bán: ${fair?.timeStart ? `${moment(fair?.timeStart).format('DD/MM/YYYY HH:mm')}` : ''} `}</Text>
      <Text>{`Ngày đóng bán: ${fair?.timeEnd ? `${moment(fair?.timeEnd).format('DD/MM/YYYY HH:mm')}` : ''}`}</Text>
      <Text>{`Ngày bắt đầu nuôi: ${fair?.dateStartFeed ? `${moment(fair?.dateStartFeed).format('DD/MM/YYYY HH:mm')}` : ''}`}</Text>
      <br /> */}



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
                await customAPIDowloadPDF('fairs/cpass-of-fair/pdf', params?.id);
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

        // request={() => customAPIGet({}, 'banks')}
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
        //dataSource={} 
        columns={columns}
        dataSource={fair?.c_passes}
      // rowSelection={{
      //   onChange: (_, selectedRows: any) => {

      //     setSelectedRows(selectedRows);
      //   },
      // }}
      />
      {/* {selectedRowsState?.length > 0 && (
        // <FooterToolbar
        //   extra={
        //     <div>
        //       <FormattedMessage id='pages.searchTable.chosen' defaultMessage='Chosen' />{' '}
        //       <a style={{ fontWeight: 600 }}>{selectedRowsState.length} hàng</a>{' '}


        //     </div>
        //   }
        // >
        //   <Button
        //     onClick={async () => {
        //       //await handleRemove(selectedRowsState);
        //       setSelectedRows([]);
        //       actionRef.current?.reloadAndRest?.();
        //     }}
        //   >
        //     <FormattedMessage
        //       id='pages.searchTable.batchDeletion'
        //       defaultMessage='Batch deletion'
        //     />
        //   </Button>
        //   <Button type='primary'>
        //     <FormattedMessage
        //       id='pages.searchTable.batchApproval'
        //       defaultMessage='Batch approval'
        //     />
        //   </Button>
        // </FooterToolbar>
      )} */}

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
