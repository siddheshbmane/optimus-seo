"use client";

import * as React from "react";
import Link from "next/link";
import { Cookie, Calendar, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const cookieTypes = [
  {
    name: "Essential Cookies",
    description: "Required for the website to function properly. Cannot be disabled.",
    examples: ["Session management", "Authentication", "Security tokens", "Load balancing"],
    required: true,
  },
  {
    name: "Functional Cookies",
    description: "Enable enhanced functionality and personalization.",
    examples: ["Language preferences", "Theme settings", "Saved filters", "Recent searches"],
    required: false,
  },
  {
    name: "Analytics Cookies",
    description: "Help us understand how visitors interact with our website.",
    examples: ["Page views", "Feature usage", "Error tracking", "Performance metrics"],
    required: false,
  },
  {
    name: "Marketing Cookies",
    description: "Used to track visitors across websites for advertising purposes.",
    examples: ["Ad targeting", "Campaign tracking", "Conversion tracking", "Retargeting"],
    required: false,
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-12 sm:py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="neutral" className="mb-4">
            <Cookie className="h-3 w-3 mr-1" />
            Legal
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Cookie Policy
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
                <strong className="text-text-primary">Summary:</strong> We use cookies to make our service work, 
                remember your preferences, and understand how you use Optimus SEO. You can control most cookies 
                through your browser settings.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">What Are Cookies?</h2>
            <p className="text-text-secondary mb-4">
              Cookies are small text files that are stored on your device when you visit a website. 
              They are widely used to make websites work more efficiently and provide information to 
              website owners.
            </p>
            <p className="text-text-secondary mb-4">
              We also use similar technologies like local storage, session storage, and pixels, which 
              function similarly to cookies. This policy covers all these technologies.
            </p>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">Types of Cookies We Use</h2>
          </div>

          {/* Cookie Types Cards */}
          <div className="grid gap-4 my-8">
            {cookieTypes.map((type, index) => (
              <Card key={index} className="bg-bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-text-primary">{type.name}</h3>
                    <Badge variant={type.required ? "accent" : "neutral"}>
                      {type.required ? "Required" : "Optional"}
                    </Badge>
                  </div>
                  <p className="text-text-secondary mb-4">{type.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {type.examples.map((example, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-bg-elevated rounded text-text-muted"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">Specific Cookies We Use</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-text-primary font-semibold">Cookie Name</th>
                    <th className="text-left py-3 px-4 text-text-primary font-semibold">Purpose</th>
                    <th className="text-left py-3 px-4 text-text-primary font-semibold">Duration</th>
                    <th className="text-left py-3 px-4 text-text-primary font-semibold">Type</th>
                  </tr>
                </thead>
                <tbody className="text-text-secondary">
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-mono text-xs">optimus_session</td>
                    <td className="py-3 px-4">User authentication</td>
                    <td className="py-3 px-4">Session</td>
                    <td className="py-3 px-4">Essential</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-mono text-xs">optimus_csrf</td>
                    <td className="py-3 px-4">Security token</td>
                    <td className="py-3 px-4">Session</td>
                    <td className="py-3 px-4">Essential</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-mono text-xs">optimus_theme</td>
                    <td className="py-3 px-4">Theme preference</td>
                    <td className="py-3 px-4">1 year</td>
                    <td className="py-3 px-4">Functional</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-mono text-xs">_ga</td>
                    <td className="py-3 px-4">Google Analytics</td>
                    <td className="py-3 px-4">2 years</td>
                    <td className="py-3 px-4">Analytics</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-mono text-xs">_gid</td>
                    <td className="py-3 px-4">Google Analytics</td>
                    <td className="py-3 px-4">24 hours</td>
                    <td className="py-3 px-4">Analytics</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-mono text-xs">intercom-id</td>
                    <td className="py-3 px-4">Customer support chat</td>
                    <td className="py-3 px-4">9 months</td>
                    <td className="py-3 px-4">Functional</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">Managing Cookies</h2>
            <p className="text-text-secondary mb-4">
              You can control and manage cookies in several ways:
            </p>
            <h3 className="text-lg font-medium text-text-primary mt-6 mb-3">Browser Settings</h3>
            <p className="text-text-secondary mb-4">
              Most browsers allow you to refuse or accept cookies, delete existing cookies, and set 
              preferences for certain websites. Here are links to manage cookies in popular browsers:
            </p>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li><a href="https://support.google.com/chrome/answer/95647" className="text-accent hover:underline" target="_blank" rel="noopener">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" className="text-accent hover:underline" target="_blank" rel="noopener">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" className="text-accent hover:underline" target="_blank" rel="noopener">Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-accent hover:underline" target="_blank" rel="noopener">Microsoft Edge</a></li>
            </ul>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-3">Cookie Preferences</h3>
            <p className="text-text-secondary mb-4">
              You can update your cookie preferences at any time using our cookie settings panel:
            </p>
          </div>

          {/* Cookie Settings Button */}
          <div className="my-8">
            <Button variant="secondary" className="gap-2">
              <Settings className="h-4 w-4" />
              Open Cookie Settings
            </Button>
          </div>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-lg font-medium text-text-primary mt-6 mb-3">Opt-Out Links</h3>
            <p className="text-text-secondary mb-4">
              You can opt out of specific third-party cookies:
            </p>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li><a href="https://tools.google.com/dlpage/gaoptout" className="text-accent hover:underline" target="_blank" rel="noopener">Google Analytics Opt-out</a></li>
              <li><a href="https://www.youronlinechoices.com/" className="text-accent hover:underline" target="_blank" rel="noopener">Your Online Choices (EU)</a></li>
              <li><a href="https://optout.networkadvertising.org/" className="text-accent hover:underline" target="_blank" rel="noopener">Network Advertising Initiative</a></li>
            </ul>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">Impact of Disabling Cookies</h2>
            <p className="text-text-secondary mb-4">
              If you disable cookies, some features of our Service may not function properly:
            </p>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li>You may need to log in more frequently</li>
              <li>Your preferences may not be saved</li>
              <li>Some features may be unavailable</li>
              <li>The experience may be less personalized</li>
            </ul>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">Updates to This Policy</h2>
            <p className="text-text-secondary mb-4">
              We may update this Cookie Policy from time to time. We will notify you of any changes 
              by posting the new policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">Contact Us</h2>
            <p className="text-text-secondary mb-4">
              If you have questions about our use of cookies, please contact us:
            </p>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li>Email: privacy@optimusseo.ai</li>
              <li>Address: 123 Innovation Drive, San Francisco, CA 94105</li>
            </ul>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-text-muted">
                See also: <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link> | 
                <Link href="/terms" className="text-accent hover:underline ml-1">Terms of Service</Link> | 
                <Link href="/security" className="text-accent hover:underline ml-1">Security</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
