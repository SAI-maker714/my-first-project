import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, ArrowLeft, Send, CheckCircle } from "lucide-react";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-8 w-8" />
            <span className="font-display text-2xl font-bold">YatraPlanner</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold">Contact Us</h1>
          <p className="text-primary-foreground/70 mt-2 max-w-lg">Have questions about planning your Indian adventure? We're here to help!</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-card border border-border">
              <Mail className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-display font-semibold mb-1">Email</h3>
              <p className="text-muted-foreground text-sm">support@yatraplanner.com</p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <Phone className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-display font-semibold mb-1">Phone</h3>
              <p className="text-muted-foreground text-sm">+91 98765 43210</p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <MapPin className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-display font-semibold mb-1">Office</h3>
              <p className="text-muted-foreground text-sm">BCA Department, University Campus, India</p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            {submitted ? (
              <div className="text-center py-20">
                <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="font-display text-2xl font-bold mb-2">Thank You!</h2>
                <p className="text-muted-foreground mb-6">Your message has been received. We'll get back to you soon.</p>
                <Link to="/"><Button>Back to Home</Button></Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-card border border-border space-y-5">
                <h2 className="font-display text-xl font-bold mb-2">Send us a message</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Name</label>
                    <Input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email</label>
                    <Input required type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Subject</label>
                  <Input required placeholder="How can we help?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Message</label>
                  <Textarea required rows={5} placeholder="Tell us more..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>
                <Button type="submit" size="lg">
                  <Send className="h-4 w-4 mr-2" /> Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
