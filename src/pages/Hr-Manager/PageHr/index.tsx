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





  const [visible, setVisible] = useState(false);


  const [fileList, setFileList] = useState<UploadFile[]>([]);


  const params = useParams();
  useEffect(() => {
    const getValues = async () => {
      const getReligion = await getOption('dan-toc', 'id', 'name');
      setReligion(getReligion);
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
      title: 'Ho tên',
      key: 'code',
      dataIndex: 'hovaten',
      ...getColumnSearchProps('code'),
      render: (_, entity: API.Staff) => {
        return (
          <>{entity?.hovaten}</>
        );
      },
    },

    {
      title: 'Dân tộc',
      dataIndex: 'danToc',
      // valueType: 'textarea',
      // key: 'name',
      // ...getColumnSearchProps('name'),

      renderText: (_, text: API.Staff) => text?.danToc?.name,
    },

    {
      title: 'Giới tính',
      key: 'gioiTinh',
      // dataIndex: 'gioiTinh',
      render: (_, entity: API.Staff) => {
        return (
          <>{entity?.gioiTinh?.name}</>
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

          request={async () => {
            //customAPIGet({}, 'cows/find',)
            const data = [
              {
                "create_at": "1998-01-09T00:29:46",
                "update_at": null,
                "id": "30663833-6331-6536-2d61-3533662d3332",
                "hovaten": "Prof. Kelvin Hodkiewicz DVM",
                "gioiTinh": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 0,
                  "name": "Nam"
                },
                "cacTenGoiKhac": "Aniya",
                "sinhNgay": "1997-12-17T07:51:56",
                "noiSinh": "6838 Stanton Flats Suite 260",
                "queQuan": "0999 Emelia Corners Suite 096",
                "danToc": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 21,
                  "name": "Khơ Lơ"
                },
                "soCCCD": "988313327711",
                "ngayCapCCCD": "2013-05-09T16:35:34",
                "soDienThoai": "914611746310",
                "soBHXH": "8560349374",
                "soBHYT": "65iovkef",
                "noiOHienNay": "5465 Floy Squares",
                "thanhPhanGiaDinh": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 9,
                  "name": "Tư sản"
                },
                "ngheNghiepTruocKhiTuyenDung": "Rerum et sunt.",
                "ngayDuocTuyenDungLanDau": "2016-06-22T18:07:13",
                "coQuanToChucDonViTuyenDung": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null
                },
                "ngayVaoCoQuanHienDangCongTac": "1973-08-16T20:20:13",
                "ngayVaoDangCongSanVietNam": "1995-02-13T07:40:41",
                "ngayChinhThuc": "1978-07-08T01:50:45",
                "ngayThamGiaToChucChinhTriXaHoiDauTien": "2022-04-11T00:31:24",
                "ngayNhapNgu": "1998-10-06T21:47:49",
                "ngayXuatNgu": "2021-01-20T11:38:19",
                "capBacLoaiQuanHamQuanDoi": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 21,
                  "name": "Trung sĩ",
                  "loaiQuanHamQuanDoi": {
                    "create_at": "2024-01-28T15:18:41",
                    "update_at": null,
                    "id": 2,
                    "name": "Hạ sĩ quan"
                  }
                },
                "doiTuongChinhSach": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 2,
                  "name": "Con liệt sĩ"
                },
                "trinhDoGiaoDucPhoThong": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 1,
                  "name": "10/10"
                },
                "trinhDoChuyenMon": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 5,
                  "name": "Thạc sĩ"
                },
                "hocHam": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 3,
                  "name": "Phó giáo sư"
                },
                "danhHieuNhaNuocPhongTang": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 2,
                  "name": "Tỉnh Anh hùng"
                },
                "chucVuHienTai": "Rodriguez",
                "ngayBoNhiem": "1988-02-28T10:43:51",
                "ngayBoNhiemLai": "2018-03-04T14:06:48",
                "duocQuyHoacChucDanh": "Quo ut et et.",
                "chucVuKiemNhiem": "Runolfsdottir",
                "chucVuDangHienTai": "Bauch",
                "chucVuDangKiemNhiem": "Gusikowski",
                "congVienChinhDuocGiao": "Sunt consequuntur quisquam.",
                "soTruongCongTac": "Nemo modi animi.",
                "congViecLamLauNhat": "Consequatur eaque at ut magni provident.",
                "tienLuong": 2.0,
                "ngachNgheNghiep": "jnxdfgagqrz",
                "maSoNgachNgheNghiep": "inzqjx",
                "ngayBoNhiemNgachNgheNghiep": "2004-02-22T15:30:44",
                "bacLuong": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 10,
                  "name": "Bậc 10"
                },
                "heSoLuongNgachNgheNghiep": 4.38739,
                "ngayHuongLuongNgachNgheNghiep": "1975-05-05T02:32:02",
                "phanTramHuongLuongNgachNgheNghiep": 6.35192901,
                "phuCapThamNienVuotKhungNgachNgheNghiep": 6.59058,
                "ngayHuongPCTNVKNgachNgheNghiep": "1978-05-04T01:53:07",
                "phuCapChucVu": 3.91774,
                "phuCapKiemNhiem": 7.05684,
                "phuCapKhac": 6.55831,
                "viTriViecLam": "urkkfxpwb",
                "maSoViTriViecLam": "589976",
                "bacLuongTriViecLam": 2.0,
                "luongTheoMucTien": 2465.5021581587,
                "ngayHuongLuongTheoViTriViecLam": "1987-04-10T22:14:31",
                "phamTramHuongLuong": 7788.9725303231,
                "phuCapThamNienVuotKhung": 6.70889,
                "ngayHuongPCTNVK": "1972-12-31T16:39:19",
                "tinhTrangSucKhoe": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 1,
                  "title": "YẾU"
                },
                "chieuCao": 178.243,
                "canNang": 113.597,
                "nhomMau": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 2,
                  "name": "AB"
                },
                "lyLuanChinhTris": [
                  {
                    "create_at": "2014-01-26T21:24:25",
                    "update_at": null,
                    "id": 1,
                    "batDau": "2013-01-26T21:24:25",
                    "ketThuc": "2015-01-26T21:24:25",
                    "tenCoSoDaoTao": "2033 McCullough Manor Suite 767",
                    "hinhThucDaoTao": "265 Hand Brook Suite 741",
                    "vanBangDuocCap": "6064 Janis Mount Apt 07",
                    "loaiSoYeuLyLichChiTiet": {
                      "create_at": "2024-01-28T15:18:41",
                      "update_at": null,
                      "id": 1,
                      "name": "QUÁ TRÌNH ĐÀO TẠO, BỒI DƯỠNG"
                    }
                  }
                ],
                "nghiepVuChuyenNganhs": [],
                "kienThucAnNinhQuocPhongs": [],
                "tinHocs": [],
                "ngoaiNgus": [],
                "quaTrinhCongTacs": [],
                "banThanCoLamViecChoCheDoCus": [],
                "lamViecONuocNgoais": [],
                "khenThuongs": [],
                "kyLuats": [],
                "quanHeGiaDinhRuots": [],
                "quanHeGiaDinhRuotBenVoHoacChongs": [],
                "luongBanThans": [],
                "phuCapKhacs": []
              },
              {
                "create_at": "1993-06-21T13:51:45",
                "update_at": null,
                "id": "33303265-3262-6634-2d32-3839642d3330",
                "hovaten": "Ms. Albertha Bailey I",
                "gioiTinh": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 1,
                  "name": "Nữ"
                },
                "cacTenGoiKhac": "Shawn",
                "sinhNgay": "2001-06-11T02:14:15",
                "noiSinh": "45083 Ferry Rue Suite 336",
                "queQuan": "092 Addie Motorway Apt. 314",
                "danToc": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 14,
                  "name": "Ê Đê"
                },
                "soCCCD": "674525144556",
                "ngayCapCCCD": "2009-01-17T09:59:40",
                "soDienThoai": "683587543991",
                "soBHXH": "9906999989",
                "soBHYT": "91ninzdp",
                "noiOHienNay": "28528 Flo Motorway Suite 893",
                "thanhPhanGiaDinh": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 1,
                  "name": "Bần nông"
                },
                "ngheNghiepTruocKhiTuyenDung": "Fugit velit.",
                "ngayDuocTuyenDungLanDau": "1977-03-24T07:19:40",
                "coQuanToChucDonViTuyenDung": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null
                },
                "ngayVaoCoQuanHienDangCongTac": "1982-11-11T06:07:11",
                "ngayVaoDangCongSanVietNam": "2018-01-29T13:11:12",
                "ngayChinhThuc": "1991-03-09T10:38:07",
                "ngayThamGiaToChucChinhTriXaHoiDauTien": "2013-01-26T21:24:25",
                "ngayNhapNgu": "1994-02-14T21:54:37",
                "ngayXuatNgu": "2002-04-14T02:07:28",
                "capBacLoaiQuanHamQuanDoi": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 11,
                  "name": "Trung úy",
                  "loaiQuanHamQuanDoi": {
                    "create_at": "2024-01-28T15:18:41",
                    "update_at": null,
                    "id": 0,
                    "name": "Sĩ quan"
                  }
                },
                "doiTuongChinhSach": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 1,
                  "name": "Dân tộc thiểu số"
                },
                "trinhDoGiaoDucPhoThong": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 1,
                  "name": "10/10"
                },
                "trinhDoChuyenMon": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 2,
                  "name": "Trung cấp"
                },
                "hocHam": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 3,
                  "name": "Phó giáo sư"
                },
                "danhHieuNhaNuocPhongTang": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 5,
                  "name": "Anh hùng Lực lượng vũ trang nhân dân"
                },
                "chucVuHienTai": "Rice",
                "ngayBoNhiem": "1984-04-01T07:32:47",
                "ngayBoNhiemLai": "1991-02-15T05:28:17",
                "duocQuyHoacChucDanh": "Deleniti fugit porro.",
                "chucVuKiemNhiem": "Graham",
                "chucVuDangHienTai": "Ruecker",
                "chucVuDangKiemNhiem": "Grimes",
                "congVienChinhDuocGiao": "Qui in perferendis ab.",
                "soTruongCongTac": "Sunt ab.",
                "congViecLamLauNhat": "Ipsum dolores exercitationem.",
                "tienLuong": 0.0,
                "ngachNgheNghiep": "pedtluhworb",
                "maSoNgachNgheNghiep": "utgccz",
                "ngayBoNhiemNgachNgheNghiep": "1986-01-15T18:51:50",
                "bacLuong": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 9,
                  "name": "Bậc 9"
                },
                "heSoLuongNgachNgheNghiep": 2.82341,
                "ngayHuongLuongNgachNgheNghiep": "1998-03-07T05:36:16",
                "phanTramHuongLuongNgachNgheNghiep": 5.18620973,
                "phuCapThamNienVuotKhungNgachNgheNghiep": 2.63446,
                "ngayHuongPCTNVKNgachNgheNghiep": "2011-05-07T09:11:31",
                "phuCapChucVu": 2.22593,
                "phuCapKiemNhiem": 7.98681,
                "phuCapKhac": 4.47264,
                "viTriViecLam": "xiyuqqohu",
                "maSoViTriViecLam": "277635",
                "bacLuongTriViecLam": 6.0,
                "luongTheoMucTien": 1963.3633402988,
                "ngayHuongLuongTheoViTriViecLam": "2019-01-18T12:50:46",
                "phamTramHuongLuong": 5836.2897905779,
                "phuCapThamNienVuotKhung": 4.65168,
                "ngayHuongPCTNVK": "1998-01-16T07:19:45",
                "tinhTrangSucKhoe": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 1,
                  "title": "YẾU"
                },
                "chieuCao": 177.972,
                "canNang": 87.8471,
                "nhomMau": {
                  "create_at": "2024-01-28T15:18:41",
                  "update_at": null,
                  "id": 3,
                  "name": "O"
                },
                "lyLuanChinhTris": [],
                "nghiepVuChuyenNganhs": [],
                "kienThucAnNinhQuocPhongs": [],
                "tinHocs": [],
                "ngoaiNgus": [],
                "quaTrinhCongTacs": [],
                "banThanCoLamViecChoCheDoCus": [],
                "lamViecONuocNgoais": [],
                "khenThuongs": [],
                "kyLuats": [],
                "quanHeGiaDinhRuots": [],
                "quanHeGiaDinhRuotBenVoHoacChongs": [],
                "luongBanThans": [],
                "phuCapKhacs": []
              }
            ];
            return {
              data: data,
              success: true,
              total: data.length
            } as API.StaffList

          }}
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

        <AddNew display={visible} onChangeDisplay={onCloseModalAdd} religion={religion} />

        {/* <ModalForm

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
                  onChange: async (value: any) => {
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

        </ModalForm> */}


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
