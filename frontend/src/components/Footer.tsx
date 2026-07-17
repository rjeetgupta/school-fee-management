import { Link } from "react-router";
import { GraduationCap, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-white">
            <GraduationCap size={22} />
            <span className="font-display text-lg font-semibold">Greenwood Public School</span>
          </div>
          <p className="mt-3 text-sm text-white/60">
            Nurturing curious minds and confident learners from Class 1 through Class 5.
          </p>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-wide text-white/50">Quick Links</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-wide text-white/50">Portals</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li><Link to="/student-login" className="hover:text-white">Student Portal</Link></li>
            <li><Link to="/login" className="hover:text-white">Administrator Portal</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-wide text-white/50">Contact</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-white/70">
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> Ratu Road, Ranchi, Jharkhand</li>
            <li className="flex items-center gap-2"><Phone size={16} /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail size={16} /> info@greenwoodschool.edu</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Greenwood Public School · Fee Management System
      </div>
    </footer>
  );
}
