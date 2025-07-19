import Layout from '../components/Layout/Layout';
import ApiTest from '../components/ApiTest';

export default function ApiTestPage() {
  return (
    <Layout title="API Testing - Planeswalker's Primer">
      <div className="page-container">
        <ApiTest />
      </div>

      <style jsx>{`
        .page-container {
          min-height: calc(100vh - 200px);
          padding: 2rem 0;
        }

        @media (max-width: 640px) {
          .page-container {
            padding: 1rem 0;
          }
        }
      `}</style>
    </Layout>
  );
}
