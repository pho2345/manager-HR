import { deletes, get, getCustome, patch, post, post2 } from '@/services/ant-design-pro/api';
import { EditTwoTone, ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ProCard, ProColumns, ProForm, ProFormDatePicker, ProFormDigit, ProFormList, ProFormSelect } from '@ant-design/pro-components';
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
import { XEP_LOAI_CHUYEN_MON, XEP_LOAI_THI_DUA } from '@/services/utils/constant';
const configDefaultText = configText;





const TableList: React.FC = () => {
    const collection = `${SERVER_URL_CONFIG}/nhan-vien/ky-luat`;
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const refIdCurrent = useRef<any>();
    const [form] = Form.useForm<any>();

    const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
    const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
    const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
    const [optionRangeSearch, setOptionRangeSearch] = useState<any>();
    const [selectRow, setSelectRow] = useState<[]>([]);


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


    const columns: ProColumns<GEN.AdminDiscipline>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'indexBorder',
        },
        {
            title: "Nhân viên",
            key: 'xepLoaiChuyenMon',
            dataIndex: 'xepLoaiChuyenMon',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.hovaten}</>
                );
            },
            ...getColumnSearchProps('xepLoaiChuyenMon')
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
            title: "Ngày sinh",
            key: 'sinhNgay',
            dataIndex: 'sinhNgay',
            render: (_, entity) => {
                ;
                return (
                    <> {moment(entity?.create_at).format(FORMAT_DATE)}</>
                );
            },
        },
        {
            title: "Cơ quan quyết định",
            key: 'coQuanQuyetDinh',
            dataIndex: 'coQuanQuyetDinh',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.coQuanQuyetDinh}</>
                );
            },
            // ...getColumnSearchProps('coQuanQuyetDinh')
        },

        {
            title: "Hành vi vi phạm",
            key: 'hanhViViPhamChinh',
            dataIndex: 'hanhViViPhamChinh',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.hanhViViPhamChinh}</>
                );
            },
            ...getColumnSearchProps('xepLoaiThiDua')
        },

        {
            title: "Hình thức kỷ luật",
            key: 'hinhThuc',
            dataIndex: 'hinhThuc',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.hinhThuc}</>
                );
            },
            ...getColumnSearchProps('hinhThucKhenThuong')
        },

        {
            title: "Ngày quyết định",
            key: 'batDau',
            dataIndex: 'batDau',
            render: (_, entity) => {
                return (
                    <> {moment(entity.batDau).format('DD/MM/YYYY')}</>
                );
            },
            ...getColumnSearchRange('batDau')
        },
        {
            title: "Ngày kết thúc",
            key: 'ketThuc',
            dataIndex: 'ketThuc',
            render: (_, entity) => {
                ;
                return (
                    <>{moment(entity.ketThuc).format('DD/MM/YYYY')}</>
                );
            },
            ...getColumnSearchRange('ketThuc')
        },


        {
            title: <FormattedMessage id="page.table.createAt" defaultMessage="Create At" />,
            dataIndex: 'create_at',
            // valueType: 'textarea',
            key: 'create_at',
            renderText: (_, text) => moment(text?.create_at).format(FORMAT_DATE),
            ...getColumnSearchRange('create_at')
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



    async function add(value: any) {

    }

    async function update(value: any) {
        return await handleUpdate2(value, refIdCurrent.current, collection);
    }



    return (
        <PageContainer>
            <ProTable
                actionRef={actionRef}
                rowKey='id'
                search={false}
                options={
                    {
                        reload: () => {
                            return true;
                        },
                        setting: {
                            checkable: false
                        }
                    }
                }
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
                    ],
                }}

                request={async () => get(collection)}
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
                rowSelection={{}}



                // expandable={
                //     {
                //         expandIcon: () => <>aaa</>,
                //         columnTitle: (props: any) => <></>,
                //         showExpandColumn: true,
                //         onExpand(expanded, record) {
                //             console.log(expanded, record)
                //         },
                //     }
                // }

                tableAlertRender={({ selectedRowKeys }: any) => {
                    return renderTableAlert(selectedRowKeys);
                }}

                tableAlertOptionRender={({ selectedRows, selectedRowKeys }: any) => {
                    return renderTableAlertOption(selectedRows, selectedRowKeys, actionRef, collection)
                }}
            />

            <ModalForm
                form={form}
                title={"Tạo Kỷ luật"}
                // width={window.innerWidth * 0.3}
                open={createModalOpen}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        handleModalOpen(false)
                    },
                }}
                onFinish={async (value) => {
                    if (value.kyLuat && value.kyLuat.length !== 0) {
                        const newData = value.kyLuat.map((e: any) => {
                            const { nam, danhSachMaHoSo, ketThuc, batDau, ...other } = e;
                            return {
                                kyLuat: {
                                    ...other,
                                    nam: moment(nam).toISOString(),
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

                <ProFormList
                    name="kyLuat"
                    creatorButtonProps={{
                        creatorButtonText: 'Thêm một kỷ luật',
                    }}
                    min={1}
                    copyIconProps={false}
                    itemRender={({ listDom, action }, { index }) => (
                        <ProCard
                            bordered
                            style={{ marginBlockEnd: 8 }}
                            title={`Kỷ luật ${index + 1}`}
                            extra={action}
                            bodyStyle={{ paddingBlockEnd: 0 }}
                        >
                            {listDom}
                        </ProCard>
                    )}

                >

                    <Row gutter={24} >
                        <Col span={8} >
                            <ProFormSelect name="coQuanQuyetDinh" key="coQuanQuyetDinh" label="Cơ quan quyết định" request={() => getOption(`${SERVER_URL_CONFIG}/coquan-tochuc-donvi`, 'id', 'name')} />
                        </Col>
                        <Col span={8} >
                            <ProFormText name="hinhThuc" key="hinhThuc" label="Hình thức kỷ luật" placeholder={"Hình thức"} />
                        </Col>
                        <Col span={8} >
                            <ProFormText name="hanhViViPhamChinh" key="hanhViViPhamChinh" label="Hành vi vi phạm"  placeholder={"Hành vi"}/>
                        </Col>
                    </Row>

                    <Row gutter={24} >
                        <Col span={8} >
                            <ProFormDatePicker
                                name="batDau"
                                label={"Ngày quyết định"}
                                placeholder={"Ngày quyết định"}
                                rules={[
                                    { required: true, message: "Ngày quyết định" }
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
                                label={"Ngày kết thúc"}
                                placeholder={"Ngày kết thúc"}
                                rules={[
                                    { required: true, message: "Ngày kết thúc" }
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
                        <Col span={16} >
                            <ProFormSelect fieldProps={{
                                mode: 'multiple'
                            }} name="danhSachMaHoSo" key="danhSachMaHoSo" label="Nhân viên" request={async () => {
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
                        <Col span={8} >
                            <ProFormDatePicker
                                fieldProps={{
                                    style: {
                                        width: "100%"
                                    },
                                    // disabledDate: disabledDate\

                                }}
                                name="nam"
                                label="Năm Kỷ luật"
                                placeholder="Năm Kỷ luật"
                                rules={[
                                    { required: true, message: "Năm Kỷ luật" },
                                ]}

                            />
                        </Col>
                    </Row>
                </ProFormList>

            </ModalForm>

            <ModalForm
                title={"Cập nhật Kỷ luật"}
                form={form}
                width={window.innerWidth * 0.3}
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
                    <Col span={24} >
                        <ProFormSelect
                            label={"Cơ quan quyết định"}
                            // width='md'
                            name='IdCoQuanQuyetDinh'
                            placeholder={`Cơ quan quyết định`}
                            rules={[
                                {
                                    required: true,
                                    message: 'Cơ quan quyết định'
                                },
                            ]}
                            showSearch
                            // options={organ}
                        />
                    </Col>



                    <Col span={24} >
                        <ProFormText
                            label={"Hành vi vi phạm"}
                            // width='md'
                            name='hanhViViPhamChinh'
                            placeholder={`Hành vi vi phạm`}
                            rules={[
                                {
                                    required: true,
                                    message: 'Hành vi vi phạm'
                                },
                            ]} />
                    </Col>


                    <Col span={24} >
                        <ProFormText
                            label={"Hình thức"}
                            // width='md'
                            name='hinhThuc'
                            placeholder={`Hình thức`}
                            rules={[
                                {
                                    required: true,
                                    message: 'Hình thức'
                                },
                            ]} />
                    </Col>
                    <Col span={24} >
                        <ProFormDatePicker
                            name="batDau"
                            label={"Ngày quyết định"}
                            placeholder={"Ngày quyết định"}
                            rules={[
                                { required: true, message: "Ngày quyết định" }
                            ]}
                            fieldProps={{
                                style: {
                                    width: "100%"
                                },
                                // disabledDate: disabledDate
                            }}
                        />
                    </Col>

                    <Col span={24} >
                        <ProFormDatePicker
                            name="ketThuc"
                            label={"Ngày kết thúc"}
                            placeholder={"Ngày kết thúc"}
                            rules={[
                                { required: true, message: "Ngày kết thúc" }
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
            </ModalForm>

        </PageContainer>
    );
};

export default TableList;
