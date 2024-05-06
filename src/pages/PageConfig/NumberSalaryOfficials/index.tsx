import { get, getCustome } from '@/services/ant-design-pro/api';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import {
    ModalForm,
    PageContainer,
    ProTable,
} from '@ant-design/pro-components';

import { Button, Col, Form, Row, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';

import configText from '@/locales/configText';
import { displayTime, getColumnSearchProps, getColumnSearchRange, getOption, handleAdd, handleUpdate2, renderTableAlert, renderTableAlertOption } from '@/services/utils';
import { FormattedMessage } from '@umijs/max';
import { createPaginationProps } from '@/services/utils/constant';
const configDefaultText = configText;



const TableList: React.FC = () => {

    const collection = `${SERVER_URL_CONFIG}/he-so-luong-vien-chuc`;
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const refIdCurrent = useRef<any>();
    const [form] = Form.useForm<any>();

    const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
    const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
    const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
    const [optionRangeSearch, setOptionRangeSearch] = useState<any>();

    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZE);




    const columns: ProColumns<GEN.NumberSalaryOfficials>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'indexBorder',
        },
        {
            title: "Bậc lương",
            key: 'bacLuongName',
            dataIndex: 'bacLuongName',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.bacLuongName}</>
                );
            },
            width: '30vh',
            ...getColumnSearchProps('bacLuongName')
        },
        {
            title: "Hệ số",
            key: 'heSo',
            dataIndex: 'heSo',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.heSo}</>
                );
            },
            width: '30vh',
            ...getColumnSearchProps('loai')
        },

        {
            title: "Nhóm viên chức",
            key: 'nhomCongChucName',
            dataIndex: 'nhomCongChucName',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.nhomVienChucName}</>
                );
            },
            width: '30vh',
            ...getColumnSearchProps('loai')
        },

        {
            title: <FormattedMessage id="page.table.createAt" defaultMessage="Create At" />,
            dataIndex: 'create_at',
            key: 'create_at',
            renderText: (_, text) => displayTime(text.create_at),
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
                                const getRecordCurrent = await getCustome(`${collection}/${entity.id}`);
                                if (getRecordCurrent.data) {
                                    handleUpdateModalOpen(true)
                                    form.setFieldsValue({
                                        nhom: getRecordCurrent.data.nhomVienChucId,
                                        bacLuong: getRecordCurrent.data.bacLuongId,
                                        heSo: getRecordCurrent.data.heSo,
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
        return await handleAdd(value, collection);
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
                    settings: [{
                        key: 'reload',
                        tooltip: configDefaultText['reload'],
                        icon: <ReloadOutlined />,
                        onClick: () => {
                            if (actionRef.current) {
                                actionRef.current.reload();
                            }
                        }
                    }]
                }}




                request={async () => {
                    const data = await get(collection, {
                        // sort: sort,
                        page: page,
                        size: pageSize
                    });
                    if (data.data) {
                        setTotal(data.data.totalRecord);
                        return {
                            data: data.data?.data,
                            success: true,
                        }
                    }
                    return {
                        data: [],
                        success: false
                    }
                }}
                pagination={createPaginationProps(total, pageSize, setPage, setPageSize, actionRef)}
                columns={columns}
                rowSelection={{}}

                tableAlertRender={({ selectedRowKeys }: any) => {
                    return renderTableAlert(selectedRowKeys);
                }}

                tableAlertOptionRender={({ selectedRows, selectedRowKeys }: any) => {
                    return renderTableAlertOption(selectedRows, selectedRowKeys, actionRef, collection)
                }}
            />

            <ModalForm
                form={form}
                title={"Tạo mới hệ số lương viên chức"}
                width={window.innerWidth * 0.3}
                open={createModalOpen}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        handleModalOpen(false)
                    },
                }}
                onFinish={async (value) => {
                    const success = await add(value)
                    if (success) {
                        handleModalOpen(false);
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
                            label={"Bậc lương"}
                            // width='md'
                            name='bacLuong'
                            placeholder={`Bậc lương`}
                            request={() => getOption(`${SERVER_URL_CONFIG}/bac-luong?page=0&size=100`, 'id', 'name')}
                            rules={[
                                {
                                    required: true,
                                    message: <FormattedMessage id="page.nation.require.name" defaultMessage="Name" />
                                },
                            ]} />
                    </Col>

                    <Col span={24} >
                        <ProFormDigit
                            label={"Hệ số"}
                            // width='md'
                            name='heSo'
                            placeholder={`Hệ số`}
                            rules={[
                                {
                                    required: true,
                                    message: "Hệ số"
                                },
                            ]} />
                    </Col>

                    <Col span={24} >
                        <ProFormSelect
                            label={"Nhóm viên chức"}
                            // width='md'
                            name='nhom'
                            placeholder={`Nhóm viên chức`}
                            request={() => getOption(`${SERVER_URL_CONFIG}/nhom-vien-chuc?page=0&size=100`, 'id', 'name')}
                        />
                    </Col>
                </Row>


            </ModalForm>

            <ModalForm
                title={"Cập nhật hệ số lương viên chức"}
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
                    const success = await update(values);
                    if (success) {
                        handleUpdateModalOpen(false);
                        form.resetFields();
                        if (actionRef.current) {
                            actionRef.current.reload();
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
                            label={"Bậc lương"}
                            // width='md'
                            name='bacLuong'
                            placeholder={`Bậc lương`}
                            request={() => getOption(`${SERVER_URL_CONFIG}/bac-luong?page=0&size=100`, 'id', 'name')}
                            rules={[
                                {
                                    required: true,
                                    message: <FormattedMessage id="page.nation.require.name" defaultMessage="Name" />
                                },
                            ]} />
                    </Col>

                    <Col span={24} >
                        <ProFormDigit
                            label={"Hệ số"}
                            // width='md'
                            name='heSo'
                            placeholder={`Hệ số`}
                            rules={[
                                {
                                    required: true,
                                    message: "Hệ số"
                                },
                            ]} />
                    </Col>

                    <Col span={24} >
                        <ProFormSelect
                            label={"Nhóm viên chức"}
                            // width='md'
                            name='nhom'
                            placeholder={`Nhóm viên chức`}
                            request={() => getOption(`${SERVER_URL_CONFIG}/nhom-vien-chuc?page=0&size=100`, 'id', 'name')}
                        />
                    </Col>
                </Row>
            </ModalForm>

        </PageContainer>
    );
};

export default TableList;
