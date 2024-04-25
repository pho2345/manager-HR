import { deletes, get, getCustome, patch, post, post2 } from '@/services/ant-design-pro/api';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, LightFilter, ProCard, ProColumns, ProForm, ProFormDatePicker, ProFormDigit, ProFormList, ProFormSelect } from '@ant-design/pro-components';
import {
    ModalForm,
    PageContainer,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';

import { Button, Col, Form, Input, Row, Space, Tooltip, message } from 'antd';
import React, { useRef, useState } from 'react';
import moment from 'moment';
import { MdOutlineEdit } from 'react-icons/md';

import configText from '@/locales/configText';
import { getOption, handleAdd2, handleUpdate2, renderTableAlert, renderTableAlertOption } from '@/services/utils';
import { FormattedMessage } from '@umijs/max';
import { XAC_NHAN, XEP_LOAI_CHUYEN_MON, XEP_LOAI_THI_DUA, mapXacNhan } from '@/services/utils/constant';
import AddCerTech from '@/reuse/techs/AddCerTech';
import ModalApproval from '@/reuse/approval/ModalApproval';
const configDefaultText = configText;





const TableList: React.FC = () => {
    const collection = `${SERVER_URL_CONFIG}/tin-hoc`;
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const refIdCurrent = useRef<any>();
    const [form] = Form.useForm<any>();

    const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
    const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
    const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
    const [optionRangeSearch, setOptionRangeSearch] = useState<any>();
    const [selectedRow, setSelectedRow] = useState<[]>([]);
    const [searchPheDuyet, setSearchPheDuyet] = useState<GEN.XACNHAN | null>(null);
    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(15);
    const [openApproval, setOpenApproval] = useState<boolean>(false);

    const [sort, setSort] = useState<GEN.SORT>('createAt');


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


    const getColumnSearchRange = (dataIndex: string) => ({
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
                        if (moment(record[dataIndex]).isAfter(convertValue[1]) && moment(record[dataIndex]).isBefore(convertValue[2])) {
                            return record
                        }
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


    const columns: ProColumns<GEN.AdminCerTech>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'indexBorder',
        },
        {
            title: "CBVC",
            key: 'hoVaTen',
            dataIndex: 'hoVaTen',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.hoVaTen}</>
                );
            },
            ...getColumnSearchProps('hovaten')
        },
        {
            title: "Số CMND/CCCD",
            key: 'soCCCD',
            dataIndex: 'soCCCD',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.soCCCD}</>
                );
            },
            ...getColumnSearchProps('xepLoaiChuyenMon')
        },

        {
            title: "Chứng chỉ",
            key: 'chungChiDuocCap',
            dataIndex: 'chungChiDuocCap',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.chungChiDuocCap}</>
                );
            },
            // ...getColumnSearchProps('coQuanQuyetDinh')
        },

        {
            title: "Cơ sở đào tạo",
            key: 'tenCoSoDaoTao',
            dataIndex: 'tenCoSoDaoTao',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.tenCoSoDaoTao}</>
                );
            },
            // ...getColumnSearchProps('coQuanQuyetDinh')
        },


        {
            title: "Ngày cấp",
            key: 'batDau',
            dataIndex: 'batDau',
            render: (_, entity) => {
                return (
                    <> {entity?.batDau ? moment(entity?.batDau).format(FORMAT_DATE) : ""}</>
                );
            },
            ...getColumnSearchRange('batDau')
        },
        {
            title: "Ngày hết hạn",
            key: 'ketThuc',
            dataIndex: 'ketThuc',
            render: (_, entity) => {
                ;
                return (
                    <>{entity?.ketThuc ? moment(entity?.ketThuc).format(FORMAT_DATE) : ''}</>
                );
            },
            ...getColumnSearchRange('ketThuc')
        },


        {
            title: <FormattedMessage id="page.table.createAt" defaultMessage="Create At" />,
            dataIndex: 'create_at',
            // valueType: 'textarea',
            key: 'create_at',
            renderText: (_, text) => text?.create_at ? moment(text?.create_at).format(FORMAT_DATE) : "",
            ...getColumnSearchRange('create_at')
        },

        {
            title: "Trạng thái",
            dataIndex: 'xacNhan',
            // valueType: 'textarea',
            key: 'xacNhan',
            render: (_, entity) => mapXacNhan(entity.xacNhan),
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
                                options={XAC_NHAN}
                                fieldProps={{
                                    onChange: (value: any) => {
                                        setSearchPheDuyet(value)
                                    },
                                    value: searchPheDuyet
                                }}
                                showSearch
                                placeholder={'Chọn trạng thái'}
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
                                setSearchPheDuyet(null);
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
                        color: searchPheDuyet ? '#1890ff' : undefined,
                    }}
                />
            ),
        },

        {
            title: configDefaultText['titleOption'],
            dataIndex: 'atrributes',
            valueType: 'textarea',
            key: 'option',
            align: 'center',
            render: (_, entity) => {

                return (
                    <Tooltip title={configDefaultText['buttonUpdate']}>
                        <Button
                            style={{
                                border: 'none'
                            }}

                            onClick={async () => {
                                handleUpdateModalOpen(true);
                                refIdCurrent.current = entity.id;
                                const getRecordCurrent = await getCustome(`${collection}/${entity.id}`);
                                if (getRecordCurrent.data) {
                                    handleUpdateModalOpen(true)
                                    form.setFieldsValue({
                                        ...getRecordCurrent.data
                                    })
                                }

                            }}
                            icon={<MdOutlineEdit />}
                        />
                    </Tooltip>)
            }
        }
    ];



    async function update(value: any) {
        return await handleUpdate2(value, refIdCurrent.current, collection);
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
                    selectedRow.length > 0 && (<Button
                        type='dashed'
                        key='primary'
                        onClick={() => {
                            setOpenApproval(true);
                        }}
                    >
                        Phê duyệt
                    </Button>)
                ]}

                toolbar={{
                    filter: (
                        <LightFilter>
                            <ProFormSelect name="startdate" label="Sắp xếp" allowClear={false} options={[
                                {
                                    label: 'Ngày tạo',
                                    value: 'createAt'
                                },
                                {
                                    label: 'Ngày cập nhật',
                                    value: 'updateAt'
                                }
                            ]}
                                fieldProps={{
                                    value: sort
                                }}
                                onChange={(e) => {
                                    setSort(e);
                                    actionRef?.current?.reload();
                                }}
                            />
                        </LightFilter>
                    )
                }}

                request={async () => {
                    let f: any = {};
                    if (searchPheDuyet) {
                        f.pheDuyet = searchPheDuyet;
                    }

                    const getData = await get(`${collection}`, {
                        ...f,
                        sort: sort,
                        page: page
                    })
                    return {
                        data: getData.data
                    }
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
                columns={columns}
                rowSelection={{
                    onChange: (selectedRowKeys: any, _) => {
                        const id = selectedRowKeys.map((e: any) => ({ id: e }));
                        setSelectedRow(id);
                    },
                }}


                tableAlertRender={({ selectedRowKeys }: any) => {
                    return renderTableAlert(selectedRowKeys);
                }}

                tableAlertOptionRender={({ selectedRows, selectedRowKeys }: any) => {
                    return renderTableAlertOption(selectedRows, selectedRowKeys, actionRef, collection)
                }}
            />

            {/* <ModalForm
                form={form}
                title={"Tạo chứng chỉ tin học"}
                // width={window.innerWidth * 0.3}
                open={createModalOpen}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        handleModalOpen(false)
                    },
                }}
                onFinish={async (value) => {
                    if (value.tinHoc && value.tinHoc.length !== 0) {
                        const newData = value.tinHoc.map((e: any) => {
                            const { danhSachMaHoSo, ketThuc, batDau, ...other } = e;
                            return {
                                tinHoc: {
                                    ...other,
                                    ketThuc: moment(ketThuc).toISOString(),
                                    batDau: moment(batDau).toISOString(),
                                },
                                danhSachMaHoSo
                            }
                        });


                        const success = await post2(collection, {}, newData);
                        if (success) {
                            handleModalOpen(false);
                            form.resetFields();
                            if (actionRef.current) {
                                actionRef.current.reload();
                            }
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
                        <Col span={8} >
                            <ProFormText name="tenTinHoc" key="tenTinHoc" label="Tin học" placeholder={'Tin học'} />
                        </Col>

                        <Col span={8} >
                            <ProFormText name="chungChiDuocCap" key="chungChiDuocCap" label="Chứng chỉ" placeholder={'Chứng chỉ'} />
                        </Col>

                        <Col span={8} >
                            <ProFormDigit name="diemSo" key="diemSo" label="Điểm số" placeholder={`Điểm số`} />
                        </Col>


                    </Row>
                    <Row gutter={24} >
                        <Col span={8} >
                            <ProFormDatePicker
                                name="batDau"
                                label={"Ngày cấp"}
                                placeholder={"Ngày cấp"}
                                rules={[
                                    { required: true, message: "Ngày cấp" }
                                ]}
                                fieldProps={{
                                    style: {
                                        width: "100%"
                                    },
                                    // disabledDate: disabledDate
                                }}
                            />
                        </Col>
                        <Col span={8} >
                            <ProFormDatePicker
                                name="ketThuc"
                                label={"Ngày hết hạn"}
                                placeholder={"Ngày hết hạn"}
                                rules={[
                                    { required: true, message: "Ngày hết hạn" }
                                ]}
                                fieldProps={{
                                    style: {
                                        width: "100%"
                                    },
                                    // disabledDate: disabledDate
                                }}
                            />
                        </Col>

                        <Col span={8} >
                            <ProFormSelect name="tenCoSoDaoTao" key="tenCoSoDaoTao" label="Cơ sở đào tạo" request={() => getOption(`${SERVER_URL_CONFIG}/coquan-tochuc-donvi?page=0&size=100`, 'id', 'name')} />
                        </Col>

                    </Row>

                    <Row gutter={24} >
                        <Col span={16} >
                            <ProFormSelect fieldProps={{
                                mode: 'multiple'
                            }} name="danhSachMaHoSo" key="danhSachMaHoSo" label="Cán bộ" request={async () => {
                                const nv = await get(`${SERVER_URL_CONFIG}/nhan-vien/so-yeu-ly-lich`);
                                let dataOptions = [] as any;
                                if (nv) {
                                    nv.data?.map(e => {
                                        dataOptions.push({
                                            label: `${e.hoVaTen} - ${e.soCCCD}`,
                                            value: `${e.id}`
                                        });
                                    })
                                }
                                return dataOptions
                            }} />
                        </Col>
                    </Row>

                

            </ModalForm> */}

            <AddCerTech open={createModalOpen} handleOpen={handleModalOpen} actionRef={actionRef} />
            <ModalApproval openApproval={openApproval} actionRef={actionRef} selectedRow={selectedRow} setOpenApproval={setOpenApproval} subDirectory='/tin-hoc/phe-duyet' fieldApproval='xacNhan' />


            <ModalForm
                title={"Cập nhật chứng chỉ tin học"}
                form={form}
                open={updateModalOpen}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        handleUpdateModalOpen(false)
                    },
                }}
                onFinish={async (values: any) => {
                    const success = await update(values as any);
                    if (success) {
                        handleUpdateModalOpen(false);
                        form.resetFields();
                        if (actionRef.current) {
                            actionRef.current?.reloadAndRest?.();
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
                <Row gutter={24} >

                    <Col span={12} >
                        <ProFormText name="chungChiDuocCap" key="chungChiDuocCap" label="Chứng chỉ" placeholder={'Chứng chỉ'} />
                    </Col>

                    <Col span={12} >
                        <ProFormDigit name="diemSo" key="diemSo" label="Điểm số" placeholder={`Điểm số`} />
                    </Col>
                </Row>

                <Row gutter={24} >
                    <Col span={12} >
                        <ProFormDatePicker
                            name="batDau"
                            label={"Ngày cấp"}
                            placeholder={"Ngày cấp"}
                            rules={[
                                { required: true, message: "Ngày cấp" }
                            ]}
                            fieldProps={{
                                style: {
                                    width: "100%"
                                },
                                // disabledDate: disabledDate
                            }}
                        />
                    </Col>
                    <Col span={12} >
                        <ProFormDatePicker
                            name="ketThuc"
                            label={"Ngày hết hạn"}
                            placeholder={"Ngày hết hạn"}
                            rules={[
                                { required: true, message: "Ngày hết hạn" }
                            ]}
                            fieldProps={{
                                style: {
                                    width: "100%"
                                },
                                // disabledDate: disabledDate
                            }}
                        />
                    </Col>



                </Row>



                <Row gutter={24} >
                    {/* <Col span={12} >
                            <ProFormSelect
                                label={"CBVC"}
                                // width='md'
                                name=''
                                placeholder={`CBVC`}
                                rules={[
                                    {
                                        required: true,

                                    },
                                ]}
                               

                             
                                showSearch

                                request={async () => {
                                    const data = await get(`${SERVER_URL_CONFIG}/nhan-vien/ho-so?page=0&size=10000`);
                                    const dataOptions = data.data.map((item: any) => {
                                        return {
                                            label: `${item.hoVaTen} - ${item.soCCCD}`,
                                            value: item.id
                                        }
                                    })
                                    return dataOptions;
                                }}


                            />
                        </Col> */}

                    <Col span={12} >
                        <ProFormSelect name="tenCoSoDaoTaoId" key="tenCoSoDaoTaoId" label="Cơ sở đào tạo" request={() => getOption(`${SERVER_URL_CONFIG}/coquan-tochuc-donvi?page=0&size=100`, 'id', 'name')} />
                    </Col>
                </Row>
            </ModalForm>

        </PageContainer>
    );
};

export default TableList;
