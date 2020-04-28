import { Component, OnInit } from '@angular/core';
import { PqrsModel } from '../../models/pqrs.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-pqrs',
  templateUrl: './pqrs.page.html',
  styleUrls: ['./pqrs.page.scss'],
})
export class PqrsPage implements OnInit {

  pqrs: PqrsModel;

  constructor() {

    this.pqrs = new PqrsModel();

  }

  ngOnInit() {
  }

  nuevoPqrs( form: NgForm ){
    console.log('enviando PQRS');
  }

}
