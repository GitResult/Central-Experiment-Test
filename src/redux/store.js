import { legacy_createStore as createStore, combineReducers } from 'redux';
import demoReducer from './demo/reducer';

const rootReducer = combineReducers({
  demo: demoReducer,
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
