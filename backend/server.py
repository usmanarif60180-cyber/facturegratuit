from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI()
api = APIRouter(prefix="/api")


def now_iso():
    return datetime.utcnow().isoformat()


def uid():
    return str(uuid.uuid4())


def strip_id(doc):
    if doc and "_id" in doc:
        doc.pop("_id", None)
    return doc


class Client(BaseModel):
    id: str = Field(default_factory=uid)
    workspaceId: str
    name: str
    company: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""
    address: Optional[str] = ""
    city: Optional[str] = ""
    postalCode: Optional[str] = ""
    country: Optional[str] = "France"
    siret: Optional[str] = ""
    vatNumber: Optional[str] = ""
    clientType: Optional[str] = "Particulier"
    notes: Optional[str] = ""
    createdAt: str = Field(default_factory=now_iso)


class Vehicle(BaseModel):
    id: str = Field(default_factory=uid)
    workspaceId: str
    clientId: Optional[str] = None
    make: Optional[str] = ""
    model: Optional[str] = ""
    version: Optional[str] = ""
    registration: Optional[str] = ""
    vin: Optional[str] = ""
    mileage: Optional[int] = None
    firstRegistrationDate: Optional[str] = ""
    fuelType: Optional[str] = ""
    transmission: Optional[str] = ""
    color: Optional[str] = ""
    fiscalPower: Optional[str] = ""
    year: Optional[int] = None
    doors: Optional[int] = None
    seats: Optional[int] = None
    notes: Optional[str] = ""
    createdAt: str = Field(default_factory=now_iso)


class Settings(BaseModel):
    workspaceId: str
    companyName: Optional[str] = "Mon Entreprise"
    companyAddress: Optional[str] = ""
    companyCity: Optional[str] = ""
    companyPostal: Optional[str] = ""
    companyCountry: Optional[str] = "France"
    companyPhone: Optional[str] = ""
    companyEmail: Optional[str] = ""
    siret: Optional[str] = ""
    vatNumber: Optional[str] = ""
    iban: Optional[str] = ""
    bic: Optional[str] = ""
    defaultHourlyRate: float = 60.0
    defaultVat: float = 20.0
    partsWarranty: Optional[str] = ""
    labourWarranty: Optional[str] = ""
    defaultTerms: Optional[str] = "Paiement à réception de facture."
    invoicePrefix: str = "FAC"
    purchasePrefix: str = "ACH"
    quotePrefix: str = "DEV"
    depositPrefix: str = "ACP"
    creditPrefix: str = "AV"
    legalFooter: Optional[str] = ""


class Company(BaseModel):
    id: str = Field(default_factory=uid)
    workspaceId: str
    tradeName: str = "Ma Société"
    legalName: Optional[str] = ""
    legalForm: Optional[str] = ""
    siren: Optional[str] = ""
    siret: Optional[str] = ""
    vatNumber: Optional[str] = ""
    address: Optional[str] = ""
    addressExtra: Optional[str] = ""
    postalCode: Optional[str] = ""
    city: Optional[str] = ""
    country: Optional[str] = "France"
    phone: Optional[str] = ""
    email: Optional[str] = ""
    website: Optional[str] = ""
    capital: Optional[str] = ""
    rcs: Optional[str] = ""
    iban: Optional[str] = ""
    bic: Optional[str] = ""
    bankName: Optional[str] = ""
    logoBase64: Optional[str] = ""
    stampBase64: Optional[str] = ""
    signatureBase64: Optional[str] = ""
    logoPosition: str = "left"  # left|center|right
    logoSize: str = "medium"  # small|medium|large
    showStampOn: List[str] = ["invoice", "quote", "deposit", "final"]
    accentColor: str = "#4f46e5"
    footer: Optional[str] = ""
    quoteFooter: Optional[str] = ""
    paymentInstructions: Optional[str] = ""
    defaultTerms: Optional[str] = ""
    isDefault: bool = False
    createdAt: str = Field(default_factory=now_iso)


