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
import moment from 'moment';
import { MdOutlineEdit } from 'react-icons/md';

import configText from '@/locales/configText';
import { displayTime, filterCreateAndUpdateAt, getColumnSearchProps, getColumnSearchRange, getOption, getOptionCBVC, handleTime, handleUpdate2, renderTableAlert, renderTableAlertOption, searchPheDuyetProps } from '@/services/utils';
import { XEP_LOAI_CHUYEN_MON, XEP_LOAI_THI_DUA, createPaginationProps, mapXacNhan, mapXepLoaiChuyenMon, mapXepLoaiThiDua } from '@/services/utils/constant';
import AddBonus from '@/reuse/bonus/AddBonus';
import ModalApproval from '@/reuse/approval/ModalApproval';
import { useModel } from '@umijs/max';
const configDefaultText = configText;





const TableList: React.FC<GEN.BonusTable> = ({ type, collection }) => {
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const refIdCurrent = useRef<any>();
    const refName = useRef<string>();
    const refSoCMND = useRef<string>();

    const { initialState, setInitialState } = useModel('@@initialState');
    const { tyBonus } = initialState || {};


    const [form] = Form.useForm<any>();

    const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
    const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
    const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
    const [optionRangeSearch, setOptionRangeSearch] = useState<any>();
    const [selectedRow, setSelectedRow] = useState<[]>([]);
    const [sort, setSort] = useState<GEN.SORT>('createAt');
    const [searchPheDuyet, setSearchPheDuyet] = useState<GEN.XACNHAN | null>(null);

    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZE);

    const [openApproval, setOpenApproval] = useState<boolean>(false);

    const [showRangeToTimeStart, setShowRangeToTimeStart] = useState<boolean>(false);
    const [searchRangeFromTimeStart, setSearchRangeFromTimeStart] = useState<any>(null);
    const [searchRangeToTimeStart, setSearchRangeToTimeStart] = useState<any>(null);
    const [optionRangeSearchTimeStart, setOptionRangeSearchTimeStart] = useState<any>();

    const [showRangeToTimeEnd, setShowRangeToTimeEnd] = useState<boolean>(false);
    const [searchRangeFromTimeEnd, setSearchRangeFromTimeEnd] = useState<any>(null);
    const [searchRangeToTimeEnd, setSearchRangeToTimeEnd] = useState<any>(null);
    const [optionRangeSearchTimeEnd, setOptionRangeSearchTimeEnd] = useState<any>();

   
    const columnsAdmin: ProColumns<GEN.AdminBonus>[] = [
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
            title: "CMND/CCCD",
            key: 'soCCCD',
            dataIndex: 'soCCCD',
            render: (_, entity) => {
                return (
                    <> {entity?.soCCCD}</>
                );
            },
            ...getColumnSearchProps('soCCCD')
        },

        {
            title: "Xếp loại chuyên môn",
            key: 'xepLoaiChuyenMon',
            dataIndex: 'xepLoaiChuyenMon',
            render: (_, entity) => {
                ;
                return (
                    <> {mapXepLoaiChuyenMon(entity?.xepLoaiChuyenMon)}</>
                );
            },
            filters: true,
            valueEnum: {
                'LOAI_A': {
                    text: 'Hoàn thành xuất sắc nhiệm vụ',
                },
                'LOAI_B': {
                    text: 'Hoàn thành tốt nhiệm vụ'
                },
                'LOAI_C': {
                    text: 'Hoàn thành nhiệm vụ'
                },
                'LOAI_D': {
                    text: 'Không hoàn thành nhiệm vụ'
                },
            }

        },



        {
            title: "Xếp loại thi đua",
            key: 'xepLoaiThiDua',
            dataIndex: 'xepLoaiThiDua',
            render: (_, entity) => {
                ;
                return (
                    <> {mapXepLoaiThiDua(entity?.xepLoaiThiDua)}</>
                );
            },
            filters: true,
            onFilter: true,
            valueEnum: {
                'TOT': {
                    text: 'Tốt',
                },
                'XUAT_SAC': {
                    text: 'Xuất sắc'
                },
                'KHA': {
                    text: 'Khá'
                },
                'TRUNG_BINH': {
                    text: 'Trung bình'
                },
            },
            // defaultFilteredValue: ['TRUNG_BINH']
        },

        {
            title: "Hình thức khen thưởng",
            key: 'hinhThucKhenThuong',
            dataIndex: 'hinhThucKhenThuong',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.hinhThucKhenThuongName}</>
                );
            },
            ...getColumnSearchProps('hinhThucKhenThuongName')
        },

        {
            title: "Năm khen thưởng",
            key: 'nam',
            dataIndex: 'nam',
            render: (_, entity) => {
                ;
                return (
                    <> {displayTime(entity?.nam)} </>
                );
            },
            ...getColumnSearchRange('nam', showRangeTo, setShowRangeTo, searchRangeFrom, setSearchRangeFrom, searchRangeTo, setSearchRangeTo, optionRangeSearch, setOptionRangeSearch)
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
                                        xepLoaiChuyenMon: getRecordCurrent.data?.xepLoaiChuyenMon,
                                        xepLoaiThiDua: getRecordCurrent.data?.xepLoaiThiDua,
                                        lyDo: getRecordCurrent?.data?.lyDo,
                                        nam: handleTime(getRecordCurrent.data?.nam),
                                        hinhThucKhenThuongId: getRecordCurrent.data?.hinhThucKhenThuongId,
                                        hoSoId: getRecordCurrent.data.hoSoId
                                    });
                                }

                            }}
                            icon={<MdOutlineEdit />}
                        />
                    </Tooltip>)
            }
        }
    ];

    const columnsEmployee: ProColumns<GEN.AdminBonus>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'indexBorder',
        },
       
        {
            title: "Xếp loại chuyên môn",
            key: 'xepLoaiChuyenMon',
            dataIndex: 'xepLoaiChuyenMon',
            render: (_, entity) => {
                ;
                return (
                    <> {mapXepLoaiChuyenMon(entity?.xepLoaiChuyenMon)}</>
                );
            },
            filters: true,
            valueEnum: {
                'LOAI_A': {
                    text: 'Hoàn thành xuất sắc nhiệm vụ',
                },
                'LOAI_B': {
                    text: 'Hoàn thành tốt nhiệm vụ'
                },
                'LOAI_C': {
                    text: 'Hoàn thành nhiệm vụ'
                },
                'LOAI_D': {
                    text: 'Không hoàn thành nhiệm vụ'
                },
            }

        },



        {
            title: "Xếp loại thi đua",
            key: 'xepLoaiThiDua',
            dataIndex: 'xepLoaiThiDua',
            render: (_, entity) => {
                ;
                return (
                    <> {mapXepLoaiThiDua(entity?.xepLoaiThiDua)}</>
                );
            },
            // ...getColumnSearchProps('xepLoaiThiDua')\
            filters: true,
            onFilter: true,
            valueEnum: {
                'TOT': {
                    text: 'Tốt',
                },
                'XUAT_SAC': {
                    text: 'Xuất sắc'
                },
                'KHA': {
                    text: 'Khá'
                },
                'TRUNG_BINH': {
                    text: 'Trung bình'
                },
            },
            // defaultFilteredValue: ['TRUNG_BINH']
        },

        {
            title: "Hình thức khen thưởng",
            key: 'hinhThucKhenThuong',
            dataIndex: 'hinhThucKhenThuong',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.hinhThucKhenThuongName}</>
                );
            },
        },

        {
            title: "Năm khen thưởng",
            key: 'nam',
            dataIndex: 'nam',
            render: (_, entity) => {
                ;
                return (
                    <> {displayTime(entity?.nam)}</>
                );
            },
            ...getColumnSearchRange('nam', showRangeTo, setShowRangeTo, searchRangeFrom, setSearchRangeFrom, searchRangeTo, setSearchRangeTo, optionRangeSearch, setOptionRangeSearch)
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
                                        xepLoaiChuyenMon: getRecordCurrent.data?.xepLoaiChuyenMon,
                                        xepLoaiThiDua: getRecordCurrent.data?.xepLoaiThiDua,
                                        lyDo: getRecordCurrent?.data?.lyDo,
                                        nam: getRecordCurrent.data.nam ? moment(getRecordCurrent.data.nam) : null,
                                        hinhThucKhenThuongId: getRecordCurrent.data?.hinhThucKhenThuongId,
                                        hoSoId: getRecordCurrent.data.hoSoId
                                    });
                                }

                            }}
                            icon={<MdOutlineEdit />}
                        />
                    </Tooltip>)
            }
        }
    ];

    async function update(value: any) {
        const { hoSoId, nam, ...other } = value;
        return await handleUpdate2({
            ...other,
            nam: moment(nam).toISOString()
        }, refIdCurrent.current, collection);
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



            <AddBonus createModalOpen={createModalOpen} handleModalOpen={handleModalOpen} actionRef={actionRef} type={type} collection={collection} />
            <ModalApproval openApproval={openApproval} actionRef={actionRef} selectedRow={selectedRow} setOpenApproval={setOpenApproval} subDirectory='/khen-thuong/phe-duyet' fieldApproval='pheDuyet' />

            <ModalForm

                title={<>Cập nhật khen thưởng {refIdCurrent && type === 'ADMIN' && <Tag color="green">CBVC: {refName.current} - CMND/CCCD: {refSoCMND.current}</Tag>}</>}
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
                        <ProFormSelect
                            label={"Xếp loại chuyên môn"}
                            // width='md'
                            name='xepLoaiChuyenMon'
                            placeholder={`Xếp loại chuyên môn`}
                            options={XEP_LOAI_CHUYEN_MON}
                            rules={[
                                {
                                    required: true,
                                    message: "Xếp loại chuyên môn"
                                },
                            ]} />
                    </Col>

                    <Col span={12} >
                        <ProFormSelect
                            label={"Xếp loại thi đua"}
                            // width='md'
                            name='xepLoaiThiDua'
                            placeholder={`Xếp loại thi đua`}
                            options={XEP_LOAI_THI_DUA}
                            rules={[
                                {
                                    required: true,
                                    message: "Xếp loại thi đua"
                                },
                            ]} />
                    </Col>
                </Row>

                <Row gutter={24} >
                    <Col span={12} >
                        <ProFormSelect
                            label={"Hình thức khen thưởng"}
                            // width='md'
                            name='hinhThucKhenThuongId'
                            placeholder={`Hình thức khen thưởng`}
                            options={tyBonus}
                            rules={[
                                {
                                    required: true,
                                    message: "Hình thức khen thưởng"
                                },
                            ]} />
                    </Col>

                    <Col span={12} >
                        <ProFormText
                            label={"Lý do"}
                            // width='md'
                            name='lyDo'
                            placeholder={`Lý do`}
                            rules={[
                                {
                                    required: true,
                                    message: "Lý do"
                                },
                            ]} />
                    </Col>
                </Row>

                <Row gutter={24} >
                    <Col span={12} >
                        <ProFormDatePicker
                            label={"Năm"}
                            // width='md'
                            name='nam'
                            fieldProps={{
                                style: {
                                    width: "100%"
                                },
                            }}
                            placeholder={`Năm`}
                            rules={[
                                {
                                    required: true,
                                    message: "Năm"
                                },
                            ]} />
                    </Col>

                    {/* <Col span={12} >
                        <ProFormSelect
                            label={"CBVC"}
                            // width='md'
                            name='hoSoId'
                            placeholder={`CBVC`}
                            rules={[
                                {
                                    required: true,
                                    message: "CBVC"
                                },
                            ]}
                            request={getOptionCBVC}

                        />
                    </Col> */}
                </Row>
            </ModalForm>

        </PageContainer>
    );
};

export default TableList;
