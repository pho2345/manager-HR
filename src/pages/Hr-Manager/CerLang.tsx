import { deletes, get, getCustome, patch, post, post2 } from '@/services/ant-design-pro/api';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
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
    const collection = '/nhan-vien/ngoai-ngu';
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


    const columns: ProColumns<GEN.AdminCerLang>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'indexBorder',
        },
        {
            title: "Cán bộ",
            key: 'hovaten',
            dataIndex: 'hovaten',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.hovaten}</>
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
            title: "Ngoại ngữ",
            key: 'tenNgoaiNgu',
            dataIndex: 'tenNgoaiNgu',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.tenNgoaiNgu}</>
                );
            },
            // ...getColumnSearchProps('coQuanQuyetDinh')
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
                    <> {moment(entity.batDau).format('DD/MM/YYYY')}</>
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
                title={"Tạo chứng chỉ ngoại ngữ"}
                // width={window.innerWidth * 0.3}
                open={createModalOpen}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        handleModalOpen(false)
                    },
                }}
                onFinish={async (value) => {
                    if (value.ngoaiNgu && value.ngoaiNgu.length !== 0) {
                        const newData = value.ngoaiNgu.map((e: any) => {
                            const { danhSachMaHoSo, ketThuc, batDau, ...other } = e;
                            return {
                                ngoaiNgu: {
                                    ...other,
                                    ketThuc: moment(ketThuc).toISOString(),
                                    batDau: moment(batDau).toISOString(),
                                },
                                danhSachMaHoSo: ["111"]
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
                    name="ngoaiNgu"
                    creatorButtonProps={{
                        creatorButtonText: 'Thêm một chứng chỉ ngoại ngữ',
                    }}
                    min={1}
                    copyIconProps={false}
                    itemRender={({ listDom, action }, { index }) => (
                        <ProCard
                            bordered
                            style={{ marginBlockEnd: 8 }}
                            title={`Chứng chỉ ngoại ngữ ${index + 1}`}
                            extra={action}
                            bodyStyle={{ paddingBlockEnd: 0 }}
                        >
                            {listDom}
                        </ProCard>
                    )}

                >

                    <Row gutter={24} >
                        <Col span={8} >
                            <ProFormText name="tenNgoaiNgu" key="tenNgoaiNgu" label="Ngoại ngữ" placeholder={'Ngoại ngữ'} />
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
                            <ProFormSelect name="tenCoSoDaoTao" key="tenCoSoDaoTao" label="Cơ sở đào tạo" request={() => getOption(`${SERVER_URL_CONFIG}/coquan-tochuc-donvi`, 'id', 'name')} />
                        </Col>

                    </Row>

                    <Row gutter={24} >
                        <Col span={16} >
                            <ProFormSelect fieldProps={{
                                mode: 'multiple'
                            }} name="danhSachMaHoSo" key="danhSachMaHoSo" label="Cán bộ" request={async () => {
                                const nv = await get('/nhan-vien/so-yeu-ly-lich');
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
                            label={"Đơn vị công tác"}
                            // width='md'
                            name='IdCoQuanQuyetDinh'
                            placeholder={`Đơn vị công tác`}
                            rules={[
                                {
                                    required: true,
                                    message: 'Đơn vị công tác'
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
