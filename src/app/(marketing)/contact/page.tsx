"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  Calendar,
  Users,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Get a response within 24 hours",
    value: "hello@optimusseo.com",
    action: "mailto:hello@optimusseo.com",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Available Mon-Fri, 9am-6pm IST",
    value: "Start a conversation",
    action: "#chat",
  },
  {
    icon: Calendar,
    title: "Book a Demo",
    description: "See Optimus SEO in action",
    value: "Schedule 30 min call",
    action: "/demo",
  },
];

const offices = [
  {
    city: "Mumbai",
    country: "India",
    address: "WeWork, Bandra Kurla Complex",
    timezone: "IST (UTC+5:30)",
    phone: "+91 22 1234 5678",
  },
  {
    city: "San Francisco",
    country: "USA",
    address: "Coming Soon",
    timezone: "PST (UTC-8)",
    phone: "Coming Soon",
  },
];

const faqs = [
  {
    question: "How quickly can I get started?",
    answer: "You can sign up and start using Optimus SEO within minutes. Our onboarding wizard will guide you through connecting your first project.",
  },
  {
    question: "Do you offer custom enterprise plans?",
    answer: "Yes! Contact our sales team to discuss custom pricing, dedicated support, and enterprise features like SSO and custom AI training.",
  },
  {
    question: "What kind of support do you offer?",
    answer: "All plans include email support. Professional plans get priority support, and Enterprise plans get a dedicated success manager.",
  },
];

export default function ContactPage() {
  const [formState, setFormState] = React.useState({
    name: "",
    email: "",
    company: "",
    message: "",
    type: "general",
  });
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
  };

  return (
    <div>
      {/* Hero */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="accent" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Contact Us
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4 sm:mb-6">
              Let&apos;s talk about your SEO goals
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-text-secondary">
              Whether you have questions about our platform, need a demo, or want
              to discuss enterprise solutions — we&apos;re here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-8 sm:py-12 border-y border-border bg-bg-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {contactMethods.map((method) => (
              <a
                key={method.title}
                href={method.action}
                className="flex flex-col items-center text-center p-4 sm:p-6 rounded-xl bg-bg-card border border-border hover:border-accent/50 transition-colors"
              >
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <method.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-text-primary mb-1">
                  {method.title}
                </h3>
                <p className="text-sm text-text-muted mb-2">
                  {method.description}
                </p>
                <p className="text-accent font-medium text-sm">{method.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Form */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">
                Send us a message
              </h2>
              <p className="text-text-secondary mb-6 sm:mb-8">
                Fill out the form below and we&apos;ll get back to you within 24
                hours.
              </p>

              {submitted ? (
                <Card>
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-success" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">
                      Message sent!
                    </h3>
                    <p className="text-text-secondary mb-4">
                      Thanks for reaching out. We&apos;ll get back to you within 24
                      hours.
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => setSubmitted(false)}
                    >
                      Send another message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Name
                      </label>
                      <Input
                        required
                        placeholder="Your name"
                        value={formState.name}
                        onChange={(e) =>
                          setFormState({ ...formState, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Email
                      </label>
                      <Input
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={formState.email}
                        onChange={(e) =>
                          setFormState({ ...formState, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">
                      Company
                    </label>
                    <Input
                      placeholder="Your company name"
                      value={formState.company}
                      onChange={(e) =>
                        setFormState({ ...formState, company: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">
                      What can we help you with?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "general", label: "General Inquiry" },
                        { id: "demo", label: "Request Demo" },
                        { id: "sales", label: "Sales" },
                        { id: "support", label: "Support" },
                        { id: "partnership", label: "Partnership" },
                      ].map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() =>
                            setFormState({ ...formState, type: type.id })
                          }
                          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                            formState.type === type.id
                              ? "bg-accent text-white"
                              : "bg-bg-elevated text-text-secondary hover:text-text-primary"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us more about your needs..."
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-bg-elevated border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none"
                    />
                  </div>

                  <Button type="submit" variant="accent" className="w-full sm:w-auto">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6 sm:space-y-8">
              {/* Offices */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Our Offices
                </h3>
                <div className="space-y-4">
                  {offices.map((office) => (
                    <Card key={office.city}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <h4 className="font-medium text-text-primary">
                              {office.city}, {office.country}
                            </h4>
                            <p className="text-sm text-text-secondary">
                              {office.address}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-text-muted">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {office.timezone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {office.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Support Hours */}
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Headphones className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary">
                        Support Hours
                      </h4>
                      <p className="text-sm text-text-muted">
                        We&apos;re here to help
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Monday - Friday</span>
                      <span className="text-text-primary">9:00 AM - 6:00 PM IST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Saturday</span>
                      <span className="text-text-primary">10:00 AM - 2:00 PM IST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Sunday</span>
                      <span className="text-text-muted">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick FAQs */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Quick Answers
                </h3>
                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <div
                      key={faq.question}
                      className="p-4 rounded-lg bg-bg-elevated"
                    >
                      <h4 className="font-medium text-text-primary text-sm mb-1">
                        {faq.question}
                      </h4>
                      <p className="text-sm text-text-secondary">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-24 bg-bg-elevated">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-4">
            Ready to transform your SEO?
          </h2>
          <p className="text-base sm:text-lg text-text-secondary mb-6 sm:mb-8">
            Start your free trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link href="/signup">
              <Button variant="accent" size="lg" className="w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
