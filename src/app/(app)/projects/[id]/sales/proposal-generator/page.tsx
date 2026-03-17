"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  FileSpreadsheet,
  Plus,
  Download,
  Eye,
  Edit,
  Copy,
  Send,
  Sparkles,
  Clock,
  CheckCircle,
  DollarSign,
  Calendar,
  MoreHorizontal,
  X,
  Save,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { SlidePanel } from "@/components/ui/slide-panel";
import { Input } from "@/components/ui/input";
import { getProjectById } from "@/data/mock-projects";
import { formatNumber, cn } from "@/lib/utils";

interface Proposal {
  id: number;
  name: string;
  client: string;
  value: number;
  status: "draft" | "sent" | "viewed" | "accepted" | "expired";
  createdAt: string;
  sentAt: string | null;
  expiresAt: string | null;
  sections: string[];
}

const initialProposals: Proposal[] = [
  {
    id: 1,
    name: "Q2 2026 SEO Retainer Proposal",
    client: "Acme Corp",
    value: 15000,
    status: "sent",
    createdAt: "Mar 10, 2026",
    sentAt: "Mar 12, 2026",
    expiresAt: "Mar 26, 2026",
    sections: ["Executive Summary", "SEO Audit", "Strategy", "Pricing", "Timeline"],
  },
  {
    id: 2,
    name: "Technical SEO Audit Package",
    client: "TechStart Inc",
    value: 5000,
    status: "accepted",
    createdAt: "Mar 5, 2026",
    sentAt: "Mar 6, 2026",
    expiresAt: null,
    sections: ["Technical Audit", "Recommendations", "Pricing"],
  },
  {
    id: 3,
    name: "Content Marketing Strategy",
    client: "Sweet Delights Bakery",
    value: 8500,
    status: "draft",
    createdAt: "Mar 14, 2026",
    sentAt: null,
    expiresAt: null,
    sections: ["Content Strategy", "Editorial Calendar", "Pricing"],
  },
  {
    id: 4,
    name: "Link Building Campaign",
    client: "FitnessPro Academy",
    value: 12000,
    status: "viewed",
    createdAt: "Mar 8, 2026",
    sentAt: "Mar 9, 2026",
    expiresAt: "Mar 23, 2026",
    sections: ["Link Strategy", "Outreach Plan", "Pricing", "Timeline"],
  },
  {
    id: 5,
    name: "Local SEO Package",
    client: "GreenEnergy Solutions",
    value: 3500,
    status: "expired",
    createdAt: "Feb 15, 2026",
    sentAt: "Feb 16, 2026",
    expiresAt: "Mar 2, 2026",
    sections: ["Local SEO Audit", "GMB Optimization", "Pricing"],
  },
];

const proposalTemplates = [
  { id: 1, name: "SEO Retainer", description: "Monthly SEO services package", avgValue: 10000, sections: ["Executive Summary", "SEO Audit", "Strategy", "Deliverables", "Pricing", "Timeline", "Terms"] },
  { id: 2, name: "Technical Audit", description: "One-time technical SEO audit", avgValue: 5000, sections: ["Technical Audit", "Issues Found", "Recommendations", "Pricing"] },
  { id: 3, name: "Content Strategy", description: "Content marketing proposal", avgValue: 8000, sections: ["Content Audit", "Strategy", "Editorial Calendar", "Pricing"] },
  { id: 4, name: "Link Building", description: "Link acquisition campaign", avgValue: 12000, sections: ["Link Analysis", "Strategy", "Outreach Plan", "Pricing", "Timeline"] },
  { id: 5, name: "Local SEO", description: "Local search optimization", avgValue: 3500, sections: ["Local Audit", "GMB Optimization", "Citations", "Pricing"] },
  { id: 6, name: "Full Service", description: "Comprehensive SEO package", avgValue: 25000, sections: ["Executive Summary", "Full Audit", "Strategy", "Content", "Links", "Technical", "Pricing", "Timeline"] },
];

