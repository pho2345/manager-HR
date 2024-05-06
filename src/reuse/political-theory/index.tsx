import { get, getCustome } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, LightFilter, ProColumns, ProFormDatePicker, ProFormSelect } from '@ant-design/pro-components';
import {
    ModalForm,
    PageContainer,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';

import { Button, Col, Form, Row, Tag, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';

import configText from '@/locales/configText';
import { disableDateStartAndDateEnd, displayTime, filterCreateAndUpdateAt, getColumnSearchProps, getColumnSearchRange, getOption, handleTime, handleUpdate2, renderTableAlert, renderTableAlertOption, searchPheDuyetProps } from '@/services/utils';
import { FormattedMessage } from '@umijs/max';
import AddPolicalTheory from '@/reuse/political-theory/AddPoliticalTheory';
import { createPaginationProps, mapXacNhan } from '@/services/utils/constant';
import ModalApproval from '@/reuse/approval/ModalApproval';
const configDefaultText = configText;





const TableList: React.FC<GEN.PoliticalTheoryTable> = ({ type, collection }) => {
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
    const [sort, setSort] = useState<GEN.SORT>('createAt');

    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZE);
    const [page, setPage] = useState<number>(0);


    const columnsAdmin: ProColumns<GEN.AdminPoliticalTheory>[] = [
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
            title: "Văn bằng",
            key: 'vanBangDuocCap',
            dataIndex: 'vanBangDuocCap',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.vanBangDuocCap}</>
                );
            },
        },

        {
            title: "Hình thức đào tạo",
            key: 'hinhThucDaoTao',
            dataIndex: 'hinhThucDaoTao',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.hinhThucDaoTao}</>
                );
            },
        },



        {
            title: "Cơ sở đào tạo",
            key: 'tenCoSoDaoTao',
            dataIndex: 'tenCoSoDaoTao',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.tenCoSoDaoTaoName}</>
                );
            },
        },


        {
            title: "Ngày cấp",
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
            title: <FormattedMessage id="page.table.createAt" defaultMessage="Create At" />,
            dataIndex: 'create_at',
            // valueType: 'textarea',
            key: 'create_at',
            renderText: (_, entity) => displayTime(entity.create_at),
            ...getColumnSearchRange('create_at', showRangeTo, setShowRangeTo, searchRangeFrom, setSearchRangeFrom, searchRangeTo, setSearchRangeTo, optionRangeSearch, setOptionRangeSearch)
        },

        {
            title: "Trạng thái",
            dataIndex: 'xacNhan',
            // valueType: 'textarea',
            key: 'xacNhan',
            render: (_, entity) => mapXacNhan(entity.xacNhan),
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

    const columnsEmployee: ProColumns<GEN.AdminPoliticalTheory>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'indexBorder',
        },

        {
            title: "Văn bằng",
            key: 'vanBangDuocCap',
            dataIndex: 'vanBangDuocCap',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.vanBangDuocCap}</>
                );
            },
        },

        {
            title: "Hình thức đào tạo",
            key: 'hinhThucDaoTao',
            dataIndex: 'hinhThucDaoTao',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.hinhThucDaoTao}</>
                );
            },
        },



        {
            title: "Cơ sở đào tạo",
            key: 'tenCoSoDaoTao',
            dataIndex: 'tenCoSoDaoTao',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.tenCoSoDaoTaoName}</>
                );
            },
        },


        {
            title: "Ngày cấp",
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
            title: <FormattedMessage id="page.table.createAt" defaultMessage="Create At" />,
            dataIndex: 'create_at',
            // valueType: 'textarea',
            key: 'create_at',
            renderText: (_, entity) => displayTime(entity.create_at),
            ...getColumnSearchRange('create_at', showRangeTo, setShowRangeTo, searchRangeFrom, setSearchRangeFrom, searchRangeTo, setSearchRangeTo, optionRangeSearch, setOptionRangeSearch)
        },

        {
            title: "Trạng thái",
            dataIndex: 'xacNhan',
            // valueType: 'textarea',
            key: 'xacNhan',
            render: (_, entity) => mapXacNhan(entity.xacNhan),
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
                toolbar={filterCreateAndUpdateAt(sort, setSort, actionRef)}

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




                tableAlertRender={({ selectedRowKeys }: any) => {
                    return renderTableAlert(selectedRowKeys);
                }}

                tableAlertOptionRender={({ selectedRows, selectedRowKeys }: any) => {
                    return renderTableAlertOption(selectedRows, selectedRowKeys, actionRef, collection)
                }}
            />

            <AddPolicalTheory open={createModalOpen} handleOpen={handleModalOpen} actionRef={actionRef} collection={collection} type={type} />
            <ModalApproval openApproval={openApproval} actionRef={actionRef} selectedRow={selectedRow} setOpenApproval={setOpenApproval} subDirectory='/ly-luan-chinh-tri/phe-duyet' fieldApproval='pheDuyet' />


            <ModalForm
                title={<>Cập nhật lý luận chính trị {refIdCurrent && type === 'ADMIN' && <Tag color="green">CBVC: {refName.current} - CMND/CCCD: {refSoCMND.current}</Tag>}</>}
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
                        <ProFormText name="vanBangDuocCap" key="vanBangDuocCap" label="Văn bằng" placeholder={'Văn bằng'} />
                    </Col>

                    <Col span={12} >
                        <ProFormText name="hinhThucDaoTao" key="hinhThucDaoTao" label="Hình thức đào tạo" placeholder={'Hình thức đào tạo'} />
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
                                disabledDate: current => disableDateStartAndDateEnd('ketThuc', form, 'start', current)
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
                                disabledDate: current => disableDateStartAndDateEnd('batDau', form, 'end', current)
                            }}
                        />
                    </Col>
                </Row>

                <Row gutter={24} >
                    <Col span={12} >
                        <ProFormSelect name="tenCoSoDaoTaoId" key="tenCoSoDaoTao" label="Cơ sở đào tạo" request={() => getOption(`${SERVER_URL_CONFIG}/coquan-tochuc-donvi?page=0&size=100`, 'id', 'name')} />
                    </Col>
                </Row>
            </ModalForm>

        </PageContainer>
    );
};

export default TableList;
