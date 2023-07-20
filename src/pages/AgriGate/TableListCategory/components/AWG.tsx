import { customAPIGet, customAPIDelete, customAPIGetOne } from '@/services/ant-design-pro/api';
import { ReloadOutlined } from '@ant-design/icons';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import {
    ModalForm,
    ProTable,
} from '@ant-design/pro-components';

import { message } from 'antd';
import React, {  useEffect, useRef, useState } from 'react';
import moment from 'moment';

import configText from '@/locales/configText';
const configDefaultText = configText;

// const handleAdd = async (fields: API.RuleListItem) => {
//     const hide = message.loading('Đang thêm...');
//     try {
//         await customAPIAdd({ ...fields }, 'categories');
//         hide();
//         message.success('Thêm thành công');
//         return true;
//     } catch (error: any) {
//         hide();
//         message.error(error?.response?.data?.error?.message);
//         return false;
//     }
// };


// // const handleUpdate = async (fields: any, id: any) => {
// //     const hide = message.loading('Đang cập nhật...');
// //     try {
// //         await customAPIUpdate({
// //             ...fields
// //         }, 'categories', id.current);
// //         hide();

// //         message.success('Cập nhật thành công');
// //         return true;
// //     } catch (error: any) {
// //         hide();
// //         message.error(error?.response?.data?.error?.message);
// //         return false;
// //     }
// // };


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


const getP0 = async () => {
    try {
      const data = await customAPIGet( {}, 'range-weight-zeros/option');
      return data.data;
    } catch (error) {
  
    }
  }

const WGS = (props: any) => {
    // const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    // const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    // const refIdCateogry = useRef<any>();
    // const [form] = Form.useForm<any>();
    const [rangeP0, setRangeP0] = useState<any>([]);
    // const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
    // const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
    // const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
    // const [optionRangeSearch, setOptionRangeSearch] = useState<any>();

    useEffect(() => {
        const getData = async () => {
            const getOptionP0 = await getP0();
            setRangeP0(getOptionP0);
        };

        getData();
    }, []);


    // const confirm = (entity: any) => {
    //     Modal.confirm({
    //         title: configDefaultText['titleConfirm'],
    //         icon: <ExclamationCircleOutlined />,
    //         content: configDefaultText['textConfirmDelete'],
    //         okText: 'Có',
    //         cancelText: 'Không',
    //         onOk: async () => {
    //             await handleRemove(entity);
    //             if (actionRef.current) {
    //                 actionRef.current?.reloadAndRest?.();
    //             }
    //         }
    //     });
    // };

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
    //         if (record.attributes[dataIndex]) {
    //             return record.attributes[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
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


    // const getColumnSearchRange = () => ({
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
    //                     if (moment(record.attributes.createdAt).isAfter(convertValue[1]) && moment(record.attributes.createdAt).isBefore(convertValue[2])) {
    //                         return record
    //                     }
    //                 }
    //             }
    //             else {
    //                 const timeStart = moment().startOf(optionValue).toISOString();
    //                 const timeEnd = moment().endOf(optionValue).toISOString();
    //                 if (moment(record.attributes.createdAt).isAfter(timeStart) && moment(record.attributes.createdAt).isBefore(timeEnd)) {
    //                     return record;
    //                 }
    //             }
    //         }
    //         return null;
    //     }
    //     ,
    // });


    const columns: ProColumns[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'index',
        },
        {
            title: 'Phân loại',
            key: 'name',
            dataIndex: 'name',
            render: (_, entity: any) => {
                return (
                    <> {entity?.name}</>
                );
            },
            width: '30vh',
            filters: [
                {
                    text: 'Tốt',
                    value: 'good'
                },
                {
                    text: 'Bình thường',
                    value: 'normal'
                },
                {
                    text: 'Kém',
                    value: 'bad'
                },
                {
                    text: 'Rất kém',
                    value: 'worst'
                },
            ],
            onFilter: (value, record) => {
                if(value === record.value){
                    return record
                }
            },
        },
        {
            title: 'Khoảng giá trị',
            dataIndex: 'textRange',
            valueType: 'textarea',
            key: 'textRange',
            renderText: (_, text: any) => text?.textRange,
            align: 'center'
        },
        {
            title: 'Khoảng cân nặng P0',
            dataIndex: 'rangeWeightZero',
            valueType: 'textarea',
            key: 'rangeWeightZero',
            width: '20vh',
            renderText: (_, text: any) =>  text?.rangeWeightZero,
            filters: rangeP0,
            onFilter:(value, record) => {
                if(value === record.rangeWeightZeroId){
                    return record;
                }
            },
        },
    ];

    return (
        <ModalForm
            title={`Giống: ${props.nameCategory}`}
            width={window.innerWidth * 0.9}
            submitter={false}
            open={props.openModal}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => {
                    props.onCloseModal();
                },
            }}

        >
            <ProTable
                scroll={{
                    x: window.innerWidth * 0.6
                }}
                headerTitle={`Tăng trọng trung bình`}
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
                request={ async () => {
                    const data = await customAPIGetOne(props.categoryId, 'categories/get-awg');
                    return {
                        data: data,
                        success: true,
                        total: data.length || 0
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
                rowSelection={false}

                // tableAlertRender={({ selectedRowKeys }: any) => {
                //     return renderTableAlert(selectedRowKeys);
                // }}

                // tableAlertOptionRender={({ selectedRows }: any) => {
                //     return renderTableAlertOption(selectedRows)
                // }}
            />

        </ModalForm>
    );
};

export default WGS;
