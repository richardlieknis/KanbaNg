import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  @Input() type: string = 'edit';
  @Input() contact: any;

  constructor() { }

  ngOnInit(): void {
    this.setFormType(this.type);
  }

  setFormType(type: string): void {
    this.type = type;
  }
}
