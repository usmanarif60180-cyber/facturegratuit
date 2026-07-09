// ═══════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════
const FONTS = [
  { name:'Inter', cat:'Sans-serif' },{ name:'Roboto', cat:'Sans-serif' },{ name:'Open Sans', cat:'Sans-serif' },
  { name:'Poppins', cat:'Sans-serif' },{ name:'Montserrat', cat:'Sans-serif' },{ name:'Nunito', cat:'Sans-serif' },
  { name:'Lato', cat:'Sans-serif' },{ name:'Raleway', cat:'Sans-serif' },{ name:'Outfit', cat:'Sans-serif' },
  { name:'DM Sans', cat:'Sans-serif' },{ name:'Plus Jakarta Sans', cat:'Sans-serif' },{ name:'Figtree', cat:'Sans-serif' },
  { name:'Manrope', cat:'Sans-serif' },{ name:'Sora', cat:'Sans-serif' },{ name:'Work Sans', cat:'Sans-serif' },
  { name:'Mulish', cat:'Sans-serif' },{ name:'Karla', cat:'Sans-serif' },{ name:'Barlow', cat:'Sans-serif' },
  { name:'Jost', cat:'Sans-serif' },
  { name:'Oswald', cat:'Display' },{ name:'Bebas Neue', cat:'Display' },{ name:'Anton', cat:'Display' },
  { name:'Teko', cat:'Display' },{ name:'Exo 2', cat:'Display' },{ name:'Russo One', cat:'Display' },
  { name:'Righteous', cat:'Display' },{ name:'Audiowide', cat:'Display' },{ name:'Fjalla One', cat:'Display' },
  { name:'Playfair Display', cat:'Serif' },{ name:'Merriweather', cat:'Serif' },{ name:'Lora', cat:'Serif' },
  { name:'PT Serif', cat:'Serif' },{ name:'EB Garamond', cat:'Serif' },{ name:'Cormorant Garamond', cat:'Serif' },
  { name:'Libre Baskerville', cat:'Serif' },{ name:'Crimson Text', cat:'Serif' },{ name:'Spectral', cat:'Serif' },
  { name:'Courier Prime', cat:'Mono' },{ name:'Source Code Pro', cat:'Mono' },{ name:'Space Mono', cat:'Mono' },
  { name:'IBM Plex Mono', cat:'Mono' },
  { name:'Ubuntu', cat:'Humaniste' },{ name:'Noto Sans', cat:'Humaniste' },{ name:'PT Sans', cat:'Humaniste' },
  { name:'Oxygen', cat:'Humaniste' },
];

const THEMES = [
  { name:'Indigo Pro',     p:'#4f46e5', a:'#818cf8', preview:['#4f46e5','#818cf8','#e0e7ff'] },
  { name:'Ocean Blue',     p:'#0369a1', a:'#38bdf8', preview:['#0369a1','#38bdf8','#e0f2fe'] },
  { name:'Emerald',        p:'#065f46', a:'#34d399', preview:['#065f46','#34d399','#d1fae5'] },
  { name:'Slate Dark',     p:'#1e293b', a:'#64748b', preview:['#1e293b','#64748b','#f1f5f9'] },
  { name:'Rose Business',  p:'#9f1239', a:'#fb7185', preview:['#9f1239','#fb7185','#ffe4e6'] },
  { name:'Amber Pro',      p:'#92400e', a:'#fbbf24', preview:['#92400e','#fbbf24','#fef3c7'] },
  { name:'Violet Elite',   p:'#5b21b6', a:'#a78bfa', preview:['#5b21b6','#a78bfa','#ede9fe'] },
  { name:'Teal Modern',    p:'#0f766e', a:'#2dd4bf', preview:['#0f766e','#2dd4bf','#ccfbf1'] },
  { name:'Crimson',        p:'#7f1d1d', a:'#f87171', preview:['#7f1d1d','#f87171','#fee2e2'] },
  { name:'Night Tech',     p:'#1e3a5f', a:'#60a5fa', preview:['#1e3a5f','#60a5fa','#dbeafe'] },
  { name:'Gold Premium',   p:'#78350f', a:'#fbbf24', preview:['#78350f','#fbbf24','#fef3c7'] },
  { name:'Forest Green',   p:'#14532d', a:'#4ade80', preview:['#14532d','#4ade80','#dcfce7'] },
  { name:'Royal Blue',     p:'#1d4ed8', a:'#93c5fd', preview:['#1d4ed8','#93c5fd','#eff6ff'] },
  { name:'Sky Clean',      p:'#0284c7', a:'#7dd3fc', preview:['#0284c7','#7dd3fc','#e0f2fe'] },
  { name:'Cyan Studio',    p:'#0e7490', a:'#67e8f9', preview:['#0e7490','#67e8f9','#cffafe'] },
  { name:'Mint Pro',       p:'#047857', a:'#6ee7b7', preview:['#047857','#6ee7b7','#ecfdf5'] },
  { name:'Lime Fresh',     p:'#4d7c0f', a:'#bef264', preview:['#4d7c0f','#bef264','#f7fee7'] },
  { name:'Olive Classic',  p:'#3f6212', a:'#a3e635', preview:['#3f6212','#a3e635','#ecfccb'] },
  { name:'Orange Energy',  p:'#c2410c', a:'#fb923c', preview:['#c2410c','#fb923c','#ffedd5'] },
  { name:'Copper',         p:'#9a3412', a:'#fdba74', preview:['#9a3412','#fdba74','#fff7ed'] },
  { name:'Ruby',           p:'#be123c', a:'#fda4af', preview:['#be123c','#fda4af','#fff1f2'] },
  { name:'Pink Studio',    p:'#be185d', a:'#f9a8d4', preview:['#be185d','#f9a8d4','#fdf2f8'] },
  { name:'Fuchsia Pop',    p:'#a21caf', a:'#f0abfc', preview:['#a21caf','#f0abfc','#fae8ff'] },
  { name:'Purple Pro',     p:'#6d28d9', a:'#c4b5fd', preview:['#6d28d9','#c4b5fd','#f5f3ff'] },
  { name:'Lavender Soft',  p:'#7c3aed', a:'#ddd6fe', preview:['#7c3aed','#ddd6fe','#faf5ff'] },
  { name:'Graphite',       p:'#111827', a:'#9ca3af', preview:['#111827','#9ca3af','#f9fafb'] },
  { name:'Zinc Minimal',   p:'#27272a', a:'#a1a1aa', preview:['#27272a','#a1a1aa','#fafafa'] },
  { name:'Stone Paper',    p:'#44403c', a:'#a8a29e', preview:['#44403c','#a8a29e','#fafaf9'] },
  { name:'Navy Gold',      p:'#172554', a:'#facc15', preview:['#172554','#facc15','#fefce8'] },
  { name:'Black Diamond',  p:'#020617', a:'#38bdf8', preview:['#020617','#38bdf8','#f8fafc'] },
];

const PAGE_COLORS = [
  { name:'Blanc pur',       bg:'#ffffff', text:'#0f172a' },
  { name:'Crème douce',     bg:'#fffef5', text:'#1c1a0e' },
  { name:'Gris perle',      bg:'#f8f9fa', text:'#1a1a2e' },
  { name:'Bleu glacier',    bg:'#f0f7ff', text:'#0c2340' },
  { name:'Menthe fraîche',  bg:'#f0fdf7', text:'#052e16' },
  { name:'Lavande',         bg:'#f5f3ff', text:'#1e0a3c' },
  { name:'Saumon doux',     bg:'#fff8f6', text:'#2d0a00' },
  { name:'Miel ambré',      bg:'#fffbeb', text:'#1c0f00' },
  { name:'Gris ardoise',    bg:'#0f172a', text:'#f1f5f9' },
  { name:'Bleu nuit',       bg:'#0a0e1a', text:'#e2e8f0' },
  { name:'Forêt sombre',    bg:'#052e16', text:'#f0fdf4' },
  { name:'Bordeaux foncé',  bg:'#1a0a0a', text:'#fef2f2' },
];

const FONT_COLORS = [
  { name:'Noir profond',    val:'#0f172a' },{ name:'Gris graphite',  val:'#1e293b' },
  { name:'Gris ardoise',    val:'#374151' },{ name:'Indigo foncé',   val:'#1e1b4b' },
  { name:'Bleu marine',     val:'#0c2340' },{ name:'Bleu profond',   val:'#1d4ed8' },
  { name:'Bleu ciel',       val:'#0369a1' },{ name:'Cyan vif',       val:'#0891b2' },
  { name:'Vert foncé',      val:'#064e3b' },{ name:'Émeraude',       val:'#065f46' },
  { name:'Vert sauge',      val:'#3d6b4f' },{ name:'Bordeaux',       val:'#7f1d1d' },
  { name:'Rose foncé',      val:'#9d174d' },{ name:'Violet foncé',   val:'#4c1d95' },
  { name:'Violet moyen',    val:'#6d28d9' },{ name:'Prune',          val:'#701a75' },
  { name:'Brun chaud',      val:'#78350f' },{ name:'Ocre',           val:'#92400e' },
  { name:'Olive',           val:'#3f3f00' },{ name:'Blanc cassé',    val:'#f8fafc' },
];

const LAYOUTS = [
  { id:'modern',  label:'Modern',   icon:'▦', desc:'Banner dégradé' },
  { id:'classic', label:'Classic',  icon:'◻', desc:'Deux colonnes' },
  { id:'minimal', label:'Minimal',  icon:'○', desc:'Ultra épuré' },
  { id:'bold',    label:'Bold',     icon:'◈', desc:'Typo XXL' },
  { id:'sidebar', label:'Sidebar',  icon:'▌', desc:'Bande latérale' },
  { id:'split',   label:'Split',    icon:'⊞', desc:'En-tête divisé' },
  { id:'card',    label:'Card',     icon:'⬜', desc:'Blocs encadrés' },
  { id:'elegant', label:'Élégant',  icon:'✦', desc:'Lignes fines' },
];

const QUICK_TEMPLATES = [
  { name:'Classic', desc:'Deux colonnes lisibles', layout:1, theme:0, p:'#4f46e5', a:'#818cf8' },
  { name:'Modern', desc:'Header premium', layout:0, theme:1, p:'#0369a1', a:'#38bdf8' },
  { name:'Minimal', desc:'Blanc, simple, net', layout:2, theme:3, p:'#1e293b', a:'#64748b' },
  { name:'Stripe', desc:'Bande latérale pro', layout:4, theme:13, p:'#0284c7', a:'#7dd3fc' },
  { name:'Pro', desc:'Business solide', layout:7, theme:15, p:'#047857', a:'#6ee7b7' },
  { name:'Auto', desc:'Garage et vente', layout:6, theme:9, p:'#1e3a5f', a:'#60a5fa' },
  { name:'Marketplace', desc:'Online seller', layout:5, theme:14, p:'#0e7490', a:'#67e8f9' },
  { name:'Clean', desc:'PDF clair', layout:2, theme:26, p:'#27272a', a:'#a1a1aa' },
];

const ONLINE_STYLES = [
  { name:'Marketplace Clean', desc:'Amazon, eBay, Etsy', layout:1, theme:13, p:'#0284c7', a:'#7dd3fc' },
  { name:'E-commerce Pro', desc:'Order, SKU, totals', layout:0, theme:1, p:'#0369a1', a:'#38bdf8' },
  { name:'Seller Minimal', desc:'Small seller clean', layout:2, theme:26, p:'#27272a', a:'#a1a1aa' },
  { name:'Platform Detail', desc:'Marketplace block', layout:6, theme:14, p:'#0e7490', a:'#67e8f9' },
  { name:'Digital Service', desc:'Fiverr, Upwork', layout:7, theme:0, p:'#4f46e5', a:'#818cf8' },
  { name:'Product Shipment', desc:'Delivery reference', layout:5, theme:19, p:'#9a3412', a:'#fdba74' },
  { name:'Storefront Modern', desc:'Shopify style', layout:0, theme:15, p:'#047857', a:'#6ee7b7' },
  { name:'Creator Invoice', desc:'Digital products', layout:3, theme:21, p:'#be185d', a:'#f9a8d4' },
  { name:'Wholesale Online', desc:'Bulk products', layout:4, theme:3, p:'#1e293b', a:'#64748b' },
  { name:'Compact Receipt', desc:'Short order PDF', layout:2, theme:25, p:'#111827', a:'#9ca3af' },
  { name:'Premium Seller', desc:'Branded seller', layout:7, theme:28, p:'#172554', a:'#facc15' },
  { name:'International Seller', desc:'Currency friendly', layout:1, theme:2, p:'#065f46', a:'#34d399' },
  { name:'Subscription Service', desc:'Recurring service', layout:6, theme:7, p:'#0f766e', a:'#2dd4bf' },
  { name:'Multi-Item Marketplace', desc:'Many rows clear', layout:5, theme:29, p:'#020617', a:'#38bdf8' },
  { name:'No-TVA Export', desc:'0% tax/export', layout:2, theme:11, p:'#14532d', a:'#4ade80' },
];

const COUNTRY_PROFILES = {
  FR: {
    name:'France', lang:'fr', locale:'fr-FR', currency:'EUR', symbol:'€', taxName:'TVA', taxRate:20,
    docPrefix:{ facture:'FAC', devis:'DEV' }, sector:{ batiment:'BÂTIMENT', automobile:'AUTOMOBILE', online:'FREELANCE / MARKETPLACE' },
    businessId:'SIRET/SIREN', clientId:'SIREN', dateOrder:'dmy',
    exempt:'TVA non applicable — art. 293 B du CGI'
  },
  DE: {
    name:'Germany', lang:'de', locale:'de-DE', currency:'EUR', symbol:'€', taxName:'USt.', taxRate:19,
    docPrefix:{ facture:'RE', devis:'ANG' }, sector:{ batiment:'BAU', automobile:'AUTOMOBIL', online:'FREELANCE / MARKETPLACE' },
    businessId:'USt-IdNr. / Steuernummer', clientId:'USt-IdNr.', dateOrder:'dmy',
    exempt:'Umsatzsteuerbefreit nach § 19 UStG'
  },
  ES: {
    name:'Spain', lang:'es', locale:'es-ES', currency:'EUR', symbol:'€', taxName:'IVA', taxRate:21,
    docPrefix:{ facture:'FAC', devis:'PRE' }, sector:{ batiment:'CONSTRUCCIÓN', automobile:'AUTOMÓVIL', online:'FREELANCE / MARKETPLACE' },
    businessId:'NIF / CIF', clientId:'NIF / CIF', dateOrder:'dmy',
    exempt:'IVA no aplicable / exento según normativa vigente'
  },
  IT: {
    name:'Italy', lang:'it', locale:'it-IT', currency:'EUR', symbol:'€', taxName:'IVA', taxRate:22,
    docPrefix:{ facture:'FAT', devis:'PREV' }, sector:{ batiment:'EDILIZIA', automobile:'AUTOMOBILE', online:'FREELANCE / MARKETPLACE' },
    businessId:'P. IVA / Codice fiscale', clientId:'P. IVA / C.F.', dateOrder:'dmy',
    exempt:'IVA non applicabile / regime agevolato se previsto'
  },
  UK: {
    name:'United Kingdom', lang:'en', locale:'en-GB', currency:'GBP', symbol:'£', taxName:'VAT', taxRate:20,
    docPrefix:{ facture:'INV', devis:'QUO' }, sector:{ batiment:'BUILDING', automobile:'AUTOMOTIVE', online:'FREELANCE / MARKETPLACE' },
    businessId:'Company No. / VAT No.', clientId:'Company No. / VAT No.', dateOrder:'dmy',
    exempt:'VAT not applicable'
  },
  US: {
    name:'United States', lang:'en', locale:'en-US', currency:'USD', symbol:'$', taxName:'Sales tax', taxRate:0,
    docPrefix:{ facture:'INV', devis:'EST' }, sector:{ batiment:'CONSTRUCTION', automobile:'AUTOMOTIVE', online:'FREELANCE / MARKETPLACE' },
    businessId:'EIN / Tax ID', clientId:'EIN / Tax ID', dateOrder:'mdy',
    exempt:'Sales tax not applied'
  },
};

const I18N = {
  fr: {
    invoice:'FACTURE', quote:'DEVIS', from:'DE', billedTo:'FACTURÉ À', quoteFor:'DEVIS POUR', object:'Objet',
    status:'Statut', address:'Adresse', email:'Email', phone:'Tél.', vehicle:'Véhicule - achat / vente',
    type:'Type', vin:'VIN / N° châssis', plate:'Plaque', make:'Marque', model:'Modèle', year:'Année',
    mileage:'Kilométrage', firstReg:'Mise en circulation', color:'Couleur', description:'Désignation',
    qty:'Qté', unit:'Unité', unitPrice:'P.U. HT', lineTotal:'Total HT', subtotal:'Sous-total HT',
    total:'Total TTC', issued:'Émis le', due:'Échéance', payment:'Coordonnées bancaires',
    signature:'Signature et cachet', page:'Page', paymentQr:'QR Paiement', copied:'Total copié',
    emailBody:'Bonjour,\n\nVeuillez trouver ci-joint le document {doc}.\nTotal TTC : {total}\n\nCordialement'
  },
  de: {
    invoice:'RECHNUNG', quote:'ANGEBOT', from:'VON', billedTo:'RECHNUNG AN', quoteFor:'ANGEBOT FÜR', object:'Betreff',
    status:'Status', address:'Adresse', email:'E-Mail', phone:'Tel.', vehicle:'Fahrzeug - Kauf / Verkauf',
    type:'Typ', vin:'FIN / Fahrgestellnummer', plate:'Kennzeichen', make:'Marke', model:'Modell', year:'Jahr',
    mileage:'Kilometerstand', firstReg:'Erstzulassung', color:'Farbe', description:'Beschreibung',
    qty:'Menge', unit:'Einheit', unitPrice:'Einzelpreis netto', lineTotal:'Gesamt netto', subtotal:'Zwischensumme netto',
    total:'Gesamt brutto', issued:'Ausgestellt am', due:'Gültig bis', payment:'Bankverbindung',
    signature:'Unterschrift und Stempel', page:'Seite', paymentQr:'QR Zahlung', copied:'Gesamt kopiert',
    emailBody:'Guten Tag,\n\nanbei finden Sie das Dokument {doc}.\nGesamtbetrag: {total}\n\nMit freundlichen Grüßen'
  },
  es: {
    invoice:'FACTURA', quote:'PRESUPUESTO', from:'DE', billedTo:'FACTURADO A', quoteFor:'PRESUPUESTO PARA', object:'Objeto',
    status:'Estado', address:'Dirección', email:'Email', phone:'Tel.', vehicle:'Vehículo - compra / venta',
    type:'Tipo', vin:'VIN / N° bastidor', plate:'Matrícula', make:'Marca', model:'Modelo', year:'Año',
    mileage:'Kilometraje', firstReg:'Primera matriculación', color:'Color', description:'Descripción',
    qty:'Cant.', unit:'Unidad', unitPrice:'Precio unit. neto', lineTotal:'Total neto', subtotal:'Subtotal neto',
    total:'Total', issued:'Emitido el', due:'Validez', payment:'Datos bancarios',
    signature:'Firma y sello', page:'Página', paymentQr:'QR Pago', copied:'Total copiado',
    emailBody:'Hola,\n\nAdjunto encontrará el documento {doc}.\nTotal: {total}\n\nSaludos'
  },
  it: {
    invoice:'FATTURA', quote:'PREVENTIVO', from:'DA', billedTo:'FATTURATO A', quoteFor:'PREVENTIVO PER', object:'Oggetto',
    status:'Stato', address:'Indirizzo', email:'Email', phone:'Tel.', vehicle:'Veicolo - acquisto / vendita',
    type:'Tipo', vin:'VIN / N° telaio', plate:'Targa', make:'Marca', model:'Modello', year:'Anno',
    mileage:'Chilometraggio', firstReg:'Prima immatricolazione', color:'Colore', description:'Descrizione',
    qty:'Qtà', unit:'Unità', unitPrice:'Prezzo unit. netto', lineTotal:'Totale netto', subtotal:'Subtotale netto',
    total:'Totale', issued:'Emessa il', due:'Scadenza', payment:'Coordinate bancarie',
    signature:'Firma e timbro', page:'Pagina', paymentQr:'QR Pagamento', copied:'Totale copiato',
    emailBody:'Buongiorno,\n\nIn allegato trova il documento {doc}.\nTotale: {total}\n\nCordiali saluti'
  },
  en: {
    invoice:'INVOICE', quote:'QUOTE', from:'FROM', billedTo:'BILL TO', quoteFor:'QUOTE FOR', object:'Subject',
    status:'Status', address:'Address', email:'Email', phone:'Phone', vehicle:'Vehicle - purchase / sale',
    type:'Type', vin:'VIN / chassis no.', plate:'Plate / registration', make:'Make', model:'Model', year:'Year',
    mileage:'Mileage', firstReg:'First registration', color:'Color', description:'Description',
    qty:'Qty', unit:'Unit', unitPrice:'Unit price', lineTotal:'Line total', subtotal:'Subtotal',
    total:'Total', issued:'Issued on', due:'Valid until', payment:'Bank details',
    signature:'Signature and stamp', page:'Page', paymentQr:'Payment QR', copied:'Total copied',
    emailBody:'Hello,\n\nPlease find attached the document {doc}.\nTotal: {total}\n\nRegards'
  }
};

const FALLBACK_CURRENCIES = ['EUR','USD','GBP','PKR','AED','CAD','AUD','CHF','JPY','CNY','INR','SAR','MAD','TRY','BRL','MXN','SGD','HKD','NZD','ZAR'];

