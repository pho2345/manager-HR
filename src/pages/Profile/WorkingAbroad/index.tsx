import WorkingAbroad from '@/reuse/working-abroad';
const WorkingAbroadEmployee: React.FC = () => {
    return (
        <WorkingAbroad type='EMPLOYEE' collection={`${SERVER_URL_ACCOUNT}/ca-nhan/lam-viec-o-nuoc-ngoai`}/>
    );
};

export default WorkingAbroadEmployee;
