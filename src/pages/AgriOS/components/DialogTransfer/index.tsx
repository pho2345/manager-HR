import { customAPIAdd, customAPIGet } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns, ProFormDigit } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';

import { Button, message, Modal, Space, Input, Tooltip, Row, Col } from 'antd';
import React, { useRef, useState } from 'react';
import './styles.css';
import configText from '@/locales/configText';
import { MdOutlineCompareArrows } from 'react-icons/md';
const configDefaultText = configText;




const handleAdd = async (fields: any, api: string) => {
  const hide = message.loading('Đang cập nhật...');
  try {
    const updateTransaction = await customAPIAdd(
      fields,
      api);
    hide();
    if (updateTransaction) {
      message.success('Thành công');
    }
    return true;
  } catch (error: any) {
    hide();
    message.error(error.response.data.error.message);
    return false;
  }
};


const formatter = (value: any) => {
  if (value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return '';
};

const parser = (value: any) => {
  if (value) {
    return value.replace(/\$\s?|(,*)/g, '');
  }
  return undefined;
};



const DialogTransfer = (props: any) => {
  const actionRef = useRef<ActionType>();
  //const [selectedRowsMega, setSelectedRowsMega] = useState<any>([]);
  const [showTransfer, setShowTransfer] = useState<boolean>(false);


  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys: any, confirm: any) => {
    confirm();
  };
  const handleReset = (clearFilters: any) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }: any) => (
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
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon={<SearchOutlined />}
            size='small'
            style={{
              width: 90,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size='small'
            style={{
              width: 90,
            }}
          >
            Làm mới
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
            }}
          >
            Lọc
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              close();
            }}
          >
            đóng
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
    }
    ,
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
      }
    },

  });


  const confirm = (entity: any, message: any, api: string) => {
    Modal.confirm({
      title: configDefaultText['titleConfirm'],
      icon: <ExclamationCircleOutlined />,
      content: message,
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {

        await handleAdd({
          ...entity
        }, api);
        if (actionRef.current) {
          actionRef.current.reload();
          setShowTransfer(false);
        }
      }
    });
  };

  

  const columns: ProColumns<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      key: 'code',
      dataIndex: 'code',
      title: configDefaultText['page.transfer.column.aleger'],
      ...getColumnSearchProps('id'),
      render: (_, entity: any) => {
        return (
          <>
            <a
              onClick={() => {
                setCurrentRowUser(entity?.id);
              }}>

              <span style={{
                color: entity?.blocked ? 'red' : ''
              }}>{entity?.fullname ? entity?.fullname : entity?.username}-{entity?.id}</span> </a>
            <br /> {entity?.phone}{entity?.phone && entity.email ? `|` : ''}{entity?.email}
            <br /> {entity?.passport ? `CCCD/HC:${entity?.passport}` : ``}

          </>
        );
      },
    },


    {
      title: configDefaultText['page.transfer.column.ale'],
      dataIndex: 'ale',
      valueType: 'textarea',
      key: 'ale',
      renderText: (_, text: any) => {
        return text?.ale.toLocaleString();
      }
    },
    {
      title: configDefaultText['page.transfer.column.availableBalance'],
      dataIndex: 'availableBalance',
      valueType: 'textarea',
      key: 'availableBalance',
      renderText: (_, text: any) => {
        return text?.availableBalance.toLocaleString();
      }
    },
    {
      title: configDefaultText['page.transfer.column.produceAle'],
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'produceAle',
      renderText: (_, text: any) => {
        return text?.produceAle.toLocaleString();
      }
    },

    {
      title: configDefaultText['page.transfer.column.promoAle'],
      dataIndex: 'promoAle',
      valueType: 'textarea',
      key: 'promoAle',
      renderText: (_, text: any) => {
        return text?.promoAle.toLocaleString();
      }
    },
    {
      title: configDefaultText['titleOption'],
      dataIndex: 'config',
      valueType: 'textarea',
      key: 'config',
      render: (_, text: any) => {

        if (!text?.blocked) {
          return (
            <Space>
              <Tooltip title={configDefaultText['page.transfer.choosen']}><Button
                onClick={() => {
                  setShowTransfer(true);
                  setCurrentRowUser(text);
                }}
                style={{
                  marginLeft: '3px',
                  padding: 0,
                }}
                icon={<MdOutlineCompareArrows style={{
                  fontSize: 20,
                }} />}
              />
              </Tooltip>
            </Space>
          )
        }
        else {
          return <span style={{
            color: 'red'
          }}>Bị khóa</span>
        }
      }
    },
  ];


  return (
    <>

      <ModalForm
        open={props.openModal}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            props.onCloseModal();
          },
        }}
        submitTimeout={2000}
        submitter={false}
      >
        <ProTable
          headerTitle='Chọn Aleger muốn chuyển Ale'
          actionRef={actionRef}
          rowKey='id'
          search={false}
          rowClassName={

            (entity) => {
              return entity.classColor
            }
          }

          request={async () => {
            const data = await customAPIGet({}, 'users/aleger');
            const configData = data?.data.filter((e: any) => e?.id !== props?.megaChoosen?.id);
            return {
              data: configData,
              success: true,
              total: configData.length
            };
          }}

          columns={columns}

          pagination={{
            locale: {
              next_page: configDefaultText['nextPage'],
              prev_page: configDefaultText['prePage'],
            },
            showTotal: (total, range) => {
              return `${range[range.length - 1]} / Tổng số: ${total}`
            }
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


        />
      </ModalForm>

      {currentRowUser && (
        <ModalForm
          width={window.innerWidth * 0.3}
          title={(<>Số Ale có thể chuyển: <span style={{ color: 'red' }}>{props.megaChoosen.availableBalance.toLocaleString()}</span></>)}
          open={showTransfer}
          modalProps={{
            destroyOnClose: true,
            onCancel: () => {
              setShowTransfer(false);
            },
          }}
          onFinish={async (values) => {
            confirm({
              receiverId: currentRowUser.id,
              senderId: props?.megaChoosen?.id,
              ale: values?.ale
            },
              <>Chắc chắn chuyển <strong>{values.ale}</strong> Ale từ Aleger:<strong> {props?.megaChoosen?.fullname ? props?.megaChoosen?.fullname : props?.megaChoosen?.username} - {props?.megaChoosen?.id}</strong>  
           sang Aleger:<strong> {currentRowUser.fullname ? currentRowUser.fullname : currentRowUser.username} - {currentRowUser.id}</strong></>,
              'transactions/transfer-admin');

            return true;
          }}
          submitter={{
            searchConfig: {
              resetText: configDefaultText['buttonClose'],
              submitText: configDefaultText['submit'],
            },
          }}
        >

          <Row gutter={24} className='m-0'>
            <Col span={24} className='gutter-row p-0' >

              <ProFormDigit
                className='w-full'
                label={configDefaultText['page.transfer.ale']}
                placeholder={configDefaultText['page.transfer.ale']}
                name='ale'
                min={1}
                max={props?.megaChoosen?.availableBalance}
                fieldProps={{
                  precision: 2,
                  formatter,
                  parser,
                }}
              />
            </Col>

            
          </Row>


        </ModalForm>
      )}

    </>
  );
};

export default DialogTransfer;


