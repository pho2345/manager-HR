import React, { useState, useEffect, useRef } from 'react';
import { Line } from '@ant-design/plots';
import { ActionType, ModalForm, ProColumns, ProTable } from '@ant-design/pro-components';
import { customAPIGetFileSlotChart, customAPIPost } from '@/services/ant-design-pro/api';
import moment from 'moment';
import { Button, message } from 'antd';
import configText from '@/locales/configText';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
const configDefaultText = configText;

const DemoLine = (props: any) => {
    const [data, setData] = useState([]);
    const [slots, setSlots] = useState([]);

    const [showDetail, setShowDetail] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();


    const asyncFetch = async () => {
        try {
            const getSlot = await customAPIPost({}, 'c-passes/chart', {
                "cPassId": props.cPassId,
                "types": "c-pass"
            });
            setData(getSlot?.data?.chart);
            setSlots(getSlot?.data?.slots);
        } catch (error: any) {
            message.error(error?.response?.data?.error?.message);
        }
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
        // tooltip: {
        //     showCrosshairs: true,
        //     shared: true,
        //     customContent: (x: any, data: any) => {
        //         // const content = [];

        //         //   content.push(`<div class="tooltip-title">${moment().format('DD/MM/YYYY')}</div>`);
        //         //   data.forEach((item: any) => {
        //         //     content.push(
        //         //       `<div class="tooltip-item">
        //         //          <span class="tooltip-item-marker" style="background-color: blue;"></span>
        //         //          <span class="tooltip-item-name">${item.name}: </span>
        //         //          <span class="tooltip-item-value">${item.value}</span>
        //         //        </div>`
        //         //     );
        //         //   });

        //         return `<div class="custom-tooltip">Thực tế: ${data[3]?.data?.value} kg @${moment(data[3]?.data?.timeEnd).format('DD/MM/YYYY')}</div>`;
        //     },
        // },

        tooltip: {
            showCrosshairs: true,
            shared: true,
            customItems: (originalItems: any) => {
                // process originalItems, 
                // const data = originalItems.map((e: any) => {
                //     return {
                //         ...e,
                //         title: e?.data?.owner?.id ? `${e?.data?.owner?.fullname ? e?.data?.owner?.fullname : e?.data?.owner?.username} - ${e?.data?.owner?.id}` : `PLAFORM`
                //     }
                // })
                return originalItems;
            },
            customContent: (x: any, data: any) => {
                let display = `<div class="g2-tooltip-title" style="margin-bottom: 12px; margin-top: 12px;">${data[0]?.title}</div>
                <ul class="g2-tooltip-list" style="margin: 0px; list-style-type: none; padding: 0px;">`;
                for (let i = 0; i < data.length; i++) {
                    let e = data[i];
                    display += `<li class="g2-tooltip-list-item" data-index="" style="list-style-type: none; padding: 0px; margin: 12px 0px;">
                    <span class="g2-tooltip-marker" style="background: ${e?.color}; width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 8px;"></span>
                    <span class="g2-tooltip-name">${e?.name}</span>:
                    <span class="g2-tooltip-value" style="display: inline-block; float: right; margin-left: 30px;">${e?.value}</span>
                </li>`
                }
                return display;
            },
        },
    };

    const submitter = {
        render: () => {
            if (slots && slots.length !== 0) {
                return [
                    <Button key="customSubmit" type="primary" onClick={() => {
                        setShowDetail(true)
                    }}>
                        Xuất file Excel
                    </Button>,
                ];
            }

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
