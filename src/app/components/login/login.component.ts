import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.services';
import * as bcrypt from 'bcryptjs'; // Importa la biblioteca de encriptación

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  })

  constructor(private fb: FormBuilder, private authService: AuthService,
    private messageService: MessageService,
    private router: Router){
  }

  get email(){
    return this.loginForm.controls['email']
  }

  get password(){
    return this.loginForm.controls['password']
  }

  togglePasswordVisibility(passwordInput: HTMLInputElement) {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
  }

  login(){
    const {email, password} = this.loginForm.value;

    // Verifica que la contraseña no sea null ni undefined antes de continuar
    if (password) {
      this.authService.getUserByEmail(email as string).subscribe(
        response => {
          if(response.length > 0){
            // Compara la contraseña ingresada con la contraseña almacenada en la base de datos
            const user = response[0];
            const isPasswordCorrect = bcrypt.compareSync(password, user.password);
            if(isPasswordCorrect){
              sessionStorage.setItem('email', email as string);
              this.router.navigate(['/home']);
            } else {
              this.messageService.add({severity: 'error', summary: 'Error', detail: 'Email o Contraseña Incorrectos'});
            }
          } else {
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Email o Contraseña Incorrectos'});
          }
        },
        error =>{
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Email o contraseña incorrectos'});
        }
      )
    } else {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Ingrese una contraseña'});
    }
  }
}

