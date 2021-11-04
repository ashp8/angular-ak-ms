import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  lclicked:boolean = false;
  constructor(public auth: AuthService, private route: Router) { }

  handleSubmit(event:any):void{
    event.preventDefault();
    this.lclicked = true;
    let email = event.target[0].value;
    let password = event.target[1].value;
    this.auth.loginWithEmailAndPassword(email, password);
    this.changeRoutes();
  }

  changeRoutes(): void{
    this.auth.user.subscribe(user=>{
      if(user !== null){
        this.route.navigate(['/']);
      };
    });
  }

  ngOnInit(): void {
    this.changeRoutes();
  }

}
