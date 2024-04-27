import { deletes, get, getCustome, patch, post, post2 } from '@/services/ant-design-pro/api';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, LightFilter, ProCard, ProColumns, ProForm, ProFormDatePicker, ProFormDigit, ProFormList, ProFormSelect } from '@ant-design/pro-components';
import {
    ModalForm,
    PageContainer,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';

import { Button, Col, Form, Input, Row, Space, Tag, Tooltip, message } from 'antd';
import React, { useRef, useState } from 'react';
import moment from 'moment';
import { MdOutlineEdit } from 'react-icons/md';

import configText from '@/locales/configText';
import { disableDateStartAndDateEnd, displayTime, formatter, getOption, getOptionCBVC, handleTime, handleUpdate2, parser, renderTableAlert, renderTableAlertOption } from '@/services/utils';
import { FormattedMessage } from '@umijs/max';
import { XAC_NHAN, mapXacNhan } from '@/services/utils/constant';
import ModalApproval from '@/reuse/approval/ModalApproval';
import AddAllowance from '@/reuse/allowance/AddAllowance';
const configDefaultText = configText;





const TableList: React.FC = () => {
    const collection = `${SERVER_URL_CONFIG}/phu-cap-khac`;
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
    const [searchPheDuyet, setSearchPheDuyet] = useState<GEN.XACNHAN | null>(null);
    const [sort, setSort] = useState<GEN.SORT>('createAt');
    const [page, setPage] = useState<number>(0);
    const [selectedRow, setSelectedRow] = useState<[]>([]);
    const [openApproval, setOpenApproval] = useState<boolean>(false);




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


    const columns: ProColumns<GEN.AdminAllowance>[] = [
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
                    <>{entity?.soCCCD}</>
                );
            },
        },

        {
            title: "loaiPhuCapName",
            key: 'loaiPhuCapName',
            dataIndex: 'loaiPhuCapName',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.loaiPhuCapName}</>
                );
            },
        },

        {
            title: "Phần trăm hưởng phụ cấp",
            key: 'phanTramHuongPhuCap',
            dataIndex: 'phanTramHuongPhuCap',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.phanTramHuongPhuCap}</>
                );
            },
        },

        {
            title: "Hệ số phụ cấp",
            key: 'heSoPhuCap',
            dataIndex: 'heSoPhuCap',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.heSoPhuCap}</>
                );
            },
        },

        {
            title: "Giá trị",
            key: 'giaTri',
            dataIndex: 'giaTri',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.giaTri}</>
                );
            },
        },

        {
            title: "Hình thức hưởng",
            key: 'hinhThucHuong',
            dataIndex: 'hinhThucHuong',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.hinhThucHuong}</>
                );
            },
        },


        {
            title: "Ngày cấp",
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
            title: "Ngày hết hạn",
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
            title: "Trạng thái",
            key: 'xacNhan',
            dataIndex: 'xacNhan',
            render: (_, entity) => {
                ;
                return (
                    <> {mapXacNhan(entity.xacNhan)}</>
                );
            },
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
            title: <FormattedMessage id="page.table.createAt" defaultMessage="Create At" />,
            dataIndex: 'create_at',
            // valueType: 'textarea',
            key: 'create_at',
            renderText: (_, text) => text?.create_at ? moment(text?.create_at).format(FORMAT_DATE) : '',
            ...getColumnSearchRange('create_at')
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
                                        hoSoId: getRecordCurrent.data.hoSoId,
                                        hinhThucThuong: getRecordCurrent.data.hinhThucHuong,
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
        return await handleUpdate2(value, refIdCurrent.current, collection, true);
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
                    selectedRow.length > 0 && (<Button
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
                        f.pheDuyet = searchPheDuyet;
                    }
                    const getData = await get(`${collection}`, {
                        ...f,
                        sort: sort,
                        page: page
                    })
                    return {
                        data: getData.data
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
                    onChange: (selectedRowKeys: any, _) => {
                        const id = selectedRowKeys.map((e: any) => ({ id: e }));
                        setSelectedRow(id);
                    },
                }}

                toolbar={{
                    filter: (
                        <LightFilter>
                            <ProFormSelect name="startdate" label="Sắp xếp" allowClear={false} options={[
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


                tableAlertRender={({ selectedRowKeys }: any) => {
                    return renderTableAlert(selectedRowKeys);
                }}

                tableAlertOptionRender={({ selectedRows, selectedRowKeys }: any) => {
                    return renderTableAlertOption(selectedRows, selectedRowKeys, actionRef, collection)
                }}
            />


            <AddAllowance actionRef={actionRef} open={createModalOpen} handleOpen={handleModalOpen} />
            <ModalApproval openApproval={openApproval} actionRef={actionRef} selectedRow={selectedRow} setOpenApproval={setOpenApproval} subDirectory='/phu-cap-khac/phe-duyet' fieldApproval='xacNhan' />


            <ModalForm
                title={<>Cập nhật phụ cấp khác {refIdCurrent && <Tag color="green">CBVC: {refName.current} - CMND/CCCD: {refSoCMND.current}</Tag>}</>}
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
                        <ProFormText name="hinhThucThuong" key="hinhThucThuong" label="Hình thức thưởng" placeholder={"Hình thức thưởng"} />
                    </Col>
                    <Col span={12} >
                        <ProFormSelect name="loaiPhuCapId" key="loaiPhuCapId" label="Loại phụ cấp" request={() => getOption(`${SERVER_URL_CONFIG}/loai-phu-cap?page=0&size=100`, 'id', 'name')} />
                    </Col>
                </Row>

                <Row gutter={24} >
                    <Col span={12} >
                        <ProFormDigit name="giaTri" key="giaTri" label="Giá trị" placeholder={"Giá trị"} fieldProps={{
                            min: 0,
                            formatter,
                            parser,

                        }} />
                    </Col>
                    <Col span={12} >
                        <ProFormDigit name="heSoPhuCap" key="heSoPhuCap" label="Hệ số phụ cấp" placeholder={"Hệ số phụ cấp"} fieldProps={{
                            min: 0,
                            formatter,
                            parser,
                        }} />
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

                <Row gutter={24} >
                    <Col span={12} >
                        <ProFormDigit name="phanTramHuongPhuCap" key="phanTramHuongPhuCap" label="Phần trăm hưởng (%)" placeholder={"Phần trăm hưởng (%)"} fieldProps={{
                            min: 0,
                            max: 100
                        }} />

                    </Col>

                    {/* <Col span={12} >
                        <ProFormSelect
                            disabled
                            label={"CBVC"}
                            // width='md'
                            name='hoSoId'
                            placeholder={`CBVC`}
                            rules={[
                                {
                                    required: true,

                                },
                            ]}
                            showSearch
                            request={getOptionCBVC}
                        />
                    </Col> */}
                </Row>
            </ModalForm>

        </PageContainer>
    );
};

export default TableList;
