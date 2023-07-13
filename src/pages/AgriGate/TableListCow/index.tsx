import {
  customAPIGet,
  customAPIAdd,
  customAPIUpdate,
  customAPIDelete,
  customAPIUpload,
  customAPIGetOne,
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
  Image, UploadFile, UploadProps
} from 'antd';

import configText from '@/locales/configText';
const configDefaultText = configText;


import {
  useParams
} from '@umijs/max';
import { Avatar, Button, Col, Drawer, Form, Input, Modal, Row, Space, Tooltip, message } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { MdOutlineEdit } from 'react-icons/md';


const handleAdd = async (fields: any) => {
  const hide = message.loading('Đang thêm...');
  try {
    hide();


    const cow = await customAPIAdd({ ...fields }, 'cows');

    if (fields?.upload && cow) {
      const uploadImages = fields?.upload.map((e: any) => {
        let formdata = new FormData();
        formdata.append('files', e?.originFileObj);
        formdata.append('ref', 'api::cow.cow');
        formdata.append('refId', cow?.id);
        formdata.append('field', 'photos');
        return customAPIUpload({
          data: formdata
        })
      });
      const photoCow = await Promise.all(uploadImages);
    }

    message.success('Thêm thành công');
    return true;
  } catch (error: any) {
    message.error(error?.response?.data?.error?.message);
    return false;
  }
};


