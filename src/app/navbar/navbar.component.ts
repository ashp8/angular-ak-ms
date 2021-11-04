import { Component, OnInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  host:{
    '(document:click)': 'closeDropDown($event)',
  }
})

export class NavbarComponent implements OnInit {
  stype: number = 0;
  hidden: boolean = true;
  ndrop:boolean = true;
  constructor(private _eref: ElementRef, public auth: AuthService) { }

  selectOne(n:number):void{
    this.stype = n;
    this.ndrop = true;
  }

  logout(): void{
    this.auth.signOut();
  }

  closeDropDown(event: any): void{
    if(!this._eref.nativeElement.contains(event.target)){
      this.ndrop = true;
      this.hidden = true;
    }
  }

  showndd(): void{
    this.ndrop = !this.ndrop;
  }

  showdd():void{
    this.hidden = !this.hidden;
  }

  ngOnInit(): void {
  }

}
