import { customAPIGet, customAPIUpdate } from '@/services/ant-design-pro/api';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import {
    ModalForm,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage } from '@umijs/max';
import { Button, Col, Form, Input, InputRef, message, Row, Space, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import configText from '@/locales/configText';
import moment from 'moment';
const configDefaultText = configText;

const handleUpdate = async (fields: any, id: any) => {
    const hide = message.loading('Đang cập nhật...');
    try {
        await customAPIUpdate({
            ...fields
        }, 'feedbacks', id);
        hide();

        message.success('Cập nhật thành công');
        return true;
    } catch (error) {
        console.log(error);
        hide();
        message.error('Cập nhật thất bại!');
        return false;
    }
};



const TableList: React.FC = () => {
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const [rowCurrent, setRowCurrent] = useState<any>();
    const actionRef = useRef<ActionType>();
    const [form] = Form.useForm<any>();
    const searchInput = useRef<InputRef>(null);
    const [content, setContent] = useState<any>();

    const Content = (text: string) => {
        return <div dangerouslySetInnerHTML={{ __html: text }} />;
    };

    useEffect(() => {
        if (searchInput.current) {
            searchInput.current.focus();
        }
    }, []);

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
                    ref={searchInput}
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
                    if (searchInput.current) {
                        searchInput.current.focus();
                    }
                }}
            />
        ),
        onFilter: (value: any, record: any) => {
            if (record[dataIndex]) {
                return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
            }
            if (dataIndex === 'aleger') {
                if (record['user'].fullname.toString().toLowerCase().includes(value.toLowerCase())) {
                    return record
                }
                if (record['user'].username.toString().toLowerCase().includes(value.toLowerCase())) {
                    return record
                }
                if (record['user'].id.toString().toLowerCase().includes(value.toLowerCase())) {
                    return record
                }
            }
            return null;
        },
        onFilterDropdownOpenChange: (visible: any) => {
            if (visible) {
            }
        },
    });


    const columns: ProColumns<API.RuleListItem>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'index',
            width: '3vh'
        },
        {
            // title: <FormattedMessage id='pages.configMega.cPassPLSellMega' defaultMessage='Số cPass Mega tối đa PL bán cho 1 Mega trong 1 tuần' />,
            title: configDefaultText['page.feedback.aleger'],
            dataIndex: 'aleger',
            valueType: 'textarea',
            key: 'aleger',
            renderText: (_, text: any) => {
                if (text?.user) {
                    return `${text?.user?.fullname ?? text?.user?.username} - ${text?.user.id}`
                }
            },
            ...getColumnSearchProps('aleger')

        },

        {
            title: configDefaultText['page.feedback.title'],
            dataIndex: 'title',
            valueType: 'textarea',
            key: 'title',
            renderText: (_, text: any) => {
                return `${text?.title}`
            },
            ...getColumnSearchProps('title')
        },

      

        {
            title: configDefaultText['page.feedback.status'],
            dataIndex: 'status',
            valueType: 'textarea',
            key: 'status',
            render: (_, text: any) => {
                switch (text?.status) {
                    case 'Open':
                        return (<span
                            style={{
                                color: '#a8a29e'
                            }}
                        >Chưa xem</span>)
                        break;
                    case 'Inprogress':
                        return (<span
                            style={{
                                color: '#38bdf8'
                            }}
                        >Đang xử lí...</span>)
                        break;
                    case 'Done':
                        return (<span
                            style={{
                                color: '#4ade80'
                            }}
                        >Đã xử lí</span>)
                        break;
                    default:
                        break;
                }
                return `${text?.status || ''}`
            },
            filters: [
                {
                    value: 'Open',
                    text: 'Chưa xem'
                },
                {
                    value: 'Inprogress',
                    text: 'Đang xử lí'
                },
                {
                    value: 'Done',
                    text: 'Đã xử lí'
                }
            ],
            onFilter: (value, record: any) => {
                if (value === record.status) {
                    return record;
                }
                return null;
            },
        },

        {
            title: configDefaultText['page.feedback.createdAt'],
            dataIndex: 'createdAt',
            valueType: 'textarea',
            key: 'createdAt',
            renderText: (_, text: any) => {
                return `${moment(text?.createdAt).format('HH:mm:ss DD/MM/YYYY')}`
            },
        },

        {
            title: <FormattedMessage id='pages.option' defaultMessage='Thao tác' />,
            dataIndex: 'atrributes',
            valueType: 'textarea',
            key: 'option',
            align: 'center',
            render: (_, entity: any) => {
                return (<Tooltip
                    title={<FormattedMessage id='buttonUpdate' defaultMessage='Cập nhật' />}
                >
                    <Button
                        onClick={() => {
                            handleUpdateModalOpen(true);
                            setRowCurrent(entity?.id);
                            form.setFieldsValue({
                                ...entity,
                                status: entity?.status
                            });
                            setContent(entity?.content);
                        }}
                        icon={
                            <MdOutlineEdit />
                        }
                        style={{
                            border: 'none'
                        }}
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
                request={() => customAPIGet({}, 'feedbacks')}
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
                    const update = await handleUpdate(values, rowCurrent);
                    if (update) {
                        handleUpdateModalOpen(false);
                        actionRef.current?.reloadAndRest?.();
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
                    <Col span={24} className="gutter-row p-0" >
                        <ProFormText
                            disabled
                            className='w-full'
                            name='title'
                            label={configDefaultText['page.notifyEmail.columns.title']}
                            placeholder={configDefaultText['page.notifyEmail.columns.title']}
                            rules={[
                                //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                                { required: true, message: configDefaultText['page.notifyEmail.columns.title'] },
                            ]}
                        />
                    </Col>
                </Row>



                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0" >
                        <ProFormSelect
                            className='w-full'
                            name='status'
                            fieldProps={{
                                maxLength: 500
                            }}
                            label={configDefaultText['page.feedback.columns.status']}
                            placeholder={configDefaultText['page.feedback.columns.status']}
                            rules={[
                                //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                                { required: true, message: configDefaultText['page.feedback.columns.status'] },
                            ]}
                            options={[
                                {
                                    value: 'Open',
                                    label: 'Chưa xem'
                                },

                                {
                                    value: 'Inprogress',
                                    label: 'Đang xử lí'
                                },

                                {
                                    value: 'Done',
                                    label: 'Đã xử lí'
                                }
                            ]}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0" >
                        Nội dung:
                        {Content(content)}
                    </Col>
                </Row>
            </ModalForm>

        </>
    );
};

export default TableList;
