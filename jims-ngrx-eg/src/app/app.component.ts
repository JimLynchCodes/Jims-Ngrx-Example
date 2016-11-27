import { Component } from '@angular/core';
import { Store } from "@ngrx/store";
import { State } from "./state-management/state/main-state";
import { INCREMENT } from "./state-management/actions/main-action-creator";
import {mainReducer} from "./state-management/reducers/main-reducer";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  data = '';

  constructor (private store:Store<State>) {

    store.select('mainReducer')
      .subscribe( (data:State )=> {
        this.data = 'data is' + data.counter;
        console.log('component sees data is: ' + data.counter);
      });

    this.store.dispatch({ type: INCREMENT, payload: {innerObj: {text: "derp!"}} });

  }
}
