import { get, getCustome } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, LightFilter, ProColumns, ProFormDatePicker, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import {
    ModalForm,
    PageContainer,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';
import { Button, Col, Form,  Row, Tag, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import configText from '@/locales/configText';
import { disableDateStartAndDateEnd, displayTime, filterCreateAndUpdateAt, formatter, getColumnSearchProps, getColumnSearchRange, getOption, handleTime, handleUpdate2, parser, renderTableAlert, renderTableAlertOption, searchPheDuyetProps } from '@/services/utils';
import { FormattedMessage } from '@umijs/max';
import {  createPaginationProps, mapXacNhan } from '@/services/utils/constant';
import ModalApproval from '@/reuse/approval/ModalApproval';
import AddAllowance from '@/reuse/allowance/AddAllowance';
const configDefaultText = configText;





const TableList: React.FC<GEN.AllowanceTable> = ({ type, collection }) => {
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const refIdCurrent = useRef<any>();
    const refName = useRef<string>();
    const refSoCMND = useRef<string>();
    const [form] = Form.useForm<any>();

    const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
    const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
    const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
    const [optionRangeSearch, setOptionRangeSearch] = useState<any>();
    const [searchPheDuyet, setSearchPheDuyet] = useState<GEN.XACNHAN | null>(null);
    const [sort, setSort] = useState<GEN.SORT>('createAt');
    const [selectedRow, setSelectedRow] = useState<[]>([]);
    const [openApproval, setOpenApproval] = useState<boolean>(false);

    const [showRangeToTimeStart, setShowRangeToTimeStart] = useState<boolean>(false);
    const [searchRangeFromTimeStart, setSearchRangeFromTimeStart] = useState<any>(null);
    const [searchRangeToTimeStart, setSearchRangeToTimeStart] = useState<any>(null);
    const [optionRangeSearchTimeStart, setOptionRangeSearchTimeStart] = useState<any>();

    const [showRangeToTimeEnd, setShowRangeToTimeEnd] = useState<boolean>(false);
    const [searchRangeFromTimeEnd, setSearchRangeFromTimeEnd] = useState<any>(null);
    const [searchRangeToTimeEnd, setSearchRangeToTimeEnd] = useState<any>(null);
    const [optionRangeSearchTimeEnd, setOptionRangeSearchTimeEnd] = useState<any>();

    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZE);
    const [page, setPage] = useState<number>(0);



    const columnsEmployee: ProColumns<GEN.AdminAllowance>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'indexBorder',
        },
        {
            title: "Loại phụ cấp",
            key: 'loaiPhuCapName',
            dataIndex: 'loaiPhuCapName',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.loaiPhuCapName}</>
                );
            },
        },

        {
            title: "Phần trăm hưởng phụ cấp",
            key: 'phanTramHuongPhuCap',
            dataIndex: 'phanTramHuongPhuCap',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.phanTramHuongPhuCap}</>
                );
            },
        },

        {
            title: "Hệ số phụ cấp",
            key: 'heSoPhuCap',
            dataIndex: 'heSoPhuCap',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.heSoPhuCap}</>
                );
            },
        },

        {
            title: "Giá trị",
            key: 'giaTri',
            dataIndex: 'giaTri',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.giaTri}</>
                );
            },
        },

        {
            title: "Hình thức hưởng",
            key: 'hinhThucHuong',
            dataIndex: 'hinhThucHuong',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.hinhThucHuong}</>
                );
            },
        },


        {
            title: "Ngày cấp",
            key: 'batDau',
            dataIndex: 'batDau',
            render: (_, entity) => {
                return (
                    <>{displayTime(entity.batDau)}</>
                );
            },
            ...getColumnSearchRange('batDau', showRangeToTimeStart, setShowRangeToTimeStart, searchRangeFromTimeStart, setSearchRangeFromTimeStart, searchRangeToTimeStart, setSearchRangeToTimeStart, optionRangeSearchTimeStart, setOptionRangeSearchTimeStart)

        },
        {
            title: "Ngày hết hạn",
            key: 'ketThuc',
            dataIndex: 'ketThuc',
            render: (_, entity) => {
                ;
                return (
                    <>{displayTime(entity.ketThuc)}</>
                );
            },
            ...getColumnSearchRange('ketThuc', showRangeToTimeEnd, setShowRangeToTimeEnd, searchRangeFromTimeEnd, setSearchRangeFromTimeEnd, searchRangeToTimeEnd, setSearchRangeToTimeEnd, optionRangeSearchTimeEnd, setOptionRangeSearchTimeEnd)

        },
        {
            title: "Trạng thái",
            key: 'xacNhan',
            dataIndex: 'xacNhan',
            render: (_, entity) => {
                ;
                return (
                    <> {mapXacNhan(entity.xacNhan)}</>
                );
            },
            ...searchPheDuyetProps(searchPheDuyet, setSearchPheDuyet, actionRef)
        },






        {
            title: <FormattedMessage id="page.table.createAt" defaultMessage="Create At" />,
            dataIndex: 'create_at',
            // valueType: 'textarea',
            key: 'create_at',
            renderText: (_, text) => displayTime(text?.create_at),
            ...getColumnSearchRange('create_at', showRangeTo, setShowRangeTo, searchRangeFrom, setSearchRangeFrom, searchRangeTo, setSearchRangeTo, optionRangeSearch, setOptionRangeSearch)

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
                                refName.current = entity.hoVaTen;
                                refSoCMND.current = entity.soCCCD;
                                const getRecordCurrent = await getCustome(`${collection}/${entity.id}`);
                                if (getRecordCurrent.data) {
                                    handleUpdateModalOpen(true)
                                    form.setFieldsValue({
                                        ...getRecordCurrent.data,
                                        hoSoId: getRecordCurrent.data.hoSoId,
                                        hinhThucThuong: getRecordCurrent.data.hinhThucHuong,
                                        batDau: handleTime(getRecordCurrent.data?.batDau),
                                        ketThuc: handleTime(getRecordCurrent.data?.ketThuc),
                                    })
                                }
                            }}
                            icon={<MdOutlineEdit />}
                        />
                    </Tooltip>)
            }
        }
    ];

    const columnsAdmin: ProColumns<GEN.AdminAllowance>[] = [
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
            ...getColumnSearchProps('hoVaTen')
        },
        {
            title: "Số CMND/CCCD",
            key: 'soCCCD',
            dataIndex: 'soCCCD',
            render: (_, entity) => {
                ;
                return (
                    <>{entity?.soCCCD}</>
                );
            },
        },

        {
            title: "Loại phụ cấp",
            key: 'loaiPhuCapName',
            dataIndex: 'loaiPhuCapName',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.loaiPhuCapName}</>
                );
            },
        },

        {
            title: "Phần trăm hưởng phụ cấp",
            key: 'phanTramHuongPhuCap',
            dataIndex: 'phanTramHuongPhuCap',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.phanTramHuongPhuCap}</>
                );
            },
        },

        {
            title: "Hệ số phụ cấp",
            key: 'heSoPhuCap',
            dataIndex: 'heSoPhuCap',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.heSoPhuCap}</>
                );
            },
        },

        {
            title: "Giá trị",
            key: 'giaTri',
            dataIndex: 'giaTri',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.giaTri}</>
                );
            },
        },

        {
            title: "Hình thức hưởng",
            key: 'hinhThucHuong',
            dataIndex: 'hinhThucHuong',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.hinhThucHuong}</>
                );
            },
        },


        {
            title: "Ngày cấp",
            key: 'batDau',
            dataIndex: 'batDau',
            render: (_, entity) => {
                return (
                    <>{displayTime(entity.batDau)}</>
                );
            },
            ...getColumnSearchRange('batDau', showRangeToTimeStart, setShowRangeToTimeStart, searchRangeFromTimeStart, setSearchRangeFromTimeStart, searchRangeToTimeStart, setSearchRangeToTimeStart, optionRangeSearchTimeStart, setOptionRangeSearchTimeStart)

        },
        {
            title: "Ngày hết hạn",
            key: 'ketThuc',
            dataIndex: 'ketThuc',
            render: (_, entity) => {
                ;
                return (
                    <>{displayTime(entity.ketThuc)}</>
                );
            },
            ...getColumnSearchRange('ketThuc', showRangeToTimeEnd, setShowRangeToTimeEnd, searchRangeFromTimeEnd, setSearchRangeFromTimeEnd, searchRangeToTimeEnd, setSearchRangeToTimeEnd, optionRangeSearchTimeEnd, setOptionRangeSearchTimeEnd)

        },
        {
            title: "Trạng thái",
            key: 'xacNhan',
            dataIndex: 'xacNhan',
            render: (_, entity) => {
                ;
                return (
                    <> {mapXacNhan(entity.xacNhan)}</>
                );
            },
            ...searchPheDuyetProps(searchPheDuyet, setSearchPheDuyet, actionRef)
        },

        {
            title: <FormattedMessage id="page.table.createAt" defaultMessage="Create At" />,
            dataIndex: 'create_at',
            // valueType: 'textarea',
            key: 'create_at',
            renderText: (_, text) => displayTime(text?.create_at),
            ...getColumnSearchRange('textarea', showRangeTo, setShowRangeTo, searchRangeFrom, setSearchRangeFrom, searchRangeTo, setSearchRangeTo, optionRangeSearch, setOptionRangeSearch)
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
                                refName.current = entity.hoVaTen;
                                refSoCMND.current = entity.soCCCD;
                                const getRecordCurrent = await getCustome(`${collection}/${entity.id}`);
                                if (getRecordCurrent.data) {
                                    handleUpdateModalOpen(true)
                                    form.setFieldsValue({
                                        ...getRecordCurrent.data,
                                        hoSoId: getRecordCurrent.data.hoSoId,
                                        hinhThucThuong: getRecordCurrent.data.hinhThucHuong,
                                        batDau: handleTime(getRecordCurrent.data?.batDau),
                                        ketThuc: handleTime(getRecordCurrent.data?.ketThuc),
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
        return await handleUpdate2(value, refIdCurrent.current, collection, true);
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
                    selectedRow.length > 0 && type === 'ADMIN' && (<Button
                        type='dashed'
                        key='primary'
                        onClick={() => {
                            setOpenApproval(true);
                        }}
                    >
                        Phê duyệt
                    </Button>)
                ]}

                request={async () => {
                    let f: any = {};
                    if (searchPheDuyet) {
                        f = {
                            ...f,
                            pheDuyet: searchPheDuyet
                        }
                    }
                    const data = await get(collection, {
                        ...f,
                        sort: sort,
                        page: page,
                        size: pageSize
                    });
                    if (data.data) {
                        setTotal(data.data.totalRecord);
                        return {
                            data: data.data.data,
                            success: true,
                        }
                    }
                    return {
                        data: [],
                        success: false
                    }
                }}

                pagination={createPaginationProps(total, pageSize, setPage, setPageSize, actionRef)}

                columns={type === 'EMPLOYEE' ? columnsEmployee : columnsAdmin}
                rowSelection={{
                    onChange: (selectedRowKeys: any, _) => {
                        const id = selectedRowKeys.map((e: any) => ({ id: e }));
                        setSelectedRow(id);
                    },
                }}

                toolbar={filterCreateAndUpdateAt(sort, setSort, actionRef)}


                tableAlertRender={({ selectedRowKeys }: any) => {
                    return renderTableAlert(selectedRowKeys);
                }}

                tableAlertOptionRender={({ selectedRows, selectedRowKeys }: any) => {
                    return renderTableAlertOption(selectedRows, selectedRowKeys, actionRef, collection)
                }}
            />


            <AddAllowance actionRef={actionRef} open={createModalOpen} handleOpen={handleModalOpen} type={type} collection={collection} />
            <ModalApproval openApproval={openApproval} actionRef={actionRef} selectedRow={selectedRow} setOpenApproval={setOpenApproval} subDirectory='/phu-cap-khac/phe-duyet' fieldApproval='pheDuyet' />


            <ModalForm
                title={<>Cập nhật phụ cấp khác {refIdCurrent && type === 'ADMIN' && <Tag color="green">CBVC: {refName.current} - CMND/CCCD: {refSoCMND.current}</Tag>}</>}
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
                        <ProFormText name="hinhThucThuong" key="hinhThucThuong" label="Hình thức thưởng" placeholder={"Hình thức thưởng"} />
                    </Col>
                    <Col span={12} >
                        <ProFormSelect name="loaiPhuCapId" key="loaiPhuCapId" label="Loại phụ cấp" request={() => getOption(`${SERVER_URL_CONFIG}/loai-phu-cap?page=0&size=100`, 'id', 'name')} />
                    </Col>
                </Row>

                <Row gutter={24} >
                    <Col span={12} >
                        <ProFormDigit name="giaTri" key="giaTri" label="Giá trị" placeholder={"Giá trị"} fieldProps={{
                            min: 0,
                            formatter,
                            parser,

                        }} />
                    </Col>
                    <Col span={12} >
                        <ProFormDigit name="heSoPhuCap" key="heSoPhuCap" label="Hệ số phụ cấp" placeholder={"Hệ số phụ cấp"} fieldProps={{
                            min: 0,
                            formatter,
                            parser,
                        }} />
                    </Col>
                </Row>

                <Row gutter={24} >
                    <Col span={12} >
                        <ProFormDatePicker
                            name="batDau"
                            label={"Ngày bắt đầu"}
                            placeholder={"Ngày bắt đầu"}
                            rules={[
                                { required: true, message: "Ngày bắt đầu" }
                            ]}
                            fieldProps={{
                                style: {
                                    width: "100%"
                                },
                                disabledDate: current => disableDateStartAndDateEnd('ketThuc', form, 'start', current)
                            }}
                        />
                    </Col>
                    <Col span={12} >
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
                                disabledDate: current => disableDateStartAndDateEnd('batDau', form, 'end', current)
                            }}
                        />
                    </Col>
                </Row>

                <Row gutter={24} >
                    <Col span={12} >
                        <ProFormDigit name="phanTramHuongPhuCap" key="phanTramHuongPhuCap" label="Phần trăm hưởng (%)" placeholder={"Phần trăm hưởng (%)"} fieldProps={{
                            min: 0,
                            max: 100
                        }} />

                    </Col>


                </Row>
            </ModalForm>

        </PageContainer>
    );
};

export default TableList;
