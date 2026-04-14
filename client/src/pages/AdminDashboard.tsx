import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Eye, Edit2, Zap } from "lucide-react";
import { toast } from "sonner";
import CreateJobDialog from "@/components/CreateJobDialog";
import JobDetailDialog from "@/components/JobDetailDialog";
import AIInsightsPanel from "@/components/AIInsightsPanel";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

const STAGE_COLORS: Record<string, string> = {
  Received: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Diagnosing: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Repairing: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Quality Check": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Ready for Pickup": "bg-green-500/20 text-green-300 border-green-500/30",
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJobDetail, setShowJobDetail] = useState(false);

  // Check authorization
  if (!user || (user.role !== "admin" && user.role !== "technician")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="glass-card-lg max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/70">
              You don't have permission to access the admin dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: jobs, isLoading, refetch } = trpc.repairs.list.useQuery({
    currentStage: selectedStage || undefined,
    limit: 100,
  });

  const { data: statusCounts } = trpc.analytics.getJobsByStatus.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const filteredJobs = jobs?.filter((job) =>
    job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.trackingCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Repair Management</h1>
            <p className="text-foreground/60 mt-1">Manage and track all repair jobs</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Repair Job
          </Button>
        </div>

        {/* Stats Cards */}
        {statusCounts && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <Card key={status} className="glass-card">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">{count}</p>
                    <p className="text-xs text-foreground/60 mt-1">{status}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="jobs" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jobs">All Jobs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <Zap className="w-4 h-4" />
              AI Insights
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            {user?.role === "admin" ? (
              <AnalyticsDashboard />
            ) : (
              <Card className="glass-card-lg">
                <CardContent className="pt-6">
                  <p className="text-foreground/50">Analytics are available to admins only.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search by customer name or tracking code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Select value={selectedStage || ""} onValueChange={(val) => setSelectedStage(val || null)}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Stages</SelectItem>
                  <SelectItem value="Received">Received</SelectItem>
                  <SelectItem value="Diagnosing">Diagnosing</SelectItem>
                  <SelectItem value="Repairing">Repairing</SelectItem>
                  <SelectItem value="Quality Check">Quality Check</SelectItem>
                  <SelectItem value="Ready for Pickup">Ready for Pickup</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Jobs Table */}
            <Card className="glass-card-lg">
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-accent" />
                  </div>
                ) : filteredJobs && filteredJobs.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border/50 hover:bg-transparent">
                          <TableHead>Tracking Code</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Device</TableHead>
                          <TableHead>Stage</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredJobs.map((job) => (
                          <TableRow key={job.id} className="border-border/50 hover:bg-white/5">
                            <TableCell className="font-mono text-accent">{job.trackingCode}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{job.customerName}</p>
                                <p className="text-xs text-foreground/50">{job.customerEmail}</p>
                              </div>
                            </TableCell>
                            <TableCell>{job.deviceType}</TableCell>
                            <TableCell>
                              <Badge className={`${STAGE_COLORS[job.currentStage]} border`}>
                                {job.currentStage}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-foreground/60">
                              {new Date(job.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedJob(job.id);
                                    setShowJobDetail(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-foreground/50">No repair jobs found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights">
            {user?.role === "admin" ? (
              <AIInsightsPanel />
            ) : (
              <Card className="glass-card-lg">
                <CardContent className="pt-6">
                  <p className="text-foreground/50">AI Insights are available to admins only.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <CreateJobDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onSuccess={() => refetch()} />
      {selectedJob && (
        <JobDetailDialog
          jobId={selectedJob}
          open={showJobDetail}
          onOpenChange={setShowJobDetail}
          onSuccess={() => refetch()}
        />
      )}
    </DashboardLayout>
  );
}
