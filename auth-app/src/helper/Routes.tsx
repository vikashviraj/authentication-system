import PrivateRoute from "../components/PrivateRoute";
import AppPage from '../pages/AppPage';
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";

export const RoutesHelper = {
    signin: { path: '/signin', element: <SignIn /> },
    signup: { path: '/signup', element: <SignUp /> },
    app: { path: '/', element: <PrivateRoute component={AppPage} /> },
};