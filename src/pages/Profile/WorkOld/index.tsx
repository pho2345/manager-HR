
import PageWorkModelOld from '@/reuse/work-model-old'

const PageWorkModelOldEmployee: React.FC = () => {
    return (
        <PageWorkModelOld type='EMPLOYEE' collection={`${SERVER_URL_ACCOUNT}/ca-nhan/lam-viec-cho-che-do-cu`}/>
    );
};

export default PageWorkModelOldEmployee;
