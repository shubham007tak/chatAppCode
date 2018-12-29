import { Component, OnInit } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
// import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../app.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public firstName: any;
  public lastName: any;
  public mobile: any;
  public email: any;
  public password: any;
  public apiKey: any;


  constructor(public appService: AppService, public router: Router, private toastr: ToastrService, vcr: ViewContainerRef) {

    // this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    console.log("signup oninit called");
   }

  public goToSignIn: any = () => {
    this.router.navigate(['/']);

  }

  public signUpFunction: any = () => {
    if (!this.firstName) {
      this.toastr.warning('enter first name');
    }
    else if (!this.lastName) {
      this.toastr.warning('enter last name');
    }
    else if (!this.mobile) {
      this.toastr.warning('enter mobile');
    }
    else if (!this.email) {
      this.toastr.warning('enter email');
    }
    else if (!this.password) {
      this.toastr.warning('enter password');
    }
    else if (!this.apiKey) {
      this.toastr.warning('enter api key');
    }

    else {
      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobile: this.mobile,
        email: this.email,
        password: this.password,
        apiKey: this.apiKey

      }
      console.log("the data entered by user is");
      console.log(data);
      this.appService.signUpFunction(data).subscribe((apiResponse) => {
        console.log("the response from api is");
        console.log(apiResponse);
        if (apiResponse.status === 200) {
          this.toastr.success('sign up successful');
          setTimeout(() => { this.goToSignIn(); }, 2000);
        }
        else{
          this.toastr.error('some error occured');
        }
      });
    }
  }

}
