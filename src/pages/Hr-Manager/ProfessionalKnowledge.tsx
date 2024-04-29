import PageProfessionalKnowledge from '@/reuse/pro-knowledge';
const PageProfessionalKnowledgeAdmin: React.FC = () => {
    return (
        <PageProfessionalKnowledge type='ADMIN' collection={`${SERVER_URL_ACCOUNT}/nghiep-vu-chuyen-nganh`}/>
    );
};

export default PageProfessionalKnowledgeAdmin;
