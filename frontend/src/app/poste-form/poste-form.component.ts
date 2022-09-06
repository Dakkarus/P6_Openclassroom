import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostesService } from '../services/postes.service';
import { Poste } from '../models/Poste.model';
import { AuthService } from '../services/auth.service';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-poste-form',
  templateUrl: './poste-form.component.html',
  styleUrls: ['./poste-form.component.scss']
})
export class PosteFormComponent implements OnInit {

  posteForm!: FormGroup;
  mode!: string;
  loading!: boolean;
  poste!: Poste;
  errorMsg!: string;
  imagePreview!: string;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private postes: PostesService,
              private auth: AuthService) { }

  ngOnInit() {
    this.loading = true;
    this.route.params.pipe(
      switchMap(params => {
        if (!params['id']) {
          this.mode = 'new';
          this.initEmptyForm();
          this.loading = false;
          return EMPTY;
        } else {
          this.mode = 'edit';
          return this.postes.getPosteById(params['id'])
        }
      }),
      tap(poste => {
        if (poste) {
          this.poste = poste;
          this.initModifyForm(poste);
          this.loading = false;
        }
      }),
      catchError(error => this.errorMsg = JSON.stringify(error))
    ).subscribe();
  }

  initEmptyForm() {
    this.posteForm = this.formBuilder.group({
      name: [null, Validators.required],
      manufacturer: [null, Validators.required],
      description: [null, Validators.required],
      image: [null, Validators.required]
    });
  }

  initModifyForm(poste: Poste) {
    this.posteForm = this.formBuilder.group({
      name: [poste.name, Validators.required],
      manufacturer: [poste.manufacturer, Validators.required],
      description: [poste.description, Validators.required],
      image: [poste.imageUrl, Validators.required],
    });

    this.imagePreview = this.poste.imageUrl;
  }

  onSubmit() {
    this.loading = true;
    const newPoste = new Poste();
    newPoste.name = this.posteForm.get('name')!.value;
    newPoste.manufacturer = this.posteForm.get('manufacturer')!.value;
    newPoste.description = this.posteForm.get('description')!.value;
    newPoste.userId = this.auth.getUserId();
    if (this.mode === 'new') {
      this.postes.createPoste(newPoste, this.posteForm.get('image')!.value).pipe(
        tap(({ message }) => {
          console.log(message);
          this.loading = false;
          this.router.navigate(['/postes']);
        }),
        catchError(error => {
          console.error(error);
          this.loading = false;
          this.errorMsg = error.message;
          return EMPTY;
        })
      ).subscribe();
    } else if (this.mode === 'edit') {
      this.postes.modifyPoste(this.poste._id, newPoste, this.posteForm.get('image')!.value).pipe(
        tap(({ message }) => {
          console.log(message);
          this.loading = false;
          this.router.navigate(['/postes']);
        }),
        catchError(error => {
          console.error(error);
          this.loading = false;
          this.errorMsg = error.message;
          return EMPTY;
        })
      ).subscribe();
    }
  }

  onFileAdded(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.posteForm.get('image')!.setValue(file);
    this.posteForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
