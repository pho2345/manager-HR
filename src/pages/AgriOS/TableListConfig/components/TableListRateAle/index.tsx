import { customAPIGet, customAPIUpdate } from '@/services/ant-design-pro/api';
import { ReloadOutlined } from '@ant-design/icons';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import {
    ModalForm,
    ProFormText,

    ProTable,
} from '@ant-design/pro-components';

import { Button, Col, Form, message, Row, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import configText from '@/locales/configText';
const configDefaultText = configText;


const handleUpdate = async (fields: any, id: any) => {
    const hide = message.loading('Đang cập nhật...');

    try {
        await customAPIUpdate({
            ...fields
        }, 'conversionrates', id.current);
        hide();

        message.success('Cập nhật thành công');
        return true;
    } catch (error: any) {
        hide();
        message.error(error?.response?.data?.error?.message);
        return false;
    }
};



const TableList: React.FC = () => {

    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const refIdEWallet = useRef<any>();
    const [form] = Form.useForm<any>();

    const columns: ProColumns<any>[] = [
        {
            title: configDefaultText['page.rateAle.colums.rateAle'],
            key: 'rateAle',
            dataIndex: 'rateAle',
            render: (_, entity: any) => {
                return (
                    <>{entity.rateAle.toLocaleString() || 0}</>
                );
            },
        },
        {
            title: configDefaultText['page.rateAle.colums.rateProduceAleToAle'],
            dataIndex: 'rateProduceAleToAle',
            valueType: 'textarea',
            key: 'rateProduceAleToAle',
            renderText: (_, text: any) => `1:${text?.rateProduceAleToAle}`,

        },

        {
            title: configDefaultText['page.rateAle.colums.ratePromo'],
            dataIndex: 'nameBank',
            valueType: 'textarea',
            key: 'nameBank',
            renderText: (_, text: any) => `1:${text?.ratePromo}`,
        },
        {
            title: configDefaultText['titleOption'],
            dataIndex: 'atrributes',
            valueType: 'textarea',
            key: 'option',
            align: 'center',
            render: (_, entity: any) => {
                return (<Tooltip
                    title={configDefaultText['buttonUpdate']}
                    style={{
                        textAlign: 'center'
                    }}
                >

                    <Button
                        onClick={() => {
                            handleUpdateModalOpen(true);
                            refIdEWallet.current = entity.id;
                            form.setFieldsValue({
                                ...entity,
                            })
                        }}

                        style={{
                            border: 'none'
                        }}

                        icon={
                            <MdOutlineEdit />
                        }
                    />
                </Tooltip>
                )
            }
        },

    ];







    return (
        <>
            <ProTable
                actionRef={actionRef}
                rowKey='id'
                search={false}
                request={async () => {
                    const data: any = await customAPIGet({}, 'conversionrates');
                    return {
                        data: [
                            {
                                ...data?.data
                            }
                        ],
                        success: true,
                        total: 1
                    }
                }}
                columns={columns}
                rowSelection={false}

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

            <ModalForm
                form={form}
                title='Cập nhật'
                width={`35vh`}
                open={updateModalOpen}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        handleUpdateModalOpen(false);
                    },
                }}
                onFinish={async (value) => {
                    const success = await handleUpdate(value as any, refIdEWallet);
                    if (success) {
                        handleUpdateModalOpen(false);
                        form.resetFields();
                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                }}
            >
                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0">
                        <ProFormText
                            rules={[
                                {
                                    required: true,
                                    message: configDefaultText['page.rateAle.colums.rateAle'],
                                },
                            ]}
                            width='md'
                            label={configDefaultText['page.rateAle.colums.rateAle']}
                            name='rateAle'
                            placeholder={configDefaultText['page.rateAle.colums.rateAle']}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0">
                        <ProFormText
                            rules={[
                                {
                                    required: true,
                                    message: configDefaultText['page.rateAle.colums.rateProduceAleToAle'],
                                },
                            ]}
                            width='md'
                            label={configDefaultText['page.rateAle.colums.rateProduceAleToAle']}
                            name='rateProduceAleToAle'
                            placeholder={configDefaultText['page.rateAle.colums.rateProduceAleToAle']}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0">
                        <ProFormText
                            rules={[
                                {
                                    required: true,
                                    message: configDefaultText['page.rateAle.colums.ratePromo'],
                                },
                            ]}
                            width='md'
                            label={configDefaultText['page.rateAle.colums.ratePromo']}
                            name='ratePromo'
                            placeholder={configDefaultText['page.rateAle.colums.ratePromo']}
                        />
                    </Col>
                </Row>


                {/* <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0">
                        <ProFormSelect
                            label={configDefaultText['page.bankPlaform.chosenBank']}
                            options={bank}
                            rules={[
                                {
                                    required: true,
                                    message: configDefaultText['page.bankPlaform.chosenBank']
                                },
                            ]}
                            width='md'
                            name='bank'
                            placeholder={configDefaultText['page.bankPlaform.chosenBank']}
                        />

                    </Col>
                </Row> */}
            </ModalForm>
        </>
    );
};

export default TableList;
