import { DEFAULT_LOCALE } from "./locales";

/**
 * Translated labels for invoice/quote *document output* — the strings a
 * client sees on the PDF/print page. This is deliberately separate from
 * dictionary.ts (which covers app-UI chrome and is English-only today):
 * document labels are a small, stable, universal vocabulary, so they can be
 * fully translated now without taking on translating the entire app UI.
 */
export interface DocumentDictionary {
  invoiceTitle: string;
  quoteTitle: string;
  billedTo: string;
  quoteFor: string;
  issueDate: string;
  dueDate: string;
  validUntil: string;
  description: string;
  qty: string;
  unitPrice: string;
  amount: string;
  subtotal: string;
  discount: string;
  tax: string;
  total: string;
  amountPaid: string;
  amountDue: string;
  notes: string;
  terms: string;
  paymentDetails: string;
  bankInformation: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  iban: string;
  swift: string;
  authorizedSignature: string;
  thankYou: string;
  page: string;
  of: string;
}

const en: DocumentDictionary = {
  invoiceTitle: "Invoice",
  quoteTitle: "Quote",
  billedTo: "Billed to",
  quoteFor: "For",
  issueDate: "Issue date",
  dueDate: "Due date",
  validUntil: "Valid until",
  description: "Description",
  qty: "Qty",
  unitPrice: "Unit price",
  amount: "Amount",
  subtotal: "Subtotal",
  discount: "Discount",
  tax: "Tax",
  total: "Total",
  amountPaid: "Amount paid",
  amountDue: "Amount due",
  notes: "Notes",
  terms: "Terms",
  paymentDetails: "Payment details",
  bankInformation: "Bank information",
  accountName: "Account name",
  accountNumber: "Account number",
  bankName: "Bank name",
  iban: "IBAN",
  swift: "SWIFT/BIC",
  authorizedSignature: "Authorized signature",
  thankYou: "Thank you for your business.",
  page: "Page",
  of: "of",
};

const fr: DocumentDictionary = {
  invoiceTitle: "Facture",
  quoteTitle: "Devis",
  billedTo: "Facturé à",
  quoteFor: "Pour",
  issueDate: "Date d'émission",
  dueDate: "Date d'échéance",
  validUntil: "Valable jusqu'au",
  description: "Description",
  qty: "Qté",
  unitPrice: "Prix unitaire",
  amount: "Montant",
  subtotal: "Sous-total",
  discount: "Remise",
  tax: "Taxe",
  total: "Total",
  amountPaid: "Montant payé",
  amountDue: "Montant dû",
  notes: "Remarques",
  terms: "Conditions",
  paymentDetails: "Informations de paiement",
  bankInformation: "Coordonnées bancaires",
  accountName: "Titulaire du compte",
  accountNumber: "Numéro de compte",
  bankName: "Banque",
  iban: "IBAN",
  swift: "SWIFT/BIC",
  authorizedSignature: "Signature autorisée",
  thankYou: "Merci pour votre confiance.",
  page: "Page",
  of: "sur",
};

const es: DocumentDictionary = {
  invoiceTitle: "Factura",
  quoteTitle: "Presupuesto",
  billedTo: "Facturado a",
  quoteFor: "Para",
  issueDate: "Fecha de emisión",
  dueDate: "Fecha de vencimiento",
  validUntil: "Válido hasta",
  description: "Descripción",
  qty: "Cant.",
  unitPrice: "Precio unitario",
  amount: "Importe",
  subtotal: "Subtotal",
  discount: "Descuento",
  tax: "Impuesto",
  total: "Total",
  amountPaid: "Importe pagado",
  amountDue: "Importe pendiente",
  notes: "Notas",
  terms: "Condiciones",
  paymentDetails: "Datos de pago",
  bankInformation: "Datos bancarios",
  accountName: "Titular de la cuenta",
  accountNumber: "Número de cuenta",
  bankName: "Banco",
  iban: "IBAN",
  swift: "SWIFT/BIC",
  authorizedSignature: "Firma autorizada",
  thankYou: "Gracias por su confianza.",
  page: "Página",
  of: "de",
};

const de: DocumentDictionary = {
  invoiceTitle: "Rechnung",
  quoteTitle: "Angebot",
  billedTo: "Rechnungsempfänger",
  quoteFor: "Für",
  issueDate: "Rechnungsdatum",
  dueDate: "Fälligkeitsdatum",
  validUntil: "Gültig bis",
  description: "Beschreibung",
  qty: "Menge",
  unitPrice: "Einzelpreis",
  amount: "Betrag",
  subtotal: "Zwischensumme",
  discount: "Rabatt",
  tax: "Steuer",
  total: "Gesamtbetrag",
  amountPaid: "Bezahlter Betrag",
  amountDue: "Fälliger Betrag",
  notes: "Anmerkungen",
  terms: "Bedingungen",
  paymentDetails: "Zahlungsdetails",
  bankInformation: "Bankverbindung",
  accountName: "Kontoinhaber",
  accountNumber: "Kontonummer",
  bankName: "Bank",
  iban: "IBAN",
  swift: "SWIFT/BIC",
  authorizedSignature: "Autorisierte Unterschrift",
  thankYou: "Vielen Dank für Ihr Vertrauen.",
  page: "Seite",
  of: "von",
};

