import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft, Trash2, Calendar, Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MyTrips = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchTrips();
  }, [user]);

  const fetchTrips = async () => {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (!error) setTrips(data || []);
    setLoading(false);
  };

  const deleteTrip = async (id: string) => {
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setTrips(trips.filter((t) => t.id !== id));
      toast({ title: "Trip deleted" });
    }
  };

  const exportPDF = (trip: any) => {
    const doc = new jsPDF();
    const itinerary = trip.itinerary;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(34, 87, 55);
    doc.text("YatraPlanner", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Your Indian Travel Companion", 14, 27);
    doc.line(14, 30, 196, 30);

    // Trip info
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(trip.trip_name, 14, 40);
    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text(`Destination: ${trip.destination}`, 14, 48);
    doc.text(`Created: ${new Date(trip.created_at).toLocaleDateString()}`, 14, 55);
    if (trip.notes) {
      doc.text(`Notes: ${trip.notes}`, 14, 62);
    }

    let y = trip.notes ? 72 : 65;

    // Overview
    if (itinerary?.overview) {
      doc.setFontSize(13);
      doc.setTextColor(34, 87, 55);
      doc.text("Overview", 14, y);
      y += 7;
      doc.setFontSize(10);
      doc.setTextColor(60);
      const lines = doc.splitTextToSize(itinerary.overview, 170);
      doc.text(lines, 14, y);
      y += lines.length * 5 + 5;
    }

    // Places
    if (itinerary?.places?.length) {
      doc.setFontSize(13);
      doc.setTextColor(34, 87, 55);
      doc.text("Places to Visit", 14, y);
      y += 3;
      autoTable(doc, {
        startY: y,
        head: [["#", "Place", "Description", "Best Time"]],
        body: itinerary.places.map((p: any, i: number) => [i + 1, p.name, p.description, p.best_time || "-"]),
        theme: "grid",
        headStyles: { fillColor: [34, 87, 55] },
        styles: { fontSize: 9 },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }

    // Itinerary
    if (itinerary?.itinerary?.length) {
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setFontSize(13);
      doc.setTextColor(34, 87, 55);
      doc.text("Day-wise Itinerary", 14, y);
      y += 3;
      const rows = itinerary.itinerary.flatMap((d: any) =>
        d.activities.map((a: string, j: number) => [j === 0 ? `Day ${d.day}` : "", a])
      );
      autoTable(doc, {
        startY: y,
        head: [["Day", "Activity"]],
        body: rows,
        theme: "grid",
        headStyles: { fillColor: [34, 87, 55] },
        styles: { fontSize: 9 },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }

    // Hotels
    if (itinerary?.hotels?.length) {
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setFontSize(13);
      doc.setTextColor(34, 87, 55);
      doc.text("Recommended Hotels", 14, y);
      y += 3;
      autoTable(doc, {
        startY: y,
        head: [["Hotel", "Type", "Price Range"]],
        body: itinerary.hotels.map((h: any) => [h.name, h.type, h.price_range]),
        theme: "grid",
        headStyles: { fillColor: [34, 87, 55] },
        styles: { fontSize: 9 },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }

    // Budget
    if (itinerary?.budget) {
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setFontSize(13);
      doc.setTextColor(34, 87, 55);
      doc.text("Budget Estimate (Mid-Range, per person/day)", 14, y);
      y += 3;
      const bd = itinerary.budget.midrange_per_day;
      if (bd) {
        autoTable(doc, {
          startY: y,
          head: [["Category", "Amount (₹)"]],
          body: Object.entries(bd).map(([k, v]) => [k.replace(/_/g, " "), `₹${Number(v).toLocaleString("en-IN")}`]),
          theme: "grid",
          headStyles: { fillColor: [34, 87, 55] },
          styles: { fontSize: 9 },
        });
      }
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`YatraPlanner — Page ${i} of ${pageCount}`, 14, 290);
    }

    doc.save(`${trip.trip_name.replace(/\s+/g, "_")}_YatraPlanner.pdf`);
    toast({ title: "PDF Downloaded!", description: "Your trip itinerary has been exported." });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <h1 className="text-3xl font-display font-bold mb-8">My Saved Trips</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No saved trips yet. Start exploring!</p>
            <Link to="/dashboard"><Button>Explore Destinations</Button></Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-semibold text-lg">{trip.trip_name}</h3>
                    <p className="text-primary text-sm flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {trip.destination}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteTrip(trip.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                {trip.notes && <p className="text-muted-foreground text-sm mb-3">{trip.notes}</p>}
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                  <Calendar className="h-3 w-3" />
                  {new Date(trip.created_at).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Link to={`/explore/${encodeURIComponent(trip.destination)}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">View</Button>
                  </Link>
                  <Button variant="default" size="sm" onClick={() => exportPDF(trip)} className="flex-1">
                    <Download className="h-4 w-4 mr-1" /> PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;
