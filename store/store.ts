import {configureStore} from '@reduxjs/toolkit';
import test from './test';
import scatterer from './scatterer';

export default configureStore({
  reducer: {
    counter: test,
    history: scatterer,
  },
});
