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

  @Effect() pullArrayFromFirebase$ = this.action$
    .ofType('PULL_ARRAY_FROM_FIREBASE')
    .switchMap( () => {
        return this.af.database.list('/cypherapp/rooms/')
        .switchMap(result => {
          console.log('hi');
          return Observable.of({type: "GOT_FIREBASE_ARRAY", payload: {pulledArray:  result}})
          })
    })

  @Effect() pullObjectFromFirebase$ = this.action$
    .ofType('PULL_OBJECT_FROM_FIREBASE')
    .switchMap( () => {
      return this.af.database.object('/cypherapp/rooms/')
        .switchMap(result => {
          return Observable.of({type: "GOT_FIREBASE_OBJECT", payload: {pulledObject: result}})
        })
    })


}
