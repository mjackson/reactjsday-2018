import React from "react";

function News() {
  return <h1>It's not all fake!</h1>;
}

function Home() {
  return (
    <div>
      <h1>Home</h1>

      <Route path="/news" component={News} />
    </div>
  );
}

function About() {
  return <h1>About</h1>;
}

function NotFound() {
  return <h1>Not found!</h1>;
}

const RouterContext = React.createContext();

class Router extends React.Component {
  state = { location: window.location };

  handleClick = event => {
    event.preventDefault(); // prevent full page refresh!
    window.history.pushState(null, null, event.target.href);
    this.setState({ location: window.location });
  };

  handlePopState = () => {
    this.setState({ location: window.location });
  };

  componentDidMount() {
    window.addEventListener("popstate", this.handlePopState);
  }

  render() {
    return (
      <RouterContext.Provider
        value={{
          location: this.state.location,
          clickHandler: this.handleClick
        }}
      >
        {this.props.children}
      </RouterContext.Provider>
    );
  }
}

function Route({ exact, path, component }) {
  return (
    <RouterContext.Consumer>
      {context => {
        const { location } = context;

        const matched =
          path === "*"
            ? true
            : exact
              ? location.pathname === path
              : location.pathname.startsWith(path);

        if (matched) {
          return React.createElement(component);
        }

        return null;
      }}
    </RouterContext.Consumer>
  );
}

function Link({ to, children }) {
  return (
    <RouterContext.Consumer>
      {context => (
        <a href={to} onClick={context.clickHandler}>
          {children}
        </a>
      )}
    </RouterContext.Consumer>
  );
}

function Switch({ children }) {
  return (
    <RouterContext.Consumer>
      {context => {
        const { location } = context;

        let element = null;
        React.Children.forEach(children, child => {
          if (!element) {
            const { exact, path } = child.props;
            const matched =
              path === "*"
                ? true
                : exact
                  ? location.pathname === path
                  : location.pathname.startsWith(path);

            if (matched) {
              element = child;
            }
          }
        });

        return element;
      }}
    </RouterContext.Consumer>
  );
}

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <ul role="navigation">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>

          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