class Chantier(BaseModel):
    id: str = Field(default_factory=uid)
    workspaceId: str
    companyId: Optional[str] = None
    clientId: Optional[str] = None
    name: str
    reference: Optional[str] = ""
    address: Optional[str] = ""
    postalCode: Optional[str] = ""
    city: Optional[str] = ""
    country: Optional[str] = "France"
    contact: Optional[str] = ""
    phone: Optional[str] = ""
    email: Optional[str] = ""
    startDate: Optional[str] = ""
    endDate: Optional[str] = ""
    status: str = "prospect"  # prospect|quote_prep|quote_sent|accepted|in_progress|paused|done|cancelled
    budget: float = 0
    notes: Optional[str] = ""
    createdAt: str = Field(default_factory=now_iso)


class Expense(BaseModel):
    id: str = Field(default_factory=uid)
    workspaceId: str
    companyId: Optional[str] = None
    chantierId: Optional[str] = None
    date: str
    supplier: Optional[str] = ""
    category: Optional[str] = "Matériaux"
    description: Optional[str] = ""
    ht: float = 0
    vat: float = 20
    ttc: float = 0
    paymentStatus: Optional[str] = "unpaid"
    reference: Optional[str] = ""
    createdAt: str = Field(default_factory=now_iso)


async def next_number(workspace_id: str, prefix: str):
    year = datetime.utcnow().year
    key = f"{prefix}-{year}"
    counter = await db.counters.find_one_and_update(
        {"workspaceId": workspace_id, "key": key},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=True,
    )
    seq = counter.get("seq", 1) if counter else 1
    return f"{prefix}-{year}-{seq:05d}"


def compute_totals(inv: Dict[str, Any]) -> Dict[str, Any]:
    subtotal = 0.0
    tax = 0.0
    for it in inv.get("lineItems", []) or []:
        qty = float(it.get("qty", 0) or 0)
        if it.get("pricingMethod") == "hourly":
            qty = float(it.get("hours", 0) or 0)
        unit = float(it.get("unitPrice", 0) or 0)
        line_disc = float(it.get("discount", 0) or 0)
        line_ht = max(qty * unit - line_disc, 0)
        vat_pct = float(it.get("vat", 0) or 0)
        line_tax = line_ht * (vat_pct / 100.0)
        it["lineHT"] = round(line_ht, 2)
        it["lineTax"] = round(line_tax, 2)
        it["lineTTC"] = round(line_ht + line_tax, 2)
        subtotal += line_ht
        tax += line_tax
    global_disc = float(inv.get("discount", 0) or 0)
    fees = inv.get("fees") or {}
    fees_total = sum(float(v or 0) for v in fees.values())
    subtotal_after = max(subtotal - global_disc, 0) + fees_total
    if inv.get("taxRegime") in ("exempt", "na", "margin"):
        tax = 0.0
    total_ttc = subtotal_after + tax
    deposit = float(inv.get("depositPaid", 0) or 0)
    already = float(inv.get("alreadyPaid", 0) or 0)
    trade_in_val = 0.0
    if inv.get("tradeIn") and inv["tradeIn"].get("enabled"):
        trade_in_val = float(inv["tradeIn"].get("value", 0) or 0)
    balance = max(total_ttc - deposit - already - trade_in_val, 0)
    inv["subtotalHT"] = round(subtotal, 2)
    inv["totalTax"] = round(tax, 2)
    inv["totalTTC"] = round(total_ttc, 2)
    inv["balanceDue"] = round(balance, 2)
    return inv


@api.get("/")
async def root():
    return {"message": "ProFacture AI API"}


@api.get("/clients")
async def list_clients(workspaceId: str):
    docs = await db.clients.find({"workspaceId": workspaceId}).sort("createdAt", -1).to_list(500)
    return [strip_id(d) for d in docs]


