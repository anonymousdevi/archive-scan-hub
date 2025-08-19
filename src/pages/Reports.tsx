import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
  Download,
  FileBarChart,
  Calendar,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  MapPin,
  FileText,
} from "lucide-react";

// Mock report data - replace with real API calls
const fileTransactions = [
  {
    id: "T-001",
    fileId: "F-2847",
    fileName: "Personnel Records 2024",
    action: "OUT" as const,
    user: "John Smith",
    location: "R1-S3-B12",
    timestamp: "2024-01-15 14:30:00",
    expectedReturn: "2024-01-18",
  },
  {
    id: "T-002",
    fileId: "F-2846",
    fileName: "Financial Reports Q4",
    action: "IN" as const,
    user: "Sarah Johnson",
    location: "R2-S1-B5",
    timestamp: "2024-01-15 13:15:00",
    expectedReturn: null,
  },
  {
    id: "T-003",
    fileId: "F-2845",
    fileName: "Legal Documents",
    action: "OUT" as const,
    user: "Mike Davis",
    location: "R1-S2-B8",
    timestamp: "2024-01-15 11:45:00",
    expectedReturn: "2024-01-17",
  },
  {
    id: "T-004",
    fileId: "F-2844",
    fileName: "Project Archives",
    action: "IN" as const,
    user: "Emily Wilson",
    location: "R3-S4-B15",
    timestamp: "2024-01-15 10:20:00",
    expectedReturn: null,
  },
];

const fileStatus = [
  {
    id: "F-2847",
    name: "Personnel Records 2024",
    status: "OUT" as const,
    location: "R1-S3-B12",
    checkedOutBy: "John Smith",
    checkedOutDate: "2024-01-15",
    expectedReturn: "2024-01-18",
    dayOut: 3,
  },
  {
    id: "F-2846",
    name: "Financial Reports Q4",
    status: "IN" as const,
    location: "R2-S1-B5",
    checkedOutBy: null,
    checkedOutDate: null,
    expectedReturn: null,
    dayOut: 0,
  },
  {
    id: "F-2845",
    name: "Legal Documents",
    status: "OUT" as const,
    location: "R1-S2-B8",
    checkedOutBy: "Mike Davis",
    checkedOutDate: "2024-01-14",
    expectedReturn: "2024-01-17",
    dayOut: 4,
  },
  {
    id: "F-2844",
    name: "Project Archives",
    status: "IN" as const,
    location: "R3-S4-B15",
    checkedOutBy: null,
    checkedOutDate: null,
    expectedReturn: null,
    dayOut: 0,
  },
];

const userActivity = [
  {
    user: "John Smith",
    totalTransactions: 45,
    filesOut: 12,
    filesIn: 33,
    avgDaysOut: 2.8,
    lastActivity: "2024-01-15 14:30:00",
  },
  {
    user: "Sarah Johnson",
    totalTransactions: 38,
    filesOut: 15,
    filesIn: 23,
    avgDaysOut: 3.2,
    lastActivity: "2024-01-15 13:15:00",
  },
  {
    user: "Mike Davis",
    totalTransactions: 52,
    filesOut: 20,
    filesIn: 32,
    avgDaysOut: 2.1,
    lastActivity: "2024-01-15 11:45:00",
  },
  {
    user: "Emily Wilson",
    totalTransactions: 29,
    filesOut: 10,
    filesIn: 19,
    avgDaysOut: 4.1,
    lastActivity: "2024-01-15 10:20:00",
  },
];

export default function Reports() {
  const [dateFrom, setDateFrom] = useState("2024-01-01");
  const [dateTo, setDateTo] = useState("2024-01-31");
  const [userFilter, setUserFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleExportReport = (reportType: string, format: string) => {
    toast.success(`Exporting ${reportType} as ${format.toUpperCase()}`, {
      description: "Report will be downloaded shortly",
    });
  };

  const filteredTransactions = fileTransactions.filter((transaction) => {
    const matchesSearch = transaction.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.fileId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = userFilter === "all" || transaction.user === userFilter;
    return matchesSearch && matchesUser;
  });

  const filteredStatus = fileStatus.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || file.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const uniqueUsers = [...new Set(fileTransactions.map(t => t.user))];

  return (
    <div className="space-y-6 slide-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-2">
          Generate and export archive system reports
        </p>
      </div>

      {/* Filters */}
      <Card className="shadow-professional">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Date From</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateTo">Date To</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>User Filter</Label>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map(user => (
                    <SelectItem key={user} value={user}>{user}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files or users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="status">File Status</TabsTrigger>
          <TabsTrigger value="users">User Activity</TabsTrigger>
        </TabsList>

        {/* Transaction History */}
        <TabsContent value="transactions" className="space-y-4">
          <Card className="shadow-professional">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <p className="text-sm text-muted-foreground">
                  All file check-in and check-out activities
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportReport("Transaction History", "pdf")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportReport("Transaction History", "excel")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File ID</TableHead>
                      <TableHead>File Name</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.fileId}</TableCell>
                        <TableCell>{transaction.fileName}</TableCell>
                        <TableCell>
                          <Badge
                            variant={transaction.action === "OUT" ? "destructive" : "default"}
                            className={
                              transaction.action === "OUT"
                                ? "status-out-light"
                                : "status-in-light"
                            }
                          >
                            {transaction.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.user}</TableCell>
                        <TableCell className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {transaction.location}
                        </TableCell>
                        <TableCell>{new Date(transaction.timestamp).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* File Status */}
        <TabsContent value="status" className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in">In Storage</SelectItem>
                <SelectItem value="out">Checked Out</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="shadow-professional">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>File Status Report</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Current status of all files in the system
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportReport("File Status", "pdf")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportReport("File Status", "excel")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File ID</TableHead>
                      <TableHead>File Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Checked Out By</TableHead>
                      <TableHead>Days Out</TableHead>
                      <TableHead>Expected Return</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStatus.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium">{file.id}</TableCell>
                        <TableCell>{file.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant={file.status === "OUT" ? "destructive" : "default"}
                            className={
                              file.status === "OUT"
                                ? "status-out-light"
                                : "status-in-light"
                            }
                          >
                            {file.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {file.location}
                        </TableCell>
                        <TableCell>{file.checkedOutBy || "-"}</TableCell>
                        <TableCell>
                          {file.dayOut > 0 && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {file.dayOut} days
                            </div>
                          )}
                          {file.dayOut === 0 && "-"}
                        </TableCell>
                        <TableCell>{file.expectedReturn || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Activity */}
        <TabsContent value="users" className="space-y-4">
          <Card className="shadow-professional">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Activity Report</CardTitle>
                <p className="text-sm text-muted-foreground">
                  User statistics and activity summary
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportReport("User Activity", "pdf")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportReport("User Activity", "excel")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Total Transactions</TableHead>
                      <TableHead>Files Checked Out</TableHead>
                      <TableHead>Files Returned</TableHead>
                      <TableHead>Avg Days Out</TableHead>
                      <TableHead>Last Activity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userActivity.map((user) => (
                      <TableRow key={user.user}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {user.user}
                        </TableCell>
                        <TableCell>{user.totalTransactions}</TableCell>
                        <TableCell className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-warning" />
                          {user.filesOut}
                        </TableCell>
                        <TableCell className="flex items-center gap-1">
                          <TrendingDown className="h-3 w-3 text-success" />
                          {user.filesIn}
                        </TableCell>
                        <TableCell>{user.avgDaysOut} days</TableCell>
                        <TableCell>{new Date(user.lastActivity).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}