
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-terms-and-conditions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="prose prose-invert max-w-none animate-fade-in">
      <h1>Terms and Conditions</h1>
      <p>Last updated: July 25, 2024</p>
      <p>Please read these terms and conditions carefully before using Our Service.</p>
      
      <h2>Acknowledgment</h2>
      <p>These are the Terms and Conditions governing the use of this Service. By accessing or using the Service You agree to be bound by these Terms and Conditions.</p>

      <h2>Intellectual Property</h2>
      <p>The Service and its original content, features and functionality are and will remain the exclusive property of the Company and its licensors. The Service is protected by copyright, trademark, and other laws of both the Country and foreign countries.</p>
      
      <h2>Limitation of Liability</h2>
      <p>The information provided by this Service is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability or completeness of any information on the Site.</p>
      
      <h2>Governing Law</h2>
      <p>The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.</p>
    </div>
    <style>
        .prose h1 { @apply text-3xl font-bold mb-4 text-slate-100; }
        .prose h2 { @apply text-2xl font-bold mt-6 mb-3 text-slate-200; }
        .prose p { @apply mb-4 text-slate-400; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
    </style>
  `
})
export class TermsAndConditionsComponent {}