const COUNTRY_FORMATS = {
  FR: { layout:'classic', margins:[5,15,5,15], note:'Format France : SIRET/SIREN, TVA, adresse complète, échéance devis, mentions TVA.' },
  DE: { layout:'elegant', margins:[8,14,8,14], note:'Format Germany : Rechnungsnummer, Steuernummer/USt-IdNr., Leistungsbeschreibung, USt. details.' },
  ES: { layout:'split', margins:[8,14,8,14], note:'Format Spain : NIF/CIF, IVA, datos de emisor y cliente, base imponible y total.' },
  IT: { layout:'card', margins:[7,14,7,14], note:'Format Italy : P. IVA / Codice fiscale, IVA, dati cliente, descrizione e totale.' },
  UK: { layout:'minimal', margins:[10,16,10,16], note:'Format UK : invoice number, VAT/company details, tax point/date, VAT rate and total.' },
  US: { layout:'bold', margins:[10,16,10,16], note:'Format USA : invoice number, seller/buyer details, description, sales tax where applicable.' },
};

// ═══════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════
const S = {
  docType: 'facture',
  docSector: 'batiment',
  country: 'FR',
  lang: 'fr',
  currency: 'EUR',
  themeIdx: 0,
  fontIdx: 0,
  fontCat: 'Tous',
  fontColorIdx: 0,
  pageColorIdx: 0,
  layoutIdx: 0,
  fontSize: 12,
  boldTitle: true,
  boldLabels: false,
  boldAmounts: true,
  italic: false,
  tva: true,
  logoSrc: null,
  logoPos: 'left',
  logoSize: 80,
  watermark: '',
  stamp: 'none',
  companyStampSrc: null,
  companyStampSize: 115,
  companyStampOpacity: 90,
  pageNumbers: true,
  signature: false,
  signatureSrc: null,
  signatureSize: 135,
  qrCode: false,
  items: [],
  authMode: 'login',
  authUser: null,
  appTheme: 'dark',
  aiLastItems: [],
  aiLastObject: '',
  autoCleanup: false,
  editorMode: 'advanced',
  onlineStyleIdx: 0,
};

let itemId = 0;

// ═══════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Set today's dates
  const today = new Date();
  const fmt = d => d.toISOString().split('T')[0];
  const due = new Date(today); due.setDate(due.getDate() + 30);
  document.getElementById('f-date').value = fmt(today);
  document.getElementById('f-due').value = fmt(due);
  document.getElementById('f-number').value = getDefaultDocNumber('facture', 'batiment');
  const dueGroup = document.getElementById('due-date-group');
  if (dueGroup) dueGroup.style.display = 'none';
  const vehicleCard = document.getElementById('vehicle-card');
  if (vehicleCard) vehicleCard.style.display = 'none';

  buildLayoutGrid();
  buildTemplateGallery();
  buildOnlineStyleGallery();
  buildThemeGrid();
  buildFontCats();
  buildFontList();
  buildPageColorGrid();
  buildFontColorGrid();
  buildCurrencySelect();
  loadAppTheme();
  applyAppTheme();
  loadAuthUser();
  renderAuth();
  if (S.authUser) setTimeout(() => applyAccountProfileToEditor(true), 0);
  syncLocaleControls();
  renderDocVariant();
  renderLogoState();
  renderCompanyStampState();
  renderSignatureImageState();
  renderCookieBanner();
  initAdsenseSlots();
  applyCountryDocumentFormat();
  loadAutoCleanupPreference();
  setEditorMode(S.editorMode);
  updateProgressSteps('infos');
  setTimeout(updateAiStatus, 500);

  addRow();
  addRow();
  updatePreview();
  if (location.hash === '#editor') {
    document.body.classList.add('editor-mode');
    document.body.classList.remove('home-mode');
  } else {
    document.body.classList.add('home-mode');
    document.body.classList.remove('editor-mode');
  }
});

const LEGAL_PAGES = {
  about: {
    title: 'À propos',
    html: `
      <p><strong>FacturePro</strong> est un outil web gratuit destiné aux indépendants, artisans, auto-entrepreneurs et professionnels de l'automobile qui souhaitent créer rapidement des factures et devis PDF.</p>
      <p>L'application permet de générer des documents pour le bâtiment et l'automobile, avec TVA, IBAN/RIB, informations véhicule, logo, signature, thèmes et export PDF A4.</p>
      <p>FacturePro est un outil d'aide à la création de documents. L'utilisateur reste responsable de vérifier les informations légales, fiscales et comptables avant utilisation ou envoi.</p>
    `
  },
  legal: {
    title: 'Mentions légales',
    html: `
      <h3>Éditeur / Propriétaire du site</h3>
      <p><strong>Nom ou raison sociale :</strong> À compléter avec votre nom ou votre société</p>
      <p><strong>Adresse :</strong> À compléter avec votre adresse professionnelle</p>
      <p><strong>Email professionnel :</strong> contact@facturergratuit.com</p>
      <h3>Hébergement</h3>
      <p><strong>Hébergeur :</strong> Firebase Hosting / Google Cloud</p>
      <p><strong>Adresse :</strong> Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irlande.</p>
      <h3>Responsabilité</h3>
      <p>Le site fournit un générateur de documents. Les informations saisies, les calculs, les mentions légales, la TVA, les SIRET/SIREN, les VIN, les immatriculations et les coordonnées bancaires doivent être vérifiés par l'utilisateur avant toute utilisation officielle.</p>
      <p><strong>Important :</strong> remplacez les champs "À compléter" par vos informations réelles avant publication et demande AdSense.</p>
    `
  },
  privacy: {
    title: 'Politique de confidentialité',
    html: `
      <h3>Données saisies dans les factures et devis</h3>
      <p>Les informations que vous saisissez dans l'outil, comme nom, prénom, client, adresse, SIRET/SIREN, IBAN/RIB, VIN, plaque d'immatriculation, détails de véhicule, prix et prestations, sont utilisées pour afficher l'aperçu et générer le PDF.</p>
      <p>Ces données ne sont pas vendues à des tiers. Elles sont principalement traitées dans votre navigateur. Les brouillons peuvent être enregistrés localement dans votre navigateur via localStorage lorsque vous utilisez la fonction de sauvegarde.</p>
      <h3>Compte utilisateur Firebase</h3>
      <p>Si vous utilisez signup/login, Firebase Authentication peut traiter votre email, identifiant utilisateur et informations de connexion pour permettre l'accès au compte.</p>
      <h3>Sauvegarde compte et limite de stockage</h3>
      <p>Le compte peut sauvegarder le profil société, projets, clients, produits/services et historique. Une limite de 500 MB par utilisateur est prévue afin de garder le stockage Firebase maîtrisé.</p>
      <p>Les fichiers uploadés, comme logo, signature ou cachet, doivent être des fichiers raisonnables et utiles au document. Les anciens projets ou assets peuvent être supprimés depuis le compte pour libérer de l'espace.</p>
      <h3>Google Analytics et Google AdSense</h3>
      <p>Nous utilisons Google Analytics pour mesurer l'audience et pouvons utiliser Google AdSense pour afficher des annonces. Google et ses partenaires peuvent utiliser des cookies ou technologies similaires pour diffuser, mesurer et personnaliser les annonces selon leurs propres règles.</p>
      <h3>Vos choix</h3>
      <p>Vous pouvez accepter les cookies analytics/publicité ou choisir les cookies essentiels seulement depuis la bannière cookies. Vous pouvez aussi réinitialiser ce choix depuis la page Cookies.</p>
      <p>Depuis le compte, vous pouvez exporter une sauvegarde JSON de vos données locales ou supprimer profil société, historique, projets, clients et produits de ce navigateur.</p>
      <h3>Contact confidentialité</h3>
      <p>Pour toute demande liée à vos données, contactez : contact@facturergratuit.com</p>
    `
  },
  security: {
    title: 'Sécurité',
    html: `
      <h3>Sécurité du compte</h3>
      <p>FacturePro utilise Firebase Authentication pour la connexion email/mot de passe. Chaque utilisateur doit protéger son mot de passe et utiliser une adresse email valide pour récupérer son compte.</p>
      <div class="security-list">
        <div class="security-item"><i class="fa fa-user-lock"></i><span><strong style="color:var(--ink)">Accès privé :</strong> les données de compte doivent rester associées à l'utilisateur connecté.</span></div>
        <div class="security-item"><i class="fa fa-cloud"></i><span><strong style="color:var(--ink)">Stockage maîtrisé :</strong> une limite de 500 MB par utilisateur est prévue pour éviter les abus et garder Firebase manageable.</span></div>
        <div class="security-item"><i class="fa fa-file-shield"></i><span><strong style="color:var(--ink)">Uploads contrôlés :</strong> logo, signature et cachet doivent rester limités aux fichiers utiles, comme PNG, JPG, WebP ou SVG raisonnables.</span></div>
        <div class="security-item"><i class="fa fa-ban"></i><span><strong style="color:var(--ink)">Aucun secret public :</strong> les clés privées, tokens serveur ou clés API sensibles ne doivent jamais être placés dans le fichier index.html.</span></div>
      </div>
      <h3>Conseils utilisateur</h3>
      <p>Ne partagez pas votre mot de passe, vérifiez les informations client avant envoi, et supprimez les anciens documents si vous n'en avez plus besoin.</p>
      <h3>Signaler un problème</h3>
      <p>Pour signaler une faille, un bug de compte ou un problème de PDF, utilisez le formulaire Feedback ou contactez contact@facturergratuit.com.</p>
    `
  },
  terms: {
    title: "Conditions générales d'utilisation",
    html: `
      <h3>Utilisation du service</h3>
      <p>FacturePro est fourni gratuitement pour aider à créer des factures et devis. L'utilisateur s'engage à utiliser le service conformément aux lois applicables.</p>
      <ul>
        <li>Ne pas utiliser le site pour créer de faux documents.</li>
        <li>Vérifier les montants, taux de TVA, mentions légales et informations client avant envoi.</li>
        <li>Ne pas saisir de données illicites ou appartenant à une personne sans autorisation.</li>
        <li>Utiliser les informations véhicule uniquement pour des transactions légitimes.</li>
      </ul>
      <h3>Limitation de responsabilité</h3>
      <p>Le site ne remplace pas un expert-comptable, avocat ou conseiller fiscal. L'utilisateur reste responsable de la conformité de ses documents.</p>
      <h3>Disponibilité</h3>
      <p>Le service peut évoluer, être interrompu temporairement ou modifié pour maintenance ou amélioration.</p>
    `
  },
  cookies: {
    title: 'Politique cookies',
    html: `
      <h3>Cookies utilisés</h3>
      <p>Le site peut utiliser des cookies ou stockages locaux pour :</p>
      <ul>
        <li>mémoriser le mode clair/sombre ;</li>
        <li>conserver un brouillon local dans votre navigateur ;</li>
        <li>permettre la connexion Firebase ;</li>
        <li>mesurer l'audience via Google Analytics ;</li>
        <li>afficher et mesurer des annonces via Google AdSense lorsque les annonces sont activées.</li>
      </ul>
      <h3>Gestion</h3>
      <p>Vous pouvez accepter les cookies analytics/publicité, choisir les cookies essentiels seulement, ou réinitialiser votre choix. Le refus de certains cookies peut limiter les statistiques, la personnalisation des annonces ou certaines mesures publicitaires.</p>
      <p><button class="btn btn-ghost btn-sm" onclick="resetCookieConsent()"><i class="fa fa-cookie-bite"></i> Réinitialiser mon choix cookies</button></p>
    `
  },
  contact: {
    title: 'Contact',
    html: `
      <h3>Contact professionnel</h3>
      <p><strong>Email :</strong> contact@facturergratuit.com</p>
      <p><strong>Propriétaire / Éditeur :</strong> À compléter avec votre nom ou société</p>
      <p><strong>Adresse :</strong> À compléter avec votre adresse professionnelle</p>
      <div class="support-box">
        <strong style="color:var(--ink)">Support rapide :</strong> pour un problème PDF, login, AdSense ou facture, envoyez le type de document, le pays choisi, votre navigateur et une courte description.
      </div>
      <h3>Demandes possibles</h3>
      <p>Vous pouvez nous contacter pour une question sur l'outil, une demande de suppression de données de compte Firebase, un problème technique, une remarque liée aux annonces, ou une suggestion d'amélioration.</p>
      <p><button class="btn btn-primary btn-sm" onclick="closeLegal();openFeedback()"><i class="fa fa-message"></i> Envoyer un feedback</button></p>
    `
  }
};

function openLegal(page='legal') {
  const data = LEGAL_PAGES[page] || LEGAL_PAGES.legal;
  const title = document.getElementById('legal-title');
  const content = document.getElementById('legal-content');
  if (title) title.textContent = data.title;
  if (content) content.innerHTML = data.html;
  document.getElementById('legal-modal')?.classList.add('open');
}

function closeLegal() {
  document.getElementById('legal-modal')?.classList.remove('open');
}

function handleLegalBackdrop(e) {
  if (e.target?.id === 'legal-modal') closeLegal();
}

function openFeedback() {
  document.getElementById('account-menu')?.classList.remove('open');
  const email = document.getElementById('feedback-email');
  if (email && !email.value) email.value = S.authUser?.email || document.getElementById('e-email')?.value || '';
  document.getElementById('feedback-modal')?.classList.add('open');
}

function closeFeedback() {
  document.getElementById('feedback-modal')?.classList.remove('open');
}

function handleFeedbackBackdrop(e) {
  if (e.target?.id === 'feedback-modal') closeFeedback();
}

function collectFeedbackRecord() {
  const rating = document.querySelector('input[name="feedback-rating"]:checked')?.value || '5';
  const message = document.getElementById('feedback-message')?.value?.trim() || '';
  return {
    id: `fb-${Date.now()}`,
    rating,
    type: document.getElementById('feedback-type')?.value || 'Autre',
    email: document.getElementById('feedback-email')?.value?.trim() || S.authUser?.email || '',
    message,
    userEmail: S.authUser?.email || '',
    userId: S.authUser?.uid || '',
    page: location.href,
    docType: S.docType,
    sector: S.docSector,
    country: S.country,
    createdAt: new Date().toISOString()
  };
}

function saveFeedbackRecord(record) {
  try {
    const list = JSON.parse(localStorage.getItem('facturepro-feedback') || '[]');
    const next = [record, ...(Array.isArray(list) ? list : [])].slice(0, 50);
    localStorage.setItem('facturepro-feedback', JSON.stringify(next));
  } catch {}
}

