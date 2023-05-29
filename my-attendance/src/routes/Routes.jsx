import { Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ContentPage from "../pages/ContentPage";
import LogPage from "../pages/LogPage";
import ForgetPage from "../pages/ForgetPage";
import EmailPage from "../pages/EmailPage";
import ProtectedPage from "./protectedpage";

const routes = [
  <Route
    path="/"
    element={
      <ProtectedPage guestOnly={false} needLogin={true}>
        <ContentPage />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/login"
    element={
      <ProtectedPage guestOnly={true} needLogin={false}>
        <LoginPage />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/register"
    element={
      <ProtectedPage guestOnly={true} needLogin={false}>
        <RegisterPage />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/log"
    element={
      <ProtectedPage guestOnly={false} needLogin={true}>
        <LogPage />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/forget/:token"
    element={
      <ProtectedPage guestOnly={false} needLogin={false}>
        <ForgetPage />
      </ProtectedPage>
    }
  ></Route>,
  <Route
    path="/forget/request"
    element={
      <ProtectedPage guestOnly={true} needLogin={false}>
        <EmailPage />
      </ProtectedPage>
    }
  ></Route>,
];

export default routes;