@api.post("/clients")
async def create_client(payload: Client):
    d = payload.dict()
    await db.clients.insert_one(d)
    return strip_id(d)


@api.put("/clients/{cid}")
async def update_client(cid: str, payload: Dict[str, Any]):
    payload.pop("_id", None); payload.pop("id", None)
    await db.clients.update_one({"id": cid}, {"$set": payload})
    d = await db.clients.find_one({"id": cid})
    return strip_id(d)


@api.delete("/clients/{cid}")
async def delete_client(cid: str):
    await db.clients.delete_one({"id": cid})
    return {"ok": True}


@api.get("/vehicles")
async def list_vehicles(workspaceId: str, clientId: Optional[str] = None):
    q: Dict[str, Any] = {"workspaceId": workspaceId}
    if clientId:
        q["clientId"] = clientId
    docs = await db.vehicles.find(q).sort("createdAt", -1).to_list(500)
    return [strip_id(d) for d in docs]


@api.post("/vehicles")
async def create_vehicle(payload: Vehicle):
    d = payload.dict()
    await db.vehicles.insert_one(d)
    return strip_id(d)


@api.put("/vehicles/{vid}")
async def update_vehicle(vid: str, payload: Dict[str, Any]):
    payload.pop("_id", None); payload.pop("id", None)
    await db.vehicles.update_one({"id": vid}, {"$set": payload})
    d = await db.vehicles.find_one({"id": vid})
    return strip_id(d)


@api.delete("/vehicles/{vid}")
async def delete_vehicle(vid: str):
    await db.vehicles.delete_one({"id": vid})
    return {"ok": True}


@api.get("/invoices")
async def list_invoices(workspaceId: str, q: Optional[str] = None):
    query: Dict[str, Any] = {"workspaceId": workspaceId}
    if q:
        rq = {"$regex": q, "$options": "i"}
        query["$or"] = [
            {"number": rq},
            {"clientSnapshot.name": rq},
            {"vehicleSnapshot.registration": rq},
            {"vehicleSnapshot.vin": rq},
            {"vehicleSnapshot.make": rq},
            {"vehicleSnapshot.model": rq},
        ]
    docs = await db.invoices.find(query).sort("createdAt", -1).to_list(1000)
    return [strip_id(d) for d in docs]


@api.get("/invoices/{iid}")
async def get_invoice(iid: str):
    d = await db.invoices.find_one({"id": iid})
    if not d:
        raise HTTPException(404, "Not found")
    return strip_id(d)


@api.post("/invoices")
async def create_invoice(payload: Dict[str, Any]):
    payload.pop("_id", None)
    ws = payload.get("workspaceId")
    if not ws:
        raise HTTPException(400, "workspaceId required")
    if not payload.get("number"):
        settings = await db.settings.find_one({"workspaceId": ws}) or {}
        activity = payload.get("activityType", "standard")
        doc_type = payload.get("docType", "invoice")
        if activity == "vehicle_purchase":
            prefix = settings.get("purchasePrefix", "ACH")
        elif doc_type == "quote":
            prefix = settings.get("quotePrefix", "DEV")
        elif doc_type == "deposit":
            prefix = settings.get("depositPrefix", "ACP")
        elif doc_type == "credit":
            prefix = settings.get("creditPrefix", "AV")
        else:
            prefix = settings.get("invoicePrefix", "FAC")
        payload["number"] = await next_number(ws, prefix)
    if not payload.get("id"):
        payload["id"] = uid()
    payload["createdAt"] = payload.get("createdAt") or now_iso()
    payload["updatedAt"] = now_iso()
    payload = compute_totals(payload)
    await db.invoices.insert_one(payload)
    return strip_id(payload)


