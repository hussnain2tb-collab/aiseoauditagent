import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';
import { AuditResult } from '../interfaces/seo-audit.interface';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private genAI: GoogleGenAI;
  
  private readonly auditItemSchema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A concise title for the issue, prefixed with a category tag." },
      issue: { type: Type.STRING, description: "A clear explanation of what's wrong and why it matters for the audit goal." },
      fix: { type: Type.STRING, description: "Step-by-step, actionable instructions on how to fix the issue." },
      outcome: { type: Type.STRING, description: "The expected positive outcome after the fix is implemented." },
      validation: { type: Type.STRING, description: "How the user can validate that the fix has been successfully applied." },
    },
    required: ["title", "issue", "fix", "outcome", "validation"]
  };

  private readonly responseSchema = {
      type: Type.OBJECT,
      properties: {
        criticalIssues: { 
          type: Type.ARRAY, 
          items: this.auditItemSchema,
          description: "High-impact issues that will likely cause AdSense rejection. These are 'FAIL' items."
        },
        importantOptimizations: { 
          type: Type.ARRAY, 
          items: this.auditItemSchema,
          description: "Medium-impact issues that should be addressed before submission. These are 'REVIEW' items."
        },
        recommendedEnhancements: { 
          type: Type.ARRAY, 
          items: this.auditItemSchema,
          description: "Low-impact improvements or confirmations of good practices. These are 'PASS' items."
        },
      },
      required: ["criticalIssues", "importantOptimizations", "recommendedEnhancements"]
  };

  constructor() {
    this.genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private async executeAudit(prompt: string): Promise<AuditResult> {
     try {
      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: this.responseSchema,
        },
      });
      
      const jsonText = response.text.trim();
      return JSON.parse(jsonText) as AuditResult;
    } catch (error) {
      console.error('Error generating audit:', error);
      throw new Error('Failed to generate audit. Please check your API key and try again.');
    }
  }

  async generateAudit(url: string, goal: string): Promise<AuditResult> {
    const prompt = `
      Act as a world-class Senior Technical SEO Specialist with over 12 years of hands-on experience.
      Your analysis must be systematic, data-driven, and highly actionable.

      Analyze the website at the URL "${url}" with the user's primary goal being "${goal}".
      Perform a comprehensive technical SEO audit. Focus on these key areas:
      1. Site speed & Core Web Vitals (LCP, FID, CLS)
      2. Crawlability (robots.txt, XML sitemaps, indexation)
      3. Mobile responsiveness & optimization
      4. HTTPS and security setup
      5. Structured data & schema markup
      6. Internal linking architecture
      7. Duplicate content & canonical tags
      8. Meta tags & heading hierarchy

      Present your findings as a JSON object. Base your recommendations on general best practices for a website like the one provided. Do not invent specific metrics, but provide realistic, expert-level advice. Your language must be clear, concise, and professional.
    `;
    return this.executeAudit(prompt);
  }

  async generateAdsenseAudit(url: string): Promise<AuditResult> {
    const prompt = `
      Act as an expert Google AdSense Policy Specialist with deep knowledge of website approval criteria.
      Your task is to perform a pre-approval audit of the website at "${url}" to maximize its chances of getting AdSense approval on the first attempt.

      Analyze the website based on the following critical AdSense pillars:
      1.  **Content Quality**: Is the content unique, valuable, substantial, and original? Check for thin or scraped content.
      2.  **User Experience**: Is the site easy to navigate? Is it mobile-friendly? Is the layout clean and professional?
      3.  **Required Pages**: Does the site have an easily accessible Privacy Policy, About Us, and Contact Us page?
      4.  **Policy Compliance**: Scan for any content or practices that violate AdSense policies (e.g., prohibited content, intrusive ads, etc.).

      Present your findings as a JSON object. For EVERY SINGLE item you identify (whether it's a pass, review, or fail), you MUST prefix its 'title' field with one of the four category tags below. This is mandatory.
      - [Content Quality]
      - [User Experience]
      - [Required Pages]
      - [Policy Compliance]
      
      Example title: "[Content Quality] Site has unique, high-value articles."

      Place items that are critical failures (will likely cause rejection) in 'criticalIssues'.
      Place items that need review (could cause rejection) in 'importantOptimizations'.
      Place items that are good (meeting requirements) in 'recommendedEnhancements' to confirm what is done correctly.
    `;
    return this.executeAudit(prompt);
  }
}