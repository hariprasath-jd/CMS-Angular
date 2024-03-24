import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/Global/Service/layout.service';
import { GlobalService } from 'src/app/Global/Service/global.service';
import { FormValidationService } from 'src/app/Shared/formValidation.service';
import { ILoginRequest } from 'src/app/Modules/CMS/User/Request/login.model';
import { UserService } from 'src/app//Area/CMS/User/User.service';
import { CaseType } from 'src/app/Shared/Helper/helper-service.service';
@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  islo: string | null | undefined;
  CMSToken: string | null | undefined;
  CaseType:CaseType =CaseType.U;
  LoginButtonLoading:boolean = false;
  public LoginRequest: ILoginRequest = {
    userName: '',
    password: '',
  };
  constructor(
    private Location: Location,
    private router: Router,
    private layout: LayoutService,
    private globalService: GlobalService,
    private ValidationService: FormValidationService,
    private userService: UserService
  ) {}
  isDarkMode = false;

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }
  ngOnInit() {
    this.layout.IsCMSNavVisible = false;
    if (this.Location.path().split('/')[1] == 'CMS') {
      if (this.globalService.GLSG('CMSToken') != null) {
        this.router.navigate(['CMS/Dashboard']);
      }
    }
  }
  ngAfterViewInit(): void {}

  public onClick(event: MouseEvent) {
    let buttonid =this.globalService.getButtonID(event);
    if (this.ValidationService.validate(event)) {
      //this.ValidationService.getValue(this.LoginRequest, event);
      this.userService.userLogin(this.LoginRequest).subscribe({
        next: (Response) => {
          if(Response.data != null){
            this.globalService.GLSS("CMSToken",JSON.stringify(Response.data));
            this.router.navigate(['CMS/Dashboard']);
          }
          this.globalService.enableButton(buttonid);
        },
      });
    }

    //this.layout.IsCMSNavVisible = true;
    //this.globalService.GLSS("Login","true")
    //this.router.navigate(['CMS/Dashboard']);
  }
}
