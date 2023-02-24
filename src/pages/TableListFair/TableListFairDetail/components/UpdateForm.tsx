import { customAPIAdd, customAPIGet, customAPIGetOne, customAPIUpdate } from '@/services/ant-design-pro/api';
import {
  ModalForm,
  ProForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RuleListItem>;

// export type UpdateFormProps = {
//   onCancel: (flag?: boolean, formVals?: FormValueType) => void;
//   onSubmit: (values: FormValueType) => Promise<void>;
//   updateModalOpen: boolean;
//   values: Partial<API.RuleListItem>;
// };

const handleAdd = async (fields: any) => {

  fields.timeEnd = moment(fields.timeEnd).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.timeStart = moment(fields.timeStart).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.dateStartFeed = moment(fields.dateStartFeed).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.dateEndFeed = moment(fields.dateEndFeed).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();

  const hide = message.loading('Đang thêm...');
  try {
    await customAPIAdd({ ...fields }, 'fairs');
    hide();
    message.success('Thêm thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Thêm thất bại!');
    return false;
  }
};


const handleUpdate = async (fields: any, id: any) => {
  console.log(fields);
  if (fields?.c_passes[0]?.value) {
    const configCPass = fields?.c_passes.map((e: any) => {
      return e.value;
    });
    fields.c_passes = configCPass;
  }

  fields.timeEnd = moment(fields.timeEnd).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.timeStart = moment(fields.timeStart).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.dateStartFeed = moment(fields.dateStartFeed).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.dateEndFeed = moment(fields.dateEndFeed).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();


  const hide = message.loading('Đang cập nhật...');
  try {
    await customAPIUpdate({
      ...fields
    }, 'fairs', id.current);
    hide();

    message.success('Cập nhật thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Cập nhật thất bại!');
    return false;
  }
};

const getCPassNotFair = async () => {
  const cPass = await customAPIGet({}, 'c-passes/get/cpassnotfair');
  let data = cPass.data.map((e: any) => {
    return {
      value: e?.id,
      label: e?.cow?.name,
    };
  });
  return data;
};


const getPlans = async () => {
  const plans = await customAPIGet({ 'fields[0]': 'name', 'fields[1]': 'profit' }, 'plans');

  let data = plans.data.map((e: any) => {
    return {
      value: e?.id,
      label: e?.attributes?.name + '-' + e?.attributes?.profit + '%',
    };
  });
  return data;
};
const UpdateForm: React.FC<any> = (props) => {
  //const intl = useIntl();
  const [form] = Form.useForm<any>();
  const actionRef = useRef<any>();
  //const refFlag = useRef<any>();
  const getFair = async (id: any) => {
    const fair = await customAPIGetOne(id, 'fairs/fairadmin', {});
    fair.timeEnd = moment(fair?.timeEnd).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
    fair.timeStart = moment(fair?.timeStart).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
    fair.dateStartFeed = moment(fair?.dateStartFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
    fair.dateEndFeed = moment(fair?.dateEndFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
    const c_passes = fair?.c_passes.map((e: any) => {
      return {
        label: e?.cow?.name,
        value: e?.id
      }
    })
    const plans = fair.plans.map((e: any) => {
      return e?.id

    })
    form.setFieldsValue({
      ...fair,
      c_passes,
      plans
    })
  }
  useEffect(() => {
    // Update the document title using the browser API
    getFair(props.id);

  },);

  return (
    <ModalForm
      title={`${props.types === 'update' ? 'Cập nhật' : 'Sao chép'} Phiên mở bán`}
      open={props.updateModalOpen}
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => {
          props.onCloseModal();
        },
      }}
      submitTimeout={2000}
      onFinish={async (values) => {

        if (props.types === 'update') {
          const success = await handleUpdate(values as any, props.id as any);
          if (success) {
            form.resetFields();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }
        else {
          const success = await handleAdd(values as any);
          if (success) {
            form.resetFields();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }
        //message.success('Success');

        props.onCloseModal();
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText width='md' name='code' label='Mã' placeholder='Mã' />
      </ProForm.Group>
      <ProForm.Group>


        <ProFormDateTimePicker name="timeStart" label="Thời gian mở" />
        <ProFormDateTimePicker name="timeEnd" label="Thời gian đóng" />
        <ProFormSelect
          width='xs'
          name='status'
          label='Trạng thái'
          options={[
            {
              label: 'Chưa mở',
              value: 'noOpen',
            },
            {
              label: 'Đang mở',
              value: 'Opening',
            },
            {
              label: 'Đã đóng',
              value: 'closed',
            },
          ]}
          placeholder='Trạng thái'
          rules={[{ required: true, message: 'Chọn Trạng thái!' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDateTimePicker name="dateStartFeed" label="Thời gian bắt đầu nuôi" />
        <ProFormDateTimePicker name="dateEndFeed" label="Thời gian kết thúc nuôi" />
        <ProFormText width='xs' name='timeFeed' label='Thời gian nuôi(Tuần)' placeholder='Thời gian nuôi' />
        <ProFormText width='xs' name='unitPriceMeat' label='Đơn giá thịt(VND/Kg)' placeholder='Đơn giá thịt' />
        <ProFormText width='xs' name='nameFarm' label='Tên trang trại' placeholder='Tên trang trại' />

        <ProFormSelect
          name="c_passes"
          label="Chọn cPass"
          // valueEnum={}
          request={getCPassNotFair}
          fieldProps={{
            mode: 'multiple',
          }}
          width='md'
          placeholder="Chọn cPass"

        />


        <ProFormSelect
          name="plans"
          label="Chọn Plans"
          // valueEnum={}
          request={getPlans}
          fieldProps={{
            mode: 'multiple',
          }}
          width='md'
          placeholder="Chọn cPass"
          rules={[
            { required: true, message: 'Vui lòng chọn cPass!', type: 'array' },
          ]}
        />
      </ProForm.Group>

    </ModalForm>

  );
};

export default UpdateForm;
