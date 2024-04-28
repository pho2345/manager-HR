
import PageRelateFamily from '@/reuse/relate-family'

const PageRelateFamilyAdmin: React.FC = () => {

    return (
        <PageRelateFamily type='ADMIN' collection={`${SERVER_URL_ACCOUNT}/quan-he-gia-dinh`}/>
    );
};

export default PageRelateFamilyAdmin;
