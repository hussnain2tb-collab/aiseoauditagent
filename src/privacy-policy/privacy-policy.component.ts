
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="prose prose-invert max-w-none animate-fade-in">
      <h1>Privacy Policy</h1>
      <p>Last updated: July 25, 2024</p>
      <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
      
      <h2>Interpretation and Definitions</h2>
      <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
      
      <h2>Collecting and Using Your Personal Data</h2>
      <p>We do not collect any personal data. All data related to your audits is stored locally in your browser and is not transmitted to our servers.</p>
      
      <h2>Cookies and Tracking Technologies</h2>
      <p>We do not use cookies or similar tracking technologies to track the activity on Our Service.</p>

      <h2>Third-Party Services</h2>
      <p>This service uses Google Gemini API to process your requests. Your interactions with the API are subject to Google's privacy policy.</p>

      <h2>Changes to this Privacy Policy</h2>
      <p>We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.</p>

      <h2>Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, You can contact us by visiting the contact page on our website.</p>
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
export class PrivacyPolicyComponent {}
