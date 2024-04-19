import { get, getCustome, patch, post } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormSlider } from '@ant-design/pro-components';
import {
    ModalForm,
    PageContainer,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';

import { Button, Col, Dropdown, Form, Input, Menu, Modal, Row, Space, Tooltip, message } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { MdOutlineEdit } from 'react-icons/md';

import configText from '@/locales/configText';
import { getOption, handleAdd2, handleUpdate2, renderTableAlert, renderTableAlertOption } from '@/services/utils';
import { FormattedMessage } from '@umijs/max';
const configDefaultText = configText;



const TableList: React.FC = () => {
    const collection = `${SERVER_URL_PROFILE_DETAIL}/ca-nhan/ngoai-ngu`;
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const refIdCurrent = useRef<any>();
    const [form] = Form.useForm<any>();

    const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
    const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
    const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
    const [optionRangeSearch, setOptionRangeSearch] = useState<any>();
    const add = async (fields: any) => {
        return handleAdd2(fields, collection, true);
    };


    const update = async (fields: any) => {
        fields.tenCoSoDaoTao = fields.IdTenCoSoDaoTao
        return handleUpdate2(fields, refIdCurrent.current, collection, true)
    };

    const [organ, setOrgan] = useState<GEN.Option[]>([]);

    useEffect(() => {
        const getValues = async () => {
            try {
                const dataQueries = [
                    { query: `${SERVER_URL_CONFIG}/coquan-tochuc-donvi?page=0&size=100`, setFunction: setOrgan },
                ];

                for (const { query, setFunction } of dataQueries) {
                    const data = await getOption(query, 'id', 'name');
                    setFunction(data);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        getValues();
    }, []);

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


    const columns: ProColumns<GEN.Languages>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'indexBorder',
        },

        {
            title: 'Tên chứng chỉ',
            key: 'tenNgoaiNgu',
            dataIndex: 'tenNgoaiNgu',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.tenNgoaiNgu}</>
                );
            },
            width: '30vh',
            ...getColumnSearchProps('tenNgoaiNgu')
        },
        {
            title: "Tên cơ sở đào tạo",
            key: 'tenCoSoDaoTao',
            dataIndex: 'tenCoSoDaoTao',
            render: (_, entity) => {
                return (
                    <>{entity.tenCoSoDaoTao}</>
                );
            },
        },
        {
            title: "Chứng chỉ",
            key: 'chungChiDuocCap',
            dataIndex: 'chungChiDuocCap',
            renderText: (_, entity) => entity.chungChiDuocCap
        }, {
            title: "Điểm số",
            key: 'diemSo',
            dataIndex: 'diemSo',
            renderText: (_, entity) => entity.diemSo
        },
        {
            title: "Ngày cấp",
            key: 'batDau',
            dataIndex: 'batDau',
            render: (_, entity) => {
                ;
                return (
                    <>{moment(entity.batDau).format('DD/MM/YYYY')}</>
                );
            },
        },
        {
            title: "Ngày hết hiệu lực",
            key: 'ketThuc',
            dataIndex: 'ketThuc',
            render: (_, entity) => {
                ;
                return (
                    <>{moment(entity.ketThuc).format('DD/MM/YYYY')}</>
                );
            },
        },
        {
            title: <FormattedMessage id="page.table.createAt" defaultMessage="Create At" />,
            dataIndex: 'create_at',
            // valueType: 'textarea',
            key: 'create_at',
            renderText: (_, text) => text?.create_at,
            // ...getColumnSearchProps('name')
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
                                        ...getRecordCurrent.data
                                    })
                                }

                            }}
                            icon={<MdOutlineEdit />}
                        />
                    </Tooltip>)
            }
        }

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




                request={async () => get(collection)}
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

                tableAlertOptionRender={({ selectedRows, selectedRowKeys }: any) => {
                    return renderTableAlertOption(selectedRows, selectedRowKeys, actionRef, collection)
                }}
            />

            <ModalForm
                form={form}
                title={"Tạo mới"}
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
                            label={"Tên chứng chỉ"}
                            // width='md'
                            name='tenNgoaiNgu'
                            placeholder={`Tên chứng chỉ`}
                            rules={[
                                {
                                    required: true,
                                    message: 'Tên chứng chỉ'
                                },
                            ]} />
                    </Col>

                    <Col span={24} >
                        <ProFormText
                            label={"Chứng chỉ được cấp"}
                            // width='md'
                            name='chungChiDuocCap'
                            placeholder={`Chứng chỉ được cấp`}
                            rules={[
                                {
                                    required: true,
                                    message: 'Chứng chỉ được cấp'
                                },
                            ]} />
                    </Col>

                    <Col span={24} >
                        <ProFormSelect
                            label={"Tên cở sở đào tạo"}
                            // width='md'
                            name='tenCoSoDaoTao'
                            placeholder={`Tên cở sở đào tạo`}
                            rules={[
                                {
                                    required: true,
                                    message: 'Tên cở sở đào tạo'
                                },
                            ]}

                            options={organ} />
                    </Col>
                    <Col span={24} >
                        <ProFormDigit
                            label={"Điểm số"}
                            // width='md'
                            name='diemSo'
                            placeholder={`Điểm số`}
                            rules={[
                                {
                                    required: true,
                                    message: 'Điểm số'
                                },
                            ]} />
                    </Col>


                    <Col span={24} >
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
                                // disabledDate: disabledDate
                            }}
                        />
                    </Col>

                    <Col span={24} >
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
                                // disabledDate: disabledDate
                            }}
                        />
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
                    const success = await update(values as any);
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
                            label={"Tên chứng chỉ"}
                            // width='md'
                            name='tenNgoaiNgu'
                            placeholder={`Tên chứng chỉ`}
                            rules={[
                                {
                                    required: true,
                                    message: 'Tên chứng chỉ'
                                },
                            ]} />
                    </Col>

                    <Col span={24} >
                        <ProFormText
                            label={"Chứng chỉ được cấp"}
                            // width='md'
                            name='chungChiDuocCap'
                            placeholder={`Chứng chỉ được cấp`}
                            rules={[
                                {
                                    required: true,
                                    message: 'Chứng chỉ được cấp'
                                },
                            ]} />
                    </Col>

                    <Col span={24} >
                        <ProFormSelect
                            label={"Tên cở sở đào tạo"}
                            // width='md'
                            name='IdTenCoSoDaoTao'
                            placeholder={`Tên cở sở đào tạo`}
                            rules={[
                                {
                                    required: true,
                                    message: 'Tên cở sở đào tạo'
                                },
                            ]}

                            options={organ} />
                    </Col>
                    <Col span={24} >
                        <ProFormDigit
                            label={"Điểm số"}
                            // width='md'
                            name='diemSo'
                            placeholder={`Điểm số`}
                            rules={[
                                {
                                    required: true,
                                    message: 'Điểm số'
                                },
                            ]} />
                    </Col>


                    <Col span={24} >
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
                                // disabledDate: disabledDate
                            }}
                        />
                    </Col>

                    <Col span={24} >
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
                                // disabledDate: disabledDate
                            }}
                        />
                    </Col>
                </Row>
            </ModalForm>

        </PageContainer>
    );
};

export default TableList;
