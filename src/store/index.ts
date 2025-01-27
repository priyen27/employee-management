import { configureStore } from '@reduxjs/toolkit';
import employeesReducer, { EmployeesState } from './employeesSlice';

export interface RootState {
  employees: EmployeesState;
}

export const store = configureStore({
  reducer: {
    employees: employeesReducer,
  },
});

export type AppDispatch = typeof store.dispatch; 