import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HistoryComponent } from './history/history.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent, title: 'SEO Audit Agent' },
  { path: 'history', component: HistoryComponent, title: 'Audit History' },
  { path: 'about', component: AboutComponent, title: 'About Us' },
  { path: 'contact', component: ContactComponent, title: 'Contact Us' },
  { path: 'privacy-policy', component: PrivacyPolicyComponent, title: 'Privacy Policy' },
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent, title: 'Terms & Conditions' },
  { path: 'disclaimer', component: DisclaimerComponent, title: 'Disclaimer' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];