"use client";

import * as React from "react";
import Link from "next/link";
import { Check, X, HelpCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: { monthly: 99, annual: 79 },
    description: "Perfect for freelancers and small agencies getting started with AI SEO",
    features: {
      projects: "3 projects",
      keywords: "5,000 keywords",
      agents: "Basic AI agents",
      reports: "Weekly reports",
      support: "Email support",
      users: "1 user",
      api: false,
      whiteLabel: false,
      customTraining: false,
      sla: false,
    },
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: { monthly: 299, annual: 249 },
    description: "For growing agencies and in-house teams ready to scale",
    features: {
      projects: "15 projects",
      keywords: "25,000 keywords",
      agents: "All AI agents",
      reports: "Daily reports",
      support: "Priority support",
      users: "5 users",
      api: true,
      whiteLabel: true,
      customTraining: false,
      sla: false,
    },
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: { monthly: null, annual: null },
    description: "For large agencies and enterprises with custom needs",
    features: {
      projects: "Unlimited projects",
      keywords: "Unlimited keywords",
      agents: "Custom AI training",
      reports: "Real-time reports",
      support: "Dedicated support",
      users: "Unlimited users",
      api: true,
      whiteLabel: true,
      customTraining: true,
      sla: true,
    },
    cta: "Contact Sales",
    popular: false,
  },
];

const featureComparison = [
  { name: "Projects", starter: "3", professional: "15", enterprise: "Unlimited" },
  { name: "Keywords tracked", starter: "5,000", professional: "25,000", enterprise: "Unlimited" },
  { name: "Team members", starter: "1", professional: "5", enterprise: "Unlimited" },
  { name: "AI Site Auditor", starter: true, professional: true, enterprise: true },
  { name: "AI Keyword Researcher", starter: true, professional: true, enterprise: true },
  { name: "AI Content Writer", starter: "Basic", professional: true, enterprise: true },
  { name: "AI Link Builder", starter: false, professional: true, enterprise: true },
  { name: "AI Technical Fixer", starter: false, professional: true, enterprise: true },
  { name: "Competitor Analysis", starter: "3 competitors", professional: "10 competitors", enterprise: "Unlimited" },
  { name: "White-label reports", starter: false, professional: true, enterprise: true },
  { name: "API access", starter: false, professional: true, enterprise: true },
  { name: "Custom AI training", starter: false, professional: false, enterprise: true },
  { name: "SSO/SAML", starter: false, professional: false, enterprise: true },
  { name: "SLA guarantee", starter: false, professional: false, enterprise: true },
  { name: "Dedicated support", starter: false, professional: false, enterprise: true },
];

const faqs = [
  {
    question: "How does the 14-day free trial work?",
    answer: "You get full access to all features of your chosen plan for 14 days. No credit card required. If you don't upgrade, your account will be downgraded to a limited free tier.",
  },
  {
    question: "Can I change plans later?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, you'll receive credit for your next billing cycle.",
  },
  {
    question: "What happens if I exceed my keyword limit?",
    answer: "We'll notify you when you're approaching your limit. You can either upgrade your plan or remove some keywords. We won't automatically charge you for overages.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer: "Yes! You save 20% when you choose annual billing. That's like getting 2+ months free every year.",
  },
  {
    question: "Is there a contract or commitment?",
    answer: "No long-term contracts. You can cancel anytime. For monthly plans, you'll have access until the end of your billing period. For annual plans, we offer prorated refunds within the first 30 days.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for Enterprise plans.",
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = React.useState<"monthly" | "annual">("monthly");

  return (
    <div>
      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="accent" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Pricing
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Start free, upgrade when you&apos;re ready. No hidden fees, no surprises.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={cn("text-sm font-medium", billingPeriod === "monthly" ? "text-text-primary" : "text-text-muted")}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "annual" : "monthly")}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  billingPeriod === "annual" ? "bg-accent" : "bg-border"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    billingPeriod === "annual" ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
              <span className={cn("text-sm font-medium", billingPeriod === "annual" ? "text-text-primary" : "text-text-muted")}>
                Annual
              </span>
              <Badge variant="success" className="text-xs">Save 20%</Badge>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  "relative",
                  plan.popular && "border-accent ring-2 ring-accent"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="accent">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    {plan.price.monthly ? (
                      <>
                        <span className="text-4xl font-bold text-text-primary">
                          ${billingPeriod === "monthly" ? plan.price.monthly : plan.price.annual}
                        </span>
                        <span className="text-text-muted">/month</span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold text-text-primary">Custom</span>
                    )}
                  </div>
                  {billingPeriod === "annual" && plan.price.annual && (
                    <p className="text-sm text-success mb-2">
                      Save ${(plan.price.monthly! - plan.price.annual) * 12}/year
                    </p>
                  )}
                  <p className="text-text-secondary mb-6">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success" />
                      <span className="text-text-primary">{plan.features.projects}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success" />
                      <span className="text-text-primary">{plan.features.keywords}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success" />
                      <span className="text-text-primary">{plan.features.agents}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success" />
                      <span className="text-text-primary">{plan.features.reports}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success" />
                      <span className="text-text-primary">{plan.features.support}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success" />
                      <span className="text-text-primary">{plan.features.users}</span>
                    </li>
                    {plan.features.api && (
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-text-primary">API access</span>
                      </li>
                    )}
                    {plan.features.whiteLabel && (
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-text-primary">White-label reports</span>
                      </li>
                    )}
                  </ul>

                  <Link href={plan.name === "Enterprise" ? "/contact" : "/signup"}>
                    <Button
                      variant={plan.popular ? "accent" : "secondary"}
                      className="w-full"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-bg-elevated">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-12">
            Compare all features
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-text-primary font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 text-text-primary font-semibold">Starter</th>
                  <th className="text-center py-4 px-4 text-text-primary font-semibold">Professional</th>
                  <th className="text-center py-4 px-4 text-text-primary font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((feature) => (
                  <tr key={feature.name} className="border-b border-border">
                    <td className="py-4 px-4 text-text-primary">{feature.name}</td>
                    <td className="py-4 px-4 text-center">
                      {typeof feature.starter === "boolean" ? (
                        feature.starter ? (
                          <Check className="h-5 w-5 text-success mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-text-muted mx-auto" />
                        )
                      ) : (
                        <span className="text-text-secondary">{feature.starter}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof feature.professional === "boolean" ? (
                        feature.professional ? (
                          <Check className="h-5 w-5 text-success mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-text-muted mx-auto" />
                        )
                      ) : (
                        <span className="text-text-secondary">{feature.professional}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof feature.enterprise === "boolean" ? (
                        feature.enterprise ? (
                          <Check className="h-5 w-5 text-success mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-text-muted mx-auto" />
                        )
                      ) : (
                        <span className="text-text-secondary">{feature.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-12">
            Frequently asked questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="border-b border-border pb-6">
                <h3 className="text-lg font-medium text-text-primary mb-2 flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-text-secondary ml-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-bg-elevated">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Still have questions?
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            Our team is here to help you find the perfect plan for your needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button variant="accent" size="lg">
                Talk to Sales
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="secondary" size="lg">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
