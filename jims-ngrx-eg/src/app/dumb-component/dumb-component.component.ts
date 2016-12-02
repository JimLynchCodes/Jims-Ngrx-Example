import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-dumb-component',
  templateUrl: './dumb-component.component.html',
  styleUrls: ['./dumb-component.component.css'],
})
export class DumbComponentComponent implements OnInit {
  @Input() displayText: string;

  @Output() update = new EventEmitter();

  constructor() { }

  ngOnInit() {

    this.update.emit({value:"OH YEAHH BOYYY"})

  }

}
