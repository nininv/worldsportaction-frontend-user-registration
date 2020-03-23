import { createStore, applyMiddleware } from "redux";
import rootReducer from "./store/reducer";

import createSagaMiddleware from "redux-saga";
import rootSaga from "./store/saga";

const sagaMiddleware = createSagaMiddleware();

export default function configureStore() {
  const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(rootSaga);
  return store;
}
