
import PageRelateFamily from '@/reuse/relate-family'

const PageRelateFamilyAdmin: React.FC = () => {

    return (
        <PageRelateFamily type='EMPLOYEE' collection={`${SERVER_URL_ACCOUNT}/ca-nhan/quan-he-gia-dinh`}/>
    );
};

export default PageRelateFamilyAdmin;
