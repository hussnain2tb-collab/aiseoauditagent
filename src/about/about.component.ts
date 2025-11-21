import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="prose prose-invert max-w-none animate-fade-in">
      <h1>About Us</h1>
      <p>Welcome to the SEO Audit Agent, your AI-powered partner in navigating the complexities of technical search engine optimization and website monetization.</p>
      
      <h2>Our Mission</h2>
      <p>Our mission is to democratize website optimization. We believe that everyone, from small business owners to hobby bloggers, should have access to the tools and knowledge needed to improve their online presence. We've harnessed the power of Google's Gemini model to provide expert-level analysis that is both comprehensive and easy to understand.</p>

      <h2>What We Do</h2>
      <p>This tool performs a deep-dive analysis of your website, identifying critical issues and opportunities for improvement in areas like:</p>
      <ul>
        <li>Technical SEO Health</li>
        <li>Core Web Vitals and Site Speed</li>
        <li>Mobile-Friendliness</li>
        <li>Google AdSense Readiness</li>
      </ul>
      <p>We provide clear, actionable recommendations to help you fix problems, enhance user experience, and increase your visibility in search results, ultimately preparing your site for successful monetization.</p>

      <h2>Why Choose Us?</h2>
      <p>Powered by advanced AI, our audits are systematic, thorough, and tailored to your specific goals. We translate complex technical jargon into a prioritized list of tasks, empowering you to make impactful changes with confidence. We are committed to providing a high-quality, reliable service to help you succeed online.</p>
    </div>
    <style>
        .prose h1 { @apply text-3xl font-bold mb-4 text-slate-100; }
        .prose h2 { @apply text-2xl font-bold mt-6 mb-3 text-slate-200; }
        .prose p, .prose ul { @apply mb-4 text-slate-400; }
        .prose ul { @apply list-disc list-inside; }
        .prose li { @apply mb-2; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
    </style>
  `
})
export class AboutComponent {}