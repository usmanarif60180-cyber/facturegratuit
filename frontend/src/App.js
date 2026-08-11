import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import Landing from "./pages/Landing";
import Blog from "./pages/Blog";
import Help from "./pages/Help";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import LegalPage from "./pages/LegalPage";
import { Toaster } from "./components/ui/toaster";

const legalContent = {
  privacy: {
    title: "Privacy Policy / Politique de confidentialité",
    kicker: "Privacy",
    sections: [
      { heading: "Data entered in invoices and quotes", body: "Information such as customer name, address, SIRET/SIREN, vehicle VIN, registration plate, product lines, prices and notes is used to generate invoices, quotes and PDFs. The application is designed to process document data in the browser and, when the user is logged in, to save workspace data to the user's own account storage.\n\nWe do not sell customer data, invoice data, SIRET numbers, vehicle numbers or business documents." },
      { heading: "Account and authentication", body: "Authentication is provided through Firebase Authentication. Login providers may include email/password, Google, Apple or phone OTP depending on the enabled settings." },
      { heading: "Your rights", body: "You may request access, correction or deletion of your account data by emailing contact@facturergratuit.com." },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    kicker: "Cookies",
    sections: [
      { heading: "Essential cookies", body: "Essential cookies and local storage may be used to keep the app working, remember language, theme, consent choices and account session state." },
      { heading: "Analytics cookies", body: "Analytics tools help understand traffic, pages visited, browser performance and errors." },
      { heading: "Advertising cookies", body: "Advertising partners such as Google AdSense or Adsterra may use cookies, scripts or similar identifiers to show ads, measure ad performance and prevent fraud." },
    ],
  },
  terms: {
    title: "Terms of Service / Conditions d'utilisation",
    kicker: "Terms",
    sections: [
      { heading: "Service purpose", body: "ProFacture AI helps create invoices, quotes, PDFs, client records, product libraries, dashboards and business documents. It is a productivity tool, not a certified legal, tax or accounting adviser." },
      { heading: "User responsibility", body: "Users are responsible for checking invoice numbers, tax rates, VAT/TVA, company details, client details, payment terms and country-specific legal requirements before sending documents." },
      { heading: "Prohibited use", body: "Users must not use the service for fraud, spam, illegal invoices, misleading business identities, malware, unauthorized access or abuse of advertising systems." },
    ],
  },
  legal: {
    title: "Legal Notice / Mentions légales",
    kicker: "Mentions légales",
    sections: [
      { heading: "Éditeur du site", body: "Nom du site: Facturer Gratuit / ProFacture AI\nContact: contact@facturergratuit.com\nDomaine: facturergratuit.com\nActivité: Générateur de factures, devis, PDF et outils business" },
      { heading: "Hébergement", body: "The site is published through GitHub Pages / GitHub, Inc. and may use Firebase / Google Cloud services for authentication, analytics or app data." },
      { heading: "Propriété intellectuelle", body: "Texts, design, branding, interface and source code are protected by applicable intellectual property rules." },
    ],
  },
  security: {
    title: "Security and account protection",
    kicker: "Security",
    sections: [
      { heading: "Authentication", body: "User accounts are protected with Firebase Authentication. Users should keep passwords private, use trusted devices and sign out on shared computers." },
      { heading: "Private dashboard data", body: "Dashboard data such as clients, products, invoices, projects and company profile is intended to be scoped to the logged-in user's workspace." },
      { heading: "Reporting security issues", body: "If you find a vulnerability or suspicious behavior, please email contact@facturergratuit.com." },
    ],
  },
  checklist: {
    title: "Invoice Compliance Checklist",
    kicker: "Checklist",
    sections: [
      { heading: "Before sending", body: "✓ Invoice number is unique and sequential\n✓ Seller name, address, SIRET/VAT number are present\n✓ Client name, billing address (and chantier if applicable)\n✓ Line items with quantity, unit price and tax\n✓ Subtotal, tax and total shown clearly\n✓ Due date and payment terms\n✓ IBAN/RIB or accepted payment methods\n✓ PDF is clean, readable and A4-sized" },
    ],
  },
};

function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark"); else root.classList.remove("dark");
  }, [dark]);

  return (
    <div className="App min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <BrowserRouter>
        <Navbar dark={dark} setDark={setDark} />
        <main className="pb-24">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/help" element={<Help />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<LegalPage {...legalContent.privacy} />} />
            <Route path="/cookies" element={<LegalPage {...legalContent.cookies} />} />
            <Route path="/terms" element={<LegalPage {...legalContent.terms} />} />
            <Route path="/legal" element={<LegalPage {...legalContent.legal} />} />
            <Route path="/security" element={<LegalPage {...legalContent.security} />} />
            <Route path="/checklist" element={<LegalPage {...legalContent.checklist} />} />
          </Routes>
        </main>
        <Footer />
        <BottomNav />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
