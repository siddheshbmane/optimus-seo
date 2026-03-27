"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Globe, Building2, MapPin } from "lucide-react";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDemoMode } from "@/contexts/demo-mode-context";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  name: string;
  clientUrl: string;
  industry: string;
  customIndustry: string;
  description: string;
}

interface FormErrors {
  name?: string;
  clientUrl?: string;
  customIndustry?: string;
}

// Extensive industries for SEO projects - organized by category
const INDUSTRY_CATEGORIES = {
  "Technology & Software": [
    "SaaS / Software",
    "IT Services & Consulting",
    "Cybersecurity",
    "Cloud Computing",
    "AI & Machine Learning",
    "Mobile Apps",
    "Web Development",
    "Data Analytics",
    "Blockchain & Crypto",
    "Gaming & Esports",
  ],
  "E-commerce & Retail": [
    "E-commerce (General)",
    "Fashion & Apparel",
    "Electronics & Gadgets",
    "Home & Garden",
    "Beauty & Cosmetics",
    "Jewelry & Accessories",
    "Sports & Outdoors",
    "Toys & Games",
    "Pet Supplies",
    "Grocery & Food Delivery",
  ],
  "Healthcare & Wellness": [
    "Healthcare Services",
    "Medical Devices",
    "Pharmaceuticals",
    "Mental Health",
    "Fitness & Gym",
    "Nutrition & Supplements",
    "Dental Services",
    "Veterinary Services",
    "Senior Care",
    "Alternative Medicine",
  ],
  "Finance & Insurance": [
    "Banking & Financial Services",
    "Insurance",
    "Investment & Wealth Management",
    "Fintech",
    "Accounting & Tax",
    "Mortgage & Lending",
    "Credit Services",
    "Cryptocurrency Exchange",
  ],
  "Professional Services": [
    "Legal Services",
    "Consulting",
    "Marketing & Advertising",
    "HR & Recruitment",
    "Business Services",
    "Translation Services",
    "Event Planning",
    "Photography & Videography",
  ],
  "Real Estate & Construction": [
    "Real Estate (Residential)",
    "Real Estate (Commercial)",
    "Property Management",
    "Construction",
    "Architecture & Design",
    "Home Improvement",
    "Interior Design",
    "Landscaping",
  ],
  "Education & Training": [
    "Higher Education",
    "K-12 Education",
    "Online Learning / EdTech",
    "Professional Training",
    "Language Learning",
    "Test Prep & Tutoring",
    "Vocational Training",
    "Corporate Training",
  ],
  "Travel & Hospitality": [
    "Hotels & Resorts",
    "Travel Agencies",
    "Airlines & Transportation",
    "Vacation Rentals",
    "Tours & Activities",
    "Cruise Lines",
    "Car Rentals",
    "Travel Tech",
  ],
  "Food & Beverage": [
    "Restaurants",
    "Cafes & Coffee Shops",
    "Fast Food & QSR",
    "Catering Services",
    "Food Manufacturing",
    "Beverage & Alcohol",
    "Food Delivery Apps",
    "Specialty Foods",
  ],
  "Media & Entertainment": [
    "News & Publishing",
    "Streaming Services",
    "Music & Audio",
    "Film & Television",
    "Podcasting",
    "Social Media",
    "Influencer Marketing",
    "Live Events & Concerts",
  ],
  "Automotive": [
    "Car Dealerships",
    "Auto Parts & Accessories",
    "Auto Repair & Services",
    "Car Rentals",
    "Electric Vehicles",
    "Motorcycles",
    "RVs & Boats",
    "Fleet Management",
  ],
  "Manufacturing & Industrial": [
    "Manufacturing (General)",
    "Industrial Equipment",
    "Chemicals & Materials",
    "Aerospace & Defense",
    "Energy & Utilities",
    "Mining & Metals",
    "Packaging",
    "3D Printing",
  ],
  "Non-Profit & Government": [
    "Non-Profit Organizations",
    "Government Services",
    "Political Campaigns",
    "Religious Organizations",
    "Charities & Foundations",
    "Environmental Organizations",
  ],
  "Other Industries": [
    "Agriculture & Farming",
    "Logistics & Shipping",
    "Telecommunications",
    "Printing & Publishing",
    "Security Services",
    "Cleaning Services",
    "Waste Management",
    "Other",
  ],
};

// Flatten industries for the select dropdown
const ALL_INDUSTRIES = Object.entries(INDUSTRY_CATEGORIES).flatMap(([category, industries]) =>
  industries.map(industry => ({ category, industry }))
);

