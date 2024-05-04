import { get, getCustome } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, LightFilter, ProColumns, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import {
    ModalForm,
    PageContainer,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';

import { Button, Col, Form,  Row,  Tag, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';

import configText from '@/locales/configText';
import { displayTime, filterCreateAndUpdateAt, getColumnSearchProps, getColumnSearchRange, getOption, handleUpdate2, renderTableAlert, renderTableAlertOption, searchPheDuyetProps } from '@/services/utils';
import { FormattedMessage } from '@umijs/max';
import { createPaginationProps, mapXacNhan } from '@/services/utils/constant';
import ModalApproval from '@/reuse/approval/ModalApproval';
import AddRelateFamily from '@/reuse/relate-family/AddRelateFamily';
const configDefaultText = configText;


const TableList: React.FC<GEN.RelateFamilyTable> = ({ type, collection }) => {
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const refIdCurrent = useRef<any>();
    const refName = useRef<string>();
    const refSoCMND = useRef<string>();
    const [form] = Form.useForm<any>();
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZE);
    const [page, setPage] = useState<number>(0);

    const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
    const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
    const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
    const [optionRangeSearch, setOptionRangeSearch] = useState<any>();
    const [searchPheDuyet, setSearchPheDuyet] = useState<GEN.XACNHAN | null>(null);
    const [sort, setSort] = useState<GEN.SORT>('createAt');
    const [selectedRow, setSelectedRow] = useState<[]>([]);
    const [openApproval, setOpenApproval] = useState<boolean>(false);



    const columnsEmployee: ProColumns<GEN.AdminRelateFamily>[] = [
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
        },
        {
            title: "Tên nhân thân",
            key: 'tenNhanThan',
            dataIndex: 'tenNhanThan',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.tenNhanThan}</>
                );
            },
        },

        {
            title: "Mối quan hệ",
            key: 'moiQuanHeName',
            dataIndex: 'moiQuanHeName',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.moiQuanHeName}</>
                );
            },
        },

        {
            title: "Thông tin thân nhân",
            key: 'thongTinThanNhan',
            dataIndex: 'thongTinThanNhan',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.thongTinThanNhan}</>
                );
            },
        },



        {
            title: "Năm sinh",
            key: 'namSinh',
            dataIndex: 'namSinh',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.namSinh}</>
                );
            },
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
                    <> {mapXacNhan(entity.xacNhan)}</>
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
                                        hoSoId: getRecordCurrent.data.hoSoId,
                                        hoVaTen: getRecordCurrent.data.tenNhanThan,
                                    })
                                }

                            }}
                            icon={<MdOutlineEdit />}
                        />
                    </Tooltip>)
            }
        }
    ];

    const columnsAdmin: ProColumns<GEN.AdminRelateFamily>[] = [
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
        },
        {
            title: "Tên nhân thân",
            key: 'tenNhanThan',
            dataIndex: 'tenNhanThan',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.tenNhanThan}</>
                );
            },
        },

        {
            title: "Mối quan hệ",
            key: 'moiQuanHeName',
            dataIndex: 'moiQuanHeName',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.moiQuanHeName}</>
                );
            },
        },

        {
            title: "Thông tin thân nhân",
            key: 'thongTinThanNhan',
            dataIndex: 'thongTinThanNhan',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.thongTinThanNhan}</>
                );
            },
        },



        {
            title: "Năm sinh",
            key: 'namSinh',
            dataIndex: 'namSinh',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.namSinh}</>
                );
            },
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
                    <> {mapXacNhan(entity.xacNhan)}</>
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
                                        hoSoId: getRecordCurrent.data.hoSoId,
                                        hoVaTen: getRecordCurrent.data.tenNhanThan,
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
                        f.pheDuyet = searchPheDuyet;
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


            <AddRelateFamily actionRef={actionRef} open={createModalOpen} handleOpen={handleModalOpen} type={type} collection={collection} />
            <ModalApproval openApproval={openApproval} actionRef={actionRef} selectedRow={selectedRow} setOpenApproval={setOpenApproval} subDirectory='/quan-he-gia-dinh/phe-duyet' fieldApproval='pheDuyet' />


            <ModalForm
                title={<>Cập nhật quan hệ gia đình {refIdCurrent && type === 'ADMIN' && <Tag color="green">CBVC: {refName.current} - CMND/CCCD: {refSoCMND.current}</Tag>}</>}
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
                        <ProFormText name="hoVaTen" key="hoVaTen" label="Họ tên" placeholder={"Họ tên"} />
                    </Col>
                    <Col span={12} >
                        <ProFormSelect name="moiQuanHeId" key="moiQuanHeId" label="Mối quan hệ" request={() => getOption(`${SERVER_URL_CONFIG}/moi-quan-he?page=0&size=100`, 'id', 'name')} />
                    </Col>
                </Row>

                <Row gutter={24} >
                    <Col span={12} >
                        <ProFormDigit name="namSinh" key="namSinh" label="Năm sinh" placeholder={"Năm sinh"} fieldProps={{
                            min: 1900
                        }} />
                    </Col>
                    <Col span={12} >
                        <ProFormText name="thongTinThanNhan" key="thongTinThanNhan" label="Thông tin thân nhân" />
                    </Col>
                </Row>

            </ModalForm>

        </PageContainer>
    );
};

export default TableList;
