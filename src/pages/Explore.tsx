import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, ArrowLeft, Plane, Train, Bus, Car, Hotel, Calendar, Loader2, Plus, Calculator, Star, Ticket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const UNSPLASH_FALLBACK = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=300&fit=crop&q=80";

// Generate a deterministic but unique image for each place/hotel based on name + state
const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

// Large curated set of Indian landmark/travel Unsplash photo IDs — 40+ unique entries
const indiaPhotoIds = [
  "photo-1524492412937-b28074a5d7da", // India Gate
  "photo-1564507592333-c60657eea523", // Taj Mahal
  "photo-1477587458883-47145ed94245", // Rajasthan fort
  "photo-1598091383021-15ddea10925d", // Meghalaya roots bridge
  "photo-1582510003544-4d00b7f74220", // South Indian temple
  "photo-1600100397608-e1f06cf8c571", // Hampi ruins
  "photo-1625807171007-573beb5ed21e", // Kerala backwaters
  "photo-1512343879784-a960bf40e7f2", // Goa beach
  "photo-1590766740616-db2e4f07b58b", // Tirupati/AP temple
  "photo-1506461883276-594a12b11cf3", // Mountain landscape
  "photo-1570168007204-dfb528c6958f", // Mumbai Gateway
  "photo-1558431382-27e303142255", // Kolkata Howrah
  "photo-1597074866923-dc0589150458", // Kashmir Dal Lake
  "photo-1609947017136-9daf32a15c8d", // Golden Temple
  "photo-1587474260584-136574528ed5", // Delhi Red Fort
  "photo-1596402184320-417e7178b2cd", // Rann of Kutch
  "photo-1578662996442-48f60103fc96", // NE India tea gardens
  "photo-1506905925346-21bda4d32df4", // Mountain peak
  "photo-1585135497273-1a86d9471c9f", // Ancient architecture
  "photo-1544735716-392fe2489ffa", // Indian street
  "photo-1548013146-72479768bada", // Varanasi ghats
  "photo-1599661046289-e31897846e41", // Jaipur Hawa Mahal
  "photo-1614082242765-7c98ca0f3df3", // Mysore Palace
  "photo-1602216056096-3b40cc0c9944", // Udaipur lake palace
  "photo-1623682242096-1ed1e4963a11", // Rishikesh
  "photo-1590050752117-238cb0fb12b3", // Waterfall
  "photo-1626621341517-bbf3d9990a23", // NE hill station
  "photo-1501785888041-af3ef285b470", // Mountain valley
  "photo-1472120435266-95a3f747eb08", // Snowy peaks
  "photo-1433086966358-54859d0ed716", // Forest waterfall
  "photo-1470071459604-3b5ec3a7fe05", // Green valley
  "photo-1500382017468-9049fed747ef", // Fields
  "photo-1464822759023-fed622ff2c3b", // Dramatic mountains
  "photo-1507525428034-b723cf961d3e", // Tropical beach
  "photo-1469474968028-56623f02e42e", // Nature sunset
  "photo-1482938289607-e9573fc25ebb", // River canyon
  "photo-1465056836900-8f1e940f1eac", // Desert dunes
  "photo-1518495973542-4542c06a5843", // Sunlight forest
  "photo-1505765050516-f72dcac9c60e", // Coastal cliffs
  "photo-1519681393784-d120267933ba", // Snowy mountain night
];

const hotelPhotoIds = [
  "photo-1566073771259-6a8506099945", // Resort pool
  "photo-1582719478250-c89cae4dc85b", // Hotel room
  "photo-1551882547-ff40c63fe5fa", // Luxury hotel
  "photo-1618773928121-c32242e63f39", // Hotel bedroom
  "photo-1590490360182-c33d57733427", // Resort view
  "photo-1571003123894-1f0594d2b5d9", // Heritage hotel
  "photo-1520250497591-112f2f40a3f4", // Beach resort
  "photo-1542314831-068cd1dbfeeb", // Hotel lobby
  "photo-1445019980597-93fa8acb246c", // Mountain hotel
  "photo-1562790351-d273a961e0e9", // Palace hotel
  "photo-1563911302283-d2bc129e7570", // Pool villa
  "photo-1578683010236-d716f9a3f461", // Boutique hotel
];

