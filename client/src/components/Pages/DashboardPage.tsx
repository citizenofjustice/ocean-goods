import ProductTypesList from "../ProductTypesList";

const DashboardPage = () => {
  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="mb-4">Dashboard page</h1>
        <ProductTypesList />
      </div>
    </>
  );
};

export default DashboardPage;
