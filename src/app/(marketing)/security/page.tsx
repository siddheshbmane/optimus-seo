"use client";

import * as React from "react";
import Link from "next/link";
import {
  Shield,
  Lock,
  Key,
  Server,
  Eye,
  FileCheck,
  Users,
  Clock,
  CheckCircle,
  Download,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const certifications = [
  {
    name: "SOC 2 Type II",
    description: "Independently audited security controls",
    status: "Certified",
  },
  {
    name: "GDPR",
    description: "EU data protection compliance",
    status: "Compliant",
  },
  {
    name: "CCPA",
    description: "California privacy compliance",
    status: "Compliant",
  },
  {
    name: "ISO 27001",
    description: "Information security management",
    status: "In Progress",
  },
];

const securityFeatures = [
  {
    icon: Lock,
    title: "Encryption at Rest & Transit",
    description:
      "All data is encrypted using AES-256 at rest and TLS 1.3 in transit. Your data is protected at every step.",
  },
  {
    icon: Key,
    title: "SSO & MFA",
    description:
      "Enterprise SSO with SAML 2.0 and OIDC. Multi-factor authentication available for all accounts.",
  },
  {
    icon: Users,
    title: "Role-Based Access Control",
    description:
      "Granular permissions let you control exactly who can access what. Audit logs track all actions.",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description:
      "Hosted on AWS with SOC 2 certified data centers. Regular penetration testing and vulnerability scans.",
  },
  {
    icon: Eye,
    title: "Data Privacy",
    description:
      "We never sell your data. You own your data and can export or delete it at any time.",
  },
  {
    icon: Clock,
    title: "99.9% Uptime SLA",
    description:
      "Enterprise-grade reliability with automatic failover and disaster recovery.",
  },
];

const dataHandling = [
  {
    title: "Data Collection",
    items: [
      "We only collect data necessary to provide our services",
      "SEO data is fetched from DataForSEO APIs",
      "User data is limited to account and billing information",
      "Analytics data is anonymized and aggregated",
    ],
  },
  {
    title: "Data Storage",
    items: [
      "All data stored in AWS US-East region by default",
      "EU data residency available for Enterprise plans",
      "Encrypted backups with 30-day retention",
      "Automatic data purging after account deletion",
    ],
  },
  {
    title: "Data Access",
    items: [
      "Strict need-to-know access for employees",
      "All access logged and audited",
      "Background checks for all team members",
      "Regular access reviews and revocations",
    ],
  },
];

export default function SecurityPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="accent" className="mb-4">
              <Shield className="h-3 w-3 mr-1" />
              Security
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4 sm:mb-6">
              Your data security is our top priority
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-text-secondary mb-6 sm:mb-8">
              We&apos;ve built Optimus SEO with enterprise-grade security from day
              one. Your data is protected by industry-leading practices and
              certifications.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button variant="accent" size="lg" className="w-full sm:w-auto">
                <Download className="h-5 w-5 mr-2" />
                Download Security Whitepaper
              </Button>
              <Link href="/contact">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Contact Security Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-8 sm:py-12 border-y border-border bg-bg-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="text-center p-4 sm:p-6 rounded-xl bg-bg-card border border-border"
              >
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FileCheck className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-text-primary text-sm sm:text-base mb-1">
                  {cert.name}
                </h3>
                <p className="text-xs sm:text-sm text-text-muted mb-2">
                  {cert.description}
                </p>
                <Badge
                  variant={cert.status === "Certified" || cert.status === "Compliant" ? "success" : "warning"}
                  className="text-[10px] sm:text-xs"
                >
                  {cert.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-4">
              Enterprise-grade security
            </h2>
            <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto">
              Every layer of our platform is designed with security in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {securityFeatures.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-4 sm:p-6">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-text-secondary">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Handling */}
      <section className="py-12 sm:py-16 md:py-24 bg-bg-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-4">
              How we handle your data
            </h2>
            <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto">
              Transparency is key. Here&apos;s exactly how we collect, store, and
              protect your data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {dataHandling.map((section) => (
              <Card key={section.title}>
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base text-text-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vulnerability Disclosure */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">
                    Responsible Disclosure
                  </h3>
                  <p className="text-sm sm:text-base text-text-secondary mb-4">
                    Found a security vulnerability? We appreciate your help in
                    keeping Optimus SEO secure. Please report any security issues
                    to our security team.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a href="mailto:security@optimusseo.com">
                      <Button variant="secondary" className="w-full sm:w-auto">
                        security@optimusseo.com
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </a>
                    <Button variant="ghost" className="w-full sm:w-auto">
                      View Bug Bounty Program
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust Center */}
      <section className="py-12 sm:py-16 md:py-24 bg-bg-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-4">
              Trust Center
            </h2>
            <p className="text-base sm:text-lg text-text-secondary">
              Download our security documentation and compliance reports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "SOC 2 Report", type: "PDF", size: "2.4 MB" },
              { name: "Security Whitepaper", type: "PDF", size: "1.8 MB" },
              { name: "DPA Template", type: "PDF", size: "340 KB" },
              { name: "Privacy Policy", type: "Web", size: "" },
            ].map((doc) => (
              <button
                key={doc.name}
                className="flex items-center gap-3 p-4 rounded-lg bg-bg-card border border-border hover:border-accent/50 transition-colors text-left w-full"
              >
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Download className="h-5 w-5 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-text-primary text-sm truncate">
                    {doc.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {doc.type} {doc.size && `• ${doc.size}`}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-4">
            Questions about security?
          </h2>
          <p className="text-base sm:text-lg text-text-secondary mb-6 sm:mb-8">
            Our security team is happy to answer any questions or provide
            additional documentation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link href="/contact">
              <Button variant="accent" size="lg" className="w-full sm:w-auto">
                Contact Security Team
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
