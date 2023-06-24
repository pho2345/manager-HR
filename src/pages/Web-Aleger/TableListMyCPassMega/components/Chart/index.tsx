import React, { useState, useEffect, useRef } from 'react';
import { Line } from '@ant-design/plots';
import { ActionType, ModalForm, ProColumns, ProTable } from '@ant-design/pro-components';
import { customAPIGetFileSlotChart, customAPIPost } from '@/services/ant-design-pro/api';
import moment from 'moment';
import { Button } from 'antd';
import configText from '@/locales/configText';
import { ConsoleSqlOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
const configDefaultText = configText;

const DemoLine = (props: any) => {
    const [data, setData] = useState<any>([]);
    // const [slot, setSlot] = useState<any>([]);

    const [showDetail, setShowDetail] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();

    const asyncFetch = async () => {
        const getSlot = await customAPIPost({}, 'c-passes/mega/chart', {
            "cPassId": props.cPassId,
            "types": props.types
        });
        // console.log('getSlot', getSlot);
        setData(getSlot?.data?.chart);
        // setSlot(getSlot?.data?.slots);

        // setSlots(getSlot?.data?.slots);
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
        // interactions: [
        //     {
        //         type: 'tooltip',
        //         cfg: { start: [{ trigger: 'hover', action: 'tooltip:show' }] }
        //     }
        // ],
        tooltip: {
            showCrosshairs: true,
            shared: true,
            customItems: (originalItems: any) => {
                // process originalItems, 
                console.log(originalItems);
                const data = originalItems.map((e: any) => {
                    return {
                        ...e,
                        title: e?.data?.owner?.id ? `${e?.data?.owner?.fullname ? e?.data?.owner?.fullname : e?.data?.owner?.username} - ${e?.data?.owner?.id}` : `PLAFORM`,
                    }
                })
                return data;
            },
            customContent: (x: any, data: any) => {
                // console.log(slot);
               
                console.log(data);
               
                let display = `<div class="g2-tooltip-title" style="margin-bottom: 12px; margin-top: 12px;">${data[0]?.title}@S${x}- ${moment(data[0]?.data?.dateWeight).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY')} </div>
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
