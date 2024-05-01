import { get, getCustome } from '@/services/ant-design-pro/api';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, LightFilter, ProColumns, ProFormDatePicker, ProFormSelect } from '@ant-design/pro-components';
import {
    ModalForm,
    PageContainer,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';

import { Button, Col, Form, Input, Row, Space, Tag, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import moment from 'moment';
import { MdOutlineEdit } from 'react-icons/md';
import configText from '@/locales/configText';
import { disableDateStartAndDateEnd, displayTime, getOption, handleTime, handleUpdate2, renderTableAlert, renderTableAlertOption } from '@/services/utils';
import { FormattedMessage } from '@umijs/max';
import { XAC_NHAN, createPaginationProps, mapXacNhan } from '@/services/utils/constant';
import AddGOB from '@/reuse/go-on-business/AddGOB';
import ModalApproval from '@/reuse/approval/ModalApproval';
const configDefaultText = configText;


const TableList: React.FC<GEN.GOBTable> = ({ type, collection }) => {
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const refIdCurrent = useRef<any>();
    const refName = useRef<string>();
    const refSoCMND = useRef<string>();
    const [form] = Form.useForm<any>();

    const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
    const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
    const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
    const [optionRangeSearch, setOptionRangeSearch] = useState<any>();
    const [selectRow, setSelectRow] = useState<[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sort, setSort] = useState<GEN.SORT>('createAt');
    const [searchPheDuyet, setSearchPheDuyet] = useState<GEN.XACNHAN | null>(null);
    const [openApproval, setOpenApproval] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<[]>([]);

    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZE);
    const [page, setPage] = useState<number>(0);





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


    const getColumnSearchRange = (dataIndex: string) => ({
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
                        if (moment(record[dataIndex]).isAfter(convertValue[1]) && moment(record[dataIndex]).isBefore(convertValue[2])) {
                            return record
                        }
                    }
                }
                else {
                    const timeStart = moment().startOf(optionValue).toISOString();
                    const timeEnd = moment().endOf(optionValue).toISOString();
                    if (moment(record[dataIndex]).isAfter(timeStart) && moment(record[dataIndex]).isBefore(timeEnd)) {
                        return record;
                    }
                }
            }
            return null;
        }
        ,
    });

    const columnsEmployee: ProColumns<GEN.AdminGoOnBuss>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'indexBorder',
        },
        {
            title: "Chức danh",
            key: 'chucDanh',
            dataIndex: 'chucDanh',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.chucDanh}</>
                );
            },
            ...getColumnSearchProps('chucDanh')
        },
        {
            title: "Đơn vị công tác",
            key: 'coQuanQuyetDinh',
            dataIndex: 'coQuanQuyetDinh',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.donViCongTacName}</>
                );
            },
        },

        {
            title: "Ngày bắt đầu",
            key: 'batDau',
            dataIndex: 'batDau',
            render: (_, entity) => {
                return (
                    <>{displayTime(entity.batDau)}</>
                );
            },
            ...getColumnSearchRange('batDau')
        },
        {
            title: "Ngày kết thúc",
            key: 'ketThuc',
            dataIndex: 'ketThuc',
            render: (_, entity) => {
                ;
                return (
                    <>{displayTime(entity.ketThuc)}</>
                );
            },
            ...getColumnSearchRange('ketThuc')
        },


        {
            title: <FormattedMessage id="page.table.createAt" defaultMessage="Create At" />,
            dataIndex: 'create_at',
            // valueType: 'textarea',
            key: 'create_at',
            renderText: (_, text) => displayTime(text.create_at),
            ...getColumnSearchRange('create_at')
        },

        {
            title: "Trạng thái",
            dataIndex: 'xacNhan',
            // valueType: 'textarea',
            key: 'xacNhan',
            render: (_, text) => mapXacNhan(text.xacNhan),
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
                                options={XAC_NHAN}
                                fieldProps={{
                                    onChange: (value: any) => {
                                        setSearchPheDuyet(value)
                                    },
                                    value: searchPheDuyet
                                }}
                                showSearch
                                placeholder={'Chọn trạng thái'}
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
                                setSearchPheDuyet(null);
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
                        color: searchPheDuyet ? '#1890ff' : undefined,
                    }}
                />
            ),
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
                                        batDau: handleTime(getRecordCurrent.data?.batDau),
                                        ketThuc: handleTime(getRecordCurrent.data?.ketThuc),
                                    })
                                }

                            }}
                            icon={<MdOutlineEdit />}
                        />
                    </Tooltip>)
            }
        }
    ];

    const columnsAdmin: ProColumns<GEN.AdminGoOnBuss>[] = [
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
            ...getColumnSearchProps('xepLoaiChuyenMon')
        },
        {
            title: "Chức danh",
            key: 'chucDanh',
            dataIndex: 'chucDanh',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.chucDanh}</>
                );
            },
            ...getColumnSearchProps('chucDanh')
        },

        {
            title: "Đơn vị công tác",
            key: 'coQuanQuyetDinh',
            dataIndex: 'coQuanQuyetDinh',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.donViCongTacName}</>
                );
            },
            // ...getColumnSearchProps('coQuanQuyetDinh')
        },


        {
            title: "Ngày bắt đầu",
            key: 'batDau',
            dataIndex: 'batDau',
            render: (_, entity) => {
                return (
                    <>{displayTime(entity.batDau)}</>
                );
            },
            ...getColumnSearchRange('batDau')
        },
        {
            title: "Ngày kết thúc",
            key: 'ketThuc',
            dataIndex: 'ketThuc',
            render: (_, entity) => {
                ;
                return (
                    <>{displayTime(entity.ketThuc)}</>
                );
            },
            ...getColumnSearchRange('ketThuc')
        },


        {
            title: <FormattedMessage id="page.table.createAt" defaultMessage="Create At" />,
            dataIndex: 'create_at',
            // valueType: 'textarea',
            key: 'create_at',
            renderText: (_, text) => displayTime(text?.create_at),
            ...getColumnSearchRange('create_at')
        },

        {
            title: "Trạng thái",
            dataIndex: 'xacNhan',
            // valueType: 'textarea',
            key: 'xacNhan',
            render: (_, text) => mapXacNhan(text.xacNhan),
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
                                options={XAC_NHAN}
                                fieldProps={{
                                    onChange: (value: any) => {
                                        setSearchPheDuyet(value)
                                    },
                                    value: searchPheDuyet
                                }}
                                showSearch
                                placeholder={'Chọn trạng thái'}
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
                                setSearchPheDuyet(null);
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
                        color: searchPheDuyet ? '#1890ff' : undefined,
                    }}
                />
            ),
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
                                        batDau: handleTime(getRecordCurrent.data?.batDau),
                                        ketThuc: handleTime(getRecordCurrent.data?.ketThuc),
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
        return await handleUpdate2(value, refIdCurrent.current, `${collection}`, true);
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

                toolbar={{
                    filter: (
                        <LightFilter>
                            <ProFormSelect name="startdate" label="Sắp xếp" tooltip="Sắp xếp" allowClear={false} options={[
                                {
                                    label: 'Ngày tạo',
                                    value: 'createAt'
                                },
                                {
                                    label: 'Ngày cập nhật',
                                    value: 'updateAt'
                                }
                            ]}
                                fieldProps={{
                                    value: sort
                                }}
                                onChange={(e) => {
                                    setSort(e);
                                    actionRef?.current?.reload();
                                }}
                            />
                        </LightFilter>
                    )
                }}

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


                tableAlertRender={({ selectedRowKeys }: any) => {
                    return renderTableAlert(selectedRowKeys);
                }}

                tableAlertOptionRender={({ selectedRows, selectedRowKeys }: any) => {
                    return renderTableAlertOption(selectedRows, selectedRowKeys, actionRef, collection)
                }}
            />

            <AddGOB actionRef={actionRef} handleOpen={handleModalOpen} open={createModalOpen} type={type} collection={collection} />
            <ModalApproval openApproval={openApproval} actionRef={actionRef} selectedRow={selectedRow} setOpenApproval={setOpenApproval} subDirectory='/qua-trinh-cong-tac/phe-duyet' fieldApproval='pheDuyet' />


            <ModalForm
                title={<>Cập nhật quá trình công tác {refIdCurrent && <Tag color="green">CBVC: {refName.current} - CMND/CCCD: {refSoCMND.current}</Tag>}</>}
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
                        <ProFormSelect name="donViCongTacId" key="donViCongTac" label="Đơn vị công tác" request={() => getOption(`${SERVER_URL_CONFIG}/coquan-tochuc-donvi?page=0&size=100`, 'id', 'name')} />
                    </Col>
                    <Col span={12} >
                        <ProFormText name="chucDanh" key="chucDanh" label="Chức danh" placeholder={"Chức danh"} />
                    </Col>
                </Row>
                <Row gutter={24} >
                    <Col span={12} >
                        <ProFormDatePicker
                            name="batDau"
                            label={"Ngày bắt đầu"}
                            placeholder={"Ngày bắt đầu"}
                            rules={[
                                { required: true, message: "Ngày bắt đầu" }
                            ]}
                            fieldProps={{
                                style: {
                                    width: "100%"
                                },
                                disabledDate: current => disableDateStartAndDateEnd('ketThuc', form, 'start', current)
                            }}
                        />
                    </Col>
                    <Col span={12} >
                        <ProFormDatePicker
                            name="ketThuc"
                            label={"Ngày kết thúc"}
                            placeholder={"Ngày kết thúc"}
                            rules={[
                                { required: true, message: "Ngày kết thúc" }
                            ]}
                            fieldProps={{
                                style: {
                                    width: "100%"
                                },
                                disabledDate: current => disableDateStartAndDateEnd('batDau', form, 'end', current)
                            }}
                        />
                    </Col>

                </Row>

            </ModalForm>

        </PageContainer>
    );
};

export default TableList;
