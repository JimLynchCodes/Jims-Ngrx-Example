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

      case "PAYLOAD_EFFECT_RESPONDS": {
        console.log("got array payload from effect: " + action.payload.pulledArray);
      }

      case "GOT_FIREBASE_ARRAY": {

        console.log("got array payload from effect: " + action.payload.pulledArray);
        if (action.payload.pulledArray != undefined) {

        let payloadArray = <Object[]>action.payload.pulledArray;
          console.log("got payload from effect: " + payloadArray);
          console.log("first element is: " + payloadArray[0]);
        }

        return Object.assign(state);

      }

      case "GOT_FIREBASE_OBJECT": {

        if (action.payload.pulledObject != undefined) {

          let payloadObject = <Object[]>action.payload.pulledObject;
          console.log("got object payload from effect: " + payloadObject);
          // console.log("first element is: " + payloadObject);

          // let newState = Object.assign(state);
          // newState.displayText = payloadObject['off_tha_top']['roomDetails']['description'];
          // console.log('got the display text: ' + newState.displayText);
          // return newState;

          return {
            counter: 4,
            displayText:payloadObject['off_tha_top']['roomDetails']['description']
          }
        }

      }


      default: {
        return state;
      }
    }
  };
