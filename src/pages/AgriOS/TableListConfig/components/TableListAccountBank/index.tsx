import { customAPIGet, customAPIAdd, customAPIUpdate, customAPIDelete } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormSelect } from '@ant-design/pro-components';
import {
    ModalForm,
    ProFormText,

    ProTable,
} from '@ant-design/pro-components';

import { Button, Col, Form, Input, message, Modal, Row, Space, Tooltip } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import configText from '@/locales/configText';
const configDefaultText = configText;

const handleAdd = async (fields: API.RuleListItem) => {
    const hide = message.loading('Đang thêm...');
    console.log(fields);
    try {
        await customAPIAdd({ ...fields }, 'config-plaforms/add/account-bank');
        hide();
        message.success('Thêm thành công');
        return true;
    } catch (error: any) {
        hide();
        message.error(error?.response?.data?.error.message);
        return false;
    }
};


const handleUpdate = async (fields: any, id: any) => {
    const hide = message.loading('Đang cập nhật...');
    
    try {
        await customAPIUpdate({
            ...fields
        }, 'account-banks', id.current);
        hide();

        message.success('Cập nhật thành công');
        return true;
    } catch (error: any) {
        hide();
        message.error(error?.response?.data?.error?.message);
        return false;
    }
};


const handleRemove = async (selectedRows: any) => {
    const hide = message.loading('Đang xóa...');
    if (!selectedRows) return true;
    try {
        const deleteRowss = selectedRows.map((e: any) => {
            return customAPIDelete(e.id, 'account-banks')
        })

        await Promise.all(deleteRowss);
        hide();
        message.success('Xóa thành công');
        return true;
    } catch (error: any) {
        hide();
        message.error(error?.response.data.error.message);
        return false;
    }
};



const getBank = async () => {

    const banks = await customAPIGet({}, 'banks');
    let data = banks.data.map((e: any) => {
        return {
            value: e?.id,
            text: e?.attributes?.name,
            label: e?.attributes?.name,
        };
    });
    return data;

};


const confirm = (entity: any, message: string, actionRef: any) => {
    console.log(entity);
    Modal.confirm({
        title: configDefaultText['titleConfirm'],
        icon: <ExclamationCircleOutlined />,
        content: `Bạn có muốn ${message}?`,
        okText: 'Có',
        cancelText: 'Không',
        onOk: async () => {
            // await handleUpdateMany({
            //   cPass: [entity.id]
            // }, api, id);
            await handleRemove(entity);
            if (actionRef.current) {
                actionRef.current?.reloadAndRest?.();
            }
        }
    });
};

