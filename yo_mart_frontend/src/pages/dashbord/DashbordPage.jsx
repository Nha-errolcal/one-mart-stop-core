import { useEffect, useState } from "react";
import MainPage from "@/layouts/auth/MainPage";

const DashboardPage = () => {
  const [state, setState] = useState({
    loading: true,
  });
  return (
    <>
      <div>
        <h1>Hello world</h1>
      </div>
    </>
  );
};

export default DashboardPage;
