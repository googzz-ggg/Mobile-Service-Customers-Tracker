import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Users, Clock } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AnalyticsDashboard() {
  const { data: statusCounts, isLoading: isLoadingStatus } = trpc.analytics.getJobsByStatus.useQuery();
  const { data: avgSatisfaction, isLoading: isLoadingSatisfaction } =
    trpc.analytics.getAverageSatisfaction.useQuery();

  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#06b6d4", "#8b5cf6"];

  const statusData = statusCounts
    ? Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  const satisfactionPercentage = avgSatisfaction ? (avgSatisfaction / 5) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Jobs */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              Total Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStatus ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <div className="text-2xl font-bold text-accent">
                {statusData.reduce((sum, item) => sum + item.value, 0)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Average Satisfaction */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-green-400" />
              Customer Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSatisfaction ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <div>
                <div className="text-2xl font-bold text-green-400">{avgSatisfaction?.toFixed(1)}/5</div>
                <div className="w-full bg-foreground/10 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${satisfactionPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Repairs */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStatus ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <div className="text-2xl font-bold text-yellow-400">
                {(statusCounts?.Diagnosing || 0) + (statusCounts?.Repairing || 0) + (statusCounts?.["Quality Check"] || 0)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs by Status - Bar Chart */}
        <Card className="glass-card-lg">
          <CardHeader>
            <CardTitle>Jobs by Status</CardTitle>
            <CardDescription>Distribution of repair jobs across stages</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingStatus ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(34, 197, 255, 0.3)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" fill="#22c55e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Jobs Distribution - Pie Chart */}
        <Card className="glass-card-lg">
          <CardHeader>
            <CardTitle>Repair Stage Distribution</CardTitle>
            <CardDescription>Percentage of jobs in each stage</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingStatus ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(34, 197, 255, 0.3)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <p className="text-sm text-foreground/60">
            📊 <strong>Analytics Tip:</strong> These metrics are updated in real-time based on your repair jobs and
            customer feedback. Use this data to identify trends, optimize technician performance, and improve customer
            satisfaction.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
