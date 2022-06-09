import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { GestUserService } from 'src/app/services/gest-user.service';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Validation } from 'src/app/validation/validation';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';


interface role {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  user: User = {
    username: '',
    email: '',
    role: '',
    password: ''
  };
errorMsg =""
  

  userForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    role: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl('')
  });
  submitted = false;
  errorUser = false;

  roles: role[] = [
    {value: 'Super Administrateur', viewValue: 'Super administrateur'},
    {value: 'Administrateur', viewValue: 'Administrateur'},
    {value: 'Observateur', viewValue: 'Observateur'},
  ];
  

  constructor(private route: ActivatedRoute, private router: Router,private formBuilder: FormBuilder, private gestUserService: GestUserService) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group(
      {
        username: ['',[Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]+$/)]],
        email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
        role: ['', Validators.required],
        password: ['',[Validators.required, Validators.minLength(6), Validators.pattern(/^[a-zA-Z0-9!@#$%^&*() ]+$/)]],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: [Validation.match('password', 'confirmPassword')]
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.userForm.invalid) {
      return;
    }
  }

  onReset(): void {
    this.submitted = false;
    this.userForm.reset();
  }

  saveUser(): void {
    const data = {
      username: this.user.username,
      email: this.user.email,
      role: this.user.role,
      password: this.user.password
    };
    if ((this.userForm.valid)) {
      this.gestUserService.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
            this.submitted = true;
            Swal.fire({
              title: "Ajout avec succés !",
              text: "Vous pouvez ajouter un autre utilisateur ou quitter.",
              icon: "success",
              showCancelButton: true,
              confirmButtonColor: "#00c292",
              cancelButtonColor: "#e46a76",
              confirmButtonText: "Ajouter un autre utilisateur",
              cancelButtonText: "Quitter",
            })
            .then((result) => {
              if (result.isConfirmed) {
             this.newUser();
              } else if (!(result.isConfirmed)) {
                this.router.navigate(['/admin'])
              }
            })
          },
          error: (e) => {
            console.log(e.error.message) ;
            this.errorUser = true;
            this.errorMsg="Le nom d'utilisateur ou l'email existe déjà !"
          }
        

        } );

    }
}
newUser(): void {
  this.submitted = false;
  window.location.reload();
}

}
