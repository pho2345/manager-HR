import { get, getCustome, } from '@/services/ant-design-pro/api';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, LightFilter, ProColumns, ProFormDatePicker, ProFormSelect } from '@ant-design/pro-components';
import {
    ModalForm,
    PageContainer,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';

import { Button, Col, Form, Row, Space, Tag, Tooltip, } from 'antd';
import React, { useRef, useState } from 'react';
import moment from 'moment';
import { MdOutlineEdit } from 'react-icons/md';
import configText from '@/locales/configText';
import { displayTime, filterCreateAndUpdateAt, getColumnSearchProps, getColumnSearchRange, getOption, handleUpdate2, renderTableAlert, renderTableAlertOption, searchPheDuyetProps } from '@/services/utils';
import { FormattedMessage } from '@umijs/max';
import { createPaginationProps, mapXacNhan } from '@/services/utils/constant';
import AddDiscipline from '@/reuse/discipline/AddDiscipline';
import ModalApproval from '@/reuse/approval/ModalApproval';
const configDefaultText = configText;


const TableList: React.FC<GEN.DisciplineTable> = ({ type, collection }) => {
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
    const [selectedRow, setSelectedRow] = useState<[]>([]);
    const [sort, setSort] = useState<GEN.SORT>('createAt');
    const [searchPheDuyet, setSearchPheDuyet] = useState<GEN.XACNHAN | null>(null);

    const [openApproval, setOpenApproval] = useState<boolean>(false);

    const [showRangeToTimeStart, setShowRangeToTimeStart] = useState<boolean>(false);
    const [searchRangeFromTimeStart, setSearchRangeFromTimeStart] = useState<any>(null);
    const [searchRangeToTimeStart, setSearchRangeToTimeStart] = useState<any>(null);
    const [optionRangeSearchTimeStart, setOptionRangeSearchTimeStart] = useState<any>();

    const [showRangeToTimeEnd, setShowRangeToTimeEnd] = useState<boolean>(false);
    const [searchRangeFromTimeEnd, setSearchRangeFromTimeEnd] = useState<any>(null);
    const [searchRangeToTimeEnd, setSearchRangeToTimeEnd] = useState<any>(null);
    const [optionRangeSearchTimeEnd, setOptionRangeSearchTimeEnd] = useState<any>();

    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZE);



    const columnsAdmin: ProColumns<GEN.AdminDiscipline>[] = [
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
                    <> {entity?.soCCCD}</>
                );
            },
            ...getColumnSearchProps('soCCCD')
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
                    <> {entity?.coQuanQuyetDinhName}</>
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
            ...getColumnSearchProps('hanhViViPhamChinh')
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
                    <> {displayTime(entity.batDau)}</>
                );
            },
            ...getColumnSearchRange('batDau', showRangeToTimeStart, setShowRangeToTimeStart, searchRangeFromTimeStart, setSearchRangeFromTimeStart, searchRangeToTimeStart, setSearchRangeToTimeStart, optionRangeSearchTimeStart, setOptionRangeSearchTimeStart)
        },
        {
            title: "Ngày kết thúc",
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
            title: <FormattedMessage id="page.table.createAt" defaultMessage="Create At" />,
            dataIndex: 'create_at',
            // valueType: 'textarea',
            key: 'create_at',
            renderText: (_, text) => displayTime(text.create_at),
            ...getColumnSearchRange('create_at', showRangeTo, setShowRangeTo, searchRangeFrom, setSearchRangeFrom, searchRangeTo, setSearchRangeTo, optionRangeSearch, setOptionRangeSearch)
        },
        {
            title: "Trạng thái",
            key: 'xacNhan',
            dataIndex: 'xacNhan',
            render: (_, entity) => {
                ;
                return (
                    <> {mapXacNhan(entity.xacNhan)} </>
                );
            },
            ...searchPheDuyetProps(searchPheDuyet, setSearchPheDuyet, actionRef)
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
                                        hoSoId: getRecordCurrent.data.hoSoId
                                    })
                                }

                            }}
                            icon={<MdOutlineEdit />}
                        />
                    </Tooltip>)
            }
        }
    ];

    const columnsEmployee: ProColumns<GEN.AdminDiscipline>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'indexBorder',
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
                    <> {entity?.coQuanQuyetDinhName}</>
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
            ...getColumnSearchProps('hanhViViPhamChinh')
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
                    <> {displayTime(entity.batDau)}</>
                );
            },
            ...getColumnSearchRange('batDau', showRangeToTimeStart, setShowRangeToTimeStart, searchRangeFromTimeStart, setSearchRangeFromTimeStart, searchRangeToTimeStart, setSearchRangeToTimeStart, optionRangeSearchTimeStart, setOptionRangeSearchTimeStart)
        },
        {
            title: "Ngày kết thúc",
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
            title: <FormattedMessage id="page.table.createAt" defaultMessage="Create At" />,
            dataIndex: 'create_at',
            // valueType: 'textarea',
            key: 'create_at',
            renderText: (_, text) => { displayTime(text.create_at) },
            ...getColumnSearchRange('create_at', showRangeTo, setShowRangeTo, searchRangeFrom, setSearchRangeFrom, searchRangeTo, setSearchRangeTo, optionRangeSearch, setOptionRangeSearch)
        },
        {
            title: "Trạng thái",
            key: 'xacNhan',
            dataIndex: 'xacNhan',
            render: (_, entity) => {
                ;
                return (
                    <> {mapXacNhan(entity.xacNhan)} </>
                );
            },
            ...searchPheDuyetProps(searchPheDuyet, setSearchPheDuyet, actionRef)
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
                                        hoSoId: getRecordCurrent.data.hoSoId
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
        return await handleUpdate2(value, refIdCurrent.current, `${collection}`);
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

                // dataSource={discipline}
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
                columns={type === 'ADMIN' ? columnsAdmin : columnsEmployee}
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


            <AddDiscipline actionRef={actionRef} open={createModalOpen} handleOpen={handleModalOpen} type={type} collection={collection} />
            <ModalApproval openApproval={openApproval} actionRef={actionRef} selectedRow={selectedRow} setOpenApproval={setOpenApproval} subDirectory='/ky-luat/phe-duyet' fieldApproval='pheDuyet' />

            <ModalForm
                title={<>Cập nhật Kỷ luật {refIdCurrent && type === 'ADMIN' && <Tag color="green">CBVC: {refName.current} - CMND/CCCD: {refSoCMND.current}</Tag>}</>}
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
                    <Col span={8} >
                        <ProFormSelect name="coQuanQuyetDinhId" key="coQuanQuyetDinh" label="Cơ quan quyết định" request={() => getOption(`${SERVER_URL_CONFIG}/coquan-tochuc-donvi?page=0&size=100`, 'id', 'name')} />
                    </Col>
                    <Col span={8} >
                        <ProFormText name="hinhThuc" key="hinhThuc" label="Hình thức kỷ luật" placeholder={"Hình thức"} />
                    </Col>
                    <Col span={8} >
                        <ProFormText name="hanhViViPhamChinh" key="hanhViViPhamChinh" label="Hành vi vi phạm" placeholder={"Hành vi"} />
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

                {/* <Row gutter={24} >
                    <Col span={12} >
                        <ProFormSelect
                            label={"CBVC"}
                            // width='md'
                            name='hoSoId'
                            placeholder={`CBVC`}
                            rules={[
                                {
                                    required: true,

                                },
                            ]}
                            showSearch
                            request={getOptionCBVC}


                        />
                    </Col>
                </Row> */}
            </ModalForm>

        </PageContainer>
    );
};

export default TableList;
