"use client";

import * as React from "react";
import Link from "next/link";
import { Shield, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-12 sm:py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="neutral" className="mb-4">
            <Shield className="h-3 w-3 mr-1" />
            Legal
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Privacy Policy
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
                <strong className="text-text-primary">Summary:</strong> We collect only what we need to provide our service, 
                we never sell your data, and you can delete your account and data at any time.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-text-secondary mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              use our services, or contact us for support.
            </p>
            <h3 className="text-lg font-medium text-text-primary mt-6 mb-3">Account Information</h3>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li>Name and email address</li>
              <li>Company name and website URL</li>
              <li>Billing information (processed securely by Stripe)</li>
              <li>Profile preferences and settings</li>
            </ul>
            <h3 className="text-lg font-medium text-text-primary mt-6 mb-3">Usage Information</h3>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li>Projects and websites you analyze</li>
              <li>Keywords and competitors you track</li>
              <li>Reports and exports you generate</li>
              <li>Feature usage and interaction data</li>
            </ul>
            <h3 className="text-lg font-medium text-text-primary mt-6 mb-3">Technical Information</h3>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li>IP address and device information</li>
              <li>Browser type and operating system</li>
              <li>Log data and analytics</li>
            </ul>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-text-secondary mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, investigate, and prevent security incidents</li>
              <li>Personalize and improve your experience</li>
            </ul>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">3. Information Sharing</h2>
            <p className="text-text-secondary mb-4">
              We do not sell, trade, or rent your personal information to third parties. 
              We may share information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li><strong>Service Providers:</strong> With vendors who assist in providing our services (hosting, analytics, payment processing)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share</li>
            </ul>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">4. Data Security</h2>
            <p className="text-text-secondary mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li>All data is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
              <li>Regular security audits and penetration testing</li>
              <li>SOC 2 Type II certified infrastructure</li>
              <li>Multi-factor authentication available for all accounts</li>
              <li>Role-based access controls for team accounts</li>
            </ul>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">5. Data Retention</h2>
            <p className="text-text-secondary mb-4">
              We retain your information for as long as your account is active or as needed to provide services. 
              You can request deletion of your data at any time by contacting support or using the account settings.
            </p>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">6. Your Rights</h2>
            <p className="text-text-secondary mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your data</li>
              <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
              <li><strong>Objection:</strong> Object to certain processing activities</li>
              <li><strong>Restriction:</strong> Request limited processing of your data</li>
            </ul>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">7. International Transfers</h2>
            <p className="text-text-secondary mb-4">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place, including Standard Contractual Clauses 
              approved by the European Commission.
            </p>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">8. Children's Privacy</h2>
            <p className="text-text-secondary mb-4">
              Our services are not directed to individuals under 16. We do not knowingly collect 
              personal information from children. If we become aware of such collection, we will 
              delete the information immediately.
            </p>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">9. Changes to This Policy</h2>
            <p className="text-text-secondary mb-4">
              We may update this privacy policy from time to time. We will notify you of any changes 
              by posting the new policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">10. Contact Us</h2>
            <p className="text-text-secondary mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li>Email: privacy@optimusseo.ai</li>
              <li>Address: 123 Innovation Drive, San Francisco, CA 94105</li>
            </ul>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-text-muted">
                See also: <Link href="/terms" className="text-accent hover:underline">Terms of Service</Link> | 
                <Link href="/cookies" className="text-accent hover:underline ml-1">Cookie Policy</Link> | 
                <Link href="/security" className="text-accent hover:underline ml-1">Security</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
