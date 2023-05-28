import { customAPIGet, customAPIAdd, customAPIUpdate, customAPIDelete, customAPIGetOne } from '@/services/ant-design-pro/api';
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
// import ButtonCacel from '../../components/ButtonCancelChosen/indes';
import configText from '@/locales/configText';
const configDefaultText = configText;

const handleAdd = async (fields: API.RuleListItem) => {
    const hide = message.loading('Đang thêm...');
    console.log(fields);
    try {
        await customAPIAdd({ ...fields }, 'addresses/create-plaform');
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
        }, 'addresses', id.current);
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
            return customAPIDelete(e.id, 'e-wallets')
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



const getProvines = async () => {
    const provine = await customAPIGet({}, 'provinces');
    let data = provine.data.map((e: any) => {
        return {
            value: e?.id,
            text: e?.attributes?.fullname,
            label: e?.attributes?.fullname,
        };
    });
    return data;
};


const getDistrict = async (id: number) => {
    const district = await customAPIGetOne(id, 'districts/get', {});
    let data = district.map((e: any) => {
        return {
            value: e?.id,
            text: e?.fullname,
            label: e?.fullname,
        };
    });
    return data;
};


const getWard = async (id: number) => {
    const wards = await customAPIGetOne(id, 'wards/get', {});
    let data = wards.map((e: any) => {
        return {
            value: e?.id,
            text: e?.fullname,
            label: e?.fullname,
        };
    });
    return data;
};


