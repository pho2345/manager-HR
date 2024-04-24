import {
  get,
} from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormTextArea,
  ProFormUploadButton,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProTable,

} from '@ant-design/pro-components';
import {
  Dropdown,
  Image, Menu, UploadFile, UploadProps
} from 'antd';

import configText from '@/locales/configText';
const configDefaultText = configText;


import {
  FormattedMessage,
  useParams
} from '@umijs/max';
import { Avatar, Button, Col, Drawer, Form, Input, Modal, Row, Space, Tooltip, message } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import AddNew from './AddNew';
import { getOption, handleAdd2 } from '@/services/utils';
import { MdOutlineEdit } from 'react-icons/md';
import AddBonus from '@/reuse/bonus/AddBonus';
import AddDiscipline from '@/reuse/discipline/AddDiscipline';
import AddGOB from '@/reuse/go-on-business/AddGOB';
import AddCerLang from '@/reuse/languages/AddLanguages';
import AddCerTech from '@/reuse/techs/AddCerTech';






const handleRemove = async (selectedRows: any) => {

  const hide = message.loading('Đang xóa...');
  if (!selectedRows) return true;
  try {
    const deleteRowss = selectedRows.map((e: any) => {
    });

    await Promise.all(deleteRowss);
    hide();
    message.success('Xóa thành công');
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response?.data?.error?.message);
    return false;
  }
};



