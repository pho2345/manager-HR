import { get, getCustome } from '@/services/ant-design-pro/api';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormSelect } from '@ant-design/pro-components';
import {
    ModalForm,
    PageContainer,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';

import { Button, Col, Form, Row, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import moment from 'moment';
import { MdOutlineEdit } from 'react-icons/md';
import configText from '@/locales/configText';
import { getColumnSearchProps, getColumnSearchRange, getOption, handleAdd, handleUpdate2, renderTableAlert, renderTableAlertOption } from '@/services/utils';
import { FormattedMessage } from '@umijs/max';
import { createPaginationProps } from '@/services/utils/constant';
const configDefaultText = configText;

const TableList: React.FC = () => {
    const collection = `${SERVER_URL_CONFIG}/nhom-cong-chuc`;
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



    const columns: ProColumns<GEN.CivilServantGroup>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'indexBorder',
        },
        {
            title: "Tên nhóm công chức",
            key: 'name',
            dataIndex: 'name',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.name}</>
                );
            },
            ...getColumnSearchProps('name')
        },
        {
            title: "Loại",
            key: 'loai',
            dataIndex: 'loai',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.loaiCongChucLoai}</>
                );
            },
        },
        {
            title: <FormattedMessage id="page.table.createAt" defaultMessage="Create At" />,
            dataIndex: 'create_at',
            key: 'create_at',
            renderText: (_, text) => moment(text.create_at).format(FORMAT_DATE),
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
                                        name: getRecordCurrent.data.name,
                                        loai: getRecordCurrent.data.loaiCongChucId
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
                title={"Tạo mới nhóm công chức"}
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
                        <ProFormText
                            label={"Tên nhóm công chức"}
                            // width='md'
                            name='name'
                            placeholder={`Tên nhóm công chức`}
                            rules={[
                                {
                                    required: true,
                                    message: <FormattedMessage id="page.nation.require.name" defaultMessage="Name" />
                                },
                            ]} />
                    </Col>

                    <Col span={24} >
                        <ProFormSelect
                            label={"Loại"}
                            // width='md'
                            name='loai'
                            request={() => getOption(`${SERVER_URL_CONFIG}/loai-cong-chuc?page=0&size=100`, 'id', 'name')}
                            placeholder={`Loại`}
                            rules={[
                                {
                                    required: true,
                                    message: "Loại"
                                },
                            ]} />
                    </Col>
                </Row>


            </ModalForm>

            <ModalForm
                title={"Cập nhật nhóm công chức"}
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
                        <ProFormText
                            label={"Tên nhóm công chức"}
                            name='name'
                            placeholder={`Tên nhóm công chức`}
                            rules={[
                                {
                                    required: true,
                                    message: "Tên nhóm công chức"
                                },
                            ]} />

                    </Col>
                    <Col span={24} >
                        <ProFormSelect
                            label={"Loại"}
                            // width='md'
                            name='loai'
                            request={() => getOption(`${SERVER_URL_CONFIG}/loai-cong-chuc?page=0&size=100`, 'id', 'name')}
                            placeholder={`Loại`}
                            rules={[
                                {
                                    required: true,
                                    message: "Loại"
                                },
                            ]} />
                    </Col>
                </Row>
            </ModalForm>

        </PageContainer>
    );
};

export default TableList;
