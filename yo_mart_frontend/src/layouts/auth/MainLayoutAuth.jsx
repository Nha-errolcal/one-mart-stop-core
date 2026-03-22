import { Outlet } from "react-router";

const MainLayoutAuth = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <section className="bg-white rounded-lg shadow-lg py-5 max-w-sm sm:max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center mb-6 font-battambang">
          ហាងកាហ្វេអាយធីស្មោះស្នេហ៍
          <br />
          សូមស្វាគមន៍
        </h2>

        <main className="px-4">
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default MainLayoutAuth;
