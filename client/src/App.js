import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";
import Register from "./pages/Register";
import Home from "./pages/home/Home";
import Login from "./pages/Login";
import ApolloProvider from "./ApolloProvider";
import { AuthProvider } from "./context/auth";
import DynamicRoute from "./utils/dynamic.route";
function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
      <Router>
        <Container className="pt-5">
          <Switch>         
            <DynamicRoute path="/register" component={Register} />
            <DynamicRoute path="/login" component={Login} />
            <DynamicRoute exact path="/" component={Home} />
          </Switch>
        </Container>
      </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
