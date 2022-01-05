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
interface Ammount{
  name: number;
}

interface Debit{
  displayName: string | undefined | null;
  ammount: number;
  name: string | undefined;
  description?: string | null;
  date: string;
  id: string;
}

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
  onlydate: string =`${this.date.getMonth()+1}-${this.date.getFullYear()}`;
  config?: Observable<any>;
  total: number = 0;
  
  constructor(private auth: AuthService, private route: Router, private db: AngularFireDatabase) { 
    this.config = this.db.object('config').valueChanges();
    this.config.subscribe(data=>{
      this.list = this.db.list(`data/${data.date}`).valueChanges();
      this.onlydate = data.date;
      this.list.subscribe(n=>{
        this.total = 0;
        n.forEach((s: any)=>{
          this.total += !isNaN(s.price)?parseInt(s.price): 0;
        });
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

  updateUser(): void{
    firebase.auth().currentUser?.updateProfile({
      displayName: "Porag",
      photoURL: "https://scontent.fjsr6-1.fna.fbcdn.net/v/t1.6435-9/86347626_795833770904755_6751762101972238336_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=8bfeb9&_nc_eui2=AeHgBAwkvobAAIDZqdnWba9z0ysjWFiUcbjTKyNYWJRxuPbMxHg2ytaFP9XL824IKcuqow9NM-ELK0v850Kwe6Mo&_nc_ohc=ZRtmv_PvMbcAX9ffuG_&tn=Ai_EjT0K837rsv0o&_nc_ht=scontent.fjsr6-1.fna&oh=00_AT9PJ_K35ZteGr5lveeBArglgBn0RbGGGj-9E8GDFQLnmw&oe=61FCEDF5",
    }).then(()=>{}, err=>{console.log(err)});
  };

  addData(): void{
    let guid = this.db.createPushId();
    if(isNaN(this.price)){
      this.price = 0;
    }
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
      <div class="grid gap-4 w-auto grid-cols-3 my-20 p-5  bottom-0 text-gray-700 rounded-md shadow-md bg-gray-100">
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
    this.config.subscribe(data=>{
      this.current = data.date;
    });
  }
  reset(): void{
    let dt = new Date();
    let dts = `${dt.getMonth() + 1}-${dt.getFullYear()}`;
    this.db.object('config').set({flag: "current", date: dts});
  }
  set(): void{
    this.db.object('config').update({flag: "!current", date: this.current});
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

@Component({
    selector: "app-debit",
    templateUrl: './debits.component.html',
    styleUrls: ['./manager.component.css']
  }
)
export class DebitComponents implements OnInit{
  name: string = "nayon";
  ammount: number = 0;
  date: Date = new Date();
  onlydate: string =`${this.date.getMonth()+1}-${this.date.getFullYear()}`;
  list?: Observable<any>;
  config?: Observable<any>;
  ammountList: any = {nayon: 0,ashis: 0,monojit: 0,porag: 0};


  constructor(private auth: AuthService, private route: Router, private db: AngularFireDatabase){
    this.config = this.db.object('config').valueChanges();
    this.config.subscribe(data=>{
      this.list = this.db.list(`debits/${data.date}`).valueChanges();
      this.onlydate = data.date;
      this.list.subscribe(n=>{
        this.ammountList = {nayon: 0,ashis: 0,monojit: 0,porag: 0};
        n.forEach((s: any)=>{
          this.ammountList[s.name] += !isNaN(s.ammount) ? parseInt(s.ammount) : 0;
        });
      });
      
    });
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
    if(isNaN(this.ammount)){
      this.ammount = 0;
    }
    const obj:Debit = {
      id: guid,
      ammount: this.ammount,
      name: this.name,
      date: this.date.toISOString(),
      displayName:firebase.auth().currentUser?.displayName
    };
    this.db.object(`debits/${this.onlydate}/${guid}`).set(obj).then(_=>{
      console.log("succeeddeed");
    }).catch(err=>{
      console.log(err);
    });
    ;  
  };

  delete(id: string){
    this.db.object(`debits/${this.onlydate}/${id}`).remove();
  }


  ngOnInit(){
    this.changeRoutes();
  }
}