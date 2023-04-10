import { customAPIGet, customAPIAdd, customAPIDelete, customAPIUpdate, customAPIGetOne, customAPIUpload } from '@/services/ant-design-pro/api';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormUploadButton } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProFormText,

  ProTable,
} from '@ant-design/pro-components';
import { BsGraphUpArrow } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";

import { FormattedMessage, useIntl } from '@umijs/max';
import { Avatar, Button, Col, Form, message, Row, Tooltip, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import DetailCPass from './components/DetailCPass';
const { Text } = Typography;

const handleAdd = async (fields: any) => {
  console.log(fields);

  const hide = message.loading('Đang chờ...');
  try {
    await customAPIAdd({ ...fields }, 'c-passes/create');
    hide();
    message.success('Thêm thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Thêm thất bại!');
    return false;
  }
};



const handleUpdate = async (fields: any, id: any) => {
  console.log(fields, id);
  const hide = message.loading('Đang cập nhật...');
  try {
    let uploadImages = fields?.upload.map((e: any) => {
      if (e.originFileObj) {
        let formdata = new FormData();
        formdata.append('files', e?.originFileObj);
        formdata.append('ref', 'api::cow.cow');
        formdata.append('refId', fields.cow.value);
        formdata.append('field', 'photos');
        return customAPIUpload({
          data: formdata
        })
      }
      return null;
    });
    let { category, farm, group_cow, cow, birthdate, ...other } = fields;

    let fieldCow = {
      category: category?.value || category,
      farm: farm?.value || farm,
      group_cow: group_cow?.value || group_cow,
      birthdate: birthdate
    }
    const updateCow = customAPIUpdate(
      {
        ...fieldCow,
      },
      'cows',
      cow.value
    );


    const updateCPass = customAPIUpdate(
      {
        ...other
      },
      'c-passes',
      id.current
    );
    uploadImages.push(updateCow);
    uploadImages.push(updateCPass)

    await Promise.all(uploadImages);
    hide();

    //   message.success('Cập nhật thành công');
    return true;
  } catch (error: any) {
    hide();
    //console.log(error);
    message.error(error?.response?.data?.error?.message);
    return false;
  }
};

const handleRemove = async (selectedRows: any) => {
  console.log(selectedRows);
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
  } catch (error) {
    hide();
    message.error('Xóa thất bại');
    return false;
  }
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
  const categories = await customAPIGet({}, 'farms');
  let data = categories.data.map((e: any) => {
    return {
      value: e?.id,
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
  const refIdCpass = useRef<any>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const [cow, setCow] = useState<any>();

  const [category, setCategory] = useState<any>();
  const [farm, setFarm] = useState<any>();
  const refIdPicture = useRef<any>();
  const [groupCow, setGroupCow] = useState<any>([]);

  // const [currentRowUser, setCurrentRowUser] = useState<any>();
  // const [showDetailUser, setShowDetailUser] = useState<boolean>(false);
  useEffect(() => {
    const getValues = async () => {
      let getCow = await getCownotInCpass();
      let getCate = await getCategory();
      let getFarms = await getFarm();
      setCategory(getCate);
      setFarm(getFarms);
      setCow(getCow);

    }
    getValues();
  }, [])

  const intl = useIntl();

  const columns: ProColumns<any>[] = [

    {
      title: (
        <FormattedMessage
          id='pages.searchTable.column.code'
          defaultMessage='Thẻ tai'
        />
      ),
      key: 'code',
      dataIndex: 'atrributes',
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
      title: <FormattedMessage id='pages.searchTable.column.groupCow' defaultMessage='Nhóm' />,
      dataIndex: 'groupCow',
      valueType: 'textarea',
      key: 'groupCow',
      renderText: (_, text: any) => {
        return `${text?.descriptionGroup}`

      }
    },
    {
      title: (<>Trang trại <br />
        Giống bò-Giới tính</>),
      width: 200,
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
          {`${text?.category}-${sex}`}
        </>)
      }
    },


    {
      title: <FormattedMessage id='pages.searchTable.column.image' defaultMessage='Hình' />,
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
            {text?.photos?.map((e: any, index: any) => {
              return (
                <Avatar
                  key={index}
                  src={
                    SERVERURL +
                    e?.url
                  }
                />
              );
            })}
          </Avatar.Group>
        );
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.birthdate' defaultMessage='Ngày sinh' />,
      dataIndex: 'birthdate',
      valueType: 'textarea',
      key: 'birthdate',
      renderText: (_, text: any) => {
        // let age = `${text?.cow?.age / 4 >= 1 ? `${text?.cow?.age / 4}Th` : ''} ${text?.cow?.age % 4 !== 0 ? (text?.cow?.age % 4) + 'T' : ''}`;
        return `${moment(text?.birthdate).format('DD/MM/YYYY')}`;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.firstWeight' defaultMessage='Pss' />,
      dataIndex: 'firstWeight',
      valueType: 'textarea',
      key: 'firstWeight',
      renderText: (_, text: any) => {
        return text.firstWeight;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.age' defaultMessage='Tuổi' />,
      dataIndex: 'age',
      valueType: 'textarea',
      key: 'age',
      renderText: (_, text: any) => {
        let age = Math.floor(moment(moment()).diff(text?.birthdate, 'days') / 7);
        let confiAge = `${age / 4 >= 1 ? `${Math.floor(age / 4)}Th` : ''} ${age % 4 !== 0 ? (age % 4) + 'T' : ''}`;
        return confiAge;
      }
    },
    {
      title: 'Pnow',
      dataIndex: 'P0andPnow',
      valueType: 'textarea',
      key: 'P0andPnow',
      render: (_, text: any) => {
        return `${text?.nowWeight}  `
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
      title: <FormattedMessage id='pages.searchTable.column.wgePercent' defaultMessage='Hiệu quả tăng trọng' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'wgePercent',
      renderText: (_, text: any) => `${text?.wgePercent}%`
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.awgAvg' defaultMessage='Tăng trọng TB' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'awgAvg',
      renderText: (_, text: any) => text?.awgAvg
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.graph' defaultMessage='Graph' />,
      dataIndex: 'graph',
      valueType: 'textarea',
      key: 'graph',
      render: (_, text: any) => {
        return (<>
          <Tooltip title={<FormattedMessage id='pages.columns.graph' defaultMessage='Biểu đồ' />}><BsGraphUpArrow
            onClick={() => {
              alert(text?.awgAv);
            }}
          /></Tooltip>
        </>)
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.option' defaultMessage='Thao tác' />,
      dataIndex: 'graph',
      valueType: 'textarea',
      key: 'graph',
      render: (_, text: any) => {
        return (<>
          <Tooltip title={<FormattedMessage id='pages.columns.update' defaultMessage='Cập nhật' />}><MdOutlineEdit
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
                upload: photoCow
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
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
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
            <PlusOutlined /> <FormattedMessage id='pages.searchTable.new' defaultMessage='Mới' />
          </Button>,
        ]}
        request={() => customAPIGet({}, 'c-passes/get/c-pass-agrigate')}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows: any) => {
            setSelectedRows(selectedRows);
          },
        }}
        
        toolbar={{
          settings: [
            {
              key: 'reload',
              tooltip: 'Tải lại',
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
           next_page: 'Trang sau',
           prev_page: 'Trang trước',
          },
          showTotal: (total, range) => {
            console.log(range);
            return `${range[range.length - 1]} / Tổng số: ${total}`
          }
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id='pages.searchTable.chosen' defaultMessage='Chosen' />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id='pages.searchTable.item' defaultMessage='Item' />
              &nbsp;&nbsp;

            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              const getCow = await getCownotInCpass();
              setCow(getCow);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id='pages.searchTable.batchDeletion'
              defaultMessage='Batch deletion'
            />
          </Button>
        </FooterToolbar>
      )}


      <ModalForm
        title="Tạo mới"
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
            resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
            submitText: <FormattedMessage id='buttonAdd' defaultMessage='Thêm' />,
          },
        }}
      >
        {/* <ProFormText
           className='w-full'
            name="code"
            label="Mã"
            placeholder="Mã"
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

        <ProFormSelect
          className='w-full'
          options={cow}
          name="cow"
          label="Bò"
          placeholder="Chọn bò"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id='pages.Cpass.chosenCow'
                  defaultMessage='Vui lòng chọn Bò!'
                />
              ),
            },
          ]}
        />



        {/* <ProFormText width="md" name="pZero" label="P0" placeholder="P0"  rules={[
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



        <Row gutter={24} className="m-0">
          <Col span={12} className="gutter-row p-0" >
            <ProFormDigit min={1} max={1000} width="md" name="nowWeight" label="Cân nặng hiện tại" placeholder="Cân nặng hiện tại"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.Cpass.pZero'
                      defaultMessage='Nhập cân nặng hiện tại'
                    />
                  ),
                },
              ]}
            />
          </Col>

          <Col span={12} className="gutter-row p-0">
            <ProFormDigit min={1} max={1000} width="md" name="weightInStable" label="Cân nặng nhập chuồng" placeholder="Cân nặng nhập chuồng"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.Cpass.required.pZero'
                      defaultMessage='Nhập cân nặng nhập chuồng'
                    />
                  ),
                },
              ]}
            />

          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={12} className="gutter-row p-0" >
            <ProFormDatePicker className='w-full' name="dateInStable" label="Ngày nhập chuồng" placeholder={`Ngày nhập chuồng`} rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.Cpass.required.dateInStable'
                    defaultMessage='Ngày nhập chuồng'
                  />
                ),
              },
            ]} />

          </Col>

          <Col span={12} className="gutter-row p-0">
            <ProFormDigit min={1} className='w-full' name="vs" label="Chi phí bảo trì và bảo hiểm" placeholder="Chi phí bảo trì và bảo hiểm" rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.Cpass.pZero'
                    defaultMessage='Nhập chi phí bảo trì và bảo hiểm'
                  />
                ),
              },
            ]} />
          </Col>
        </Row>


        <Row gutter={24} className="m-0">
          <Col span={12} className="gutter-row p-0" >
            <ProFormDigit min={1} width="md" name="vZero" label="Giá trị con bò của Mega" placeholder="Giá trị con bò của Mega" required />

          </Col>

          <Col span={12} className="gutter-row p-0">
            <ProFormSwitch name="activeAleTransfer" label="Tự động chuyển đổi Ale" />

          </Col>
        </Row>




        {/* <ProFormDigit min={1} max={1000} width="md" name="nowWeight" label="Cân nặng hiện tại" placeholder="Cân nặng hiện tại"
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
        title="Cập nhật"
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
            resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
            submitText: <FormattedMessage id='buttonUpdate' defaultMessage='Cập nhật' />,
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
                await Promise.all(deletePicture);
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

        <Row gutter={24} className="m-0">
          <Col span={12} className="gutter-row p-0" >
            <ProFormText
              className='w-full'
              name="code"
              label="Mã"
              placeholder="Mã"
              disabled
            />
          </Col>

          <Col span={12} className="gutter-row p-0">
            <ProFormSelect
              disabled
              className='w-full'
              name="cow"
              label="Bò"
              placeholder="Chọn bò"
            />
          </Col>



        </Row>


        <Row gutter={24} className="m-0">
          <Col span={12} className="gutter-row p-0" >
            <ProFormSelect
              width='md'
              options={groupCow?.length !== 0 ? groupCow : null}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.Cpass.required.group_cow'
                      defaultMessage='Chọn nhóm bò'
                    />
                  ),
                },
              ]}
              placeholder='Chọn nhóm bò'
              name='group_cow'
              label='Nhóm bò' />
          </Col>

          <Col span={12} className="gutter-row p-0">

            <ProFormSelect
              options={category}
              width='md'
              name='category'
              placeholder='Chọn giống bò'
              label='Giống bò' rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.Cpass.required.category'
                      defaultMessage='Nhập trọng lượng bò thời điểm tính lợi nhuận'
                    />
                  ),
                },
              ]} />
          </Col>
        </Row>


        <Row gutter={24} className="m-0">
          <Col span={12} className="gutter-row p-0" >
            <ProFormSelect
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.Cpass.required.sex'
                      defaultMessage='Giới tính'
                    />
                  ),
                },
              ]}
              placeholder={`Giới tính`}
              width='md'
              name='sex'
              label='Giới tính'
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

          <Col span={12} className="gutter-row p-0">
            <ProFormDigit min={1} max={1000} className='w-full' name="weightInStable" label="Cân nặng nhập chuồng" placeholder="Cân nặng nhập chuồng"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.Cpass.required.weightInStable'
                      defaultMessage='Cân nặng nhập chuồng'
                    />
                  ),
                },
              ]}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={12} className="gutter-row p-0" >
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
                  message: (
                    <FormattedMessage
                      id='pages.Cpass.required.bodyCondition'
                      defaultMessage='Thể trạng'
                    />
                  ),
                },
              ]}

              placeholder='Thể trạng'
              name='bodyCondition'
              label='Thể trạng' />
          </Col>

          <Col span={12} className="gutter-row p-0">
            <ProFormSelect
              className='w-full'
              options={farm}
              //required 
              placeholder='Chọn trang trại'
              name='farm' label='Trang trại'
              fieldProps={{
                onChange: async (value) => {
                  const groupCow = await getGroupFarm(value);
                  setGroupCow(groupCow);
                  form.setFieldValue('group_cow', null);
                }
              }}
            />

          </Col>
        </Row>







        <Row gutter={24} className="m-0">
          <Col span={12} className="gutter-row p-0" >
            <ProFormDatePicker name="dateInStable" label="Ngày nhập chuồng" 
            className='w-full' 
            placeholder={`Ngày nhập chuồng`}

            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.Cpass.required.dateInStable'
                    defaultMessage='Ngày nhập chuồng'
                  />
                ),
              },
            ]} />

          </Col>

          <Col span={12} className="gutter-row p-0">

            <ProFormDatePicker name='birthdate' label='Ngày sinh' className='w-full'
            placeholder={`Ngày sinh`}

              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.Cpass.required.birthdate'
                      defaultMessage='Ngày sinh'
                    />
                  ),
                },
              ]}
            />
          </Col>
        </Row>



        <Row gutter={24} className="m-0">
          <Col span={12} className="gutter-row p-0" >

          </Col>

          <Col span={12} className="gutter-row p-0">


          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={12} className="gutter-row p-0" >
            <ProFormText className='w-full' name="pZero" label="P0" placeholder="P0" rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.Cpass.required.pZero'
                    defaultMessage='Nhập P0'
                  />
                ),
              },
            ]} />

          </Col>

          <Col span={12} className="gutter-row p-0">
            <ProFormText className='w-full' name="nowWeight" label="Cân nặng hiện tại" placeholder="Cân nặng hiện tại" rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.Cpass.required.nowWeight'
                    defaultMessage='Nhập cân nặng hiện tại'
                  />
                ),
              },
            ]} />


          </Col>
        </Row>


        <Row gutter={24} className="m-0">
          <Col span={12} className="gutter-row p-0" >
            <ProFormText className='w-full' name="price" label="Giá" placeholder="Giá"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.Cpass.required.price'
                      defaultMessage='Nhập cân nặng hiện tại'
                    />
                  ),
                },
              ]}

            />

          </Col>

          <Col span={12} className="gutter-row p-0">

            <ProFormSwitch name="activeAleTransfer" label="Tự động chuyển đổi ProduceAle" rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.Cpass.required.price'
                    defaultMessage='Nhập cân nặng hiện tại'
                  />
                ),
              },
            ]} />

          </Col>
        </Row>

        <ProFormUploadButton
          name='upload'
          label='Upload'
          title='Upload'

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
            }
          }}
        //action={() => customAPIUpload({})}
        />
      </ModalForm>


      {currentRow && <DetailCPass
        openModal={showDetail}
        cPassId={currentRow}
        closeModal={() => {
          setShowDetail(false);
          setCurrentRow(undefined);
        }}
      />}

      {/* <DetailUser
        onDetail={showDetailUser}
        currentRowUser={currentRowUser}
        onCloseDetail={() => {
          setCurrentRowUser(undefined);
          setShowDetailUser(false);
        }}
      /> */}
    </PageContainer>

  );
};

export default TableList;
