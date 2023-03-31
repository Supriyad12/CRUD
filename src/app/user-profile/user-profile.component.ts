import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../service/api.service';
import { UserRegistrationComponent } from '../user-registration/user-registration.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userData = {
    "id": 0,
    "UploadPic": "",
    "f_name": "",
    "l_name": "",
    "email": "",
    "mobile": "",
    "age": 20,
    "state": "",
    "country": "",
    "address": "",
    "address_line1": "",
    "address_line2": "",
    "subscribe_to_newsletter": false,
    "hobbies": ""
  };
  userId = '';

  constructor(private api: ApiService, private dialog: MatDialog, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.userId = params['id'];
    });
    console.log("Call profile page constructor");
  }

  ngOnInit(): void {
    console.log("Call profile page ngOnInit");
    this.getUserData(this.userId);
  }

  getUserData(userId: any) {
    this.api.getUserById(userId)
      .subscribe({
        next: (res) => {
          this.userData = res;
        },
        error: (err) => {
          //this.userData = {};
        }
      });
  }

  openDialog(userId: any) {
    const dialogRef = this.dialog.open(UserRegistrationComponent, {
      data: {
        width: '30%',
        userData: this.userData
      }
    })
    dialogRef.afterClosed().subscribe(() => {
      this.getUserData('1');
    });
  }

  handleImageSelect(e: Event) {
    let input = e.target as HTMLInputElement;
    let file = (input.files as FileList)[0];
    console.log(file);
    if (file) {
      if (file.size > 500000) {
        console.log("File Size");
      } else {
        if (file.type.split("/")[0] === "image") {
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event: any) => {
            this.userData.UploadPic = event.target.result;
            this.updateProfilePic();
          }
        } else {
          console.log("File Type");
        }
      }
    }
  }
  updateProfilePic() {
    this.api.putData(this.userData, this.userData.id).subscribe({
      next: (res) => {
        alert("User profile image updated sucessfully...!!!");
        this.userData = res;
      },
      error: () => {
        alert("Error while adding the register");
      }
    })
  }
}
