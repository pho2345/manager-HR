
// import { customAPIGetOne } from '@/services/ant-design-pro/api';
import { Button, Space } from 'antd';
import React, { useEffect, useState } from 'react';
// import configText from '@/locales/configText';
// import { ReloadOutlined } from '@ant-design/icons';
import Plan from './plan';
import Awg from './Awg';
import Wgs from './Wgs';
import { customAPIGet } from '@/services/ant-design-pro/api';



const getCategory = async () => {
    const categories = await customAPIGet({}, 'categories/get/option');
    return categories;
};

const getAWG = async () => {
    const data = await customAPIGet({}, 'average-weight-gains/get/option',);
    return data.data
}


const TableList = (props: any) => {

    const [openModalPlan, setOpenModalPlan] = useState<boolean>();
    const [openModalAwg, setOpenModalAwg] = useState<boolean>();
    const [openModalWgs, setOpenModalWgs] = useState<boolean>();

    const [category, setCategory] = useState<any>([]);
    const [awg, setAwg] = useState<any>([]);

    useEffect(() => {
        const getData = async () => {
            const getOptionCategory = getCategory();
            const getOptionAWG = getAWG();
            const getAllData = await Promise.all([getOptionCategory, getOptionAWG]);
            setCategory(getAllData[0]);
            setAwg(getAllData[1]);
        }
        getData();
    }, [])





    return (
        <>
            <Space>
                <Button onClick={() => {
                    setOpenModalPlan(true);
                }}>PAHT</Button>
                <Button
                    onClick={() => {
                        setOpenModalAwg(true);
                    }}
                >Tăng trọng trung bình</Button>
                <Button
                    onClick={() => {
                        setOpenModalWgs(true);
                    }}
                >Tăng trong tiêu chuẩn</Button></Space>

            {
                openModalPlan && (<>
                    <Plan
                        openModal={openModalPlan}
                        onCloseModal={() => {
                            setOpenModalPlan(false);
                        }}
                        id={props.fairId}
                    />
                </>)
            }

            {
                openModalAwg && (<>
                    <Awg
                        openModal={openModalAwg}
                        onCloseModal={() => {
                            setOpenModalAwg(false);
                        }}
                        id={props.fairId}
                        category={category}
                        awg={awg}

                    />
                </>)
            }

            {
                openModalWgs && (<>
                    <Wgs
                        openModal={openModalWgs}
                        onCloseModal={() => {
                            setOpenModalWgs(false);
                        }}
                        id={props.fairId}
                        category={category}
                        awg={awg}

                    />
                </>)
            }
        </>
    );
};

export default TableList;