@api.put("/invoices/{iid}")
async def update_invoice(iid: str, payload: Dict[str, Any]):
    payload.pop("_id", None); payload.pop("id", None)
    payload["updatedAt"] = now_iso()
    payload = compute_totals(payload)
    await db.invoices.update_one({"id": iid}, {"$set": payload})
    d = await db.invoices.find_one({"id": iid})
    return strip_id(d)


@api.delete("/invoices/{iid}")
async def delete_invoice(iid: str):
    await db.invoices.delete_one({"id": iid})
    return {"ok": True}


@api.post("/invoices/{iid}/duplicate")
async def duplicate_invoice(iid: str):
    src = await db.invoices.find_one({"id": iid})
    if not src:
        raise HTTPException(404, "Not found")
    src.pop("_id", None)
    new = dict(src)
    new["id"] = uid()
    new["status"] = "draft"
    new["depositPaid"] = 0
    new["alreadyPaid"] = 0
    new["issueDate"] = datetime.utcnow().strftime("%Y-%m-%d")
    new["number"] = ""
    return await create_invoice(new)


@api.get("/settings")
async def get_settings(workspaceId: str):
    d = await db.settings.find_one({"workspaceId": workspaceId})
    if not d:
        d = Settings(workspaceId=workspaceId).dict()
        await db.settings.insert_one(dict(d))
    return strip_id(d)


@api.put("/settings")
async def save_settings(payload: Dict[str, Any]):
    ws = payload.get("workspaceId")
    if not ws:
        raise HTTPException(400, "workspaceId required")
    payload.pop("_id", None)
    await db.settings.update_one({"workspaceId": ws}, {"$set": payload}, upsert=True)
    d = await db.settings.find_one({"workspaceId": ws})
    return strip_id(d)


@api.get("/stats")
async def stats(workspaceId: str):
    invs = await db.invoices.find({"workspaceId": workspaceId}).to_list(5000)
    revenue = sum(i.get("totalTTC", 0) for i in invs if i.get("status") == "paid" and i.get("activityType") != "vehicle_purchase")
    outstanding = sum(i.get("balanceDue", 0) for i in invs if i.get("status") in ("sent", "partial", "overdue", "draft") and i.get("activityType") != "vehicle_purchase")
    repairs = sum(1 for i in invs if i.get("activityType") == "repair")
    sales = sum(1 for i in invs if i.get("activityType") == "vehicle_sale")
    purchases = sum(1 for i in invs if i.get("activityType") == "vehicle_purchase")
    building = sum(1 for i in invs if i.get("activityType") == "building")
    clients_count = await db.clients.count_documents({"workspaceId": workspaceId})
    return {
        "revenue": round(revenue, 2),
        "outstanding": round(outstanding, 2),
        "invoices": len([i for i in invs if i.get("docType") != "quote" and i.get("activityType") != "vehicle_purchase"]),
        "quotes": len([i for i in invs if i.get("docType") == "quote"]),
        "clients": clients_count,
        "repairs": repairs,
        "sales": sales,
        "purchases": purchases,
        "building": building,
    }


# ============ Companies ============
@api.get("/companies")
async def list_companies(workspaceId: str):
    docs = await db.companies.find({"workspaceId": workspaceId}).sort("createdAt", -1).to_list(200)
    return [strip_id(d) for d in docs]


@api.post("/companies")
async def create_company(payload: Company):
    d = payload.dict()
    if d.get("isDefault"):
        await db.companies.update_many({"workspaceId": d["workspaceId"]}, {"$set": {"isDefault": False}})
    # if first company, mark as default
    count = await db.companies.count_documents({"workspaceId": d["workspaceId"]})
    if count == 0:
        d["isDefault"] = True
    await db.companies.insert_one(d)
    return strip_id(d)


@api.put("/companies/{cid}")
async def update_company(cid: str, payload: Dict[str, Any]):
    payload.pop("_id", None); payload.pop("id", None)
    if payload.get("isDefault"):
        cur = await db.companies.find_one({"id": cid})
        if cur:
            await db.companies.update_many({"workspaceId": cur["workspaceId"]}, {"$set": {"isDefault": False}})
    await db.companies.update_one({"id": cid}, {"$set": payload})
    d = await db.companies.find_one({"id": cid})
    return strip_id(d)


