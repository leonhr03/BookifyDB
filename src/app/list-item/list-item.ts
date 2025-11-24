import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-list-item',
  imports: [],
  templateUrl: './list-item.html',
  styleUrl: './list-item.css',
})
export class ListItem {
  @Input() book: any;
  @Input() section: any;

  @Output() lend = new EventEmitter<void>();

  onLend(){
    this.lend.emit()
  }

}
