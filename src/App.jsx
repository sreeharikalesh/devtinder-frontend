import { BrowserRouter, Route, Routes } from "react-router";
import Body from "./Body";
import Login from "./Login";
import Profile from "./Profile";
import Feed from "./Feed";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body></Body>}>
            <Route path="/login" element={<Login></Login>}></Route>
            <Route element={<ProtectedRoute></ProtectedRoute>}>
              <Route path="/profile" element={<Profile></Profile>}></Route>
              <Route path="/feed" element={<Feed></Feed>}></Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
