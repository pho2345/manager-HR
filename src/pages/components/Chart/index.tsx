import React, { useState, useEffect, useRef } from 'react';
import { Line } from '@ant-design/plots';
import { ActionType, ModalForm, ProColumns, ProTable } from '@ant-design/pro-components';
import { customAPIGet, customAPIGetFileSlotChart, customAPIPost } from '@/services/ant-design-pro/api';
import moment from 'moment';
import { Button } from 'antd';
import configText from '@/locales/configText';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
const configDefaultText = configText;

const DemoLine = (props: any) => {
    const [data, setData] = useState([]);
    const [slots, setSlots] = useState([]);

    const [showDetail, setShowDetail] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();


    const asyncFetch = async () => {
        const getSlot = await customAPIPost({}, 'c-passes/chart', {
            "cPassId": 17,
            "types": "c-pass"
        });
        setData(getSlot?.data?.chart);
        setSlots(getSlot?.data?.slots);
    };

    useEffect(() => {
        asyncFetch();
    }, []);


    const config = {
        data: data,
        xField: 'indexSlot',
        yField: 'value',
        seriesField: 'name',
        yAxis: {
            label: {
                formatter: (v: any) => `${v} kg`,
            },
        },
        legend: {
            position: 'top',
        },
        smooth: true,
        animation: {
            appear: {
                animation: 'path-in',
                duration: 0,
            },
        },
        color: ['black', 'green', 'red', 'blue'],
        tooltip: {
            showCrosshairs: true,
            shared: true,
            customContent: (x: any, data: any) => {
                // const content = [];

                //   content.push(`<div class="tooltip-title">${moment().format('DD/MM/YYYY')}</div>`);
                //   data.forEach((item: any) => {
                //     content.push(
                //       `<div class="tooltip-item">
                //          <span class="tooltip-item-marker" style="background-color: blue;"></span>
                //          <span class="tooltip-item-name">${item.name}: </span>
                //          <span class="tooltip-item-value">${item.value}</span>
                //        </div>`
                //     );
                //   });
                return `<div class="custom-tooltip">Thực tế: ${data[3]?.data?.value} kg @${moment(data[3]?.data?.timeEnd).format('DD/MM/YYYY')}</div>`;
            },
        },
    };

    const submitter = {
        render: (_, dom: any) => {
            return [
                <Button key="customSubmit" type="primary" onClick={() => {
                    setShowDetail(true)
                }}>
                    Xuất file Excel
                </Button>,
            ];
        },
    };

    const columns: ProColumns<any>[] = [

        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'index',
        },
        {
            title: configDefaultText['page.slot.columns.farm'],
            dataIndex: 'farm',
            valueType: 'textarea',
            key: 'farm',
            renderText: (_, text: any) => text?.farmName,
        },

        {
            title: configDefaultText['page.slot.columns.code'],
            dataIndex: 'codeCow',
            valueType: 'textarea',
            key: 'codeCow',
            renderText: (_, text: any) => text?.codeCow

        },
        {
            title: configDefaultText['page.slot.columns.codeCPass'],
            dataIndex: 'codeCPass',
            valueType: 'textarea',
            key: 'codeCPass',
            renderText: (_, text: any) => text?.codeCPass
        },

        {
            title: configDefaultText['page.slot.columns.timeStart'],
            dataIndex: 'timeStart',
            valueType: 'textarea',
            key: 'timeStart',
            renderText: (_, text: any) => moment(text?.timeStart).format('DD/MM/YYYY')
        },

        {
            title: configDefaultText['page.slot.columns.timeEnd'],
            dataIndex: 'timeEnd',
            valueType: 'textarea',
            key: 'timeEnd',
            renderText: (_, text: any) => moment(text?.timeEnd).format('DD/MM/YYYY')
        },

        {
            title: configDefaultText['page.slot.columns.preWeight'],
            dataIndex: 'preWeight',
            valueType: 'textarea',
            key: 'preWeight',
            renderText: (_, text: any) => text?.preWeight
        },

        {
            title: configDefaultText['page.slot.columns.currentWeight'],
            dataIndex: 'currentWeight',
            valueType: 'textarea',
            key: 'currentWeight',
            renderText: (_, text: any) => text?.currentWeight
        },

        // {
        //   title: <FormattedMessage id='pages.searchTable.column.activeSlot' defaultMessage='Trạng thái' />,
        //   dataIndex: 'activeSlot',
        //   valueType: 'textarea',
        //   key: 'activeSlot',
        //   renderText: (_, text: any) => {
        //     if (text?.attributes.activeSlot) {
        //       return 'true'
        //     }
        //     return 'false'
        //   }
        // },

        // {
        //     title: configDefaultText['titleOption'],
        //     dataIndex: 'atrributes',
        //     valueType: 'textarea',
        //     align: 'center',
        //     key: 'option',
        //     render: (_, entity: any) => {
        //         //let dateEnd = moment(entity?.attributes.timeEnd).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD');
        //         //let currentDate = moment().add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD');
        //         //if (dateEnd === currentDate) {

        //         return (<SettingOutlined
        //             onClick={() => {

        //                 // setCodeProvince(entity?.attributes?.code);
        //                 // setNameProvince(entity?.attributes?.name);
        //                 // setFullName(entity?.attributes?.fullname);
        //                 // setFsmCode(entity?.attributes?.fsmCode);
        //             }}
        //         />)
        //         //return null
        //     }
        // },
    ];

    return (<>
        <ModalForm
            open={props.openModal}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => {
                    props.onClose();
                },
            }}
            // onFinish={async () => {
            //     //   if (success) {
            //     //     handleModalOpen(false);
            //     //     form.resetFields();
            //     //     if (actionRef.current) {
            //     //       actionRef.current.reload();
            //     //     }
            //     //   }
            // }}
            submitter={submitter}
        >
            <Line  {...config}
            />
        </ModalForm>

        {
            showDetail && <ModalForm
                open={showDetail}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        setShowDetail(false)
                    },
                }}

                submitter={false}
            >

                <ProTable
                    actionRef={actionRef}
                    rowKey='id'
                    search={false}
                    pagination={{
                        locale: {
                            next_page: configDefaultText['nextPage'],
                            prev_page: configDefaultText['prePage'],
                        },
                        showTotal: (total, range) => {
                            return `${range[range.length - 1]} / Tổng số: ${total}`
                        }
                    }}


                    toolBarRender={() => [

                        <Button
                            type='primary'
                            key='dowloadTemplate'
                            onClick={async () => {
                                await customAPIGetFileSlotChart('', 'slots/getfile', 17);
                            }}
                        >
                            <PlusOutlined /> {configDefaultText['dowloadFile']}
                        </Button>,
                    ]}

                    // request={() => customAPIGet({}, '/c-passes/chart')}
                    dataSource={slots}
                    columns={columns}

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
                />
            </ModalForm>

        }
    </>)
};

export default DemoLine;
