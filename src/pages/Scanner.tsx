import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  QrCode,
  Scan,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
  FileText,
} from "lucide-react";

// Mock file data - replace with real API calls
const mockFileData = {
  "F-2847": {
    id: "F-2847",
    name: "Personnel Records 2024",
    location: "R1-S3-B12",
    status: "IN" as const,
    lastUser: "John Smith",
    lastAction: "2024-01-15 10:30:00",
  },
  "F-2846": {
    id: "F-2846",
    name: "Financial Reports Q4",
    location: "R2-S1-B5",
    status: "OUT" as const,
    lastUser: "Sarah Johnson",
    lastAction: "2024-01-15 09:15:00",
  },
};

interface FileInfo {
  id: string;
  name: string;
  location: string;
  status: "IN" | "OUT";
  lastUser: string;
  lastAction: string;
}

export default function Scanner() {
  const [scanInput, setScanInput] = useState("");
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [recentScans, setRecentScans] = useState<Array<{
    id: string;
    name: string;
    action: "IN" | "OUT";
    timestamp: string;
    user: string;
  }>>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount and keep it focused
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    focusInput();
    
    // Refocus when clicking anywhere on the page
    const handleClick = () => focusInput();
    document.addEventListener("click", handleClick);
    
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleScan = async (fileId: string) => {
    if (!fileId.trim()) return;

    setIsScanning(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const file = mockFileData[fileId as keyof typeof mockFileData];
      
      if (!file) {
        toast.error(`File ${fileId} not found in system`);
        setFileInfo(null);
        return;
      }

      // Toggle status
      const newStatus: "IN" | "OUT" = file.status === "IN" ? "OUT" : "IN";
      const updatedFile: FileInfo = {
        ...file,
        status: newStatus,
        lastUser: "Current User", // Replace with actual user
        lastAction: new Date().toISOString(),
      };

      setFileInfo(updatedFile);
      
      // Add to recent scans
      const newScan = {
        id: file.id,
        name: file.name,
        action: newStatus as "IN" | "OUT",
        timestamp: new Date().toLocaleString(),
        user: "Current User",
      };
      
      setRecentScans(prev => [newScan, ...prev.slice(0, 9)]);
      
      // Show success toast with status bounce animation
      const statusText = newStatus === "OUT" ? "checked out" : "returned";
      toast.success(`File ${file.id} successfully ${statusText}`, {
        description: file.name,
      });

      // Update mock data (in real app, this would be handled by the backend)
      (mockFileData as any)[fileId] = updatedFile;
      
    } catch (error) {
      toast.error("Error processing scan. Please try again.");
      setFileInfo(null);
    } finally {
      setIsScanning(false);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scanInput.trim()) {
      handleScan(scanInput.trim());
      setScanInput("");
    }
  };

  const clearCurrentFile = () => {
    setFileInfo(null);
    setScanInput("");
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-6 slide-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scanner</h1>
        <p className="text-muted-foreground mt-2">
          Scan file barcodes to check in/out
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scanner Interface */}
        <Card className="shadow-professional">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Barcode Scanner
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Scan or manually enter file ID
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scan Input */}
            <form onSubmit={handleInputSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  ref={inputRef}
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder="Scan barcode or enter File ID..."
                  className={`text-lg h-14 pr-12 scan-pulse ${
                    isScanning ? "animate-pulse" : ""
                  }`}
                  disabled={isScanning}
                />
                <Scan className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
              </div>
              
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-gradient-primary"
                  disabled={!scanInput.trim() || isScanning}
                >
                  {isScanning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Scan className="h-4 w-4 mr-2" />
                      Process Scan
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearCurrentFile}
                  disabled={isScanning}
                >
                  Clear
                </Button>
              </div>
            </form>

            {/* File Information Display */}
            {fileInfo && (
              <div className="space-y-4 p-4 border rounded-lg bg-accent/20 status-bounce">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{fileInfo.name}</h3>
                  <Badge
                    variant={fileInfo.status === "IN" ? "default" : "destructive"}
                    className={`text-sm ${
                      fileInfo.status === "IN" ? "status-in" : "status-out"
                    }`}
                  >
                    {fileInfo.status === "IN" ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        IN STORAGE
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        CHECKED OUT
                      </>
                    )}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">File ID:</span>
                    <span className="font-medium">{fileInfo.id}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{fileInfo.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Last User:</span>
                    <span className="font-medium">{fileInfo.lastUser}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Last Action:</span>
                    <span className="font-medium">
                      {new Date(fileInfo.lastAction).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Scans */}
        <Card className="shadow-professional">
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <p className="text-sm text-muted-foreground">
              Latest scan activity
            </p>
          </CardHeader>
          <CardContent>
            {recentScans.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Scan className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent scans</p>
                <p className="text-sm">Start scanning to see activity here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentScans.map((scan, index) => (
                  <div
                    key={`${scan.id}-${index}`}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-smooth"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={scan.action === "OUT" ? "destructive" : "default"}
                        className={
                          scan.action === "OUT"
                            ? "status-out-light"
                            : "status-in-light"
                        }
                      >
                        {scan.action}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{scan.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {scan.id} • {scan.user}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {scan.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
