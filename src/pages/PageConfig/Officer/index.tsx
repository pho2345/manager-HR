import { get, getCustome } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormDatePicker, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
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
import { getOption, handleAdd2, handleUpdate2, renderTableAlert, renderTableAlertOption } from '@/services/utils';
import { FormattedMessage } from '@umijs/max';
const configDefaultText = configText;





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
const getOption2 = async (url: string, setNumberSalary: Function): Promise<GEN.Option[]> => {
    try {
        const { data }: any = await get(url);
        setNumberSalary(data);
        if (data) {
            return data
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

                request={async () => get(`${collection}?page=0&size=100`)}
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
