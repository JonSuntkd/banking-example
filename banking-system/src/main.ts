import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { routes } from './app/app.routes';
import { APP_PROVIDERS } from './app/app.providers';

bootstrapApplication(AppComponent, {
  providers: [
    ...APP_PROVIDERS,
    importProvidersFrom(
      HttpClientModule,
      ReactiveFormsModule,
      FormsModule,
      RouterModule.forRoot(routes)
    )
  ]
}).catch((err: unknown) => console.error(err));