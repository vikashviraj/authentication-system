import React from "react";
import { Navigate } from "react-router-dom";
import AxiosInstance from "../helper/AxiosInstance";
import { RoutesHelper } from "../helper/Routes";

interface PrivateRouteProps {
  component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
}) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        await AxiosInstance.get("/auth/auth-validate");
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? (
    <Component />
  ) : (
    <Navigate to={RoutesHelper.signin.path} />
  );
};

export default PrivateRoute;
