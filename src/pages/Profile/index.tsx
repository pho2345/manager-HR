import {
  customAPIGet,
  customAPIAdd,
  customAPIUpdate,
  customAPIDelete,
  customAPIUpload,
  customAPIGetOne,
  get,
} from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
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
  ProCard,

} from '@ant-design/pro-components';
import {
  Card,
  Descriptions,
  Image, UploadFile
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
import { getOption } from '@/services/utils';


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






const TableList: React.FC = () => {
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdCow = useRef<any>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [form] = Form.useForm<any>();
  const searchInput = useRef(null);
  const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
  const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
  const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
  const [optionRangeSearch, setOptionRangeSearch] = useState<any>();

  const [religion, setReligion] = useState<GEN.Option[]>([]);
  const [sex, setSex] = useState<GEN.Option[]>([]);
  const [membership, setMembership] = useState<GEN.Option[]>([]);

  const [collapsed, setCollapsed] = useState(true);





  const [visible, setVisible] = useState(false);


  const [fileList, setFileList] = useState<UploadFile[]>([]);


  const params = useParams();
  useEffect(() => {
    const getValues = async () => {
      const getReligion = await getOption('dan-toc', 'id', 'name');
      const getSex = await getOption('gioi-tinh', 'id', 'name');
      setReligion(getReligion);
      setSex(getSex);
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
          <>{entity?.ho_va_ten}</>
        );
      },
    },

    {
      title: 'Dân tộc',
      dataIndex: 'danToc',
      // valueType: 'textarea',
      // key: 'name',
      // ...getColumnSearchProps('name'),

      render: (_, text) => "",
    },

    {
      title: 'Giới tính',
      key: 'gioiTinh',
      // dataIndex: 'gioiTinh',
      render: (_, entity) => ""
      // filters: farm,
      // onFilter: (value, record) => {
      //   return record?.farm?.id === value;
      // },
    },
    {
      title: 'Ngày sinh',
      key: 'sinhNgay',
      // dataIndex: 'gioiTinh',
      render: (_, entity) => {
        return (
          <></>
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
          <></>
        );
      },
      // filters: farm,
      // onFilter: (value, record) => {
      //   return record?.farm?.id === value;
      // },
    },
    {
      title: 'Trình độ chuyên môn',
      key: 'trinhDoChuyenMon',
      // dataIndex: 'gioiTinh',
      render: (_, entity) => {
        return (
          <>{entity?.trinhDoChuyenMon}</>
        );
      },
      // filters: farm,
      // onFilter: (value, record) => {
      //   return record?.farm?.id === value;
      // },
    },
    {
      title: 'Ngạch',
      key: 'ngachNgheNghiep',
      // dataIndex: 'gioiTinh',
      render: (_, entity) => {
        return (
          <>{entity.ngachNgheNghiep}</>
        );
      },
      // filters: farm,
      // onFilter: (value, record) => {
      //   return record?.farm?.id === value;
      // },
    },
    // {
    //   title: configDefaultText['page.listCow.column.firstWeight'],
    //   dataIndex: 'atrributes',
    //   valueType: 'textarea',
    //   key: 'firstWeight',
    //   width: '10vh',
    //   renderText: (_, text: any) => text?.firstWeight,
    // },
    // {
    //   title: configDefaultText['page.listCow.column.photos'],
    //   dataIndex: 'atrributes',
    //   valueType: 'textarea',
    //   key: 'photos',
    //   render: (_, text: any) => {
    //     return (
    //       <Avatar.Group
    //         maxCount={2}
    //         maxPopoverTrigger='click'
    //         size='large'
    //         maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' }}
    //       >

    //         {text?.photos && text?.photos?.length !== 0 ? text?.photos?.map((e: any, index: any) => {
    //           return (
    //             <Avatar
    //               key={index}
    //               src={
    //                 SERVERURL +
    //                 e?.url
    //               }
    //             />
    //           );
    //         }) : (<Avatar
    //           key={'defaultImage'}
    //           src={
    //             'https://aleger-server.process.vn/uploads/cow_Icon2_e7fd247cac.png'
    //           }
    //         />)
    //         }

    //       </Avatar.Group>
    //     );
    //   },
    // },

    // {
    //   title: configDefaultText['page.listCow.column.sex'],
    //   dataIndex: 'sex',
    //   valueType: 'textarea',
    //   width: '10vh',
    //   key: 'sex',
    //   renderText: (_, text: any) => {
    //     if (text?.sex === 'male') {
    //       return 'Đực';
    //     }
    //     return 'Cái';
    //   },
    //   filters: [
    //     {
    //       text: 'Đực',
    //       value: 'male'
    //     },
    //     {
    //       text: 'Cái',
    //       value: 'female'
    //     },
    //   ],
    //   onFilter: true
    // },

    // {
    //   title: configDefaultText['page.listCow.column.category'],
    //   dataIndex: 'category',
    //   valueType: 'textarea',
    //   key: 'category',
    //   renderText: (_, text: any) => text?.category?.name,
    //   filters: category,
    //   onFilter: (value, record) => {
    //     return record.category.id === value;

    //   }
    // },
    // {
    //   title: configDefaultText['page.listCow.column.age'],
    //   dataIndex: 'atrributes',
    //   valueType: 'textarea',
    //   key: 'age',
    //   renderText: (_, text: any) => {
    //     let age = Math.floor(moment(moment()).diff(text?.birthdate, 'days') / 7);
    //     if (age === 0) {
    //       return `0`;
    //     }
    //     let confiAge = `${age / 4 >= 1 ? `${Math.floor(age / 4)}Th` : ''} ${age % 4 !== 0 ? (age % 4) + 'T' : ''}`;
    //     return confiAge;
    //   }
    // },

    // {
    //   title: configDefaultText['page.listCow.column.birthdate'],
    //   dataIndex: 'atrributes',
    //   valueType: 'textarea',
    //   key: 'birthdate',
    //   renderText: (_, text: any) => {
    //     return moment(text?.birthdate).format('DD/MM/YYYY');
    //   },
    //   ...getColumnSearchRange('birthdate')
    // },

    // {
    //   title: configDefaultText['titleOption'],
    //   dataIndex: 'atrributes',
    //   valueType: 'textarea',
    //   key: 'option',
    //   align: 'center',
    //   render: (_, entity: any) => {
    //     return (
    //       <Tooltip title={configDefaultText['buttonUpdate']}>
    //         <Button

    //           style={{
    //             border: 'none'
    //           }}

    //           onClick={async () => {
    //             handleUpdateModalOpen(true);
    //             refIdCow.current = entity.id;
    //             const cow = await customAPIGetOne(entity.id, 'cows/find', {});
    //             const photos = cow.photos;
    //             if (photos) {
    //               const photoCow = photos.map((e: any) => {
    //                 return { uid: e.id, status: 'done', url: SERVERURL + e.url };
    //               });
    //               setFileList(photoCow);

    //               form.setFieldsValue({
    //                 ...cow,
    //                 category: cow.category?.id,
    //                 farm: cow.farm?.id,
    //                 upload: photoCow,
    //                 group_cow: {
    //                   label: cow?.group_cow?.name,
    //                   value: cow?.group_cow?.id
    //                 }

    //               })
    //             }
    //             else {
    //               form.setFieldsValue({
    //                 ...cow,
    //                 category: cow.category?.id,
    //                 farm: cow.farm?.id,
    //                 group_cow: {
    //                   label: cow?.group_cow?.name,
    //                   value: cow?.group_cow?.id
    //                 }
    //               })
    //             }
    //           }}

    //           icon={
    //             <MdOutlineEdit />
    //           }
    //         />
    //       </Tooltip>
    //     );
    //   },
    // },

  ];

  // const disabledDate = (current: any) => {
  //   return current && current > moment();
  // };

  const onCloseModalAdd = (params: boolean) => {
    setVisible(params);
  }


  // const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
  //   if (fileList.length > 5) {
  //     const maxImages = newFileList.slice(0, 5);
  //     setFileList(maxImages);
  //   }
  //   else {
  //     setFileList(newFileList);
  //   }
  // }

  // const handleRemoveImage = (file: any) => {
  //   const updatedFileList = fileList.filter((f: any) => f.uid !== file.uid);
  //   setFileList(updatedFileList);
  // };

  return (
    !params.id ? (
      <div
        style={{
          background: '#F5F7FA',
        }}
      >
        <PageContainer
          ghost
          header={{
            title: 'Thông tin cơ bản',
            breadcrumb: {},
          }}
          content={
            <Descriptions column={3} style={{ marginBlockEnd: -16 }}>
              <Descriptions.Item label={<FormattedMessage id="page.profile.name" defaultMessage="Họ tên" />}>Phố Tran</Descriptions.Item>
              <Descriptions.Item label={<FormattedMessage id="page.profile.diffName" defaultMessage="Tên gọi khác" />}>321757894</Descriptions.Item>
              <Descriptions.Item label={<FormattedMessage id="page.profile.birthdate" defaultMessage="Ngày sinh" />}>2017-01-10</Descriptions.Item>


              <Descriptions.Item label={<FormattedMessage id="page.profile.sex" defaultMessage="Giới tính" />}><a>421421</a></Descriptions.Item>
              <Descriptions.Item label={<FormattedMessage id="page.profile.numberIdentify" defaultMessage="CMND/CCCD" />}>321757894</Descriptions.Item>
              <Descriptions.Item label={<FormattedMessage id="page.profile.dateNumberIdentify" defaultMessage="Ngày cấp CCCD/CMND" />}>321757894</Descriptions.Item>

              <Descriptions.Item label={<FormattedMessage id="page.profile.nation" defaultMessage="Dân tộc" />}>321757894</Descriptions.Item>
              <Descriptions.Item label={<FormattedMessage id="page.profile.placeOfBirth" defaultMessage="Nơi sinh" />}>321757894</Descriptions.Item>
              <Descriptions.Item label={<FormattedMessage id="page.profile.homeTown" defaultMessage="Quê quán" />}>321757894</Descriptions.Item>

              <Descriptions.Item label={<FormattedMessage id="page.profile.phone" defaultMessage="Số điện thoại" />}>321757894</Descriptions.Item>
              <Descriptions.Item label={<FormattedMessage id="page.profile.socialInsurance" defaultMessage="Mã BHXH" />}>321757894</Descriptions.Item>
              <Descriptions.Item label={<FormattedMessage id="page.profile.healthInsurance" defaultMessage="Số BHYT" />}>321757894</Descriptions.Item>

              <Descriptions.Item label={<FormattedMessage id="page.profile.accommodationToday" defaultMessage="Nơi ở hiện nay" />}>321757894</Descriptions.Item>
              <Descriptions.Item label={<FormattedMessage id="page.profile.tall" defaultMessage="Chiều cao" />}>321757894</Descriptions.Item>
              <Descriptions.Item label={<FormattedMessage id="page.profile.weight" defaultMessage="Cân nặng" />}>321757894</Descriptions.Item>
              <Descriptions.Item label={<FormattedMessage id="page.profile.groupBlood" defaultMessage="Nhóm máu" />}>321757894</Descriptions.Item>
              
            

            </Descriptions>
          }
        >


          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
              gap: 12,
            }}
          >
            <ProCard
              title={<FormattedMessage id="page.profile.card.tilte.job" defaultMessage="Biên chế, chức vụ, Ngạch, Bậc" />}
              headerBordered
              collapsible
              defaultCollapsed
              onCollapse={(collapse) => console.log(collapse)}
            >
              <Descriptions column={3} style={{ marginBlockEnd: -16 }}>
                <Descriptions.Item label={<FormattedMessage id="page.profile.beforeJob" defaultMessage="Nghề nghiệp trước khi tuyển dụng" />}>Phố Tran</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.recruitmentAgency" defaultMessage="Cơ quan, đơn vị tuyển dụng" />}>aa</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateAgencyToDo" defaultMessage="Ngày vào cơ quan công tác" />}><a>421421</a></Descriptions.Item>

                <Descriptions.Item label={<FormattedMessage id="page.profile.dateJoinCommunistParty" defaultMessage="Ngày vào Đảng" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.firstDateJoinLargestSocialPoliticalOrg" defaultMessage="Ngày tham gia tổ chức chính trị - xã hội đầu tiên" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateOfEnlistment" defaultMessage="Ngày nhập ngũ" />}><a>421421</a></Descriptions.Item>
                
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateDischargedFromMilitaryService" defaultMessage="Ngày xuất ngũ" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.militaryRanks" defaultMessage="Cấp bậc quân hàm" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.policyOjbect" defaultMessage="Đối tượng chính sách" />}><a>421421</a></Descriptions.Item>
                
                <Descriptions.Item label={<FormattedMessage id="page.profile.secondaryEducationLevel" defaultMessage="Trình độ giáo dục phổ thông" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.professionalLevel" defaultMessage="Trình độ chuyên môn" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.academicDegrees" defaultMessage="Học hàm" />}><a>421421</a></Descriptions.Item>

                <Descriptions.Item label={<FormattedMessage id="page.profile.stateRank" defaultMessage="Danh hiệu nhà nước phong tặng" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateAppointment" defaultMessage="Ngày bổ nhiệm" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateReAppointment" defaultMessage="Ngày bổ nhiệm lại" />}><a>421421</a></Descriptions.Item>
                
                <Descriptions.Item label={<FormattedMessage id="page.profile.chargePosition" defaultMessage="Chức vụ kiêm nhiệm" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateReAppointment" defaultMessage="Ngày bổ nhiệm lại" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.planningPosition" defaultMessage="Được quy hoạch chức danh" />}><a>421421</a></Descriptions.Item>
                
                <Descriptions.Item label={<FormattedMessage id="page.profile.currentPositionCommunistParty" defaultMessage="Chức vụ Đảng hiện tại" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.chargePositionCommunistParty" defaultMessage="Chức vụ Đảng kiêm nhiệm" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.mainJob" defaultMessage="Công việc chính" />}><a>421421</a></Descriptions.Item>
                
                
                <Descriptions.Item label={<FormattedMessage id="page.profile.forte" defaultMessage="Sở trường công tác" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.positionLongest" defaultMessage="Công việc lâu nhất" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.salary" defaultMessage="Tiền lương" />}><a>421421</a></Descriptions.Item>
                
                <Descriptions.Item label={<FormattedMessage id="page.profile.codeQuotaCareer" defaultMessage="Mã ngạch nghề nghiệp" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.quotaCareer" defaultMessage="Ngạch nghề nghiệp" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateAppointmentQuotaCareer" defaultMessage="Ngày bổ nhiệm ngạch" />}><a>421421</a></Descriptions.Item>
                
                <Descriptions.Item label={<FormattedMessage id="page.profile.rankSalary" defaultMessage="Bậc lương" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.numberSalaryQuotaCareer" defaultMessage="Hệ số lương ngạch nghề nghiệp" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateGetSalaryQuotaCareer" defaultMessage="Ngày hưởng lương ngạch nghề nghiệp" />}><a>421421</a></Descriptions.Item>
                
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateGetSalaryQuotaCareer" defaultMessage="Ngày bổ nhiệm ngạch" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.percentGetSalaryQuotaCareer" defaultMessage="Phần trăm hưởng lương ngạch nghề nghiệp" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.allowancePassQuotaCareer" defaultMessage="Phụ cấp thâm niên vượt khung ngạch nghề nghiệp" />}><a>421421</a></Descriptions.Item>

                <Descriptions.Item label={<FormattedMessage id="page.profile.dateGetAllowancePassQuotaCareer" defaultMessage="Ngày hưởng phụ cấp thâm niên vượt khung ngạch nghề nghiệp" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.allowancePosition" defaultMessage="Phụ cấp chức vụ" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.allowanceChargePosition" defaultMessage="Phụ cấp kiêm nhiệm" />}><a>421421</a></Descriptions.Item>

                <Descriptions.Item label={<FormattedMessage id="page.profile.allowanceOther" defaultMessage="Phụ cấp khác" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.workplace" defaultMessage="Vị trí việc làm" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.codeWorkplace" defaultMessage="Mã số vị trí việc làm" />}><a>421421</a></Descriptions.Item>

                <Descriptions.Item label={<FormattedMessage id="page.profile.rankSalaryWorkSpace" defaultMessage="Bậc lương trí việc làm" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.salaryMoney" defaultMessage="Lương" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateGetSalaryWorkSpace" defaultMessage="Ngày hưởng lương" />}><a>421421</a></Descriptions.Item>

                <Descriptions.Item label={<FormattedMessage id="page.profile.percentSalaryWorkSpace" defaultMessage="Phần trăm hưởng lương" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.allowancePass" defaultMessage="Phụ cấp vượt khung" />}><a>421421</a></Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dadteGetSalaryAllowancePass" defaultMessage="Ngày hưởng phụ cấp vượt khung" />}><a>421421</a></Descriptions.Item>



                <Descriptions.Item label="Ngày sinh">2017-01-10</Descriptions.Item>
                <Descriptions.Item label="CMND/CCCD">
                  321757894
                </Descriptions.Item>
              </Descriptions>
            </ProCard>
            <ProCard
              title="可折叠"
              bordered
              headerBordered
              collapsible
              defaultCollapsed
              onCollapse={(collapse) => console.log(collapse)}
              extra={
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  提交
                </Button>
              }
            >
              内容
            </ProCard>
            <ProCard
              bordered
              size="small"
              title="可折叠"
              headerBordered
              collapsible
              defaultCollapsed
              onCollapse={(collapse) => console.log(collapse)}
              extra={
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  提交
                </Button>
              }
            >
              内容
            </ProCard>
            <ProCard
              title="可折叠-受控自定义"
              extra={
                <RightOutlined
                  rotate={!collapsed ? 90 : undefined}
                  onClick={() => {
                    setCollapsed(!collapsed);
                  }}
                />
              }
              style={{ marginBlockStart: 16 }}
              headerBordered
              collapsed={collapsed}
            >
              内容
            </ProCard>
            <ProCard
              title="可折叠-图标自定义"
              collapsibleIconRender={({
                collapsed: buildInCollapsed,
              }: {
                collapsed: boolean;
              }) => (buildInCollapsed ? <span>收起 - </span> : <span>展开 - </span>)}
              style={{ marginBlockStart: 16 }}
              headerBordered
              collapsible
              defaultCollapsed
            >
              内容
            </ProCard>
            <ProCard title={<FormattedMessage id="page.profile.healthInsurance" defaultMessage="Số BHYT" />} bordered gutter={16} boxShadow style={{ fontWeight: 'bolder' }} type='inner'>
              <ProCard.Divider>
              </ProCard.Divider>

              <Descriptions column={3} style={{ marginBlockEnd: -16 }}>
                <Descriptions.Item label="Họ tên">Phố Tran</Descriptions.Item>
                <Descriptions.Item label="Giới tính">
                  <a>421421</a>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">2017-01-10</Descriptions.Item>
                <Descriptions.Item label="CMND/CCCD">
                  321757894
                </Descriptions.Item>
              </Descriptions>
            </ProCard>
          </div>



        </PageContainer>
      </div>)
      :
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
