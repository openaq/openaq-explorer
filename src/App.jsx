import { lazy } from "solid-js";
import { Routes, Route } from "@solidjs/router"
import Header from './components/Header';
import './styles/main.scss'
const Detail = lazy(() => import("./pages/Detail"));
const Explore = lazy(() => import("./pages/Explore"));

function App() {


  return <>
    <Header />
    <Routes>
      <Route path="/" component={Explore} />
      <Route path="/locations/:id" component={Detail} />
    </Routes>
  </>
}

export default App;
