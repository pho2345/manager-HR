import { customAPIGet, customAPIAdd, customAPIDelete, customAPIUpdate, customAPIGetOne, customAPIUpload } from '@/services/ant-design-pro/api';
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
import { Avatar, Button, Col, Form, Input, message, Modal, Row, Space, Tooltip, Typography } from 'antd';
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



    let { category, farm, group_cow, cow, birthdate, sex, ...other } = fields;

    let fieldCow = {
      category: category?.value || category,
      farm: farm?.value || farm,
      group_cow: group_cow?.value || group_cow,
      birthdate: birthdate,
      sex
    }
    const updateCow = await customAPIUpdate(
      {
        ...fieldCow,
      },
      'cows',
      cow.value
    );
    const updateCPass = await customAPIUpdate(
      {
        cow,
        ...other
      },
      'c-passes',
      id.current
    );

    console.log('updateCPass', updateCPass);

    if (updateCow && updateCPass) {
      let uploadImages: Array<any> = [];
      if (fields?.upload && fields.upload.length !== 0) {
        fields?.upload.map((e: any) => {
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
          return null;
        });
      }
      await Promise.all(uploadImages);
    }
    // uploadImages.push(updateCow);
    // uploadImages.push(updateCPass)
    //await Promise.all(uploadImages);
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
  // const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const [cow, setCow] = useState<any>();

  const [category, setCategory] = useState<any>();
  const [farm, setFarm] = useState<any>();
  const refIdPicture = useRef<any>();

  const [groupCow, setGroupCow] = useState<any>([]);
  const [getAllGroup, setGetAllGroup] = useState<any>([]);
  const searchInput = useRef(null);

  // const [currentRowUser, setCurrentRowUser] = useState<any>();
  // const [showDetailUser, setShowDetailUser] = useState<boolean>(false);
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
            //  await confirm(selectedRows as any, 'xóa', actionRef);
            confirm(selectedRows);

            // actionRef.current?.reloadAndRest?.();
          }}>Xóa</Button>
        </Fragment>
      </>
    );
  }


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
        // setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text: any) =>{
    // }
  });

  const columns: ProColumns<any>[] = [

    {
      // title: (
      //   <FormattedMessage
      //     id='pages.searchTable.column.code'
      //     defaultMessage='Thẻ tai'
      //   />
      // ),
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
      title: (<>{configDefaultText['page.listCPass.column.farm']}<br />
        {configDefaultText['page.listCPass.column.category']}<br />{configDefaultText['page.listCPass.column.sex']}</>),
      dataIndex: 'farmAndCategory',
      valueType: 'textarea',
      key: 'farmAndCategory',
      render: (_, text: any) => {
        let sex = 'Đực';
        if (text?.sex === 'female') {
          sex = 'Cái';
        }
        return (<>
          {text?.farm}<br />
          {text?.category}<br />{sex}
        </>)
      },
      filterSearch: true,
      filters: farm,
      onFilter: (value, record) => {
        return value === record.farmId
      }
    },


    {
      // title: <FormattedMessage id='pages.searchTable.column.image' defaultMessage='Hình' />,
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
      // title: <FormattedMessage id='pages.searchTable.column.birthdate' defaultMessage='Ngày sinh' />,
      title: configDefaultText['page.listCPass.column.birthdate'],
      dataIndex: 'birthdate',
      valueType: 'textarea',
      key: 'birthdate',
      renderText: (_, text: any) => {
        // let age = `${text?.cow?.age / 4 >= 1 ? `${text?.cow?.age / 4}Th` : ''} ${text?.cow?.age % 4 !== 0 ? (text?.cow?.age % 4) + 'T' : ''}`;
        return `${moment(text?.birthdate).format('DD/MM/YYYY')}`;
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.firstWeight' defaultMessage='Pss' />,
      title: configDefaultText['page.listCPass.column.firstWeight'],
      dataIndex: 'firstWeight',
      valueType: 'textarea',
      key: 'firstWeight',
      renderText: (_, text: any) => {
        return text.firstWeight;
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.age' defaultMessage='Tuổi' />,
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
      // title: <FormattedMessage id='pages.searchTable.column.bodyCondition' defaultMessage='Thể trạng' />,
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
      //title: <FormattedMessage id='pages.searchTable.column.awgAvg' defaultMessage='Tăng trọng TB' />,
      title: configDefaultText['page.listCPass.column.awgAvg'],

      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'awgAvg',
      renderText: (_, text: any) => text?.awgAvg
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.graph' defaultMessage='Graph' />,
      title: configDefaultText['page.listCPass.column.graph'],
      dataIndex: 'graph',
      valueType: 'textarea',
      key: 'graph',
      render: (_, text: any) => {
        if(text?.owner){
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
              //const cowNotCpass = await getCownotInCpass();
              // const cowForm = [
              //   ...cowNotCpass,
              //   {
              //     value: cPass?.data?.attributes?.cow?.data?.id,
              //     label: cPass?.data?.attributes?.cow?.data?.attributes?.name,
              //   }
              // ]
              const photos = cPass.photos;
              const photoCow = photos?.map((e: any) => {
                return { uid: e.id, status: 'done', url: SERVERURL + e.url };
              })


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
                upload: photoCow,
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
        request={() => customAPIGet({}, 'c-passes/get/c-pass-agrigate')}
        columns={columns}
        rowSelection={{
          // onChange: (_, selectedRows: any) => {
          //   setSelectedRows(selectedRows);
          // },
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
      {
        // selectedRowsState?.length > 0 && (
        //   <FooterToolbar
        //     extra={
        //       <div>
        //         {/* <FormattedMessage id='chosen' defaultMessage='Đã chọn' />{' '} */}
        //         {`${configDefaultText['chosen']} `}
        //         <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
        //         {/* <FormattedMessage id='Item' defaultMessage='hàng' /> */}
        //         {configDefaultText['selectedItem']}


        //       </div>
        //     }
        //   >
        //     <Button
        //       onClick={async () => {
        //         // await handleRemove(selectedRowsState);
        //         confirm(selectedRowsState, 'Bạn có muốn xóa?');
        //         setSelectedRows([]);

        //         const getCow = await getCownotInCpass();
        //         setCow(getCow);
        //         actionRef.current?.reloadAndRest?.();
        //       }}
        //     >
        //       {configDefaultText['delete']}
        //     </Button>
        //   </FooterToolbar>
        // )
      }


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
          //await waitTime(2000);
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
            // submitText: <FormattedMessage id='buttonAdd' defaultMessage='Thêm' />,\
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['buttonAdd'],
          },
        }}
      >
        {/* <ProFormText
           className='w-full'
            name='code'
            label='Mã'
            placeholder='Mã'
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.searchTable.Code'
                    defaultMessage='Rule name is required'
                  />
                ),
              },
            ]}
          /> */}



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
                  // (
                  //   <FormattedMessage
                  //     id='pages.Cpass.chosenCow'
                  //     defaultMessage='Vui lòng chọn Bò!'
                  //   />
                  // ),
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
                  // (
                  //   <FormattedMessage
                  //     id='pages.Cpass.required.pZero'
                  //     defaultMessage='Nhập P0'
                  //   />
                  // ),
                },
              ]} />
          </Col>
        </Row>


        {/* <ProFormText width='md' name='pZero' label='P0' placeholder='P0'  rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.Cpass.pZero'
                    defaultMessage='Nhập trọng lượng bò thời điểm tính lợi nhuận'
                  />
                ),
              },
            ]}/> */}



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
                  // (
                  //   <FormattedMessage
                  //     id='pages.Cpass.required.pZero'
                  //     defaultMessage='Nhập cân nặng nhập chuồng'
                  //   />
                  // ),
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
                  // (
                  //   <FormattedMessage
                  //     id='pages.Cpass.required.dateInStable'
                  //     defaultMessage='Ngày nhập chuồng'
                  //   />
                  // ),
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
                  // (
                  //   <FormattedMessage
                  //     id='pages.Cpass.pZero'
                  //     defaultMessage='Nhập chi phí bảo trì và bảo hiểm'
                  //   />
                  // ),
                },
              ]} />
          </Col>
        </Row>


        <Row gutter={24} className='m-0'>
          {/* <Col span={12} className='gutter-row p-0' >
            <ProFormDigit min={1} className='w-full' name='vZero'
              label={configDefaultText['page.listCPass.modal.vZero']}
              fieldProps={{
                formatter,
                parser,
              }}
              placeholder={configDefaultText['page.listCPass.modal.vZero']}
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
          </Col> */}

          <Col span={12} className='gutter-row p-0'>
            <ProFormSwitch name='activeAleTransfer' label='Tự động chuyển đổi Ale' />

          </Col>
        </Row>

        {/* <Row gutter={24} className='m-0'>
          <Col span={12} className='gutter-row p-0' >
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
          </Col>

        </Row> */}





        {/* <ProFormDigit min={1} max={1000} width='md' name='nowWeight' label='Cân nặng hiện tại' placeholder='Cân nặng hiện tại'
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.Cpass.pZero'
                    defaultMessage='Nhập trọng lượng bò thời điểm tính lợi nhuận'
                  />
                ),
              },
            ]} /> */}






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
            submitText: configDefaultText['buttonAdd'],
          },
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
          //await waitTime(2000);
          const success = await handleUpdate(values as any, refIdCpass);
          if (success) {
            if (typeof refIdPicture.current !== 'undefined' && refIdPicture?.current?.length !== 0) {
              if (refIdPicture.current !== null) {
                const deletePicture = refIdPicture?.current.map((e: any) => {
                  return customAPIDelete(e as any, 'upload/files');
                })
                const deletePicturea = await Promise.all(deletePicture);
                console.log('deletePicturea', deletePicturea)
              }
            }
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
                  // (
                  //   <FormattedMessage
                  //     id='pages.Cpass.chosenCow'
                  //     defaultMessage='Vui lòng chọn Bò!'
                  //   />
                  // ),
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

                  // (
                  //   <FormattedMessage
                  //     id='pages.Cpass.required.group_cow'
                  //     defaultMessage='Chọn nhóm bò'
                  //   />
                  // ),
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
                  // (
                  //   <FormattedMessage
                  //     id='pages.Cpass.required.category'
                  //     defaultMessage='Nhập trọng lượng bò thời điểm tính lợi nhuận'
                  //   />
                  // ),
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
                  // (
                  //   <FormattedMessage
                  //     id='pages.Cpass.required.sex'
                  //     defaultMessage='Giới tính'
                  //   />
                  // ),
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
                  // (
                  //   <FormattedMessage
                  //     id='pages.Cpass.required.pZero'
                  //     defaultMessage='Nhập cân nặng nhập chuồng'
                  //   />
                  // ),
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
                  // (
                  //   <FormattedMessage
                  //     id='pages.Cpass.required.dateInStable'
                  //     defaultMessage='Ngày nhập chuồng'
                  //   />
                  // ),
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
                  // (
                  //   <FormattedMessage
                  //     id='pages.Cpass.required.birthdate'
                  //     defaultMessage='Ngày sinh'
                  //   />
                  // ),
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
                  // (
                  //   <FormattedMessage
                  //     id='pages.Cpass.required.pZero'
                  //     defaultMessage='Nhập P0'
                  //   />
                  // ),
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
          {/* <Col span={12} className='gutter-row p-0' >
            <ProFormText className='w-full' name='price'
              label={configDefaultText['page.listCPass.modal.price']}
              placeholder={configDefaultText['page.listCPass.modal.price']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCPass.required.price']
                  // (
                  //   <FormattedMessage
                  //     id='pages.Cpass.required.price'
                  //     defaultMessage='Nhập cân nặng hiện tại'
                  //   />
                  // ),
                },
              ]}
            />
          </Col> */}

          <Col span={12} className='gutter-row p-0'>

            <ProFormSwitch name='activeAleTransfer' label='Tự động chuyển đổi ProduceAle' />

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
                  // (
                  //   <FormattedMessage
                  //     id='pages.Cpass.pZero'
                  //     defaultMessage='Nhập chi phí bảo trì và bảo hiểm'
                  //   />
                  // ),
                },
              ]} />
          </Col>

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


        </Row>


        <ProFormUploadButton
          name='upload'
          label='Upload'
          title='Upload'
          max={5}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            onRemove(file) {
              if (!file.lastModified) {
                if (refIdPicture.current) {
                  refIdPicture.current = [...refIdPicture.current, file.uid];
                }
                else {
                  refIdPicture.current = [file.uid];
                }
              }
            },
            accept: 'image/*',
            multiple: true,
            maxCount: 5,
            beforeUpload: (fileList, listSize) => {
              if (listSize.length > 5) {
                message.error('Chỉ có thể upload 5 hình ảnh');
                return false;
              }
              return true;
            }

          }}
        //action={() => customAPIUpload({})}
        />
      </ModalForm>

         {
          openChart &&  <Chart 
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
