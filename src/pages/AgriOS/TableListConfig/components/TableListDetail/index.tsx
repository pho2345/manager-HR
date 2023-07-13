import { customAPIGet, customAPIUpdate, customAPIUpdateMany } from '@/services/ant-design-pro/api';
import { ReloadOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormDigit } from '@ant-design/pro-components';
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

const formatter = (value: any) => {
    if (value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return '';
};

const parser = (value: any) => {
    if (value) {
        return value.replace(/\$\s?|(,*)/g, '');
    }
    return undefined;
};

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


const handleUpdateTabOne = async (fields: any, id: any, api: any) => {
    try {
        await customAPIUpdateMany({
            ...fields
        }, api, id);

        return true;
    } catch (error) {
        console.log(error);
        message.error('Cập nhật thất bại!');
        return false;
    }
};


const TableList: React.FC = () => {

    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const refIdEWallet = useRef<any>();
    const [rowCurrent, setRowCurrent] = useState<any>();


    const [form] = Form.useForm<any>();

    const columns: ProColumns<API.RuleListItem>[] = [
        {
            title: configDefaultText['page.config.columns.mail'],
            key: 'code',
            dataIndex: 'atrributes',
            render: (_, entity: any) => {
                return (
                    <>
                        {entity?.emailPlaform}
                    </>
                );
            },

        },
        {
            title: configDefaultText['page.config.columns.limitAlegerSellAle'],
            dataIndex: 'limitAlegerSellAle',
            valueType: 'textarea',
            key: 'limitAlegerSellAle',
            renderText: (_, text: any) => text?.limitAlegerSellAle.toLocaleString() || 0
        },

        {
            title: 'Thao tác',
            dataIndex: 'atrributes',
            valueType: 'textarea',
            key: 'option',
            align: 'center',
            render: (_, entity: any) => {
                return (<Tooltip
                    title={'Cập nhật'}
                >
                    <Button
                        onClick={() => {
                            handleUpdateModalOpen(true);
                            setRowCurrent(entity?.id);
                            form.setFieldsValue({
                                ...entity
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
                    const data = await customAPIGet({}, 'config-plaform');
                    console.log('data', data.data);
                    return {
                        data: [data.data],
                        success: true,
                        total: 1
                    };
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
                title='Cập nhật'
                open={updateModalOpen}
                form={form}

                autoFocusFirstInput
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        handleUpdateModalOpen(false);
                    },
                }}

                submitTimeout={2000}
                onFinish={async (values: any) => {
                    const hide = message.loading('Đang cập nhật...');
                    const updateEmail = handleUpdateTabOne({
                        data: {
                            emailPlaform: values?.emailPlaform
                        }
                    }, null, 'config-plaform');

                    const updateMega = handleUpdateTabOne({
                        data: {
                            limitAlegerSellAle: values?.limitAlegerSellAle
                        }
                    }, 1, 'config-default-megas');

                    const update = await Promise.all([updateEmail, updateMega]);
                    if (update.length === 2) {
                        message.success('Cập nhật thành công');
                        hide();
                        handleUpdateModalOpen(false);
                        actionRef.current?.reload();
                    }
                    return true;
                }}

                submitter={{
                    // render: (_, dom) => (
                    //   <div style={{ marginBlockStart: '5vh' }}>
                    //     {dom.pop()}
                    //     {dom.shift()}
                    //   </div>
                    // ),
                    searchConfig: {
                        // resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
                        // submitText: <FormattedMessage id='buttonUpdate' defaultMessage='Cập nhật' />,
                        resetText: configDefaultText['buttonClose'],
                        submitText: configDefaultText['buttonUpdate'],
                    },
                }}
            >







                <Row gutter={24} className="m-0">
                    <Col span={12} className="gutter-row p-0" >
                        <ProFormText
                            className='w-full'
                            name='emailPlaform'
                            label={configDefaultText['page.config.required.mail']}
                            placeholder={configDefaultText['page.config.required.mail']}
                            rules={[
                                //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                                { required: true, message: configDefaultText['page.config.required.mail'] },
                            ]}
                        />
                    </Col>

                    <Col span={12} className="gutter-row p-0" >
                        <ProFormDigit
                            min={1}
                            className='w-full'
                            name='limitAlegerSellAle'
                            label={configDefaultText['page.configMega.modal.limitAlegerSellAle']}
                            placeholder={configDefaultText['page.configMega.modal.limitAlegerSellAle']}
                            rules={[
                                //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                                { required: true, message: configDefaultText['page.configMega.modal.limitAlegerSellAle'] },
                            ]}

                            fieldProps={{
                                formatter,
                                parser,
                            }}
                        />
                    </Col>

                </Row>

            </ModalForm>

        </>
    );
};

export default TableList;
