import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoutesHelper } from './helper/Routes';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path={RoutesHelper.signin.path} element={RoutesHelper.signin.element} />
        <Route path={RoutesHelper.signup.path} element={RoutesHelper.signup.element} />
        <Route path={RoutesHelper.app.path} element={RoutesHelper.app.element} />
      </Routes>
    </Router>
  );
};

export default App;