export function NewProjectModal({ isOpen, onClose, onSuccess }: NewProjectModalProps) {
  const router = useRouter();
  const { isDemoMode } = useDemoMode();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    clientUrl: "",
    industry: "",
    customIndustry: "",
    description: "",
  });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setFormData({ name: "", clientUrl: "", industry: "", customIndustry: "", description: "" });
      setErrors({});
      setSubmitError(null);
    }
  }, [isOpen]);

  // Validate URL format — ensures it has a valid domain with TLD
  const isValidUrl = (url: string): boolean => {
    try {
      const cleaned = url.replace(/^https?:\/\//, "").trim();
      if (!cleaned) return false;
      // Must have at least one dot (TLD), no spaces, no special chars in domain
      const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}(\/.*)?$/;
      if (!domainRegex.test(cleaned)) return false;
      const parsed = new URL(`https://${cleaned}`);
      return !!parsed.hostname && parsed.hostname.includes(".");
    } catch {
      return false;
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Project name must be at least 2 characters";
    }

    if (!formData.clientUrl.trim()) {
      newErrors.clientUrl = "Website URL is required";
    } else if (!isValidUrl(formData.clientUrl)) {
      newErrors.clientUrl = "Please enter a valid URL";
    }

    // Validate custom industry if "Other" is selected
    if (formData.industry === "Other" && !formData.customIndustry.trim()) {
      newErrors.customIndustry = "Please specify your industry";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Get the final industry value (custom or selected)
  const getFinalIndustry = (): string => {
    if (formData.industry === "Other") {
      return formData.customIndustry.trim();
    }
    return formData.industry;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Normalize URL
      let normalizedUrl = formData.clientUrl.trim();
      if (!normalizedUrl.startsWith("http")) {
        normalizedUrl = `https://${normalizedUrl}`;
      }

      // In demo mode, simulate project creation without API call
      if (isDemoMode) {
        const mockId = formData.name.trim().toLowerCase().replace(/\s+/g, "-");
        onSuccess?.();
        onClose();
        router.push(`/projects/${mockId}/sales`);
        return;
      }

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          clientUrl: normalizedUrl,
          industry: getFinalIndustry() || undefined,
          description: formData.description.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || "Failed to create project");
      }

      const data = await response.json();
      const projectId = data.data?.id;

      // Call success callback
      onSuccess?.();

      // Close modal
      onClose();

      // Navigate to the new project
      if (projectId) {
        router.push(`/projects/${projectId}/sales`);
      } else {
        router.push("/projects");
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Failed to create project. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      description="Add a new SEO project to start tracking and optimizing."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Project Name */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium text-text-primary flex items-center gap-2">
            <Building2 className="h-4 w-4 text-text-muted" />
            Project Name
          </label>
          <Input
            id="name"
            placeholder="e.g., Acme Corp SEO"
            value={formData.name}
            onChange={handleChange("name")}
            error={!!errors.name}
            disabled={isSubmitting}
            autoFocus
          />
          {errors.name && (
            <p className="text-xs text-error">{errors.name}</p>
          )}
        </div>

        {/* Website URL */}
        <div className="space-y-1.5">
          <label htmlFor="clientUrl" className="text-sm font-medium text-text-primary flex items-center gap-2">
            <Globe className="h-4 w-4 text-text-muted" />
            Website URL
          </label>
          <Input
            id="clientUrl"
            placeholder="e.g., acmecorp.com"
            value={formData.clientUrl}
            onChange={handleChange("clientUrl")}
            error={!!errors.clientUrl}
            disabled={isSubmitting}
          />
          {errors.clientUrl && (
            <p className="text-xs text-error">{errors.clientUrl}</p>
          )}
          <p className="text-xs text-text-muted">
            Enter the main domain you want to track
          </p>
        </div>

        {/* Industry */}
        <div className="space-y-1.5">
          <label htmlFor="industry" className="text-sm font-medium text-text-primary flex items-center gap-2">
            <MapPin className="h-4 w-4 text-text-muted" />
            Industry
            <span className="text-text-muted font-normal">(optional)</span>
          </label>
          <select
            id="industry"
            value={formData.industry}
            onChange={handleChange("industry")}
            disabled={isSubmitting}
            className={cn(
              "flex h-9 w-full rounded-md border border-border bg-bg-input px-3 py-2 text-sm text-text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <option value="">Select an industry...</option>
            {Object.entries(INDUSTRY_CATEGORIES).map(([category, industries]) => (
              <optgroup key={category} label={category}>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Custom Industry Input (shown when "Other" is selected) */}
        {formData.industry === "Other" && (
          <div className="space-y-1.5">
            <label htmlFor="customIndustry" className="text-sm font-medium text-text-primary">
              Specify Your Industry
            </label>
            <Input
              id="customIndustry"
              placeholder="e.g., Renewable Energy, Pet Services..."
              value={formData.customIndustry}
              onChange={handleChange("customIndustry")}
              error={!!errors.customIndustry}
              disabled={isSubmitting}
            />
            {errors.customIndustry && (
              <p className="text-xs text-error">{errors.customIndustry}</p>
            )}
          </div>
        )}

        {/* Description */}
        <div className="space-y-1.5">
          <label htmlFor="description" className="text-sm font-medium text-text-primary">
            Description
            <span className="text-text-muted font-normal ml-1">(optional)</span>
          </label>
          <textarea
            id="description"
            placeholder="Brief description of the project goals..."
            value={formData.description}
            onChange={handleChange("description")}
            disabled={isSubmitting}
            rows={3}
            className={cn(
              "flex w-full rounded-md border border-border bg-bg-input px-3 py-2 text-sm text-text-primary placeholder:text-text-muted",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
              "disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            )}
          />
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="p-3 rounded-md bg-error/10 border border-error/20">
            <p className="text-sm text-error">{submitError}</p>
          </div>
        )}

        {/* Footer */}
        <ModalFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="accent"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
