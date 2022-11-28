import { createReducer, on } from "@ngrx/store";
import { User } from "src/app/model/user";
import { loadItems, errorItem, loadSelectedItem, loadUpdatedItem, loadAddedItem, removeDeletedItem, errorClear } from './UserActions';


export interface State {
  [x: string]: any;
  users: { items: User[], selected?: null, error: any };
};

export const initialState: State = {
  users: { items: [], selected: null, error: null }
};

export const UserReducer = createReducer(
  initialState,
  on(loadItems, (state, action) => ({
    ...state,
    items: action.items
  })),
  on(loadSelectedItem, (state, action) => ({
    ...state,
    selected: action.selected
  })),
  on(loadUpdatedItem, (state, action) => ({
    ...state,
    items: ((users): User[] => {
      const index = users.items.findIndex((item: User) => item.id === action.item.id);
      const newItems = [...users.items];
      newItems[index] = action.item;
      return newItems;
    })(state)
  })),
  on(loadAddedItem, (state, action) => ({
    ...state,
    items: (state.items as User[]).concat(action.item)
  })),
  on(removeDeletedItem, (state, action) => ({
    ...state,
    items: (state.items as User[]).filter(item => item.id !== action.item.id)
  })),
  on(errorItem, (state, action) => ({
    ...state,
    error: action.error
  })),
  on(errorClear, (state, action) => ({
    ...state,
    error: null
  })),
);

export const selectItems = (state: State) => state.users.items;
export const selectOneItem = (state: State) => Object.assign({}, state.users.selected);
export const selectError = (state: State) => state.users.error?.error;
