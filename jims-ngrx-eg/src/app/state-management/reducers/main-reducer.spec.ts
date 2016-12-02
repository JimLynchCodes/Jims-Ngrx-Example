/**
 * Created by jlynch on 12/2/16.
 */
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SmartComponentComponent } from './smart-component.component';
import {mainReducer} from "./main-reducer";
import { StoreModule } from "@ngrx/store";
import {State} from "../state/main-state";
import { Store } from "@ngrx/store";

describe('Reducer', () => {
  // let component: SmartComponentComponent;
  // let fixture: ComponentFixture<SmartComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [  ],
        imports: [StoreModule.provideStore({mainReducer})]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(SmartComponentComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', inject([Store], (store: Store<State>) => {
    expect(store).toBeTruthy();


    store.dispatch({ type: "INCREMENT", payload: {innerObj: {text: "derp!"}} });
    
    

  }));
});