const TableList: React.FC = () => {

    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const refIdEWallet = useRef<any>();
    const [form] = Form.useForm<any>();
    const [bank, setBank] = useState<any>();


    useEffect(() => {
        const getValues = async () => {
            let getBanks = await getBank();
            setBank(getBanks);
        };
        getValues();
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
                }}
            />
        ),
        onFilter: (value: any, record: any) => {
            if (record.attributes[dataIndex]) {
                return record.attributes[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
            }
            return null;
        }
        ,
        onFilterDropdownOpenChange: (visible: any) => {
            if (visible) {
                //setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        // render: (text: any) =>{
        // }
    });

    const columns: ProColumns<any>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'index',
        },
        {
            title: configDefaultText['page.bankPlaform.owner'],
            key: 'owner',
            dataIndex: 'owner',
            render: (_, entity: any) => {
                return (
                    <>
                        {entity?.owner}</>
                );
            },
            ...getColumnSearchProps('code')
        },
        {
            title: configDefaultText['page.bankPlaform.stk'],
            dataIndex: 'stk',
            valueType: 'textarea',
            key: 'stk',
            renderText: (_, text: any) => text?.accountNumber,
            ...getColumnSearchProps('name')
        },

        {
            title: configDefaultText['page.bankPlaform.branch'],
            dataIndex: 'branch',
            valueType: 'textarea',
            key: 'branch',
            renderText: (_, text: any) => text?.branch,
            ...getColumnSearchProps('branch')
        },


        {
            title: configDefaultText['page.bankPlaform.nameBank'],
            dataIndex: 'nameBank',
            valueType: 'textarea',
            key: 'nameBank',
            renderText: (_, text: any) => text?.bank?.name
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
                         style={{
                            border: 'none'
                        }}

                        icon={
                            <MdOutlineEdit/>
                        }
                        onClick={() => {
                            handleUpdateModalOpen(true);
                            refIdEWallet.current = entity.id;
                            form.setFieldsValue({
                               ...entity,
                               bank: entity?.bank?.id
                            })
                        }}
                    /></Tooltip>
                )
            }
        },

    ];

    function renderTableAlert(selectedRowKeys: any) {
        return (
            <Fragment>
                Đã chọn <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> mục&nbsp;&nbsp;
            </Fragment>
        );
    }


    function renderTableAlertOption(selectedRows: any) {
        return (
            <>
                <Fragment>
                    <Button onClick={async () => {
                        await confirm(selectedRows as any, 'xóa', actionRef);
                    }}>Xóa</Button>
                </Fragment>
            </>
        );
    }



    return (
        <>
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
                ]}
                request={() => customAPIGet({}, 'account-banks/get/plaform')}
                columns={columns}
                rowSelection={{
                    // onChange: (_, selectedRows: any) => {
                    //   //setSelectedRows(selectedRows);
                    // },
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



                tableAlertRender={({ selectedRowKeys }: any) => {
                    return renderTableAlert(selectedRowKeys);
                }}


                tableAlertOptionRender={({ selectedRows }: any) => {
                    return renderTableAlertOption(selectedRows)
                }}

            />



            <ModalForm
                form={form}
                title='Tạo mới'
                width={`35vh`}
                open={createModalOpen}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        handleModalOpen(false);
                    },
                }}
                onFinish={async (value) => {
                    const success = await handleAdd(value as API.RuleListItem);
                    if (success) {
                        handleModalOpen(false);
                        form.resetFields();
                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                }}
            >

                {/* <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0">
                        <ProFormText
                            className='w-full'
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <FormattedMessage
                                            id='pages.searchTable.Code'
                                            defaultMessage='Yêu cầu nhập mã!'
                                        />
                                    ),
                                },
                            ]}
                            fieldProps={{
                                width: '100%'
                            }}
                            label='Mã'
                            width='md'
                            name='code'
                            placeholder='Mã'
                        />
                    </Col>
                </Row> */}


                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0">
                        <ProFormText
                            rules={[
                                {
                                    required: true,
                                    message: configDefaultText['page.bankPlaform.owner'],
                                },
                            ]}
                            width='md'
                            label={configDefaultText['page.bankPlaform.owner']}
                            name='owner'
                            placeholder={configDefaultText['page.bankPlaform.owner']}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0">
                        <ProFormText
                            rules={[
                                {
                                    required: true,
                                    message: configDefaultText['page.bankPlaform.stk'],
                                },
                            ]}
                            width='md'
                            label={configDefaultText['page.bankPlaform.stk']}
                            name='accountNumber'
                            placeholder={configDefaultText['page.bankPlaform.stk']}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0">
                        <ProFormText
                            label={configDefaultText['page.bankPlaform.branch']}
                            rules={[
                                {
                                    required: true,
                                    message: configDefaultText['page.bankPlaform.branch']
                                },
                            ]}
                            width='md'
                            name='branch'
                            placeholder={configDefaultText['page.bankPlaform.branch']}
                        />

                    </Col>
                </Row>


                <Row gutter={24} className="m-0">
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
                </Row>



            </ModalForm>


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
                                    message: configDefaultText['page.bankPlaform.owner'],
                                },
                            ]}
                            width='md'
                            label={configDefaultText['page.bankPlaform.owner']}
                            name='owner'
                            placeholder={configDefaultText['page.bankPlaform.owner']}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0">
                        <ProFormText
                            rules={[
                                {
                                    required: true,
                                    message: configDefaultText['page.bankPlaform.stk'],
                                },
                            ]}
                            width='md'
                            label={configDefaultText['page.bankPlaform.stk']}
                            name='accountNumber'
                            placeholder={configDefaultText['page.bankPlaform.stk']}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0">
                        <ProFormText
                            label={configDefaultText['page.bankPlaform.branch']}
                            rules={[
                                {
                                    required: true,
                                    message: configDefaultText['page.bankPlaform.branch']
                                },
                            ]}
                            width='md'
                            name='branch'
                            placeholder={configDefaultText['page.bankPlaform.branch']}
                        />

                    </Col>
                </Row>



                <Row gutter={24} className="m-0">
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
                </Row>
            </ModalForm>
        </>
    );
};

export default TableList;
