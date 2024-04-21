import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { GlobalService } from 'src/app/Global/Service/global.service';
import { IInstitutionRequest, IPostoffice } from 'src/app/Modules/CMS/Institution/Institution';
import { InstitutionService } from './Institution.service';
@Component({
  selector: 'app-Institution',
  templateUrl: './Institution.component.html',
  styleUrls: ['./Institution.component.css']
})

export class InstitutionComponent implements OnInit {

  constructor(private globalService: GlobalService,private institutionService:InstitutionService) { }
  public request: IInstitutionRequest = {
    institutionName: '',
    address1: '',
    address2: '',
    pincode: '',
    postofficeName: '',
    districtname: '',
    stateName: '',
    emailid: '',
    mobileNumer: '',
    alternateMobileNumer: '',
    landline: '',
    institutionType: '',
    staffIdprefix: '',
    entredBy: '',
    modifiedBy: '',
    modifiedDate: undefined
  };
  public postalrequest:IPostoffice={
    Pincode: ''
  }
  triggerApi: boolean = false;
  selectedTabIndex = 0;

  onTabChange(event: MatTabChangeEvent): void {
    this.selectedTabIndex = event.index;
  }
  ngOnInit() {
    this.GetInstitutionDetails();
  }
  GetInstitutionDetails() {
    this.institutionService.getInstitutionDetails().subscribe({
      next: (Response) => {
        if (Response.data != null) {
          this.request = this.globalService.bindDataToModel(this.request, Response.data);
          this.postalrequest.Pincode = this.request.pincode;
          this.triggerApi = true;
          // if (this.request.modifiedDate) {
          //   const formattedDate = this.globalService.formatDate(this.request.modifiedDate);
          //   // Assuming you want to keep modifiedDate as a string. If not, you'll need a different approach.
          //   this.request.modifiedDate = new Date(formattedDate);
          // }
        }
      },
    });
  }
}