const getPlaceImageUrl = (placeName: string, stateName: string, index: number) => {
  // Use state name as primary seed so different states get different starting points
  const stateSeed = hashCode(stateName);
  const placeSeed = hashCode(placeName);
  const photoIndex = (stateSeed * 7 + placeSeed + index * 3) % indiaPhotoIds.length;
  return `https://images.unsplash.com/${indiaPhotoIds[photoIndex]}?w=400&h=300&fit=crop&q=80`;
};

const getHotelImageUrl = (hotelName: string, stateName: string, index: number) => {
  const stateSeed = hashCode(stateName);
  const hotelSeed = hashCode(hotelName);
  const photoIndex = (stateSeed * 5 + hotelSeed + index * 2) % hotelPhotoIds.length;
  return `https://images.unsplash.com/${hotelPhotoIds[photoIndex]}?w=400&h=300&fit=crop&q=80`;
};

const Explore = () => {
  const { state } = useParams<{ state: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [destinationData, setDestinationData] = useState<any>(null);
  const [savingTrip, setSavingTrip] = useState(false);
  const [tripName, setTripName] = useState("");
  const [tripNotes, setTripNotes] = useState("");
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [budgetType, setBudgetType] = useState("midrange");
  const [numDays, setNumDays] = useState(3);
  const [numPeople, setNumPeople] = useState(2);
  const [showBooking, setShowBooking] = useState<string | null>(null);
  const [bookingName, setBookingName] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (state) {
      fetchDestinationInfo(state);
      logActivity("explore", `Explored ${state}`, { destination: state });
    }
  }, [state]);

  const logActivity = async (action: string, description: string, metadata: any = {}) => {
    if (!user) return;
    await supabase.from("activity_log").insert({
      user_id: user.id,
      action,
      description,
      metadata,
    });
  };

  const fetchDestinationInfo = async (stateName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-destination-info", {
        body: { state: stateName },
      });
      if (error) throw error;
      setDestinationData(data);
    } catch (err) {
      console.error("Error fetching destination:", err);
      toast({ title: "Error", description: "Failed to load destination info.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!tripName.trim()) return;
    setSavingTrip(true);
    try {
      const { error } = await supabase.from("trips").insert({
        user_id: user?.id,
        destination: state,
        trip_name: tripName,
        notes: tripNotes,
        itinerary: destinationData,
      });
      if (error) throw error;
      await logActivity("trip_saved", `Saved trip "${tripName}" to ${state}`, { destination: state, trip_name: tripName });
      toast({ title: "Trip saved!", description: "Your trip has been saved to My Trips." });
      setShowSaveForm(false);
      setTripName("");
      setTripNotes("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSavingTrip(false);
    }
  };

  const getBudgetData = () => {
    const budgetMap: Record<string, string> = { budget: "budget_per_day", midrange: "midrange_per_day", luxury: "luxury_per_day" };
    const data = destinationData?.budget?.[budgetMap[budgetType]];
    if (!data) return null;
    const perDay = Object.values(data).reduce((a: number, b: any) => a + Number(b), 0) as number;
    return { ...data, total_per_day: perDay, grand_total: (perDay as number) * numDays * numPeople };
  };

  const handleBooking = async (type: string, itemName: string, bookingType: "hotel" | "transport") => {
    if (!bookingName.trim() || !bookingDate) {
      toast({ title: "Missing info", description: "Please enter your name and date.", variant: "destructive" });
      return;
    }
    setBookingLoading(true);
    const bookingId = `YP-${Date.now().toString(36).toUpperCase()}`;

    try {
      const bookingData = {
        user_id: user!.id,
        booking_id: bookingId,
        booking_type: bookingType,
        item_name: itemName,
        destination: state || "",
        guest_name: bookingName,
        booking_date: bookingDate,
        status: "confirmed",
        details: { type },
      };

      const { error } = await supabase.from("bookings").insert(bookingData);
      if (error) throw error;

      await logActivity(
        bookingType === "hotel" ? "hotel_booking" : "transport_booking",
        `Booked ${itemName} in ${state}`,
        { destination: state, booking_id: bookingId, item: itemName }
      );

      // Navigate to thank you page
      navigate("/booking/confirmation", {
        state: { ...bookingData, created_at: new Date().toISOString() },
      });
    } catch (err: any) {
      toast({ title: "Booking failed", description: err.message, variant: "destructive" });
    } finally {
      setBookingLoading(false);
      setShowBooking(null);
      setBookingName("");
      setBookingDate("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold">{state}</h1>
            <p className="text-muted-foreground mt-1">Discover places, plan itinerary, and book transport</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowBudget(!showBudget)}>
              <Calculator className="h-4 w-4 mr-2" /> Budget Calculator
            </Button>
            <Button onClick={() => setShowSaveForm(!showSaveForm)}>
              <Plus className="h-4 w-4 mr-2" /> Save Trip
            </Button>
          </div>
        </div>

        {/* Save Trip Form */}
        {showSaveForm && (
          <div className="mb-8 p-6 rounded-xl bg-card border border-border">
            <h3 className="font-display font-semibold text-lg mb-4">Save This Trip</h3>
            <div className="space-y-3 max-w-md">
              <Input placeholder="Trip name (e.g., Rajasthan Family Trip)" value={tripName} onChange={(e) => setTripName(e.target.value)} />
              <Textarea placeholder="Any notes..." value={tripNotes} onChange={(e) => setTripNotes(e.target.value)} />
              <Button onClick={handleSaveTrip} disabled={savingTrip}>
                {savingTrip ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Trip
              </Button>
            </div>
          </div>
        )}

        {/* Budget Calculator */}
        {showBudget && destinationData?.budget && (
          <div className="mb-8 p-6 rounded-xl bg-card border border-border">
            <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" /> Budget Calculator
            </h3>
            <div className="flex flex-wrap gap-4 mb-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Budget Type</label>
                <Select value={budgetType} onValueChange={setBudgetType}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="midrange">Mid-Range</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Days</label>
                <Input type="number" min={1} max={30} value={numDays} onChange={(e) => setNumDays(Number(e.target.value))} className="w-24" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">People</label>
                <Input type="number" min={1} max={20} value={numPeople} onChange={(e) => setNumPeople(Number(e.target.value))} className="w-24" />
              </div>
            </div>
            {(() => {
              const b = getBudgetData();
              if (!b) return null;
              return (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(b).filter(([k]) => !k.startsWith("total") && !k.startsWith("grand")).map(([k, v]) => (
                    <div key={k} className="p-3 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground capitalize">{k.replace(/_/g, " ")}</p>
                      <p className="font-semibold text-primary">₹{Number(v).toLocaleString("en-IN")}/day</p>
                    </div>
                  ))}
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-xs text-muted-foreground">Per Day Total</p>
                    <p className="font-semibold text-primary">₹{b.total_per_day.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary text-primary-foreground sm:col-span-2 lg:col-span-1">
                    <p className="text-xs opacity-80">Grand Total ({numDays} days × {numPeople} people)</p>
                    <p className="font-bold text-2xl">₹{b.grand_total.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading destination info with AI...</p>
            </div>
          </div>
        ) : destinationData ? (
          <div className="space-y-8">
            {/* Overview */}
            <section className="p-6 rounded-xl bg-card border border-border">
              <h2 className="font-display text-2xl font-bold mb-3">About {state}</h2>
              <p className="text-foreground/80 leading-relaxed">{destinationData.overview}</p>
            </section>

            {/* Places to Visit */}
            <section>
              <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" /> Places to Visit
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {destinationData.places?.map((place: any, i: number) => (
                  <div key={i} className="rounded-xl bg-card border border-border hover:shadow-lg transition-shadow overflow-hidden group">
                    <div className="h-44 overflow-hidden">
                      <img
                        src={getPlaceImageUrl(place.name, state || "", i)}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = UNSPLASH_FALLBACK; }}
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-1">{place.name}</h3>
                      <p className="text-muted-foreground text-sm">{place.description}</p>
                      {place.best_time && <p className="text-xs text-primary mt-2">Best time: {place.best_time}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Itinerary */}
            <section>
              <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" /> Suggested Itinerary
              </h2>
              <div className="space-y-4">
                {destinationData.itinerary?.map((day: any, i: number) => (
                  <div key={i} className="p-5 rounded-xl bg-card border border-border">
                    <h3 className="font-semibold text-primary mb-2">Day {day.day}</h3>
                    <ul className="space-y-2">
                      {day.activities?.map((act: string, j: number) => (
                        <li key={j} className="text-sm text-foreground/80 flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          {act}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Hotels */}
            <section>
              <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
                <Hotel className="h-6 w-6 text-primary" /> Recommended Hotels
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {destinationData.hotels?.map((hotel: any, i: number) => (
                  <div key={i} className="rounded-xl bg-card border border-border overflow-hidden group">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={getHotelImageUrl(hotel.name, state || "", i)}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = UNSPLASH_FALLBACK; }}
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{hotel.name}</h3>
                          <p className="text-muted-foreground text-sm">{hotel.type}</p>
                        </div>
                        {hotel.rating && (
                          <div className="flex items-center gap-1 text-sm text-accent">
                            <Star className="h-4 w-4 fill-current" /> {hotel.rating}
                          </div>
                        )}
                      </div>
                      <p className="text-primary font-semibold text-sm mt-2">{hotel.price_range}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 w-full"
                        onClick={() => setShowBooking(`hotel-${i}`)}
                      >
                        <Ticket className="h-4 w-4 mr-1" /> Book Now
                      </Button>
                      {showBooking === `hotel-${i}` && (
                        <div className="mt-3 p-3 rounded-lg bg-muted space-y-2">
                          <Input placeholder="Your full name" value={bookingName} onChange={(e) => setBookingName(e.target.value)} />
                          <Input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
                          <Button size="sm" className="w-full" disabled={bookingLoading} onClick={() => handleBooking(`Hotel: ${hotel.name}`, hotel.name, "hotel")}>
                            {bookingLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                            Confirm Booking
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Transport */}
            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Transport Options</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Plane, label: "Flights", data: destinationData.transport?.flights },
                  { icon: Train, label: "Trains", data: destinationData.transport?.trains },
                  { icon: Bus, label: "Buses", data: destinationData.transport?.buses },
                  { icon: Car, label: "Car Rental", data: destinationData.transport?.cars },
                ].map((t) => (
                  <div key={t.label} className="p-5 rounded-xl bg-card border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <t.icon className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{t.label}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{t.data || "Available"}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setShowBooking(`transport-${t.label}`)}
                    >
                      <Ticket className="h-4 w-4 mr-1" /> Book {t.label}
                    </Button>
                    {showBooking === `transport-${t.label}` && (
                      <div className="mt-3 p-3 rounded-lg bg-muted space-y-2">
                        <Input placeholder="Passenger name" value={bookingName} onChange={(e) => setBookingName(e.target.value)} />
                        <Input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
                        <Button size="sm" className="w-full" disabled={bookingLoading} onClick={() => handleBooking(t.label, `${t.label} to ${state}`, "transport")}>
                          {bookingLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                          Confirm Booking
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-20">No data available.</p>
        )}
      </div>
    </div>
  );
};

export default Explore;
