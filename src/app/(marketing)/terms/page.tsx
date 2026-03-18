"use client";

import * as React from "react";
import Link from "next/link";
import { FileText, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-12 sm:py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="neutral" className="mb-4">
            <FileText className="h-3 w-3 mr-1" />
            Legal
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Terms of Service
          </h1>
          <div className="flex items-center gap-4 text-sm text-text-muted">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Last updated: March 1, 2026
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="bg-bg-elevated rounded-lg p-6 mb-8">
              <p className="text-text-secondary m-0">
                <strong className="text-text-primary">Summary:</strong> By using Optimus SEO, you agree to these terms. 
                Use our service responsibly, pay for what you use, and respect others' rights.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-text-secondary mb-4">
              By accessing or using Optimus SEO ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
              If you disagree with any part of the terms, you may not access the Service.
            </p>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">2. Description of Service</h2>
            <p className="text-text-secondary mb-4">
              Optimus SEO is an AI-powered SEO operations platform that provides:
            </p>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li>AI visibility tracking across search engines and LLMs</li>
              <li>Keyword research and tracking</li>
              <li>Technical SEO auditing</li>
              <li>Competitor analysis</li>
              <li>Content optimization tools</li>
              <li>Automated reporting and insights</li>
            </ul>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">3. Account Registration</h2>
            <p className="text-text-secondary mb-4">
              To use certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">4. Subscription and Billing</h2>
            <h3 className="text-lg font-medium text-text-primary mt-6 mb-3">4.1 Subscription Plans</h3>
            <p className="text-text-secondary mb-4">
              We offer various subscription plans as described on our pricing page. Features and limits 
              vary by plan. We reserve the right to modify plans with 30 days notice.
            </p>
            <h3 className="text-lg font-medium text-text-primary mt-6 mb-3">4.2 Payment</h3>
            <p className="text-text-secondary mb-4">
              You agree to pay all fees associated with your subscription plan. Payments are processed 
              through Stripe. All fees are non-refundable except as required by law or as explicitly 
              stated in these Terms.
            </p>
            <h3 className="text-lg font-medium text-text-primary mt-6 mb-3">4.3 Automatic Renewal</h3>
            <p className="text-text-secondary mb-4">
              Subscriptions automatically renew unless cancelled before the renewal date. You can 
              cancel at any time through your account settings.
            </p>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">5. Acceptable Use</h2>
            <p className="text-text-secondary mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li>Use the Service for any illegal purpose</li>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit malware or harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Scrape or collect data without authorization</li>
              <li>Resell or redistribute the Service without permission</li>
              <li>Use the Service to harm competitors unfairly</li>
            </ul>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">6. Intellectual Property</h2>
            <h3 className="text-lg font-medium text-text-primary mt-6 mb-3">6.1 Our Property</h3>
            <p className="text-text-secondary mb-4">
              The Service, including all content, features, and functionality, is owned by Optimus SEO 
              and protected by copyright, trademark, and other intellectual property laws.
            </p>
            <h3 className="text-lg font-medium text-text-primary mt-6 mb-3">6.2 Your Content</h3>
            <p className="text-text-secondary mb-4">
              You retain ownership of content you submit to the Service. By submitting content, you 
              grant us a license to use, store, and process it to provide the Service.
            </p>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">7. Data and Privacy</h2>
            <p className="text-text-secondary mb-4">
              Your use of the Service is also governed by our <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>. 
              By using the Service, you consent to our collection and use of data as described therein.
            </p>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">8. Third-Party Services</h2>
            <p className="text-text-secondary mb-4">
              The Service may integrate with third-party services (e.g., Google Search Console, DataForSEO). 
              Your use of these integrations is subject to the respective third-party terms. We are not 
              responsible for third-party services.
            </p>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">9. Disclaimers</h2>
            <p className="text-text-secondary mb-4">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE:
            </p>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li>Specific SEO results or rankings</li>
              <li>Accuracy of third-party data</li>
              <li>Uninterrupted or error-free service</li>
              <li>That the Service will meet all your requirements</li>
            </ul>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">10. Limitation of Liability</h2>
            <p className="text-text-secondary mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, OPTIMUS SEO SHALL NOT BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, 
              WHETHER INCURRED DIRECTLY OR INDIRECTLY.
            </p>
            <p className="text-text-secondary mb-4">
              Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">11. Indemnification</h2>
            <p className="text-text-secondary mb-4">
              You agree to indemnify and hold harmless Optimus SEO from any claims, damages, or expenses 
              arising from your use of the Service or violation of these Terms.
            </p>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">12. Termination</h2>
            <p className="text-text-secondary mb-4">
              We may terminate or suspend your account immediately, without prior notice, for conduct 
              that we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>
            <p className="text-text-secondary mb-4">
              Upon termination, your right to use the Service will cease immediately. You may export 
              your data within 30 days of termination.
            </p>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">13. Changes to Terms</h2>
            <p className="text-text-secondary mb-4">
              We reserve the right to modify these Terms at any time. We will provide notice of material 
              changes via email or through the Service. Continued use after changes constitutes acceptance.
            </p>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">14. Governing Law</h2>
            <p className="text-text-secondary mb-4">
              These Terms shall be governed by the laws of the State of California, without regard to 
              conflict of law principles. Any disputes shall be resolved in the courts of San Francisco County.
            </p>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">15. Contact</h2>
            <p className="text-text-secondary mb-4">
              For questions about these Terms, please contact us at:
            </p>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li>Email: legal@optimusseo.ai</li>
              <li>Address: 123 Innovation Drive, San Francisco, CA 94105</li>
            </ul>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-text-muted">
                See also: <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link> | 
                <Link href="/cookies" className="text-accent hover:underline ml-1">Cookie Policy</Link> | 
                <Link href="/sla" className="text-accent hover:underline ml-1">SLA</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
