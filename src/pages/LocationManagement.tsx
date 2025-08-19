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
  Edit,
  Trash2,
  MapPin,
  Package,
  Grid3X3,
  Layers,
} from "lucide-react";

// Mock data - replace with real API calls
const mockLocations = [
  {
    id: "L-001",
    code: "R1-S1-B1",
    rack: "R1",
    shelf: "S1",
    box: "B1",
    capacity: 50,
    occupied: 32,
    status: "active" as const,
    dateCreated: "2024-01-10",
  },
  {
    id: "L-002",
    code: "R1-S1-B2",
    rack: "R1",
    shelf: "S1",
    box: "B2",
    capacity: 50,
    occupied: 45,
    status: "active" as const,
    dateCreated: "2024-01-10",
  },
  {
    id: "L-003",
    code: "R1-S2-B8",
    rack: "R1",
    shelf: "S2",
    box: "B8",
    capacity: 50,
    occupied: 28,
    status: "active" as const,
    dateCreated: "2024-01-12",
  },
  {
    id: "L-004",
    code: "R2-S1-B5",
    rack: "R2",
    shelf: "S1",
    box: "B5",
    capacity: 75,
    occupied: 62,
    status: "full" as const,
    dateCreated: "2024-01-11",
  },
  {
    id: "L-005",
    code: "R3-S4-B15",
    rack: "R3",
    shelf: "S4",
    box: "B15",
    capacity: 40,
    occupied: 12,
    status: "active" as const,
    dateCreated: "2024-01-13",
  },
];

interface LocationFormData {
  rack: string;
  shelf: string;
  box: string;
  capacity: string;
}

export default function LocationManagement() {
  const [locations, setLocations] = useState(mockLocations);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<LocationFormData>({
    rack: "",
    shelf: "",
    box: "",
    capacity: "",
  });

  const filteredLocations = locations.filter((location) => {
    const matchesSearch = location.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.rack.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.shelf.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.box.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || location.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddLocation = async () => {
    if (!formData.rack || !formData.shelf || !formData.box || !formData.capacity) {
      toast.error("Please fill in all required fields");
      return;
    }

    const locationCode = `${formData.rack}-${formData.shelf}-${formData.box}`;
    
    // Check if location already exists
    if (locations.some(loc => loc.code === locationCode)) {
      toast.error("Location already exists");
      return;
    }

    const newId = `L-${String(locations.length + 1).padStart(3, '0')}`;
    
    const newLocation = {
      id: newId,
      code: locationCode,
      rack: formData.rack,
      shelf: formData.shelf,
      box: formData.box,
      capacity: parseInt(formData.capacity),
      occupied: 0,
      status: "active" as const,
      dateCreated: new Date().toISOString().split('T')[0],
    };

    setLocations(prev => [newLocation, ...prev]);
    setFormData({ rack: "", shelf: "", box: "", capacity: "" });
    setIsAddDialogOpen(false);
    
    toast.success(`Location ${locationCode} created successfully`);
  };

  const handlePrintBarcode = (locationCode: string) => {
    toast.success(`Printing barcode for ${locationCode}`, {
      description: "Location barcode sent to printer",
    });
  };

  const handleDeleteLocation = (locationId: string, locationCode: string) => {
    const location = locations.find(l => l.id === locationId);
    if (location && location.occupied > 0) {
      toast.error("Cannot delete location with files", {
        description: `Remove ${location.occupied} files first`,
      });
      return;
    }
    
    setLocations(prev => prev.filter(l => l.id !== locationId));
    toast.success(`Location ${locationCode} deleted successfully`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "status-in-light";
      case "full": return "status-out-light";
      case "inactive": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCapacityPercentage = (occupied: number, capacity: number) => {
    return (occupied / capacity) * 100;
  };

  return (
    <div className="space-y-6 slide-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Location Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage storage locations and capacity
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary shadow-glow">
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="rack">Rack *</Label>
                  <Input
                    id="rack"
                    value={formData.rack}
                    onChange={(e) => setFormData(prev => ({ ...prev, rack: e.target.value }))}
                    placeholder="R1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shelf">Shelf *</Label>
                  <Input
                    id="shelf"
                    value={formData.shelf}
                    onChange={(e) => setFormData(prev => ({ ...prev, shelf: e.target.value }))}
                    placeholder="S1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="box">Box *</Label>
                  <Input
                    id="box"
                    value={formData.box}
                    onChange={(e) => setFormData(prev => ({ ...prev, box: e.target.value }))}
                    placeholder="B1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                  placeholder="Enter maximum file capacity"
                  min="1"
                />
              </div>
              
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Preview: {formData.rack && formData.shelf && formData.box ? 
                    `${formData.rack}-${formData.shelf}-${formData.box}` : 
                    "R1-S1-B1"}
                </p>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddLocation} className="flex-1 bg-gradient-primary">
                  Create Location
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData({ rack: "", shelf: "", box: "", capacity: "" });
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
                placeholder="Search locations by code, rack, shelf, or box..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="full">Full</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Locations Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLocations.map((location) => {
          const capacityPercentage = getCapacityPercentage(location.occupied, location.capacity);
          
          return (
            <Card key={location.id} className="shadow-professional hover:shadow-glow transition-smooth">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{location.code}</CardTitle>
                    <p className="text-sm text-muted-foreground">ID: {location.id}</p>
                  </div>
                  <Badge className={getStatusColor(location.status)}>
                    {location.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-medium">
                      {location.occupied} / {location.capacity}
                    </span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        capacityPercentage >= 90 
                          ? "bg-warning" 
                          : capacityPercentage >= 75 
                          ? "bg-yellow-500" 
                          : "bg-success"
                      }`}
                      style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                    />
                  </div>
                  
                  <div className="text-xs text-muted-foreground text-center">
                    {capacityPercentage.toFixed(1)}% filled
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <Grid3X3 className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Rack</p>
                    <p className="font-medium">{location.rack}</p>
                  </div>
                  
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <Layers className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Shelf</p>
                    <p className="font-medium">{location.shelf}</p>
                  </div>
                  
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <Package className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Box</p>
                    <p className="font-medium">{location.box}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePrintBarcode(location.code)}
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
                    onClick={() => handleDeleteLocation(location.id, location.code)}
                    className="text-destructive hover:text-destructive"
                    disabled={location.occupied > 0}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredLocations.length === 0 && (
        <Card className="shadow-professional">
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No locations found</p>
              <p>Try adjusting your search criteria or add a new location</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}