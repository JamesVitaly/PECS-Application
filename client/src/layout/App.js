import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Login from '../ui/components/Login';
import TalkBoardMain from '../ui/components/talk/TalkBoardMain';
import HomePageView from '../ui/components/home/HomePageView';
import AddImageViewContainer from '../ui/containers/add-image/AddImageViewContainer';
import { authorizeUser } from '../ui/actions';


require('es6-promise').polyfill();
require('isomorphic-fetch');

const initialState = {
  userId: '',
  token: '',
  userGallery: [],
  categories: [],
  storyBoard: [],
};

function reducer(state = initialState, action) {
  if (action.type === 'AUTHORIZE_USER') {
    const userId = action.user;
    return Object.assign({}, state, {
      userId,
    });
  }
  if (action.type === 'AUTHORIZE_USER_FAILED') {
    return Object.assign({}, state, {
      userId: '',
    });
  }
  if (action.type === 'USERGALLERY__LOADGALLERY') {
    const userGallery = action.gallery;
    return Object.assign({}, state, {
      userGallery,
    });
  }
  if (action.type === 'USERGALLERY__LOADCATEGORIES') {
    const { categories } = action;
    return Object.assign({}, state, {
      categories,
    });
  }
  if (action.type === 'STORYBOARD__ADD-IMAGE') {
    const storyBoard = state.storyBoard.concat(action.image);
    return Object.assign({}, state, {
      storyBoard,
    });
  }
  if (action.type === 'STORYBOARD__REMOVE-IMAGE') {
    const storyBoard = state.storyBoard.filter(img => action.image !== img);
    const newState = {
      storyBoard,
    };
    return newState;
  }
  if (action.type === 'STORYBOARD__ARRANGE-IMAGES') {
    const index = state.storyBoard.indexOf(action.targetImage);
    if (index >= 0) {
      const storyBoard = state.storyBoard.filter(img => action.replacementImage !== img);
      storyBoard.splice(index, 0, action.replacementImage);
      return Object.assign({}, state, {
        storyBoard,
      });
    }
  }
  if (action.type === 'STORYBOARD__SWAP') {
    const index = state.storyBoard.indexOf(action.targetImage);
    let { storyBoard } = state;
    storyBoard.splice(index, 0, action.replacementImage);
    storyBoard = state.storyBoard.filter(img => action.targetImage !== img);
    return Object.assign({}, state, {
      storyBoard,
    });
  }
  return state;
}
const store = createStore(reducer, applyMiddleware(thunk));


const PrivateRoute = ({
  // eslint-disable-next-line
  component: Component, ...rest
}) => (
  <Route
    {...rest}
    render={props => (
      localStorage.getItem('user')
        ? <Component {...props} />
        : <Redirect to="/" />
    )}
  />
);


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      auth: false,
    };
  }

  componentDidMount() {
    const token = localStorage.getItem('user');
    store.dispatch(authorizeUser({ token }));
  }

  render() {
    const { userId, auth } = this.state;
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Route exact path="/" render={props => <Login {...props} />} />
            <PrivateRoute path="/home" component={HomePageView} auth={auth} />
            <PrivateRoute path="/talk" component={TalkBoardMain} auth={auth} />
            <PrivateRoute userId={userId} path="/add-images" component={AddImageViewContainer} auth={auth} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
