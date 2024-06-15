import WorkingAbroad from '@/reuse/working-abroad';
const WorkingAbroadAdmin: React.FC = () => {
    return (
        <WorkingAbroad type='ADMIN' collection={`${SERVER_URL_ACCOUNT}/lam-viec-o-nuoc-ngoai`}/>
    );
};

export default WorkingAbroadAdmin;
