import { customAPIGet, customAPIAdd, customAPIUpdate, customAPIDelete, customAPIGetOne } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';

// import { FormattedMessage } from '@umijs/max';
import { Button, Col, Form, Input, InputRef, message, Modal, Row, Space, Tooltip } from 'antd';
import React, { useRef, useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import { MdOutlineEdit } from 'react-icons/md';
import configText from '@/locales/configText';
import { SketchPicker } from 'react-color';
const configDefaultText = configText;


const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('Đang thêm...');
  try {
    await customAPIAdd({ ...fields }, 'weight-standars');
    hide();
    message.success('Thêm thành công');
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response?.data?.error?.message);
    // message.error('Thêm thất bại!');
    return false;
  }
};


const handleUpdate = async (fields: any, id: any) => {
  console.log(fields);
  const hide = message.loading('Đang cập nhật...');
  try {
    await customAPIUpdate({
      ...fields
    }, 'weight-standars', id.current);
    hide();

    message.success('Cập nhật thành công');
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response?.data?.error?.message);
    // message.error('Cập nhật thất!');
    return false;
  }
};

const handleRemove = async (selectedRows: any) => {
  const hide = message.loading('Đang xóa...');
  try {
    const deleteRowss = selectedRows.map((e: any) => {
      return customAPIDelete(e.id, 'weight-standars')
    })
    await Promise.all(deleteRowss);
    hide();
    message.success('Xóa thành công');
    return true;
  } catch (error: any) {
    console.log(error);
    hide();
    message.error(error?.response?.data?.error?.message);
    return false;
  }
};

