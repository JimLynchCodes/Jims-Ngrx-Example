/**
 * Created by jlynch on 12/2/16.
 */
/* tslint:disable:no-unused-variable */
import {async, TestBed, inject} from '@angular/core/testing';
import {mainReducer} from "./main-reducer";
import {StoreModule} from "@ngrx/store";
import {State} from "../state/main-state";
import {Store} from "@ngrx/store";

describe('Reducer', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [],
        imports: [StoreModule.provideStore({mainReducer})]
      })
      .compileComponents();
  }));

  it('should have the intial counter be 10', inject([Store], (store:Store<State>) => {
    expect(store).toBeTruthy();

    let data = store.select('mainReducer')
      .subscribe((data:State)=> {
        expect(data.counter).toEqual(10);

      });

  }));

  it('should have the counter be 11 after handling the INCREMENT action', inject([Store], (store:Store<State>) => {
    expect(store).toBeTruthy();

    store.dispatch({ type: "INCREMENT", payload: {innerObj: {text: "derp!"}} });

    let data = store.select('mainReducer')
      .subscribe((data:State)=> {
        expect(data.counter).toEqual(11);

      });

  }));
});