const TableList: React.FC = () => {
  const collection = `${SERVER_URL_PROFILE}/nhan-vien/ho-so`;
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refId = useRef<any>();
  const refName = useRef<string>();
  const refSoCMND = useRef<string>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [form] = Form.useForm<any>();
  const searchInput = useRef(null);
  const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
  const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
  const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
  const [optionRangeSearch, setOptionRangeSearch] = useState<any>();

  const [religion, setReligion] = useState<GEN.Option[]>([]);
  const [membership, setMembership] = useState<GEN.Option[]>([]);


  const [openBus, setOpenBus] = useState<boolean>(false);
  const [openDiscipline, setOpenDiscipline] = useState<boolean>(false);
  const [openGOB, setOpenGOB] = useState<boolean>(false);
  const [openCerLang, setOpenCerLang] = useState<boolean>(false);
  const [openCerTech, setOpenCerTech] = useState<boolean>(false);


  const [visible, setVisible] = useState(false);


  const params = useParams();
  useEffect(() => {
    const getValues = async () => {
      // const getReligion = await getOption(`${SERVER_URL_CONFIG}/dan-toc`, 'id', 'name');
      // setReligion(getReligion);
    };
    getValues();
  }, []);

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
      return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
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

  const clearResetRange = (clearFilters: any, confirm: any) => {
    clearFilters();
    setSearchRangeFrom(null);
    setSearchRangeTo(null);
    confirm({
      closeDropdown: false,
    });
  };


  const getColumnSearchRange = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters,
      //close
    }: any) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {
          showRangeTo && (<>
            <Row gutter={24} className="m-0">
              <Col span={24} className="gutter-row p-0" >
                <ProFormDatePicker
                  fieldProps={{
                    style: {
                      width: '100%'
                    },
                    onChange: (e: any) => {
                      if (e) {
                        setSearchRangeFrom(moment(e['$d']).toISOString());
                      }
                    },
                    value: searchRangeFrom
                  }}
                  placeholder={'Thời gian từ'}


                />
              </Col>
            </Row>
            <Row gutter={24} className="m-0">
              <Col span={24} className="gutter-row p-0" >
                <ProFormDatePicker
                  fieldProps={{
                    style: {
                      width: '100%'
                    },
                    value: searchRangeTo,
                    onChange: (e: any) => {
                      if (e) {
                        setSearchRangeTo(moment(e['$d']).toISOString());
                      }
                    },
                  }}
                  rules={[
                    { required: true, message: configDefaultText['page.listFair.required.timeEnd'] },
                  ]}
                  placeholder={'Thời gian đến'}

                />
              </Col>
            </Row>
          </>
          )
        }
        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormSelect

              options={[
                {
                  value: 'days',
                  label: 'Trong ngày'
                },
                {
                  value: 'weeks',
                  label: 'Trong tuần'
                },
                {
                  value: 'months',
                  label: 'Trong tháng'
                },
                {
                  value: 'years',
                  label: 'Trong năm'
                },
                {
                  value: 'range',
                  label: 'Khoảng'
                }
              ]}
              fieldProps={{
                onChange: (value) => {
                  if (value === 'range') {
                    setShowRangeTo(true);
                  }
                  else {
                    setShowRangeTo(false);
                  }
                  setOptionRangeSearch(value);
                },
              }}
            />
          </Col>
        </Row>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              if (optionRangeSearch !== 'range') {
                setSelectedKeys([JSON.stringify([optionRangeSearch])])
              }
              else {
                setSelectedKeys([JSON.stringify([optionRangeSearch, searchRangeFrom, searchRangeTo])])
              }
              handleSearchRange(selectedKeys, confirm);
              // confirm()\

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
            onClick={() => clearFilters && clearResetRange(clearFilters, confirm)}
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
        const optionValue = convertValue[0];
        if (optionValue === 'range') {
          if (convertValue[1] && convertValue[2]) {
            if (moment(record[dataIndex]).isAfter(convertValue[1]) && moment(record[dataIndex]).isBefore(convertValue[2])) {
              return record
            }
          }
        }
        if (optionValue === 'days') {
          const timeStart = moment().startOf(optionValue).toISOString();
          const timeEnd = moment().endOf(optionValue).toISOString();
          const convert = moment(record[dataIndex]).add(1, 'minutes').toISOString();
          const checkStart = moment(convert).isAfter(timeStart);
          const checkEnd = moment(convert).isBefore(timeEnd);

          if (checkEnd && checkStart) {
            return record
          }


        }
        else {
          const timeStart = moment().startOf(optionValue).toISOString();
          const timeEnd = moment().endOf(optionValue).toISOString();
          if (moment(record[dataIndex]).isAfter(timeStart) && moment(record[dataIndex]).isBefore(timeEnd)) {
            return record;
          }
        }
      }
      return null;
    }
    ,
  });



  const confirm = (entity: any) => {
    Modal.confirm({
      title: configDefaultText['titleConfirm'],
      icon: <ExclamationCircleOutlined />,
      content: configDefaultText['textConfirmDelete'],
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        await handleRemove(entity);
        if (actionRef.current) {
          actionRef.current?.reloadAndRest?.();
        }
      }
    });
  };

  function renderTableAlert(selectedRowKeys: any) {
    return (
      <Fragment>
        Đã chọn <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> mục&nbsp;&nbsp;
      </Fragment>
    );
  }


  function renderTableAlertOption(selectedRows: any) {
    return (
      <>
        <Fragment>
          <Button onClick={async () => {
            //  await confirm(selectedRows as any, 'xóa', actionRef);
            confirm(selectedRows);
            // actionRef.current?.reloadAndRest?.();
          }}>Xóa</Button>
        </Fragment>
      </>
    );
  }

  const columns: ProColumns<GEN.Employee>[] = [
    {
      // title: <FormattedMessage id='page.searchTable.column.code' defaultMessage='Code' />,
      title: 'Ho tên',
      key: 'code',
      dataIndex: 'hovaten',
      ...getColumnSearchProps('code'),
      render: (_, entity) => {
        return (
          <>{entity?.hoVaTen}</>
        );
      },
    },
    {
      title: 'CCCD/CMND',
      dataIndex: 'soCCCD',
      render: (_, text) => text.soCCCD ?? "",
    },

    {
      title: 'Dân tộc',
      dataIndex: 'danToc',
      render: (_, text) => "",
    },
    {
      title: 'Quê quán',
      key: 'queQuan',
      // dataIndex: 'gioiTinh',
      render: (_, entity) => {
        return (
          <>{entity?.queQuan}</>
        );
      },
    },

    {
      title: 'Giới tính',
      key: 'gioiTinh',
      // dataIndex: 'gioiTinh',
      render: (_, entity) => entity.gioiTinh ?? ""

    },
    {
      title: 'Ngày sinh',
      key: 'sinhNgay',
      // dataIndex: 'gioiTinh',
      render: (_, entity) => {
        return (
          <>{entity.sinhNgay ? moment(entity.sinhNgay).format(FORMAT_DATE) : ''}</>
        );
      },
      // filters: farm,
      // onFilter: (value, record) => {
      //   return record?.farm?.id === value;
      // },
    },
    {
      title: 'Chức vụ hiện tại',
      key: 'chucVuHienTai',
      // dataIndex: 'gioiTinh',
      render: (_, entity) => {
        return (
          <>{entity.chucVuDangHienTaiName}</>
        );
      },
      // filters: farm,
      // onFilter: (value, record) => {
      //   return record?.farm?.id === value;
      // },
    },

    {
      title: configDefaultText['titleOption'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      align: 'center',
      render: (_, entity) => {
        const menu = (
          <Menu>

            <Menu.Item key="2"
              onClick={() => {
                setOpenBus(true);
                refId.current = entity.id;
                refName.current = entity?.hoVaTen;
                refSoCMND.current = entity?.soCCCD;
              }}
            >Khen thưởng</Menu.Item>

            <Menu.Item key="3"
              onClick={() => {
                setOpenDiscipline(true);
                refId.current = entity.id;
                refName.current = entity?.hoVaTen;
                refSoCMND.current = entity?.soCCCD;
              }}
            >Kỷ luật</Menu.Item>

            <Menu.Item key="4"
              onClick={() => {
                setOpenGOB(true);
                refId.current = entity.id;
                refName.current = entity?.hoVaTen;
                refSoCMND.current = entity?.soCCCD;
              }}
            >Quá trình công tác</Menu.Item>

            <Menu.Item key="5"
              onClick={() => {
                setOpenCerLang(true);
                refId.current = entity.id;
                refName.current = entity?.hoVaTen;
                refSoCMND.current = entity?.soCCCD;
              }}
            >Ngoại ngữ</Menu.Item>

            <Menu.Item key="6"
              onClick={() => {
                setOpenCerTech(true);
                refId.current = entity.id;
                refName.current = entity?.hoVaTen;
                refSoCMND.current = entity?.soCCCD;
              }}
            >Tin học</Menu.Item>

          </Menu>




        );
        return (
          <Dropdown overlay={menu} trigger={['click']} placement='bottom'>
            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()} >
              {configDefaultText['handle']}
            </a>
          </Dropdown>
        );
      },
    },

  ];


  const add = (fields: any) => {
    return handleAdd2(fields, `${SERVER_URL_ACCOUNT}/nhan-vien/tai-khoan`)
  }

  return (
    !params.id ? (
      <PageContainer>
        <ProTable
          scroll={{
            x: window.innerHeight * 0.75
          }}
          actionRef={actionRef}
          rowKey='id'
          search={false}
          toolBarRender={() => {
            return [
              <Button
                type='primary'
                key='primary'
                onClick={() => {
                  setVisible(true);
                }}
              >
                <PlusOutlined /> {configDefaultText['buttonAdd']}
              </Button>,
            ]
          }}


          pagination={{
            pageSize: 10,
            locale: {
              next_page: configDefaultText['nextPage'],
              prev_page: configDefaultText['prePage'],
            },
            showTotal: (total, range) => {
              return `${range[range.length - 1]} / Tổng số: ${total}`
            }
          }}

          request={async () => get(collection)}
          columns={columns}
          rowSelection={{
            // onChange: (_, selectedRows: any) => {
            //   setSelectedRows(selectedRows);
            // },
          }}

          tableAlertRender={({ selectedRowKeys }: any) => {
            return renderTableAlert(selectedRowKeys);
          }}


          tableAlertOptionRender={({ selectedRows }: any) => {
            return renderTableAlertOption(selectedRows)
          }}

        />

        <ModalForm
          form={form}
          title={<FormattedMessage id="page.hr.modal.addNew.title" defaultMessage="Tạo CBVC" />}
          width={window.innerWidth * 0.3}
          open={visible}

          modalProps={{
            destroyOnClose: true,
            onCancel: () => {
              setVisible(false);
            },
          }}
          onFinish={async (value) => {
            const success = await add(value as API.RuleListItem);
            if (success) {
              setVisible(false);
              form.resetFields();
              if (actionRef.current) {
                actionRef.current.reload();
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
          <Row gutter={24} >
            <Col span={24} >
              <ProFormText
                label={<FormattedMessage id="page.hr.modal.addNew.name" defaultMessage="Tên" />}
                // width='md'
                name='hoVaTen'
                placeholder={`Họ và tên`}
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="page.hr.modal.addNew.require.name" defaultMessage="Vui lòng nhập tên" />
                  },
                ]} />

              <ProFormText
                label={<FormattedMessage id="page.hr.modal.addNew.passport" defaultMessage="CCCD/CMND" />}
                // width='md'
                name='soCCCD'
                placeholder={`CCCD/CMND`}
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="page.hr.modal.addNew.require.passport" defaultMessage="CCCD/CMND" />
                  },
                ]} />

              <ProFormText
                label={<FormattedMessage id="page.hr.modal.addNew.email" defaultMessage="Email" />}
                // width='md'
                name='email'
                placeholder={`Email`}
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="page.HealthStatus.require.email" defaultMessage="Vui lòng nhập email" />
                  },
                ]} />


            </Col>
          </Row>
        </ModalForm>

        <AddBonus actionRef={actionRef} createModalOpen={openBus} handleModalOpen={setOpenBus} id={refId.current} />
        <AddDiscipline actionRef={actionRef} open={openDiscipline} handleOpen={setOpenDiscipline} id={refId.current} />
        <AddGOB actionRef={actionRef} open={openGOB} handleOpen={setOpenGOB} id={refId.current} name={refName.current} soCMND={refSoCMND.current} />
        <AddCerLang actionRef={actionRef} open={openCerLang} handleOpen={setOpenCerLang} id={refId.current} name={refName.current} soCMND={refSoCMND.current} />
        <AddCerTech actionRef={actionRef} open={openCerTech} handleOpen={setOpenCerTech} id={refId.current} name={refName.current} soCMND={refSoCMND.current} />




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
      </PageContainer>) :
      (
        <ProDescriptions
          style={{
            fontSize: 50
          }}
          title="Chi tiết bò"
          column={2}
          layout='horizontal'
          size='middle'

          columns={[
            {
              title: () => {
                return <div style={{ color: 'red', fontSize: '20px' }}> Mã</div>
              },

              key: 'code',
              dataIndex: 'code',
              render: (_, record) => {
                return <div style={{ color: 'red', fontSize: '20px' }}> {record.code}</div>
              }
            },
            {
              title: 'Tên',
              key: 'name',
              dataIndex: 'name',
            },
            {
              title: 'Tuổi',
              key: 'age',
              dataIndex: 'age',
            },
            {
              title: 'Ngày sinh',
              key: 'birthdate',
              dataIndex: 'birthdate',
              valueType: 'date',
            },
            {
              title: 'Cân nặng sơ sinh',
              key: 'firstWeight',
              dataIndex: 'firstWeight',
            },
            {
              title: 'Giới tính',
              key: 'sex',
              dataIndex: 'sex',
            },
            {
              title: 'Trang trại',
              key: 'farm',
              dataIndex: 'farm',
            },
            {
              title: 'Ảnh',
              key: 'photo',
              render: (_, entity) => {
                const photo = entity.photo.map((e: any) => {
                  return (
                    <>
                      <>
                        <Image src={SERVERURL + e} />
                      </>
                    </>
                  )
                })
                return photo;
              }
            }
          ]}
        >
        </ProDescriptions>
      )
  );
};

export default TableList;
