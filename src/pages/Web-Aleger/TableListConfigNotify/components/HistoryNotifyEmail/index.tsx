import { customAPIGet, customAPIUpdate } from '@/services/ant-design-pro/api';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormTextArea } from '@ant-design/pro-components';
import {
    ModalForm,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';
import moment from 'moment';
import { FormattedMessage } from '@umijs/max';
import { Button, Col, Form, Input, InputRef, message, Row, Space, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { MdRemoveRedEye } from 'react-icons/md';
import configText from '@/locales/configText';
const configDefaultText = configText;

const handleUpdate = async (fields: any, id: any) => {
    const hide = message.loading('Đang cập nhật...');
    try {
        await customAPIUpdate({
            ...fields
        }, 'notification-email-templates', id);
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

function removeHTMLTagsAndConvertVietnamese(text: string) {
    // Loại bỏ các thẻ HTML
    let regex = /(<([^>]+)>)/ig;
    let cleanedText = text.replace(regex, "");
  
    // Chuyển đổi các nội dung tiếng Việt
    cleanedText = cleanedText.replace(/&agrave;/g, "à");
    cleanedText = cleanedText.replace(/&agrave;/g, "ả");
    // Thêm các ký tự tiếng Việt khác vào đây
  
    return cleanedText;
  }



const TableList: React.FC = () => {
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const [rowCurrent, setRowCurrent] = useState<any>();
    const actionRef = useRef<ActionType>();
    const [form] = Form.useForm<any>();
    const searchInput = useRef<InputRef>(null);

    useEffect(() => {
        if (searchInput.current) {
            searchInput.current.focus();
        }
    }, []);

    const handleSearch = (selectedKeys: any, confirm: any) => {
        confirm();
        //setSearchText(selectedKeys[0]);
        //setSearchedColumn(dataIndex);
        //console.log('selectedKeys',selectedKeys[0] );
    };
    const handleReset = (clearFilters: any, confirm: any) => {
        clearFilters();
        // setSearchText('');
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
                const lowercaseValue = value.toLowerCase();
                const { fullname, id, username } = record.user;

                if (fullname.toString().toLowerCase().includes(lowercaseValue) ||
                    id.toString().toLowerCase().includes(lowercaseValue) ||
                    username.toString().toLowerCase().includes(lowercaseValue)) {
                    return record;
                }
            }
            return null;
        },
        onFilterDropdownOpenChange: (visible: any) => {
            if (visible) {
                //setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        // render: (text: any) =>{

        // }

    });


    const columns: ProColumns<API.RuleListItem>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'index',
            width: '3vh'
        },
        {
            // title: <FormattedMessage id='pages.configMega.limitPlaformReceivSettlement' defaultMessage='Số cPass Mega tối đa PL nhận thanh quyết toán trong 1 tuần' />,
            title: configDefaultText['page.historyNotifyEmail.columns.code'],
            dataIndex: 'code',
            valueType: 'textarea',
            key: 'code',
            width: '10vh',
            renderText: (_, text: any) => {
                return `${text?.code}`
            },
            ...getColumnSearchProps('code')
        },
        {
            // title: <FormattedMessage id='pages.configMega.cPassPLSellMega' defaultMessage='Số cPass Mega tối đa PL bán cho 1 Mega trong 1 tuần' />,
            title: configDefaultText['page.historyNotifyEmail.columns.title'],
            dataIndex: 'types',
            valueType: 'textarea',
            key: 'types',
            renderText: (_, text: any) => {
                return `${text?.title || ''}`
            },
            ...getColumnSearchProps('aleger')

        },
        {
            // title: <FormattedMessage id='pages.configMega.cPassPLSellMega' defaultMessage='Số cPass Mega tối đa PL bán cho 1 Mega trong 1 tuần' />,
            title: configDefaultText['page.historyNotifyEmail.columns.aleger'],
            dataIndex: 'aleger',
            valueType: 'textarea',
            key: 'aleger',
            renderText: (_, text: any) => {
                if(text?.user){
                    return `${text?.user?.fullname ? text?.user?.fullname : text?.user?.username } - ${text?.user?.id}`
                }
                return ''
            }
        },

        {
            // title: <FormattedMessage id='pages.configMega.cPassPLSellMega' defaultMessage='Số cPass Mega tối đa PL bán cho 1 Mega trong 1 tuần' />,
            title: configDefaultText['page.historyNotifyEmail.columns.createdAt'],
            dataIndex: 'createdAt',
            valueType: 'textarea',
            key: 'createdAt',
            renderText: (_, text: any) => {
                return `${moment(text.createdAt).format('HH:mm DD/MM/YYYY')}`
            }
        },

        {
            title: <FormattedMessage id='pages.option' defaultMessage='Thao tác' />,
            dataIndex: 'atrributes',
            valueType: 'textarea',
            key: 'option',
            align: 'center',
            render: (_, entity: any) => {
                return (<Tooltip
                    title={<FormattedMessage id='buttonUpdate' defaultMessage='Xem' />}
                ><MdRemoveRedEye
                        onClick={() => {
                            handleUpdateModalOpen(true);
                            setRowCurrent(entity?.id);
                            form.setFieldsValue({
                                ...entity,
                                content: removeHTMLTagsAndConvertVietnamese(entity?.content || ''),
                                aleger: `${entity?.user?.fullname ? entity?.user?.fullname : entity?.user?.username} - ${entity?.user?.id}`,
                                createdAt: `${moment(entity.createdAt).format('HH:mm DD/MM/YYYY')}`
                            })
                        }}
                    /></Tooltip>

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
                request={() => customAPIGet({}, 'notify-emails')}
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

                title='Xem chi tiết'
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

                submitter={false}
            >


                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0" >
                        <ProFormText
                            className='w-full'
                            name='title'
                            disabled
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
                        <ProFormText
                            className='w-full'
                            disabled
                            name='title'
                            label={configDefaultText['page.historyNotifyEmail.modal.aleger']}
                            placeholder={configDefaultText['page.historyNotifyEmail.modal.aleger']}
                            rules={[
                                //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                                { required: true, message: configDefaultText['page.historyNotifyEmail.modal.aleger'] },
                            ]}
                        />
                    </Col>
                </Row>
                

                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0" >
                        <ProFormTextArea
                            className='w-full'
                            disabled
                            name='content'
                            fieldProps={{
                                maxLength: 500
                              }}
                            label={configDefaultText['page.notifyEmail.columns.content']}
                            placeholder={configDefaultText['page.notifyEmail.columns.content']}
                            rules={[
                                //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                                { required: true, message: configDefaultText['page.notifyEmail.columns.content'] },
                            ]}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0" >
                        <ProFormText
                            className='w-full'
                            disabled
                            name='createdAt'
                            fieldProps={{
                                maxLength: 500
                              }}
                            label={configDefaultText['page.historyNotifyEmail.modal.createdAt']}
                            placeholder={configDefaultText['page.historyNotifyEmail.modal.createdAt']}
                            rules={[
                                //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                                { required: true, message: configDefaultText['page.historyNotifyEmail.modal.createdAt'] },
                            ]}
                        />
                    </Col>
                </Row>
            </ModalForm>

        </>
    );
};

export default TableList;
