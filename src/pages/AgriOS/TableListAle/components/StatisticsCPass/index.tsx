import { customAPIGet } from '@/services/ant-design-pro/api';
import { Column } from '@ant-design/plots';
import { ProFormDateRangePicker, ProFormTreeSelect } from '@ant-design/pro-components';
import moment from 'moment';
import { useEffect, useState } from 'react';

export type UpdateFormProps = {
  data: [];
};



const StatisticsCPass = () => {
  
  const [dataStatisticCPass, setDataStatisticCPass] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDateRange, setOpenDateRange] = useState<boolean>(false);
  // const [type, setType] = useState<any>();

  useEffect(() => {
    const getValues = async () => {
      setLoading(true);
      let getData = await customAPIGet({}, 'c-passes/statistic/c-pass');
      setDataStatisticCPass(getData.data);
      setLoading(false);
    };
    getValues();
  }, []);

  return (
    <>

      <ProFormTreeSelect
        name="name"
        placeholder="Chọn thời gian"
        allowClear
        secondary
        request={async () => {
          return [
            {
              title: 'Theo tuần',
              value: 'week',
            },
            // {
            //   title: 'Tháng này,',
            //   value: 1,
            // },
            {
              title: 'Tháng',
              value: 'months',
              children: [
                {
                  title: 'Tháng trước',
                  value: 'preMonth',
                },
                {
                  title: 'Tháng này',
                  value: 'currentMonth',
                },
              ],
            },
            {
              title: 'Quí',
              value: 'quarters',
              children: [
                {
                  title: 'Tháng trước',
                  value: 'preQuarter',
                },
                {
                  title: 'Quí này',
                  value: 'currentQuarter',
                },
              ],
            },

            {
              title: 'Năm',
              value: 'years',
              children: [
                {
                  title: 'Năm trước',
                  value: 'preYear',
                },
                {
                  title: 'Năm này',
                  value: 'currentYear',
                },
              ],
            },
            {
              title: 'Chỉ định',
              value: 'assign',
            }
          ];
        }}
        // tree-select args
        fieldProps={{
          showArrow: false,
          filterTreeNode: true,
          showSearch: true,
          dropdownMatchSelectWidth: false,
          labelInValue: true,
          autoClearSearchValue: true,
          treeNodeFilterProp: 'title',
          fieldNames: {
            label: 'title',
          },
          onChange: async (value: any) => {
            
              const getValues = async () => {
                setLoading(true);
                if ( value?.value === 'assign') {
                  setDataStatisticCPass([]);
                  setOpenDateRange(true)
                }
                else if(value?.value){
                  setOpenDateRange(false)
                  let getData = await customAPIGet({ type: value?.value }, 'c-passes/statistic/c-pass');
                  setDataStatisticCPass(getData.data);
                }
                else {
                  setOpenDateRange(false);
                  let getData = await customAPIGet({ }, 'c-passes/statistic/c-pass');
                  setDataStatisticCPass(getData.data);
                }
                setLoading(false);
              }
              getValues();
          }
        }}
      />

      {openDateRange && (
        <ProFormDateRangePicker name="dateRange"
          fieldProps={{
            onCalendarChange: async (values: any) => {
              if (values && values[0] && values[1]) {

                let start = moment(values[0].$d).startOf('days').toISOString();
                let end = moment(values[1].$d).endOf('days').toISOString();
                let getData = await customAPIGet({
                  type: 'assign',
                  start: start,
                  end: end,
                }, 'c-passes/statistic/c-pass');
                setDataStatisticCPass(getData.data);
                // setType('assign');
              }
            }
          }}
        />
      )}


      {dataStatisticCPass.length !== 0 && (<Column
        loading={loading}
        data={dataStatisticCPass}
        xField='range'
        yField='value'
        label={{
          position: 'bottom'
        }}
        xAxis={{
          label: {
            autoHide: true,
            autoRotate: false,
          },
        }}
        meta={{
          type: {
            alias: '类别',
          },
          sales: {
            alias: '销售额',
          },
        }}
      />)}
    </>
  );



};

export default StatisticsCPass;