const pt: DocumentDictionary = {
  invoiceTitle: "Fatura",
  quoteTitle: "Orçamento",
  billedTo: "Faturado a",
  quoteFor: "Para",
  issueDate: "Data de emissão",
  dueDate: "Data de vencimento",
  validUntil: "Válido até",
  description: "Descrição",
  qty: "Qtd.",
  unitPrice: "Preço unitário",
  amount: "Valor",
  subtotal: "Subtotal",
  discount: "Desconto",
  tax: "Imposto",
  total: "Total",
  amountPaid: "Valor pago",
  amountDue: "Valor em aberto",
  notes: "Notas",
  terms: "Condições",
  paymentDetails: "Dados de pagamento",
  bankInformation: "Dados bancários",
  accountName: "Titular da conta",
  accountNumber: "Número da conta",
  bankName: "Banco",
  iban: "IBAN",
  swift: "SWIFT/BIC",
  authorizedSignature: "Assinatura autorizada",
  thankYou: "Obrigado pela preferência.",
  page: "Página",
  of: "de",
};

const it: DocumentDictionary = {
  invoiceTitle: "Fattura",
  quoteTitle: "Preventivo",
  billedTo: "Fatturato a",
  quoteFor: "Per",
  issueDate: "Data di emissione",
  dueDate: "Data di scadenza",
  validUntil: "Valido fino al",
  description: "Descrizione",
  qty: "Qtà",
  unitPrice: "Prezzo unitario",
  amount: "Importo",
  subtotal: "Subtotale",
  discount: "Sconto",
  tax: "Imposta",
  total: "Totale",
  amountPaid: "Importo pagato",
  amountDue: "Importo dovuto",
  notes: "Note",
  terms: "Termini",
  paymentDetails: "Dettagli di pagamento",
  bankInformation: "Coordinate bancarie",
  accountName: "Intestatario",
  accountNumber: "Numero di conto",
  bankName: "Banca",
  iban: "IBAN",
  swift: "SWIFT/BIC",
  authorizedSignature: "Firma autorizzata",
  thankYou: "Grazie per la fiducia accordata.",
  page: "Pagina",
  of: "di",
};

const nl: DocumentDictionary = {
  invoiceTitle: "Factuur",
  quoteTitle: "Offerte",
  billedTo: "Gefactureerd aan",
  quoteFor: "Voor",
  issueDate: "Factuurdatum",
  dueDate: "Vervaldatum",
  validUntil: "Geldig tot",
  description: "Omschrijving",
  qty: "Aantal",
  unitPrice: "Stukprijs",
  amount: "Bedrag",
  subtotal: "Subtotaal",
  discount: "Korting",
  tax: "Btw",
  total: "Totaal",
  amountPaid: "Betaald bedrag",
  amountDue: "Openstaand bedrag",
  notes: "Opmerkingen",
  terms: "Voorwaarden",
  paymentDetails: "Betaalgegevens",
  bankInformation: "Bankgegevens",
  accountName: "Rekeninghouder",
  accountNumber: "Rekeningnummer",
  bankName: "Bank",
  iban: "IBAN",
  swift: "SWIFT/BIC",
  authorizedSignature: "Bevoegde handtekening",
  thankYou: "Bedankt voor uw vertrouwen.",
  page: "Pagina",
  of: "van",
};

const ar: DocumentDictionary = {
  invoiceTitle: "فاتورة",
  quoteTitle: "عرض سعر",
  billedTo: "الفاتورة إلى",
  quoteFor: "إلى",
  issueDate: "تاريخ الإصدار",
  dueDate: "تاريخ الاستحقاق",
  validUntil: "صالح حتى",
  description: "الوصف",
  qty: "الكمية",
  unitPrice: "سعر الوحدة",
  amount: "المبلغ",
  subtotal: "المجموع الفرعي",
  discount: "الخصم",
  tax: "الضريبة",
  total: "الإجمالي",
  amountPaid: "المبلغ المدفوع",
  amountDue: "المبلغ المستحق",
  notes: "ملاحظات",
  terms: "الشروط",
  paymentDetails: "تفاصيل الدفع",
  bankInformation: "المعلومات البنكية",
  accountName: "اسم صاحب الحساب",
  accountNumber: "رقم الحساب",
  bankName: "اسم البنك",
  iban: "آيبان",
  swift: "سويفت",
  authorizedSignature: "التوقيع المعتمد",
  thankYou: "شكرًا لتعاملكم معنا.",
  page: "صفحة",
  of: "من",
};

const ur: DocumentDictionary = {
  invoiceTitle: "انوائس",
  quoteTitle: "کوٹیشن",
  billedTo: "بل کس کے نام",
  quoteFor: "برائے",
  issueDate: "جاری کرنے کی تاریخ",
  dueDate: "ادائیگی کی تاریخ",
  validUntil: "تاریخِ انتہاء",
  description: "تفصیل",
  qty: "تعداد",
  unitPrice: "فی یونٹ قیمت",
  amount: "رقم",
  subtotal: "ذیلی مجموعہ",
  discount: "رعایت",
  tax: "ٹیکس",
  total: "کل رقم",
  amountPaid: "ادا شدہ رقم",
  amountDue: "واجب الادا رقم",
  notes: "نوٹس",
  terms: "شرائط",
  paymentDetails: "ادائیگی کی تفصیلات",
  bankInformation: "بینک کی تفصیلات",
  accountName: "اکاؤنٹ ہولڈر کا نام",
  accountNumber: "اکاؤنٹ نمبر",
  bankName: "بینک کا نام",
  iban: "آئی بی اے این",
  swift: "سوئفٹ",
  authorizedSignature: "مجاز دستخط",
  thankYou: "آپ کے کاروبار کا شکریہ۔",
  page: "صفحہ",
  of: "بمقابلہ",
};

const DOCUMENT_DICTIONARIES: Record<string, DocumentDictionary> = { en, fr, es, de, pt, it, nl, ar, ur };

export function getDocumentDictionary(locale: string = DEFAULT_LOCALE): DocumentDictionary {
  return DOCUMENT_DICTIONARIES[locale] ?? en;
}
