import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, MapPin, Calendar, Loader2, Shield } from "lucide-react";

const AdminPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: 0, trips: 0 });
  const [allTrips, setAllTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) checkAdmin();
  }, [user]);

  const checkAdmin = async () => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user!.id)
      .eq("role", "admin")
      .maybeSingle();
    if (data) {
      setIsAdmin(true);
      fetchAdminData();
    } else {
      setIsAdmin(false);
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    const [tripsRes, profilesRes] = await Promise.all([
      supabase.from("trips").select("*, profiles(full_name, email)").order("created_at", { ascending: false }).limit(50),
      supabase.from("profiles").select("id", { count: "exact" }),
    ]);
    setAllTrips(tripsRes.data || []);
    setStats({
      users: profilesRes.count || 0,
      trips: tripsRes.data?.length || 0,
    });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have admin privileges.</p>
          <Link to="/dashboard"><Button>Go to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <h1 className="text-3xl font-display font-bold mb-8">Admin Panel</h1>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{stats.users}</p>
                <p className="text-muted-foreground text-sm">Total Users</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{stats.trips}</p>
                <p className="text-muted-foreground text-sm">Total Trips</p>
              </div>
            </div>
          </div>
        </div>

        {/* All Trips */}
        <h2 className="font-display text-xl font-semibold mb-4">Recent Trips (All Users)</h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 text-sm font-semibold">User</th>
                <th className="text-left p-4 text-sm font-semibold">Trip Name</th>
                <th className="text-left p-4 text-sm font-semibold">Destination</th>
                <th className="text-left p-4 text-sm font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {allTrips.map((trip) => (
                <tr key={trip.id} className="border-t border-border">
                  <td className="p-4 text-sm">{(trip.profiles as any)?.full_name || "Unknown"}</td>
                  <td className="p-4 text-sm">{trip.trip_name}</td>
                  <td className="p-4 text-sm text-primary">{trip.destination}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(trip.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
