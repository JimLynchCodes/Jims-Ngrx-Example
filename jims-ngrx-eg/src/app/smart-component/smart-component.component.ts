import { Component, OnInit } from '@angular/core';
import {DumbComponentComponent} from "../dumb-component/dumb-component.component";

@Component({
  selector: 'app-smart-component',
  templateUrl: 'smart-component.component.html',
  styleUrls: ['smart-component.component.css'],
  // directives: [DumbComponentComponent]
})
export class SmartComponentComponent{

  displayText :string = 'yessir';


  constructor() { }

  ngOnInit() {
  }

  onUpdateFromDumbComponent(event) {
    console.log('smart component heard dumb component\'s message! ' + event.value)
  }

}
