import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, LogOut, Compass, Calendar, History, Ticket, Shield } from "lucide-react";

const allStates = [
  { name: "Andhra Pradesh", image: "https://images.unsplash.com/photo-1590766740616-db2e4f07b58b?w=400&h=300&fit=crop&q=80" },
  { name: "Arunachal Pradesh", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop&q=80" },
  { name: "Assam", image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=400&h=300&fit=crop&q=80" },
  { name: "Bihar", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=300&fit=crop&q=80" },
  { name: "Chhattisgarh", image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop&q=80" },
  { name: "Goa", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop&q=80" },
  { name: "Gujarat", image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=400&h=300&fit=crop&q=80" },
  { name: "Haryana", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop&q=80" },
  { name: "Himachal Pradesh", image: "https://images.unsplash.com/photo-1472120435266-95a3f747eb08?w=400&h=300&fit=crop&q=80" },
  { name: "Jharkhand", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop&q=80" },
  { name: "Karnataka", image: "https://images.unsplash.com/photo-1600100397608-e1f06cf8c571?w=400&h=300&fit=crop&q=80" },
  { name: "Kerala", image: "https://images.unsplash.com/photo-1625807171007-573beb5ed21e?w=400&h=300&fit=crop&q=80" },
  { name: "Madhya Pradesh", image: "https://images.unsplash.com/photo-1585135497273-1a86d9471c9f?w=400&h=300&fit=crop&q=80" },
  { name: "Maharashtra", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop&q=80" },
  { name: "Manipur", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&q=80" },
  { name: "Meghalaya", image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=400&h=300&fit=crop&q=80" },
  { name: "Mizoram", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop&q=80" },
  { name: "Nagaland", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&q=80" },
  { name: "Odisha", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop&q=80" },
  { name: "Punjab", image: "https://images.unsplash.com/photo-1609947017136-9daf32a15c8d?w=400&h=300&fit=crop&q=80" },
  { name: "Rajasthan", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=300&fit=crop&q=80" },
  { name: "Sikkim", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80" },
  { name: "Tamil Nadu", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop&q=80" },
  { name: "Telangana", image: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=400&h=300&fit=crop&q=80" },
  { name: "Tripura", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&q=80" },
  { name: "Uttar Pradesh", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop&q=80" },
  { name: "Uttarakhand", image: "https://images.unsplash.com/photo-1623682242096-1ed1e4963a11?w=400&h=300&fit=crop&q=80" },
  { name: "West Bengal", image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=400&h=300&fit=crop&q=80" },
  // Union Territories
  { name: "Jammu & Kashmir", image: "https://images.unsplash.com/photo-1597074866923-dc0589150458?w=400&h=300&fit=crop&q=80" },
  { name: "Ladakh", image: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=400&h=300&fit=crop&q=80" },
  { name: "Delhi", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop&q=80" },
  { name: "Puducherry", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop&q=80" },
  { name: "Chandigarh", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&h=300&fit=crop&q=80" },
  { name: "Andaman & Nicobar", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop&q=80" },
  { name: "Lakshadweep", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop&q=80" },
  { name: "Dadra & Nagar Haveli", image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b3?w=400&h=300&fit=crop&q=80" },
];

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStates = allStates.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="font-display text-lg font-bold text-primary">YatraPlanner</span>
        </div>

        <nav className="space-y-1 flex-1">
          {[
            { icon: Compass, label: "Explore", href: "/dashboard", active: true },
            { icon: Calendar, label: "My Trips", href: "/dashboard/trips" },
            { icon: Ticket, label: "My Bookings", href: "/dashboard/bookings" },
            { icon: History, label: "History", href: "/dashboard/history" },
            { icon: Shield, label: "Admin Panel", href: "/admin" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                item.active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <Button variant="ghost" className="justify-start text-muted-foreground" onClick={signOut}>
          <LogOut className="h-5 w-5 mr-2" /> Sign Out
        </Button>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 md:p-8">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold text-primary">YatraPlanner</span>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            Welcome, {user?.user_metadata?.full_name || "Traveler"}! 👋
          </h1>
          <p className="text-muted-foreground">Where would you like to explore in India?</p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search any Indian state or union territory..."
            className="pl-12 py-6 text-base rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* States Grid */}
        <h2 className="font-display text-xl font-semibold mb-4">
          All States & Union Territories ({filteredStates.length})
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredStates.map((state) => (
            <Link
              key={state.name}
              to={`/explore/${encodeURIComponent(state.name)}`}
              className="rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 group overflow-hidden"
            >
              <div className="h-32 overflow-hidden">
                <img
                  src={state.image}
                  alt={state.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{state.name}</h3>
                <p className="text-muted-foreground text-xs mt-1">Explore destinations →</p>
              </div>
            </Link>
          ))}
        </div>

        {filteredStates.length === 0 && (
          <p className="text-muted-foreground text-center py-12">No states found matching "{searchQuery}"</p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
