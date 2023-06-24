
import { customAPIGet, customAPIGetOne } from '@/services/ant-design-pro/api';
import React, { useEffect, useRef, useState } from 'react';
import configText from '@/locales/configText';
import { ActionType, ModalForm, ProColumns, ProTable } from '@ant-design/pro-components';
import { ReloadOutlined } from '@ant-design/icons';

const configDefaultText = configText;

const getCategory = async () => {
    const categories = await customAPIGet({}, 'categories/get/option');
    return categories.data;
};

const getAWG = async () => {
    const data = await customAPIGet({}, 'average-weight-gains/get/option',
    );
    return data.data
}

const getRangePZero = async () => {
    const data = await customAPIGet({}, 'range-weight-zeros/option',
    );
    return data.data
}



const TableList = (props: any) => {

    const [category, setCategory] = useState<any>([]);
    const [rangePZero, setRangePZero] = useState<any>([]);
    const [awg, setAwg] = useState<any>([]);
    const actionRef = useRef<ActionType>();


    useEffect(() => {
        const getData = async () => {
            const getOptionCategory = getCategory();
            const getOptionAWG = getAWG();
            const getOptionRangePZero = getRangePZero();
            
            const getAllData = await Promise.all([getOptionCategory, getOptionAWG, getOptionRangePZero]);
            console.log(getAllData);
            setCategory(getAllData[0]);
            setAwg(getAllData[1]);
            setRangePZero(getAllData[2]);
        }
        getData();
    }, [])


    const columnCPass: ProColumns<any>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'index',
        },

        {
            // title: <FormattedMessage id='pages.searchTable.column.ageAndSlot' defaultMessage={<>Tuổi/Snow</>} />,
            title: configDefaultText['page.detailFair.mega.agw.category'],
            dataIndex: 'nameCategory',
            valueType: 'textarea',
            key: 'nameCategory',
            filters: category,
            renderText: (_, record: any) => {
                return record.nameCategory;
            },
            onFilter: (value, record) => {
                if (value === record.categoryId) {
                    return record;
                }
                return null;
            },
        },


        {
            // title: <FormattedMessage id='pages.searchTable.column.megaE' defaultMessage={<>MegaE (VNĐ)</>} />,
            title: configDefaultText['page.detailFair.mega.agw.agw'],
            dataIndex: 'agw',
            valueType: 'textarea',
            key: 'agw',
            renderText: (_, record: any) => record?.nameAwg,
            filters: awg || [],
            onFilter: (value, record) => {
                if (value === record.valueAwg) {
                    return record;
                }
                return null
            },
        },

        {
            // title: <FormattedMessage id='pages.searchTable.column.megaE' defaultMessage={<>MegaE (VNĐ)</>} />,
            title: configDefaultText['page.detailFair.mega.agw.rangAwg'],
            dataIndex: 'profit',
            valueType: 'textarea',
            key: 'profit',
            renderText: (_, record: any) => record?.textRangeAwg
        },

        {
            // title: <FormattedMessage id='pages.searchTable.column.megaE' defaultMessage={<>MegaE (VNĐ)</>} />,
            title: configDefaultText['page.detailFair.mega.agw.rangePZero'],
            dataIndex: 'profit',
            valueType: 'textarea',
            key: 'profit',
            renderText: (_, record: any) => record?.textRangePZero,
            filters: rangePZero,
            onFilter: (value, record) => {
                if (value === record.rangePZeroId) {
                    return record;
                }
                return null
            },
        },

    ];


    return (
        <>
            <ModalForm
                open={props.openModal}
                autoFocusFirstInput
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        props.onCloseModal();
                    },
                }}
                submitTimeout={2000}
                submitter={false}
                width='100vh'
            >

                <ProTable
                    headerTitle={<>
                    </>}
                    actionRef={actionRef}
                    rowKey='id'
                    search={false}
                    rowClassName={
                        (entity) => {
                            return entity.classColor
                        }
                    }

                    request={async () => {
                        //console.log('usersss', data);
                        const getPlan = await customAPIGetOne(props.id, 'fairs/awg', {});
                        return {
                            data: getPlan,
                            success: true,
                            total: 0
                        }
                    }}


                    toolbar={{
                        settings: [{
                            key: 'reload',
                            tooltip: 'Tải lại',
                            icon: <ReloadOutlined />,
                            onClick: () => {
                                if (actionRef.current) {
                                    actionRef.current.reload();
                                }
                            }
                        }]
                    }}
                    columns={columnCPass}
                    //   rowSelection={{
                    //     onChange: (_, selectedRows: any) => {
                    //     //   setSelectedRowsCPass(selectedRows);
                    //     },
                    //   }}



                    pagination={{
                        locale: {
                            next_page: configDefaultText['nextPage'],
                            prev_page: configDefaultText['prePage'],
                        },
                        showTotal: (total, range) => {
                            return `${range[range.length - 1]} / Tổng số: ${total}`
                        }
                    }}


                />
            </ModalForm>
        </>
    );
};

export default TableList;