function buildSupportMailto(record) {
  const subject = `FacturePro feedback - ${record.type}`;
  const body = [
    `Note: ${record.rating}/5`,
    `Sujet: ${record.type}`,
    `Email: ${record.email || 'Non fourni'}`,
    `Document: ${record.docType} / ${record.sector} / ${record.country}`,
    '',
    'Message:',
    record.message,
    '',
    `Page: ${record.page}`,
    `Date: ${record.createdAt}`
  ].join('\n');
  return `mailto:contact@facturergratuit.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function submitFeedback(e) {
  e.preventDefault();
  const record = collectFeedbackRecord();
  if (record.message.length < 5) {
    showNotif('Message feedback thora detail mein likhein', 'info');
    return;
  }
  saveFeedbackRecord(record);
  closeFeedback();
  showNotif('Feedback sauvegardé, email support ouvert', 'success');
  window.location.href = buildSupportMailto(record);
}

function openSupportEmail() {
  const record = collectFeedbackRecord();
  if (!record.message) record.message = 'Bonjour, je souhaite contacter le support FacturePro.';
  window.location.href = buildSupportMailto(record);
}

function renderCookieBanner() {
  let choice = '';
  try { choice = localStorage.getItem('facturepro-cookie-consent') || ''; } catch {}
  const banner = document.getElementById('cookie-banner');
  if (choice === 'accepted') updateGoogleConsent(true);
  if (banner && !choice) banner.classList.add('open');
}

function updateGoogleConsent(granted) {
  const value = granted ? 'granted' : 'denied';
  if (typeof gtag === 'function') {
    gtag('consent', 'update', {
      ad_storage: value,
      analytics_storage: value,
      ad_user_data: value,
      ad_personalization: value
    });
  }
}

function acceptCookies() {
  try { localStorage.setItem('facturepro-cookie-consent', 'accepted'); } catch {}
  updateGoogleConsent(true);
  document.getElementById('cookie-banner')?.classList.remove('open');
  initAdsenseSlots();
  showNotif('Cookies analytics/publicité acceptés', 'success');
}

function rejectCookies() {
  try { localStorage.setItem('facturepro-cookie-consent', 'essential'); } catch {}
  updateGoogleConsent(false);
  document.getElementById('cookie-banner')?.classList.remove('open');
  showNotif('Cookies essentiels seulement', 'info');
}

function resetCookieConsent() {
  try { localStorage.removeItem('facturepro-cookie-consent'); } catch {}
  updateGoogleConsent(false);
  renderCookieBanner();
  showNotif('Choix cookies réinitialisé', 'info');
}

function initAdsenseSlots() {
  let accepted = false;
  try { accepted = localStorage.getItem('facturepro-cookie-consent') === 'accepted'; } catch {}
  if (!accepted) return;
  if (!window.adsbygoogle) return;
  document.querySelectorAll('ins.adsbygoogle').forEach(slot => {
    const adSlot = slot.getAttribute('data-ad-slot') || '';
    if (!adSlot || adSlot.startsWith('REPLACE_') || slot.dataset.loaded === 'true') return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      slot.dataset.loaded = 'true';
    } catch {}
  });
}

function loadAppTheme() {
  try {
    S.appTheme = localStorage.getItem('facturepro-theme') || 'dark';
  } catch {
    S.appTheme = 'dark';
  }
}

function applyAppTheme() {
  const isLight = S.appTheme === 'light';
  document.body.classList.toggle('light', isLight);
  const icon = document.getElementById('theme-icon');
  const label = document.getElementById('theme-label');
  if (icon) icon.className = isLight ? 'fa fa-sun' : 'fa fa-moon';
  if (label) label.textContent = isLight ? 'Light' : 'Dark';
}

function toggleAppTheme() {
  S.appTheme = S.appTheme === 'light' ? 'dark' : 'light';
  try { localStorage.setItem('facturepro-theme', S.appTheme); } catch {}
  applyAppTheme();
}

document.addEventListener('click', e => {
  const menu = document.getElementById('account-menu');
  const wrap = document.querySelector('.auth-actions');
  if (menu && wrap && !wrap.contains(e.target)) menu.classList.remove('open');
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeAuth();
    closeAccount();
    closeLegal();
    document.getElementById('account-menu')?.classList.remove('open');
  }
});

// ═══════════════════════════════════════════════════════
// AUTH UI
// ═══════════════════════════════════════════════════════
function loadAuthUser() {
  try {
    S.authUser = JSON.parse(localStorage.getItem('facturepro-user') || 'null');
  } catch {
    S.authUser = null;
  }
}

async function saveAuthUser(user) {
  S.authUser = user;
  try {
    if (user) localStorage.setItem('facturepro-user', JSON.stringify(user));
    else localStorage.removeItem('facturepro-user');
  } catch {}
  renderAuth();
  if (user) {
    await pullAccountDataFromCloud();
    applyAccountProfileToEditor(true);
    renderAccountOverview();
  }
}

function renderAuth() {
  const loggedIn = Boolean(S.authUser);
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  const accountBtn = document.getElementById('account-btn');
  const accountName = document.getElementById('account-name');
  const accountEmail = document.getElementById('account-email');
  const accountStatus = document.getElementById('account-status');
  const verified = S.authUser?.emailVerified !== false;

  if (loginBtn) loginBtn.style.display = loggedIn ? 'none' : '';
  if (signupBtn) signupBtn.style.display = loggedIn ? 'none' : '';
  if (accountBtn) accountBtn.style.display = loggedIn ? '' : 'none';
  if (accountName) accountName.textContent = S.authUser?.name || 'Compte';
  if (accountEmail) accountEmail.textContent = S.authUser?.email || '';
  if (accountStatus) {
    accountStatus.className = 'account-status ' + (verified ? '' : 'warn');
    accountStatus.innerHTML = verified ? '<i class="fa fa-circle-check"></i> Connecté' : '<i class="fa fa-clock"></i> Email non vérifié';
  }
  renderAccountModal();
}

function openAuth(mode='login') {
  S.authMode = mode;
  const modal = document.getElementById('auth-modal');
  const title = document.getElementById('auth-title');
  const subtitle = document.getElementById('auth-subtitle');
  const nameGroup = document.getElementById('auth-name-group');
  const password = document.getElementById('auth-password');
  const submit = document.getElementById('auth-submit');
  const forgot = document.getElementById('forgot-password-btn');
  const switchText = document.getElementById('auth-switch-text');
  const switchLink = document.getElementById('auth-switch-link');
  const isSignup = mode === 'signup';

  if (title) title.textContent = isSignup ? 'Signup' : 'Login';
  if (subtitle) subtitle.textContent = isSignup ? 'Créez votre compte FacturePro' : 'Accédez à votre espace FacturePro';
  if (nameGroup) nameGroup.style.display = isSignup ? '' : 'none';
  if (password) password.autocomplete = isSignup ? 'new-password' : 'current-password';
  if (submit) submit.innerHTML = isSignup ? '<i class="fa fa-user-plus"></i> Signup' : '<i class="fa fa-right-to-bracket"></i> Login';
  if (forgot) forgot.style.display = isSignup ? 'none' : '';
  if (switchText) switchText.textContent = isSignup ? 'Déjà un compte ?' : 'Pas encore de compte ?';
  if (switchLink) switchLink.textContent = isSignup ? 'Se connecter' : 'Créer un compte';
  if (modal) modal.classList.add('open');
  setTimeout(() => document.getElementById(isSignup ? 'auth-name' : 'auth-email-input')?.focus(), 0);
}

function closeAuth() {
  document.getElementById('auth-modal')?.classList.remove('open');
}

function openAccount() {
  renderAccountModal();
  document.getElementById('account-menu')?.classList.remove('open');
  document.getElementById('account-modal')?.classList.add('open');
}

function closeAccount() {
  document.getElementById('account-modal')?.classList.remove('open');
}

function handleAccountBackdrop(e) {
  if (e.target?.id === 'account-modal') closeAccount();
}

function renderAccountModal() {
  const user = S.authUser;
  const verified = user?.emailVerified !== false;
  const status = document.getElementById('account-modal-status');
  const sub = document.getElementById('account-modal-sub');
  const verifyBtn = document.getElementById('verify-email-btn');
  const fields = {
    'account-modal-name': user?.name || 'Compte',
    'account-modal-email': user?.email || '',
    'account-modal-verified': verified ? 'Connecté' : 'Email non vérifié',
    'account-modal-provider': user?.provider || 'firebase',
    'account-modal-uid': user?.uid || '-',
  };
  Object.entries(fields).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
  if (status) {
    status.className = 'account-status ' + (verified ? '' : 'warn');
    status.innerHTML = verified ? '<i class="fa fa-circle-check"></i> Compte actif' : '<i class="fa fa-envelope"></i> Vérification email requise';
  }
  if (sub) sub.textContent = verified ? 'Votre compte est connecté.' : 'Votre compte est connecté, email à vérifier.';
  if (verifyBtn) verifyBtn.style.display = user && user.provider === 'firebase' && !verified ? '' : 'none';
  fillAccountProfileForm(loadAccountProfile());
  renderAccountOverview();
  renderSavedProjects();
  renderSavedClients();
  renderSavedProducts();
  renderAccountHistory();
}

function showAccountPanel(panel='overview') {
  ['overview','projects','history','clients','products','profile'].forEach(name => {
    document.getElementById('account-panel-'+name)?.classList.toggle('active', name === panel);
    const btn = document.getElementById('account-tab-'+name);
    if (btn) btn.className = 'btn btn-sm ' + (name === panel ? 'btn-primary' : 'btn-ghost');
  });
  if (panel === 'overview') renderAccountOverview();
  if (panel === 'projects') renderSavedProjects();
  if (panel === 'history') renderAccountHistory();
  if (panel === 'clients') renderSavedClients();
  if (panel === 'products') renderSavedProducts();
}

function getAccountStorageKey(suffix) {
  const key = S.authUser?.uid || S.authUser?.email || 'guest';
  return `facturepro-account-${key}-${suffix}`;
}

const ACCOUNT_STORAGE_QUOTA_BYTES = 500 * 1024 * 1024;

function getTextBytes(text='') {
  try { return new TextEncoder().encode(String(text)).length; } catch { return String(text).length; }
}

function formatBytes(bytes=0) {
  const size = Math.max(0, Number(bytes) || 0);
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(size >= 100 * 1024 * 1024 ? 0 : 1)} MB`;
  if (size >= 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${size} B`;
}

function loadAutoCleanupPreference() {
  try { S.autoCleanup = localStorage.getItem(getAccountStorageKey('auto-cleanup')) === '1'; } catch { S.autoCleanup = false; }
}

function setAutoCleanup(on) {
  S.autoCleanup = Boolean(on);
  try { localStorage.setItem(getAccountStorageKey('auto-cleanup'), S.autoCleanup ? '1' : '0'); } catch {}
  renderAccountStoragePanel();
  showNotif(S.autoCleanup ? 'Auto-cleanup activé' : 'Auto-cleanup désactivé', 'success');
}

function getAccountStorageUsageBytes() {
  if (!S.authUser) return 0;
  const suffixes = ['profile','history','projects','clients','products'];
  return suffixes.reduce((sum, suffix) => {
    try { return sum + getTextBytes(localStorage.getItem(getAccountStorageKey(suffix)) || ''); } catch { return sum; }
  }, 0);
}

function getProjectedAccountStorageUsageBytes(suffix, serialized) {
  if (!S.authUser) return 0;
  const suffixes = ['profile','history','projects','clients','products'];
  return suffixes.reduce((sum, key) => {
    try {
      const text = key === suffix ? serialized : (localStorage.getItem(getAccountStorageKey(key)) || '');
      return sum + getTextBytes(text);
    } catch { return sum; }
  }, 0);
}

function cleanupOldAccountData(silent=false) {
  if (!S.authUser) return false;
  const target = ACCOUNT_STORAGE_QUOTA_BYTES * 0.85;
  let changed = false;
  ['history','projects'].forEach(suffix => {
    let list = loadAccountList(suffix);
    while (getAccountStorageUsageBytes() > target && list.length > 5) {
      list = list.slice(0, -1);
      saveAccountList(suffix, list, { skipQuotaCheck:true, silent:true });
      changed = true;
    }
  });
  if (!silent) showNotif(changed ? 'Anciens documents nettoyés' : 'Rien à nettoyer pour le moment', changed ? 'success' : 'info');
  renderAccountOverview();
  return changed;
}

function renderAccountStoragePanel() {
  const panel = document.getElementById('account-storage-panel');
  if (!panel) return;
  const used = getAccountStorageUsageBytes();
  const pct = Math.min(100, Math.round((used / ACCOUNT_STORAGE_QUOTA_BYTES) * 1000) / 10);
  const nearLimit = pct >= 90;
  const auto = Boolean(S.autoCleanup);
  panel.innerHTML = `
    <div class="storage-panel">
      <div class="storage-head">
        <span><i class="fa fa-cloud"></i> Cloud storage quota</span>
        <span>${formatBytes(used)} / ${formatBytes(ACCOUNT_STORAGE_QUOTA_BYTES)}</span>
      </div>
      <div class="storage-bar"><div class="storage-fill" style="width:${pct}%;background:${nearLimit?'linear-gradient(90deg,#f59e0b,#ef4444)':'linear-gradient(90deg,#22c55e,#8b5cf6)'}"></div></div>
      <div class="storage-text">
        <span>Limite compte: 500 MB par utilisateur.</span>
        <span>${pct}% utilisé${nearLimit?' · supprimez anciens projets/assets':''}</span>
      </div>
      <div class="storage-actions">
        <button class="btn btn-ghost btn-sm" onclick="cleanupOldAccountData()"><i class="fa fa-broom"></i> Nettoyer anciens</button>
        <button class="btn btn-ghost btn-sm" onclick="setAutoCleanup(${auto ? 'false' : 'true'})"><i class="fa fa-rotate"></i> Auto-cleanup ${auto ? 'ON' : 'OFF'}</button>
        <button class="btn btn-ghost btn-sm" onclick="exportAccountData()"><i class="fa fa-file-export"></i> Export data</button>
        <button class="btn btn-danger btn-sm" onclick="clearAllAccountLocalData()"><i class="fa fa-shield-halved"></i> Supprimer data</button>
      </div>
    </div>`;
}

function collectAccountDataBundle() {
  if (!S.authUser) return null;
  const suffixes = ['profile','history','projects','clients','products'];
  const data = {};
  suffixes.forEach(suffix => {
    try { data[suffix] = JSON.parse(localStorage.getItem(getAccountStorageKey(suffix)) || (suffix === 'profile' ? 'null' : '[]')); }
    catch { data[suffix] = suffix === 'profile' ? null : []; }
  });
  return {
    exportedAt: new Date().toISOString(),
    app: 'FacturePro',
    version: 'account-backup-v1',
    user: {
      uid: S.authUser.uid || '',
      email: S.authUser.email || '',
      name: S.authUser.name || ''
    },
    quotaBytes: ACCOUNT_STORAGE_QUOTA_BYTES,
    storageUsedBytes: getAccountStorageUsageBytes(),
    data
  };
}

let cloudSyncTimer = null;

function queueCloudSync() {
  if (!S.authUser?.uid) return;
  clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(syncAccountDataToCloud, 800);
}

async function syncAccountDataToCloud() {
  if (!S.authUser?.uid) return false;
  const services = window.firebaseServices;
  if (!services?.db || !window.firestoreDoc || !window.firestoreSetDoc) return false;
  try {
    const bundle = collectAccountDataBundle();
    if (!bundle) return false;
    const ref = window.firestoreDoc(services.db, 'users', S.authUser.uid);
    await window.firestoreSetDoc(ref, {
      profile: bundle.data.profile,
      history: bundle.data.history,
      projects: bundle.data.projects,
      clients: bundle.data.clients,
      products: bundle.data.products,
      storageUsedBytes: bundle.storageUsedBytes,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (err) {
    console.warn('Cloud sync failed, data reste sauvegardé localement', err);
    return false;
  }
}

async function pullAccountDataFromCloud() {
  if (!S.authUser?.uid) return false;
  const services = window.firebaseServices;
  if (!services?.db || !window.firestoreDoc || !window.firestoreGetDoc) return false;
  try {
    const ref = window.firestoreDoc(services.db, 'users', S.authUser.uid);
    const snap = await window.firestoreGetDoc(ref);
    if (!snap.exists()) return false;
    const cloud = snap.data() || {};
    ['profile','history','projects','clients','products'].forEach(suffix => {
      if (cloud[suffix] !== undefined && cloud[suffix] !== null) {
        try { localStorage.setItem(getAccountStorageKey(suffix), JSON.stringify(cloud[suffix])); } catch {}
      }
    });
    return true;
  } catch (err) {
    console.warn('Cloud data introuvable ou inaccessible, données locales utilisées', err);
    return false;
  }
}

function exportAccountData() {
  if (!S.authUser) {
    showNotif('Login karein, phir account data export karein', 'info');
    return;
  }
  const bundle = collectAccountDataBundle();
  const safeEmail = String(S.authUser.email || 'account').replace(/[^a-z0-9._-]+/gi, '-');
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type:'application/json' });
  downloadBlob(blob, `facturepro-backup-${safeEmail}.json`);
  showNotif('Account backup exporté', 'success');
}

function clearAllAccountLocalData() {
  if (!S.authUser) return;
  if (!confirm('Supprimer profil société, historique, projets, clients et produits de ce navigateur ?')) return;
  ['profile','history','projects','clients','products','auto-cleanup'].forEach(suffix => {
    try { localStorage.removeItem(getAccountStorageKey(suffix)); } catch {}
  });
  S.autoCleanup = false;
  fillAccountProfileForm(null);
  renderAccountOverview();
  renderSavedProjects();
  renderSavedClients();
  renderSavedProducts();
  renderAccountHistory();
  showNotif('Données compte locales supprimées', 'info');
}

function loadAccountList(suffix) {
  if (!S.authUser) return [];
  try {
    const list = JSON.parse(localStorage.getItem(getAccountStorageKey(suffix)) || '[]');
    return Array.isArray(list) ? list : [];
  } catch { return []; }
}

function saveAccountList(suffix, list, options={}) {
  if (!S.authUser) return false;
  try {
    const serialized = JSON.stringify(list);
    if (!options.skipQuotaCheck && getProjectedAccountStorageUsageBytes(suffix, serialized) > ACCOUNT_STORAGE_QUOTA_BYTES) {
      if (S.autoCleanup && cleanupOldAccountData(true) && getProjectedAccountStorageUsageBytes(suffix, serialized) <= ACCOUNT_STORAGE_QUOTA_BYTES) {
        localStorage.setItem(getAccountStorageKey(suffix), serialized);
        queueCloudSync();
        return true;
      }
      showNotif('Storage 500 MB full: pehle history/projets remove karein ya auto-cleanup ON karein', 'info');
      return false;
    }
    localStorage.setItem(getAccountStorageKey(suffix), serialized);
    queueCloudSync();
    return true;
  } catch {
    if (!options.silent) showNotif('Sauvegarde impossible sur ce navigateur', 'info');
    return false;
  }
}

function getDocumentTitle() {
  const client = document.getElementById('c-name')?.value?.trim() || 'Client sans nom';
  const object = document.getElementById('f-object')?.value?.trim() || '';
  return object ? `${client} · ${object}` : client;
}

function renderAccountOverview() {
  const grid = document.getElementById('account-overview-grid');
  const recent = document.getElementById('account-recent-projects');
  if (!grid && !recent) return;
  const history = loadAccountHistory();
  const projects = loadAccountList('projects');
  const clients = loadAccountList('clients');
  const products = loadAccountList('products');
  const storageUsed = getAccountStorageUsageBytes();
  const nowMonth = new Date().toISOString().slice(0,7);
  const totals = history.reduce((sum, item) => {
    const isMonth = (item.month || String(item.date || '').slice(0,7)) === nowMonth;
    return {
      month: sum.month + (isMonth ? (+item.total || 0) : 0),
      ht: sum.ht + (+item.subtotal || 0),
      tva: sum.tva + (+item.tva || 0),
      total: sum.total + (+item.total || 0)
    };
  }, { month:0, ht:0, tva:0, total:0 });
  if (grid) {
    grid.innerHTML = `
      <div style="grid-column:1 / -1">${renderProfileCompletionWidget()}</div>
      <div class="dashboard-card"><i class="fa fa-calendar-days"></i><strong>${fmtEur(totals.month)}</strong><span>Total ce mois</span></div>
      <div class="dashboard-card"><i class="fa fa-file-invoice-dollar"></i><strong>${fmtEur(totals.total)}</strong><span>Total facturé</span></div>
      <div class="dashboard-card"><i class="fa fa-percent"></i><strong>${fmtEur(totals.tva)}</strong><span>Total TVA</span></div>
      <div class="dashboard-card"><i class="fa fa-folder-open"></i><strong>${projects.length}</strong><span>Projets sauvegardés</span></div>
      <div class="dashboard-card"><i class="fa fa-address-book"></i><strong>${clients.length}</strong><span>Clients enregistrés</span></div>
      <div class="dashboard-card"><i class="fa fa-box"></i><strong>${products.length}</strong><span>Produits/services</span></div>
      <div class="dashboard-card"><i class="fa fa-receipt"></i><strong>${history.length}</strong><span>Factures historique</span></div>
      <div class="dashboard-card"><i class="fa fa-cloud"></i><strong>${formatBytes(storageUsed)}</strong><span>Storage utilisé</span></div>`;
    renderAccountStoragePanel();
  }
  if (recent) {
    const latest = projects.slice().sort((a,b) => String(b.updatedAt).localeCompare(String(a.updatedAt))).slice(0,3);
    recent.innerHTML = latest.length
      ? `<div class="saved-list">${latest.map(renderProjectItem).join('')}</div>`
      : renderEmptyState('folder-open', 'Aucun projet récent', 'Sauvegardez le projet actuel pour le reprendre plus tard.', 'Sauver projet actuel', 'saveCurrentProject()');
  }
}

function renderProfileCompletionWidget() {
  const profile = loadAccountProfile() || {};
  const verified = S.authUser?.emailVerified !== false;
  const checks = [
    ['building', 'Société', Boolean(profile.name && profile.addr)],
    ['pen-nib', 'Signature', Boolean(profile.signatureSrc || S.signatureSrc)],
    ['certificate', 'Cachet', Boolean(profile.companyStampSrc || S.companyStampSrc)],
    ['building-columns', 'IBAN', Boolean(profile.iban)],
    ['envelope-circle-check', 'Email', Boolean(verified)]
  ];
  return `<div class="profile-completion">${checks.map(([icon,label,done]) => `
    <div class="profile-check${done ? ' done' : ''}"><i class="fa fa-${icon}"></i>${label}<br><strong>${done ? 'OK' : 'À compléter'}</strong></div>
  `).join('')}</div>`;
}

function renderEmptyState(icon, title, copy, actionLabel, action) {
  return `<div class="empty-state">
    <i class="fa fa-${icon}"></i>
    <strong>${escHtml(title)}</strong>
    <p>${escHtml(copy)}</p>
    <button class="btn btn-primary btn-sm" onclick="${action}"><i class="fa fa-plus"></i> ${escHtml(actionLabel)}</button>
  </div>`;
}

function getCurrentProjectRecord(forceNew=false) {
  const summary = getCurrentDocumentSummary('project');
  const objectName = document.getElementById('f-object')?.value || '';
  const baseId = `${summary.docType}-${summary.sector}-${summary.docNum}`;
  return {
    ...summary,
    id: forceNew ? `${baseId}-${Date.now()}` : baseId,
    title: getDocumentTitle(),
    objectName,
    snapshot: collectDraft(),
    updatedAt: new Date().toISOString()
  };
}

function saveCurrentProject(forceNew=false) {
  if (!S.authUser) { showNotif('Login karein, phir project save karein', 'info'); return; }
  const record = getCurrentProjectRecord(forceNew);
  const list = loadAccountList('projects');
  const next = [record, ...list.filter(item => item.id !== record.id)].slice(0, 200);
  if (saveAccountList('projects', next)) {
    renderSavedProjects();
    renderAccountOverview();
    showNotif('Projet sauvegardé', 'success');
  }
}

function getSectorLabel(sector) {
  const profile = getCountryProfile();
  const local = profile.sector?.[sector];
  const fallback = {
    batiment: 'Bâtiment',
    automobile: 'Automobile',
    online: 'Freelance / marketplace'
  };
  return local || fallback[sector] || 'Document';
}

function renderProjectItem(item) {
  const type = `${String(item.docType || 'document').toUpperCase()} · ${getSectorLabel(item.sector || 'batiment')}`;
  return `
    <div class="saved-item">
      <div class="saved-item-main">
        <strong>${escHtml(item.title || item.clientName || 'Projet')}</strong>
        <span>${escHtml(type)} · ${fmtDate(item.date)} · ${escHtml(item.docNum || '')}</span>
        <span>${escHtml(item.objectName || 'Sans objet')} · ${fmtEur(item.total)}</span>
      </div>
      <div class="saved-item-actions">
        <button class="btn btn-primary btn-sm" onclick="openSavedProject('${escHtml(item.id)}')"><i class="fa fa-play"></i> Continuer</button>
        <button class="btn btn-ghost btn-sm" onclick="duplicateSavedProject('${escHtml(item.id)}')"><i class="fa fa-copy"></i> Copier</button>
        <button class="btn btn-danger btn-sm" onclick="deleteSavedProject('${escHtml(item.id)}')"><i class="fa fa-trash"></i></button>
      </div>
    </div>`;
}

function renderSavedProjects() {
  const box = document.getElementById('account-projects-list');
  if (!box) return;
  const list = loadAccountList('projects').sort((a,b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  box.innerHTML = list.length
    ? `<div class="saved-list">${list.map(renderProjectItem).join('')}</div>`
    : renderEmptyState('folder-open', 'Aucun projet sauvegardé', 'Sauvegardez une facture ou un devis en cours pour reprendre depuis le même point.', 'Sauver projet actuel', 'saveCurrentProject()');
}

function openSavedProject(id) {
  const item = loadAccountList('projects').find(entry => entry.id === id);
  if (!item?.snapshot) return showNotif('Projet introuvable', 'info');
  applyDraftSnapshot(item.snapshot);
  closeAccount();
  scrollToEditor();
  showSection('infos');
  showNotif('Projet chargé, vous pouvez continuer', 'success');
}

function duplicateSavedProject(id) {
  const item = loadAccountList('projects').find(entry => entry.id === id);
  if (!item?.snapshot) return showNotif('Projet introuvable', 'info');
  applyDraftSnapshot(item.snapshot);
  const num = document.getElementById('f-number');
  if (num) num.value = `${num.value || item.docNum || 'DOC'}-COPIE`;
  saveCurrentProject(true);
}

function deleteSavedProject(id) {
  if (!confirm('Supprimer ce projet sauvegardé ?')) return;
  saveAccountList('projects', loadAccountList('projects').filter(item => item.id !== id));
  renderSavedProjects();
  renderAccountOverview();
}

function clearSavedProjects() {
  if (!confirm('Effacer tous les projets sauvegardés ?')) return;
  saveAccountList('projects', []);
  renderSavedProjects();
  renderAccountOverview();
}

function getCurrentClientRecord() {
  const name = document.getElementById('c-name')?.value?.trim() || '';
  const email = document.getElementById('c-email')?.value?.trim() || '';
  const key = (name || email || `client-${Date.now()}`).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9@._-]+/g, '-');
  return {
    id: key,
    name,
    siret: document.getElementById('c-siret')?.value || '',
    addr: document.getElementById('c-addr')?.value || '',
    siteAddr: document.getElementById('c-site-addr')?.value || '',
    email,
    tel: document.getElementById('c-tel')?.value || '',
    updatedAt: new Date().toISOString()
  };
}

function saveCurrentClient() {
  if (!S.authUser) { showNotif('Login karein, phir client save karein', 'info'); return; }
  const record = getCurrentClientRecord();
  if (!record.name && !record.email) return showNotif('Client ka naam ya email add karein', 'info');
  const list = loadAccountList('clients');
  const next = [record, ...list.filter(item => item.id !== record.id)].slice(0, 500);
  if (saveAccountList('clients', next)) {
    renderSavedClients();
    renderAccountOverview();
    showNotif('Client sauvegardé', 'success');
  }
}

function renderSavedClients() {
  const box = document.getElementById('account-clients-list');
  if (!box) return;
  const list = loadAccountList('clients').sort((a,b) => String(a.name).localeCompare(String(b.name)));
  box.innerHTML = list.length
    ? `<div class="saved-list">${list.map(item => `
      <div class="saved-item">
        <div class="saved-item-main">
          <strong>${escHtml(item.name || item.email || 'Client')}</strong>
          <span>${escHtml(item.email || '')}${item.tel ? ' · '+escHtml(item.tel) : ''}</span>
          <span>${escHtml(item.addr || '')}${item.siteAddr ? ' · Chantier: '+escHtml(item.siteAddr) : ''}</span>
        </div>
        <div class="saved-item-actions">
          <button class="btn btn-primary btn-sm" onclick="applySavedClient('${escHtml(item.id)}')"><i class="fa fa-arrow-right"></i> Appliquer</button>
          <button class="btn btn-danger btn-sm" onclick="deleteSavedClient('${escHtml(item.id)}')"><i class="fa fa-trash"></i></button>
        </div>
      </div>`).join('')}</div>`
    : renderEmptyState('address-book', 'Aucun client sauvegardé', 'Ajoutez les coordonnées du client actuel à votre base clients.', 'Sauver client actuel', 'saveCurrentClient()');
}

function applySavedClient(id) {
  const item = loadAccountList('clients').find(entry => entry.id === id);
  if (!item) return showNotif('Client introuvable', 'info');
  const map = {
    'c-name': item.name,
    'c-siret': item.siret,
    'c-addr': item.addr,
    'c-site-addr': item.siteAddr,
    'c-email': item.email,
    'c-tel': item.tel
  };
  Object.entries(map).forEach(([fieldId, value]) => {
    const el = document.getElementById(fieldId);
    if (el) el.value = value || '';
  });
  updatePreview();
  closeAccount();
  scrollToEditor();
  showSection('infos');
  showNotif('Client appliqué', 'success');
}

function deleteSavedClient(id) {
  if (!confirm('Supprimer ce client ?')) return;
  saveAccountList('clients', loadAccountList('clients').filter(item => item.id !== id));
  renderSavedClients();
  renderAccountOverview();
}

function clearSavedClients() {
  if (!confirm('Effacer toute la base clients ?')) return;
  saveAccountList('clients', []);
  renderSavedClients();
  renderAccountOverview();
}

function saveFirstProduct() {
  if (!S.authUser) { showNotif('Login karein, phir produit save karein', 'info'); return; }
  syncItemsFromForm();
  const first = S.items.find(item => String(item.desc || '').trim());
  if (!first) return showNotif('Article description add karein', 'info');
  const id = String(first.desc).trim().toLowerCase().slice(0,80).replace(/\s+/g, '-').replace(/[^a-z0-9-]+/g, '-');
  const record = {
    id,
    desc: first.desc,
    unit: first.unit || 'forfait',
    price: cleanNumber(first.price),
    tvaRate: cleanNumber(first.tvaRate),
    updatedAt: new Date().toISOString()
  };
  const list = loadAccountList('products');
  const next = [record, ...list.filter(item => item.id !== id)].slice(0, 500);
  if (saveAccountList('products', next)) {
    renderSavedProducts();
    renderAccountOverview();
    showNotif('Produit/service sauvegardé', 'success');
  }
}

function renderSavedProducts() {
  const box = document.getElementById('account-products-list');
  if (!box) return;
  const list = loadAccountList('products').sort((a,b) => String(a.desc).localeCompare(String(b.desc)));
  box.innerHTML = list.length
    ? `<div class="saved-list">${list.map(item => `
      <div class="saved-item">
        <div class="saved-item-main">
          <strong>${escHtml(item.desc || 'Produit/service')}</strong>
          <span>${escHtml(item.unit || 'forfait')} · ${fmtEur(item.price)} · TVA ${escHtml(String(item.tvaRate ?? 0))}%</span>
        </div>
        <div class="saved-item-actions">
          <button class="btn btn-primary btn-sm" onclick="addSavedProduct('${escHtml(item.id)}')"><i class="fa fa-plus"></i> Ajouter</button>
          <button class="btn btn-danger btn-sm" onclick="deleteSavedProduct('${escHtml(item.id)}')"><i class="fa fa-trash"></i></button>
        </div>
      </div>`).join('')}</div>`
    : renderEmptyState('box', 'Aucun produit/service', 'Sauvegardez la première ligne d’article pour la réutiliser dans vos prochaines factures.', 'Sauver première ligne', 'saveFirstProduct()');
}

function addSavedProduct(id) {
  const item = loadAccountList('products').find(entry => entry.id === id);
  if (!item) return showNotif('Produit introuvable', 'info');
  addRow(item.desc, 1, item.unit, item.price, item.tvaRate);
  closeAccount();
  scrollToEditor();
  showSection('articles');
  showNotif('Produit ajouté à la facture', 'success');
}

function deleteSavedProduct(id) {
  if (!confirm('Supprimer ce produit/service ?')) return;
  saveAccountList('products', loadAccountList('products').filter(item => item.id !== id));
  renderSavedProducts();
  renderAccountOverview();
}

function clearSavedProducts() {
  if (!confirm('Effacer toute la base produits/services ?')) return;
  saveAccountList('products', []);
  renderSavedProducts();
  renderAccountOverview();
}

// ═══════════════════════════════════════════════════════
// AI INVOICE ASSISTANT
// ═══════════════════════════════════════════════════════
function updateAiStatus() {
  const status = document.getElementById('ai-status');
  if (!status) return;
  const ready = Boolean(window.firebaseServices?.aiModel);
  status.innerHTML = ready
    ? '<i class="fa fa-circle-check"></i><span>Assistant AI connecté. Les lignes générées restent modifiables avant PDF.</span>'
    : '<i class="fa fa-triangle-exclamation"></i><span>Assistant AI indisponible pour le moment. Vous pouvez continuer à créer la facture manuellement.</span>';
}

function fillAiExample(kind) {
  const examples = {
    batiment: 'Peinture appartement 45 m2, protection du sol, préparation des murs, enduit partiel, ponçage, deux couches de peinture blanche, fournitures incluses.',
    auto: 'Réparation automobile: diagnostic, remplacement plaquettes de frein avant, contrôle liquide de frein, essai route, véhicule Peugeot 208.',
    marketplace: 'Commande marketplace Etsy: vente de 3 affiches personnalisées, emballage, livraison suivie, référence commande ETSY-2026-001.',
    freelance: 'Prestation freelance: création logo, charte couleur simple, 2 propositions graphiques, fichiers PNG et PDF, livraison par email.'
  };
  const el = document.getElementById('ai-prompt');
  if (el) el.value = examples[kind] || examples.batiment;
  updateAiStatus();
  showNotif('Exemple AI ajouté', 'success');
}

function buildAiInvoicePrompt(userText) {
  const profile = getCountryProfile();
  const detail = document.getElementById('ai-detail')?.value || 'standard';
  const priceMode = document.getElementById('ai-price-mode')?.value || 'estimate';
  const context = {
    document: S.docType,
    sector: S.docSector,
    country: S.country,
    language: S.lang,
    currency: S.currency || profile.currency,
    taxName: profile.taxName,
    defaultTaxRate: S.tva ? profile.taxRate : 0,
    detail,
    priceMode
  };
  return `You are an invoice assistant for FacturePro. Convert the user's description into editable invoice/devis line items.

Return ONLY valid JSON with this exact shape:
{
  "object": "short document object",
  "notes": "short helpful note if needed",
  "items": [
    {"desc":"clear line item description","qty":1,"unit":"forfait","price":0,"tvaRate":20}
  ]
}

Rules:
- Use the context country, document type, sector and currency.
- Keep descriptions professional and concise.
- If priceMode is "blank", set all prices to 0.
- If priceMode is "estimate", propose reasonable editable prices but do not invent legal guarantees.
- Use tvaRate ${context.defaultTaxRate} unless the text clearly suggests another common rate.
- Use at most 8 items.
- No markdown, no explanations outside JSON.

Context: ${JSON.stringify(context)}
User description: ${userText}`;
}

function parseAiJson(text) {
  const raw = String(text || '').trim();
  const cleaned = raw.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON object in AI response');
  return JSON.parse(match[0]);
}

function normaliseAiItems(data) {
  const profile = getCountryProfile();
  const source = Array.isArray(data?.items) ? data.items : [];
  return source.slice(0, 12).map(item => ({
    desc: String(item.desc || item.description || '').trim(),
    qty: cleanNumber(item.qty || item.quantity || 1) || 1,
    unit: String(item.unit || 'forfait').trim() || 'forfait',
    price: cleanNumber(item.price || item.unitPrice || 0),
    tvaRate: S.tva ? cleanNumber(item.tvaRate ?? item.taxRate ?? profile.taxRate) : 0
  })).filter(item => item.desc);
}

function renderAiResult(data, items) {
  const box = document.getElementById('ai-result');
  if (!box) return;
  if (!items.length) {
    box.innerHTML = '<div class="support-box">AI n’a pas retourné de lignes utilisables. Essayez une description plus précise.</div>';
    return;
  }
  const total = items.reduce((sum, item) => sum + cleanNumber(item.qty) * cleanNumber(item.price), 0);
  box.innerHTML = `
    <div class="support-box">
      <strong style="color:var(--ink)">Résultat AI :</strong> ${items.length} ligne${items.length>1?'s':''} proposée${items.length>1?'s':''}. Total HT estimatif: ${fmtEur(total)}
    </div>
    <div class="saved-list">
      ${items.map(item => `
        <div class="saved-item">
          <div class="saved-item-main">
            <strong>${escHtml(item.desc)}</strong>
            <span>${escHtml(String(item.qty))} ${escHtml(item.unit)} · ${fmtEur(item.price)} · TVA ${escHtml(String(item.tvaRate))}%</span>
          </div>
        </div>`).join('')}
    </div>
    ${data?.notes ? `<div class="support-box">${escHtml(data.notes)}</div>` : ''}`;
}

async function generateAiInvoiceItems() {
  const promptEl = document.getElementById('ai-prompt');
  const btn = document.getElementById('ai-generate-btn');
  const text = promptEl?.value?.trim() || '';
  if (text.length < 10) {
    showNotif('AI ke liye description thori detail mein likhein', 'info');
    return;
  }
  const model = window.firebaseServices?.aiModel;
  if (!model) {
    updateAiStatus();
    showNotif('Assistant AI ready nahi hai. Page reload karein.', 'info');
    return;
  }
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Génération...';
  }
  try {
    const result = await model.generateContent(buildAiInvoicePrompt(text));
    const responseText = result?.response?.text ? result.response.text() : '';
    const data = parseAiJson(responseText);
    const items = normaliseAiItems(data);
    S.aiLastObject = data.object || '';
    S.aiLastItems = items;
    renderAiResult(data, items);
    showNotif('AI lines generated', 'success');
  } catch (err) {
    console.error(err);
    const box = document.getElementById('ai-result');
    if (box) box.innerHTML = '<div class="support-box">Assistant AI disponible nahi hai pour le moment. Thori der baad réessayez.</div>';
    showNotif('AI generation failed', 'info');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa fa-sparkles"></i> Générer avec AI';
    }
  }
}

function applyAiItemsToInvoice() {
  const items = Array.isArray(S.aiLastItems) ? S.aiLastItems : [];
  if (!items.length) {
    showNotif('Pehle AI lines generate karein', 'info');
    return;
  }
  const objectEl = document.getElementById('f-object');
  if (objectEl && !objectEl.value && S.aiLastObject) objectEl.value = S.aiLastObject;
  itemId = 0;
  S.items = items.map(item => ({
    id: ++itemId,
    desc: item.desc,
    qty: item.qty,
    unit: item.unit,
    price: item.price,
    tvaRate: item.tvaRate
  }));
  renderItems();
  showSection('articles');
  updatePreview();
  showNotif('AI articles appliqués', 'success');
}

function loadAccountProfile() {
  if (!S.authUser) return null;
  try { return JSON.parse(localStorage.getItem(getAccountStorageKey('profile')) || 'null'); } catch { return null; }
}

function saveAccountProfile(profile) {
  if (!S.authUser) { showNotif('Login karein, phir société save karein', 'info'); return false; }
  try {
    const serialized = JSON.stringify({ ...profile, savedAt: new Date().toISOString() });
    if (getProjectedAccountStorageUsageBytes('profile', serialized) > ACCOUNT_STORAGE_QUOTA_BYTES) {
      if (!S.autoCleanup || !cleanupOldAccountData(true) || getProjectedAccountStorageUsageBytes('profile', serialized) > ACCOUNT_STORAGE_QUOTA_BYTES) {
        showNotif('Storage 500 MB full: anciens documents remove karein', 'info');
        return false;
      }
    }
    localStorage.setItem(getAccountStorageKey('profile'), serialized);
    queueCloudSync();
    showNotif('Société profile sauvegardé', 'success');
    renderAccountModal();
    return true;
  } catch {
    showNotif('Société profile save nahi ho saka', 'info');
    return false;
  }
}

function collectCompanyProfileFromEditor() {
  return {
    name: document.getElementById('e-name')?.value || '',
    status: document.getElementById('e-status')?.value || '',
    siret: document.getElementById('e-siret')?.value || '',
    addr: document.getElementById('e-addr')?.value || '',
    email: document.getElementById('e-email')?.value || '',
    tel: document.getElementById('e-tel')?.value || '',
    iban: document.getElementById('e-iban')?.value || '',
    bic: document.getElementById('e-bic')?.value || '',
    rib: document.getElementById('e-rib')?.value || '',
    logoSrc: S.logoSrc,
    logoPos: S.logoPos,
    logoSize: S.logoSize,
    companyStampSrc: S.companyStampSrc,
    companyStampSize: S.companyStampSize,
    companyStampOpacity: S.companyStampOpacity,
    signatureSrc: S.signatureSrc,
    signatureSize: S.signatureSize,
    signature: S.signature
  };
}

function collectCompanyProfileFromForm() {
  const current = loadAccountProfile() || {};
  return {
    ...current,
    name: document.getElementById('acct-company-name')?.value || '',
    status: document.getElementById('acct-company-status')?.value || '',
    siret: document.getElementById('acct-company-siret')?.value || '',
    addr: document.getElementById('acct-company-addr')?.value || '',
    email: document.getElementById('acct-company-email')?.value || '',
    tel: document.getElementById('acct-company-tel')?.value || '',
    iban: document.getElementById('acct-company-iban')?.value || '',
    bic: document.getElementById('acct-company-bic')?.value || '',
    rib: document.getElementById('acct-company-rib')?.value || ''
  };
}

function fillAccountProfileForm(profile) {
  const p = profile || {};
  const map = {
    'acct-company-name': p.name,
    'acct-company-status': p.status,
    'acct-company-siret': p.siret,
    'acct-company-addr': p.addr,
    'acct-company-email': p.email,
    'acct-company-tel': p.tel,
    'acct-company-iban': p.iban,
    'acct-company-bic': p.bic,
    'acct-company-rib': p.rib,
  };
  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el && document.activeElement !== el) el.value = value || '';
  });
  const assets = [
    p.logoSrc ? 'logo' : '',
    p.signatureSrc ? 'signature' : '',
    p.companyStampSrc ? 'cachet' : ''
  ].filter(Boolean);
  const status = document.getElementById('acct-assets-status');
  if (status) status.textContent = assets.length ? assets.join(' + ') : 'Non sauvegardés';
}

function applyAccountProfileToEditor(silent=false) {
  const p = loadAccountProfile();
  if (!p) {
    if (!silent) showNotif('Aucun profil société sauvegardé', 'info');
    return;
  }
  const map = {
    'e-name': p.name,
    'e-status': p.status,
    'e-siret': p.siret,
    'e-addr': p.addr,
    'e-email': p.email,
    'e-tel': p.tel,
    'e-iban': p.iban,
    'e-bic': p.bic,
    'e-rib': p.rib,
  };
  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el && value !== undefined && value !== null) el.value = value;
  });
  S.logoSrc = p.logoSrc || S.logoSrc;
  S.logoPos = p.logoPos || S.logoPos || 'left';
  S.logoSize = p.logoSize || S.logoSize || 80;
  S.companyStampSrc = p.companyStampSrc || S.companyStampSrc;
  S.companyStampSize = p.companyStampSize || S.companyStampSize || 115;
  S.companyStampOpacity = p.companyStampOpacity || S.companyStampOpacity || 90;
  S.signatureSrc = p.signatureSrc || S.signatureSrc;
  S.signatureSize = p.signatureSize || S.signatureSize || 135;
  S.signature = Boolean(p.signature || p.signatureSrc || S.signature);
  renderLogoState();
  renderCompanyStampState();
  renderSignatureImageState();
  renderToggleStates();
  updatePreview();
  if (!silent) showNotif('Société appliquée à la facture', 'success');
}

function saveAccountProfileFromEditor() {
  if (saveAccountProfile(collectCompanyProfileFromEditor())) fillAccountProfileForm(loadAccountProfile());
}

function saveAccountProfileFromForm() {
  saveAccountProfile(collectCompanyProfileFromForm());
}

function clearAccountProfile() {
  if (!S.authUser) return;
  try { localStorage.removeItem(getAccountStorageKey('profile')); } catch {}
  fillAccountProfileForm(null);
  renderAccountOverview();
  showNotif('Société effacée du compte', 'info');
}

function loadAccountHistory() {
  if (!S.authUser) return [];
  try {
    const list = JSON.parse(localStorage.getItem(getAccountStorageKey('history')) || '[]');
    return Array.isArray(list) ? list : [];
  } catch { return []; }
}

function saveAccountHistory(list) {
  if (!S.authUser) return;
  saveAccountList('history', list);
}

function getCurrentDocumentSummary(action='PDF') {
  syncItemsFromForm();
  const profile = getCountryProfile();
  const subtotal = S.items.reduce((s,i) => s + cleanNumber(i.qty) * cleanNumber(i.price), 0);
  const tvaAmt = S.tva ? S.items.reduce((s,i) => s + cleanNumber(i.qty) * cleanNumber(i.price) * (cleanNumber(i.tvaRate) / 100), 0) : 0;
  const rawDate = document.getElementById('f-date')?.value || new Date().toISOString().slice(0,10);
  const docNum = document.getElementById('f-number')?.value || getDefaultDocNumber(S.docType, S.docSector);
  return {
    id: `${S.docType}-${docNum}`,
    docNum,
    docType: S.docType,
    sector: S.docSector,
    clientName: document.getElementById('c-name')?.value || 'Client sans nom',
    date: rawDate,
    month: rawDate.slice(0,7),
    subtotal,
    tva: tvaAmt,
    total: subtotal + tvaAmt,
    currency: S.currency || profile.currency,
    country: S.country,
    action,
    updatedAt: new Date().toISOString()
  };
}

function recordDocumentHistory(action='PDF') {
  if (!S.authUser) return;
  const record = getCurrentDocumentSummary(action);
  record.snapshot = collectDraft();
  const list = loadAccountHistory();
  const next = [record, ...list.filter(item => item.id !== record.id)].slice(0, 300);
  saveAccountHistory(next);
  renderAccountHistory();
  renderAccountOverview();
  if (action === 'manual') showNotif('Facture ajoutée à l’historique', 'success');
}

function renderAccountHistory() {
  const box = document.getElementById('account-history-list');
  if (!box) return;
  const list = loadAccountHistory().sort((a,b) => String(b.date).localeCompare(String(a.date)));
  if (!list.length) {
    box.innerHTML = renderEmptyState('clock-rotate-left', 'Aucune facture sauvegardée', 'Ajoutez la facture actuelle à l’historique pour suivre vos totaux mensuels HT, TVA et TTC.', 'Ajouter facture actuelle', "recordDocumentHistory('manual')");
    return;
  }
  const grouped = list.reduce((acc, item) => {
    const key = item.month || String(item.date || '').slice(0,7) || 'Sans date';
    (acc[key] ||= []).push(item);
    return acc;
  }, {});
  box.innerHTML = Object.entries(grouped).map(([month, items]) => {
    const totals = items.reduce((sum, item) => ({
      subtotal: sum.subtotal + (+item.subtotal || 0),
      tva: sum.tva + (+item.tva || 0),
      total: sum.total + (+item.total || 0)
    }), { subtotal:0, tva:0, total:0 });
    return `
      <div class="history-month">
        <div class="history-head"><span>${formatMonthLabel(month)}</span><span>${items.length} document${items.length>1?'s':''}</span></div>
        ${items.map(item => `
          <div class="history-row">
            <span>${fmtDate(item.date)}</span>
            <strong>${escHtml(item.clientName || 'Client')}</strong>
            <span style="text-align:right">${fmtEur(item.total)}</span>
            <div class="saved-item-actions">
              <button class="btn btn-ghost btn-sm" style="height:28px;font-size:10px;padding:4px 8px" data-history-id="${escHtml(item.id)}" onclick="editHistoryRecord(this.dataset.historyId)"><i class="fa fa-pen"></i></button>
              <button class="btn btn-ghost btn-sm" style="height:28px;font-size:10px;padding:4px 8px" data-history-id="${escHtml(item.id)}" onclick="duplicateHistoryRecord(this.dataset.historyId)"><i class="fa fa-copy"></i></button>
              <button class="btn btn-danger btn-sm" style="height:28px;font-size:10px;padding:4px 8px" data-history-id="${escHtml(item.id)}" onclick="deleteHistoryRecord(this.dataset.historyId)"><i class="fa fa-trash"></i></button>
            </div>
            <span style="grid-column:2 / 5;font-size:10px;opacity:.65">${escHtml((item.docType || '').toUpperCase())} · ${escHtml(item.docNum || '')}</span>
          </div>
        `).join('')}
        <div class="history-total">
          <span>Total HT<strong>${fmtEur(totals.subtotal)}</strong></span>
          <span>TVA<strong>${fmtEur(totals.tva)}</strong></span>
          <span>TTC<strong>${fmtEur(totals.total)}</strong></span>
        </div>
      </div>`;
  }).join('');
}

function editHistoryRecord(id) {
  const item = loadAccountHistory().find(entry => entry.id === id);
  if (!item) {
    showNotif('Historique introuvable', 'info');
    return;
  }
  if (item.snapshot) {
    applyDraftSnapshot(item.snapshot);
  } else {
    document.getElementById('f-number').value = item.docNum || '';
    document.getElementById('f-date').value = item.date || '';
    document.getElementById('c-name').value = item.clientName || '';
    setDocVariant(item.docType || 'facture', item.sector || 'batiment');
    updatePreview();
  }
  closeAccount();
  scrollToEditor();
  showSection('infos');
  showNotif('Facture chargée depuis l’historique', 'success');
}

function duplicateHistoryRecord(id) {
  const item = loadAccountHistory().find(entry => entry.id === id);
  if (!item?.snapshot) return showNotif('Historique introuvable', 'info');
  applyDraftSnapshot(item.snapshot);
  const num = document.getElementById('f-number');
  if (num) num.value = `${num.value || item.docNum || 'DOC'}-COPIE`;
  recordDocumentHistory('duplicate');
  renderAccountHistory();
  showNotif('Facture copiée dans l’historique', 'success');
}

function deleteHistoryRecord(id) {
  if (!confirm('Supprimer cette facture de l’historique ?')) return;
  saveAccountHistory(loadAccountHistory().filter(item => item.id !== id));
  renderAccountHistory();
  renderAccountOverview();
  showNotif('Facture supprimée de l’historique', 'info');
}

function applyDraftSnapshot(draft) {
  Object.entries(draft.fields || {}).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el && el.type !== 'file') el.value = value;
  });
  Object.assign(S, draft.state || {});
  S.country = COUNTRY_PROFILES[S.country] ? S.country : 'FR';
  S.lang = I18N[S.lang] ? S.lang : getCountryProfile().lang;
  S.currency = draft.state?.currency || S.currency || getCountryProfile().currency;
  syncLocaleControls();
  S.items = (draft.state?.items || []).map(item => ({ ...item }));
  itemId = S.items.reduce((max, item) => Math.max(max, item.id || 0), 0);
  buildLayoutGrid();
  selectLayout(S.layoutIdx);
  buildTemplateGallery();
  buildOnlineStyleGallery();
  buildThemeGrid();
  selectTheme(S.themeIdx);
  buildFontCats();
  buildFontList();
  buildPageColorGrid();
  buildFontColorGrid();
  renderItems();
  renderToggleStates();
  renderLogoState();
  renderCompanyStampState();
  renderSignatureImageState();
  renderDocVariant();
  setEditorMode(S.editorMode || 'advanced');
  updatePreview();
}

function formatMonthLabel(key) {
  if (!/^\d{4}-\d{2}$/.test(key)) return key;
  const [year, month] = key.split('-').map(Number);
  return new Intl.DateTimeFormat(getCountryProfile().locale, { month:'long', year:'numeric' }).format(new Date(year, month - 1, 1));
}

function clearAccountHistory() {
  if (!S.authUser) return;
  try { localStorage.removeItem(getAccountStorageKey('history')); } catch {}
  renderAccountHistory();
  renderAccountOverview();
  showNotif('Historique effacé', 'info');
}

function switchAuthMode() {
  openAuth(S.authMode === 'login' ? 'signup' : 'login');
}

function handleAuthBackdrop(e) {
  if (e.target?.id === 'auth-modal') closeAuth();
}

async function submitAuth(e) {
  e.preventDefault();
  const email = document.getElementById('auth-email-input')?.value.trim();
  const password = document.getElementById('auth-password')?.value || '';
  const typedName = document.getElementById('auth-name')?.value.trim();
  if (!email || !password) return;

  const name = S.authMode === 'signup'
    ? (typedName || email.split('@')[0])
    : (S.authUser?.name || email.split('@')[0]);

  const submit = document.getElementById('auth-submit');
  const original = submit?.innerHTML;
  if (submit) submit.innerHTML = '<div class="spinner" style="display:inline-block"></div> Connexion...';

  try {
    const fb = window.firebaseServices;
    if (fb?.auth) {
      let credential;
      if (S.authMode === 'signup') {
        credential = await fb.createUserWithEmailAndPassword(fb.auth, email, password);
        if (name) await fb.updateProfile(credential.user, { displayName: name });
        try { await fb.sendEmailVerification?.(credential.user); } catch {}
      } else {
        credential = await fb.signInWithEmailAndPassword(fb.auth, email, password);
      }
      saveAuthUser({
        name: credential.user.displayName || name,
        email: credential.user.email || email,
        uid: credential.user.uid,
        signedInAt: new Date().toISOString(),
        provider: 'firebase',
        emailVerified: credential.user.emailVerified
      });
    } else {
      saveAuthUser({ name, email, signedInAt: new Date().toISOString(), provider: 'local-fallback' });
    }
    closeAuth();
    e.target.reset();
    showNotif(S.authMode === 'signup' ? 'Compte créé avec succès' : 'Connecté avec succès', 'success');
  } catch (err) {
    showNotif(firebaseAuthMessage(err), 'info');
  } finally {
    if (submit && original) submit.innerHTML = original;
  }
}

async function sendPasswordReset() {
  const emailInput = document.getElementById('auth-email-input');
  const email = emailInput?.value.trim();
  if (!email) {
    showNotif('Email likhein, phir recover account dabayein', 'info');
    emailInput?.focus();
    return;
  }

  const btn = document.getElementById('forgot-password-btn');
  const original = btn?.innerHTML;
  if (btn) btn.innerHTML = '<div class="spinner" style="display:inline-block"></div> Envoi...';

  try {
    const fb = window.firebaseServices;
    if (!fb?.auth || !fb?.sendPasswordResetEmail) {
      showNotif('Password reset Firebase se available nahi hai', 'info');
      return;
    }
    await fb.sendPasswordResetEmail(fb.auth, email);
    showNotif('Password reset email bhej di gayi hai', 'success');
  } catch (err) {
    showNotif(firebaseAuthMessage(err), 'info');
  } finally {
    if (btn && original) btn.innerHTML = original;
  }
}

async function sendVerificationEmail() {
  const fb = window.firebaseServices;
  const user = fb?.auth?.currentUser;
  if (!fb?.sendEmailVerification || !user) {
    showNotif('Login karein, phir verification email bhejein', 'info');
    return;
  }
  try {
    await fb.sendEmailVerification(user);
    showNotif('Verification email bhej di gayi hai', 'success');
  } catch (err) {
    showNotif(firebaseAuthMessage(err), 'info');
  }
}

function toggleAccountMenu() {
  document.getElementById('account-menu')?.classList.toggle('open');
}

async function logoutUser() {
  try {
    window.__firebaseLogoutDone = true;
    const fb = window.firebaseServices;
    if (fb?.auth) await fb.signOut(fb.auth);
  } catch {}
  saveAuthUser(null);
  document.getElementById('account-menu')?.classList.remove('open');
  showNotif('Déconnecté', 'info');
}

function firebaseAuthMessage(err) {
  const code = err?.code || '';
  if (code.includes('email-already-in-use')) return 'Cet email est déjà utilisé';
  if (code.includes('invalid-email')) return 'Email invalide';
  if (code.includes('weak-password')) return 'Mot de passe trop court';
  if (code.includes('wrong-password') || code.includes('invalid-credential')) return 'Email ou mot de passe incorrect';
  if (code.includes('user-not-found')) return 'Compte introuvable';
  return 'Connexion impossible pour le moment';
}

// ═══════════════════════════════════════════════════════
// SECTION NAVIGATION
// ═══════════════════════════════════════════════════════
function showSection(id) {
  ['infos','articles','ai','style','polices','couleurs','logo','extras'].forEach(s => {
    document.getElementById('sec-'+s).style.display = s === id ? '' : 'none';
  });
  if (id === 'ai') updateAiStatus();
  document.querySelectorAll('.section-tab').forEach((btn,i) => {
    const sections = ['infos','articles','ai','style','polices','couleurs','logo','extras'];
    btn.classList.toggle('active', sections[i] === id);
  });
  updateProgressSteps(id);
}

function updateProgressSteps(active='infos') {
  const map = { infos:'infos', articles:'articles', ai:'articles', style:'style', polices:'style', couleurs:'style', logo:'style', extras:'style', preview:'preview', download:'download' };
  const current = map[active] || active;
  document.querySelectorAll('.progress-step').forEach(step => {
    step.classList.toggle('active', step.dataset.step === current);
  });
}

function focusPreview() {
  updateProgressSteps('preview');
  document.querySelector('.preview-panel')?.scrollIntoView({ behavior:'smooth', block:'start' });
}

function setEditorMode(mode='advanced') {
  S.editorMode = mode === 'simple' ? 'simple' : 'advanced';
  document.body.classList.toggle('simple-mode', S.editorMode === 'simple');
  document.getElementById('mode-simple-btn')?.classList.toggle('active', S.editorMode === 'simple');
  document.getElementById('mode-advanced-btn')?.classList.toggle('active', S.editorMode !== 'simple');
  const hint = document.getElementById('mode-hint');
  if (hint) hint.textContent = S.editorMode === 'simple' ? 'Simple: champs essentiels seulement' : 'Advanced: tous les outils visibles';
  if (S.editorMode === 'simple') {
    const visibleAdvanced = ['polices','couleurs','logo','extras'].some(s => document.getElementById('sec-'+s)?.style.display !== 'none');
    if (visibleAdvanced) showSection('infos');
  }
}

function syncSectorUi() {
  document.body.classList.toggle('online-sector', S.docSector === 'online');
  buildOnlineStyleGallery();
}

// ═══════════════════════════════════════════════════════
// DOC TYPE
// ═══════════════════════════════════════════════════════
function scrollToHome() {
  document.body.classList.add('home-mode');
  document.body.classList.remove('editor-mode');
  history.replaceState(null, '', '#home');
  window.scrollTo({ top:0, behavior:'smooth' });
}

function scrollToEditor() {
  document.body.classList.add('editor-mode');
  document.body.classList.remove('home-mode');
  history.replaceState(null, '', '#editor');
  window.scrollTo({ top:0, behavior:'smooth' });
}

function openEditor(type='facture', sector) {
  const nextSector = sector || (type === 'devis' && S.docSector === 'online' ? 'batiment' : (S.docSector || 'batiment'));
  setDocVariant(type, nextSector);
  scrollToEditor();
}

function selectHomeTool(type, sector) {
  openEditor(type, sector);
}

function getCountryProfile() {
  return COUNTRY_PROFILES[S.country] || COUNTRY_PROFILES.FR;
}

function getLangPack() {
  return I18N[S.lang] || I18N[getCountryProfile().lang] || I18N.fr;
}

function syncLocaleControls() {
  const countryIds = ['country-select', 'top-country-select'];
  const langIds = ['language-select', 'top-language-select'];
  countryIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = S.country;
  });
  langIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = S.lang;
  });
  const currency = document.getElementById('currency-select');
  if (currency) currency.value = S.currency || getCountryProfile().currency;
  updateCountryFormatTooltip();

  const countrySel = document.getElementById('top-country-select');
  const countryLabel = document.getElementById('rail-country-label');
  if (countrySel && countryLabel) countryLabel.textContent = countrySel.options[countrySel.selectedIndex]?.text || '';
  const langSel = document.getElementById('top-language-select');
  const langLabel = document.getElementById('rail-lang-label');
  if (langSel && langLabel) langLabel.textContent = langSel.options[langSel.selectedIndex]?.text || '';
}

function setCountry(country) {
  S.country = COUNTRY_PROFILES[country] ? country : 'FR';
  const profile = getCountryProfile();
  S.lang = profile.lang;
  S.currency = profile.currency;

  syncLocaleControls();

  S.tva = profile.taxRate > 0;
  S.items.forEach(item => { item.tvaRate = profile.taxRate; });
  const num = document.getElementById('f-number');
  if (num) num.value = getDefaultDocNumber(S.docType, S.docSector);

  applyCountryDocumentFormat();
  renderToggleStates();
  renderItems();
  updatePreview();
  showNotif(`${profile.name} format applied`, 'success');
}

function updateCountryFormatTooltip() {
  const format = getDocumentFormat();
  const note = format?.note || '';
  ['country-select','top-country-select'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.title = note;
  });
}

function buildCurrencySelect() {
  const select = document.getElementById('currency-select');
  if (!select) return;
  let codes = FALLBACK_CURRENCIES;
  try {
    if (Intl.supportedValuesOf) codes = Intl.supportedValuesOf('currency');
  } catch {}
  select.innerHTML = codes.map(code => `<option value="${code}">${code}</option>`).join('');
  select.value = S.currency || getCountryProfile().currency;
}

function setCurrency(currency) {
  S.currency = currency || getCountryProfile().currency;
  syncLocaleControls();
  updateTotals();
  updatePreview();
}

function setLanguage(lang) {
  S.lang = I18N[lang] ? lang : getCountryProfile().lang;
  syncLocaleControls();
  updatePreview();
}

function setDocType(type) {
  setDocVariant(type, S.docSector || 'batiment');
}

function setDocVariant(type, sector='batiment') {
  if (sector === 'online') type = 'facture';
  S.docType = type;
  S.docSector = sector;
  ['facture','devis'].forEach(t => {
    const heroBtn = document.getElementById('hero-tab-'+t);
    const topBtn = document.getElementById('tab-'+t);
    if (heroBtn) heroBtn.classList.toggle('active', t === type);
    if (topBtn) {
      topBtn.classList.toggle('btn-primary', t === type);
      topBtn.classList.toggle('btn-ghost', t !== type);
    }
  });
  positionRailPill();
  const num = document.getElementById('f-number');
  if (num) num.value = getDefaultDocNumber(type, sector);
  const dueGroup = document.getElementById('due-date-group');
  if (dueGroup) dueGroup.style.display = type === 'devis' ? '' : 'none';
  applyCountryDocumentFormat();
  renderDocVariant();
  updatePreview();
}

function positionRailPill() {
  const pill = document.getElementById('railPill');
  const activeBtn = document.getElementById('tab-' + S.docType);
  const rail = document.getElementById('tool-rail');
  if (!pill || !activeBtn || !rail) return;
  const railRect = rail.getBoundingClientRect();
  const btnRect = activeBtn.getBoundingClientRect();
  pill.style.width = btnRect.width + 'px';
  pill.style.height = btnRect.height + 'px';
  pill.style.transform = `translate(${btnRect.left - railRect.left}px, ${btnRect.top - railRect.top}px)`;
  pill.classList.add('ready');
}
window.addEventListener('resize', () => positionRailPill());

function getDocumentFormat() {
  if (S.docType === 'facture' && S.docSector === 'online') {
    const country = COUNTRY_FORMATS[S.country] || COUNTRY_FORMATS.FR;
    return {
      layout:'card',
      margins:[8,14,8,14],
      note:`Standard online seller : Amazon, eBay, Etsy, Shopify, Fiverr, Upwork. ${country.note}`
    };
  }
  return COUNTRY_FORMATS[S.country] || COUNTRY_FORMATS.FR;
}

function applyCountryDocumentFormat() {
  const format = getDocumentFormat();
  const layoutIndex = LAYOUTS.findIndex(l => l.id === format.layout);
  if (layoutIndex >= 0 && S.layoutIdx !== layoutIndex) {
    S.layoutIdx = layoutIndex;
    buildLayoutGrid();
  }
  const ids = ['m-top','m-right','m-bottom','m-left'];
  (format.margins || []).forEach((val, i) => {
    const el = document.getElementById(ids[i]);
    if (el) el.value = val;
  });
  renderFormatNote();
  updateCountryFormatTooltip();
}

function renderFormatNote() {
}

function getDefaultDocNumber(type, sector) {
  const profile = getCountryProfile();
  const prefix = profile.docPrefix[type] || (type === 'facture' ? 'FAC' : 'DEV');
  const suffix = sector === 'automobile' ? 'AUTO' : (sector === 'online' ? 'MKT' : 'BAT');
  return `${prefix}-${suffix}-${new Date().getFullYear()}-001`;
}

function renderDocVariant() {
  ['facture-batiment','facture-automobile','facture-online','devis-batiment','devis-automobile'].forEach(key => {
    const btn = document.getElementById('variant-'+key);
    if (!btn) return;
    const [type, sector] = key.split('-');
    const active = S.docType === type && S.docSector === sector;
    btn.classList.toggle('btn-primary', active);
    btn.classList.toggle('btn-ghost', !active);
  });
  const vehicleCard = document.getElementById('vehicle-card');
  if (vehicleCard) vehicleCard.style.display = S.docSector === 'automobile' ? '' : 'none';
  const onlineCard = document.getElementById('online-card');
  if (onlineCard) onlineCard.style.display = S.docType === 'facture' && S.docSector === 'online' ? '' : 'none';
  syncSectorUi();
}

// ═══════════════════════════════════════════════════════
// LAYOUT GRID
// ═══════════════════════════════════════════════════════
function buildLayoutGrid() {
  const grid = document.getElementById('layout-grid');
  grid.innerHTML = LAYOUTS.map((l,i) => `
    <div class="layout-card${i===S.layoutIdx?' active':''}" onclick="selectLayout(${i})">
      <div class="layout-icon">${l.icon}</div>
      <div class="layout-name">${l.label}</div>
      <div class="layout-desc">${l.desc}</div>
    </div>
  `).join('');
}

function selectLayout(i) {
  S.layoutIdx = i;
  document.querySelectorAll('.layout-card').forEach((c,j) => c.classList.toggle('active', j===i));
  updatePreview();
}

// ═══════════════════════════════════════════════════════
// THEME GRID
// ═══════════════════════════════════════════════════════
function buildThemeGrid() {
  const grid = document.getElementById('theme-grid');
  grid.innerHTML = THEMES.map((t,i) => `
    <div class="theme-card${i===S.themeIdx?' active':''}" onclick="selectTheme(${i})">
      <div class="theme-bars">${t.preview.map(c=>`<div class="theme-bar" style="background:${c}"></div>`).join('')}</div>
      <div class="theme-name">${t.name}</div>
    </div>
  `).join('');
}

function selectTheme(i) {
  S.themeIdx = i;
  document.querySelectorAll('.theme-card').forEach((c,j) => c.classList.toggle('active', j===i));
  updatePreview();
}

function buildTemplateGallery() {
  const grid = document.getElementById('template-gallery');
  if (!grid) return;
  grid.innerHTML = QUICK_TEMPLATES.map((tpl, i) => `
    <div class="template-card" onclick="applyQuickTemplate(${i})">
      <div class="template-mini" style="--tp:${tpl.p};--ta:${tpl.a}"><div></div><div></div><div></div></div>
      <strong>${escHtml(tpl.name)}</strong>
      <span>${escHtml(tpl.desc)}</span>
    </div>
  `).join('');
}

function applyQuickTemplate(i) {
  const tpl = QUICK_TEMPLATES[i] || QUICK_TEMPLATES[0];
  S.layoutIdx = tpl.layout;
  S.themeIdx = tpl.theme;
  selectLayout(S.layoutIdx);
  selectTheme(S.themeIdx);
  document.querySelectorAll('#template-gallery .template-card').forEach((card, idx) => card.classList.toggle('active', idx === i));
  showNotif(`${tpl.name} template appliqué`, 'success');
}

function buildOnlineStyleGallery() {
  const grid = document.getElementById('online-style-gallery');
  if (!grid) return;
  grid.innerHTML = ONLINE_STYLES.map((style, i) => `
    <div class="template-card${S.onlineStyleIdx===i?' active':''}" onclick="applyOnlineStyle(${i})">
      <div class="template-mini" style="--tp:${style.p};--ta:${style.a}"><div></div><div></div><div></div></div>
      <strong>${escHtml(style.name)}</strong>
      <span>${escHtml(style.desc)}</span>
    </div>
  `).join('');
}

function applyOnlineStyle(i) {
  const style = ONLINE_STYLES[i] || ONLINE_STYLES[0];
  S.onlineStyleIdx = i;
  S.docType = 'facture';
  S.docSector = 'online';
  S.layoutIdx = style.layout;
  S.themeIdx = style.theme;
  selectLayout(S.layoutIdx);
  selectTheme(S.themeIdx);
  renderDocVariant();
  showNotif(`${style.name} online style appliqué`, 'success');
}

// ═══════════════════════════════════════════════════════
// FONT LIST
// ═══════════════════════════════════════════════════════
function buildFontCats() {
  const cats = ['Tous', ...new Set(FONTS.map(f=>f.cat))];
  const el = document.getElementById('font-cats');
  el.innerHTML = cats.map(c=>`<button class="font-cat-btn${c==='Tous'?' active':''}" onclick="setFontCat('${c}')">${c}</button>`).join('');
}

function setFontCat(cat) {
  S.fontCat = cat;
  document.querySelectorAll('.font-cat-btn').forEach(b => b.classList.toggle('active', b.textContent.trim() === cat || (cat === 'Tous' && b.textContent === 'Tous')));
  buildFontList();
}

function buildFontList() {
  const visible = S.fontCat === 'Tous' ? FONTS : FONTS.filter(f=>f.cat===S.fontCat);
  const el = document.getElementById('font-list');
  el.innerHTML = visible.map(f => {
    const gi = FONTS.findIndex(x=>x.name===f.name);
    return `
      <div class="font-item${S.fontIdx===gi?' active':''}" onclick="selectFont(${gi})">
        <span class="font-name" style="font-family:'${f.name}',system-ui;font-weight:${S.boldTitle?700:400}">${f.name}</span>
        <span class="font-tag">${f.cat}</span>
      </div>`;
  }).join('');
}

function selectFont(i) {
  S.fontIdx = i;
  buildFontList();
  updatePreview();
}

// ═══════════════════════════════════════════════════════
// PAGE COLOR GRID
// ═══════════════════════════════════════════════════════
function buildPageColorGrid() {
  const grid = document.getElementById('page-color-grid');
  grid.innerHTML = PAGE_COLORS.map((c,i) => `
    <div class="page-color-item${i===0?' active':''}" onclick="selectPageColor(${i})">
      <div class="page-color-dot" style="background:${c.bg}"></div>
      <div>
        <div style="font-size:11px;font-weight:600;color:${i===S.pageColorIdx?'#a5b4fc':'#64748b'}">${c.name}</div>
        <div style="font-size:9px;color:#475569;font-family:monospace">${c.bg}</div>
      </div>
    </div>
  `).join('');
}

function selectPageColor(i) {
  S.pageColorIdx = i;
  document.querySelectorAll('.page-color-item').forEach((c,j) => c.classList.toggle('active', j===i));
  updatePreview();
}

// ═══════════════════════════════════════════════════════
// FONT COLOR GRID
// ═══════════════════════════════════════════════════════
function buildFontColorGrid() {
  const grid = document.getElementById('font-color-grid');
  grid.innerHTML = FONT_COLORS.map((c,i) => `
    <div class="color-swatch${i===0?' active':''}" style="background:${c.val};border:${i===0?'3px solid #a5b4fc':'2px solid rgba(255,255,255,0.1)'}" title="${c.name}" onclick="selectFontColor(${i})"></div>
  `).join('');
}

function selectFontColor(i) {
  S.fontColorIdx = i;
  document.querySelectorAll('.color-swatch').forEach((c,j) => {
    c.classList.toggle('active', j===i);
    c.style.border = j===i ? '3px solid #a5b4fc' : '2px solid rgba(255,255,255,0.1)';
  });
  const fc = FONT_COLORS[i];
  document.getElementById('font-color-dot').style.background = fc.val;
  document.getElementById('font-color-name').textContent = fc.name;
  document.getElementById('font-color-hex').textContent = fc.val;
  updatePreview();
}

// ═══════════════════════════════════════════════════════
// TOGGLES
// ═══════════════════════════════════════════════════════
function toggleTVA() {
  S.tva = !S.tva;
  const btn = document.getElementById('tva-toggle');
  btn.className = 'toggle ' + (S.tva ? 'on' : 'off');
  document.getElementById('tva-exempt-msg').style.display = S.tva ? 'none' : 'block';
  updateTotals(); updatePreview();
}

function toggleBold(which) {
  const map = { title:'boldTitle', labels:'boldLabels', amounts:'boldAmounts', italic:'italic' };
  const idMap = { title:'bold-title-toggle', labels:'bold-labels-toggle', amounts:'bold-amounts-toggle', italic:'italic-toggle' };
  S[map[which]] = !S[map[which]];
  const btn = document.getElementById(idMap[which]);
  btn.className = 'toggle ' + (S[map[which]] ? 'on' : 'off');
  buildFontList();
  updatePreview();
}

function toggleExtra(which) {
  const map = { pagenum:'pageNumbers', signature:'signature', qrcode:'qrCode' };
  const idMap = { pagenum:'pn-toggle', signature:'sig-toggle', qrcode:'qr-toggle' };
  S[map[which]] = !S[map[which]];
  const btn = document.getElementById(idMap[which]);
  btn.className = 'toggle ' + (S[map[which]] ? 'on' : 'off');
  updatePreview();
}

// ═══════════════════════════════════════════════════════
// QUICK ACTIONS
// ═══════════════════════════════════════════════════════
function collectDraft() {
  syncItemsFromForm();
  const fields = {};
  document.querySelectorAll('.sidebar input[id], .sidebar textarea[id], .sidebar select[id]').forEach(el => {
    if (el.type === 'file') return;
    fields[el.id] = el.value;
  });
  return {
    savedAt: new Date().toISOString(),
    fields,
    state: {
      docType: S.docType,
      docSector: S.docSector,
      country: S.country,
      lang: S.lang,
      currency: S.currency,
      themeIdx: S.themeIdx,
      fontIdx: S.fontIdx,
      fontCat: S.fontCat,
      fontColorIdx: S.fontColorIdx,
      pageColorIdx: S.pageColorIdx,
      layoutIdx: S.layoutIdx,
      boldTitle: S.boldTitle,
      boldLabels: S.boldLabels,
      boldAmounts: S.boldAmounts,
      italic: S.italic,
      tva: S.tva,
      logoSrc: S.logoSrc,
      logoPos: S.logoPos,
      logoSize: S.logoSize,
      watermark: S.watermark,
      stamp: S.stamp,
      companyStampSrc: S.companyStampSrc,
      companyStampSize: S.companyStampSize,
      companyStampOpacity: S.companyStampOpacity,
      pageNumbers: S.pageNumbers,
      signature: S.signature,
      signatureSrc: S.signatureSrc,
      signatureSize: S.signatureSize,
      qrCode: S.qrCode,
      items: S.items,
    }
  };
}

function saveDraft() {
  try {
    localStorage.setItem('facturepro-draft', JSON.stringify(collectDraft()));
    showNotif('Brouillon sauvegardé', 'success');
  } catch {
    showNotif('Impossible de sauvegarder ce brouillon', 'info');
  }
}

function loadDraft() {
  let draft = null;
  try { draft = JSON.parse(localStorage.getItem('facturepro-draft') || 'null'); } catch {}
  if (!draft) { showNotif('Aucun brouillon sauvegardé', 'info'); return; }
  Object.entries(draft.fields || {}).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el && el.type !== 'file') el.value = value;
  });
  Object.assign(S, draft.state || {});
  S.country = COUNTRY_PROFILES[S.country] ? S.country : 'FR';
  S.lang = I18N[S.lang] ? S.lang : getCountryProfile().lang;
  syncLocaleControls();
  S.items = (draft.state?.items || []).map(item => ({ ...item }));
  itemId = S.items.reduce((max, item) => Math.max(max, item.id || 0), 0);
  buildLayoutGrid();
  selectLayout(S.layoutIdx);
  buildThemeGrid();
  selectTheme(S.themeIdx);
  buildFontCats();
  buildFontList();
  buildPageColorGrid();
  buildFontColorGrid();
  renderItems();
  renderToggleStates();
  renderLogoState();
  renderCompanyStampState();
  renderSignatureImageState();
  renderDocVariant();
  updatePreview();
  showNotif('Brouillon chargé', 'success');
}

function renderToggleStates() {
  const toggles = {
    'tva-toggle': S.tva,
    'bold-title-toggle': S.boldTitle,
    'bold-labels-toggle': S.boldLabels,
    'bold-amounts-toggle': S.boldAmounts,
    'italic-toggle': S.italic,
    'pn-toggle': S.pageNumbers,
    'sig-toggle': S.signature,
    'qr-toggle': S.qrCode,
  };
  Object.entries(toggles).forEach(([id, on]) => {
    const btn = document.getElementById(id);
    if (btn) btn.className = 'toggle ' + (on ? 'on' : 'off');
  });
  const exempt = document.getElementById('tva-exempt-msg');
  if (exempt) exempt.style.display = S.tva ? 'none' : 'block';
  const quickStamp = document.getElementById('quick-stamp-select');
  if (quickStamp) quickStamp.value = S.stamp || 'none';
}

function renderLogoState() {
  const img = document.getElementById('logo-preview');
  const placeholder = document.getElementById('logo-placeholder');
  const actions = document.getElementById('logo-actions');
  const size = document.getElementById('logo-size-range');
  const label = document.getElementById('logo-size-val');
  if (img) {
    img.src = S.logoSrc || '';
    img.style.display = S.logoSrc ? 'block' : 'none';
  }
  if (placeholder) placeholder.style.display = S.logoSrc ? 'none' : '';
  if (actions) actions.style.display = S.logoSrc ? 'block' : 'none';
  if (size) size.value = S.logoSize || 80;
  if (label) label.textContent = S.logoSize || 80;
  setLogoPos(S.logoPos || 'left');
}

function renderCompanyStampState() {
  const img = document.getElementById('company-stamp-preview');
  const placeholder = document.getElementById('company-stamp-placeholder');
  const actions = document.getElementById('company-stamp-actions');
  const size = document.getElementById('company-stamp-size-range');
  const sizeLabel = document.getElementById('company-stamp-size-val');
  const opacity = document.getElementById('company-stamp-opacity-range');
  const opacityLabel = document.getElementById('company-stamp-opacity-val');
  if (img) {
    img.src = S.companyStampSrc || '';
    img.style.display = S.companyStampSrc ? 'block' : 'none';
  }
  if (placeholder) placeholder.style.display = S.companyStampSrc ? 'none' : '';
  if (actions) actions.style.display = S.companyStampSrc ? 'block' : 'none';
  if (size) size.value = S.companyStampSize || 115;
  if (sizeLabel) sizeLabel.textContent = S.companyStampSize || 115;
  if (opacity) opacity.value = S.companyStampOpacity || 90;
  if (opacityLabel) opacityLabel.textContent = S.companyStampOpacity || 90;
}

function renderSignatureImageState() {
  const img = document.getElementById('signature-preview');
  const placeholder = document.getElementById('signature-placeholder');
  const actions = document.getElementById('signature-actions');
  const size = document.getElementById('signature-size-range');
  const label = document.getElementById('signature-size-val');
  if (img) {
    img.src = S.signatureSrc || '';
    img.style.display = S.signatureSrc ? 'block' : 'none';
  }
  if (placeholder) placeholder.style.display = S.signatureSrc ? 'none' : '';
  if (actions) actions.style.display = S.signatureSrc ? 'block' : 'none';
  if (size) size.value = S.signatureSize || 135;
  if (label) label.textContent = S.signatureSize || 135;
}

function duplicateDocument() {
  const num = document.getElementById('f-number');
  if (num) num.value = `${num.value || 'DOCUMENT'}-COPIE`;
  setWatermark('COPIE');
  updatePreview();
  showNotif('Document dupliqué', 'success');
}

function resetDocument() {
  localStorage.removeItem('facturepro-draft');
  document.querySelectorAll('.sidebar input[id], .sidebar textarea[id]').forEach(el => {
    if (el.type !== 'file') el.value = '';
  });
  S.items = [];
  itemId = 0;
  addRow();
  setDocVariant('facture', 'batiment');
  setWatermark('');
  setStamp('none');
  S.companyStampSrc = null;
  S.signatureSrc = null;
  S.signature = false;
  renderCompanyStampState();
  renderSignatureImageState();
  renderToggleStates();
  updatePreview();
  showNotif('Document réinitialisé', 'info');
}

function emailDraft() {
  syncItemsFromForm();
  const docNum = document.getElementById('f-number')?.value || 'document';
  const clientEmail = document.getElementById('c-email')?.value || '';
  const bodyText = getLangPack().emailBody
    .replace('{doc}', docNum)
    .replace('{total}', fmtEur(getGrandTotal()));
  const body = encodeURIComponent(bodyText);
  window.location.href = `mailto:${encodeURIComponent(clientEmail)}?subject=${encodeURIComponent(docNum)}&body=${body}`;
}

async function emailPdf() {
  syncItemsFromForm();
  updatePreview();
  await new Promise(resolve => requestAnimationFrame(resolve));

  if (typeof html2pdf === 'undefined' && (typeof html2canvas === 'undefined' || !window.jspdf?.jsPDF)) {
    emailDraft();
    showNotif('PDF non disponible. Email simple ouvert.', 'info');
    return;
  }

  const source = document.getElementById('invoice-preview');
  const el = buildPdfClone(source);
  const docNum = document.getElementById('f-number')?.value || 'document';
  const clientEmail = document.getElementById('c-email')?.value || '';
  const bodyText = getLangPack().emailBody
    .replace('{doc}', docNum)
    .replace('{total}', fmtEur(getGrandTotal()));

  try {
    const blob = await createInvoicePdfBlob(el);
    const filename = `${docNum}.pdf`;
    const file = new File([blob], filename, { type: 'application/pdf' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: docNum, text: bodyText });
      recordDocumentHistory('email');
      showNotif('PDF prêt à envoyer par email', 'success');
    } else {
      downloadBlob(blob, filename);
      recordDocumentHistory('email');
      window.location.href = `mailto:${encodeURIComponent(clientEmail)}?subject=${encodeURIComponent(docNum)}&body=${encodeURIComponent(bodyText + '\n\nPDF téléchargé : ajoutez le fichier en pièce jointe.')}`;
      showNotif('PDF téléchargé. Ajoutez-le à votre email.', 'info');
    }
  } catch(e) {
    emailDraft();
    showNotif('PDF email impossible. Email simple ouvert.', 'info');
  } finally {
    el.parentElement?.remove();
  }
}

async function copyTotal() {
  const text = fmtEur(getGrandTotal());
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  showNotif(`Total copié : ${text}`, 'success');
}

function getGrandTotal() {
  const subtotal = S.items.reduce((s,i) => s + cleanNumber(i.qty) * cleanNumber(i.price), 0);
  const tvaAmt = S.tva ? S.items.reduce((s,i) => s + cleanNumber(i.qty) * cleanNumber(i.price) * (cleanNumber(i.tvaRate) / 100), 0) : 0;
  return subtotal + tvaAmt;
}

// ═══════════════════════════════════════════════════════
// LOGO
// ═══════════════════════════════════════════════════════
function handleLogo(e) {
  const file = e.target.files[0]; if (!file) return;
  if (file.size > 2*1024*1024) { showNotif('Le fichier est trop lourd (max 2MB)', 'info'); return; }
  const reader = new FileReader();
  reader.onload = ev => {
    S.logoSrc = ev.target.result;
    document.getElementById('logo-preview').src = S.logoSrc;
    document.getElementById('logo-preview').style.display = 'block';
    document.getElementById('logo-placeholder').style.display = 'none';
    document.getElementById('logo-actions').style.display = 'block';
    updatePreview();
  };
  reader.readAsDataURL(file);
}

function removeLogo() {
  S.logoSrc = null;
  document.getElementById('logo-preview').src = '';
  document.getElementById('logo-preview').style.display = 'none';
  document.getElementById('logo-placeholder').style.display = '';
  document.getElementById('logo-actions').style.display = 'none';
  document.getElementById('logo-file').value = '';
  updatePreview();
}

function setLogoPos(pos) {
  S.logoPos = pos;
  ['left','center','right'].forEach(p => {
    const btn = document.getElementById('lpos-'+p);
    btn.className = 'btn btn-sm ' + (p===pos ? 'btn-primary' : 'btn-ghost');
  });
  updatePreview();
}

function readUploadImage(e, done) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 2*1024*1024) {
    showNotif('Le fichier est trop lourd (max 2MB)', 'info');
    e.target.value = '';
    return;
  }
  if (!file.type.startsWith('image/')) {
    showNotif('Ajoutez une image PNG, JPG, WebP ou SVG', 'info');
    e.target.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = ev => done(ev.target.result);
  reader.readAsDataURL(file);
}

function handleCompanyStamp(e) {
  readUploadImage(e, src => {
    S.companyStampSrc = src;
    renderCompanyStampState();
    updatePreview();
    showNotif('Cachet société ajouté au document', 'success');
  });
}

function removeCompanyStamp() {
  S.companyStampSrc = null;
  const input = document.getElementById('company-stamp-file');
  if (input) input.value = '';
  renderCompanyStampState();
  updatePreview();
}

function handleSignatureImage(e) {
  readUploadImage(e, src => {
    S.signatureSrc = src;
    S.signature = true;
    renderSignatureImageState();
    renderToggleStates();
    updatePreview();
    showNotif('Signature ajoutée au document', 'success');
  });
}

function removeSignatureImage() {
  S.signatureSrc = null;
  const input = document.getElementById('signature-file');
  if (input) input.value = '';
  renderSignatureImageState();
  updatePreview();
}

// ═══════════════════════════════════════════════════════
// WATERMARK & STAMP
// ═══════════════════════════════════════════════════════
function setWatermark(val) {
  S.watermark = val;
  document.getElementById('watermark-text').value = val;
  updatePreview();
}

function setStamp(val) {
  S.stamp = val;
  const quickStamp = document.getElementById('quick-stamp-select');
  if (quickStamp) quickStamp.value = val;
  ['none','paid','draft','conf'].forEach(s => {
    const btn = document.getElementById('stamp-'+s);
    if (btn) btn.className = 'btn btn-sm ' + (s===val ? 'btn-primary' : 'btn-ghost');
  });
  updatePreview();
}

// ═══════════════════════════════════════════════════════
// LINE ITEMS
// ═══════════════════════════════════════════════════════
function addRow(desc='', qty=1, unit='forfait', price=0, tvaRate=getCountryProfile().taxRate) {
  const id = ++itemId;
  S.items.push({ id, desc, qty, unit, price, tvaRate });
  renderItems();
}

function removeRow(id) {
  S.items = S.items.filter(i=>i.id!==id);
  renderItems();
}

function renderItems() {
  const container = document.getElementById('items-body');
  const profile = getCountryProfile();
  const L = getLangPack();
  container.innerHTML = S.items.map((item, idx) => `
    <div style="border-radius:13px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.08);overflow:hidden">

      <!-- Card header -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 14px;background:rgba(255,255,255,0.02);border-bottom:1px solid rgba(255,255,255,0.06)">
        <span style="font-size:10px;font-weight:700;color:var(--ink-dim);text-transform:uppercase;letter-spacing:.07em;display:flex;align-items:center;gap:6px">
          <span style="background:rgba(99,102,241,.15);color:#a5b4fc;border-radius:5px;padding:2px 8px;font-size:10px">${idx+1}</span>
          Article
        </span>
        <div style="display:flex;align-items:center;gap:10px">
          <span id="item-total-pill-${item.id}" style="font-size:13px;font-weight:700;color:#f1f5f9">${fmtEur(item.qty*item.price)}</span>
          <button class="delete-row" onclick="removeRow(${item.id})" style="padding:3px 10px;border-radius:7px;font-size:11px;font-weight:600;border:1px solid rgba(239,68,68,.25);background:rgba(239,68,68,.08);color:#f87171">✕ Supprimer</button>
        </div>
      </div>

      <!-- Description — large textarea -->
      <div style="padding:13px 14px 0">
        <label style="font-size:9px;font-weight:700;color:var(--ink-dim);text-transform:uppercase;letter-spacing:.07em;display:block;margin-bottom:6px">Description de la prestation</label>
        <textarea
          rows="3"
          oninput="updateItem(${item.id},'desc',this.value)"
          data-item-id="${item.id}"
          data-field="desc"
          placeholder="Décrivez en détail votre prestation, matériaux utilisés, conditions d'exécution…"
          style="width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:11px 13px;font-size:13px;color:var(--ink);font-family:inherit;outline:none;resize:vertical;min-height:76px;line-height:1.6;letter-spacing:.01em;transition:border-color .15s"
          onfocus="this.style.borderColor='rgba(99,102,241,.6)'" onblur="this.style.borderColor='rgba(255,255,255,.1)'"
        >${escHtml(item.desc)}</textarea>
      </div>

      <!-- Numeric fields row -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;gap:8px;padding:10px 14px 14px">
        ${[
          { label:L.qty, val:item.qty, type:'number', field:'qty', step:'0.01', suffix:'' },
          { label:L.unit, val:item.unit, type:'text', field:'unit', step:'', suffix:'' },
          { label:L.unitPrice, val:item.price, type:'number', field:'price', step:'0.01', suffix:profile.symbol },
          { label:profile.taxName, val:item.tvaRate, type:'number', field:'tvaRate', step:'1', suffix:'%' },
        ].map(f => `
          <div>
            <label style="font-size:9px;font-weight:700;color:var(--ink-dim);text-transform:uppercase;letter-spacing:.07em;display:block;margin-bottom:5px">${f.label}</label>
            <div style="position:relative">
              <input type="${f.type}" value="${escHtml(String(f.val))}" ${f.step?'step="'+f.step+'"':''} ${f.type==='number'?'min="0"':''}
                data-item-id="${item.id}"
                data-field="${f.field}"
                oninput="updateItem(${item.id},'${f.field}',this.value)"
                style="width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:8px ${f.suffix?'24px':'10px'} 8px 10px;font-size:13px;font-weight:500;color:var(--ink);font-family:inherit;outline:none"
              >
              ${f.suffix?`<span style="position:absolute;right:8px;top:50%;transform:translateY(-50%);font-size:11px;color:var(--ink-dim);font-weight:600">${f.suffix}</span>`:''}
            </div>
          </div>`).join('')}
        <div>
          <label style="font-size:9px;font-weight:700;color:var(--ink-dim);text-transform:uppercase;letter-spacing:.07em;display:block;margin-bottom:5px">${L.lineTotal}</label>
          <div style="position:relative">
            <input id="item-total-box-${item.id}" type="number" min="0" step="0.01" value="${Number(item.qty*item.price).toFixed(2)}"
              data-item-id="${item.id}"
              data-field="lineTotal"
              oninput="updateItem(${item.id},'lineTotal',this.value)"
              style="width:100%;background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.2);border-radius:8px;padding:8px 24px 8px 10px;font-size:13px;font-weight:700;color:#a5b4fc;font-family:inherit;outline:none"
            >
            <span style="position:absolute;right:8px;top:50%;transform:translateY(-50%);font-size:11px;color:var(--ink-dim);font-weight:600">${profile.symbol}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');
  updateTotals();
  updatePreview();
}

function updateItem(id, field, val) {
  const item = S.items.find(i=>i.id===id);
  if (!item) return;
  if (field === 'lineTotal') {
    const lineTotal = cleanNumber(val);
    if (cleanNumber(item.qty) <= 0) item.qty = 1;
    item.price = lineTotal / cleanNumber(item.qty);
    updateLinePriceInput(id);
  } else {
    item[field] = ['qty','price','tvaRate'].includes(field) ? cleanNumber(val) : val;
  }
  updateRowTotal(id);
  updateTotals();
  updatePreview();
}

function cleanNumber(val) {
  if (val === '' || val === null || Number.isNaN(Number(val))) return 0;
  return Math.max(0, Number(val));
}

function updateRowTotal(id) {
  const item = S.items.find(i=>i.id===id);
  if (!item) return;
  const total = fmtEur(item.qty * item.price);
  const rawTotal = Number(item.qty * item.price).toFixed(2);
  const pill = document.getElementById(`item-total-pill-${id}`);
  const box = document.getElementById(`item-total-box-${id}`);
  if (pill) pill.textContent = total;
  if (box && document.activeElement !== box) box.value = rawTotal;
}

function updateLinePriceInput(id) {
  const input = document.querySelector(`#items-body [data-item-id="${id}"][data-field="price"]`);
  const item = S.items.find(i=>i.id===id);
  if (input && item && document.activeElement !== input) input.value = formatPlainNumber(item.price);
}

function formatPlainNumber(n) {
  const value = cleanNumber(n);
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function syncItemsFromForm() {
  document.querySelectorAll('#items-body [data-item-id][data-field]').forEach(input => {
    const id = Number(input.dataset.itemId);
    const field = input.dataset.field;
    const item = S.items.find(i => i.id === id);
    if (!item) return;
    if (field === 'lineTotal') {
      const total = cleanNumber(input.value);
      if (cleanNumber(item.qty) <= 0) item.qty = 1;
      item.price = total / cleanNumber(item.qty);
    } else {
      item[field] = ['qty','price','tvaRate'].includes(field) ? cleanNumber(input.value) : input.value;
    }
  });
}

function applyBulkItemValue(type) {
  const idMap = { tva:'bulk-tva', price:'bulk-price', total:'bulk-total' };
  const input = document.getElementById(idMap[type]);
  const value = cleanNumber(input?.value);
  if (!input || input.value === '') {
    showNotif('Valeur manquante', 'info');
    return;
  }

  if (type === 'tva') {
    S.tva = true;
    S.items.forEach(item => { item.tvaRate = value; });
    renderToggleStates();
    showNotif(`TVA ${value}% appliquée à toutes les lignes`, 'success');
  }
  if (type === 'price') {
    S.items.forEach(item => { item.price = value; });
    showNotif(`Prix unitaire ${fmtEur(value)} appliqué à toutes les lignes`, 'success');
  }
  if (type === 'total') {
    S.items.forEach(item => {
      if (cleanNumber(item.qty) <= 0) item.qty = 1;
      item.price = value / cleanNumber(item.qty);
    });
    showNotif(`Total HT ${fmtEur(value)} appliqué à chaque ligne`, 'success');
  }

  renderItems();
  updateTotals();
  updatePreview();
}

function updateTotals() {
  const profile = getCountryProfile();
  const L = getLangPack();
  const subtotal = S.items.reduce((s,i) => s + i.qty*i.price, 0);
  const tvaAmt   = S.tva ? S.items.reduce((s,i) => s + i.qty*i.price*(i.tvaRate/100), 0) : 0;
  const total    = subtotal + tvaAmt;
  const el = document.getElementById('totals-display');
  if (!el) return;
  el.innerHTML = `
    <div style="max-width:220px;margin-left:auto">
      <div class="totals-row"><span>${L.subtotal}</span><span>${fmtEur(subtotal)}</span></div>
      ${S.tva ? `<div class="totals-row"><span>${profile.taxName}</span><span>${fmtEur(tvaAmt)}</span></div>` : ''}
      <div class="totals-total" style="background:${THEMES[S.themeIdx].p};border-radius:7px;color:#fff;margin-top:4px">
        <span style="font-weight:700">${L.total}</span>
        <span style="font-size:15px;font-weight:800">${fmtEur(total)}</span>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════
// PREVIEW RENDER
// ═══════════════════════════════════════════════════════
function updatePreview() {
  const profile   = getCountryProfile();
  const L         = getLangPack();
  const theme     = THEMES[S.themeIdx];
  const font      = FONTS[S.fontIdx];
  const pageColor = PAGE_COLORS[S.pageColorIdx];
  const fontColor = FONT_COLORS[S.fontColorIdx];
  const layout    = LAYOUTS[S.layoutIdx];
  const mt        = +( document.getElementById('m-top')?.value||5);
  const mr        = +( document.getElementById('m-right')?.value||15);
  const mb        = +( document.getElementById('m-bottom')?.value||5);
  const ml        = +( document.getElementById('m-left')?.value||15);
  const fs        = +( document.getElementById('font-size-range')?.value||12);
  const logoSz    = +( document.getElementById('logo-size-range')?.value||80);
  const companyStampSize = +(document.getElementById('company-stamp-size-range')?.value || S.companyStampSize || 115);
  const companyStampOpacity = +(document.getElementById('company-stamp-opacity-range')?.value || S.companyStampOpacity || 90);
  const signatureSize = +(document.getElementById('signature-size-range')?.value || S.signatureSize || 135);
  const wm        = document.getElementById('watermark-text')?.value || S.watermark;
  S.logoSize = logoSz;
  S.companyStampSize = companyStampSize;
  S.companyStampOpacity = companyStampOpacity;
  S.signatureSize = signatureSize;

  const docSectorLabel = profile.sector[S.docSector] || (S.docSector === 'automobile' ? 'AUTOMOTIVE' : (S.docSector === 'online' ? 'FREELANCE / MARKETPLACE' : 'BUILDING'));
  const docLabel  = `${S.docType === 'facture' ? L.invoice : L.quote} ${docSectorLabel}`;
  const docNum    = document.getElementById('f-number')?.value || '';
  const fDate     = fmtDate(document.getElementById('f-date')?.value);
  const fDue      = fmtDate(document.getElementById('f-due')?.value);
  const fObj      = document.getElementById('f-object')?.value || '';
  const vTransaction = document.getElementById('v-transaction')?.value || '';
  const vVin      = document.getElementById('v-vin')?.value || '';
  const vPlate    = document.getElementById('v-plate')?.value || '';
  const vMake     = document.getElementById('v-make')?.value || '';
  const vModel    = document.getElementById('v-model')?.value || '';
  const vYear     = document.getElementById('v-year')?.value || '';
  const vMileage  = document.getElementById('v-mileage')?.value || '';
  const vFirstReg = fmtDate(document.getElementById('v-first-reg')?.value);
  const vColor    = document.getElementById('v-color')?.value || '';
  const vDetails  = document.getElementById('v-details')?.value || '';
  const oPlatform = document.getElementById('o-platform')?.value || '';
  const oOrderId  = document.getElementById('o-order-id')?.value || '';
  const oBuyerRef = document.getElementById('o-buyer-ref')?.value || '';
  const oSku      = document.getElementById('o-sku')?.value || '';
  const oCategory = document.getElementById('o-category')?.value || '';
  const oPayment  = document.getElementById('o-payment')?.value || '';
  const oShipping = document.getElementById('o-shipping')?.value || '';
  const oFees     = document.getElementById('o-fees')?.value || '';
  const oNotes    = document.getElementById('o-notes')?.value || '';

  const eName     = document.getElementById('e-name')?.value || '';
  const eStatus   = document.getElementById('e-status')?.value || '';
  const eSiret    = document.getElementById('e-siret')?.value || '';
  const eAddr     = document.getElementById('e-addr')?.value || '';
  const eEmail    = document.getElementById('e-email')?.value || '';
  const eTel      = document.getElementById('e-tel')?.value || '';
  const eIban     = document.getElementById('e-iban')?.value || '';
  const eBic      = document.getElementById('e-bic')?.value || '';
  const eRib      = document.getElementById('e-rib')?.value || '';

  const cName     = document.getElementById('c-name')?.value || '';
  const cSiret    = document.getElementById('c-siret')?.value || '';
  const cAddr     = document.getElementById('c-addr')?.value || '';
  const cSiteAddr = document.getElementById('c-site-addr')?.value || '';
  const cEmail    = document.getElementById('c-email')?.value || '';
  const cTel      = document.getElementById('c-tel')?.value || '';

  const fNotes    = document.getElementById('f-notes')?.value || '';

  const subtotal  = S.items.reduce((s,i) => s+i.qty*i.price, 0);
  const tvaAmt    = S.tva ? S.items.reduce((s,i) => s+i.qty*i.price*(i.tvaRate/100), 0) : 0;
  const total     = subtotal + tvaAmt;

  // Update info bar
  const infoBar = document.getElementById('preview-info');
  if (infoBar) infoBar.textContent = `${font.name} · ${layout.label} · ${theme.name}`;

  // Build logo HTML
  const logoHtml = S.logoSrc
    ? `<img src="${S.logoSrc}" style="height:${logoSz*0.42}px;max-width:140px;object-fit:contain" alt="Logo">`
    : '';

  // Header by layout
  let headerHtml = '';
  const titleStyle = `font-size:${fs+8}px;font-weight:${S.boldTitle?900:700};color:${layout.id==='modern'?'rgba(255,255,255,0.95)':theme.p};letter-spacing:-0.02em`;
  const numStyle   = `font-size:${fs-1}px;color:${layout.id==='modern'?'rgba(255,255,255,0.6)':'#94a3b8'}`;

  if (layout.id === 'modern') {
    const logoLeft  = S.logoPos !== 'right' && logoHtml ? logoHtml : '';
    const logoRight = S.logoPos === 'right' && logoHtml ? logoHtml : '';
    headerHtml = `
      <div style="margin:-${mt}mm -${mr}mm 20px -${ml}mm;padding:18px 24px;background:linear-gradient(135deg,${theme.p},${theme.a})">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
          <div style="display:flex;align-items:center;gap:12px">${logoLeft}<div><div style="${titleStyle}">${docLabel}</div><div style="${numStyle}">${docNum}</div></div></div>
          <div style="text-align:right">${logoRight}<div style="font-size:${fs+3}px;font-weight:${S.boldAmounts?800:600};color:rgba(255,255,255,0.95);letter-spacing:-0.02em">${fmtEur(total)}</div><div style="font-size:${fs-2}px;color:rgba(255,255,255,0.6)">TTC · ${fDate}</div></div>
        </div>
      </div>`;
  } else if (layout.id === 'sidebar') {
    headerHtml = `<div style="position:absolute;left:0;top:0;width:12px;height:100%;background:linear-gradient(180deg,${theme.p},${theme.a})"></div>`;
    headerHtml += `<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:22px;padding-left:20px">
      <div style="display:flex;align-items:center;gap:10px">${logoHtml}<div><div style="${titleStyle}">${docLabel}</div><div style="${numStyle}">${docNum}</div></div></div>
      <div style="text-align:right"><div style="font-size:${fs+4}px;font-weight:${S.boldAmounts?800:600};color:${fontColor.val};letter-spacing:-0.02em">${fmtEur(total)}</div><div style="font-size:${fs-2}px;color:${fontColor.val};opacity:0.5">TTC · ${fDate}</div></div>
    </div>`;
  } else if (layout.id === 'bold') {
    headerHtml = `<div style="margin-bottom:20px">
      <div style="font-size:${fs+22}px;font-weight:900;color:${theme.p};letter-spacing:-0.04em;line-height:1">${docLabel}</div>
      ${logoHtml ? `<div style="margin-top:8px">${logoHtml}</div>` : ''}
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
        <div style="font-size:${fs-1}px;color:${fontColor.val};opacity:0.5">${docNum} · ${fDate}</div>
        <div style="font-size:${fs+6}px;font-weight:800;color:${fontColor.val};letter-spacing:-0.03em">${fmtEur(total)}</div>
      </div>
    </div>`;
  } else if (layout.id === 'split') {
    headerHtml = `<div style="display:grid;grid-template-columns:1fr 1fr;margin:-${mt}mm -${mr}mm 20px -${ml}mm">
      <div style="padding:18px 24px;background:${theme.p}">
        ${logoHtml ? `<div style="margin-bottom:8px">${logoHtml}</div>` : ''}
        <div style="font-size:${fs+8}px;font-weight:${S.boldTitle?900:700};color:rgba(255,255,255,0.95);letter-spacing:-0.02em">${docLabel}</div>
        <div style="font-size:${fs-1}px;color:rgba(255,255,255,0.6);margin-top:2px">${docNum}</div>
      </div>
      <div style="padding:18px 24px;background:${theme.a};display:flex;flex-direction:column;justify-content:center;align-items:flex-end">
        <div style="font-size:${fs+6}px;font-weight:800;color:#fff;letter-spacing:-0.02em">${fmtEur(total)}</div>
        <div style="font-size:${fs-1}px;color:rgba(255,255,255,0.7);margin-top:2px">TTC · Émis le ${fDate}</div>
      </div>
    </div>`;
  } else if (layout.id === 'elegant') {
    headerHtml = `<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:22px;padding-bottom:14px;border-bottom:2px solid ${theme.p}">
      <div>${logoHtml ? `<div style="margin-bottom:8px">${logoHtml}</div>` : ''}<div style="font-size:${fs+6}px;font-weight:${S.boldTitle?700:400};color:${theme.p};letter-spacing:0.02em;font-variant:small-caps">${docLabel}</div><div style="width:40px;height:2px;background:${theme.p};margin:6px 0"></div><div style="font-size:${fs-1}px;color:${fontColor.val};opacity:0.5">${docNum}</div></div>
      <div style="text-align:right">${logoHtml && S.logoPos==='right' ? logoHtml : ''}<div style="font-size:${fs+4}px;font-weight:${S.boldAmounts?700:500};color:${fontColor.val}">${fmtEur(total)}</div><div style="font-size:${fs-2}px;color:${fontColor.val};opacity:0.4;margin-top:2px">TTC · ${fDate}</div></div>
    </div>`;
  } else {
    // classic, minimal, card
    const titleClr = layout.id==='minimal' ? fontColor.val : theme.p;
    headerHtml = `<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
      <div style="display:flex;align-items:center;gap:10px">
        ${S.logoPos!=='right' && logoHtml ? logoHtml : ''}
        <div><div style="font-size:${fs+6}px;font-weight:${S.boldTitle?900:700};color:${titleClr};letter-spacing:-0.01em">${docLabel}</div><div style="font-size:${fs-1}px;color:${fontColor.val};opacity:0.5;margin-top:2px">${docNum}</div></div>
      </div>
      <div style="text-align:right">
        ${S.logoPos==='right' && logoHtml ? `<div style="margin-bottom:6px">${logoHtml}</div>` : ''}
        <div style="font-size:${fs+4}px;font-weight:${S.boldAmounts?800:600};color:${fontColor.val};letter-spacing:-0.02em">${fmtEur(total)}</div>
        <div style="font-size:${fs-2}px;color:${fontColor.val};opacity:0.5;margin-top:2px">TTC · ${fDate}</div>
      </div>
    </div>`;
  }

  const padLeft = layout.id==='sidebar' ? '20px' : '0';

  // Parties
  const partyStyle = layout.id==='card'
    ? `padding:12px;border-radius:8px;background:rgba(0,0,0,0.04);border:1px solid ${theme.p}25`
    : `padding:12px;border-radius:8px;background:rgba(0,0,0,0.03)`;
  const partyMetaStyle = `font-size:${fs-2}px;color:${fontColor.val};opacity:0.58;line-height:1.55;overflow-wrap:anywhere;word-break:break-word`;
  const detailLine = (label, value) => value
    ? `<div><span style="font-weight:${S.boldLabels?700:600};opacity:0.8">${label} :</span> ${escHtml(value)}</div>`
    : '';

  const partiesHtml = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px;padding-left:${padLeft}">
      <div style="${partyStyle}">
        <div style="font-size:${fs-3}px;font-weight:${S.boldLabels?800:700};color:${theme.a};text-transform:uppercase;letter-spacing:0.08em;margin-bottom:5px">${L.from}</div>
        ${eName ? `<div style="font-size:${fs}px;font-weight:${S.boldTitle?700:600};color:${fontColor.val};margin-bottom:3px;overflow-wrap:anywhere;word-break:break-word">${escHtml(eName)}</div>` : ''}
        <div style="${partyMetaStyle}">
          ${[
            detailLine(L.status, eStatus),
            detailLine(profile.businessId, eSiret),
            detailLine(L.address, eAddr),
            detailLine(L.email, eEmail),
            detailLine(L.phone, eTel)
          ].filter(Boolean).join('')}
        </div>
      </div>
      <div style="${partyStyle}">
        <div style="font-size:${fs-3}px;font-weight:${S.boldLabels?800:700};color:${theme.a};text-transform:uppercase;letter-spacing:0.08em;margin-bottom:5px">${S.docType==='facture'?L.billedTo:L.quoteFor}</div>
        ${cName ? `<div style="font-size:${fs}px;font-weight:${S.boldTitle?700:600};color:${fontColor.val};margin-bottom:3px;overflow-wrap:anywhere;word-break:break-word">${escHtml(cName)}</div>` : ''}
        <div style="${partyMetaStyle}">
          ${[
            detailLine(profile.clientId, cSiret),
            detailLine(L.address, cAddr),
            detailLine('Adresse de chantier', cSiteAddr),
            detailLine(L.email, cEmail),
            detailLine(L.phone, cTel)
          ].filter(Boolean).join('')}
        </div>
      </div>
    </div>`;

  // Object line
  const objectHtml = fObj ? `
    <div style="margin-bottom:18px;padding:9px 14px;border-radius:8px;background:${theme.p}12;border:1px solid ${theme.p}25;padding-left:${padLeft?'calc('+padLeft+' + 14px)':'14px'}">
      <div style="font-size:${fs-3}px;font-weight:${S.boldLabels?800:700};color:${theme.p};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:2px">${L.object}</div>
      <div style="font-size:${fs}px;color:${fontColor.val};font-weight:500;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word">${escHtml(fObj)}</div>
    </div>` : '';

  // Vehicle details
  const hasVehicle = S.docSector === 'automobile' && [vTransaction,vVin,vPlate,vMake,vModel,vYear,vMileage,vFirstReg,vColor,vDetails].some(Boolean);
  const vehicleLine = (label, value) => value
    ? `<div><span style="font-weight:${S.boldLabels?800:700};opacity:.72">${label} :</span> ${escHtml(value)}</div>`
    : '';
  const vehicleHtml = hasVehicle ? `
    <div style="margin-bottom:18px;padding:11px 14px;border-radius:8px;background:${theme.a}10;border:1px solid ${theme.a}30;padding-left:${padLeft?'calc('+padLeft+' + 14px)':'14px'};break-inside:avoid;page-break-inside:avoid">
      <div style="font-size:${fs-3}px;font-weight:${S.boldLabels?800:700};color:${theme.p};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:7px">${L.vehicle}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 14px;font-size:${fs-2}px;color:${fontColor.val};opacity:.68;line-height:1.55;overflow-wrap:anywhere;word-break:break-word">
        ${vehicleLine(L.type, vTransaction)}
        ${vehicleLine(L.vin, vVin)}
        ${vehicleLine(L.plate, vPlate)}
        ${vehicleLine(L.make, vMake)}
        ${vehicleLine(L.model, vModel)}
        ${vehicleLine(L.year, vYear)}
        ${vehicleLine(L.mileage, vMileage)}
        ${vehicleLine(L.firstReg, vFirstReg)}
        ${vehicleLine(L.color, vColor)}
      </div>
      ${vDetails ? `<div style="font-size:${fs-2}px;color:${fontColor.val};opacity:.62;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;margin-top:8px">${escHtml(vDetails)}</div>` : ''}
    </div>` : '';

  // Marketplace / freelance details
  const hasOnline = S.docType === 'facture' && S.docSector === 'online' && [oPlatform,oOrderId,oBuyerRef,oSku,oCategory,oPayment,oShipping,oFees,oNotes].some(Boolean);
  const onlineLine = (label, value) => value
    ? `<div><span style="font-weight:${S.boldLabels?800:700};opacity:.72">${label} :</span> ${escHtml(value)}</div>`
    : '';
  const onlineHtml = hasOnline ? `
    <div style="margin-bottom:18px;padding:11px 14px;border-radius:8px;background:#0ea5e910;border:1px solid #0ea5e933;padding-left:${padLeft?'calc('+padLeft+' + 14px)':'14px'};break-inside:avoid;page-break-inside:avoid">
      <div style="font-size:${fs-3}px;font-weight:${S.boldLabels?800:700};color:#0284c7;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:7px">Marketplace / freelance details</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 14px;font-size:${fs-2}px;color:${fontColor.val};opacity:.68;line-height:1.55;overflow-wrap:anywhere;word-break:break-word">
        ${onlineLine('Plateforme', oPlatform)}
        ${onlineLine('Order / transaction ID', oOrderId)}
        ${onlineLine('Buyer username / ref client', oBuyerRef)}
        ${onlineLine('SKU / listing ref', oSku)}
        ${onlineLine('Product / service category', oCategory)}
        ${onlineLine('Payment method', oPayment)}
        ${onlineLine('Shipping / delivery ref', oShipping)}
        ${onlineLine('Marketplace fees / commission', oFees ? fmtEur(cleanNumber(oFees)) : '')}
      </div>
      ${oNotes ? `<div style="font-size:${fs-2}px;color:${fontColor.val};opacity:.62;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;margin-top:8px">${escHtml(oNotes)}</div>` : ''}
    </div>` : '';

  // Items table
  const itemRows = S.items.map((item,i) => `
    <tr style="background:${i%2===0?pageColor.bg:'rgba(128,128,128,0.04)'};break-inside:avoid;page-break-inside:avoid">
      <td style="padding:8px 10px;font-size:${fs-1}px;color:${fontColor.val};line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;vertical-align:top">${escHtml(item.desc)}</td>
      <td style="padding:8px 6px;font-size:${fs-1}px;color:${fontColor.val};opacity:0.65;text-align:center;vertical-align:top">${item.qty}</td>
      <td style="padding:8px 6px;font-size:${fs-1}px;color:${fontColor.val};opacity:0.55;text-align:center;white-space:normal;overflow-wrap:anywhere;word-break:break-word;vertical-align:top">${escHtml(item.unit)}</td>
      <td style="padding:8px 6px;font-size:${fs-1}px;color:${fontColor.val};text-align:right;vertical-align:top">${fmtEur(item.price)}</td>
      ${S.tva?`<td style="padding:8px 6px;font-size:${fs-2}px;text-align:center"><span style="background:rgba(245,158,11,0.12);color:#d97706;padding:2px 6px;border-radius:4px;font-weight:700">${item.tvaRate}%</span></td>`:''}
      <td style="padding:8px 10px;font-size:${fs}px;font-weight:${S.boldAmounts?700:600};color:${fontColor.val};text-align:right;vertical-align:top">${fmtEur(item.qty*item.price)}</td>
    </tr>`).join('');

  const colCount = S.tva ? 6 : 5;
  const tableHtml = `
    <div style="margin-bottom:16px;padding-left:${padLeft}">
      <table style="width:100%;border-collapse:collapse;table-layout:fixed">
        <colgroup>
          <col style="width:${S.tva?'38%':'46%'}">
          <col style="width:10%">
          <col style="width:12%">
          <col style="width:${S.tva?'14%':'16%'}">
          ${S.tva?'<col style="width:10%">':''}
          <col style="width:${S.tva?'16%':'16%'}">
        </colgroup>
        <thead>
          <tr style="background:${theme.p}">
            <th style="padding:8px 10px;font-size:${fs-3}px;font-weight:${S.boldLabels?800:700};color:rgba(255,255,255,0.8);text-transform:uppercase;letter-spacing:0.06em;text-align:left">${L.description}</th>
            <th style="padding:8px 6px;font-size:${fs-3}px;font-weight:${S.boldLabels?800:700};color:rgba(255,255,255,0.8);text-transform:uppercase;letter-spacing:0.06em;text-align:center">${L.qty}</th>
            <th style="padding:8px 6px;font-size:${fs-3}px;font-weight:${S.boldLabels?800:700};color:rgba(255,255,255,0.8);text-transform:uppercase;letter-spacing:0.06em;text-align:center">${L.unit}</th>
            <th style="padding:8px 6px;font-size:${fs-3}px;font-weight:${S.boldLabels?800:700};color:rgba(255,255,255,0.8);text-transform:uppercase;letter-spacing:0.06em;text-align:right">${L.unitPrice}</th>
            ${S.tva?`<th style="padding:8px 6px;font-size:${fs-3}px;font-weight:${S.boldLabels?800:700};color:rgba(255,255,255,0.8);text-transform:uppercase;letter-spacing:0.06em;text-align:center">${profile.taxName}</th>`:''}
            <th style="padding:8px 10px;font-size:${fs-3}px;font-weight:${S.boldLabels?800:700};color:rgba(255,255,255,0.8);text-transform:uppercase;letter-spacing:0.06em;text-align:right">${L.lineTotal}</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
    </div>`;

  // Totals
  const totalsHtml = `
    <div style="display:flex;justify-content:flex-end;margin-bottom:18px;padding-left:${padLeft}">
      <div style="width:200px">
        <div class="totals-row" style="color:${fontColor.val}"><span style="font-size:${fs-1}px">${L.subtotal}</span><span style="font-size:${fs-1}px;font-weight:${S.boldAmounts?700:500}">${fmtEur(subtotal)}</span></div>
        ${S.tva?`<div class="totals-row" style="color:${fontColor.val}"><span style="font-size:${fs-1}px">${profile.taxName}</span><span style="font-size:${fs-1}px;font-weight:${S.boldAmounts?700:500}">${fmtEur(tvaAmt)}</span></div>`:''}
        <div class="totals-total" style="background:${theme.p}">
          <span style="font-size:${fs-1}px;font-weight:700;color:rgba(255,255,255,0.85)">${L.total}</span>
          <span style="font-size:${fs+2}px;font-weight:${S.boldAmounts?800:700};color:#fff">${fmtEur(total)}</span>
        </div>
        ${!S.tva?`<div style="font-size:${fs-3}px;color:${fontColor.val};opacity:0.45;margin-top:6px;font-style:italic">${escHtml(profile.exempt)}</div>`:''}
      </div>
    </div>`;

  // Signature and company stamp
  const customStampImg = S.companyStampSrc
    ? `<img src="${S.companyStampSrc}" alt="Cachet société" style="width:${companyStampSize}px;max-width:100%;height:auto;object-fit:contain;opacity:${companyStampOpacity/100};margin-top:${S.signatureSrc ? '-10px' : '0'}">`
    : '';
  const signatureImg = S.signatureSrc
    ? `<img src="${S.signatureSrc}" alt="Signature" style="width:${signatureSize}px;max-width:100%;height:auto;object-fit:contain;margin-bottom:${customStampImg ? '0' : '3px'}">`
    : `<div style="height:44px;border-bottom:1px solid ${theme.p}40;margin-bottom:5px"></div>`;
  const sigHtml = (S.signature || S.signatureSrc || S.companyStampSrc) ? `
    <div style="display:flex;justify-content:flex-end;margin-bottom:14px;padding-left:${padLeft};break-inside:avoid;page-break-inside:avoid">
      <div style="width:${Math.max(190, companyStampSize + 24, signatureSize + 24)}px;padding:9px;border:1px dashed ${theme.p}60;border-radius:8px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:82px">
        ${signatureImg}
        ${customStampImg}
        <div style="font-size:${fs-3}px;color:${fontColor.val};opacity:0.45;margin-top:4px">${L.signature}</div>
      </div>
    </div>` : '';

  // QR code (demo)
  const qrHtml = S.qrCode ? `
    <div style="display:flex;justify-content:flex-end;margin-bottom:14px;padding-left:${padLeft}">
      <div style="width:60px;height:60px;border:1px solid ${fontColor.val};opacity:.3;display:flex;align-items:center;justify-content:center;font-size:9px;color:${fontColor.val};text-align:center;border-radius:4px">${L.paymentQr}</div>
    </div>` : '';

  // Payment details
  const paymentHtml = (eIban || eBic || eRib) ? `
    <div style="margin-bottom:14px;padding:10px 12px;border-radius:8px;background:${theme.p}0f;border:1px solid ${theme.p}25;padding-left:${padLeft?'calc('+padLeft+' + 12px)':'12px'}">
      <div style="font-size:${fs-3}px;font-weight:${S.boldLabels?800:700};color:${theme.p};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">${L.payment}</div>
      <div style="font-size:${fs-2}px;color:${fontColor.val};opacity:0.62;line-height:1.65;overflow-wrap:anywhere;word-break:break-word">
        ${eIban ? `<div><span style="font-weight:700;opacity:0.8">IBAN :</span> ${escHtml(eIban)}</div>` : ''}
        ${eBic ? `<div><span style="font-weight:700;opacity:0.8">BIC/SWIFT :</span> ${escHtml(eBic)}</div>` : ''}
        ${eRib ? `<div><span style="font-weight:700;opacity:0.8">RIB/Banque :</span> ${escHtml(eRib)}</div>` : ''}
      </div>
    </div>` : '';

  // Notes
  const notesHtml = `
    <div style="border-top:1px solid ${theme.p}25;padding-top:12px;padding-left:${padLeft}">
      ${fNotes ? `<div style="font-size:${fs-3}px;color:${fontColor.val};opacity:0.45;line-height:1.7;font-style:${S.italic?'italic':'normal'}">${escHtml(fNotes).replace(/\n/g,'<br>')}</div>` : ''}
      ${!S.tva ? `<div style="font-size:${fs-3}px;color:${fontColor.val};opacity:0.45;margin-top:4px;font-style:italic">${escHtml(profile.exempt)}</div>` : ''}
      <div style="margin-top:8px;display:flex;gap:16px;font-size:${fs-3}px;color:${fontColor.val};opacity:0.35">
        ${fDate?`<span>${L.issued} ${fDate}</span>`:''}
        ${S.docType==='devis' && fDue?`<span>${L.due} ${fDue}</span>`:''}
      </div>
    </div>`;

  // Page number
  const pageNumHtml = S.pageNumbers ? `<div style="position:absolute;bottom:8px;right:14px;font-size:${fs-4}px;color:${fontColor.val};opacity:0.3">${L.page} 1 / 1</div>` : '';

  // Watermark
  const wmHtml = wm ? `<div class="watermark" style="color:${fontColor.val}">${escHtml(wm)}</div>` : '';

  // Stamp
  let stampHtml = '';
  if (S.stamp === 'paid')  stampHtml = '<div class="stamp stamp-paid">PAYÉ</div>';
  if (S.stamp === 'draft') stampHtml = '<div class="stamp stamp-draft">BROUILLON</div>';
  if (S.stamp === 'conf')  stampHtml = '<div class="stamp stamp-conf">CONFIDENTIEL</div>';

  // Assemble
  const preview = document.getElementById('invoice-preview');
  preview.style.fontFamily = `'${font.name}', system-ui, sans-serif`;
  preview.style.background = pageColor.bg;
  preview.innerHTML = `
    ${wmHtml}
    ${stampHtml}
    <div class="inv-body" style="padding:${mt}mm ${mr}mm ${mb}mm ${ml}mm">
      ${headerHtml}
      ${partiesHtml}
      ${objectHtml}
      ${onlineHtml}
      ${vehicleHtml}
      ${tableHtml}
      ${totalsHtml}
      ${sigHtml}
      ${qrHtml}
      ${paymentHtml}
      ${notesHtml}
    </div>
    ${pageNumHtml}
  `;
  updateTotals();
}

// ═══════════════════════════════════════════════════════
// PDF GENERATION
// ═══════════════════════════════════════════════════════
async function generatePDF() {
  const btnText = document.getElementById('pdf-btn-text');
  if (btnText) btnText.innerHTML = '<div class="spinner" style="display:inline-block"></div> Génération…';

  syncItemsFromForm();
  updatePreview();
  await new Promise(resolve => requestAnimationFrame(resolve));

  if (typeof html2pdf === 'undefined') {
    showNotif('⚠️ Générateur PDF non chargé. Utilisez Imprimer > Enregistrer en PDF.', 'info');
    if (btnText) btnText.textContent = 'Télécharger PDF';
    return;
  }

  const source = document.getElementById('invoice-preview');
  const el = buildPdfClone(source);
  const docNum = document.getElementById('f-number')?.value || 'document';

  try {
    await saveInvoicePdf(el, docNum);
    recordDocumentHistory('PDF');
    updateProgressSteps('download');
    showPdfSuccess(docNum);
    showNotif('✅ PDF généré avec succès !', 'success');
  } catch(e) {
    showNotif('⚠️ Erreur lors de la génération. Essayez Imprimer.', 'info');
  } finally {
    el.parentElement?.remove();
  }

  if (btnText) btnText.textContent = 'Télécharger PDF';
}

function showPdfSuccess(docNum='document') {
  const title = document.getElementById('pdf-success-title');
  const sub = document.getElementById('pdf-success-sub');
  if (title) title.textContent = `${docNum} prêt`;
  if (sub) sub.textContent = `${S.docType === 'devis' ? 'Devis' : 'Facture'} téléchargé en PDF`;
  document.getElementById('pdf-success-modal')?.classList.add('open');
  spawnConfetti(document.querySelector('#pdf-success-modal .success-icon'));
}

function spawnConfetti(anchorEl) {
  if (!anchorEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#16a34a', '#22c55e', '#0d9488', '#facc15', '#38bdf8'];
  for (let i = 0; i < 18; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 70;
    piece.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    piece.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
    piece.style.setProperty('--rot', (Math.random() * 360 - 180) + 'deg');
    piece.style.background = colors[i % colors.length];
    anchorEl.appendChild(piece);
    setTimeout(() => piece.remove(), 800);
  }
}

function closePdfSuccess() {
  document.getElementById('pdf-success-modal')?.classList.remove('open');
}

function handlePdfSuccessBackdrop(e) {
  if (e.target?.id === 'pdf-success-modal') closePdfSuccess();
}

async function saveInvoicePdf(el, docNum) {
  const blob = await createInvoicePdfBlob(el);
  downloadBlob(blob, `${docNum}.pdf`);
}

async function createInvoicePdfBlob(el) {
  if (typeof html2canvas === 'undefined' || !window.jspdf?.jsPDF) {
    return await html2pdf().set({
      margin: 0,
      image: { type:'jpeg', quality:1 },
      html2canvas: { scale:2, useCORS:true, allowTaint:true, backgroundColor:PAGE_COLORS[S.pageColorIdx].bg },
      jsPDF: { unit:'mm', format:'a4', orientation:'portrait' }
    }).from(el).outputPdf('blob');
  }

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: PAGE_COLORS[S.pageColorIdx].bg,
    windowWidth: 794,
    windowHeight: Math.max(1123, el.scrollHeight),
    scrollX: 0,
    scrollY: 0,
  });

  const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
  const pageW = 210;
  const pageH = 297;
  const margin = 10;
  const imgW = pageW - margin * 2;
  const rawImgH = canvas.height * imgW / canvas.width;
  const pageContentH = pageH - margin * 2;

  if (rawImgH <= pageContentH * 1.28) {
    const imgData = canvas.toDataURL('image/jpeg', 1);
    pdf.addImage(imgData, 'JPEG', margin, margin, imgW, Math.min(rawImgH, pageContentH));
    return pdf.output('blob');
  }

  const pxPerMm = canvas.width / imgW;
  const sliceHeightPx = Math.floor(pageContentH * pxPerMm);
  const findCanvasContentBottom = (sourceCanvas) => {
    const ctx = sourceCanvas.getContext('2d', { willReadFrequently:true });
    if (!ctx) return sourceCanvas.height;
    const { data, width, height } = ctx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
    const baseR = data[0], baseG = data[1], baseB = data[2];
    const xStep = Math.max(1, Math.floor(width / 90));
    for (let y = height - 1; y >= 0; y -= 3) {
      let rowInk = 0;
      for (let x = 0; x < width; x += xStep) {
        const i = (y * width + x) * 4;
        if (data[i + 3] < 10) continue;
        const delta = Math.abs(data[i] - baseR) + Math.abs(data[i + 1] - baseG) + Math.abs(data[i + 2] - baseB);
        if (delta > 36 && ++rowInk > 3) return y;
      }
    }
    return Math.min(height, sliceHeightPx);
  };
  const sliceHasVisibleContent = (pageCanvas) => {
    const ctx = pageCanvas.getContext('2d', { willReadFrequently:true });
    if (!ctx) return true;
    const { data, width, height } = ctx.getImageData(0, 0, pageCanvas.width, pageCanvas.height);
    const baseR = data[0], baseG = data[1], baseB = data[2];
    let changed = 0;
    const step = Math.max(4, Math.floor((width * height) / 25000)) * 4;
    for (let i = 0; i < data.length; i += step) {
      if (data[i + 3] < 10) continue;
      const delta = Math.abs(data[i] - baseR) + Math.abs(data[i + 1] - baseG) + Math.abs(data[i + 2] - baseB);
      if (delta > 36 && ++changed > 18) return true;
    }
    return false;
  };
  const effectiveCanvasHeight = Math.min(canvas.height, Math.max(16, findCanvasContentBottom(canvas) + 28));
  let page = 0;
  for (let y = 0; y < effectiveCanvasHeight - 4; y += sliceHeightPx) {
    const currentSliceHeight = Math.min(sliceHeightPx, effectiveCanvasHeight - y);
    if (currentSliceHeight < 8) break;
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = currentSliceHeight;
    const ctx = pageCanvas.getContext('2d');
    ctx.fillStyle = PAGE_COLORS[S.pageColorIdx].bg || '#ffffff';
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    ctx.drawImage(canvas, 0, y, canvas.width, currentSliceHeight, 0, 0, canvas.width, currentSliceHeight);
    if (page > 0 && !sliceHasVisibleContent(pageCanvas)) continue;
    const sliceImgH = currentSliceHeight / pxPerMm;
    if (page > 0) pdf.addPage();
    pdf.addImage(pageCanvas.toDataURL('image/jpeg', 1), 'JPEG', margin, margin, imgW, sliceImgH);
    page++;
  }
  return pdf.output('blob');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function buildPdfClone(source) {
  const holder = document.createElement('div');
  holder.id = 'pdf-render-holder';
  holder.style.cssText = [
    'position:fixed',
    'left:0',
    'top:0',
    'width:794px',
    'min-height:1123px',
    'background:#fff',
    'z-index:99999',
    'pointer-events:none',
    'overflow:visible',
    '-webkit-print-color-adjust:exact',
    'print-color-adjust:exact'
  ].join(';');

  const clone = source.cloneNode(true);
  clone.id = 'invoice-pdf-render';
  clone.style.width = '794px';
  clone.style.minHeight = '1123px';
  clone.style.height = 'auto';
  clone.style.margin = '0';
  clone.style.padding = '0';
  clone.style.border = '0';
  clone.style.borderRadius = '0';
  clone.style.boxShadow = 'none';
  clone.style.overflow = 'visible';
  clone.style.background = getComputedStyle(source).backgroundColor || PAGE_COLORS[S.pageColorIdx].bg;
  clone.style.webkitPrintColorAdjust = 'exact';
  clone.style.printColorAdjust = 'exact';

  if (!S.authUser) {
    const watermark = document.createElement('div');
    watermark.style.cssText = [
      'width:100%',
      'text-align:center',
      'padding:14px 0 6px',
      'font-family:Inter,system-ui,sans-serif',
      'font-size:10px',
      `color:${PAGE_COLORS[S.pageColorIdx]?.text || '#64748b'}`,
      'opacity:.45',
      'letter-spacing:.02em'
    ].join(';');
    watermark.textContent = 'Créé gratuitement avec FacturePro — facturergratuit.com';
    clone.appendChild(watermark);
  }

  holder.appendChild(clone);
  document.body.appendChild(holder);
  return clone;
}

window.addEventListener('beforeprint', () => {
  syncItemsFromForm();
  updatePreview();
});

// ═══════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════
function fmtEur(n) {
  const profile = getCountryProfile();
  return new Intl.NumberFormat(profile.locale, { style:'currency', currency:S.currency || profile.currency }).format(n||0);
}

function fmtDate(iso) {
  if (!iso) return '';
  const [y,m,d] = iso.split('-');
  if (getCountryProfile().dateOrder === 'mdy') return `${m}/${d}/${y}`;
  return `${d}/${m}/${y}`;
}

function escHtml(str) {
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showNotif(msg, type='success') {
  const el = document.getElementById('notif');
  el.className = `notif notif-${type}`;
  el.textContent = msg;
  el.style.display = 'flex';
  setTimeout(() => { el.style.display='none'; }, 3500);
}

// ═══════════════════════════════════════════════════════
// HOMEPAGE: before/after compare slider + country demo
// ═══════════════════════════════════════════════════════
(function initCompareSlider() {
  const wrap = document.getElementById('compareWrap');
  const handle = document.getElementById('compareHandle');
  if (!wrap || !handle) return;
  let dragging = false;

  function setPos(pct) {
    pct = Math.max(0, Math.min(100, pct));
    wrap.style.setProperty('--pos', pct + '%');
    handle.setAttribute('aria-valuenow', Math.round(pct));
  }
  function fromClientX(clientX) {
    const rect = wrap.getBoundingClientRect();
    setPos(((clientX - rect.left) / rect.width) * 100);
  }
  wrap.addEventListener('pointerdown', (e) => { dragging = true; fromClientX(e.clientX); wrap.setPointerCapture(e.pointerId); });
  wrap.addEventListener('pointermove', (e) => { if (dragging) fromClientX(e.clientX); });
  wrap.addEventListener('pointerup', () => { dragging = false; });
  wrap.addEventListener('pointercancel', () => { dragging = false; });
  handle.addEventListener('keydown', (e) => {
    const current = parseFloat(wrap.style.getPropertyValue('--pos')) || 50;
    if (e.key === 'ArrowLeft') { setPos(current - 5); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setPos(current + 5); e.preventDefault(); }
  });
})();

const countryDemoData = {
  fr: { line: '620,00 €', taxLabel: 'TVA 20%', tax: '141,00 €', total: '846,00 €' },
  uk: { line: '£ 540.00', taxLabel: 'VAT 20%', tax: '£ 108.00', total: '£ 648.00' },
  us: { line: '$ 680.00', taxLabel: 'Sales tax 8%', tax: '$ 54.40', total: '$ 734.40' },
};
function setCountryDemo(btn, code) {
  document.querySelectorAll('.country-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const d = countryDemoData[code];
  document.getElementById('cdLine').textContent = d.line;
  document.getElementById('cdTaxLabel').textContent = d.taxLabel;
  document.getElementById('cdTax').textContent = d.tax;
  document.getElementById('cdTotal').textContent = d.total;
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => { if (typeof positionRailPill === 'function') positionRailPill(); }, 60);

  const themeTrack = document.getElementById('themeTrack');
  if (themeTrack && typeof THEMES !== 'undefined') {
    const swatchHtml = THEMES.map(t => `
      <div class="theme-swatch">
        <div class="theme-swatch-lines">
          <div class="theme-swatch-line" style="background:${t.p};width:80%"></div>
          <div class="theme-swatch-line" style="background:${t.a}"></div>
        </div>
        <div class="theme-swatch-name">${t.name}</div>
      </div>`).join('');
    themeTrack.innerHTML = swatchHtml + swatchHtml;
  }
});
