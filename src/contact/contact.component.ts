import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="prose prose-invert max-w-none animate-fade-in">
      <h1>Contact Us</h1>
      <p>We value your feedback and are here to help with any questions you may have. Please feel free to reach out to us.</p>
      
      <h2>Get in Touch</h2>
      <p>For all inquiries, including technical support, feedback, or questions about our service, please contact us via email. We strive to respond to all messages within 48 hours.</p>
      <p>
        <strong>Email:</strong> 
        <a href="mailto:contact@seoauditagent.com" class="text-sky-400 hover:underline">contact@seoauditagent.com</a>
      </p>

      <h2>Feedback</h2>
      <p>Your feedback is important to us. If you have suggestions on how we can improve our SEO Audit Agent, please don't hesitate to share them. We are constantly working to enhance our tool and provide the best possible experience for our users.</p>
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
export class ContactComponent {}