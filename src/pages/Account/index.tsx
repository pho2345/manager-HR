import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormSelect } from '@ant-design/pro-components';
import {
    ModalForm,
    PageContainer,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';

import { Button, Col, Form, Row, Space } from 'antd';
import React, { useRef, useState } from 'react';

import configText from '@/locales/configText';
import { handleAdd, renderTableAlert } from '@/services/utils';
import { FormattedMessage, request } from '@umijs/max';
import { mapRole } from '@/services/utils/constant';
const configDefaultText = configText;







async function get(url: string, params = {}) {
    const fetchData = await request<any>(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        params: params
    });

    return {
        total: fetchData && fetchData?.data.length,
        success: fetchData && true,
        data: fetchData.data
    }
}



const TableList: React.FC = () => {
    const collection = `${SERVER_URL_ACCOUNT}/nhan-vien/tai-khoan`;
    const [search, setSearch] = useState<string>(``);
    const [searchRole, setSearchRole] = useState<'ADMIN' | 'EMPLOYEE' | '' | null>(null);
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    // const refIdCurrent = useRef<any>();
    const [form] = Form.useForm<any>();

    // const { initialState, setInitialState } = useModel('@@initialState');


   

    const handleSearch = (selectedKeys: any, confirm: any) => {
        confirm();
    };
    const handleReset = (clearFilters: any, confirm: any) => {
        clearFilters();
        confirm({
            closeDropdown: false,
        });
    };
   



    const add = async (data: any) => {
        return await handleAdd(data, collection);
    }

    const columns: ProColumns<GEN.Account>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'indexBorder',
        },
        {
            title: <FormattedMessage id="page.Account.table.name" defaultMessage="Họ tên" />,
            key: 'name',
            dataIndex: 'name',
            render: (_, entity) => {
                return (
                    <> {entity?.hoVaTen}</>
                );
            },
            width: '30vh',
        },

        {
            key: 'email',
            title: <FormattedMessage id="page.Account.table.email" defaultMessage="Email" />,
            dataIndex: 'atrributes',
            valueType: 'textarea',
            renderText: (_, text) => text?.email,
        },

        {
            key: 'username',
            title: <FormattedMessage id="page.Account.table.username" defaultMessage="Username" />,
            dataIndex: 'atrributes',
            valueType: 'textarea',
            renderText: (_, text) => text?.username,
        },

        {
            key: 'role',
            title: <FormattedMessage id="page.Account.table.role" defaultMessage="Quyền" />,
            dataIndex: 'role',
            valueType: 'textarea',
            renderText: (_, text) => mapRole(text?.role),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters,
                //close
            }: any) => (
                <div
                    style={{
                        padding: 8,
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                >
                    <Row gutter={24} className="m-0">
                        <Col span={24} className="gutter-row p-0" >
                            <ProFormSelect
                                options={[
                                    {
                                        value: 'ADMIN',
                                        label: 'ADMIN'
                                    },
                                    {
                                        value: 'EMPLOYEE',
                                        label: 'EMPLOYEE'
                                    },

                                ]}
                                fieldProps={{
                                    onChange: (value: any) => {
                                        setSearchRole(value)
                                    },
                                    value: searchRole
                                }}
                                placeholder={'Chọn quyền'}
                            />
                        </Col>
                    </Row>
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => {
                                confirm()
                                actionRef.current?.reload();

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
                            onClick={() => {
                                setSearchRole(null);
                                actionRef.current?.reload();
                            }}
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
                        color: searchRole ? '#1890ff' : undefined,
                    }}
                />
            ),

        },


    ];





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
                    }],

                    search: {
                        onSearch: async (value: string, e) => {
                            setSearch(value);
                            actionRef.current?.reload();
                        },
                        placeholder: "Tìm kiếm",
                    },
                }}

                request={async () => {
                    const data = await get(`${collection}?page=0&size=200`, {
                        username: search,
                        role: searchRole
                    });
                    // setUser(data?.data);
                    return data;
                }} //TODO: lấy tinh-trang-suc-khoe
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
                rowSelection={false}

                tableAlertRender={({ selectedRowKeys }: any) => {
                    return renderTableAlert(selectedRowKeys);
                }}

                // tableAlertOptionRender={({ selectedRows }: any) => {
                //     return renderTableAlertOption(selectedRows)
                // }}
            />

            <ModalForm
                form={form}
                title={"Tạo mới tài khoản"}
                width={window.innerWidth * 0.3}
                open={createModalOpen}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        handleModalOpen(false)
                    },
                }}
                onFinish={async (value) => {
                    const success = await add(value as API.RuleListItem);
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
                            label={"Họ tên"}
                            // width='md'
                            name='hoVaTen'
                            placeholder={`Họ tên`}
                            rules={[
                                {
                                    required: true,
                                    message: "Họ tên"
                                },
                            ]} />
                    </Col>
                    <Col span={24} >
                        <ProFormText
                            label={"CCCD/CMND"}
                            // width='md'
                            name='soCCCD'
                            placeholder={`CCCD/CMND`}
                            rules={[
                                {
                                    required: true,
                                    message: "CCCD/CMND"
                                },
                            ]} />
                    </Col>

                    <Col span={24} >
                        <ProFormText
                            label={"Email"}
                            // width='md'
                            name='email'
                            placeholder={`Email`}
                            rules={[
                                {
                                    required: true,
                                    message: "Email"
                                },
                            ]} />
                    </Col>
                </Row>
            </ModalForm>

            <ModalForm
                title={"Cập nhật tài khoản"}
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
                            label={"Họ tên"}
                            // width='md'
                            name='hoVaTen'
                            placeholder={`Họ tên`}
                            rules={[
                                {
                                    required: true,
                                    message: "Họ tên"
                                },
                            ]} />
                    </Col>
                    <Col span={24} >
                        <ProFormText
                            label={"CCCD/CMND"}
                            // width='md'
                            name='soCCCD'
                            placeholder={`CCCD/CMND`}
                            rules={[
                                {
                                    required: true,
                                    message: "CCCD/CMND"
                                },
                            ]} />
                    </Col>

                    <Col span={24} >
                        <ProFormText
                            label={"Email"}
                            // width='md'
                            name='email'
                            placeholder={`Email`}
                            rules={[
                                {
                                    required: true,
                                    message: "Email"
                                },
                            ]} />
                    </Col>
                </Row>
            </ModalForm>

        </PageContainer>
    );
};

export default TableList;
