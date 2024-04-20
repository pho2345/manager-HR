import {
  // get,
  patch,
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
  StepsForm,
  ProFormInstance,
  ProFormSwitch,

} from '@ant-design/pro-components';
import {
  Dropdown,
  Image, Menu, UploadFile, UploadProps
} from 'antd';

import configText from '@/locales/configText';
const configDefaultText = configText;


import {
  FormattedMessage,
  request,
  useParams
} from '@umijs/max';
import { Avatar, Button, Col, Drawer, Form, Input, Modal, Row, Space, Tooltip, message } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import AddNew from './AddNew';
import { getOption, getProvine, handleAdd2 } from '@/services/utils';
import { MdOutlineEdit } from 'react-icons/md';
import AddBonus from '@/reuse/bonus/AddBonus';
import UpdateForm from './UpdateForm';
import { XAC_NHAN, mapXacNhan } from '@/services/utils/constant';






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


async function get(url: string, params = {}) {
  const fetchData = await request<any>(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    params: params
  });

  console.log('fetchData', fetchData)

  return {
    total: fetchData && fetchData?.length,
    success: fetchData && true,
    data: fetchData
  }
}



const TableList: React.FC = () => {
  const collection = `${SERVER_URL_PROFILE}/nhan-vien/ho-so`;
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refId = useRef<any>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [form] = Form.useForm<any>();
  const searchInput = useRef(null);
  const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
  const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
  const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
  const [optionRangeSearch, setOptionRangeSearch] = useState<any>();
  const [selectedRow, setSelectedRow] = useState<[]>([]);

  const [religion, setReligion] = useState<GEN.Option[]>([]);
  const [membership, setMembership] = useState<GEN.Option[]>([]);

  const formRef = useRef<ProFormInstance>();
  const [openBus, setOpenBus] = useState<boolean>(false);


  const [openApproval, setOpenApproval] = useState<boolean>(false);
  const [statusApproval, setStatusApproval] = useState<"CHO_PHE_DUYET" | "DA_PHE_DUYET" | "TU_CHOI" | null>(null);

  const [visible, setVisible] = useState(false);
  const [update, setUpdate] = useState(false);

  const [officer, setOfficer] = useState<GEN.Option[]>([]);
  const [civilServant, setCivilServant] = useState<GEN.Option[]>([]);
  const [checkOfficer, setCheckOfficer] = useState<boolean>(true);


  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [document, setDocument] = useState<[]>([]);

  const [searchSoCCCD, setSearchSoCCCD] = useState<string>(``);
  const [searchHoVaTen, setSearchHoVaTen] = useState<string>(``);
  const [searchDanTocId, setSearchDanTocId] = useState<string | null>(null);
  const [searchChucVuHienTaiId, setSearchChucVuHienTaiId] = useState<string | null>(``);
  const [searchCoQuanToChucDonViId, setSearchCoQuanToChucDonViId] = useState<string>(``);
  const [pheDuyet, setPheDuyet] = useState<"CHO_PHE_DUYET" | "DA_PHE_DUYET" | "TU_CHOI" | null>(null);


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

  const handleSession = (value: any) => {
    const getSessionInfo = sessionStorage.getItem(ID_SAVE_INFO);
    if (getSessionInfo) {
      const parseSessionInfor = JSON.parse(getSessionInfo);
      if (value?.hoVaTen) {
        sessionStorage.setItem(ID_SAVE_INFO, JSON.stringify(value)); // TODO: CREATE NEW SESSION WHEN CHECK FORM 1
        return;
      }
      else {
        const newValueSession = {
          ...parseSessionInfor,
          ...value
        };
        sessionStorage.setItem(ID_SAVE_INFO, JSON.stringify(newValueSession));
      }
    }
    else {
      sessionStorage.setItem(ID_SAVE_INFO, JSON.stringify(value));
    }
  }


  const columns: ProColumns<GEN.Employee>[] = [
    {
      // title: <FormattedMessage id='page.searchTable.column.code' defaultMessage='Code' />,
      title: 'Ho tên',
      key: 'code',
      dataIndex: 'hovaten',
      // ...getColumnSearchProps('code'),
      render: (_, entity) => {
        return (
          <>{entity?.hoVaTen}</>
        );
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters,
        //close
      }: any) => (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Row gutter={24} className="m-0">
            <Col span={24} className="gutter-row p-0" >
              <ProFormText
                fieldProps={{
                  style: {
                    width: '100%'
                  },
                  value: searchHoVaTen,
                  onChange: (e) => setSearchHoVaTen(e?.target?.value)
                }}
                placeholder={'Nhập tên'}
              />
            </Col>
          </Row>
          <Space>
            <Button
              type="primary"
              onClick={() => {
                confirm()
                actionRef.current?.reload();

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
              onClick={() => {
                setSearchHoVaTen('');
                actionRef.current?.reload();
              }}
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
            color: searchHoVaTen ? '#1890ff' : undefined,
          }}
        />
      ),

    },
    {
      title: 'CCCD/CMND',
      dataIndex: 'soCCCD',
      render: (_, text) => text.soCCCD ?? "",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters,
        //close
      }: any) => (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Row gutter={24} className="m-0">
            <Col span={24} className="gutter-row p-0" >
              <ProFormText
                fieldProps={{
                  style: {
                    width: '100%'
                  },
                  value: searchSoCCCD,
                  onChange: (e) => setSearchSoCCCD(e?.target?.value)
                }}
                placeholder={'Nhập số CCCD/CMND'}
              />
            </Col>
          </Row>
          <Space>
            <Button
              type="primary"
              onClick={() => {
                confirm()
                actionRef.current?.reload();

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
              onClick={() => {
                setSearchSoCCCD('');
                actionRef.current?.reload();
              }}
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
            color: searchSoCCCD ? '#1890ff' : undefined,
          }}
        />
      ),
    },

    {
      title: 'Dân tộc',
      dataIndex: 'danToc',
      render: (_, text) => text.danTocName,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters,
        //close
      }: any) => (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Row gutter={24} className="m-0">
            <Col span={24} className="gutter-row p-0" >
              <ProFormSelect
                request={() => getOption(`${SERVER_URL_CONFIG}/dan-toc?page=0&size=100`, 'id', 'name')}
                fieldProps={{
                  onChange: (value: any) => {
                    setSearchDanTocId(value)
                  },
                  value: searchDanTocId
                }}
                showSearch
                placeholder={'Chọn dân tộc'}
              />
            </Col>
          </Row>
          <Space>
            <Button
              type="primary"
              onClick={() => {
                confirm()
                actionRef.current?.reload();

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
              onClick={() => {
                setSearchDanTocId(null);
                actionRef.current?.reload();
              }}
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
            color: searchDanTocId ? '#1890ff' : undefined,
          }}
        />
      ),
    },
    {
      title: 'Chức vụ hiện tại',
      key: 'chucVuDangHienTaiName',
      // dataIndex: 'gioiTinh',
      render: (_, entity) => entity.chucVuDangHienTaiName ?? "",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters,
        //close
      }: any) => (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Row gutter={24} className="m-0">
            <Col span={24} className="gutter-row p-0" >
              <ProFormSelect
                request={() => getOption(`${SERVER_URL_CONFIG}/chuc-vu?page=0&size=100`, 'id', 'name')}
                fieldProps={{
                  onChange: (value: any) => {
                    setSearchDanTocId(value)
                  },
                  value: searchDanTocId
                }}
                showSearch
                placeholder={'Chọn chức vụ'}
              />
            </Col>
          </Row>
          <Space>
            <Button
              type="primary"
              onClick={() => {
                confirm()
                actionRef.current?.reload();

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
              onClick={() => {
                setSearchChucVuHienTaiId(null);
                actionRef.current?.reload();
              }}
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
            color: searchChucVuHienTaiId ? '#1890ff' : undefined,
          }}
        />
      ),
    },
    // {
    //   title: 'Co quan to chuc don vi',
    //   key: '',
    //   // dataIndex: 'gioiTinh',
    //   render: (_, entity) => entity.co ?? "",
    //   filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters,
    //     //close
    //   }: any) => (
    //     <div
    //       style={{
    //         padding: 8,
    //       }}
    //       onKeyDown={(e) => e.stopPropagation()}
    //     >
    //       <Row gutter={24} className="m-0">
    //         <Col span={24} className="gutter-row p-0" >
    //           <ProFormSelect
    //             request={() => getOption(`${SERVER_URL_CONFIG}/chuc-vu?page=0&size=100`, 'id', 'name')}
    //             fieldProps={{
    //               onChange: (value: any) => {
    //                 setSearchDanTocId(value)
    //               },
    //               value: searchDanTocId
    //             }}
    //             showSearch
    //             placeholder={'Chọn chức vụ'}
    //           />
    //         </Col>
    //       </Row>
    //       <Space>
    //         <Button
    //           type="primary"
    //           onClick={() => {
    //             confirm()
    //             actionRef.current?.reload();

    //           }}
    //           icon={<SearchOutlined />}
    //           size="small"
    //           style={{
    //             width: 90,
    //           }}
    //         >
    //           Tìm kiếm
    //         </Button>
    //         <Button
    //           onClick={() => {
    //             setSearchChucVuHienTaiId(null);
    //             actionRef.current?.reload();
    //           }}
    //           size="small"
    //           style={{
    //             width: 90,
    //           }}
    //         >
    //           Làm mới
    //         </Button>

    //       </Space>
    //     </div>
    //   ),
    //   filterIcon: (filtered: boolean) => (
    //     <SearchOutlined
    //       style={{
    //         color: searchChucVuHienTaiId ? '#1890ff' : undefined,
    //       }}
    //     />
    //   ),
    // },
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






    // {
    //   title: 'Giới tính',
    //   key: 'gioiTinh',
    //   // dataIndex: 'gioiTinh',
    //   render: (_, entity) => entity.gioiTinh ?? ""
    // },
    {
      title: 'Trạng thái',
      key: 'trangThai',
      // dataIndex: 'gioiTinh',
      render: (_, entity) => {
        return (
          <>{mapXacNhan(entity.pheDuyet)}</>
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
      render: (_, entity: any) => {
        const menu = (
          <Menu>
            <Menu.Item key="2"
              onClick={() => {
                // setOpenWgs(true);
                // refIdCateogry.current = entity.id;
                // refNameCategory.current = entity.attributes.name;
                setUpdate(true);
                refId.current = entity.id
              }}
            >Cập nhật</Menu.Item>
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

  const disabledDate = (current: any) => {
    return current && current > moment();
  };

  useEffect(() => {
    const getValues = async () => {
      try {
        const getofficer = await getOption(`${SERVER_URL_CONFIG}/ngach-vien-chuc?page=0&size=100`, 'ma', 'name');
        const getcivilServant = await getOption(`${SERVER_URL_CONFIG}/ngach-cong-chuc?page=0&size=100`, 'ma', 'name');

        setOfficer(getofficer);
        setCivilServant(getcivilServant)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getValues();
  }, []);

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

  const add = (fields: any) => {
    return handleAdd2(fields, `${collection}`)
  }

  const updateProfile = async (data: GEN.ThongTinCanBo) => {
    const up = await patch(`${SERVER_URL_ACCOUNT}/nhan-vien/ho-so/${refId.current}`, data);
    if (up) {
      message.success("Cập nhật thành công");
      setVisible(false);
      if (actionRef.current) {
        actionRef.current?.reloadAndRest?.();
      }
    }
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

              
                selectedRow.length > 0 && (<Button
                  type='dashed'
                  key='primary'
                  onClick={() => {
                    setOpenApproval(true);
                  }}
                >
                   Phê duyệt
                </Button>) 
              ,
            ]
          }}

          // toolbar={{
          //   settings: [{
          //     key: 'reload',
          //     tooltip: configDefaultText['reload'],
          //     icon: <ReloadOutlined></ReloadOutlined>,
          //     onClick: () => {
          //       if (actionRef.current) {
          //         actionRef.current.reload();
          //       }
          //     }
          //   }]
          // }}



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

          dataSource={document}

          request={async () => {
            const data = await get(`${collection}`, {
              soCCCD: searchSoCCCD,
              hoVaTen: searchHoVaTen,
              danTocId: searchDanTocId,
              chucVuHienTaiId: searchChucVuHienTaiId,
              coQuanToChucDonViId: searchCoQuanToChucDonViId,
              pheDuyet: pheDuyet
            });
            console.log('data', data)
            setDocument(data?.data);
            return data;
          }}

          columns={columns}
          rowSelection={{
            onChange: (selectedRowKeys: any, selectedRows: any) => {
              const id = selectedRowKeys.map((e: any) => ({id: e}));
              setSelectedRow(id);
            },
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


        <ModalForm
          form={form}
          title={'Phê duyệt'}
          width={window.innerWidth * 0.3}
          open={openApproval}

          modalProps={{
            destroyOnClose: true,
            onCancel: () => {
              setOpenApproval(false);
            },
          }}
          onFinish={async (value) => {
            const success = await add(value as API.RuleListItem);
            if (success) {
              setOpenApproval(false);
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
              <ProFormSelect
                label={"Trạng thái"}
                // width='md'
                name='trangThai'
                placeholder={`Trạng thái`}
                rules={[
                  {
                    required: true,
                    message:  "Vui lòng chọn trạng thái"
                  },
                ]} 
                fieldProps={{
                  value: statusApproval
                }}
                options={XAC_NHAN}
                onChange={(e) => setStatusApproval(e)}
                />


            </Col>
          </Row>
        </ModalForm>

        {/* <AddBonus actionRef={actionRef} createModalOpen={openBus} handleModalOpen={setOpenBus} id={refId.current}/> */}

        {/* <UpdateForm visible={update} setVisible={setUpdate} handleSession={handleSession} id={refId.current} actionRef={actionRef}/> */}

        <StepsForm<{
          name: string;
        }>
          formRef={formRef}
          onCurrentChange={(value: number) => {
            // onUpdateModel()
            console.log(value)
          }}
          onFinish={async (value) => {

            let sesstion = JSON.parse(sessionStorage.getItem(ID_SAVE_INFO) as any);
            const dateAll = {
              ...sesstion,
              ...value
            }
            const data: GEN.ThongTinCanBo = {
              hoVaTen: dateAll.hoVaTen,
              gioiTinh: dateAll.gioiTinh,
              cacTenGoiKhac: dateAll.cacTenGoiKhac,
              sinhNgay: moment(dateAll.sinhNgay).toISOString(),
              noiSinh: dateAll.noiSinh,
              queQuan: dateAll.queQuan,
              danToc: dateAll.danToc,
              tonGiao: dateAll.tonGiao,
              soCCCD: dateAll.soCCCD,
              ngayCapCCCD: moment(dateAll.ngayCapCCCD).toISOString(),
              soDienThoai: dateAll.soDienThoai,
              soBHYT: dateAll.soBHYT,
              soBHXH: dateAll.soBHXH,
              noiOHienNay: dateAll.noiOHienNay,
              thanhPhanGiaDinh: dateAll.thanhPhanGiaDinh,
              thongTinTuyenDung: {
                ngheNghiepTruocKhiTuyenDung: dateAll.ngheNghiepTruocKhiTuyenDung,
                ngayDuocTuyenDungLanDau: moment(dateAll.ngayDuocTuyenDungLanDau).toISOString(),
                ngayVaoCoQuanHienDangCongTac: moment(dateAll.ngayVaoCoQuanHienDangCongTac).toISOString(),
                ngayVaoDangCongSanVietNam: moment(dateAll.ngayVaoDangCongSanVietNam).toISOString(),
                ngayChinhThuc: moment(dateAll.ngayChinhThuc).toISOString(),
                ngayThamGiaToChucChinhTriXaHoiDauTien: moment(dateAll.ngayThamGiaToChucChinhTriXaHoiDauTien).toISOString(),
                congViecChinhDuocGiao: dateAll.congViecChinhDuocGiao,
                soTruongCongTac: dateAll.soTruongCongTac,
                congViecLamLauNhat: dateAll.congViecLamLauNhat,
              },
              quanSu: {
                ngayNhapNgu: moment(dateAll.ngayNhapNgu).toISOString(),
                ngayXuatNgu: moment(dateAll.ngayXuatNgu).toISOString(),
                capBacLoaiQuanHamQuanDoi: dateAll.capBacLoaiQuanHamQuanDoi,
              },
              doiTuongChinhSach: dateAll.doiTuongChinhSach,

              hocVan: {
                trinhDoGiaoDucPhoThong: dateAll.trinhDoGiaoDucPhoThong,
                trinhDoChuyenMon: dateAll.trinhDoChuyenMon,
                hocHam: dateAll.hocHam,
                danhHieuNhaNuocPhongTang: dateAll.danhHieuNhaNuocPhongTang,
              },
              chucVu: {
                chucVuHienTaiId: dateAll.chucVuHienTai,
                ngayBoNhiem: moment(dateAll.ngayBoNhiem).toISOString(),
                ngayBoNhiemLai: moment(dateAll.ngayBoNhiemLai).toISOString(),
                duocQuyHoacChucDanh: dateAll.duocQuyHoacChucDanh,
                phuCapChucVu: dateAll?.phuCapChucVu || 0,
                coQuanToChucDonViTuyenDungId: dateAll.coQuanToChucDonViTuyenDung,
              },

              chucVuKiemNhiem: {
                chucVuKiemNhiemId: dateAll.chucVuDangKiemNhiem,
                ngayBoNhiem: moment(dateAll.ngayBoNhiem).toISOString(),
                phuCapKiemNhiem: parseInt(dateAll.phuCapKiemNhiem) || 0,
                phuCapKhac: parseInt(dateAll.phuCapKhac) || 0,
              },
              chucVuDangHienTai: dateAll.chucVuDangHienTai,
              chucVuDangKiemNhiem: dateAll.chucVuDangKiemNhiem,
              tienLuong: dateAll.tienLuong,
              ngach: {
                ngachId: dateAll.ngachNgheNghiep,
                ngayBoNhiemNgach: moment(dateAll.ngayBoNhiemNgach).toISOString(),
                ngayHuongLuongNgach: moment(dateAll.ngayHuongLuongNgach).toISOString(),
                phanTramHuongLuongNgach: parseFloat(dateAll.phanTramHuongLuongNgach) || 0,
                phuCapThamNienVuotKhungNgach: parseFloat(dateAll.phuCapThamNienVuotKhungNgach) || 0,
                ngayHuongPCTNVKNgach: moment(dateAll.ngayHuongPCTNVKNgach).toISOString(),
              },
              phuCapChucVu: dateAll.phuCapChucVu,
              phuCapKiemNhiem: dateAll.phuCapKiemNhiem,
              phuCapKhac: dateAll.phuCapKhac,
              viecLam: {
                viTriViecLamId: dateAll.viTriViecLam,
                ngayHuongLuongViTriViecLam: moment(dateAll.ngayHuongLuongViTriViecLam).toISOString(),
                phamTramHuongLuong: parseFloat(dateAll.phamTramHuongLuong) || 0,
                phuCapThamNienVuotKhung: parseFloat(dateAll.phuCapThamNienVuotKhung) || 0,
                ngayHuongPCTNVK: moment(dateAll.ngayHuongPCTNVK).toISOString(),
              },
              sucKhoe: {
                tinhTrangSucKhoe: dateAll.tinhTrangSucKhoe || "TOT",
                chieuCao: dateAll.chieuCao,
                canNang: dateAll.canNang,
                nhomMau: dateAll.nhomMau,
              },
              "pheDuyet": "CHO_PHE_DUYET"
            }

            await updateProfile(data);
            setUpdate(false);
            return true
          }}
          formProps={{
            validateMessages: {
              required: "Lỗi",
            },
          }}

          stepsFormRender={(dom, submitter) => {
            return (
              <Modal
                title="Cập nhật viên chức"
                width={800}
                onCancel={() => setUpdate(false)}
                open={update}
                footer={submitter}
                destroyOnClose={true}
                style={{
                  width: '70vh'
                }}
                onOk={() => {
                  console.log('dd')
                }}
              >
                {dom}
              </Modal>
            );
          }}
        >
          <StepsForm.StepForm<{
            name: string;
          }>

            name="base"
            title="Thông tin chung"
            stepProps={{
            }}


            onFinish={async (value: object) => {
              handleSession(value);
              return true
            }}
          >
            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0" >
                <ProFormText
                  name="hoVaTen"
                  label={<FormattedMessage id="page.profile.name" defaultMessage="Họ tên" />}
                  placeholder={configDefaultText["page.listCow.column.name"]}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.name" defaultMessage="Họ tên" /> },
                  ]}
                />
              </Col>

              <Col span={12} className="gutter-row p-0">
                <ProFormSelect
                  name="gioiTinh"
                  showSearch

                  label={<FormattedMessage id="page.profile.sex" defaultMessage="Giới tính" />}
                  placeholder={"Giới tính"}
                  options={[
                    {
                      label: 'Nam',
                      value: 'NAM'
                    }
                  ]}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.sex" defaultMessage="Giới tính" /> }
                  ]}
                />
              </Col>
            </Row>

            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0" >
                <ProFormSelect
                  className="w-full"
                  name="danToc"
                  label={<FormattedMessage id="page.profile.nation" defaultMessage="Dân tộc" />}
                  placeholder={"Dân tộc"}
                  showSearch
                  request={() => getOption(`${SERVER_URL_CONFIG}/dan-toc`, 'id', 'name')}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.nation" defaultMessage="Dân tộc" /> }
                  ]}
                />
              </Col>

              <Col span={12} className="gutter-row p-0">
                <ProFormDatePicker
                  fieldProps={{
                    style: {
                      width: "100%"
                    },
                    disabledDate: disabledDate
                  }}
                  name="sinhNgay"
                  label={configDefaultText["page.listCow.column.birthdate"]}
                  placeholder={configDefaultText["page.listCow.column.birthdate"]}
                  rules={[
                    { required: true, message: configDefaultText["page.listCow.required.birthdate"] },
                  ]}
                />
              </Col>
            </Row>

            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0" >
                <ProFormSelect
                  className="w-full"
                  name="tonGiao"
                  label={"Tôn giáo"}
                  placeholder={"Tôn giáo"}
                  showSearch
                  request={() => getOption(`${SERVER_URL_CONFIG}/ton-giao`, 'id', 'name')}
                  rules={[
                    { required: true, message: "Tôn giáo" }
                  ]}
                />
              </Col>


            </Row>

            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0" >
                <ProFormText
                  className="w-full"
                  name="soDienThoai"
                  label={<FormattedMessage id="page.profile.phone" defaultMessage="Số điện thoại" />}
                  placeholder={"Số điện thoại"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.phone" defaultMessage="Số điện thoại" /> },
                  ]}
                />
              </Col>

              <Col span={12} className="gutter-row p-0">
                <ProFormText
                  className="w-full"
                  name="soBHXH"
                  label={<FormattedMessage id="page.profile.socialInsurance" defaultMessage="Mã BHXH" />}
                  placeholder={"Mã BHXH"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.socialInsurance" defaultMessage="Mã BHXH" /> },
                  ]}
                />
              </Col>
            </Row>

            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0" >
                <ProFormText
                  className="w-full"
                  name="soBHYT"
                  label={<FormattedMessage id="page.profile.healthInsurance" defaultMessage="Số BHYT" />}
                  placeholder={"Số BHYT"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.healthInsurance" defaultMessage="Số BHYT" /> },
                  ]}
                />
              </Col>

              <Col span={12} className="gutter-row p-0">
                <ProFormText
                  className="w-full"
                  name="noiOHienNay"
                  label={<FormattedMessage id="page.profile.accommodationToday" defaultMessage="Nơi ở hiện nay" />}
                  placeholder={"Nơi ở hiện nay"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.accommodationToday" defaultMessage="Nơi ở hiện nay" /> },
                  ]}
                />
              </Col>
            </Row>

            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0" >
                <ProFormSelect
                  className="w-full"
                  name="noiSinh"
                  label={<FormattedMessage id="page.profile.placeOfBirth" defaultMessage="Nơi sinh" />}
                  placeholder={"Nơi sinh"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.placeOfBirth" defaultMessage="Nơi sinh" /> },
                  ]}
                  request={() => getProvine()}
                />
              </Col>

              <Col span={12} className="gutter-row p-0">
                <ProFormSelect
                  className="w-full"
                  name="queQuan"
                  label={<FormattedMessage id="page.profile.homeTown" defaultMessage="Quê quán" />}
                  placeholder={"Quê quán"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.homeTown" defaultMessage="Quê quán" /> },
                  ]}
                  request={() => getProvine()}
                />
              </Col>
            </Row>

            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0">
                <ProFormSelect
                  className="w-full"
                  name="healthInsurance"
                  label={"Tình trạng sức khỏe"}
                  placeholder={"Tình trạng sức khỏe"}
                  rules={[
                    { required: true, message: "Tình trạng sức khỏe" }
                  ]}
                  options={[
                    {
                      label: "TỐT",
                      value: 'TOT'
                    }
                  ]}
                />
              </Col>

            </Row>

            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0">
                <ProFormText
                  className="w-full"
                  name="soCCCD"
                  label={<FormattedMessage id="page.profile.numberIdentify" defaultMessage="CMND/CCCD" />}
                  placeholder={"CMND/CCCD"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.numberIdentify" defaultMessage="CMND/CCCD" /> }
                  ]}
                />
              </Col>
              <Col span={12} className="gutter-row p-0">
                <ProFormDatePicker
                  fieldProps={{
                    style: {
                      width: "100%"
                    },
                    disabledDate: disabledDate
                  }}
                  name="ngayCapCCCD"
                  label={<FormattedMessage id="page.profile.dateNumberIdentify" defaultMessage="Ngày cấp CCCD/CMND" />}
                  placeholder={"Ngày cấp CCCD/CMND"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.dateNumberIdentify" defaultMessage="Ngày cấp CCCD/CMND" /> },
                  ]}
                />
              </Col>
            </Row>

            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0">
                <ProFormText
                  className="w-full"
                  name="cacTenGoiKhac"
                  label={<FormattedMessage id="page.profile.diffName" defaultMessage="Tên gọi khác" />}
                  placeholder={"Tên gọi khác"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.diffName" defaultMessage="Tên gọi khác" /> }
                  ]}
                />
              </Col>

              <Col span={12} className="gutter-row p-0">
                <ProFormDigit
                  className="w-full"
                  name="chieuCao"
                  label={<FormattedMessage id="page.profile.tall" defaultMessage="Chiều cao" />}
                  placeholder={"Chiều cao"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.tall" defaultMessage="Chiều cao" /> }
                  ]}
                />
              </Col>
            </Row>

            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0">
                <ProFormText
                  className="w-full"
                  name="canNang"
                  label={<FormattedMessage id="page.profile.forte" defaultMessage="Sở trường công tác" />}
                  placeholder={"Cân nặng"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.diffName" defaultMessage="Tên gọi khác" /> }
                  ]}
                />
              </Col>

              <Col span={12} className="gutter-row p-0">
                <ProFormSelect
                  className="w-full"
                  name="nhomMau"
                  label={<FormattedMessage id="page.profile.groupBlood" defaultMessage="Nhóm máu" />}
                  placeholder={"Nhóm máu"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.groupBlood" defaultMessage="Nhóm máu" /> }
                  ]}
                  request={() => getOption(`${SERVER_URL_CONFIG}/nhom-mau?page=0&size=100`, 'id', 'name')}
                />
              </Col>
            </Row>

          </StepsForm.StepForm>

          <StepsForm.StepForm<{
            name: string;
          }>
            name="base1"
            title="Biên chế, chức vụ, Ngạch, Bậc"
            stepProps={{
            }}

            onFinish={async (value: object) => {
              handleSession(value);
              return true
            }}

          >

            <ProFormSwitch
              checkedChildren="Công chức"
              unCheckedChildren="Viên chức"
              label="Loại"

              fieldProps={{
                onChange: (e) => {
                  setCheckOfficer(e)
                },
                checked: checkOfficer,

              }}
            />


            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0" >
                <ProFormSelect
                  name="ngachNgheNghiep"
                  label={<FormattedMessage id="page.profile.quotaCareer" defaultMessage="Ngạch nghề nghiệp" />}
                  placeholder={"Ngạch nghề nghiệp"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.quotaCareer" defaultMessage="Ngạch nghề nghiệp" /> },
                  ]}
                  fieldProps={{
                    style: {
                      width: "100%"
                    },
                  }}
                  showSearch
                  options={!checkOfficer ? officer : civilServant}

                // request={() => checkOfficer ? getOption(`${SERVER_URL_CONFIG}/ngach-vien-chuc?page=0&size=100`, 'ma', 'name') : getOption(`${SERVER_URL_CONFIG}/ngach-cong-chuc`, 'ma', 'name')}

                />
              </Col>

              <Col span={12} className="gutter-row p-0 w-full">
                <ProFormDatePicker
                  name="ngayBoNhiemNgach"
                  label={<FormattedMessage id="page.profile.dateAppointmentQuotaCareer" defaultMessage="Ngày bổ nhiệm ngạch" />}
                  placeholder={"Ngày bổ nhiệm ngạch"}
                  fieldProps={{
                    style: {
                      width: "100%"
                    },
                    disabledDate: disabledDate
                  }}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.dateAppointmentQuotaCareer" defaultMessage="Ngày bổ nhiệm ngạch" /> }
                  ]}

                />
              </Col>
            </Row>

            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0 w-full" >
                <ProFormDatePicker
                  name="ngayHuongLuongNgach"
                  label={<FormattedMessage id="page.profile.dateGetSalaryQuotaCareer" defaultMessage="Ngày hưởng lương ngạch nghề nghiệp" />}
                  placeholder={"Ngày hưởng lương ngạch nghề nghiệp"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.dateGetSalaryQuotaCareer" defaultMessage="Ngày hưởng lương ngạch nghề nghiệp" /> }
                  ]}
                  fieldProps={{
                    style: {
                      width: "100%"
                    },
                    disabledDate: disabledDate
                  }}
                />
              </Col>

              <Col span={12} className="gutter-row p-0">
                <ProFormDatePicker
                  fieldProps={{
                    style: {
                      width: "100%"
                    },
                    disabledDate: disabledDate
                  }}
                  name="ngayHuongPCTNVKNgachNgheNghiep"
                  label={<FormattedMessage id="page.profile.dateGetAllowancePassQuotaCareer" defaultMessage="Ngày hưởng phụ cấp thâm niên vượt khung ngạch nghề nghiệp" />}
                  placeholder={"Ngày hưởng phụ cấp thâm niên vượt khung ngạch nghề nghiệp"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.dateGetAllowancePassQuotaCareer" defaultMessage="Ngày hưởng phụ cấp thâm niên vượt khung ngạch nghề nghiệp" /> },
                  ]}
                />
              </Col>
            </Row>

            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0" >
                <ProFormText
                  className="w-full"
                  name="ngheNghiepTruocKhiTuyenDung"
                  label={<FormattedMessage id="page.profile.beforeJob" defaultMessage="Nghề nghiệp trước khi tuyển dụng" />}
                  placeholder={"Nghề nghiệp trước khi tuyển dụng"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.beforeJob" defaultMessage="Nghề nghiệp trước khi tuyển dụng" /> },
                  ]}
                />
              </Col>

              <Col span={12} className="gutter-row p-0">
                <ProFormSelect
                  className="w-full"
                  name="coQuanToChucDonViTuyenDung"
                  label={<FormattedMessage id="page.profile.recruitmentAgency" defaultMessage="Cơ quan, đơn vị tuyển dụng" />}
                  placeholder={"Cơ quan, đơn vị tuyển dụng"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.recruitmentAgency" defaultMessage="Cơ quan, đơn vị tuyển dụng" /> },
                  ]}
                  request={() => getOption(`${SERVER_URL_CONFIG}/coquan-tochuc-donvi?page=0&size=100`, 'id', 'name')}
                />

              </Col>
            </Row>

            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0">
                <ProFormSelect
                  className="w-full"
                  name="chucVuHienTai"
                  label={"Chức vụ hiện tại"}
                  placeholder={"Chức vụ hiện tại"}
                  rules={[
                    { required: true, message: "Chức vụ hiện tại" },
                  ]}
                  request={() => getOption(`${SERVER_URL_CONFIG}/chuc-vu?page=0&size=100`, 'id', 'name')}
                />
              </Col>

              <Col span={12} className="gutter-row p-0" >
                <ProFormDigit
                  className="w-full"
                  name="tienLuong"
                  label={"Tiền lương"}
                  placeholder={"Tiền lương"}
                  rules={[
                    { required: true, message: "Tiền lương" },
                  ]}
                />
              </Col>
            </Row>


            <Row gutter={24} className="m-0">

              <Col span={12} className="gutter-row p-0" >
                <ProFormDigit
                  className="w-full"
                  name="phuCapChucVu"
                  label={"Phụ cấp chức vụ"}
                  placeholder={"Phụ cấp chức vụ"}
                  rules={[
                    { required: true, message: "Phụ cấp chức vụ" },
                  ]}
                />
              </Col>

              <Col span={12} className="gutter-row p-0" >
                <ProFormDigit
                  className="w-full"
                  name="phuCapKiemNhiem"
                  label={"Phụ cấp kiêm nhiệm"}
                  placeholder={"Phụ cấp kiêm nhiệm"}
                  rules={[
                    { required: true, message: "Phụ cấp kiêm nhiệm" },
                  ]}
                />
              </Col>
            </Row>

            <Row gutter={24} className="m-0">

              <Col span={12} className="gutter-row p-0" >
                <ProFormDigit
                  className="w-full"
                  name="phuCapKhac"
                  label={"Phụ cấp khác"}
                  placeholder={"Phụ cấp khác"}
                  rules={[
                    { required: true, message: "Phụ cấp khác" },
                  ]}
                />
              </Col>


            </Row>


            <Row gutter={24} className="m-0">

              <Col span={12} className="gutter-row p-0">
                <ProFormSelect
                  className="w-full"
                  name="viTriViecLam"
                  label={"Vị trí việc làm"}
                  placeholder={"Vị trí việc làm"}
                  rules={[
                    { required: true, message: "Vị trí việc làm" },
                  ]}
                  request={() => getOption(`${SERVER_URL_CONFIG}/chuc-danh-dang?page=0&size=100`, 'id', 'name')}
                />
              </Col>

              <Col span={12} className="gutter-row p-0" >
                <ProFormDatePicker
                  className="w-full"
                  name="ngayHuongLuongTheoViTriViecLam"
                  label={"Ngày hưởng lương"}
                  placeholder={"Ngày hưởng lương"}
                  rules={[
                    { required: true, message: "Ngày hưởng lương" },
                  ]}
                  fieldProps={{
                    style: {
                      width: "100%"
                    },
                    disabledDate: disabledDate
                  }}
                />
              </Col>
            </Row>
            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0" >
                <ProFormDatePicker
                  className="w-full"
                  name="ngayVaoCoQuanHienDangCongTac"
                  label={<FormattedMessage id="page.profile.dateAgencyToDo" defaultMessage="Ngày vào cơ quan công tác" />}
                  placeholder={"Ngày vào cơ quan công tác"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.dateAgencyToDo" defaultMessage="Ngày vào cơ quan công tác" /> },
                  ]}
                  fieldProps={{
                    style: {
                      width: "100%"
                    },
                    disabledDate: disabledDate
                  }}
                />
              </Col>

              <Col span={12} className="gutter-row p-0">
                <ProFormDatePicker
                  className="w-full"
                  name="ngayBoNhiem"
                  label={<FormattedMessage id="page.profile.dateAppointment" defaultMessage="Ngày bổ nhiệm" />}
                  placeholder={"Ngày bổ nhiệm"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.dateAppointment" defaultMessage="Ngày bổ nhiệm" /> },
                  ]}
                  fieldProps={{
                    style: {
                      width: "100%"
                    },
                    disabledDate: disabledDate
                  }}
                />
              </Col>
            </Row>

            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0" >
                <ProFormDatePicker
                  className="w-full"
                  name="ngayBoNhiemLai"
                  label={<FormattedMessage id="page.profile.dateReAppointment" defaultMessage="Ngày bổ nhiệm lại" />}
                  placeholder={"Ngày bổ nhiệm lại"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.dateReAppointment" defaultMessage="Ngày bổ nhiệm lại" /> },
                  ]}
                  fieldProps={{
                    style: {
                      width: "100%"
                    },
                    disabledDate: disabledDate
                  }}
                />
              </Col>

              <Col span={12} className="gutter-row p-0">
                <ProFormSelect
                  className="w-full"
                  name="chucVuKiemNhiem"
                  label={<FormattedMessage id="page.profile.chargePosition" defaultMessage="Chức vụ kiêm nhiệm" />}
                  placeholder={"Chức vụ kiêm nhiệm"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.chargePosition" defaultMessage="Chức vụ kiêm nhiệm" /> },
                  ]}
                  request={() => getOption(`${SERVER_URL_CONFIG}/chuc-vu?page=0&size=100`, 'id', 'name')}
                />
              </Col>
            </Row>

            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0">
                <ProFormText
                  className="w-full"
                  name="duocQuyHoacChucDanh"
                  label={<FormattedMessage id="page.profile.planningPosition" defaultMessage="Được quy hoạch chức danh" />}
                  placeholder={"Được quy hoạch chức danh"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.planningPosition" defaultMessage="Được quy hoạch chức danh" /> }
                  ]}
                />
              </Col>
              <Col span={12} className="gutter-row p-0">
                <ProFormSelect
                  name="chucVuDangHienTai"
                  label={<FormattedMessage id="page.profile.currentPositionCommunistParty" defaultMessage="Chức vụ Đảng hiện tại" />}
                  placeholder={"Chức vụ Đảng hiện tại"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.currentPositionCommunistParty" defaultMessage="Chức vụ Đảng hiện tại" /> },
                  ]}
                  request={() => getOption(`${SERVER_URL_CONFIG}/chuc-danh-dang?page=0&size=100`, 'id', 'name')}
                />
              </Col>
            </Row>

            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0">
                <ProFormSelect
                  className="w-full"
                  name="chucVuDangKiemNhiem"
                  label={<FormattedMessage id="page.profile.chargePositionCommunistParty" defaultMessage="Chức vụ Đảng kiêm nhiệm" />}
                  placeholder={"Chức vụ Đảng kiêm nhiệm"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.chargePositionCommunistParty" defaultMessage="Chức vụ Đảng kiêm nhiệm" /> }
                  ]}
                  request={() => getOption(`${SERVER_URL_CONFIG}/chuc-danh-dang?page=0&size=100`, 'id', 'name')}

                />
              </Col>

              <Col span={12} className="gutter-row p-0">
                <ProFormText
                  className="w-full"
                  name="congViecChinhDuocGiao"
                  label={<FormattedMessage id="page.profile.mainJob" defaultMessage="Công việc chính" />}
                  placeholder={"Công việc chính"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.mainJob" defaultMessage="Công việc chính" /> }
                  ]}
                // options={jobPosition}
                />
              </Col>
            </Row>

            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0">
                <ProFormText
                  className="w-full"
                  name="soTruongCongTac"
                  label={<FormattedMessage id="page.profile.forte" defaultMessage="Sở trường công tác" />}
                  placeholder={"Sở trường công tác"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.forte" defaultMessage="Sở trường công tác" /> }
                  ]}
                />
              </Col>

              <Col span={12} className="gutter-row p-0">
                <ProFormText
                  className="w-full"
                  name="congViecLamLauNhat"
                  label={<FormattedMessage id="page.profile.positionLongest" defaultMessage="Công việc lâu nhất" />}
                  placeholder={"Công việc lâu nhất"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.positionLongest" defaultMessage="Công việc lâu nhất" /> }
                  ]}
                />
              </Col>
            </Row>

          </StepsForm.StepForm>

          <StepsForm.StepForm
            name="base2"
            title={"Trình độ, đào tạo"}
            onFinish={async (value) => {
              // await waitTime(2000);
              handleSession(value);

              return true;
            }}
            className="w-full"
          >

            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0 w-full" >
                <ProFormDatePicker
                  fieldProps={{
                    style: {
                      width: "100%"
                    },
                    disabledDate: disabledDate
                  }}
                  name="ngayVaoDangCongSanVietNam"
                  label={<FormattedMessage id="page.profile.dateJoinCommunistParty" defaultMessage="Ngày vào Đảng" />}
                  placeholder={"Ngày vào Đảng"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.dateJoinCommunistParty" defaultMessage="Ngày vào Đảng" /> },
                  ]}
                />
              </Col>
              <Col span={12} className="gutter-row p-0 w-full" >
                <ProFormDatePicker
                  fieldProps={{
                    style: {
                      width: "100%"
                    },
                    disabledDate: disabledDate
                  }}
                  name="ngayNhapNgu"
                  label={<FormattedMessage id="page.profile.dateOfEnlistment" defaultMessage="Ngày nhập ngũ" />}
                  placeholder={"Ngày nhập ngũ"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.dateOfEnlistment" defaultMessage="Ngày nhập ngũ" /> },
                  ]}
                />
              </Col>
            </Row>

            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0 w-full" >
                <ProFormDatePicker
                  fieldProps={{
                    style: {
                      width: "100%"
                    },
                    disabledDate: disabledDate
                  }}
                  name="ngayXuatNgu"
                  label={<FormattedMessage id="page.profile.dateDischargedFromMilitaryService" defaultMessage="Ngày xuất ngũ" />}
                  placeholder={"Ngày xuất ngũ"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.dateDischargedFromMilitaryService" defaultMessage="Ngày xuất ngũ" /> },
                  ]}
                />
              </Col>

              <Col span={12} className="gutter-row p-0 w-full" >
                <ProFormDatePicker
                  fieldProps={{
                    style: {
                      width: "100%"
                    },
                    disabledDate: disabledDate
                  }}
                  name="ngayThamGiaToChucChinhTriXaHoiDauTien"
                  label={<FormattedMessage id="page.profile.firstDateJoinLargestSocialPoliticalOrg" defaultMessage="Ngày tham gia tổ chức chính trị - xã hội đầu tiên" />}
                  placeholder={"Ngày tham gia tổ chức chính trị - xã hội đầu tiên"}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.firstDateJoinLargestSocialPoliticalOrg" defaultMessage="Ngày tham gia tổ chức chính trị - xã hội đầu tiên" /> },
                  ]}
                />
              </Col>

            </Row>

            <Row gutter={24} className="m-0">

              <Col span={12} className="gutter-row p-0 w-full" >
                <ProFormSelect
                  className="w-full"
                  name="doiTuongChinhSach"
                  label={<FormattedMessage id="page.profile.policyOjbect" defaultMessage="Đối tượng chính sách" />}
                  placeholder={"Đối tượng chính sách"}
                  showSearch
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.policyOjbect" defaultMessage="Đối tượng chính sách" /> }
                    // { required: true, message: "Dân tộc" }
                  ]}
                  request={() => getOption(`${SERVER_URL_CONFIG}/doi-tuong-chinh-sach`, 'id', 'name')}
                />
              </Col>

              <Col span={12} className="gutter-row p-0 w-full" >
                <ProFormSelect
                  className="w-full"
                  name="trinhDoGiaoDucPhoThong"
                  label={<FormattedMessage id="page.profile.secondaryEducationLevel" defaultMessage="Trình độ giáo dục phổ thông" />}
                  placeholder={"Trình độ giáo dục phổ thông"}
                  showSearch
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.secondaryEducationLevel" defaultMessage="Trình độ giáo dục phổ thông" /> }
                  ]}
                  request={() => getOption(`${SERVER_URL_CONFIG}/trinh-do-giao-duc-pho-thong`, 'id', 'name')}
                />
              </Col>
            </Row>

            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0 w-full" >
                <ProFormSelect
                  className="w-full"
                  name="trinhDoChuyenMon"
                  label={<FormattedMessage id="page.profile.professionalLevel" defaultMessage="Trình độ chuyên môn" />}
                  placeholder={"Trình độ chuyên môn"}
                  showSearch
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.professionalLevel" defaultMessage="Trình độ chuyên môn" /> }
                  ]}

                  request={() => getOption(`${SERVER_URL_CONFIG}/trinh-do-chuyen-mon?page=0&size=100`, 'id', 'name')}
                />
              </Col>

              <Col span={12} className="gutter-row p-0 w-full" >
                <ProFormSelect
                  className="w-full"
                  name="danhHieuNhaNuocPhongTang"
                  label={<FormattedMessage id="page.profile.stateRank" defaultMessage="Danh hiệu nhà nước phong tặng" />}
                  placeholder={"Danh hiệu nhà nước"}
                  showSearch
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.stateRank" defaultMessage="Danh hiệu nhà nước phong tặng" /> }
                  ]}
                  request={() => getOption(`${SERVER_URL_CONFIG}/danh-hieu-nha-nuoc-phong`, 'id', 'name')}
                />
              </Col>
            </Row>

            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0 w-full" >
                <ProFormSelect
                  className="w-full"
                  name="hocHam"
                  label={<FormattedMessage id="page.profile.academicDegrees" defaultMessage="Học hàm" />}
                  placeholder={"Học hàm"}
                  request={() => getOption(`${SERVER_URL_CONFIG}/hoc-ham`, 'id', 'name')}
                  showSearch
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.academicDegrees" defaultMessage="Học hàm" /> }
                  ]}
                />
              </Col>

              <Col span={12} className="gutter-row p-0 w-full" >
                <ProFormSelect
                  className="w-full"
                  name="capBacLoaiQuanHamQuanDoi"
                  label={<FormattedMessage id="page.profile.militaryRanks" defaultMessage="Cấp bậc quân hàm" />}
                  placeholder={"Cấp bậc quân hàm"}
                  showSearch
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.militaryRanks" defaultMessage="Cấp bậc quân hàm" /> }
                  ]}
                  request={() => getOption(`${SERVER_URL_CONFIG}/cap-bac-loai-quan-ham-quan-doi`, 'id', 'name')}

                />
              </Col>
            </Row>

            <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0 w-full" >
                <ProFormSelect
                  className="w-full"
                  name="thanhPhanGiaDinh"
                  label={<FormattedMessage id="page.profile.membership" defaultMessage="Thành phần gia đình" />}
                  placeholder={"Thành phần gia đình"}
                  showSearch
                  request={() => getOption(`${SERVER_URL_CONFIG}/thanh-phan-gia-dinh`, 'id', 'name')}
                  rules={[
                    { required: true, message: <FormattedMessage id="page.profile.membership" defaultMessage="Thành phần gia đình" /> }
                  ]}
                />
              </Col>


            </Row>
          </StepsForm.StepForm>

        </StepsForm>



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
