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
    legalFooter: Optional[str] = ""


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
        if activity == "vehicle_purchase":
            prefix = settings.get("purchasePrefix", "ACH")
        elif payload.get("docType") == "quote":
            prefix = settings.get("quotePrefix", "DEV")
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
