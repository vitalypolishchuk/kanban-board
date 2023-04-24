import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "./components/Header/Header";
import Issues from "./components/IssuesColumn/IssuesColumn";

const App = () => {
  return (
    <div className="container">
      <Header />
      <Issues />
    </div>
  );
};

export default App;