const confirm = (entity: any, message: string, actionRef: any) => {
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
    //const [showDetail, setShowDetail] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const refIdEWallet = useRef<any>();
    //const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
    // const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
    const [form] = Form.useForm<any>();
    const [provine, setProvine] = useState<any>();
    const [district, setDistrict] = useState<any>();
    const [ward, setWard] = useState<any>();

    const [districtLoading, setDistrictLoading] = useState(false);
    const [wardLoading, setWardLoading] = useState(false);


    // const [searchText, setSearchText] = useState<any>();

    useEffect(() => {
        const getValues = async () => {
            let getBanks = await getProvines();
            setProvine(getBanks);
        };
        getValues();
    }, []);

    const handleSearch = (selectedKeys: any, confirm: any) => {
        confirm();
        //setSearchText(selectedKeys[0]);
        // setSearchedColumn(dataIndex);
        //console.log('selectedKeys',selectedKeys[0] );
    };
    const handleReset = (clearFilters: any, confirm: any) => {
        clearFilters();
        //setSearchText('');
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
                    // ref={configDefaultText[]}
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
            title: configDefaultText['page.address.fullname'],
            dataIndex: 'fullname',
            valueType: 'textarea',
            key: 'fullname',
            renderText: (_, text: any) => {
                return `${text?.address}, ${text?.ward?.fullname}, ${text?.district?.fullname}, ${text?.province?.fullname}`
            },
        },
        {
            title: configDefaultText['page.address.address'],
            key: 'address',
            dataIndex: 'address',
            render: (_, entity: any) => {
                return (
                    <>
                        {entity?.address}</>
                );
            },
            ...getColumnSearchProps('address')
        },
        {
            title: configDefaultText['page.address.ward'],
            dataIndex: 'ward',
            valueType: 'textarea',
            key: 'ward',
            renderText: (_, text: any) => text?.ward?.fullname,

        },

        {
            title: configDefaultText['page.address.district'],
            dataIndex: 'district',
            valueType: 'textarea',
            key: 'district',
            renderText: (_, text: any) => text?.district?.fullname
        },

        {
            title: configDefaultText['page.address.province'],
            dataIndex: 'province',
            valueType: 'textarea',
            key: 'province',
            renderText: (_, text: any) => text?.province?.fullname
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
                ><MdOutlineEdit
                        onClick={ async () => {
                            handleUpdateModalOpen(true);

                            const data = await Promise.all([getDistrict(entity?.district?.id), getWard(entity?.district?.id)]);
                            setWard(data[1]);
                            setDistrict(data[0]);
                            refIdEWallet.current = entity.id;
                            form.setFieldsValue({
                                province: entity?.province?.id,
                                address: entity?.address,
                                district: entity?.district?.id,
                                ward: entity?.ward?.id
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
                        // actionRef.current?.reloadAndRest?.();
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
                request={() => customAPIGet({}, 'addresses/get/plaform')}
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


                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0">
                        <ProFormText
                            rules={[
                                {
                                    required: true,
                                    message: configDefaultText['page.address.address'],
                                },
                            ]}
                            width='md'
                            label={configDefaultText['page.address.address']}
                            name='address'
                            placeholder={configDefaultText['page.address.address']}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0">
                        <ProFormSelect
                            label={configDefaultText['page.address.province']}
                            options={provine}
                            rules={[
                                {
                                    required: true,
                                    message: configDefaultText['page.address.province']
                                },
                            ]}
                            width='md'
                            name='province'
                            placeholder={configDefaultText['page.address.province']}
                            fieldProps={{
                                onChange: async (value: any) => {
                                    form.setFieldValue('district', null);
                                    form.setFieldValue('ward', null)
                                    if (typeof value !== 'undefined') {
                                        setDistrictLoading(true);
                                        const data = await getDistrict(value);
                                        setDistrict(data);
                                        setDistrictLoading(false);
                                    }



                                },
                            }}
                        />

                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0">
                        <ProFormSelect
                            label={configDefaultText['page.address.district']}
                            rules={[
                                {
                                    required: true,
                                    message: configDefaultText['page.address.district']
                                },
                            ]}
                            options={district}
                            width='md'
                            name='district'
                            placeholder={configDefaultText['page.address.district']}
                            fieldProps={{
                                onChange: async (value: any) => {
                                    form.setFieldValue('ward', null)
                                    if (typeof value !== 'undefined') {
                                        setWardLoading(true);
                                        const data = await getWard(value);
                                        setWard(data);
                                        setWardLoading(false);
                                    }
                                },
                                loading: districtLoading
                            }}
                        />

                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0">
                        <ProFormSelect
                            label={configDefaultText['page.address.ward']}
                            options={ward}
                            rules={[
                                {
                                    required: true,
                                    message: configDefaultText['page.address.ward']
                                },
                            ]}
                            width='md'
                            name='ward'
                            placeholder={configDefaultText['page.address.ward']}
                            fieldProps={{
                                // onChange: (value: any) => {

                                // },
                                loading: wardLoading
                            }}

                        />

                    </Col>
                </Row>
                {/* 
                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0">
                        <ProFormSelect
                            label={configDefaultText['page.address.province']}
                            options={bank}
                            rules={[
                                {
                                    required: true,
                                    message: configDefaultText['page.address.province']
                                },
                            ]}
                            width='md'
                            name='bank'
                            placeholder={configDefaultText['page.address.province']}
                        />

                    </Col>
                </Row> */}



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
                                    message: configDefaultText['page.address.address'],
                                },
                            ]}
                            width='md'
                            label={configDefaultText['page.address.address']}
                            name='address'
                            placeholder={configDefaultText['page.address.address']}
                        />
                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0">
                        <ProFormSelect
                            label={configDefaultText['page.address.province']}
                            options={provine}
                            rules={[
                                {
                                    required: true,
                                    message: configDefaultText['page.address.province']
                                },
                            ]}
                            width='md'
                            name='province'
                            placeholder={configDefaultText['page.address.province']}
                            fieldProps={{
                                onChange: async (value: any) => {
                                    form.setFieldValue('district', null);
                                    form.setFieldValue('ward', null)
                                    if (typeof value !== 'undefined') {
                                        setDistrictLoading(true);
                                        const data = await getDistrict(value);
                                        setDistrict(data);
                                        setDistrictLoading(false);
                                    }



                                },
                            }}
                        />

                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0">
                        <ProFormSelect
                            label={configDefaultText['page.address.district']}
                            rules={[
                                {
                                    required: true,
                                    message: configDefaultText['page.address.district']
                                },
                            ]}
                            options={district}
                            width='md'
                            name='district'
                            placeholder={configDefaultText['page.address.district']}
                            fieldProps={{
                                onChange: async (value: any) => {
                                    form.setFieldValue('ward', null)
                                    if (typeof value !== 'undefined') {
                                        setWardLoading(true);
                                        const data = await getWard(value);
                                        setWard(data);
                                        setWardLoading(false);
                                    }
                                },
                                loading: districtLoading
                            }}
                        />

                    </Col>
                </Row>

                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0">
                        <ProFormSelect
                            label={configDefaultText['page.address.ward']}
                            options={ward}
                            rules={[
                                {
                                    required: true,
                                    message: configDefaultText['page.address.ward']
                                },
                            ]}
                            width='md'
                            name='ward'
                            placeholder={configDefaultText['page.address.ward']}
                            fieldProps={{
                                // onChange: (value: any) => {

                                // },
                                loading: wardLoading
                            }}

                        />

                    </Col>
                </Row>
            </ModalForm>
        </>
    );
};

export default TableList;
