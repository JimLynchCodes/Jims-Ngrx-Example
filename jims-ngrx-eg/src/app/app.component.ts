import { Component } from '@angular/core';
import { Store } from "@ngrx/store";
import { State } from "./state-management/state/main-state";
import { INCREMENT } from "./state-management/actions/main-action-creator";
import {mainReducer} from "./state-management/reducers/main-reducer";

import * as firebase from 'firebase';
import {Cheese} from "./.cheese";
import {SmartComponentComponent} from "./smart-component/smart-component.component";
import {TestService} from "./test.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // directives: [SmartComponentComponent]
})
export class AppComponent {
  title = 'app works!';
  data = '';
  displayText:string = '';

  constructor (private store:Store<State>) {

    store.select('mainReducer')
      .subscribe( (data:State )=> {
        this.data = 'data is' + data.counter;
        this.displayText = data.displayText;
        console.log('component sees data is: ' + data.counter + " and " + data.displayText);
      });

    this.store.dispatch({ type: INCREMENT, payload: {innerObj: {text: "derp!"}} });
    this.store.dispatch({ type: "SUPER_SIMPLE_EFFECT", payload: {seconds: 2 }});
    this.store.dispatch({ type: "SET_TIMER", payload: {seconds: 2 }});
    this.store.dispatch({ type: "SEND_PAYLOAD_TO_EFFECT", payload: {message: "The component says hello!" }});
    this.store.dispatch({ type: "PULL_ARRAY_FROM_FIREBASE"});
    this.store.dispatch({ type: "PULL_OBJECT_FROM_FIREBASE"});

  }

  ngOnInit() { }


}
