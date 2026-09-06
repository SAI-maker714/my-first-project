import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ticket, MapPin, Calendar, Loader2, Trash2, Hotel, Plane } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MyBookings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    setBookings(data || []);
    setLoading(false);
  };

  const cancelBooking = async (id: string) => {
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setBookings(bookings.filter((b) => b.id !== id));
      toast({ title: "Booking cancelled" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <h1 className="text-3xl font-display font-bold mb-2 flex items-center gap-3">
          <Ticket className="h-8 w-8 text-primary" /> My Bookings
        </h1>
        <p className="text-muted-foreground mb-8">All your hotel and transport bookings</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No bookings yet. Explore and book!</p>
            <Link to="/dashboard"><Button>Explore Destinations</Button></Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-5 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {booking.booking_type === "hotel" ? (
                      <Hotel className="h-5 w-5 text-primary" />
                    ) : (
                      <Plane className="h-5 w-5 text-primary" />
                    )}
                    <span className="text-xs font-medium uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {booking.booking_type}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => cancelBooking(booking.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <h3 className="font-semibold mb-1">{booking.item_name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                  <MapPin className="h-3 w-3" /> {booking.destination}
                </p>

                <div className="text-sm space-y-1 mb-3">
                  <p className="text-muted-foreground">Guest: <span className="text-foreground">{booking.guest_name}</span></p>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(booking.booking_date).toLocaleDateString("en-IN", { dateStyle: "long" })}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <p className="font-mono text-xs text-muted-foreground">{booking.booking_id}</p>
                  <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded">
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
