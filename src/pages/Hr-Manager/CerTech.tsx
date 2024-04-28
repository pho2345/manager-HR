
import PageCerTech from '@/reuse/techs'

const PageCerTechAdmin: React.FC = () => {

    return (
        <PageCerTech type='ADMIN' collection={`${SERVER_URL_ACCOUNT}/tin-hoc`}/>
    );
};

export default PageCerTechAdmin;
