import {
    customAPIGetOne,
} from '@/services/ant-design-pro/api';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
    ActionType,
    ProColumns,
    ProFormDatePicker,
    ProFormSelect,
    ProTable,

} from '@ant-design/pro-components';
import {
    Image, UploadFile, UploadProps
} from 'antd';

import configText from '@/locales/configText';
const configDefaultText = configText;


import {
    useParams
} from '@umijs/max';
import { Avatar, Button, Col, Drawer, Form, Input, Modal, Row, Space, Tooltip, message } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { MdOutlineEdit } from 'react-icons/md';

export const TableUse = () => {
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const refIdCow = useRef<any>();
    const [currentRow, setCurrentRow] = useState<any>();
    const [form] = Form.useForm<any>();
    const [category, setCategory] = useState<any>();
    const [farm, setFarm] = useState<any>();
    const searchInput = useRef(null);
    const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
    const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
    const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
    const [optionRangeSearch, setOptionRangeSearch] = useState<any>();

    const handleSearch = (selectedKeys: any, confirm: any) => {
        confirm();
    };
    const handleReset = (clearFilters: any, confirm: any) => {
        clearFilters();
        confirm({
            closeDropdown: false,
        });
    };

    const handleSearchRange = (selectedKeys: any, confirm: any) => {
        confirm();
    };


    const getColumnSearchProps = (dataIndex: any) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }: any) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={configDefaultText['search']}
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
                        Tìm kiếm
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
            />
        ),
        onFilter: (value: any, record: any) => {
            return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
        }
        ,
        onFilterDropdownOpenChange: (visible: any) => {
            if (visible) {
            }
        },
    });




    const getColumnSearchRange = (dataIndex: any) => ({
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
                                onChange: (value) => {
                                    if (value === 'range') {
                                        setShowRangeTo(true);
                                    }
                                    else {
                                        setShowRangeTo(false);
                                    }
                                    setOptionRangeSearch(value);
                                },
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
                if (optionValue === 'days') {
                    const timeStart = moment().startOf(optionValue).toISOString();
                    const timeEnd = moment().endOf(optionValue).toISOString();
                    const convert = moment(record[dataIndex]).add(1, 'minutes').toISOString();
                    const checkStart = moment(convert).isAfter(timeStart);
                    const checkEnd = moment(convert).isBefore(timeEnd);

                    if (checkEnd && checkStart) {
                        return record
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



    const clearResetRange = (clearFilters: any, confirm: any) => {
        clearFilters();
        setSearchRangeFrom(null);
        setSearchRangeTo(null);
        confirm({
            closeDropdown: false,
        });
    };





    const columns: ProColumns<any>[] = [
        {
            title: configDefaultText['page.listCow.column.code'],
            key: 'code',
            dataIndex: 'atrributes',
            ...getColumnSearchProps('code'),
            render: (_, entity: any) => {
                return (
                    <>{entity?.code}</>
                );
            },
        },

        {
            title: configDefaultText['page.listCow.column.name'],
            dataIndex: 'atrributes',
            valueType: 'textarea',
            key: 'name',
            ...getColumnSearchProps('name'),
            renderText: (_, text: any) => text?.name,

        },


        {
            title: configDefaultText['page.listCow.column.photos'],
            dataIndex: 'atrributes',
            valueType: 'textarea',
            key: 'photos',
            render: (_, text: any) => {
                return (
                    <Avatar.Group
                        maxCount={2}
                        maxPopoverTrigger='click'
                        size='large'
                        maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' }}
                    >

                        {text?.photos && text?.photos?.length !== 0 ? text?.photos?.map((e: any, index: any) => {
                            return (
                                <Avatar
                                    key={index}
                                    src={
                                        SERVERURL +
                                        e?.url
                                    }
                                />
                            );
                        }) : (<Avatar
                            key={'defaultImage'}
                            src={
                                'https://aleger-server.process.vn/uploads/cow_Icon2_e7fd247cac.png'
                            }
                        />)
                        }

                    </Avatar.Group>
                );
            },
        },

        {
            title: configDefaultText['page.listCow.column.sex'],
            dataIndex: 'sex',
            valueType: 'textarea',
            width: '10vh',
            key: 'sex',
            renderText: (_, text: any) => {
                if (text?.sex === 'male') {
                    return 'Đực';
                }
                return 'Cái';
            },
            filters: [
                {
                    text: 'Đực',
                    value: 'male'
                },
                {
                    text: 'Cái',
                    value: 'female'
                },
            ],
            onFilter: true
        },

        {
            title: configDefaultText['page.listCow.column.category'],
            dataIndex: 'category',
            valueType: 'textarea',
            key: 'category',
            renderText: (_, text: any) => text?.category?.name,
            filters: category,
            onFilter: (value, record) => {
                return record.category.id === value;

            }
        },
        {
            title: configDefaultText['page.listCow.column.age'],
            dataIndex: 'atrributes',
            valueType: 'textarea',
            key: 'age',
            renderText: (_, text: any) => {
                let age = Math.floor(moment(moment()).diff(text?.birthdate, 'days') / 7);
                if (age === 0) {
                    return `0`;
                }
                let confiAge = `${age / 4 >= 1 ? `${Math.floor(age / 4)}Th` : ''} ${age % 4 !== 0 ? (age % 4) + 'T' : ''}`;
                return confiAge;
            }
        },

        {
            title: configDefaultText['page.listCow.column.birthdate'],
            dataIndex: 'atrributes',
            valueType: 'textarea',
            key: 'birthdate',
            renderText: (_, text: any) => {
                return moment(text?.birthdate).format('DD/MM/YYYY');
            },
            ...getColumnSearchRange('birthdate')
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
                                refIdCow.current = entity.id;
                                const cow = await customAPIGetOne(entity.id, 'cows/find', {});
                                const photos = cow.photos;
                                if (photos) {
                                    const photoCow = photos.map((e: any) => {
                                        return { uid: e.id, status: 'done', url: SERVERURL + e.url };
                                    });
                                    // setFileList(photoCow);

                                    form.setFieldsValue({
                                        ...cow,
                                        category: cow.category?.id,
                                        farm: cow.farm?.id,
                                        upload: photoCow,
                                        group_cow: {
                                            label: cow?.group_cow?.name,
                                            value: cow?.group_cow?.id
                                        }

                                    })
                                }
                                else {
                                    form.setFieldsValue({
                                        ...cow,
                                        category: cow.category?.id,
                                        farm: cow.farm?.id,
                                        group_cow: {
                                            label: cow?.group_cow?.name,
                                            value: cow?.group_cow?.id
                                        }
                                    })
                                }
                            }}

                            icon={
                                <MdOutlineEdit />
                            }
                        />
                    </Tooltip>
                );
            },
        },

    ];


    return (<>

        <ProTable
            scroll={{
                x: window.innerHeight * 0.75
            }}
            actionRef={actionRef}
            rowKey='id'
            search={false}
            toolBarRender={() => {
                return [
                    <Button
                        type='primary'
                        key='primary'
                        onClick={() => {
                            // setVisible(true);
                        }}
                    >
                        <PlusOutlined /> {configDefaultText['buttonAdd']}
                    </Button>,
                ]
            }}

            toolbar={{
                settings: [{
                    key: 'reload',
                    tooltip: configDefaultText['reload'],
                    icon: <ReloadOutlined></ReloadOutlined>,
                    onClick: () => {
                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                }]
            }}

            pagination={{
                pageSize: 10,
                locale: {
                    next_page: configDefaultText['nextPage'],
                    prev_page: configDefaultText['prePage'],
                },
                showTotal: (total, range) => {
                    return `${range[range.length - 1]} / Tổng số: ${total}`
                }
            }}

            // request={() => customAPIGet({}, 'cows/find',)}
            columns={columns}
            rowSelection={{
                // onChange: (_, selectedRows: any) => {
                //   setSelectedRows(selectedRows);
                // },
            }}

            tableAlertRender={({ selectedRowKeys }: any) => {
                // return renderTableAlert(selectedRowKeys);
            }}


            tableAlertOptionRender={({ selectedRows }: any) => {
                // return renderTableAlertOption(selectedRows)
            }}

        />


    </>)
}