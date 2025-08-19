import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Plus,
  Search,
  QrCode,
  Download,
  Edit,
  Trash2,
  FileText,
  MapPin,
  Calendar,
  User,
} from "lucide-react";

// Mock data - replace with real API calls
const mockFiles = [
  {
    id: "F-2847",
    name: "Personnel Records 2024",
    location: "R1-S3-B12",
    status: "IN" as const,
    dateAdded: "2024-01-15",
    lastUser: "John Smith",
    category: "HR",
  },
  {
    id: "F-2846",
    name: "Financial Reports Q4",
    location: "R2-S1-B5",
    status: "OUT" as const,
    dateAdded: "2024-01-14",
    lastUser: "Sarah Johnson",
    category: "Finance",
  },
  {
    id: "F-2845",
    name: "Legal Documents",
    location: "R1-S2-B8",
    status: "IN" as const,
    dateAdded: "2024-01-13",
    lastUser: "Mike Davis",
    category: "Legal",
  },
  {
    id: "F-2844",
    name: "Project Archives",
    location: "R3-S4-B15",
    status: "OUT" as const,
    dateAdded: "2024-01-12",
    lastUser: "Emily Wilson",
    category: "Projects",
  },
];

const mockLocations = [
  "R1-S1-B1", "R1-S1-B2", "R1-S2-B8", "R1-S3-B12",
  "R2-S1-B5", "R2-S2-B10", "R3-S4-B15", "R3-S5-B20"
];

interface FileFormData {
  name: string;
  location: string;
  category: string;
}

export default function FileManagement() {
  const [files, setFiles] = useState(mockFiles);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FileFormData>({
    name: "",
    location: "",
    category: "",
  });

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || file.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddFile = async () => {
    if (!formData.name || !formData.location || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Generate new file ID
    const newId = `F-${String(Math.max(...files.map(f => parseInt(f.id.split('-')[1]))) + 1).padStart(4, '0')}`;
    
    const newFile = {
      id: newId,
      name: formData.name,
      location: formData.location,
      status: "IN" as const,
      dateAdded: new Date().toISOString().split('T')[0],
      lastUser: "Current User",
      category: formData.category,
    };

    setFiles(prev => [newFile, ...prev]);
    setFormData({ name: "", location: "", category: "" });
    setIsAddDialogOpen(false);
    
    toast.success(`File ${newId} added successfully`, {
      description: formData.name,
    });
  };

  const handlePrintBarcode = (fileId: string) => {
    // In a real app, this would generate and print a barcode
    toast.success(`Printing barcode for ${fileId}`, {
      description: "Barcode sent to printer",
    });
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast.success(`File ${fileId} deleted successfully`);
  };

  return (
    <div className="space-y-6 slide-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">File Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your archive files and locations
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary shadow-glow">
              <Plus className="h-4 w-4 mr-2" />
              Add New File
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New File</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fileName">File Name *</Label>
                <Input
                  id="fileName"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter file name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLocations.map(location => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                    <SelectItem value="Projects">Projects</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddFile} className="flex-1 bg-gradient-primary">
                  Add File
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData({ name: "", location: "", category: "" });
                    setIsAddDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-professional">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files by name, ID, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in">In Storage</SelectItem>
                <SelectItem value="out">Checked Out</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Files Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="shadow-professional hover:shadow-glow transition-smooth">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{file.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">ID: {file.id}</p>
                </div>
                <Badge
                  variant={file.status === "IN" ? "default" : "destructive"}
                  className={
                    file.status === "IN" ? "status-in-light" : "status-out-light"
                  }
                >
                  {file.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{file.location}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{file.category}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Added:</span>
                  <span className="font-medium">{file.dateAdded}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last User:</span>
                  <span className="font-medium">{file.lastUser}</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePrintBarcode(file.id)}
                  className="flex-1"
                >
                  <QrCode className="h-3 w-3 mr-1" />
                  Print
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info("Edit functionality coming soon")}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteFile(file.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <Card className="shadow-professional">
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No files found</p>
              <p>Try adjusting your search criteria or add a new file</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}