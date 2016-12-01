import {Effect, Actions, toPayload} from "@ngrx/effects";

import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

// import * as firebase from 'firebase';
import {AngularFire} from "angularfire2";

@Injectable()
export class MainEffects {
  constructor(private action$: Actions, private af: AngularFire) {
  }

  @Effect() update$ = this.action$
    .ofType('SUPER_SIMPLE_EFFECT')
    .switchMap( () =>
      Observable.of({type: "SUPER_SIMPLE_EFFECT_HAS_FINISHED"})
    );

  @Effect() getPayloadExample$ = this.action$
    .ofType('SEND_PAYLOAD_TO_EFFECT')
    .map(toPayload)
    .switchMap(payload => {
      console.log('the payload was: ' + payload.message);
      return Observable.of({type: "PAYLOAD_EFFECT_RESPONDS", payload: {message: "The effect says hi!"}})
    });


  @Effect() timeEffect = this.action$
    .ofType('SET_TIMER')
    .map(toPayload)
    .switchMap(payload =>
      Observable.timer(payload.seconds * 1000)
        .switchMap(() =>
          Observable.of({type: "TIMER_FINISHED"})
        )
    )

  @Effect() pullFromFirebase$ = this.action$
    .ofType('PULL_ARRAY_FROM_FIREBASE')
    .switchMap( () => {
      console.log('in te switch map!')

        return this.af.database.list('/cypherapp/rooms/')
        .switchMap(result => {
          console.log(' in the map! ' + JSON.stringify(result));
          return Observable.of({type: "FIREBASE_CALL_FINISHED", payload: {pulledArray:  result}})
          }
        )
    }
    )
  // firebase.database().ref('/cypherapp/rooms/').on('value', (dataSnapshot)
           // Observable.of({type: "FIREBASE_CALL_FINISHED", payload: {pulledArray:  =>dataSnapshot}})))
           // ret rn Observable.of({type: "FIREBASE_CALL_FINISHED", payload: {pulledArray: dataSnapshot}}))


  // )
  // .switchMap(payload => Observable.timer(payload.seconds)
  // .switchMap( () => Observable.of({type:"TIMER_HAS_FINISHED"}))

  // .switchMap( (payload:toPayload) =>

  // console.log('payload is: ' + payload);
  // Observable.timer(2000)
  //   .switchMap(() => Observable.of({ type: "TIMER_HAS_FINISHED" })
  // );


  // @Effect() update$ = this.action$
  //   .ofType('PULL_ARRAY_FROM_FIREBASE')
  //   .switchMap( () =>

  // firebase.ref.subscribe() =>
  // Observable.
  // );
  // .switchMap( (payload:toPayload) =>

  // console.log('payload is: ' + payload);
  // Observable.timer(2000)
  //   .switchMap(() => Observable.of({ type: "TIMER_HAS_FINISHED" })
  // );


}
