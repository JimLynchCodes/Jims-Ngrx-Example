import { Injectable } from '@angular/core';

@Injectable()
export class TestService {

  public derpOut() {
    console.log('we derping from the real thing!');
  }

  constructor() { }

}