const statusConfig = {
  draft: { label: "Draft", variant: "neutral" as const, icon: Edit },
  sent: { label: "Sent", variant: "info" as const, icon: Send },
  viewed: { label: "Viewed", variant: "warning" as const, icon: Eye },
  accepted: { label: "Accepted", variant: "success" as const, icon: CheckCircle },
  expired: { label: "Expired", variant: "error" as const, icon: Clock },
};

export default function ProposalGeneratorPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);
  
  const [proposals, setProposals] = React.useState(initialProposals);
  const [showNewProposalModal, setShowNewProposalModal] = React.useState(false);
  const [showViewModal, setShowViewModal] = React.useState(false);
  const [showEditPanel, setShowEditPanel] = React.useState(false);
  const [showTemplateModal, setShowTemplateModal] = React.useState(false);
  const [selectedProposal, setSelectedProposal] = React.useState<Proposal | null>(null);
  const [selectedTemplate, setSelectedTemplate] = React.useState<typeof proposalTemplates[0] | null>(null);
  const [newProposal, setNewProposal] = React.useState({
    name: "",
    client: "",
    value: 0,
    template: "",
  });

  if (!project) return null;

  const totalValue = proposals.reduce((sum, p) => sum + p.value, 0);
  const acceptedValue = proposals.filter(p => p.status === "accepted").reduce((sum, p) => sum + p.value, 0);
  const pendingValue = proposals.filter(p => ["sent", "viewed"].includes(p.status)).reduce((sum, p) => sum + p.value, 0);

  const handleCreateProposal = () => {
    const template = proposalTemplates.find(t => t.name === newProposal.template);
    const proposal: Proposal = {
      id: proposals.length + 1,
      name: newProposal.name,
      client: newProposal.client,
      value: newProposal.value,
      status: "draft",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      sentAt: null,
      expiresAt: null,
      sections: template?.sections || ["Executive Summary", "Pricing"],
    };
    setProposals([proposal, ...proposals]);
    setShowNewProposalModal(false);
    setNewProposal({ name: "", client: "", value: 0, template: "" });
  };

  const handleViewProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowViewModal(true);
  };

  const handleEditProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowEditPanel(true);
  };

  const handleUseTemplate = (template: typeof proposalTemplates[0]) => {
    setSelectedTemplate(template);
    setNewProposal({
      ...newProposal,
      name: `${template.name} Proposal - ${project.name}`,
      value: template.avgValue,
      template: template.name,
    });
    setShowTemplateModal(false);
    setShowNewProposalModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Proposal Generator</h1>
          <p className="text-text-secondary">
            Create and manage winning SEO proposals
          </p>
        </div>
        <Button variant="accent" onClick={() => setShowNewProposalModal(true)}>
          <Sparkles className="h-4 w-4 mr-2" />
          Generate Proposal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <FileSpreadsheet className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{proposals.length}</p>
                <p className="text-sm text-text-muted">Total Proposals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">${formatNumber(acceptedValue)}</p>
                <p className="text-sm text-text-muted">Won Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">${formatNumber(pendingValue)}</p>
                <p className="text-sm text-text-muted">Pending Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">67%</p>
                <p className="text-sm text-text-muted">Win Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proposals Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Proposals</CardTitle>
          <Button variant="secondary" size="sm" onClick={() => setShowNewProposalModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Proposal
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Proposal</th>
                  <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Client</th>
                  <th className="p-4 text-right text-xs font-medium text-text-muted uppercase">Value</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Status</th>
                  <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Created</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((proposal) => {
                  const status = statusConfig[proposal.status];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={proposal.id} className="border-b border-border hover:bg-bg-elevated">
                      <td className="p-4">
                        <p className="font-medium text-text-primary">{proposal.name}</p>
                      </td>
                      <td className="p-4 text-text-secondary">{proposal.client}</td>
                      <td className="p-4 text-right font-mono font-semibold text-text-primary">
                        ${formatNumber(proposal.value)}
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant={status.variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </td>
                      <td className="p-4 text-text-secondary">{proposal.createdAt}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleViewProposal(proposal)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditProposal(proposal)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Proposal Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {proposalTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleUseTemplate(template)}
                className="p-4 rounded-lg border border-border hover:border-accent/50 hover:bg-bg-elevated transition-colors cursor-pointer text-center"
              >
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <FileSpreadsheet className="h-6 w-6 text-accent" />
                </div>
                <p className="font-medium text-text-primary text-sm mb-1">{template.name}</p>
                <p className="text-xs text-text-muted mb-2">{template.description}</p>
                <p className="text-xs text-accent font-medium">Avg: ${formatNumber(template.avgValue)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Proposal Modal */}
      <Modal
        isOpen={showNewProposalModal}
        onClose={() => setShowNewProposalModal(false)}
        title="Create New Proposal"
        description="Generate a professional SEO proposal"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Proposal Name
            </label>
            <Input 
              placeholder="e.g., Q2 2026 SEO Retainer Proposal"
              value={newProposal.name}
              onChange={(e) => setNewProposal({ ...newProposal, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Client Name
            </label>
            <Input 
              placeholder="e.g., Acme Corp"
              value={newProposal.client}
              onChange={(e) => setNewProposal({ ...newProposal, client: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Proposal Value ($)
            </label>
            <Input 
              type="number"
              placeholder="10000"
              value={newProposal.value || ""}
              onChange={(e) => setNewProposal({ ...newProposal, value: parseInt(e.target.value) || 0 })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Template
            </label>
            <select 
              className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              value={newProposal.template}
              onChange={(e) => setNewProposal({ ...newProposal, template: e.target.value })}
            >
              <option value="">Select a template...</option>
              {proposalTemplates.map((t) => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>
          
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowNewProposalModal(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleCreateProposal}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Proposal
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* View Proposal Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => { setShowViewModal(false); setSelectedProposal(null); }}
        title={selectedProposal?.name || "Proposal Preview"}
        size="lg"
      >
        {selectedProposal && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-bg-elevated">
              <div>
                <p className="text-sm text-text-muted">Client</p>
                <p className="font-medium text-text-primary">{selectedProposal.client}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-muted">Value</p>
                <p className="font-mono font-bold text-text-primary">${formatNumber(selectedProposal.value)}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-text-muted mb-2">Sections</p>
              <div className="space-y-2">
                {selectedProposal.sections.map((section, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-bg-elevated">
                    <span className="h-6 w-6 rounded-full bg-accent/10 text-accent text-xs font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-text-primary">{section}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Created</p>
                <p className="text-sm text-text-primary">{selectedProposal.createdAt}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Status</p>
                <Badge variant={statusConfig[selectedProposal.status].variant}>
                  {statusConfig[selectedProposal.status].label}
                </Badge>
              </div>
            </div>
            
            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
              <Button variant="ghost">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="accent">
                <Send className="h-4 w-4 mr-2" />
                Send to Client
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      {/* Edit Proposal Panel */}
      <SlidePanel
        isOpen={showEditPanel}
        onClose={() => { setShowEditPanel(false); setSelectedProposal(null); }}
        title="Edit Proposal"
        description="Modify proposal details"
        size="lg"
      >
        {selectedProposal && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Proposal Name
              </label>
              <Input defaultValue={selectedProposal.name} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Client Name
              </label>
              <Input defaultValue={selectedProposal.client} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Proposal Value ($)
              </label>
              <Input type="number" defaultValue={selectedProposal.value} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Sections
              </label>
              <div className="space-y-2">
                {selectedProposal.sections.map((section, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input defaultValue={section} className="flex-1" />
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-error" />
                    </Button>
                  </div>
                ))}
                <Button variant="secondary" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 pt-4">
              <Button variant="secondary" onClick={() => setShowEditPanel(false)}>
                Cancel
              </Button>
              <Button variant="accent" onClick={() => setShowEditPanel(false)}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </SlidePanel>
    </div>
  );
}