@api.delete("/companies/{cid}")
async def delete_company(cid: str):
    await db.companies.delete_one({"id": cid})
    return {"ok": True}


# ============ Chantiers ============
@api.get("/chantiers")
async def list_chantiers(workspaceId: str, companyId: Optional[str] = None, clientId: Optional[str] = None):
    q: Dict[str, Any] = {"workspaceId": workspaceId}
    if companyId: q["companyId"] = companyId
    if clientId: q["clientId"] = clientId
    docs = await db.chantiers.find(q).sort("createdAt", -1).to_list(500)
    return [strip_id(d) for d in docs]


@api.get("/chantiers/{cid}")
async def get_chantier(cid: str):
    d = await db.chantiers.find_one({"id": cid})
    if not d: raise HTTPException(404, "Not found")
    d = strip_id(d)
    # attach related invoices/quotes
    related = await db.invoices.find({"chantierId": cid}).sort("createdAt", -1).to_list(500)
    d["documents"] = [strip_id(r) for r in related]
    expenses = await db.expenses.find({"chantierId": cid}).sort("date", -1).to_list(500)
    d["expenses"] = [strip_id(e) for e in expenses]
    return d


@api.post("/chantiers")
async def create_chantier(payload: Chantier):
    d = payload.dict()
    await db.chantiers.insert_one(d)
    return strip_id(d)


@api.put("/chantiers/{cid}")
async def update_chantier(cid: str, payload: Dict[str, Any]):
    payload.pop("_id", None); payload.pop("id", None)
    await db.chantiers.update_one({"id": cid}, {"$set": payload})
    d = await db.chantiers.find_one({"id": cid})
    return strip_id(d)


@api.delete("/chantiers/{cid}")
async def delete_chantier(cid: str):
    await db.chantiers.delete_one({"id": cid})
    return {"ok": True}


# ============ Expenses ============
@api.get("/expenses")
async def list_expenses(workspaceId: str, chantierId: Optional[str] = None):
    q: Dict[str, Any] = {"workspaceId": workspaceId}
    if chantierId: q["chantierId"] = chantierId
    docs = await db.expenses.find(q).sort("date", -1).to_list(1000)
    return [strip_id(d) for d in docs]


@api.post("/expenses")
async def create_expense(payload: Expense):
    d = payload.dict()
    d["ttc"] = round(float(d.get("ht", 0)) * (1 + float(d.get("vat", 0)) / 100), 2)
    await db.expenses.insert_one(d)
    return strip_id(d)


@api.delete("/expenses/{eid}")
async def delete_expense(eid: str):
    await db.expenses.delete_one({"id": eid})
    return {"ok": True}


# ============ Devis workflow ============
@api.post("/invoices/{iid}/convert-to-invoice")
async def convert_quote_to_invoice(iid: str):
    src = await db.invoices.find_one({"id": iid})
    if not src: raise HTTPException(404, "Not found")
    if src.get("docType") != "quote":
        raise HTTPException(400, "Not a quote")
    src.pop("_id", None)
    new = dict(src)
    new["id"] = uid()
    new["docType"] = "invoice"
    new["status"] = "draft"
    new["issueDate"] = datetime.utcnow().strftime("%Y-%m-%d")
    new["number"] = ""
    new["depositPaid"] = 0
    new["alreadyPaid"] = 0
    new["convertedFromQuoteId"] = src["id"]
    saved = await create_invoice(new)
    # mark original as converted
    await db.invoices.update_one({"id": iid}, {"$set": {"status": "converted", "convertedToInvoiceId": saved["id"]}})
    return saved


