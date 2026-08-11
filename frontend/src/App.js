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
import InvoiceEditor from "./pages/InvoiceEditor";
import InvoicesList from "./pages/InvoicesList";
import Clients from "./pages/Clients";
import SettingsPage from "./pages/SettingsPage";
import CompaniesPage from "./pages/CompaniesPage";
import ChantiersPage from "./pages/ChantiersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import TemplateGallery from "./pages/TemplateGallery";
import { Toaster } from "./components/ui/toaster";

const legalContent = {
  privacy: { title: "Politique de confidentialité", kicker: "Privacy", sections: [
    { heading: "Données", body: "Les informations saisies sur les factures et devis sont utilisées pour générer les documents PDF et sont stockées dans votre espace de travail." },
    { heading: "Vos droits", body: "Vous pouvez demander l'accès, la correction ou la suppression de vos données à contact@facturergratuit.com." },
  ]},
  cookies: { title: "Cookies", kicker: "Cookies", sections: [{ heading: "Cookies essentiels", body: "Utilisés pour garder l'application fonctionnelle, langue, thème et session." }]},
  terms: { title: "Conditions d'utilisation", kicker: "Terms", sections: [{ heading: "Objet", body: "ProFacture AI vous aide à créer des factures, devis, PDF et documents business. C'est un outil de productivité, pas un conseiller fiscal ou juridique." }]},
  legal: { title: "Mentions légales", kicker: "Mentions légales", sections: [{ heading: "Éditeur", body: "Facturer Gratuit / ProFacture AI — contact@facturergratuit.com" }]},
  security: { title: "Sécurité", kicker: "Security", sections: [{ heading: "Authentification", body: "Vos données sont associées à votre workspace. Ne partagez pas votre identifiant workspace." }]},
  checklist: { title: "Checklist facture", kicker: "Checklist", sections: [{ heading: "Avant envoi", body: "✓ N° de facture unique\n✓ Coordonnées vendeur/client\n✓ Lignes avec quantité, prix, TVA\n✓ Sous-total, TVA, total\n✓ Date d'échéance\n✓ IBAN/RIB\n✓ PDF A4 propre" }]},
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
        <div className="print:hidden"><Navbar dark={dark} setDark={setDark} /></div>
        <main className="pb-24 print:pb-0">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/help" element={<Help />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/invoices" element={<InvoicesList />} />
            <Route path="/invoices/new" element={<InvoiceEditor />} />
            <Route path="/invoices/:id" element={<InvoiceEditor />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/chantiers" element={<ChantiersPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
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
        <div className="print:hidden"><Footer /></div>
        <div className="print:hidden"><BottomNav /></div>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