const getP0 = async (id: number) => {
  try {
    const data = await customAPIGetOne(id, 'categories/get/range-p-zero', {});
    return data;
  } catch (error) {

  }
}
const TableList: React.FC = () => {
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);


  const actionRef = useRef<ActionType>();
  const refIdCateogry = useRef<any>();
  // const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const searchInput = useRef<InputRef>(null);
  const pickerRef = useRef(null);

  const [openColor, setOpenColor] = useState<boolean>(false);
  const [openColorBackground, setOpenBackground] = useState<boolean>(false);

  const [categories, setCategories] = useState<any>([]);
  const [rangePZero, setRangePZero] = useState<any>([]);

  const [filter, setFilter] = useState<any>();



  const handleClickOutside = (event: any) => {
    if (pickerRef.current && !pickerRef?.current?.contains(event.target)) {
      setOpenColor(false);
      setOpenBackground(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    const getCategory = async () => {
      const data = await customAPIGet({}, 'categories/get/select');
      setCategories(data?.data);
    }
    getCategory();
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleColorPicker = () => {
    // console.log('abc');
    setOpenColor(!openColor);
  };

  const toggleColorBackgroundPicker = () => {
    // console.log('abc');
    setOpenBackground(!openColorBackground);
  };


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
    //setSearchText(selectedKeys[0]);
    //setSearchedColumn(dataIndex);
    //console.log('selectedKeys',selectedKeys[0] );
  };
  const handleReset = (clearFilters: any, confirm: any) => {
    clearFilters();
    // setSearchText('');
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
        //setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text: any) =>{

    // }

  });

  const columns: ProColumns<API.RuleListItem>[] = [
    {

      title: configDefaultText['page.code'],
      key: 'code',
      dataIndex: 'atrributes',
      render: (_, entity: any) => {
        return (
          <>{entity?.code}</>

        );
      },
      ...getColumnSearchProps('code')
    },
    {
      title: configDefaultText['page.wgs.column.category'],
      dataIndex: 'category',
      valueType: 'textarea',
      key: 'category',
      renderText: (_, text: any) => text?.category?.name,
      filters: filter,
      onFilter: (value, record: any) => {
        return record?.id === value;
      },
    },
    {
      title: configDefaultText['page.wgs.column.rangePZero'],
      dataIndex: 'rangePZero',
      valueType: 'textarea',
      key: 'rangePZero',
      //...getColumnSearchProps('name'),
      renderText: (_, text: any) => {
        return `${text?.rangeWeightZero?.valueFrom} < P0 <= ${text?.rangeWeightZero?.valueTo}`;
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.valueTo' defaultMessage='Giá trị trên' />,
      title: configDefaultText['page.wgs.column.slot'],
      dataIndex: 'slot',
      valueType: 'textarea',
      key: 'slot',
      //...getColumnSearchProps('name'),
      renderText: (_, text: any) => {
        return `${text?.slotFrom}~${text?.slotTo}`;
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.value' defaultMessage='Giá trị' />,
      title: configDefaultText['page.wgs.column.wgs'],
      dataIndex: 'rate',
      valueType: 'textarea',
      width: '10vh',
      key: 'rate',
      renderText: (_, text: any) => {
        return `${text?.rate}`;
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.createAt' defaultMessage='Description' />,
      title: configDefaultText['page.createdAt'],
      dataIndex: 'createdAt',
      valueType: 'textarea',
      width: '15vh',
      key: 'createdAt',
      renderText: (_, text: any) => {
        return moment(text?.attributes?.createdAt).format('DD/MM/YYYY HH:mm')
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Option' />,
      title: configDefaultText['titleOption'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      align: 'center',
      render: (_, entity: any) => {
        return (<Tooltip
          title={configDefaultText['buttonUpdate']}
        ><MdOutlineEdit
            onClick={() => {
              handleUpdateModalOpen(true);
              refIdCateogry.current = entity.id;
              form.setFieldsValue({
                category: entity?.category?.id,
                rangeWeightZero: {
                  value: entity?.rangeWeightZero?.id,
                  label: `${entity?.rangeWeightZero?.valueFrom} < P0 <= ${entity?.rangeWeightZero?.valueTo}`
                },
                slotFrom: entity?.slotFrom,
                slotTo: entity?.slotTo,
                rate: entity?.rate
              })

            }}
          /></Tooltip>

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
            //actionRef.current?.reloadAndRest?.();
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
            onClick={async () => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> {configDefaultText['buttonAdd']}
          </Button>,
        ]}
        request={async () => {
          const data = await customAPIGet({ 'sort[0]': 'createdAt:desc' }, 'weight-standars');
          // const output = data?.data.map((item: any) => {
          //   return { text: item.attributes.name, value: item.id };
          // });
          // setFilter(output);
          return data;
        }}
        columns={columns}
        rowSelection={{
          // onChange: (_, selectedRows: any) => {

          //   setSelectedRows(selectedRows);
          // },
        }}

        toolbar={{
          settings: [{
            key: 'reload',
            tooltip: 'Tải lại',
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
            setRangePZero([]);
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
            <ProFormSelect
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.wgs.column.category']
                },
              ]}
              options={categories}
              className='w-full'
              name='category'
              label={configDefaultText['page.wgs.column.category']}
              placeholder={configDefaultText['page.wgs.column.category']}
              fieldProps={{
                onChange: async (value) => {
                  if (value) {
                    const data = await getP0(value);
                    setRangePZero(data);
                  }
                  else {
                    setRangePZero([]);
                  }
                }
              }}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormSelect
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.wgs.column.rangePZero']

                },
              ]}
              disabled={rangePZero && rangePZero?.length === 0}
              className='w-full'
              name='rangeWeightZero'
              label={configDefaultText['page.wgs.column.rangePZero']}
              placeholder={configDefaultText['page.wgs.column.rangePZero']}
              options={rangePZero}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormDigit
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.wgs.slotFrom']
                },
              ]}
              className='w-full'
              name='slotFrom'
              label={configDefaultText['page.wgs.slotFrom']}
              placeholder={configDefaultText['page.wgs.slotFrom']}
              fieldProps={{
                onClick: toggleColorPicker,
                // onChange: handleColorSelect,
              }}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormDigit
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.wgs.slotTo']
                },
              ]}
              className='w-full'
              name='slotTo'
              label={configDefaultText['page.wgs.slotTo']}
              placeholder={configDefaultText['page.wgs.slotTo']}
              fieldProps={{
                onClick: toggleColorPicker,
              }}
            />

          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormDigit
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.wgs.column.wgs']
                },
              ]}
              className='w-full'
              name='rate'
              label={configDefaultText['page.wgs.column.wgs']}
              placeholder={configDefaultText['page.wgs.column.wgs']}
              fieldProps={{
                onClick: toggleColorBackgroundPicker,
              }}
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
          searchConfig: {
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['buttonUpdate'],
          },
        }}
      >

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormSelect
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.wgs.column.category']
                },
              ]}
              options={categories}
              className='w-full'
              name='category'
              label={configDefaultText['page.wgs.column.category']}
              placeholder={configDefaultText['page.wgs.column.category']}
              fieldProps={{
                onChange: async (value) => {
                  if (value) {
                    const data = await getP0(value);
                    setRangePZero(data);
                  }
                  else {
                    setRangePZero([]);
                  }

                }
              }}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormSelect
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.wgs.column.rangePZero']

                },
              ]}

              className='w-full'
              name='rangeWeightZero'
              label={configDefaultText['page.wgs.column.rangePZero']}
              placeholder={configDefaultText['page.wgs.column.rangePZero']}
              options={rangePZero}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormDigit
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.wgs.slotFrom']
                },
              ]}
              className='w-full'
              name='slotFrom'
              label={configDefaultText['page.wgs.slotFrom']}
              placeholder={configDefaultText['page.wgs.slotFrom']}
              fieldProps={{
                onClick: toggleColorPicker,
                // onChange: handleColorSelect,
              }}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormDigit
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.wgs.slotTo']
                },
              ]}
              className='w-full'
              name='slotTo'
              label={configDefaultText['page.wgs.slotTo']}
              placeholder={configDefaultText['page.wgs.slotTo']}
              fieldProps={{
                onClick: toggleColorPicker,
              }}
            />

          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormDigit
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.wgs.column.wgs']
                },
              ]}
              className='w-full'
              name='rate'
              label={configDefaultText['page.wgs.column.wgs']}
              placeholder={configDefaultText['page.wgs.column.wgs']}
              fieldProps={{
                onClick: toggleColorBackgroundPicker,
              }}
            />
          </Col>
        </Row>
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
