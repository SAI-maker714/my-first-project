import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, History, MapPin, Ticket, Calendar, Download, Loader2, Plane, Hotel } from "lucide-react";

const iconMap: Record<string, any> = {
  explore: MapPin,
  booking: Ticket,
  trip_saved: Calendar,
  pdf_export: Download,
  hotel_booking: Hotel,
  transport_booking: Plane,
};

const ActivityHistory = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchActivities();
  }, [user]);

  const fetchActivities = async () => {
    const { data } = await supabase
      .from("activity_log")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(100);
    setActivities(data || []);
    setLoading(false);
  };

  const getIcon = (action: string) => {
    const Icon = iconMap[action] || History;
    return <Icon className="h-5 w-5 text-primary" />;
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return d.toLocaleDateString("en-IN", { dateStyle: "medium" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <h1 className="text-3xl font-display font-bold mb-2 flex items-center gap-3">
          <History className="h-8 w-8 text-primary" /> Activity History
        </h1>
        <p className="text-muted-foreground mb-8">Track all your activities on YatraPlanner</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-20">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No activity yet. Start exploring India!</p>
            <Link to="/dashboard"><Button>Explore Destinations</Button></Link>
          </div>
        ) : (
          <div className="space-y-1">
            {activities.map((activity, i) => (
              <div key={activity.id} className="flex gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="mt-1 shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {getIcon(activity.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{activity.description}</p>
                  {activity.metadata?.destination && (
                    <p className="text-xs text-primary mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {activity.metadata.destination}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{formatTime(activity.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityHistory;
