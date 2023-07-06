import { customAPIGet, customAPIAdd, customAPIDelete, customAPIUpdate, customAPIGetOne, customAPIUpload, customAPIDowload, customAPIDowloadPDF } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormUploadButton } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { BsGraphUpArrow } from 'react-icons/bs';
import { MdOutlineEdit } from 'react-icons/md';
import { Avatar, Button, Col, Form, Input, message, Modal, Row, Space, Tooltip, Typography, UploadFile, UploadProps } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import DetailCPass from './components/DetailCPass';
import configText from '@/locales/configText';
import Chart from '@/pages/components/Chart';
const configDefaultText = configText;

const { Text } = Typography;

const handleAdd = async (fields: any) => {

  const hide = message.loading('Đang chờ...');
  try {
    await customAPIAdd({ ...fields }, 'c-passes/create');
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
    let photoCowCustom: any[] = [];
    let { category, farm, group_cow, cow, birthdate, sex, ...other } = fields;
    let fieldCow = {
      category: category?.value || category,
      farm: farm?.value || farm,
      group_cow: group_cow?.value || group_cow,
      birthdate: birthdate,
      sex
    }
   
    const updateCPass = await customAPIUpdate(
      {
        cow,
        ...other
      },
      'c-passes',
      id.current
    );

      let uploadImages: Array<any> = [];
      if (fields?.photos && fields.photos.length !== 0) {
        fields?.photos.map((e: any) => {
          if (e.originFileObj) {
            let formdata = new FormData();
            formdata.append('files', e?.originFileObj);
            formdata.append('ref', 'api::cow.cow');
            formdata.append('refId', fields.cow.value);
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
      
      let photoCow = await Promise.all(uploadImages);
      if(photoCow.length !== 0){
        photoCow.map((e) => {
          photoCowCustom.push(e[0].id);
        })
      }

      const updateCow = await customAPIUpdate(
        {
          ...fieldCow,
          photos: photoCowCustom
        },
        'cows',
        cow.value
      );
    }

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
      return customAPIDelete(e.id, 'c-passes')
    })

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


const disabledDate = (current: any) => {
  return current && current > moment();
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

const getCownotInCpass = async () => {
  const categories = await customAPIGet({ 'filters[c_pass][id][$null]': true }, 'cows');
  let data = categories.data.map((e: any) => {
    return {
      value: e?.id,
      label: e?.attributes?.name,
    }
  })
  return data;
}

const getCategory = async () => {
  const categories = await customAPIGet({}, 'categories');
  let data = categories.data.map((e: any) => {
    return {
      value: e?.id,
      label: e?.attributes?.name,
    };
  });
  return data;
};


const getFarm = async () => {
  const farm = await customAPIGet({}, 'farms');
  let data = farm.data.map((e: any) => {
    return {
      value: e?.id,
      label: e?.attributes?.name,
      text: e?.attributes?.name
    };
  });
  return data;
};

const getGroup = async () => {
  const farm = await customAPIGet({}, 'group-cows');
  let data = farm.data.map((e: any) => {
    return {
      value: e?.id,
      label: e?.attributes?.name,
      text: e?.attributes?.description
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
  const [openChart, setOpenChart] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdCpass = useRef<any>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [form] = Form.useForm<any>();
  const [cow, setCow] = useState<any>();

  const [category, setCategory] = useState<any>();
  const [farm, setFarm] = useState<any>();
  const refIdPicture = useRef<any>();

  const [groupCow, setGroupCow] = useState<any>([]);
  const [getAllGroup, setGetAllGroup] = useState<any>([]);
  const searchInput = useRef(null);

  const [showDowloadFile, setShowDowloadFile] = useState<boolean>(false);



  const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
  const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
  const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
  const [optionRangeSearch, setOptionRangeSearch] = useState<any>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);



  useEffect(() => {
    const getValues = async () => {
      let getCow = await getCownotInCpass();
      let getCate = await getCategory();
      let getFarms = await getFarm();
      let getGroups = await getGroup();
      setCategory(getCate);
      setFarm(getFarms);
      setCow(getCow);
      setGetAllGroup(getGroups);
    }
    getValues();
  }, [])

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
          const getCow = await getCownotInCpass();
          setCow(getCow);
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
            confirm(selectedRows);
          }}>Xóa</Button>
        </Fragment>
      </>
    );
  }


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

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    if (fileList && fileList.length > 5) {
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

  const columns: ProColumns<any>[] = [

    {
      title: configDefaultText['page.listCPass.column.code'],
      key: 'code',
      dataIndex: 'atrributes',
      ...getColumnSearchProps('code'),
      render: (_, entity: any) => {

        return (
          <a
            onClick={() => {
              setCurrentRow(entity?.id);
              setShowDetail(true);
            }}
          >
            {entity?.code}
          </a>
        );
      },



    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.groupCow' defaultMessage='Nhóm' />,
      title: configDefaultText['page.listCPass.column.groupCow'],
      dataIndex: 'groupCow',
      valueType: 'textarea',
      key: 'groupCow',
      renderText: (_, text: any) => {
        return `${text?.descriptionGroup}`
      },
      filters: getAllGroup,
      filterSearch: true,
      onFilter: (value, record) => {
        return record?.groupId === value
      }
    },

    {
      // title: <FormattedMessage id='page.searchTable.column.name' defaultMessage='name' />,
      title: configDefaultText['page.listCow.column.name'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'name',
      ...getColumnSearchProps('nameCow'),
      renderText: (_, text: any) => text?.nameCow,
    },
    {
      title: (<>
        {configDefaultText['page.listCPass.column.category']}</>),
      dataIndex: 'category',
      valueType: 'textarea',
      key: 'category',
      render: (_, text: any) => {
        return (<>
          {text?.category}
        </>)
      },
    },
    {
      title: (<>{configDefaultText['page.listCPass.column.sex']}</>),
      dataIndex: 'sex',
      valueType: 'textarea',
      key: 'sex',
      render: (_, text: any) => {
        let sex = 'Đực';
        if (text?.sex === 'female') {
          sex = 'Cái';
        }
        return (<>
          {sex}
        </>)
      },
    },
    {
      title: (<>{configDefaultText['page.listCPass.column.farm']}</>),
      dataIndex: 'farm',
      valueType: 'textarea',
      key: 'farm',
      render: (_, text: any) => {
        return (<>
          {text?.farm}<br />
        </>)
      },
      filterSearch: true,
      filters: farm,
      onFilter: (value, record) => {
        return value === record.farmId
      }
    },


    {
      title: configDefaultText['page.listCPass.column.image'],
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
      }
    },

    {
      title: configDefaultText['page.listCPass.column.birthdate'],
      dataIndex: 'birthdate',
      valueType: 'textarea',
      key: 'birthdate',
      renderText: (_, text: any) => {
        return `${moment(text?.birthdate).format('DD/MM/YYYY')}`;
      },
      ...getColumnSearchRange('birthdate')
    },
    {
      title: configDefaultText['page.listCPass.column.firstWeight'],
      dataIndex: 'firstWeight',
      valueType: 'textarea',
      key: 'firstWeight',
      renderText: (_, text: any) => {
        return text.firstWeight;
      }
    },
    {
      title: configDefaultText['page.listCPass.column.age'],
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
      title: configDefaultText['page.listCPass.column.pNow'],
      dataIndex: 'P0andPnow',
      valueType: 'textarea',
      key: 'P0andPnow',
      render: (_, text: any) => {
        return `${text?.nowWeight}  `
      }
    },

    {
      title: configDefaultText['page.listCPass.column.bodyCondition'],
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
      title: configDefaultText['page.listCPass.column.wgePercent'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'wgePercent',
      renderText: (_, text: any) => `${text?.wgePercent}%`
    },

    {
      title: configDefaultText['page.listCPass.column.awgAvg'],

      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'awgAvg',
      renderText: (_, text: any) => text?.awgAvg
    },

    {
      title: configDefaultText['page.listCPass.column.graph'],
      dataIndex: 'graph',
      valueType: 'textarea',
      key: 'graph',
      render: (_, text: any) => {
        if (text?.owner) {
          return (<>
            <Tooltip title={configDefaultText['page.listCPass.column.graph']}><BsGraphUpArrow
              onClick={() => {
                refIdCpass.current = text?.id;
                setOpenChart(true);
              }}
            /></Tooltip>
          </>)
        }
        else {
          return (<></>)
        }

      }
    },

    {
      title: configDefaultText['titleOption'],
      dataIndex: 'titleOption',
      valueType: 'textarea',
      key: 'grtitleOptionaph',
      render: (_, text: any) => {
        return (<>
          <Tooltip title={configDefaultText['buttonUpdate']}><MdOutlineEdit
            onClick={async () => {
              handleUpdateModalOpen(true);
              refIdCpass.current = text.id;
              const cPass = await customAPIGetOne(text.id, 'c-passes/get/find-admin', {});
              const photos = cPass.photos;
              const photoCow = photos?.map((e: any) => {
                return { uid: e.id, status: 'done', url: SERVERURL + e.url };
              })

              setFileList(photoCow);

              form.setFieldsValue({
                cow: {
                  value: cPass?.cowId,
                  label: cPass?.cowName,
                },
                farm: {
                  value: cPass?.farmId,
                  label: cPass?.farmName,
                },
                category: {
                  value: cPass?.categoryId,
                  label: cPass?.categoryName,
                },
                group_cow: {
                  value: cPass?.groupId,
                  label: cPass?.groupName,
                },
                sex: cPass?.sex,
                birthdate: cPass?.birthdate,
                dateInStable: cPass?.dateInStable,
                weightInStable: cPass?.weightInStable,
                bodyCondition: cPass?.bodyCondition,
                code: cPass?.code,
                pZero: cPass?.pZero,
                price: cPass?.price,
                nowWeight: cPass?.nowWeight,
                activeAleTransfer: cPass?.activeAleTransfer,
                photos: photoCow,
                vZero: cPass?.vZero.toLocaleString(),
                vs: cPass?.vs.toLocaleString()
              })
            }}
          /></Tooltip>
        </>)
      }
    },


  ];

  return (
    <PageContainer>
      <ProTable
        scroll={{
          x: window.innerHeight * 0.75
        }}
        actionRef={actionRef}
        rowKey='id'
        search={false}

        toolBarRender={() => {

          return showDowloadFile ? [
            <Button
              type='primary'
              key='primary'
              onClick={() => {
                handleModalOpen(true);
              }}
            >
              <PlusOutlined /> {configDefaultText['buttonAdd']}
            </Button>,
            <Button
              type='primary'
              key='primary'
              onClick={async () => {
                await customAPIDowload('c-passes/agrigate/excel');
              }}
            >
              <PlusOutlined /> Excel
            </Button>,

            <Button
              type='primary'
              key='primary'
              onClick={async () => {
                await customAPIDowloadPDF('c-passes/agrigate/pdf');
              }}
            >
              <PlusOutlined /> PDF
            </Button>,
          ] : [
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
        request={async () => {
          const data = await customAPIGet({}, 'c-passes/get/c-pass-agrigate');
          if (data.data && data.data.length > 0) {
            setShowDowloadFile(true);
          }
          else {
            setShowDowloadFile(false);
          }
          return {
            data: data.data,
            success: true,
            total: data.data.length
          }
        }}
        columns={columns}
        rowSelection={{

        }}

        toolbar={{
          settings: [
            {
              key: 'reload',
              tooltip: configDefaultText['reload'],
              icon: <ReloadOutlined />,
              onClick: () => {
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            },

          ]
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
        title='Tạo mới'
        open={createModalOpen}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleModalOpen(false)
          },
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
          const success = await handleAdd(values as any);
          if (success) {
            handleModalOpen(false);
            form.resetFields();
            const getCow = await getCownotInCpass();
            setCow(getCow);
            if (actionRef.current) {
              actionRef.current.reload();

            }
          }
          return true;
        }}

        submitter={{
          searchConfig: {
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['buttonAdd'],
          },
        }}
      >

        <Row gutter={24} className='m-0'>
          <Col span={12} className='gutter-row p-0' >
            <ProFormSelect
              className='w-full'
              options={cow}
              name='cow'
              label={configDefaultText['page.listCPass.modal.cow']}
              placeholder={configDefaultText['page.listCPass.modal.cow']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCPass.required.cow']
                },
              ]}
            />
          </Col>

          <Col span={12} className='gutter-row p-0'>
            <ProFormDigit className='w-full' name='pZero'
              label={configDefaultText['page.listCow.column.pZero']}
              min={1}
              max={1500}
              fieldProps={{
                formatter,
                parser,
              }}
              placeholder={configDefaultText['page.listCow.column.pZero']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCow.required.pZero']
                },
              ]} />
          </Col>
        </Row>


        <Row gutter={24} className='m-0'>
          <Col span={12} className='gutter-row p-0' >
            <ProFormDigit min={1} max={1000} className='w-full'
              name='nowWeight'
              fieldProps={{
                formatter,
                parser,
              }}
              label={configDefaultText['page.listCPass.modal.pNow']}
              placeholder={configDefaultText['page.listCPass.modal.pNow']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCPass.required.pNow']
                },
              ]}
            />
          </Col>

          <Col span={12} className='gutter-row p-0'>
            <ProFormDigit min={1} max={1000} className='w-full' name='weightInStable'
              fieldProps={{
                formatter,
                parser,
              }}
              label={configDefaultText['page.listCPass.modal.weightInStable']}
              placeholder={configDefaultText['page.listCPass.modal.weightInStable']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCPass.modal.weightInStable']
                },
              ]}
            />

          </Col>
        </Row>

        <Row gutter={24} className='m-0'>
          <Col span={12} className='gutter-row p-0' >
            <ProFormDatePicker
              fieldProps={{
                style: {
                  width: '100%'
                },
                disabledDate
              }}
              name='dateInStable'
              label={configDefaultText['page.listCPass.modal.dateInStable']}
              placeholder={configDefaultText['page.listCPass.modal.dateInStable']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCPass.required.dateInStable']
                },
              ]} />

          </Col>

          <Col span={12} className='gutter-row p-0'>
            <ProFormDigit min={1} className='w-full' name='vs'
              label={configDefaultText['page.listCPass.modal.vs']}
              placeholder={configDefaultText['page.listCPass.modal.vs']}
              fieldProps={{
                formatter,
                parser,
              }}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCPass.required.vs']

                },
              ]} />
          </Col>
        </Row>


        <Row gutter={24} className='m-0'>


          <Col span={12} className='gutter-row p-0'>
            <ProFormSwitch name='activeAleTransfer' label='Tự động chuyển đổi Ale' />

          </Col>
        </Row>






      </ModalForm>


      <ModalForm
        title='Cập nhật'
        open={updateModalOpen}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleUpdateModalOpen(false)
          },
        }}

        submitter={{
          searchConfig: {
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['buttonAdd'],
          },
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
          const success = await handleUpdate(values as any, refIdCpass);
          if (success) {
         
            handleUpdateModalOpen(false);
            form.resetFields();
            if (actionRef.current) {
              actionRef.current.reload(); 
              refIdPicture.current = null;
            }
          }
          return true;
        }}
      >

        <Row gutter={24} className='m-0'>
          <Col span={12} className='gutter-row p-0' >
            <ProFormText
              className='w-full'
              name='code'
              label={configDefaultText['page.listCPass.modal.code']}
              placeholder={configDefaultText['page.listCPass.modal.code']}
              disabled
            />
          </Col>

          <Col span={12} className='gutter-row p-0'>
            <ProFormSelect
              className='w-full'
              options={cow}
              name='cow'
              disabled
              label={configDefaultText['page.listCPass.modal.cow']}
              placeholder={configDefaultText['page.listCPass.modal.cow']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCPass.required.cow']
                },
              ]}
            />
          </Col>
        </Row>

        <Row gutter={24} className='m-0'>
          <Col span={12} className='gutter-row p-0' >
            <ProFormSelect
              //width='md'
              className='w-full'
              options={groupCow?.length !== 0 ? groupCow : null}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCow.required.group_cow']
                },
              ]}

              label={configDefaultText['page.listCPass.column.groupCow']}
              placeholder={configDefaultText['page.listCPass.column.groupCow']}
              name='group_cow'
            />
          </Col>

          <Col span={12} className='gutter-row p-0'>

            <ProFormSelect
              options={category}
              className='w-full'

              name='category'
              label={configDefaultText['page.listCPass.column.category']}
              placeholder={configDefaultText['page.listCPass.column.category']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCow.required.category']
                },
              ]} />
          </Col>
        </Row>


        <Row gutter={24} className='m-0'>
          <Col span={12} className='gutter-row p-0' >
            <ProFormSelect
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCow.required.category']
                },
              ]}

              label={configDefaultText['page.listCow.column.category']}
              placeholder={configDefaultText['page.listCow.column.category']}
              className='w-full'
              name='sex'

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
            />
          </Col>

          <Col span={12} className='gutter-row p-0'>
            <ProFormDigit min={1} max={1000} className='w-full'
              fieldProps={{
                formatter,
                parser,
              }}
              name='weightInStable'
              label={configDefaultText['page.listCPass.modal.weightInStable']}
              placeholder={configDefaultText['page.listCPass.modal.weightInStable']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCPass.modal.weightInStable']
                },
              ]}
            />
          </Col>
        </Row>

        <Row gutter={24} className='m-0'>
          {/* <Col span={12} className='gutter-row p-0' >
            <ProFormSelect
              className='w-full'
              //options={groupCow?.length !== 0 ? groupCow : null}
              options={[
                {
                  value: 'good',
                  label: 'Tốt'
                },
                {
                  value: 'malnourished',
                  label: 'Suy dinh dưỡng'
                },
                {
                  value: 'weak',
                  label: 'Yếu'
                },
                {
                  value: 'sick',
                  label: 'Bệnh'
                },
                {
                  value: 'dead',
                  label: 'Chết'
                }

              ]}

              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCPass.required.bodyCondition']

                  // (
                  //   <FormattedMessage
                  //     id='pages.Cpass.required.bodyCondition'
                  //     defaultMessage='Thể trạng'
                  //   />
                  // ),
                },
              ]}

              placeholder={configDefaultText['page.listCPass.column.bodyCondition']}
              name='bodyCondition'
              label={configDefaultText['page.listCPass.column.bodyCondition']} />
          </Col> */}

          <Col span={12} className='gutter-row p-0'>
            <ProFormSelect
              className='w-full'
              options={farm}
              //required 
              placeholder={configDefaultText['page.listCPass.column.farm']}
              label={configDefaultText['page.listCPass.column.farm']}
              name='farm'
              fieldProps={{
                onChange: async (value) => {
                  console.log(value);
                  if (typeof value !== 'undefined') {
                    const groupCow = await getGroupFarm(value);
                    setGroupCow(groupCow);
                    form.setFieldValue('group_cow', null);
                  }
                }
              }}
            />

          </Col>
        </Row>

        <Row gutter={24} className='m-0'>
          <Col span={12} className='gutter-row p-0' >
            <ProFormDatePicker

              fieldProps={{
                style: {
                  width: '100%'
                },
                disabledDate
              }}
              name='dateInStable'
              label={configDefaultText['page.listCPass.modal.dateInStable']}
              placeholder={configDefaultText['page.listCPass.modal.dateInStable']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCPass.required.dateInStable']
                },
              ]} />
          </Col>

          <Col span={12} className='gutter-row p-0'>

            <ProFormDatePicker name='birthdate'

              fieldProps={{
                style: {
                  width: '100%'
                },
                disabledDate
              }}
              label={configDefaultText['page.listCPass.column.birthdate']}
              placeholder={configDefaultText['page.listCPass.column.birthdate']}
              className='w-full'

              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCPass.required.birthdate']
                },
              ]}
            />
          </Col>
        </Row>




        <Row gutter={24} className='m-0'>
          <Col span={12} className='gutter-row p-0' >
            <ProFormDigit className='w-full' name='pZero'
              label={configDefaultText['page.listCow.column.pZero']}
              min={1}
              max={1500}
              fieldProps={{
                formatter,
                parser,
              }}
              placeholder={configDefaultText['page.listCow.column.pZero']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCow.required.pZero']
                },
              ]} />

          </Col>

          <Col span={12} className='gutter-row p-0'>
            <ProFormDigit min={1} max={1500} className='w-full'
              fieldProps={{
                formatter,
                parser,
              }}
              name='nowWeight'
              label={configDefaultText['page.listCPass.modal.pNow']}
              placeholder={configDefaultText['page.listCPass.modal.pNow']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCPass.required.pNow']
                },
              ]}
            />


          </Col>
        </Row>


        <Row gutter={24} className='m-0'>
          <Col span={12} className='gutter-row p-0'>
            <ProFormDigit min={1} className='w-full' name='vs'
              fieldProps={{
                formatter,
                parser,
              }}
              label={configDefaultText['page.listCPass.modal.vs']}
              placeholder={configDefaultText['page.listCPass.modal.vs']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCPass.required.vs']
                },
              ]} />
          </Col>

          <Col span={12} className='gutter-row p-0'>

            <ProFormSwitch name='activeAleTransfer' label='Tự động chuyển đổi ProduceAle' />

          </Col>
        </Row>

        {/* <Row gutter={24} className='m-0'>
          <Col span={12} className='gutter-row p-0' >
            <ProFormDigit min={1} className='w-full' name='vZero'
              label={configDefaultText['page.listCPass.modal.vZero']}
              placeholder={configDefaultText['page.listCPass.modal.vZero']}
              fieldProps={{
                formatter,
                parser,
              }}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCPass.required.vZero']
                  // (
                  //   <FormattedMessage
                  //     id='pages.Cpass.pZero'
                  //     defaultMessage='Nhập chi phí bảo trì và bảo hiểm'
                  //   />
                  // ),
                },
              ]}
            />
          </Col>


        </Row> */}

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
      </ModalForm>

      {
        openChart && <Chart
          openModal={openChart}
          cPassId={refIdCpass.current}
          onClose={() => {
            setOpenChart(false);
          }}
        />
      }

      {currentRow && <DetailCPass
        openModal={showDetail}
        cPassId={currentRow}
        closeModal={() => {
          setShowDetail(false);
          setCurrentRow(undefined);
        }}
      />}
    </PageContainer>

  );
};

export default TableList;
