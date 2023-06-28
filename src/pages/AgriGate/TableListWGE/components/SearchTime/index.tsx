import React, { useState } from 'react';
import { ProFormDatePicker, ProFormSelect } from '@ant-design/pro-components'; // Replace 'your-library' with the actual library you're using
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space } from 'antd';

const RangeDatePicker = ({ onSearch, onReset }: any) => {
    const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
    const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
    const [optionRangeSearch, setOptionRangeSearch] = useState();
    const [showRangeTo, setShowRangeTo] = useState<boolean>(false);

    const handleSearchRange = () => {
        if (optionRangeSearch !== 'range') {
            onSearch(JSON.stringify([optionRangeSearch]));
        } else {
            onSearch(JSON.stringify([optionRangeSearch, searchRangeFrom, searchRangeTo]));
        }
    };

    const clearResetRange = () => {
        setSearchRangeFrom(null);
        setSearchRangeTo(null);
        onReset();
    };

    return (
        <div>
            {showRangeTo && (<>
                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0">
                        <ProFormDatePicker
                            allowClear={false}
                            fieldProps={{
                                style: {
                                    width: '100%'
                                },
                                onChange: (e: any) => {
                                    if (e) {
                                        setSearchRangeFrom(moment(e['$d']).toISOString());
                                    }
                                },
                                value: searchRangeFrom
                            }}
                            placeholder={'Thời gian từ'}
                        />
                    </Col>
                </Row>
                <Row gutter={24} className="m-0">
                    <Col span={24} className="gutter-row p-0">
                        <ProFormDatePicker
                            allowClear={false}
                            fieldProps={{
                                style: {
                                    width: '100%'
                                },
                                value: searchRangeTo,
                                onChange: (e: any) => {
                                    if (e) {
                                        setSearchRangeTo(moment(e['$d']).toISOString());
                                    }
                                },
                            }}

                            placeholder={'Thời gian đến'}
                        />
                    </Col>
                </Row>
            </>)}

            <Row gutter={24} className="m-0">
                <Col span={24} className="gutter-row p-0">
                    <ProFormSelect
                        options={[
                            { value: 'days', label: 'Trong ngày' },
                            { value: 'weeks', label: 'Trong tuần' },
                            { value: 'months', label: 'Trong tháng' },
                            { value: 'years', label: 'Trong năm' },
                            { value: 'range', label: 'Khoảng' }
                        ]}
                        fieldProps={{
                            onChange: (value) => {
                                if (value === 'range') {
                                    setShowRangeTo(true);
                                } else {
                                    setShowRangeTo(false);
                                }
                                setOptionRangeSearch(value);
                            },
                        }}
                    />
                </Col>
            </Row>
            <Space>
                <Button
                    type="primary"
                    onClick={() => {
                        // if (optionRangeSearch !== 'range') {
                        //     // handleSearchRange([JSON.stringify([optionRangeSearch])])
                        //     handleSearchRange()
                        // }
                        // else {
                        //     handleSearchRange()
                        //     // setSelectedKeys([JSON.stringify([optionRangeSearch, searchRangeFrom, searchRangeTo])])
                        // }
                        handleSearchRange();
                    }}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{
                        width: 90,
                    }}
                >
                    Tìm kiếm
                </Button>
                <Button
                    //   onClick={() => clearResetRange()}
                    size="small"
                    style={{
                        width: 90,
                    }}
                >
                    Làm mới
                </Button>
            </Space>
        </div>
    );
};

export default RangeDatePicker;