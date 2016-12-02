import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { mainReducer } from "./state-management/reducers/main-reducer";
import { StoreModule } from "@ngrx/store";
import {MainEffects} from "./state-management/effects/main-effects";
import {EffectsModule} from "@ngrx/effects";
import { AngularFireModule } from 'angularfire2';
import { SmartComponentComponent } from './smart-component/smart-component.component';
import { DumbComponentComponent } from './dumb-component/dumb-component.component';


export const firebaseConfig = {
  apiKey: "AIzaSyA30SGQ-4ozFHftYzsHlQxFdqVgbvuaLVU",
  authDomain: "cypherapp-ef93a.firebaseapp.com",
  databaseURL: "https://cypherapp-ef93a.firebaseio.com",
  storageBucket: "cypherapp-ef93a.appspot.com",
  messagingSenderId: "550160402640"
};


@NgModule({
  declarations: [
    AppComponent,
    SmartComponentComponent,
    DumbComponentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    StoreModule.provideStore({mainReducer}),
    EffectsModule.run(MainEffects),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
