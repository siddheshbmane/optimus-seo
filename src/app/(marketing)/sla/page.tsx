"use client";

import * as React from "react";
import Link from "next/link";
import { Shield, Calendar, Clock, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const uptimeCommitments = [
  { plan: "Starter", uptime: "99.5%", support: "Email (48h)", credits: "5% per 0.1% below" },
  { plan: "Professional", uptime: "99.9%", support: "Email (24h)", credits: "10% per 0.1% below" },
  { plan: "Agency", uptime: "99.95%", support: "Priority (4h)", credits: "15% per 0.1% below" },
  { plan: "Enterprise", uptime: "99.99%", support: "Dedicated (1h)", credits: "25% per 0.1% below" },
];

const severityLevels = [
  {
    level: "Critical (P1)",
    description: "Service is completely unavailable or major functionality is broken for all users",
    responseTime: "15 minutes",
    resolutionTarget: "4 hours",
    icon: XCircle,
    color: "text-red-500",
  },
  {
    level: "High (P2)",
    description: "Major functionality is impaired for a significant number of users",
    responseTime: "1 hour",
    resolutionTarget: "8 hours",
    icon: AlertTriangle,
    color: "text-orange-500",
  },
  {
    level: "Medium (P3)",
    description: "Minor functionality is impaired or workaround is available",
    responseTime: "4 hours",
    resolutionTarget: "24 hours",
    icon: AlertTriangle,
    color: "text-yellow-500",
  },
  {
    level: "Low (P4)",
    description: "Minor issues, questions, or feature requests",
    responseTime: "24 hours",
    resolutionTarget: "Best effort",
    icon: CheckCircle,
    color: "text-green-500",
  },
];

export default function SLAPage() {
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
            Service Level Agreement
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
                <strong className="text-text-primary">Summary:</strong> This SLA defines our uptime commitments, 
                support response times, and service credits for each plan. We're committed to keeping Optimus SEO 
                reliable and responsive.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">1. Service Availability</h2>
            <p className="text-text-secondary mb-4">
              We commit to maintaining high availability for all Optimus SEO services. Our uptime 
              commitment varies by plan:
            </p>
          </div>

          {/* Uptime Table */}
          <div className="overflow-x-auto my-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-text-primary font-semibold">Plan</th>
                  <th className="text-left py-3 px-4 text-text-primary font-semibold">Uptime SLA</th>
                  <th className="text-left py-3 px-4 text-text-primary font-semibold">Support Response</th>
                  <th className="text-left py-3 px-4 text-text-primary font-semibold">Service Credits</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                {uptimeCommitments.map((plan, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-3 px-4 font-medium text-text-primary">{plan.plan}</td>
                    <td className="py-3 px-4">
                      <Badge variant="accent">{plan.uptime}</Badge>
                    </td>
                    <td className="py-3 px-4">{plan.support}</td>
                    <td className="py-3 px-4">{plan.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-lg font-medium text-text-primary mt-6 mb-3">Uptime Calculation</h3>
            <p className="text-text-secondary mb-4">
              Uptime is calculated as follows:
            </p>
            <div className="bg-bg-elevated rounded-lg p-4 font-mono text-sm mb-4">
              Uptime % = ((Total Minutes - Downtime Minutes) / Total Minutes) × 100
            </div>
            <p className="text-text-secondary mb-4">
              Uptime is measured monthly, excluding scheduled maintenance windows.
            </p>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-3">Exclusions</h3>
            <p className="text-text-secondary mb-4">
              The following are not counted as downtime:
            </p>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li>Scheduled maintenance (announced 48+ hours in advance)</li>
              <li>Emergency maintenance for security issues</li>
              <li>Issues caused by factors outside our control (DDoS, ISP outages, etc.)</li>
              <li>Issues caused by customer actions or third-party integrations</li>
              <li>Features in beta or preview</li>
            </ul>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">2. Support Response Times</h2>
            <p className="text-text-secondary mb-4">
              We categorize support requests by severity and commit to the following response times:
            </p>
          </div>

          {/* Severity Levels */}
          <div className="grid gap-4 my-8">
            {severityLevels.map((level, index) => (
              <Card key={index} className="bg-bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <level.icon className={`h-6 w-6 ${level.color} flex-shrink-0 mt-1`} />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-text-primary mb-2">{level.level}</h3>
                      <p className="text-text-secondary mb-4">{level.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-text-muted">Response Time:</span>{" "}
                          <span className="text-text-primary font-medium">{level.responseTime}</span>
                        </div>
                        <div>
                          <span className="text-text-muted">Resolution Target:</span>{" "}
                          <span className="text-text-primary font-medium">{level.resolutionTarget}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">3. Service Credits</h2>
            <p className="text-text-secondary mb-4">
              If we fail to meet our uptime commitment, you are eligible for service credits:
            </p>
            <h3 className="text-lg font-medium text-text-primary mt-6 mb-3">Credit Calculation</h3>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li>Credits are calculated as a percentage of your monthly fee</li>
              <li>Maximum credit per month: 30% of monthly fee</li>
              <li>Credits are applied to future invoices (not refunded)</li>
              <li>Credits must be requested within 30 days of the incident</li>
            </ul>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-3">How to Request Credits</h3>
            <p className="text-text-secondary mb-4">
              To request service credits:
            </p>
            <ol className="list-decimal pl-6 text-text-secondary space-y-2 mb-4">
              <li>Email support@optimusseo.ai with subject "SLA Credit Request"</li>
              <li>Include your account ID and the dates/times of the outage</li>
              <li>We will verify the outage and respond within 5 business days</li>
              <li>Approved credits will be applied to your next invoice</li>
            </ol>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">4. Scheduled Maintenance</h2>
            <p className="text-text-secondary mb-4">
              We perform regular maintenance to keep our systems secure and performant:
            </p>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li><strong>Maintenance Window:</strong> Sundays 2:00 AM - 6:00 AM UTC</li>
              <li><strong>Advance Notice:</strong> 48 hours minimum for planned maintenance</li>
              <li><strong>Emergency Maintenance:</strong> May occur without notice for security issues</li>
              <li><strong>Communication:</strong> Via email and status page (status.optimusseo.ai)</li>
            </ul>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">5. Data Backup & Recovery</h2>
            <p className="text-text-secondary mb-4">
              We maintain comprehensive backup and recovery procedures:
            </p>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li><strong>Backup Frequency:</strong> Continuous replication + daily snapshots</li>
              <li><strong>Retention Period:</strong> 30 days for daily backups</li>
              <li><strong>Recovery Point Objective (RPO):</strong> 1 hour maximum data loss</li>
              <li><strong>Recovery Time Objective (RTO):</strong> 4 hours to restore service</li>
              <li><strong>Geographic Redundancy:</strong> Data replicated across multiple regions</li>
            </ul>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">6. Security Commitments</h2>
            <p className="text-text-secondary mb-4">
              We maintain the following security standards:
            </p>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li>SOC 2 Type II certified</li>
              <li>GDPR compliant</li>
              <li>Data encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
              <li>Regular penetration testing and security audits</li>
              <li>24/7 security monitoring</li>
            </ul>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">7. Monitoring & Status</h2>
            <p className="text-text-secondary mb-4">
              You can monitor our service status at:
            </p>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li><strong>Status Page:</strong> <a href="https://status.optimusseo.ai" className="text-accent hover:underline">status.optimusseo.ai</a></li>
              <li><strong>Subscribe:</strong> Get email/SMS alerts for incidents</li>
              <li><strong>Historical Uptime:</strong> View past 90 days of uptime data</li>
            </ul>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">8. Changes to This SLA</h2>
            <p className="text-text-secondary mb-4">
              We may update this SLA from time to time. Changes that reduce our commitments will be 
              announced 30 days in advance. Changes that improve our commitments take effect immediately.
            </p>

            <h2 className="text-xl font-semibold text-text-primary mt-8 mb-4">9. Contact</h2>
            <p className="text-text-secondary mb-4">
              For SLA-related questions or to report an incident:
            </p>
            <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
              <li>Email: support@optimusseo.ai</li>
              <li>Emergency: +1 (555) 123-4567 (Enterprise plans only)</li>
              <li>Status Page: status.optimusseo.ai</li>
            </ul>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-text-muted">
                See also: <Link href="/terms" className="text-accent hover:underline">Terms of Service</Link> | 
                <Link href="/privacy" className="text-accent hover:underline ml-1">Privacy Policy</Link> | 
                <Link href="/security" className="text-accent hover:underline ml-1">Security</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
