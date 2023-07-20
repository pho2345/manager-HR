import { customAPIDowload, customAPIDowloadPDF, customAPIGet, customAPIGetOne, customAPIUpdateMany } from '@/services/ant-design-pro/api';
import { ActionType, ModalForm, ProColumns, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, Link, useParams } from '@umijs/max';
import { Avatar, Button, Col, Dropdown, Form, Input, Menu, Row, Space, Tooltip, Typography, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { MdOutlineHistory } from 'react-icons/md';
const { Text } = Typography;
import configText from '@/locales/configText';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { BsGraphUpArrow } from 'react-icons/bs';
import Chart from './components/Chart';
const configDefaultText = configText;

const handleUpdate = async (fields: any, id: any, api: string) => {
  const hide = message.loading('Đang cập nhật...');
  try {
    await customAPIUpdateMany({
      ...fields
    }, api, id);
    hide();

    message.success('Cập nhật thành công');
    return true;
  } catch (error) {
    console.log(error);
    hide();
    message.error('Cập nhật thất bại!');
    return false;
  }
};

const getPlan = async (id: any) => {
  try {
    const getPlan = await customAPIGetOne(id, 'fairs/plan', {});
    return getPlan;
  } catch (error) {

  }
}


const getBodyCondition = async () => {
  const data = await customAPIGet(
    {
    },
    'body-conditions/get/option',
  );
  return data.data
}

const getWGE = async () => {
  const data = await customAPIGet(
    {
    },
    'weight-gain-effects/get/option',
  );
  return data.data
}

const getAWG = async () => {
  const data = await customAPIGet(
    {
    },
    'average-weight-gains/get/option',
  );
  return data.data
}

const getStatusOwner = async () => {
  const data = await customAPIGet(
    {
    },
    'status-owners/get/option',
  );
  return data.data
}

const getStatusTransaction = async () => {
  const data = await customAPIGet(
    {
    },
    'status-transactions/get/option',
  );
  return data.data
}

const getReasonSettlment = async () => {
  const data = await customAPIGet(
    {
    },
    'reason-settlements/get/option',
  );
  return data.data
}



const TableList: React.FC = () => {

  const params = useParams<any>();
  const actionRef = useRef<ActionType>();
  const refIdCpass = useRef<any>();
  const refIdCheckHistory = useRef<any>();
  const [openChart, setOpenChart] = useState<boolean>(false);
  const [plan, setPlan] = useState<any>([]);
  const [openChangeHintName, setOpenChangeHintName] = useState<boolean>(false);
  const [showDowloadFile, setShowDowloadFile] = useState<boolean>(false);
  const [form] = Form.useForm<any>();
  const [optionBodyCondition, setOptionBodyCondition] = useState<any>([]);
  const [optionFair, setOptionFair] = useState<any>([]);
  const [optionWGE, setOptionWGE] = useState<any>([]);
  const [optionAWG, setOptionAWG] = useState<any>([]);
  const [optionStatusOwner, setOptionStatusOwner] = useState<any>([]);
  const [optionStatusTransaction, setOptionStatusTransaction] = useState<any>([]);
  const [optionReasonSettlement, setOptionReasonSettlement] = useState<any>([]);

  const [openChangePlan, setOpenChangePlan] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      const getOptionBodyCondition = getBodyCondition();
      const getOptionWGE = getWGE();
      const getOptionAWG = getAWG();
      const getOptionStatus = getStatusOwner();
      const getOptionStatusTrasaction = getStatusTransaction();
      const getReasonSettlement = getReasonSettlment();
      const getAllData = await Promise.all([getOptionBodyCondition, getOptionWGE, getOptionAWG, getOptionStatus, getOptionStatusTrasaction, getReasonSettlement]);
      setOptionBodyCondition(getAllData[0]);
      setOptionWGE(getAllData[1]);
      setOptionAWG(getAllData[2]);
      setOptionStatusOwner(getAllData[3]);
      setOptionStatusTransaction(getAllData[4]);
      setOptionReasonSettlement(getAllData[5]);
    }
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
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          placeholder={`Tìm kiếm`}
          value={selectedKeys[0]}
          onChange={(e: any) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
            Tìm
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
        onClick={() => {
        }}
      />
    ),
    onFilter: (value: any, record: any) => {
      if (dataIndex === 'cPass') {
        if (record.hintName && record.hintName.toString().toLowerCase().includes(value.toLowerCase())) {
          return record
        }
        if (record.code && record.code.toString().toLowerCase().includes(value.toLowerCase())) {
          return record
        }
      }

      console.log(value);
      return null;
    }
    ,
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {

      }
    },

  });

  const columns: ProColumns<any>[] = [
    {
      title: (<> Đợt mở bán</>),
      dataIndex: 'fair.id',
      valueType: 'textarea',
      key: 'fair.id',
      render: (_, text: any) => {
        return (<>
          {text?.fair?.code}
        </>)
      },
      hideInTable: true,
      filters: optionFair,
      filterSearch: true,
      onFilter: (value, record) => {
        if (record?.fair?.id === value) {
          return record
        }
        return null;
      }
    },

    {
      title: (<> Ngày hết hạn hợp tác</>),
      dataIndex: 'dateEndFeed',
      valueType: 'textarea',
      key: 'dateEndFeed',
      render: (_, text: any) => {
        return (<>
          <br /> {moment(text?.fair?.dateEndFeed).format('DD/MM/YYYY')}
        </>)
      },

    },
    {
      title: <>cPass<br />Tên gợi nhớ</>,
      key: 'code',
      dataIndex: 'atrributes',
      render: (_, entity: any) => {

        return (
          <>
            <a
              onClick={() => {

              }}
            ></a>
            {entity?.code}<br />
            {entity?.hintName}
          </>

        );
      },
      ...getColumnSearchProps('cPass')



    },
    {
      title: (<>
        Giống bò</>),
      dataIndex: 'category',
      valueType: 'textarea',
      key: 'category',
      render: (_, text: any) => {
        let sex = 'Đực';
        if (text?.cow?.sex === 'female') {
          sex = 'Cái';
        }
        return (<>
          {`${text?.cow?.category?.name}`}

        </>)
      }
    },
    {
      title: (<>Giới tính</>),
      dataIndex: 'sex',
      valueType: 'textarea',
      key: 'sex',
      render: (_, text: any) => {
        let sex = 'Đực';
        if (text?.cow?.sex === 'female') {
          sex = 'Cái';
        }
        return (<>
          {sex}
        </>)
      }
    },
    {
      title: (<>Trang trại</>),
      dataIndex: 'farm',
      valueType: 'textarea',
      key: 'farm',
      render: (_, text: any) => {

        return (<>
          {text?.cow?.farm?.name}<br />
        </>)
      }
    },


    {
      title: 'Hình',
      dataIndex: 'image',
      valueType: 'textarea',
      key: 'image',
      render: (_, text: any) => {
        return (
          <Avatar.Group
            maxCount={2}
            maxPopoverTrigger='click'
            size='large'
            maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' }}
          >
            {text?.cow?.photos && text?.cow?.photos.length !== 0 ? text?.cow?.photos?.map((e: any, index: any) => {
              return (
                <Avatar
                  key={index}
                  src={
                    SERVERURL +
                    e?.url
                  }
                />
              );
            }) :
              (<Avatar
                key={'defaultImage'}
                src={
                  'https://aleger-server.process.vn/uploads/cow_Icon2_e7fd247cac.png'
                }
              />)
            }

          </Avatar.Group>
        );
      }
    },
    {
      title: 'Tuổi',
      dataIndex: 'age',
      valueType: 'textarea',
      key: 'age',
      renderText: (_, text: any) => {
        let age = Math.floor(moment(moment()).diff(text?.birthdate || text?.cow?.birthdate, 'days') / 7);
        if (age === 0) {
          return `0`;
        }
        let confiAge = `${age / 4 >= 1 ? `${Math.floor(age / 4)}Th` : ''} ${age % 4 !== 0 ? (age % 4) + 'T' : ''}`;
        return confiAge;
      }
    },
    {
      title: (<>P0 (kg) <br /> Pnow <br /> Snow</>),
      dataIndex: 'P0andPnow',
      width: `15vh`,
      valueType: 'textarea',
      key: 'P0andPnow',
      render: (_, text: any) => {
        return `${text?.pZero}/${text?.nowWeight}@${text?.slotNow?.indexSlot || 0}`
      }
    },

    {
      title: 'Thể trạng',
      dataIndex: 'bodyCondition',
      valueType: 'textarea',
      key: 'bodyCondition',
      render: (_, text: any) => {
        return (<Text style={{ color: text?.colorBodyCondition?.color }}>{text?.colorBodyCondition?.name}</Text>);

      },

      filters: optionBodyCondition,

      onFilter: (value, record) => {
        if (record.bodyCondition === value) return record;
        return null
      },
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.wgePercent' defaultMessage='HQTT' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      align: 'center',
      key: 'wgePercent',
      renderText: (_, text: any) => `${text?.wgePercent}%`,
      filters: optionWGE,
      onFilter: (value, record) => {
        if (record.colorWge?.id === value) {
          return record;
        }
        return null;
      },
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.awgAvg' defaultMessage='TTTB(kg/tuần)' />,
      dataIndex: 'atrributes',
      width: `8vh`,
      align: 'center',
      valueType: 'textarea',
      key: 'awgAvg',
      renderText: (_, text: any) => text?.awgAvg,
      filters: optionAWG,
      onFilter: (value, record) => {
        if (record.awg === value) {
          return record;
        }
        return null;
      },
    },

    {
      title: (<>MegaP (kg)<br />MegaE (VNĐ)<br />MegaCPR</>),
      dataIndex: 'atrributes',
      valueType: 'textarea',
      width: 120,
      key: 'megaP',
      align: 'center',
      render: (_, text: any) => {
        return (<>
          {text?.megaP || 0} <br />
          {text?.megaE.toLocaleString() || 0} <br />
          {text?.megaCPR || 0}%
        </>)
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.plansCPass' defaultMessage='PAHT' />,
      dataIndex: 'plan',
      valueType: 'textarea',
      key: 'plan',
      renderText: (_, text: any) => text?.plan ? `${text?.plan?.name} - ${text?.plan?.profit}` : null
    },


    {
      title: (<>MegaΔP<br />ProduceAle<br />History</>),
      dataIndex: 'megaDeltaProduce',
      valueType: 'textarea',
      key: 'megaDeltaProduce',
      align: 'center',
      render: (_, text: any) => {
        let id = text?.id;
        if (text?.checkHistory) {
          id = text?.cPassId;
        }

        return (<>
          {text?.megaDeltaWeight} <br />
          {text?.produceAle} <br />
          <Tooltip title="Lịch sử"> <Link to={`/web-aleger/c-pass-mega/slot-c-pass/` + id + `?fair=${text?.fair?.id}&owner=${params?.id}`}><MdOutlineHistory style={{
            fontSize: '20px'
          }}>
          </MdOutlineHistory></Link></Tooltip>
        </>)
      }
    },
    {
      title: configDefaultText['page.listCPass.column.graph'],
      dataIndex: 'graph',
      valueType: 'textarea',
      key: 'graph',
      render: (_, text: any) => {
        return (<>
          <Tooltip title={configDefaultText['page.listCPass.column.graph']}>
            <Button
              onClick={() => {
                refIdCpass.current = text?.id;
                refIdCheckHistory.current = text?.checkHistory;
                setOpenChart(true);
              }}
              icon={
                <BsGraphUpArrow />
              }

              style={{
                border: 'none'
              }}
            />
          </Tooltip>
        </>)

      }
    },
    {
      title: (<>Tình trạng sở hữu</>),
      dataIndex: 'statusOwner',
      valueType: 'textarea',
      key: 'statusOwner',
      render: (_, text: any) => {
        return (<Text style={{ color: text?.colorStatusOwner?.color }}>{text?.colorStatusOwner?.name}</Text>);
      },
      filters: optionStatusOwner,
      defaultFilteredValue: ['open'],
      onFilter: (value, record) => {
        if (record?.colorStatusOwner?.value === value && record.colorStatusOwner) {
          return record;
        }
        return null;
      },
    },

    {
      title: (<>Trạng thái giao dịch</>),
      dataIndex: 'statusTransaction',
      valueType: 'textarea',
      key: 'statusTransaction',
      render: (_, text: any) => {
        return (<>
          <Text style={{ color: text?.colorStatusTransaction?.color }}>{text?.colorStatusTransaction?.name}</Text><br />
        </>);
      },
      filters: optionStatusTransaction,
      onFilter: (value, record) => {
        if (record?.colorStatusTransaction?.value === value) {
          return record;
        }
        return null;
      },
    },

    {
      title: (<>Lý do quyết toán</>),
      dataIndex: 'reasonSettlement',
      valueType: 'textarea',
      key: 'reasonSettlement',
      render: (_, text: any) => {
        return (<>
          <Text style={{ color: text?.colorSettlement?.color }}>{text?.colorSettlement?.name}</Text>
        </>);
      },
      filters: optionReasonSettlement,
      onFilter: (value, record) => {
        if (record?.colorSettlement?.value === value) {
          return record;
        }
        return null;
      },
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

            <Menu.Item key="1"
              onClick={() => {
                refIdCpass.current = entity.id;
                setOpenChangeHintName(true);
                form.setFieldValue('hintName', entity?.hintName);
              }}
            >Đặt tên gợi nhớ</Menu.Item>
            <Menu.Item key="2"
              onClick={async () => {
                refIdCpass.current = entity.id;
                const getPlanOfFair = await getPlan(entity?.fair?.id);
                setPlan(getPlanOfFair);
                form.setFieldValue('planId', {
                  value: entity?.plan.id,
                  label: entity?.plan.name,
                })
                setOpenChangePlan(true);
              }}
            >Đổi PAHT</Menu.Item>

          </Menu>
        );
        return (
          entity?.statusTransaction !== 'open' ? (<></>) : (<>
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

  return (
    <PageContainer
      onBack={() => window.history.back()}
    >
      <ProTable
        rowKey='id'
        search={false}
        scroll={{
          x: window.innerWidth * 0.7
        }}
        actionRef={actionRef}
        request={async () => {
          const data = await customAPIGetOne(params?.id, 'c-passes/get/my-c-pass-mega', {});
          if (data && data.data) {
            setOptionFair(data?.fair);
            if (data.data.length > 0) {
              setShowDowloadFile(true);
            }
            else {
              setShowDowloadFile(false);
            }
            return {
              data: data?.data,
              success: true,
              total: data?.length
            }
          }
          else {
            setShowDowloadFile(false);
            return {
              data: data?.data,
              success: true,
              total: data?.length
            }
          }

        }}
        columns={columns}

        pagination={{
          locale: {
            next_page: 'Trang sau',
            prev_page: 'Trang trước',
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

        toolBarRender={() => {
          if (showDowloadFile) {
            return [
              <Button
                type='primary'
                key='primary'
                onClick={async () => {
                  await customAPIDowload('c-passes/get/my-c-pass-mega/excel', params?.id);
                }}
              >
                <PlusOutlined /> Excel
              </Button>,

              <Button
                type='primary'
                key='primary'
                onClick={async () => {
                  await customAPIDowloadPDF('c-passes/get/my-c-pass-mega/pdf', params?.id as any);
                }}
              >
                <PlusOutlined /> PDF
              </Button>,
            ]
          }
          return []

        }}
      />

      {
        openChangePlan && (<>
          <ModalForm
            form={form}
            title={`Đổi PAHT`}
            width='35vh'
            open={openChangePlan}
            modalProps={{
              destroyOnClose: true,
              onCancel: () => {
                setOpenChangePlan(false);
              },
            }}
            onFinish={async (value) => {
              const success = await handleUpdate({
                data: {
                  cPassId: refIdCpass.current,
                  planId: value.planId
                }
              }, null, 'c-passes/admin/change-plan');
              if (success) {
                form.resetFields();
                if (actionRef.current) {
                  actionRef.current.reload();
                  setOpenChangePlan(false);
                }
              }
            }}

            submitter={{
              searchConfig: {
                resetText: configDefaultText['buttonClose'],
                submitText: configDefaultText['buttonAdd'],
              },
            }}
          >

            <Row gutter={24} className="m-0">
              <Col span={24} className="gutter-row p-0" >
                <ProFormSelect
                  rules={[
                    {

                      required: true,
                      message: configDefaultText['page.listFair.required.plans']
                      // (
                      //   <FormattedMessage
                      //     id='pages.listBodyCondition.code'
                      //     defaultMessage='Nhập mã'
                      //   />
                      // ),
                    },
                  ]}
                  options={plan}
                  className='w-full'
                  name='planId'
                  label={`Phương án hợp tác`}
                  placeholder={`Phương án hợp tác`}
                />
              </Col>
            </Row>

          </ModalForm>
        </>)
      }

      {
        openChangeHintName && (<>
          <ModalForm
            form={form}
            title={configDefaultText['modalCreate']}
            width='35vh'
            open={openChangeHintName}
            modalProps={{
              destroyOnClose: true,
              onCancel: () => {
                setOpenChangeHintName(false);
              },
            }}
            onFinish={async (value) => {
              const success = await handleUpdate({
                data: {
                  cPassId: refIdCpass.current,
                  hintName: value.hintName
                }
              }, null, 'c-passes/admin/hint-name');
              if (success) {
                form.resetFields();
                if (actionRef.current) {
                  actionRef.current.reload();
                  setOpenChangeHintName(false);
                }
              }
            }}

            submitter={{
              searchConfig: {
                resetText: configDefaultText['buttonClose'],
                submitText: configDefaultText['submit'],
              },
            }}
          >

            <Row gutter={24} className="m-0">
              <Col span={24} className="gutter-row p-0" >
                <ProFormText
                  rules={[
                    {
                      required: true,
                      message: configDefaultText['page.changeHintName.hintName']
                      // (
                      //   <FormattedMessage
                      //     id='pages.listBodyCondition.code'
                      //     defaultMessage='Nhập mã'
                      //   />
                      // ),
                    },
                  ]}
                  className='w-full'
                  name='hintName'
                  label={configDefaultText['page.changeHintName.hintName']}
                  placeholder={configDefaultText['page.changeHintName.hintName']}
                />
              </Col>
            </Row>

          </ModalForm>
        </>)
      }


      {
        openChart && <Chart
          openModal={openChart}
          types={refIdCheckHistory.current ? 'history' : 'c-pass'}
          cPassId={refIdCpass.current}
          onClose={() => {
            setOpenChart(false);
          }}
        />
      }

    </PageContainer>

  );
};

export default TableList;
