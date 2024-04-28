
import PageCerTech from '@/reuse/techs'

const PageCerTechEmployee: React.FC = () => {

    return (
        <PageCerTech type='EMPLOYEE' collection={`${SERVER_URL_ACCOUNT}/ca-nhan/tin-hoc`}/>
    );
};

export default PageCerTechEmployee;
