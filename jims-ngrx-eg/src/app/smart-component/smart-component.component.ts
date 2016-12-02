import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-smart-component',
  templateUrl: 'smart-component.component.html',
  styleUrls: ['smart-component.component.css']
})
export class SmartComponentComponent implements OnInit {

  displayText :string = 'yessir';


  constructor() { }

  ngOnInit() {
  }

  onUpdateFromDumbComponent(event) {
    console.log('smart component heard dumb component\'s message! ' + event.value)
  }

}
