import { customAPIGet, customAPIAdd, customAPIUpdate, customAPIDelete } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormDatePicker, ProFormSelect } from '@ant-design/pro-components';
import {
    ModalForm,
    PageContainer,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';

import { Button, Col, Dropdown, Form, Input, Menu, Modal, Row, Space, Tooltip, message } from 'antd';
import React, { Fragment, useRef, useState } from 'react';
import moment from 'moment';
import { MdOutlineEdit } from 'react-icons/md';

import configText from '@/locales/configText';
import { renderTableAlert, renderTableAlertOption } from '@/pages/utils';
import { FormattedMessage } from '@umijs/max';
const configDefaultText = configText;

const handleAdd = async (fields: API.RuleListItem) => {
    const hide = message.loading('Đang thêm...');
    try {
        await customAPIAdd({ ...fields }, 'categories');
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
        await customAPIUpdate({
            ...fields
        }, 'categories', id.current);
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
            return customAPIDelete(e.id, 'categories')
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
            if (record.attributes[dataIndex]) {
                return record.attributes[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
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


    const columns: ProColumns<API.Nation>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'indexBorder',
        },
        {
            title: <FormattedMessage id="page.nation.table.name" defaultMessage="Name" />,
            key: 'name',
            dataIndex: 'name',
            render: (_, entity: API.Nation) => {
                ;
                return (
                    <> {entity?.name}</>
                );
            },
            width: '30vh',
            ...getColumnSearchProps('name')
        },
        {
            title: <FormattedMessage id="page.table.createAt" defaultMessage="Create At" />,
            dataIndex: 'create_at',
            // valueType: 'textarea',
            key: 'create_at',
            renderText: (_, text) => text?.create_at,
            // ...getColumnSearchProps('name')
        },


        // {
        //     title: configDefaultText['page.listCategory.createdAt'],
        //     dataIndex: 'atrributes',
        //     valueType: 'textarea',
        //     key: 'create',
        //     width: '20vh',
        //     renderText: (_, text: any) => {
        //         return moment(text?.attributes?.createdAt).format('DD/MM/YYYY HH:mm')
        //     },
        //     ...getColumnSearchRange()
        // },

        {
            title: configDefaultText['titleOption'],
            dataIndex: 'atrributes',
            valueType: 'textarea',
            key: 'option',
            align: 'center',
            render: (_, entity: any) => {

                // const menu = (
                //     <Menu>
                //         <Menu.Item key="1"
                //             onClick={() => {
                //                 handleUpdateModalOpen(true);
                //                 refIdCateogry.current = entity.id;
                //                 form.setFieldsValue({
                //                     code: entity?.attributes?.code,
                //                     name: entity?.attributes?.name
                //                 })
                //             }}
                //         >{configDefaultText['buttonUpdate']}</Menu.Item>

                //         <Menu.Item key="2"
                //             onClick={() => {
                //                 setOpenWgs(true);
                //                 refIdCateogry.current = entity.id;
                //                 refNameCategory.current = entity.attributes.name;
                //             }}
                //         >Tăng trọng tiêu chuẩn</Menu.Item>

                //         <Menu.Item key="2"
                //             onClick={() => {
                //                 setOpenAwg(true);
                //                 refIdCateogry.current = entity.id;
                //                 refNameCategory.current = entity.attributes.name;
                //             }}
                //         >Tăng trọng trung bình</Menu.Item>



                //     </Menu>
                // );
                // return (
                //     <Dropdown overlay={menu} trigger={['click']} placement='bottom'>
                //         <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()} >
                //             {configDefaultText['handle']}
                //         </a>
                //     </Dropdown>
                // );

                return (
                    <Tooltip title={configDefaultText['buttonUpdate']}>
                        <Button
                            style={{
                                border: 'none'
                            }}

                            onClick={async () => {
                                handleUpdateModalOpen(true);
                                // const cow = await customAPIGetOne(entity.id, 'cows/find', {});
                                form.setFieldsValue({
                                })
                            }}
                            icon={<MdOutlineEdit />}
                        />
                    </Tooltip>)
            }
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
                    const data: API.Nation[] = [
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 1,
                            name: "Ba Na"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 2,
                            "name": "Bà Y"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 3,
                            "name": "Bố Y"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 4,
                            "name": "Brau"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 5,
                            "name": "Bru - Vân Kiều"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 6,
                            "name": "Chăm"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 7,
                            "name": "Chơ Ro"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 8,
                            "name": "Chứt"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 9,
                            "name": "Cơ Ho"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 10,
                            "name": "Cơ Tu"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 11,
                            "name": "Cống"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 12,
                            "name": "Coong"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 13,
                            "name": "Cờ Lao"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 14,
                            "name": "Ê Đê"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 15,
                            "name": "Gia Rai"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 16,
                            "name": "Giáy"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 17,
                            "name": "Hà Nhì"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 18,
                            "name": "Hrê"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 19,
                            "name": "Kháng"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 20,
                            "name": "Khơ Mú"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 21,
                            "name": "Khơ Lơ"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 22,
                            "name": "Kinh"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 23,
                            "name": "Krông"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 24,
                            "name": "Lào"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 25,
                            "name": "La Chí"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 26,
                            "name": "La Ha"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 27,
                            "name": "Lô Lô"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 28,
                            "name": "Mảng"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 29,
                            "name": "M'nông"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 30,
                            "name": "Mơ Nông"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 31,
                            "name": "Mường"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 32,
                            "name": "Nùng"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 33,
                            "name": "Ô Đu"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 34,
                            "name": "Pà Thẻn"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 35,
                            "name": "Phù Lá"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 36,
                            "name": "Pu Péo"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 37,
                            "name": "Rơ Măm"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 38,
                            "name": "Ra Glai"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 39,
                            "name": "Rục"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 40,
                            "name": "Sán Chay"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 41,
                            "name": "Sán Dìu"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 42,
                            "name": "Sán Rìu"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 43,
                            "name": "Si La"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 44,
                            "name": "Sơ Rếch"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 45,
                            "name": "Tày"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 46,
                            "name": "Tày Thái"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 47,
                            "name": "Thổ"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 48,
                            "name": "Thái"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 49,
                            "name": "Xinh Mun"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 50,
                            "name": "Xơ Đăng"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 51,
                            "name": "X' Tiêng"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 52,
                            "name": "Ya Chêng"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 53,
                            "name": "Ý Đình"
                        },
                        {
                            "create_at": "2024-01-28T15:18:41",
                            "update_at": null,
                            "id": 54,
                            "name": "Zao"
                        }
                    ]
                    return {
                        total: data.length,
                        data: data,
                        success: true
                    }
                }}
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
                title={<FormattedMessage id="page.nation.modal.titleCreate" defaultMessage="Create Nation" />}
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
                            label={<FormattedMessage id="page.nation.table.name" defaultMessage="Name" />}
                            // width='md'
                            name='name'
                            placeholder={`Tên dân tộc`}
                            rules={[
                                {
                                    required: true,
                                    message: <FormattedMessage id="page.nation.require.name" defaultMessage="Name" />
                                },
                            ]} />
                    </Col>
                </Row>
            </ModalForm>

            <ModalForm
                title={<FormattedMessage id="page.PolicyObject.modal.titleUpdate" defaultMessage="Update Nation" />}
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
                            label={<FormattedMessage id="page.nation.table.name" defaultMessage="Name" />}
                            // width='md'
                            name='name'
                            placeholder={`Tên dân tộc`}
                            rules={[
                                {
                                    required: true,
                                    message: <FormattedMessage id="page.nation.require.name" defaultMessage="Name" />
                                },
                            ]} />
                    </Col>
                </Row>
            </ModalForm>

        </PageContainer>
    );
};

export default TableList;
