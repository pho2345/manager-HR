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
import { MdOutlineEdit } from 'react-icons/md';

import configText from '@/locales/configText';
import { displayTime, getColumnSearchProps, getColumnSearchRange, handleAdd2, handleUpdate2, renderTableAlert, renderTableAlertOption } from '@/services/utils';
import { FormattedMessage } from '@umijs/max';
import { createPaginationProps } from '@/services/utils/constant';
const configDefaultText = configText;



const getOption2 = async (url: string, setNumberSalary: Function): Promise<GEN.Option[]> => {
    try {
        const { data }: any = await get(url);
        if (data) {
            setNumberSalary(data.data);
            return data?.data
                .map((e: any) => {
                    return {
                        value: e?.id,
                        label: `${e?.nhomVienChucName} - ${e?.bacLuongName} - ${e?.heSo}`,
                    };

                });
        }
        return [];
    } catch (error) {
        return [];
    }
}

const TableList: React.FC = () => {
    const collection = `${SERVER_URL_CONFIG}/ngach-vien-chuc`;
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const refIdCurrent = useRef<any>();
    const [form] = Form.useForm<any>();

    const [numberSalary, setNumberSalary] = useState<any>([]);

    const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
    const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
    const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
    const [optionRangeSearch, setOptionRangeSearch] = useState<any>();

    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZE);




    const columns: ProColumns<GEN.Officer>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'indexBorder',
        },
        {
            title: <FormattedMessage id="page.Officer.table.name" defaultMessage="Name" />,
            key: 'name',
            dataIndex: 'name',
            render: (_, entity) => {
                return (
                    <> {entity?.name}</>
                );
            },
            width: '30vh',
            ...getColumnSearchProps('name')
        },
        {
            title: <FormattedMessage id="page.Officer.table.numberSalary" defaultMessage="Hệ số lương" />,
            key: 'numberSalary',
            dataIndex: 'numberSalary',
            renderText: (_, entity) => entity.heSo,
            width: '30vh',
            ...getColumnSearchProps('numberSalary')
        },
        {
            title: "Bậc",
            key: 'bacLuongName',
            dataIndex: 'bacLuongName',
            render: (_, entity) => entity.bacLuongName,
            width: '30vh',
            ...getColumnSearchProps('bacLuongName')
        },
        {
            title: "Loại viên chức",
            key: 'nhomVienChucName',
            dataIndex: 'nhomVienChucName',
            render: (_, entity) => entity.loaiVienChucName,
            width: '30vh',
            ...getColumnSearchProps('nhomVienChucName')
        },

        {
            title: "Nhóm viên chức",
            key: 'nhomVienChucName',
            dataIndex: 'nhomVienChucName',
            render: (_, entity) => entity.nhomVienChucName,
            width: '30vh',
            ...getColumnSearchProps('nhomVienChucName')
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
            render: (_, entity: any) => {
                return (
                    <Tooltip title={configDefaultText['buttonUpdate']}>
                        <Button
                            style={{
                                border: 'none'
                            }}

                            onClick={async () => {
                                handleUpdateModalOpen(true);
                                refIdCurrent.current = entity.ma;
                                const getRecordCurrent = await getCustome(`${collection}/${entity.ma}`);
                                if (getRecordCurrent.data) {
                                    handleUpdateModalOpen(true)
                                    form.setFieldsValue({
                                        ma: getRecordCurrent.data.ma,
                                        name: getRecordCurrent.data.name,
                                        heSoLuong: getRecordCurrent.data.heSoLuongVienChucId,
                                        nhomVienChuc: getRecordCurrent.data.nhomVienChucName,
                                        bacLuong: getRecordCurrent.data.bacLuongName

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
        return await handleAdd2(value, collection);
    }

    async function update(value: any) {
        return await handleUpdate2(value, refIdCurrent.current, collection);
    }

    return (
        <PageContainer>
            <ProTable
                actionRef={actionRef}
                rowKey='ma'
                search={false}
                options={
                    {
                        reload: () => {
                            return true;
                        },
                        setting: {
                            checkable: true
                        }
                    }
                }
                toolBarRender={() => [
                    <Button
                        type='primary'
                        key='primary'
                        onClick={() => {
                            handleModalOpen(true);
                        }}>
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
                rowSelection={{
                }}

                tableAlertRender={({ selectedRowKeys }: any) => {
                    return renderTableAlert(selectedRowKeys);
                }}

                tableAlertOptionRender={({ selectedRows, selectedRowKeys }: any) => {
                    return renderTableAlertOption(selectedRows, selectedRowKeys, actionRef, collection)
                }}
            />

            <ModalForm
                form={form}
                title={<FormattedMessage id="page.Officer.modal.titleCreate" defaultMessage="Create Officer" />}
                width={window.innerWidth * 0.3}
                open={createModalOpen}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        handleModalOpen(false)
                    },
                }}
                onFinish={async (values) => {
                    const data = {
                        ma: values.ma,
                        name: values.name,
                        heSoLuong: values.heSoLuong,
                    }
                    const success = await add(data as API.RuleListItem);
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
                            label={"Mã"}
                            // width='md'
                            name='ma'
                            placeholder={`Mã`}
                            rules={[
                                {
                                    required: true,
                                    message: "Mã"
                                },
                            ]} />
                    </Col>

                    <Col span={24} >
                        <ProFormText
                            label={<FormattedMessage id="page.Officer.table.name" defaultMessage="Name" />}
                            // width='md'
                            name='name'
                            placeholder={`Tên đối tượng`}
                            rules={[
                                {
                                    required: true,
                                    message: <FormattedMessage id="page.Officer.require.name" defaultMessage="Name" />
                                },
                            ]} />
                    </Col>

                    <Col span={24} >
                        <ProFormSelect
                            label={"Hệ số lương"}
                            // width='md'
                            name='heSoLuong'
                            placeholder={`Hệ số lương`}
                            request={() => getOption2(`${SERVER_URL_CONFIG}/he-so-luong-vien-chuc?page=0&size=100`, setNumberSalary)}
                            rules={[
                                {
                                    required: true,
                                    message: "Hệ số lương"
                                },
                            ]}
                            onChange={(e) => {
                                const findNumber: any = numberSalary.find((item: any) => item.id === e);
                                form.setFieldsValue({
                                    nhomVienChuc: findNumber?.nhomVienChucName,
                                    bacLuong: findNumber?.bacLuongName
                                })
                            }}
                            showSearch
                        />
                    </Col>

                    <Col span={12} >
                        <ProFormText
                            disabled
                            label={"Nhóm viên chức"}
                            // width='md'
                            name='nhomVienChuc'
                            placeholder={`Nhóm viên chức`}

                        />
                    </Col>
                    <Col span={12} >
                        <ProFormText
                            disabled
                            label={"Bậc lương"}
                            // width='md'
                            name='bacLuong'
                            placeholder={`Bậc lương`}

                        />
                    </Col>
                </Row>
            </ModalForm>

            <ModalForm
                title={<FormattedMessage id="page.Officer.modal.titleUpdate" defaultMessage="Update Officer" />}
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
                    const data = {
                        ma: values.ma,
                        name: values.name,
                        heSoLuong: values.heSoLuong,
                    }
                    const success = await update(data);
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
                            label={"Mã"}
                            // width='md'
                            name='ma'
                            placeholder={`Mã`}
                            rules={[
                                {
                                    required: true,
                                    message: "Mã"
                                },
                            ]} />
                    </Col>

                    <Col span={24} >
                        <ProFormText
                            label={<FormattedMessage id="page.Officer.table.name" defaultMessage="Name" />}
                            // width='md'
                            name='name'
                            placeholder={`Tên đối tượng`}
                            rules={[
                                {
                                    required: true,
                                    message: <FormattedMessage id="page.Officer.require.name" defaultMessage="Name" />
                                },
                            ]} />
                    </Col>

                    <Col span={24} >
                        <ProFormSelect
                            label={"Hệ số lương"}
                            // width='md'
                            name='heSoLuong'
                            placeholder={`Hệ số lương`}
                            request={() => getOption2(`${SERVER_URL_CONFIG}/he-so-luong-vien-chuc?page=0&size=100`, setNumberSalary)}
                            rules={[
                                {
                                    required: true,
                                    message: "Hệ số lương"
                                },
                            ]}
                            onChange={(e) => {
                                const findNumber: any = numberSalary.find((item: any) => item.id === e);
                                form.setFieldsValue({
                                    nhomVienChuc: findNumber?.nhomVienChuc,
                                    bacLuong: findNumber?.bacLuongName
                                })
                            }}
                            showSearch
                        />
                    </Col>

                    <Col span={12} >
                        <ProFormText
                            disabled
                            label={"Nhóm viên chức"}
                            // width='md'
                            name='nhomVienChuc'
                            placeholder={`Nhóm viên chức`}

                        />
                    </Col>
                    <Col span={12} >
                        <ProFormText
                            disabled
                            label={"Bậc lương"}
                            // width='md'
                            name='bacLuong'
                            placeholder={`Bậc lương`}

                        />
                    </Col>
                </Row>
            </ModalForm>

        </PageContainer>
    );
};

export default TableList;
