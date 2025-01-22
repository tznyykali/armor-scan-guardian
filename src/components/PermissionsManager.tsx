import { Shield, Battery, HardDrive, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { usePermissions, PermissionStatus } from '@/hooks/usePermissions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PermissionItem = ({ 
  name, 
  status, 
  icon: Icon, 
  description, 
  onRequest 
}: { 
  name: string;
  status: PermissionStatus;
  icon: React.ElementType;
  description: string;
  onRequest: () => void;
}) => (
  <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg">
    <Icon className="w-5 h-5 mt-1 text-rust" />
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{name}</h4>
        <span className={`text-xs px-2 py-1 rounded ${
          status === 'granted' ? 'bg-green-500/10 text-green-500' :
          status === 'denied' ? 'bg-red-500/10 text-red-500' :
          'bg-yellow-500/10 text-yellow-500'
        }`}>
          {status}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
      {status !== 'granted' && status !== 'unavailable' && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRequest}
          className="mt-2"
        >
          Request Access
        </Button>
      )}
    </div>
  </div>
);

const PermissionsManager = () => {
  const { permissions, requestPermission } = usePermissions();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Shield className="w-4 h-4" />
          Permissions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>System Permissions</DialogTitle>
          <DialogDescription>
            Manage permissions for optimal scanning and analysis
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <PermissionItem
            name="Battery Status"
            status={permissions.battery}
            icon={Battery}
            description="Access battery information to optimize scanning"
            onRequest={() => requestPermission('battery')}
          />
          <PermissionItem
            name="Storage Access"
            status={permissions.storage}
            icon={HardDrive}
            description="Access storage information for file analysis"
            onRequest={() => requestPermission('storage')}
          />
          <PermissionItem
            name="Notifications"
            status={permissions.notifications}
            icon={Bell}
            description="Receive scan completion notifications"
            onRequest={() => requestPermission('notifications')}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionsManager;