import ProductTypeAdd from "../ProductTypeAdd";
import ProductTypesList from "../ProductTypesList";

const DashboardPage = () => {
  return (
    <>
      <div className="flex flex-col items-center">
        <h1>Dashboard page</h1>
        <ProductTypesList />
        <br />
        <ProductTypeAdd />
      </div>
    </>
  );
};

export default DashboardPage;
