
import PageWorkModelOld from '@/reuse/work-model-old'

const PageWorkModelOldAdmin: React.FC = () => {

    return (
        <PageWorkModelOld type='ADMIN' collection={`${SERVER_URL_ACCOUNT}/lam-viec-cho-che-do-cu`}/>
    );
};

export default PageWorkModelOldAdmin;
