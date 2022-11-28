import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { catchError, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { ERROR_ITEM, getItems, getOneItem, LOAD_ITEMS, LOAD_SELECTED_ITEM, updateItem, LOAD_UPDATED_ITEM, addItem, LOAD_ADDED_ITEM, deleteItem, REMOVE_ITEM } from './UserActions';


@Injectable()
export class UserEffects {

  loadItems$ = createEffect((): Observable<Action> => {
    return this.actions$.pipe(
      ofType(getItems),
      switchMap(() => this.userService.get()),
      switchMap(users => of({ type: LOAD_ITEMS, items: users })),
      catchError(error => of({ type: ERROR_ITEM, error }))
    );
  });

  getOneItem$ = createEffect((): Observable<Action> => {
    return this.actions$.pipe(
      ofType(getOneItem),
      withLatestFrom(this.store$),
      switchMap(([action, store]) => {
        const cache = store.users?.items?.find((item: any) => item.id === action.id);
        return cache ? of(cache) : this.userService.get(action.id)
      }),
      switchMap(user => of({ type: LOAD_SELECTED_ITEM, selected: user })),
      catchError(error => of({ type: ERROR_ITEM, error }))
    );
  });

  updateItem$ = createEffect((): Observable<Action> => {
    return this.actions$.pipe(
      ofType(updateItem),
      switchMap(action => this.userService.update(action.item)),
      switchMap(user => of({ type: LOAD_UPDATED_ITEM, item: user })),
      catchError(error => of({ type: ERROR_ITEM, error }))
    );
  });

  addItem$ = createEffect((): Observable<Action> => {
    let lastAction: any = null;
    return this.actions$.pipe(
      ofType(addItem),
      tap((action: any) => lastAction = action),
      mergeMap(action => this.userService.create(action.item).pipe(
        switchMap(() => this.userService.query(`email=${lastAction.item.email}`)),
        switchMap(user => of({ type: LOAD_ADDED_ITEM, item: user })),
        catchError(error => of({ type: ERROR_ITEM, error }))
      )),
    );
  });

  deleteItem$ = createEffect((): Observable<Action> => {
    let lastAction: any = null;
    return this.actions$.pipe(
      ofType(deleteItem),
      tap((action: any) => lastAction = action),
      switchMap(action => this.userService.delete(action.item)),
      switchMap(user => of({ type: REMOVE_ITEM, item: lastAction.item })),
      catchError(error => of({ type: ERROR_ITEM, error }))
    );
  });


  constructor(
    private actions$: Actions,
    private userService: UserService,
    private store$: Store<any>
  ) { }

}
