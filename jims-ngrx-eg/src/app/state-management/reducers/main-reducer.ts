import {ActionReducer, Action} from "@ngrx/store";
import {State, intitialState} from "../state/main-state";
import {INCREMENT, EVENT_FROM_EFFECT} from "../actions/main-action-creator";

export const mainReducer: ActionReducer<State> =
  (state = intitialState, action: Action) => {

    console.log('Action came in! ' + action.type);

    switch (action.type) {

      case INCREMENT: {
        console.log('the payload string is: ' + action.payload.innerObj.text);
        return {
          counter: state.counter + 1
        }
      }

      case EVENT_FROM_EFFECT: {
        console.log('we cheesin in the reducer over here!');
        return {
          counter: 4
        }
      }

      default: {
        return state;
      }
    }
  };
