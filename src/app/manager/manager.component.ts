import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import firebase from '@firebase/app-compat';
import { Observable } from 'rxjs';

interface Purchase{
  displayName: string | undefined | null;
  price: number;
  name: string | undefined;
  description?:string | null;
  date: string;
  id: string;
};

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {
  name: string | undefined;
  price: number = 0;
  date: Date = new Date();
  list?: Observable<any>;
  nayon:number = 0;
  ash:number = 0;
  diff: number = 0;
  onlydate: string =`${this.date.getMonth()+1}-${this.date.getFullYear()}`;
  config?: Observable<any>;
  
  constructor(private auth: AuthService, private route: Router, private db: AngularFireDatabase) { 
    this.config = this.db.object('config').valueChanges();
    this.config.subscribe(data=>{
      this.list = this.db.list(`data/${data.date}`).valueChanges();
      this.onlydate = data.date;
      this.list.subscribe(n=>{
        n.forEach((s: any)=>{
          if(s.displayName === "Ashis"){
            this.ash += parseInt(s.price);
          }else if(s.displayName === "Nayon"){
            this.nayon += parseInt(s.price);
          }
        });
        this.diff = Math.abs(this.nayon - this.ash);
      });
      
    })
    
  }

  changeRoutes(): void{
    this.auth.user.subscribe(user=>{
      if(user === null){
        this.route.navigate(['/login']);
      };
    });
  }

  addData(): void{
    let guid = this.db.createPushId();
    const obj:Purchase = {
      id: guid,
      price: this.price,
      name: this.name,
      date: this.date.toISOString(),
      displayName:firebase.auth().currentUser?.displayName
    };
    this.db.object(`data/${this.onlydate}/${guid}`).set(obj).then(_=>{
      console.log("succeeddeed");
    }).catch(err=>{
      console.log(err);
    });
    ;  
  };

  delete(id: string){
    this.db.object(`data/${this.onlydate}/${id}`).remove();
  }

  ngOnInit(): void {
    this.changeRoutes();
  }

 

}

@Component({
  selector: 'app-settings',
  template: `
    <div class="p-4 h-screen bg-gradient-to-r from-green-500 to-blue-600">
      <div class="grid gap-4 grid-cols-3 m-20 p-5  bottom-0 text-gray-700 rounded-md shadow-md bg-gray-100">
        <input class="inps" type="text" placeholder="hello hi" [(ngModel)]="current" />
        <button (click)=set() style="color:white;" class="btn bg-pink-300">Set</button>
        <button (click)="reset()" style="color:white;" class="btn bg-pink-300">Reset</button>
      </div>
    </div>
  `,
  styleUrls: ['./manager.component.css']
})
export class SettingsComponent implements OnInit{
  current: string = "current";
  config?: Observable<any>;

  constructor(public db: AngularFireDatabase, private auth: AuthService, private route: Router){
    this.config = this.db.object('config').valueChanges();
  }
  reset(): void{
    let dt = new Date();
    let dts = `${dt.getMonth() + 1}-${dt.getFullYear()}`;
    this.db.object('config').set({flag: "current", date: dts});
  }
  set(): void{
    this.config?.subscribe(data=>{
      this.db.object('config').update({flag: "!current", date: this.current});
    });
  }
  changeRoutes(): void{
    this.auth.user.subscribe(user=>{
      if(user === null){
        this.route.navigate(['/login']);
      };
    });
  }


  ngOnInit(){
    this.changeRoutes();
  }
}