import { customAPIGet, customAPIAdd, customAPIUpdate, customAPIDelete } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormDatePicker, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';

import { Button, Col, Form, Input, InputRef, message, Modal, Row, Space, Tooltip } from 'antd';
import React, { Fragment, useRef, useState } from 'react';
import moment from 'moment';
import { MdOutlineEdit } from 'react-icons/md';
import configText from '@/locales/configText';
const configDefaultText = configText;


const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('Đang thêm...');
  try {
    await customAPIAdd({ ...fields }, 'range-weight-zeros');
    hide();
    message.success('Thêm thành công');
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response?.data?.error?.message);
    return false;
  }
};


const handleUpdate = async (fields: any, id: any) => {
  const hide = message.loading('Đang cập nhật...');
  try {
    await customAPIUpdate({
      ...fields
    }, 'range-weight-zeros', id.current);
    hide();

    message.success('Cập nhật thành công');
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response?.data?.error?.message);
    return false;
  }
};

const handleRemove = async (selectedRows: any) => {
  const hide = message.loading('Đang xóa...');
  try {
    const deleteRows = selectedRows.map((e: any) => {
      return customAPIDelete(e.id, 'range-weight-zeros')
    })
    await Promise.all(deleteRows);
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
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdCateogry = useRef<any>();
  const [form] = Form.useForm<any>();
  const searchInput = useRef<InputRef>(null);
  const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
  const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
  const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
  const [optionRangeSearch, setOptionRangeSearch] = useState<any>();


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
          ref={searchInput}
          placeholder={`Tìm kiếm`}
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
      if (record.attributes[dataIndex]) {
        return record.attributes[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
      }
      return null;
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
        {
          showRangeTo && (<>
            <Row gutter={24} className="m-0">
              <Col span={24} className="gutter-row p-0" >
                <ProFormDatePicker
                  allowClear={false}
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
                  allowClear={false}
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
                onChange: (value: any) => {
                  if (value === 'range') {
                    setShowRangeTo(true);
                  }
                  else {
                    setShowRangeTo(false);
                  }
                  setOptionRangeSearch(value);
                },
                value: optionRangeSearch
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
            if (moment(record.attributes?.createdAt).isAfter(convertValue[1]) && moment(record.attributes?.createdAt).isBefore(convertValue[2])) {
              return record
            }
          }
        }
        else {
          const timeStart = moment().startOf(optionValue).toISOString();
          const timeEnd = moment().endOf(optionValue).toISOString();
          if (moment(record.attributes?.createdAt).isAfter(timeStart) && moment(record.attributes?.createdAt).isBefore(timeEnd)) {
            return record;
          }
        }
      }
      return null;
    }
    ,
  });

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: configDefaultText['page.code'],
      key: 'code',
      dataIndex: 'atrributes',
      render: (_, entity: any) => {
        ;
        return (
          <>
            {entity?.attributes?.code}
          </>
        );
      },
      ...getColumnSearchProps('code')
    },
    {
      title: configDefaultText['page.range'],
      dataIndex: 'index',
      valueType: 'textarea',
      key: 'index',
      ...getColumnSearchProps('index'),
      renderText: (_, text: any) => {

        return text?.attributes?.index;
      }
    },
    {
      title: configDefaultText['page.valueFrom'],
      dataIndex: 'valueFrom',
      valueType: 'textarea',
      key: 'valueFrom',
      renderText: (_, text: any) => {

        return text?.attributes?.valueFrom;
      }
    },
    {
      title: configDefaultText['page.valueTo'],
      dataIndex: 'valueTo',
      valueType: 'textarea',
      key: 'valueTo',
      //...getColumnSearchProps('name'),
      renderText: (_, text: any) => {
        return text?.attributes?.valueTo;
      }
    },
    {
      title: configDefaultText['page.rangeValue'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'profit',
      renderText: (_, text: any) => {

        return `${text?.attributes?.valueFrom} < P0 <= ${text?.attributes?.valueTo}`
      }
    },

    {
      title: configDefaultText['page.createdAt'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'create',
      renderText: (_, text: any) => {
        return moment(text?.attributes?.createdAt).format('DD/MM/YYYY HH:mm')
      },
      ...getColumnSearchRange()
    },

    {
      title: configDefaultText['titleOption'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      align: 'center',
      render: (_, entity: any) => {
        return (<Tooltip
          title={configDefaultText['buttonUpdate']}
        >
          <Button
            onClick={() => {
              handleUpdateModalOpen(true);
              refIdCateogry.current = entity.id;
              form.setFieldsValue({
                index: entity?.attributes?.index,
                code: entity?.attributes?.code,
                valueFrom: entity?.attributes?.valueFrom,
                valueTo: entity?.attributes?.valueTo,
              });

              const { valueFrom, valueTo } = entity?.attributes;
              form.setFieldValue('rangeValue', `${valueFrom} < P0 <= ${valueTo}`)
            }}

            icon={
              <MdOutlineEdit/>
            }
            
            style={{
              border: 'none'
            }}
          />
           </Tooltip>

        )
      }
    },


  ];

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

  return (
    <PageContainer>
      <ProTable

        actionRef={actionRef}
        rowKey='id'
        search={false}
        toolBarRender={() => [
          <Button
            type='primary'
            key='primary'
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> {configDefaultText['buttonAdd']}
          </Button>,
        ]}
        request={() => customAPIGet({ 'sort[0]': 'createdAt:desc' }, 'range-weight-zeros')}
        columns={columns}
        rowSelection={{
          // onChange: (_, selectedRows: any) => {
          //   setSelectedRows(selectedRows);
          // },

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
          },
          totalBoundaryShowSizeChanger: 1

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
        title={configDefaultText['modalCreate']}
        width='35vh'
        open={createModalOpen}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleModalOpen(false);
          },
        }}
        onFinish={async (value) => {
          const success = await handleAdd(value as any);
          if (success) {
            handleModalOpen(false);
            form.resetFields();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        submitter={{
          // render: (_, dom) => (
          //   <div style={{ marginBlockStart: '5vh' }}>
          //     {dom.pop()}
          //     {dom.shift()}
          //   </div>
          // ),
          searchConfig: {
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['buttonAdd'],
          },
        }}

      >
        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.code']
                  // (
                  //   <FormattedMessage
                  //     id='pages.listBodyCondition.code'
                  //     defaultMessage='Nhập mã'
                  //   />
                  // ),
                },
              ]}
              className='w-full'
              name='code'
              label={configDefaultText['page.code']}
              placeholder={configDefaultText['page.code']}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormDigit
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.range']
                  // (
                  //   <FormattedMessage
                  //     id='pages.listWGE.rangeFrom'
                  //     defaultMessage='Nhập giá trị dưới'
                  //   />
                  // ),
                },

              ]}
              className='w-full'
              name='index'
              label={configDefaultText['page.range']}
              placeholder={configDefaultText['page.range']}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormDigit
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.rangFrom']
                  // (
                  //   <FormattedMessage
                  //     id='pages.listWGE.rangeFrom'
                  //     defaultMessage='Nhập giá trị dưới'
                  //   />
                  // ),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const valueTo = getFieldValue('valueTo');
                    if (value && valueTo && Number(value) >= Number(valueTo)) {
                      return Promise.reject('Giá trị dưới phải nhỏ hơn giá trị trên!');
                    }
                    return Promise.resolve();
                  },
                }),

              ]}
              className='w-full'
              name='valueFrom'
              label={configDefaultText['page.rangeFrom']}
              placeholder={configDefaultText['page.rangeFrom']}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormDigit
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.rangTo']
                  // (
                  //   <FormattedMessage
                  //     id='pages.listWGE.rangeTo'
                  //     defaultMessage='Nhập giá trị trên'
                  //   />
                  // ),
                },

                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const valueFrom = getFieldValue('valueFrom');
                    if (value && valueFrom && Number(value) <= Number(valueFrom)) {
                      return Promise.reject('Giá trị trên phải lớn hơn giá trị dưới!');
                    }
                    return Promise.resolve();
                  },
                }),

              ]}

              fieldProps={{
                onChange: (value: any) => {
                  // const name = form.getFieldValue('name');
                  const valueFrom = form.getFieldValue('valueFrom');
                  if (typeof value === 'undefined') {
                    form.setFieldValue('rangeValue', null);
                    return;
                  }

                  if (value > valueFrom) {
                    form.setFieldValue('rangeValue', `${valueFrom} < P0 <= ${value}`);
                    return;
                  }
                  form.setFieldValue('rangeValue', null);
                  return;
                }
              }}
              //label='Nhập giá trị trên'
              min={0}
              className='w-full'
              name='valueTo'
              label={configDefaultText['page.rangeTo']}
              placeholder={configDefaultText['page.rangeTo']}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.rangeValue']
                  // (
                  //   <FormattedMessage
                  //     id='pages.listBodyCondition.name'
                  //     defaultMessage='Nhập tên'
                  //   />
                  // ),
                },
              ]}
              disabled
              className='w-full'
              name='rangeValue'
              label={configDefaultText['page.rangeValue']}
              placeholder={configDefaultText['page.rangeValue']}
            />
          </Col>
        </Row>




      </ModalForm>


      <ModalForm
        form={form}
        title={configDefaultText['modalUpdate']}
        width='35vh'
        open={updateModalOpen}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleUpdateModalOpen(false);
          },
        }}
        onFinish={async (value) => {
          const success = await handleUpdate(value as any, refIdCateogry);
          if (success) {
            handleUpdateModalOpen(false);
            form.resetFields();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}

        submitter={{
          // render: (_, dom) => (
          //   <div style={{ marginBlockStart: '5vh' }}>
          //     {dom.pop()}
          //     {dom.shift()}
          //   </div>
          // ),
          searchConfig: {
            // resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
            // submitText: <FormattedMessage id='buttonUpdate' defaultMessage='Cập nhật' />,
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['buttonUpdate'],
          },
        }}
      >


        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.code']
                  // (
                  //   <FormattedMessage
                  //     id='pages.listBodyCondition.code'
                  //     defaultMessage='Nhập mã'
                  //   />
                  // ),
                },
              ]}
              className='w-full'
              name='code'
              label={configDefaultText['page.code']}
              placeholder={configDefaultText['page.code']}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormDigit
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.range']
                  // (
                  //   <FormattedMessage
                  //     id='pages.listWGE.rangeFrom'
                  //     defaultMessage='Nhập giá trị dưới'
                  //   />
                  // ),
                },

              ]}
              className='w-full'
              name='index'
              label={configDefaultText['page.range']}
              placeholder={configDefaultText['page.range']}
            />
          </Col>
        </Row>


        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormDigit
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.rangFrom']
                  // (
                  //   <FormattedMessage
                  //     id='pages.listWGE.rangeFrom'
                  //     defaultMessage='Nhập giá trị dưới'
                  //   />
                  // ),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const valueTo = getFieldValue('valueTo');
                    if (value && valueTo && Number(value) >= Number(valueTo)) {
                      return Promise.reject('Giá trị dưới phải nhỏ hơn giá trị trên!');
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
              className='w-full'
              name='valueFrom'
              label={configDefaultText['page.rangeFrom']}
              placeholder={configDefaultText['page.rangeFrom']}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormDigit
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.rangTo']
                  // (
                  //   <FormattedMessage
                  //     id='pages.listWGE.rangeTo'
                  //     defaultMessage='Nhập giá trị trên'
                  //   />
                  // ),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const valueFrom = getFieldValue('valueFrom');
                    if (value && valueFrom && Number(value) <= Number(valueFrom)) {
                      return Promise.reject('Giá trị trên phải lớn hơn giá trị dưới!');
                    }
                    return Promise.resolve();
                  },
                }),

              ]}
              //label='Nhập giá trị trên'
              className='w-full'
              name='valueTo'
              label={configDefaultText['page.rangeTo']}
              placeholder={configDefaultText['page.rangeTo']}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.rangeValue']
                  // (
                  //   <FormattedMessage
                  //     id='pages.listBodyCondition.name'
                  //     defaultMessage='Nhập tên'
                  //   />
                  // ),
                },
              ]}
              disabled
              className='w-full'
              name='rangeValue'
              label={configDefaultText['page.rangeValue']}
              placeholder={configDefaultText['page.rangeValue']}
            />
          </Col>
        </Row>


      </ModalForm>

    </PageContainer>
  );
};

export default TableList;
