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
import { disableDateStartAndDateEnd, displayTime, filterCreateAndUpdateAt, getColumnSearchProps, getColumnSearchRange, getOption, handleTime, handleUpdate2, renderTableAlert, renderTableAlertOption, searchPheDuyetProps } from '@/services/utils';
import { FormattedMessage } from '@umijs/max';
import { XAC_NHAN, createPaginationProps, mapXacNhan } from '@/services/utils/constant';
import AddArmy from '@/reuse/army/AddArmy';
import ModalApproval from '@/reuse/approval/ModalApproval';
const configDefaultText = configText;





const TableList: React.FC<GEN.ArmyTable> = ({type, collection}) => {
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
    const [selectedRow, setSelectedRow] = useState<[]>([]);
    const [openApproval, setOpenApproval] = useState<boolean>(false);

    const [showRangeToTimeStart, setShowRangeToTimeStart] = useState<boolean>(false);
    const [searchRangeFromTimeStart, setSearchRangeFromTimeStart] = useState<any>(null);
    const [searchRangeToTimeStart, setSearchRangeToTimeStart] = useState<any>(null);
    const [optionRangeSearchTimeStart, setOptionRangeSearchTimeStart] = useState<any>();

    const [showRangeToTimeEnd, setShowRangeToTimeEnd] = useState<boolean>(false);
    const [searchRangeFromTimeEnd, setSearchRangeFromTimeEnd] = useState<any>(null);
    const [searchRangeToTimeEnd, setSearchRangeToTimeEnd] = useState<any>(null);
    const [optionRangeSearchTimeEnd, setOptionRangeSearchTimeEnd] = useState<any>();

    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZE);



    // const handleSearch = (selectedKeys: any, confirm: any) => {
    //     confirm();

    // };
    // const handleReset = (clearFilters: any, confirm: any) => {
    //     clearFilters();
    //     confirm({
    //         closeDropdown: false,
    //     });
    // };
    // const getColumnSearchProps = (dataIndex: any) => ({
    //     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
    //         <div
    //             style={{
    //                 padding: 8,
    //             }}
    //             onKeyDown={(e) => e.stopPropagation()}
    //         >
    //             <Input
    //                 placeholder={`Tìm kiếm`}
    //                 value={selectedKeys[0]}
    //                 onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
    //                 onPressEnter={() => handleSearch(selectedKeys, confirm)}
    //                 style={{
    //                     marginBottom: 8,
    //                     display: 'block',
    //                 }}
    //             />
    //             <Space>
    //                 <Button
    //                     type="primary"
    //                     onClick={() => handleSearch(selectedKeys, confirm)}
    //                     icon={<SearchOutlined />}
    //                     size="small"
    //                     style={{
    //                         width: 90,
    //                     }}
    //                 >
    //                     Tìm
    //                 </Button>
    //                 <Button
    //                     onClick={() => clearFilters && handleReset(clearFilters, confirm)}
    //                     size="small"
    //                     style={{
    //                         width: 90,
    //                     }}
    //                 >
    //                     Làm mới
    //                 </Button>
    //             </Space>
    //         </div>
    //     ),
    //     filterIcon: (filtered: boolean) => (
    //         <SearchOutlined
    //             style={{
    //                 color: filtered ? '#1890ff' : undefined,
    //             }}
    //             onClick={() => {
    //             }}
    //         />
    //     ),
    //     onFilter: (value: any, record: any) => {
    //         if (record[dataIndex]) {
    //             return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
    //         }
    //         return null;
    //     }
    //     ,
    //     onFilterDropdownOpenChange: (visible: any) => {
    //         if (visible) {
    //         }
    //     },
    // });

    // const handleSearchRange = (selectedKeys: any, confirm: any) => {
    //     confirm();
    // };

    // const clearResetRange = (clearFilters: any, confirm: any) => {
    //     clearFilters();
    //     setSearchRangeFrom(null);
    //     setSearchRangeTo(null);
    //     setOptionRangeSearch(null);
    //     confirm({
    //         closeDropdown: false,
    //     });
    // };


    // const getColumnSearchRange = (dataIndex: string) => ({
    //     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters,
    //         //close
    //     }: any) => (
    //         <div
    //             style={{
    //                 padding: 8,
    //             }}
    //             onKeyDown={(e) => e.stopPropagation()}
    //         >
    //             {
    //                 showRangeTo && (<>
    //                     <Row gutter={24} className="m-0">
    //                         <Col span={24} className="gutter-row p-0" >
    //                             <ProFormDatePicker
    //                                 fieldProps={{
    //                                     style: {
    //                                         width: '100%'
    //                                     },
    //                                     onChange: (e: any) => {
    //                                         if (e) {
    //                                             setSearchRangeFrom(moment(e['$d']).toISOString());
    //                                         }
    //                                     },
    //                                     value: searchRangeFrom
    //                                 }}
    //                                 placeholder={'Thời gian từ'}
    //                             />
    //                         </Col>
    //                     </Row>
    //                     <Row gutter={24} className="m-0">
    //                         <Col span={24} className="gutter-row p-0" >
    //                             <ProFormDatePicker
    //                                 fieldProps={{
    //                                     style: {
    //                                         width: '100%'
    //                                     },
    //                                     value: searchRangeTo,
    //                                     onChange: (e: any) => {
    //                                         if (e) {
    //                                             setSearchRangeTo(moment(e['$d']).toISOString());
    //                                         }
    //                                     },
    //                                 }}
    //                                 rules={[
    //                                     { required: true, message: configDefaultText['page.listFair.required.timeEnd'] },
    //                                 ]}
    //                                 placeholder={'Thời gian đến'}

    //                             />
    //                         </Col>
    //                     </Row>
    //                 </>
    //                 )
    //             }
    //             <Row gutter={24} className="m-0">
    //                 <Col span={24} className="gutter-row p-0" >
    //                     <ProFormSelect

    //                         options={[
    //                             {
    //                                 value: 'days',
    //                                 label: 'Trong ngày'
    //                             },
    //                             {
    //                                 value: 'weeks',
    //                                 label: 'Trong tuần'
    //                             },
    //                             {
    //                                 value: 'months',
    //                                 label: 'Trong tháng'
    //                             },
    //                             {
    //                                 value: 'years',
    //                                 label: 'Trong năm'
    //                             },
    //                             {
    //                                 value: 'range',
    //                                 label: 'Khoảng'
    //                             }
    //                         ]}
    //                         fieldProps={{
    //                             onChange: (value: any) => {
    //                                 if (value === 'range') {
    //                                     setShowRangeTo(true);
    //                                 }
    //                                 else {
    //                                     setShowRangeTo(false);
    //                                 }
    //                                 setOptionRangeSearch(value);
    //                             },
    //                             value: optionRangeSearch
    //                         }}
    //                     />
    //                 </Col>
    //             </Row>
    //             <Space>
    //                 <Button
    //                     type="primary"
    //                     onClick={() => {
    //                         if (optionRangeSearch !== 'range') {
    //                             setSelectedKeys([JSON.stringify([optionRangeSearch])])
    //                         }
    //                         else {
    //                             setSelectedKeys([JSON.stringify([optionRangeSearch, searchRangeFrom, searchRangeTo])])
    //                         }
    //                         handleSearchRange(selectedKeys, confirm);
    //                         // confirm()\

    //                     }}
    //                     icon={<SearchOutlined />}
    //                     size="small"
    //                     style={{
    //                         width: 90,
    //                     }}
    //                 >
    //                     Tìm kiếm
    //                 </Button>
    //                 <Button
    //                     onClick={() => clearFilters && clearResetRange(clearFilters, confirm)}
    //                     size="small"
    //                     style={{
    //                         width: 90,
    //                     }}
    //                 >
    //                     Làm mới
    //                 </Button>

    //             </Space>
    //         </div>
    //     ),
    //     filterIcon: (filtered: boolean) => (
    //         <SearchOutlined
    //             style={{
    //                 color: filtered ? '#1890ff' : undefined,
    //             }}
    //         />
    //     ),
    //     onFilter: (value: any, record: any) => {
    //         if (typeof value === 'string') {
    //             const convertValue = JSON.parse(value);
    //             const optionValue = convertValue[0];
    //             if (optionValue === 'range') {
    //                 if (convertValue[1] && convertValue[2]) {
    //                     if (moment(record[dataIndex]).isAfter(convertValue[1]) && moment(record[dataIndex]).isBefore(convertValue[2])) {
    //                         return record
    //                     }
    //                 }
    //             }
    //             else {
    //                 const timeStart = moment().startOf(optionValue).toISOString();
    //                 const timeEnd = moment().endOf(optionValue).toISOString();
    //                 if (moment(record[dataIndex]).isAfter(timeStart) && moment(record[dataIndex]).isBefore(timeEnd)) {
    //                     return record;
    //                 }
    //             }
    //         }
    //         return null;
    //     }
    //     ,
    // });


    const columnsAdmin: ProColumns<GEN.AdminArmy>[] = [
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
            ...getColumnSearchProps('soCCCD')
        },

        {
            title: "Chứng chỉ",
            key: 'chungChiDuocCap',
            dataIndex: 'chungChiDuocCap',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.chungChiDuocCap}</>
                );
            },
        },

        {
            title: "Đơn vị đào tạo",
            key: 'tenCoSoDaoTao',
            dataIndex: 'tenCoSoDaoTao',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.tenCoSoDaoTaoName}</>
                );
            },
            // ...getColumnSearchProps('coQuanQuyetDinh')
        },

       


        {
            title: "Ngày cấp",
            key: 'batDau',
            dataIndex: 'batDau',
            render: (_, entity) => {
                return (
                    <> {displayTime(entity.batDau)}</>
                );
            },
            ...getColumnSearchRange('batDau', showRangeToTimeStart, setShowRangeToTimeStart, searchRangeFromTimeStart, setSearchRangeFromTimeStart, searchRangeToTimeStart, setSearchRangeToTimeStart, optionRangeSearchTimeStart, setOptionRangeSearchTimeStart)

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
            ...getColumnSearchRange('ketThuc', showRangeToTimeEnd, setShowRangeToTimeEnd, searchRangeFromTimeEnd, setSearchRangeFromTimeEnd, searchRangeToTimeEnd, setSearchRangeToTimeEnd, optionRangeSearchTimeEnd, setOptionRangeSearchTimeEnd)

        },

        {
            title: <FormattedMessage id="page.table.createAt" defaultMessage="Create At" />,
            dataIndex: 'create_at',
            // valueType: 'textarea',
            key: 'create_at',
            renderText: (_, text) => displayTime(text.create_at),
            ...getColumnSearchRange('create_at', showRangeTo, setShowRangeTo, searchRangeFrom, setSearchRangeFrom, searchRangeTo, setSearchRangeTo, optionRangeSearch, setOptionRangeSearch)

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
            ...searchPheDuyetProps(searchPheDuyet, setSearchPheDuyet, actionRef)
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
                                        tenCoSoDaoTao: getRecordCurrent.data.tenCoSoDaoTaoId,
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

    const columnsEmployee: ProColumns<GEN.AdminArmy>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'indexBorder',
        },

        {
            title: "Chứng chỉ",
            key: 'chungChiDuocCap',
            dataIndex: 'chungChiDuocCap',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.chungChiDuocCap}</>
                );
            },
        },

        {
            title: "Đơn vị đào tạo",
            key: 'tenCoSoDaoTao',
            dataIndex: 'tenCoSoDaoTao',
            render: (_, entity) => {
                ;
                return (
                    <> {entity?.tenCoSoDaoTaoName}</>
                );
            },
            // ...getColumnSearchProps('coQuanQuyetDinh')
        },

       


        {
            title: "Ngày cấp",
            key: 'batDau',
            dataIndex: 'batDau',
            render: (_, entity) => {
                return (
                    <> {displayTime(entity.batDau)}</>
                );
            },
            ...getColumnSearchRange('batDau', showRangeToTimeStart, setShowRangeToTimeStart, searchRangeFromTimeStart, setSearchRangeFromTimeStart, searchRangeToTimeStart, setSearchRangeToTimeStart, optionRangeSearchTimeStart, setOptionRangeSearchTimeStart)
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
            ...getColumnSearchRange('ketThuc', showRangeToTimeEnd, setShowRangeToTimeEnd, searchRangeFromTimeEnd, setSearchRangeFromTimeEnd, searchRangeToTimeEnd, setSearchRangeToTimeEnd, optionRangeSearchTimeEnd, setOptionRangeSearchTimeEnd)
        },

        {
            title: <FormattedMessage id="page.table.createAt" defaultMessage="Create At" />,
            dataIndex: 'create_at',
            // valueType: 'textarea',
            key: 'create_at',
            renderText: (_, text) => displayTime(text.create_at),
            ...getColumnSearchRange('create_at', showRangeTo, setShowRangeTo, searchRangeFrom, setSearchRangeFrom, searchRangeTo, setSearchRangeTo, optionRangeSearch, setOptionRangeSearch)
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
            ...searchPheDuyetProps(searchPheDuyet, setSearchPheDuyet, actionRef)
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
                                        tenCoSoDaoTao: getRecordCurrent.data.tenCoSoDaoTaoId,
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

                request={async () => {
                    let f: any = {};
                    if (searchPheDuyet) {
                        f = {
                            ...f,
                            pheDuyet: searchPheDuyet
                        }
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
                columns={type === 'ADMIN' ? columnsAdmin : columnsEmployee}
                rowSelection={{
                    onChange: (selectedRowKeys: any, _) => {
                        const id = selectedRowKeys.map((e: any) => ({ id: e }));
                        setSelectedRow(id);
                    },
                }}

                toolbar={filterCreateAndUpdateAt(sort, setSort, actionRef)}


                tableAlertRender={({ selectedRowKeys }: any) => {
                    return renderTableAlert(selectedRowKeys);
                }}

                tableAlertOptionRender={({ selectedRows, selectedRowKeys }: any) => {
                    return renderTableAlertOption(selectedRows, selectedRowKeys, actionRef, collection)
                }}
            />


            <AddArmy actionRef={actionRef} open={createModalOpen} handleOpen={handleModalOpen}  type={type} collection={collection} />
            <ModalApproval openApproval={openApproval} actionRef={actionRef} selectedRow={selectedRow} setOpenApproval={setOpenApproval} subDirectory='/kien-thuc-an-ninh-quoc-phong/phe-duyet' fieldApproval='pheDuyet' />


            <ModalForm
                title={<>Cập nhật kiến thức an ninh quốc phòng {refIdCurrent && type === 'ADMIN' && <Tag color="green">CBVC: {refName.current} - CMND/CCCD: {refSoCMND.current}</Tag>}</>}
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
                <Row gutter={24}>
                    <Col span={12} >
                        <ProFormText name="chungChiDuocCap" key="chungChiDuocCap" label="Chứng chỉ" placeholder={'Chứng chỉ'} />
                    </Col>
                    <Col span={12} >
                        <ProFormSelect name="tenCoSoDaoTao" key="tenCoSoDaoTao" label="Cơ sở đào tạo" request={() => getOption(`${SERVER_URL_CONFIG}/coquan-tochuc-donvi?page=0&size=100`, 'id', 'name')} />
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
