import { Container } from "semantic-ui-react";
import NavBar from "./Navbar";
import { observer } from "mobx-react-lite";
import {Outlet, useLocation} from 'react-router-dom';
import HomePage from "../../features/home/HomePage";


function App() {

  const location = useLocation();

  return (
    <>
      {location.pathname === "/" ? (
        <HomePage />
      ) : (
        <>
          <NavBar />
          <Container style={{ marginTop: "7rem" }}>
            <Outlet />
          </Container>
        </>
      )}
    </>
  );
}

export default observer(App);