const handleUpdate = async (fields: any, id: any) => {
  const hide = message.loading('Đang cập nhật...');
  try {
    let uploadImages: any[] = [];
    let photoCowCustom: any[] = [];
    if (fields?.photos && fields.photos.length !== 0) {
      fields?.photos.map((e: any) => {
        if (e.originFileObj) {
          let formdata = new FormData();
          formdata.append('files', e?.originFileObj);
          formdata.append('ref', 'api::cow.cow');
          formdata.append('refId', id.current);
          formdata.append('field', 'photos');
          uploadImages.push(customAPIUpload({
            data: formdata
          }))
        }
        else {
          photoCowCustom.push(e.uid)
        }
        return null;
      });
    }

    let photoCow = await Promise.all(uploadImages);
    if (photoCow.length !== 0) {
      photoCow.map((e) => {
        photoCowCustom.push(e[0].id)
      })
    }
    fields.photos = photoCowCustom
    await customAPIUpdate(
      {
        ...fields,
      },
      'cows',
      id.current,
    );
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
  if (!selectedRows) return true;
  try {
    const deleteRowss = selectedRows.map((e: any) => {
      return customAPIDelete(e.id, 'cows');
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

const getCategory = async () => {
  const categories = await customAPIGet({}, 'categories');
  let data = categories.data.map((e: any) => {
    return {
      value: e?.id,
      label: e?.attributes?.name,
      text: e?.attributes?.name
    };
  });
  return data;
};

const getFarm = async () => {
  const categories = await customAPIGet({}, 'farms');
  let data = categories.data.map((e: any) => {
    return {
      value: e?.id,
      text: e?.attributes?.name,
      label: e?.attributes?.name,
    };
  });
  return data;
};

const getGroupFarm = async (id: number) => {
  const fetchDataGroupFarm = await customAPIGetOne(id, 'group-cows/get/find-of-farm', {});
  const configGroupFarm = fetchDataGroupFarm?.map((e: any) => {
    return {
      label: e?.name,
      value: e?.id
    }
  });
  return configGroupFarm;
}



const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdCow = useRef<any>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [form] = Form.useForm<any>();
  const [category, setCategory] = useState<any>();
  const [farm, setFarm] = useState<any>();
  const [groupCow, setGroupCow] = useState<any>([]);
  const searchInput = useRef(null);
  const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
  const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
  const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
  const [optionRangeSearch, setOptionRangeSearch] = useState<any>();

  const [fileList, setFileList] = useState<UploadFile[]>([]);


  const params = useParams();
  const refIdPicture = useRef<any>();
  useEffect(() => {
    const getValues = async () => {
      let getCate = await getCategory();
      let getFarms = await getFarm();
      setCategory(getCate);
      setFarm(getFarms);
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

  const columns: ProColumns<any>[] = [
    {
      // title: <FormattedMessage id='page.searchTable.column.code' defaultMessage='Code' />,
      title: configDefaultText['page.listCow.column.code'],
      key: 'code',
      dataIndex: 'atrributes',
      ...getColumnSearchProps('code'),
      render: (_, entity: any) => {
        return (
          <>{entity?.code}</>
        );
      },
    },

    {
      title: configDefaultText['page.listCow.column.name'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'name',
      ...getColumnSearchProps('name'),

      renderText: (_, text: any) => text?.name,
    },

    {
      title: configDefaultText['page.listCow.column.farm'],
      key: 'farmName',
      dataIndex: 'atrributes',
      render: (_, entity: any) => {
        return (
          <>{entity?.farm?.name}</>
        );
      },
      filters: farm,
      onFilter: (value, record) => {
        return record?.farm?.id === value;
      },
    },
    {
      title: configDefaultText['page.listCow.column.firstWeight'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'firstWeight',
      width: '10vh',
      renderText: (_, text: any) => text?.firstWeight,
    },
    {
      title: configDefaultText['page.listCow.column.photos'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'photos',
      render: (_, text: any) => {
        return (
          <Avatar.Group
            maxCount={2}
            maxPopoverTrigger='click'
            size='large'
            maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' }}
          >

            {text?.photos && text?.photos?.length !== 0 ? text?.photos?.map((e: any, index: any) => {
              return (
                <Avatar
                  key={index}
                  src={
                    SERVERURL +
                    e?.url
                  }
                />
              );
            }) : (<Avatar
              key={'defaultImage'}
              src={
                'https://aleger-server.process.vn/uploads/cow_Icon2_e7fd247cac.png'
              }
            />)
            }

          </Avatar.Group>
        );
      },
    },

    {
      title: configDefaultText['page.listCow.column.sex'],
      dataIndex: 'sex',
      valueType: 'textarea',
      width: '10vh',
      key: 'sex',
      renderText: (_, text: any) => {
        if (text?.sex === 'male') {
          return 'Đực';
        }
        return 'Cái';
      },
      filters: [
        {
          text: 'Đực',
          value: 'male'
        },
        {
          text: 'Cái',
          value: 'female'
        },
      ],
      onFilter: true
    },

    {
      title: configDefaultText['page.listCow.column.category'],
      dataIndex: 'category',
      valueType: 'textarea',
      key: 'category',
      renderText: (_, text: any) => text?.category?.name,
      filters: category,
      onFilter: (value, record) => {
        return record.category.id === value;

      }
    },
    {
      title: configDefaultText['page.listCow.column.age'],
      dataIndex: 'atrributes',
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
      title: configDefaultText['page.listCow.column.birthdate'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'birthdate',
      renderText: (_, text: any) => {
        return moment(text?.birthdate).format('DD/MM/YYYY');
      },
      ...getColumnSearchRange('birthdate')
    },

    {
      title: configDefaultText['titleOption'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      align: 'center',
      render: (_, entity: any) => {
        return (
          <Tooltip title={configDefaultText['buttonUpdate']}>
            <Button

              style={{
                border: 'none'
              }}

              onClick={async () => {
                handleUpdateModalOpen(true);
                refIdCow.current = entity.id;
                const cow = await customAPIGetOne(entity.id, 'cows/find', {});
                const photos = cow.photos;
                if (photos) {
                  const photoCow = photos.map((e: any) => {
                    return { uid: e.id, status: 'done', url: SERVERURL + e.url };
                  });
                  setFileList(photoCow);

                  form.setFieldsValue({
                    ...cow,
                    category: cow.category?.id,
                    farm: cow.farm?.id,
                    upload: photoCow,
                    group_cow: {
                      label: cow?.group_cow?.name,
                      value: cow?.group_cow?.id
                    }

                  })
                }
                else {
                  form.setFieldsValue({
                    ...cow,
                    category: cow.category?.id,
                    farm: cow.farm?.id,
                    group_cow: {
                      label: cow?.group_cow?.name,
                      value: cow?.group_cow?.id
                    }
                  })
                }
              }}

              icon={
                <MdOutlineEdit />
              }
            />
          </Tooltip>
        );
      },
    },

  ];

  const disabledDate = (current: any) => {
    return current && current > moment();
  };


  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    if (fileList.length > 5) {
      const maxImages = newFileList.slice(0, 5);
      setFileList(maxImages);
    }
    else {
      setFileList(newFileList);
    }
  }

  const handleRemoveImage = (file: any) => {
    const updatedFileList = fileList.filter((f: any) => f.uid !== file.uid);
    setFileList(updatedFileList);
  };

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
                  handleModalOpen(true);
                }}
              >
                <PlusOutlined /> {configDefaultText['buttonAdd']}
              </Button>,
            ]
          }}

          toolbar={{
            settings: [{
              key: 'reload',
              tooltip: configDefaultText['reload'],
              icon: <ReloadOutlined></ReloadOutlined>,
              onClick: () => {
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }]
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

          request={() =>
            customAPIGet(
              {},
              'cows/find',
            )
          }
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
          title={configDefaultText['modalCreate']}
          open={createModalOpen}
          form={form}
          autoFocusFirstInput
          modalProps={{
            destroyOnClose: true,
            onCancel: () => {
              handleModalOpen(false);
              setGroupCow([]);
              setFileList([])
            },
          }}
          submitTimeout={2000}
          onFinish={async (values) => {
            //await waitTime(2000);
            const success = await handleAdd(values as any);
            if (success) {
              handleModalOpen(false);
              form.resetFields();
              setGroupCow(null);
              setFileList([])
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
            //message.success('Success');
            return true;
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
              // submitText: <FormattedMessage id='buttonAdd' defaultMessage='Thêm' />,
              resetText: configDefaultText['buttonClose'],
              submitText: configDefaultText['buttonAdd'],
            },
          }}
        >





          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormText
                className='w-full'
                name='name'
                label={configDefaultText['page.listCow.column.name']}
                placeholder={configDefaultText['page.listCow.column.name']}
                rules={[
                  // { required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                  { required: true, message: configDefaultText['page.listCow.required.name'] },
                ]}
              />
            </Col>

            <Col span={12} className="gutter-row p-0">

              <ProFormDigit
                min={1}
                className='w-full'
                name='firstWeight'
                label={configDefaultText['page.listCow.column.firstWeight']}
                placeholder={configDefaultText['page.listCow.column.firstWeight']}

                rules={[
                  // { required: true, message: <FormattedMessage id='page.listCow.required.firstWeight' defaultMessage='Vui lòng nhập P0' /> },
                  { required: true, message: configDefaultText['page.listCow.column.firstWeight'] },
                ]}
              />
            </Col>
          </Row>


          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormSelect options={category}
                label={configDefaultText['page.listCow.column.category']}
                placeholder={configDefaultText['page.listCow.column.category']}
                className='w-full'
                name='category'
                rules={[
                  // { required: true, message: <FormattedMessage id='page.listCow.required.category' defaultMessage='Vui lòng chọn giống bò' /> },
                  { required: true, message: configDefaultText['page.listCow.required.category'] },
                ]}
              />
            </Col>


            <Col span={12} className="gutter-row p-0" >
              <ProFormDatePicker

                // className='w-full
                // style={{ width: '100%' }}
                fieldProps={{
                  style: {
                    width: '100%'
                  },
                  disabledDate: disabledDate
                }}
                name='birthdate'
                label={configDefaultText['page.listCow.column.birthdate']}
                placeholder={configDefaultText['page.listCow.column.birthdate']}
                rules={[
                  //{ required: true, message: <FormattedMessage id='page.listCow.required.birthdate' defaultMessage='Vui lòng chọn ngày sinh' /> },
                  { required: true, message: configDefaultText['page.listCow.required.birthdate'] },
                ]}
              />
            </Col>
          </Row>


          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormSelect options={farm} className='w-full' name='farm'
                label={configDefaultText['page.listCow.column.farm']}
                placeholder={configDefaultText['page.listCow.column.farm']}
                rules={[
                  {
                    required: true, message: configDefaultText['page.listCow.required.farm'
                    ]
                  },
                ]}
                fieldProps={{
                  onChange: async (value) => {
                    const groupCow = await getGroupFarm(value);
                    setGroupCow(groupCow);
                    form.setFieldValue('group_cow', []);
                  }
                }}
              />
            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormSelect className='w-full'
                options={groupCow?.length ? groupCow : null}
                label={configDefaultText['page.listCow.column.group_cow']}
                placeholder={configDefaultText['page.listCow.column.group_cow']}
                name={`group_cow`}
                rules={[
                  { required: true, message: configDefaultText['page.listCow.required.group_cow'] },
                ]}
              />
            </Col>
          </Row>



          <Row gutter={24} className="m-0">


            <Col span={12} className="gutter-row p-0">
              <ProFormSelect
                className='w-full'
                name='sex'

                label={configDefaultText['page.listCow.column.sex']}
                placeholder={configDefaultText['page.listCow.column.sex']}
                options={[
                  {
                    label: 'Đực',
                    value: 'male',
                  },
                  {
                    label: 'Cái',
                    value: 'female',
                  },
                ]}
                rules={[
                  // { required: true, message: <FormattedMessage id='page.listCow.required.sex' defaultMessage='Vui lòng chọn giới tính' /> }
                  { required: true, message: configDefaultText['page.listCow.required.sex'] }
                ]}
              />
            </Col>
          </Row>

          <ProFormUploadButton
            name="upload"
            title={configDefaultText['page.listCow.column.upload']}
            label={configDefaultText['page.listCow.column.upload']}
            fileList={fileList}
            onChange={handleChange}
            max={5}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              onRemove: handleRemoveImage, // Pass the handleRemove function as the onRemove callback
              accept: 'image/*',
              multiple: true,
              beforeUpload: (file: any, fileSize) => {
                if (fileList.length > 5) {
                  return false;
                }
                else {
                  return true;
                }

              },
            }}
          />


          <ProFormTextArea
            label={configDefaultText['page.listCow.column.description']}
            placeholder={configDefaultText['page.listCow.column.description']}
            name='description'
            rules={[
              // { required: true, message: <FormattedMessage id='page.listCow.required.sex' defaultMessage='Vui lòng chọn giới tính' /> }
              { required: true, message: configDefaultText['page.listCow.required.description'] }
            ]}
            fieldProps={{
              maxLength: 500
            }}
          />
        </ModalForm>

        <ModalForm

          title='Cập nhật'
          open={updateModalOpen}
          form={form}
          autoFocusFirstInput
          modalProps={{
            destroyOnClose: true,
            onCancel: () => {
              handleUpdateModalOpen(false);
              refIdPicture.current = null;
              setFileList([]);

            },
          }}

          submitTimeout={2000}
          onFinish={async (values) => {
            const success = await handleUpdate(values as any, refIdCow as any);


            if (success) {
              handleUpdateModalOpen(false);
              form.resetFields();
              if (actionRef.current) {
                setFileList([]);
                actionRef.current.reload();
                refIdPicture.current = null;
              }
            }
            return true;
          }}

          submitter={{
            searchConfig: {
              resetText: configDefaultText['buttonClose'],
              submitText: configDefaultText['buttonUpdate'],
            },
          }}
        >


          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormText
                className='w-full'
                name='name'
                label={configDefaultText['page.listCow.column.name']}
                placeholder={configDefaultText['page.listCow.column.name']}
                rules={[
                  { required: true, message: configDefaultText['page.listCow.required.name'] },
                ]}
              />
            </Col>

            <Col span={12} className="gutter-row p-0">

              <ProFormDigit
                min={1}
                className='w-full'

                name='firstWeight'
                label={configDefaultText['page.listCow.column.firstWeight']}
                placeholder={configDefaultText['page.listCow.column.firstWeight']}
                rules={[
                ]}
              />
            </Col>
          </Row>


          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormSelect options={category}
                label={configDefaultText['page.listCow.column.category']}
                placeholder={configDefaultText['page.listCow.column.category']}
                className='w-full'
                name='category'
                rules={[
                  { required: true, message: configDefaultText['page.listCow.required.category'] },
                ]}
              />
            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormSelect
                className='w-full'
                name='sex'

                label={configDefaultText['page.listCow.column.sex']}
                placeholder={configDefaultText['page.listCow.column.sex']}
                options={[
                  {
                    label: 'Đực',
                    value: 'male',
                  },
                  {
                    label: 'Cái',
                    value: 'female',
                  },
                ]}
                rules={[
                  { required: true, message: configDefaultText['page.listCow.required.sex'] }
                ]}
              />
            </Col>
          </Row>


          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormSelect options={farm} className='w-full' name='farm'
                label={configDefaultText['page.listCow.column.farm']}
                placeholder={configDefaultText['page.listCow.column.farm']}
                rules={[
                  {
                    required: true, message: configDefaultText['page.listCow.required.farm'
                    ]
                  },
                ]}
                fieldProps={{
                  onChange: async (value) => {
                    const groupCow = await getGroupFarm(value);
                    setGroupCow(groupCow);
                    form.setFieldValue('group_cow', []);
                  }
                }}
              />
            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormSelect className='w-full'
                options={groupCow?.length ? groupCow : null}
                label={configDefaultText['page.listCow.column.group_cow']}
                placeholder={configDefaultText['page.listCow.column.group_cow']}
                name={`group_cow`}
                rules={[
                  { required: true, message: configDefaultText['page.listCow.required.group_cow'] },
                ]}
              />
            </Col>
          </Row>



          <Row gutter={24} className="m-0">

            <Col span={12} className="gutter-row p-0" >
              <ProFormDatePicker className='w-full' name='birthdate'
                fieldProps={{
                  style: {
                    width: '100%'
                  },
                  disabledDate: disabledDate
                }}
                label={configDefaultText['page.listCow.column.birthdate']}
                placeholder={configDefaultText['page.listCow.column.birthdate']}
                rules={[
                  { required: true, message: configDefaultText['page.listCow.required.birthdate'] },

                ]}
              />
            </Col>


          </Row>

          <ProFormUploadButton
            name="photos"
            title={configDefaultText['page.listCow.column.upload']}
            label={configDefaultText['page.listCow.column.upload']}
            fileList={fileList}
            onChange={handleChange}
            max={5}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              onRemove: handleRemoveImage, // Pass the handleRemove function as the onRemove callback
              accept: 'image/*',
              multiple: true,
              beforeUpload: (file: any, fileSize) => {
                if (fileList.length > 5) {
                  return false;
                }
                else {
                  return true;
                }
              },
            }}
          />

          <ProFormTextArea
            label={configDefaultText['page.listCow.column.description']}
            placeholder={configDefaultText['page.listCow.column.description']}
            name='description'
            rules={[
              { required: true, message: configDefaultText['page.listCow.required.description'] }
            ]}
          />

        </ModalForm>
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
          request={async () => {
            let cowDetail = await customAPIGetOne(params?.id, 'cows', { 'populate[0]': 'photos', 'populate[1]': 'farm', 'populate[2]': 'category', });


            const photo = cowDetail?.data.attributes.photos?.data?.map((e: any) => {
              return e.attributes.url;
            })
            let data = {
              code: cowDetail?.data.attributes.code,
              name: cowDetail?.data.attributes.name,
              age: cowDetail?.data.attributes.age,
              birthdate: cowDetail?.data.attributes.birthdate,
              firstWeight: cowDetail?.data.attributes.firstWeight,
              sex: cowDetail?.data.attributes.sex,
              farm: cowDetail?.data.attributes.farm?.data.attributes.name,
              photo: photo

            }

            return Promise.resolve({
              success: true,
              data: data
            });
          }}
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
