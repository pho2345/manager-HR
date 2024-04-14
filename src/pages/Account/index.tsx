import { get } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormDatePicker, ProFormSelect } from '@ant-design/pro-components';
import {
    ModalForm,
    PageContainer,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';

import { Button, Col, Dropdown, Form, Input, Menu, Modal, Row, Space, Switch, Tooltip, message } from 'antd';
import React, { Fragment, useRef, useState } from 'react';
import moment from 'moment';
import { MdOutlineEdit } from 'react-icons/md';

import configText from '@/locales/configText';
import { renderTableAlert, renderTableAlertOption } from '@/services/utils';
import { FormattedMessage } from '@umijs/max';
const configDefaultText = configText;

const handleAdd = async (fields: API.RuleListItem) => {
    const hide = message.loading('Đang thêm...');
    try {
        hide();
        message.success('Thêm thành công');
        return true;
    } catch (error: any) {
        hide();
        message.error(error?.response?.data?.error?.message);
        return false;
    }
};


const handleUpdate = async (fields: any, id: any) => {
    const hide = message.loading('Đang cập nhật...');
    try {
        hide();

        message.success('Cập nhật thành công');
        return true;
    } catch (error: any) {
        hide();
        message.error(error?.response?.data?.error?.message);
        return false;
    }
};


const handleRemove = async (selectedRows: any) => {
    const hide = message.loading('Đang xóa');
    if (!selectedRows) return true;
    try {
        const deleteRowss = selectedRows.map((e: any) => {
        })

        await Promise.all(deleteRowss);
        hide();
        message.success('Xóa thành công');
        return true;
    } catch (error: any) {
        hide();
        message.error(error?.response?.data?.error?.message);
        return false;
    }
};


const collection = `${SERVER_URL_ACCOUNT}/nhan-vien/tai-khoan`;
const TableList: React.FC = () => {
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const [openWgs, setOpenWgs] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const refIdCateogry = useRef<any>();
    const refNameCategory = useRef<any>();
    const [form] = Form.useForm<any>();

    const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
    const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
    const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
    const [optionRangeSearch, setOptionRangeSearch] = useState<any>();
    const [openAwg, setOpenAwg] = useState<boolean>(false);


    const confirm = (entity: any) => {
        Modal.confirm({
            title: configDefaultText['titleConfirm'],
            icon: <ExclamationCircleOutlined />,
            content: configDefaultText['textConfirmDelete'],
            okText: 'Có',
            cancelText: 'Không',
            onOk: async () => {
                await handleRemove(entity);
                if (actionRef.current) {
                    actionRef.current?.reloadAndRest?.();
                }
            }
        });
    };

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
            if (record[dataIndex]) {
                return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
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


    const getColumnSearchRange = () => ({
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
                        if (moment(record.attributes.createdAt).isAfter(convertValue[1]) && moment(record.attributes.createdAt).isBefore(convertValue[2])) {
                            return record
                        }
                    }
                }
                else {
                    const timeStart = moment().startOf(optionValue).toISOString();
                    const timeEnd = moment().endOf(optionValue).toISOString();
                    if (moment(record.attributes.createdAt).isAfter(timeStart) && moment(record.attributes.createdAt).isBefore(timeEnd)) {
                        return record;
                    }
                }
            }
            return null;
        }
        ,
    });


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
                    <> {entity?.hoVaten}</>
                );
            },
            width: '30vh',
            ...getColumnSearchProps('name')
        },
        {
            title: <FormattedMessage id="page.Account.table.numberIdentify" defaultMessage="Số CMND/CCCD" />,
            dataIndex: 'create_at',
            // valueType: 'textarea',
            key: 'create_at',
            renderText: (_, text) => text?.soCCCD,
            // ...getColumnSearchProps('name')
        },

        {
            key: 'email',
            title: <FormattedMessage id="page.Account.table.email" defaultMessage="Email" />,
            dataIndex: 'atrributes',
            valueType: 'textarea',
            renderText: (_, text) => text?.email,
            // ...getColumnSearchProps('name')
        },

        {
            key: 'username',
            title: <FormattedMessage id="page.Account.table.username" defaultMessage="Username" />,
            dataIndex: 'atrributes',
            valueType: 'textarea',
            renderText: (_, text) => text?.username,
            // ...getColumnSearchProps('name')
        },

        {
            key: 'username',
            title: <FormattedMessage id="page.Account.table.role" defaultMessage="Quyền" />,
            dataIndex: 'atrributes',
            valueType: 'textarea',
            renderText: (_, text) => text?.username,
            // ...getColumnSearchProps('name')
        },


        {
            key: 'username',
            title: <FormattedMessage id="page.Account.table.status" defaultMessage="Trạng thái" />,
            dataIndex: 'atrributes',
            valueType: 'textarea',
            render: (_, text) => <Switch checked={text.trangThai} disabled/>,
            // ...getColumnSearchProps('name')
        },

        // {
        //     title: <FormattedMessage id="page.Account.table.email" defaultMessage="Email" />,
        //     dataIndex: 'atrributes',
        //     valueType: 'textarea',
        //     key: 'option',
        //     align: 'center',
        //     render: (_, entity: any) => {

        //         // const menu = (
        //         //     <Menu>
        //         //         <Menu.Item key="1"
        //         //             onClick={() => {
        //         //                 handleUpdateModalOpen(true);
        //         //                 refIdCateogry.current = entity.id;
        //         //                 form.setFieldsValue({
        //         //                     code: entity?.attributes?.code,
        //         //                     name: entity?.attributes?.name
        //         //                 })
        //         //             }}
        //         //         >{configDefaultText['buttonUpdate']}</Menu.Item>

        //         //         <Menu.Item key="2"
        //         //             onClick={() => {
        //         //                 setOpenWgs(true);
        //         //                 refIdCateogry.current = entity.id;
        //         //                 refNameCategory.current = entity.attributes.name;
        //         //             }}
        //         //         >Tăng trọng tiêu chuẩn</Menu.Item>

        //         //         <Menu.Item key="2"
        //         //             onClick={() => {
        //         //                 setOpenAwg(true);
        //         //                 refIdCateogry.current = entity.id;
        //         //                 refNameCategory.current = entity.attributes.name;
        //         //             }}
        //         //         >Tăng trọng trung bình</Menu.Item>



        //         //     </Menu>
        //         // );
        //         // return (
        //         //     <Dropdown overlay={menu} trigger={['click']} placement='bottom'>
        //         //         <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()} >
        //         //             {configDefaultText['handle']}
        //         //         </a>
        //         //     </Dropdown>
        //         // );

        //         return (
        //             <Tooltip title={configDefaultText['buttonUpdate']}>
        //                 <Button
        //                     style={{
        //                         border: 'none'
        //                     }}

        //                     onClick={async () => {
        //                         handleUpdateModalOpen(true);
        //                         // const cow = await customAPIGetOne(entity.id, 'cows/find', {});
        //                         form.setFieldsValue({
        //                         })
        //                     }}
        //                     icon={<MdOutlineEdit />}
        //                 />
        //             </Tooltip>)
        //     }
        // },
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
                    }]
                }}

                request={async () => get(collection)} //TODO: lấy tinh-trang-suc-khoe
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
                rowSelection={{
                }}

                tableAlertRender={({ selectedRowKeys }: any) => {
                    return renderTableAlert(selectedRowKeys);
                }}

                tableAlertOptionRender={({ selectedRows }: any) => {
                    return renderTableAlertOption(selectedRows)
                }}
            />

            <ModalForm
                form={form}
                title={<FormattedMessage id="page.HealthStatus.modal.titleCreate" defaultMessage="Create HealthStatus" />}
                width={window.innerWidth * 0.3}
                open={createModalOpen}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        handleModalOpen(false)
                    },
                }}
                onFinish={async (value) => {
                    const success = await handleAdd(value as API.RuleListItem);
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
                            label={<FormattedMessage id="page.HealthStatus.table.name" defaultMessage="Name" />}
                            // width='md'
                            name='name'
                            placeholder={`Tên đối tượng`}
                            rules={[
                                {
                                    required: true,
                                    message: <FormattedMessage id="page.HealthStatus.require.name" defaultMessage="Name" />
                                },
                            ]} />
                    </Col>
                </Row>
            </ModalForm>

            <ModalForm
                title={<FormattedMessage id="page.HealthStatus.modal.titleUpdate" defaultMessage="Update HealthStatus" />}
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
                    const success = await handleUpdate(values as any, refIdCateogry);
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
                            label={<FormattedMessage id="page.HealthStatus.table.name" defaultMessage="Name" />}
                            // width='md'
                            name='name'
                            placeholder={`Tên đối tượng`}
                            rules={[
                                {
                                    required: true,
                                    message: <FormattedMessage id="page.HealthStatus.require.name" defaultMessage="Name" />
                                },
                            ]} />
                    </Col>
                </Row>
            </ModalForm>

        </PageContainer>
    );
};

export default TableList;
