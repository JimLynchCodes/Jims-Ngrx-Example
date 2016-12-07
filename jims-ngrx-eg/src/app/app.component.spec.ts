/* tslint:disable:no-unused-variable */
import { Injectable } from '@angular/core';
import { TestBed, async} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {SmartComponentComponent} from "./smart-component/smart-component.component";
import {DumbComponentComponent} from "./dumb-component/dumb-component.component";
import {mainReducer} from "./state-management/reducers/main-reducer";
import { StoreModule } from "@ngrx/store";
import { Store } from "@ngrx/store";
import {TestService} from "./test.service";
import { Observable } from 'rxjs/Observable';


@Injectable()
export class MockTestService {

  public derpOut() {
    console.log('we derping from the mock!');
  }

  constructor() { }

}



class MockStore {
  public dispatch(obj) {
    console.log('dispatching from the mock store!')
  }

  public select(obj) {
    console.log('selecting from the mock store!')

    return Observable({});
  }
}


describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        SmartComponentComponent,
        DumbComponentComponent,
      ],
      imports: [
        StoreModule.provideStore({mainReducer})
      ],
      providers: [
        { provide: TestService, useClass: MockTestService },
        {provide: Store, useClass: MockStore}
      ]
    });
  });


  // beforeEach(() => addProviders([
  //   {provide: Store, useClass: MockStore}
  // ]));MockStore

  it('should create the app', async(() => {
    // var spy = spyOn(Store, "dispatch").and.callFake(

    Object.defineProperty(Store, 'dispatch',
      function () {
        console.log("Faking the Dispatch!")
      });

    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  // it(`should have as title 'app works!'`, async(() => {
  //   let fixture = TestBed.createComponent(AppComponent);
  //   let app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('app works!');
  // }));
  //
  // it('should render title in a h1 tag', async(() => {
  //   let fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   let compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('app works!');
  // }));
});