@api.post("/invoices/{iid}/deposit-invoice")
async def create_deposit_invoice(iid: str, payload: Dict[str, Any]):
    """payload: {amount OR percent}"""
    src = await db.invoices.find_one({"id": iid})
    if not src: raise HTTPException(404, "Not found")
    src.pop("_id", None)
    amount = float(payload.get("amount") or 0)
    percent = float(payload.get("percent") or 0)
    total_ref = float(src.get("totalTTC") or 0)
    if percent and not amount:
        amount = round(total_ref * percent / 100, 2)
    if amount <= 0:
        raise HTTPException(400, "amount or percent required")
    settings = await db.settings.find_one({"workspaceId": src["workspaceId"]}) or {}
    prefix = settings.get("depositPrefix", "ACP")
    number = await next_number(src["workspaceId"], prefix)
    new = {
        "id": uid(),
        "workspaceId": src["workspaceId"],
        "companyId": src.get("companyId"),
        "companySnapshot": src.get("companySnapshot"),
        "clientId": src.get("clientId"),
        "clientSnapshot": src.get("clientSnapshot"),
        "chantierId": src.get("chantierId"),
        "chantierSnapshot": src.get("chantierSnapshot"),
        "activityType": src.get("activityType", "standard"),
        "docType": "deposit",
        "status": "draft",
        "number": number,
        "issueDate": datetime.utcnow().strftime("%Y-%m-%d"),
        "currency": src.get("currency", "EUR"),
        "linkedInvoiceId": src["id"],
        "taxRegime": src.get("taxRegime", "standard"),
        "lineItems": [{
            "id": uid(),
            "description": f"Acompte {('%.0f' % percent) + '%' if percent else ''} sur {src.get('number', '')}",
            "qty": 1,
            "unitPrice": round(amount / (1 + float(src.get('lineItems',[{}])[0].get('vat',20))/100), 2) if src.get("lineItems") else amount,
            "vat": float(src.get('lineItems',[{}])[0].get('vat', 20)) if src.get("lineItems") else 20,
            "discount": 0,
        }],
        "createdAt": now_iso(),
        "updatedAt": now_iso(),
    }
    new = compute_totals(new)
    await db.invoices.insert_one(new)
    return strip_id(new)


