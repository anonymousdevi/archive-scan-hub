import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Archive,
  FolderCheck,
  FolderX,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

// Mock data - replace with real data from your backend
const fileStats = {
  total: 2847,
  inStorage: 2634,
  checkedOut: 213,
  overdue: 12,
};

const weeklyActivity = [
  { day: "Mon", checkedOut: 45, checkedIn: 38 },
  { day: "Tue", checkedOut: 52, checkedIn: 41 },
  { day: "Wed", checkedOut: 38, checkedIn: 49 },
  { day: "Thu", checkedOut: 61, checkedIn: 44 },
  { day: "Fri", checkedOut: 73, checkedIn: 52 },
  { day: "Sat", checkedOut: 28, checkedIn: 31 },
  { day: "Sun", checkedOut: 19, checkedIn: 22 },
];

const statusDistribution = [
  { name: "In Storage", value: fileStats.inStorage, color: "hsl(var(--success))" },
  { name: "Checked Out", value: fileStats.checkedOut, color: "hsl(var(--warning))" },
  { name: "Overdue", value: fileStats.overdue, color: "hsl(var(--destructive))" },
];

const recentActivity = [
  {
    id: "F-2847",
    fileName: "Personnel Records 2024",
    action: "OUT",
    user: "John Smith",
    time: "2 mins ago",
    location: "R1-S3-B12",
  },
  {
    id: "F-2846",
    fileName: "Financial Reports Q4",
    action: "IN",
    user: "Sarah Johnson",
    time: "15 mins ago",
    location: "R2-S1-B5",
  },
  {
    id: "F-2845",
    fileName: "Legal Documents",
    action: "OUT",
    user: "Mike Davis",
    time: "1 hour ago",
    location: "R1-S2-B8",
  },
  {
    id: "F-2844",
    fileName: "Project Archives",
    action: "IN",
    user: "Emily Wilson",
    time: "2 hours ago",
    location: "R3-S4-B15",
  },
];

export default function Dashboard() {
  const storagePercentage = (fileStats.inStorage / fileStats.total) * 100;

  return (
    <div className="space-y-6 slide-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Archive system overview and recent activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fileStats.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Storage</CardTitle>
            <FolderCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {fileStats.inStorage.toLocaleString()}
            </div>
            <div className="mt-2">
              <Progress value={storagePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {storagePercentage.toFixed(1)}% of total files
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked Out</CardTitle>
            <FolderX className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {fileStats.checkedOut}
            </div>
            <p className="text-xs text-muted-foreground">
              <Clock className="inline h-3 w-3 mr-1" />
              Avg. 3.5 days out
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {fileStats.overdue}
            </div>
            <p className="text-xs text-muted-foreground">
              Files past due date
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-professional">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <p className="text-sm text-muted-foreground">
              File check-in and check-out trends
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="checkedOut" fill="hsl(var(--warning))" name="Checked Out" />
                <Bar dataKey="checkedIn" fill="hsl(var(--success))" name="Checked In" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader>
            <CardTitle>File Status Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">
              Current status breakdown
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {statusDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-professional">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <p className="text-sm text-muted-foreground">Latest file transactions</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-smooth"
              >
                <div className="flex items-center gap-4">
                  <Badge
                    variant={activity.action === "OUT" ? "destructive" : "default"}
                    className={
                      activity.action === "OUT"
                        ? "status-out-light"
                        : "status-in-light"
                    }
                  >
                    {activity.action}
                  </Badge>
                  <div>
                    <p className="font-medium">{activity.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      ID: {activity.id} • {activity.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{activity.user}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}