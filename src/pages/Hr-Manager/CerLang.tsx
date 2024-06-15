
import PageCerLang from '@/reuse/languages'

const PageCerLangAdmin: React.FC = () => {

    return (
        <PageCerLang type='ADMIN' collection={`${SERVER_URL_ACCOUNT}/ngoai-ngu`}/>
    );
};

export default PageCerLangAdmin;