# ============ Analytics ============
@api.get("/analytics")
async def analytics(workspaceId: str, companyId: Optional[str] = None, period: Optional[str] = "year", startDate: Optional[str] = None, endDate: Optional[str] = None):
    q: Dict[str, Any] = {"workspaceId": workspaceId}
    if companyId and companyId != "all":
        q["companyId"] = companyId
    invs = await db.invoices.find(q).to_list(10000)

    # period filter
    def in_period(iso_date):
        if not iso_date: return True
        try:
            d = datetime.strptime(iso_date[:10], "%Y-%m-%d")
        except Exception:
            return True
        today = datetime.utcnow()
        if period == "7":
            return (today - d).days <= 7
        if period == "30":
            return (today - d).days <= 30
        if period == "month":
            return d.year == today.year and d.month == today.month
        if period == "quarter":
            q_start = (today.month - 1) // 3 * 3 + 1
            return d.year == today.year and q_start <= d.month <= q_start + 2
        if period == "year":
            return d.year == today.year
        if period == "custom" and startDate and endDate:
            return startDate <= iso_date[:10] <= endDate
        return True

    filtered = [i for i in invs if in_period(i.get("issueDate"))]
    invoices_only = [i for i in filtered if i.get("docType") in ("invoice", "final", "deposit") and i.get("activityType") != "vehicle_purchase"]
    quotes = [i for i in filtered if i.get("docType") == "quote"]

    revenue_ttc = sum(float(i.get("totalTTC") or 0) for i in invoices_only)
    revenue_ht = sum(float(i.get("subtotalHT") or 0) for i in invoices_only)
    vat_total = sum(float(i.get("totalTax") or 0) for i in invoices_only)
    paid = sum(float(i.get("totalTTC") or 0) for i in invoices_only if i.get("status") == "paid")
    outstanding = sum(float(i.get("balanceDue") or 0) for i in invoices_only if i.get("status") in ("sent", "partial", "draft", "overdue"))

    accepted_amount = sum(float(i.get("totalTTC") or 0) for i in quotes if i.get("status") in ("accepted", "converted"))
    rejected_amount = sum(float(i.get("totalTTC") or 0) for i in quotes if i.get("status") == "refused")
    pending_amount = sum(float(i.get("totalTTC") or 0) for i in quotes if i.get("status") in ("draft", "sent", "viewed"))
    accepted_count = sum(1 for i in quotes if i.get("status") in ("accepted", "converted"))

    # by activity
    by_activity = {}
    for i in invoices_only:
        k = i.get("activityType") or "standard"
        by_activity[k] = round(by_activity.get(k, 0) + float(i.get("totalTTC") or 0), 2)

    # monthly series (last 12 months)
    today = datetime.utcnow()
    months = []
    for offset in range(11, -1, -1):
        y = today.year
        m = today.month - offset
        while m <= 0:
            m += 12; y -= 1
        month_total = 0
        for i in invoices_only:
            if not i.get("issueDate"): continue
            try:
                d = datetime.strptime(i["issueDate"][:10], "%Y-%m-%d")
                if d.year == y and d.month == m:
                    month_total += float(i.get("totalTTC") or 0)
            except Exception:
                pass
        months.append({"label": f"{m:02d}/{y}", "value": round(month_total, 2)})

    # top clients
    top_clients: Dict[str, Dict[str, Any]] = {}
    for i in invoices_only:
        cs = i.get("clientSnapshot") or {}
        name = cs.get("name") or "—"
        top_clients.setdefault(name, {"name": name, "revenue": 0, "count": 0})
        top_clients[name]["revenue"] += float(i.get("totalTTC") or 0)
        top_clients[name]["count"] += 1
    top_clients_list = sorted(top_clients.values(), key=lambda x: x["revenue"], reverse=True)[:5]
    for t in top_clients_list:
        t["revenue"] = round(t["revenue"], 2)

    # aging buckets
    def days_over(due, today_):
        try:
            d = datetime.strptime(due[:10], "%Y-%m-%d")
            return (today_ - d).days
        except Exception:
            return 0
    aging = {"soon": 0, "1_7": 0, "8_30": 0, "31_60": 0, "60_plus": 0}
    for i in invoices_only:
        if i.get("status") not in ("sent", "partial", "overdue", "draft"): continue
        bal = float(i.get("balanceDue") or 0)
        if bal <= 0: continue
        ov = days_over(i.get("dueDate") or i.get("issueDate", ""), today) if i.get("dueDate") else 0
        if ov <= 0:
            aging["soon"] += bal
        elif ov <= 7:
            aging["1_7"] += bal
        elif ov <= 30:
            aging["8_30"] += bal
        elif ov <= 60:
            aging["31_60"] += bal
        else:
            aging["60_plus"] += bal
    aging = {k: round(v, 2) for k, v in aging.items()}

    return {
        "revenueHT": round(revenue_ht, 2),
        "revenueTTC": round(revenue_ttc, 2),
        "vat": round(vat_total, 2),
        "paid": round(paid, 2),
        "outstanding": round(outstanding, 2),
        "invoiceCount": len(invoices_only),
        "quoteCount": len(quotes),
        "quoteAcceptanceRate": round((accepted_count / len(quotes) * 100) if quotes else 0, 1),
        "quoteAccepted": round(accepted_amount, 2),
        "quoteRejected": round(rejected_amount, 2),
        "quotePending": round(pending_amount, 2),
        "byActivity": by_activity,
        "monthly": months,
        "topClients": top_clients_list,
        "aging": aging,
    }


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
