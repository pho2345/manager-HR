
import PageLanguages from '@/reuse/languages'

const PageWorkModelOldEmployee: React.FC = () => {
    return (
        <PageLanguages type='EMPLOYEE' collection={`${SERVER_URL_ACCOUNT}/ca-nhan/ngoai-ngu`}/>
    );
};

export default PageWorkModelOldEmployee;
