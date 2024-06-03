import Cookies from "js-cookie";
import React from "react";
import { useNavigate } from "react-router-dom";
import { RoutesHelper } from "../helper/Routes";

const AppPage: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("token");
    navigate(RoutesHelper.signin.path);
  };
  return (
    <div className="min-h-screen w-screen justify-center bg-gray-100 p-3">
      <div className="bg-white py-5 px-8 rounded shadow-md h-full flex justify-between">
        <h1 className="text-2xl font-bold">Welcome to the application</h1>
        <button onClick={() =>handleLogout()} className="rounded py-2 px-3 shadow-md hover:bg-blue-500 hover:text-white">
          Logout
        </button>
      </div>
    </div>
  );
};

export default AppPage;
