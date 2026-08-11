#!/usr/bin/env python3
"""
Comprehensive backend API test for ProFacture AI invoicing platform
Tests all endpoints including standard invoices, repair, vehicle sale, and vehicle purchase
"""

import requests
import json
from typing import Dict, Any, Optional

# Backend URL from frontend/.env
BASE_URL = "https://easy-invoicing-5.preview.emergentagent.com/api"
WORKSPACE_ID = "test-ws-1"

# Store IDs for cross-test references
test_data = {
    "client_id": None,
    "vehicle_id": None,
    "standard_invoice_id": None,
    "repair_invoice_id": None,
    "sale_invoice_id": None,
    "purchase_invoice_id": None,
    "duplicate_invoice_id": None,
}

def print_test(step: int, description: str):
    """Print test step header"""
    print(f"\n{'='*80}")
    print(f"TEST {step}: {description}")
    print('='*80)

def print_result(success: bool, message: str, details: Optional[Dict] = None):
    """Print test result"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status}: {message}")
    if details:
        print(f"Details: {json.dumps(details, indent=2)}")

def verify_response(response: requests.Response, expected_status: int = 200) -> bool:
    """Verify response status code"""
    if response.status_code != expected_status:
        print(f"❌ Expected status {expected_status}, got {response.status_code}")
        print(f"Response: {response.text}")
        return False
    return True

# TEST 1: Root endpoint
print_test(1, "GET /api/ - Root endpoint")
try:
    resp = requests.get(f"{BASE_URL}/")
    if verify_response(resp):
        data = resp.json()
        if data.get("message") == "ProFacture AI API":
            print_result(True, "Root endpoint returns correct message", data)
        else:
            print_result(False, f"Unexpected message: {data}")
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 2: GET settings (should create default if missing)
print_test(2, "GET /api/settings - Get or create default settings")
try:
    resp = requests.get(f"{BASE_URL}/settings", params={"workspaceId": WORKSPACE_ID})
    if verify_response(resp):
        settings = resp.json()
        checks = {
            "companyName exists": "companyName" in settings,
            "defaultHourlyRate is 60": settings.get("defaultHourlyRate") == 60.0,
            "defaultVat is 20": settings.get("defaultVat") == 20.0,
            "invoicePrefix is FAC": settings.get("invoicePrefix") == "FAC",
            "quotePrefix is DEV": settings.get("quotePrefix") == "DEV",
            "purchasePrefix is ACH": settings.get("purchasePrefix") == "ACH",
        }
        all_pass = all(checks.values())
        print_result(all_pass, "Settings validation", checks)
        if not all_pass:
            print(f"Full settings: {json.dumps(settings, indent=2)}")
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 3: PUT settings - Update settings
print_test(3, "PUT /api/settings - Update company settings")
try:
    payload = {
        "workspaceId": WORKSPACE_ID,
        "companyName": "Garage Test",
        "defaultHourlyRate": 65
    }
    resp = requests.put(f"{BASE_URL}/settings", json=payload)
    if verify_response(resp):
        settings = resp.json()
        checks = {
            "companyName updated": settings.get("companyName") == "Garage Test",
            "defaultHourlyRate updated": settings.get("defaultHourlyRate") == 65,
        }
        all_pass = all(checks.values())
        print_result(all_pass, "Settings update", checks)
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 4: POST client - Create a client
print_test(4, "POST /api/clients - Create client Jean Dupont")
try:
    payload = {
        "workspaceId": WORKSPACE_ID,
        "name": "Jean Dupont",
        "company": "",
        "email": "jean@test.com",
        "address": "12 rue Example",
        "city": "Paris",
        "postalCode": "75000",
        "country": "France",
        "clientType": "Particulier"
    }
    resp = requests.post(f"{BASE_URL}/clients", json=payload)
    if verify_response(resp):
        client = resp.json()
        test_data["client_id"] = client.get("id")
        checks = {
            "id exists": "id" in client,
            "name correct": client.get("name") == "Jean Dupont",
            "email correct": client.get("email") == "jean@test.com",
            "city correct": client.get("city") == "Paris",
        }
        all_pass = all(checks.values())
        print_result(all_pass, f"Client created with ID: {test_data['client_id']}", checks)
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 5: GET clients - List clients
print_test(5, "GET /api/clients - List clients for workspace")
try:
    resp = requests.get(f"{BASE_URL}/clients", params={"workspaceId": WORKSPACE_ID})
    if verify_response(resp):
        clients = resp.json()
        found = any(c.get("id") == test_data["client_id"] for c in clients)
        print_result(found, f"Client list contains created client. Total clients: {len(clients)}")
        if not found:
            print(f"Clients: {json.dumps(clients, indent=2)}")
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 6: POST vehicle - Create a vehicle
print_test(6, "POST /api/vehicles - Create BMW vehicle")
try:
    payload = {
        "workspaceId": WORKSPACE_ID,
        "clientId": test_data["client_id"],
        "make": "BMW",
        "model": "Série 3",
        "version": "320d",
        "registration": "AB-123-CD",
        "vin": "WBA123456789TEST",
        "mileage": 128500,
        "fuelType": "Diesel",
        "year": 2018
    }
    resp = requests.post(f"{BASE_URL}/vehicles", json=payload)
    if verify_response(resp):
        vehicle = resp.json()
        test_data["vehicle_id"] = vehicle.get("id")
        checks = {
            "id exists": "id" in vehicle,
            "make correct": vehicle.get("make") == "BMW",
            "model correct": vehicle.get("model") == "Série 3",
            "registration correct": vehicle.get("registration") == "AB-123-CD",
            "mileage correct": vehicle.get("mileage") == 128500,
        }
        all_pass = all(checks.values())
        print_result(all_pass, f"Vehicle created with ID: {test_data['vehicle_id']}", checks)
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 7: GET vehicles - List vehicles for client
print_test(7, "GET /api/vehicles - List vehicles for client")
try:
    resp = requests.get(f"{BASE_URL}/vehicles", params={
        "workspaceId": WORKSPACE_ID,
        "clientId": test_data["client_id"]
    })
    if verify_response(resp):
        vehicles = resp.json()
        found = any(v.get("id") == test_data["vehicle_id"] for v in vehicles)
        print_result(found, f"Vehicle list contains created vehicle. Total vehicles: {len(vehicles)}")
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 8: POST invoice - Create STANDARD invoice
print_test(8, "POST /api/invoices - Create STANDARD invoice")
try:
    payload = {
        "workspaceId": WORKSPACE_ID,
        "activityType": "standard",
        "docType": "invoice",
        "status": "draft",
        "issueDate": "2026-08-11",
        "clientId": test_data["client_id"],
        "clientSnapshot": {
            "name": "Jean Dupont"
        },
        "lineItems": [
            {
                "description": "Consultation",
                "qty": 2,
                "unitPrice": 100,
                "vat": 20,
                "discount": 0
            }
        ],
        "taxRegime": "standard",
        "discount": 0
    }
    resp = requests.post(f"{BASE_URL}/invoices", json=payload)
    if verify_response(resp):
        invoice = resp.json()
        test_data["standard_invoice_id"] = invoice.get("id")
        
        # Verify calculations: 2 * 100 = 200 HT, 20% VAT = 40, Total = 240
        checks = {
            "id exists": "id" in invoice,
            "number starts with FAC-": invoice.get("number", "").startswith("FAC-"),
            "subtotalHT is 200": invoice.get("subtotalHT") == 200.0,
            "totalTax is 40": invoice.get("totalTax") == 40.0,
            "totalTTC is 240": invoice.get("totalTTC") == 240.0,
        }
        all_pass = all(checks.values())
        print_result(all_pass, f"Standard invoice created: {invoice.get('number')}", {
            **checks,
            "subtotalHT": invoice.get("subtotalHT"),
            "totalTax": invoice.get("totalTax"),
            "totalTTC": invoice.get("totalTTC"),
        })
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 9: POST invoice - Create REPAIR invoice
print_test(9, "POST /api/invoices - Create REPAIR invoice with hourly labor")
try:
    payload = {
        "workspaceId": WORKSPACE_ID,
        "activityType": "repair",
        "docType": "invoice",
        "status": "draft",
        "issueDate": "2026-08-11",
        "clientId": test_data["client_id"],
        "clientSnapshot": {
            "name": "Jean Dupont"
        },
        "vehicleSnapshot": {
            "make": "BMW",
            "model": "Série 3",
            "registration": "AB-123-CD",
            "mileage": 128500
        },
        "lineItems": [
            {
                "description": "Vidange",
                "category": "Entretien",
                "qty": 1,
                "unitPrice": 25,
                "vat": 20
            },
            {
                "description": "Main-d'œuvre",
                "category": "Main-d'œuvre",
                "pricingMethod": "hourly",
                "hours": 2.5,
                "unitPrice": 60,
                "vat": 20
            }
        ],
        "worksPerformed": "Vidange + filtre",
        "nextServiceMileage": 145000,
        "taxRegime": "standard",
        "discount": 0
    }
    resp = requests.post(f"{BASE_URL}/invoices", json=payload)
    if verify_response(resp):
        invoice = resp.json()
        test_data["repair_invoice_id"] = invoice.get("id")
        
        # Verify calculations: 25 + (2.5 * 60) = 25 + 150 = 175 HT, 20% VAT = 35, Total = 210
        checks = {
            "id exists": "id" in invoice,
            "number starts with FAC-": invoice.get("number", "").startswith("FAC-"),
            "subtotalHT is 175": invoice.get("subtotalHT") == 175.0,
            "totalTax is 35": invoice.get("totalTax") == 35.0,
            "totalTTC is 210": invoice.get("totalTTC") == 210.0,
            "vehicleSnapshot exists": "vehicleSnapshot" in invoice,
        }
        all_pass = all(checks.values())
        print_result(all_pass, f"Repair invoice created: {invoice.get('number')}", {
            **checks,
            "subtotalHT": invoice.get("subtotalHT"),
            "totalTax": invoice.get("totalTax"),
            "totalTTC": invoice.get("totalTTC"),
        })
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 10: POST invoice - Create VEHICLE SALE with margin tax regime
print_test(10, "POST /api/invoices - Create VEHICLE SALE with margin tax regime")
try:
    payload = {
        "workspaceId": WORKSPACE_ID,
        "activityType": "vehicle_sale",
        "docType": "invoice",
        "status": "draft",
        "issueDate": "2026-08-11",
        "clientId": test_data["client_id"],
        "clientSnapshot": {
            "name": "Jean Dupont"
        },
        "vehicleSnapshot": {
            "make": "Peugeot",
            "model": "3008 GT",
            "registration": "XY-789-ZZ"
        },
        "lineItems": [
            {
                "description": "Peugeot 3008 GT",
                "qty": 1,
                "unitPrice": 18000,
                "vat": 20
            }
        ],
        "taxRegime": "margin",
        "fees": {
            "admin": 150,
            "delivery": 0,
            "other": 0
        },
        "depositPaid": 2000,
        "tradeIn": {
            "enabled": True,
            "make": "Renault",
            "model": "Clio",
            "value": 3500
        },
        "discount": 0
    }
    resp = requests.post(f"{BASE_URL}/invoices", json=payload)
    if verify_response(resp):
        invoice = resp.json()
        test_data["sale_invoice_id"] = invoice.get("id")
        
        # Verify calculations with margin tax regime:
        # subtotalHT = 18000
        # totalTax = 0 (margin regime)
        # totalTTC = 18000 + 150 (fees) = 18150
        # balanceDue = 18150 - 2000 (deposit) - 3500 (trade-in) = 12650
        checks = {
            "id exists": "id" in invoice,
            "number starts with FAC-": invoice.get("number", "").startswith("FAC-"),
            "subtotalHT is 18000": invoice.get("subtotalHT") == 18000.0,
            "totalTax is 0 (margin)": invoice.get("totalTax") == 0.0,
            "totalTTC is 18150": invoice.get("totalTTC") == 18150.0,
            "balanceDue is 12650": invoice.get("balanceDue") == 12650.0,
        }
        all_pass = all(checks.values())
        print_result(all_pass, f"Vehicle sale invoice created: {invoice.get('number')}", {
            **checks,
            "subtotalHT": invoice.get("subtotalHT"),
            "totalTax": invoice.get("totalTax"),
            "totalTTC": invoice.get("totalTTC"),
            "balanceDue": invoice.get("balanceDue"),
        })
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 11: POST invoice - Create VEHICLE PURCHASE
print_test(11, "POST /api/invoices - Create VEHICLE PURCHASE")
try:
    payload = {
        "workspaceId": WORKSPACE_ID,
        "activityType": "vehicle_purchase",
        "docType": "purchase",
        "status": "draft",
        "issueDate": "2026-08-11",
        "sellerSnapshot": {
            "name": "Vendeur X",
            "sellerType": "Particulier"
        },
        "vehicleSnapshot": {
            "make": "Renault",
            "model": "Clio",
            "registration": "CD-456-EF"
        },
        "purchaseInfo": {
            "date": "2026-08-11",
            "price": 8500,
            "method": "Virement bancaire"
        },
        "lineItems": [],
        "discount": 0
    }
    resp = requests.post(f"{BASE_URL}/invoices", json=payload)
    if verify_response(resp):
        invoice = resp.json()
        test_data["purchase_invoice_id"] = invoice.get("id")
        
        checks = {
            "id exists": "id" in invoice,
            "number starts with ACH-": invoice.get("number", "").startswith("ACH-"),
            "activityType is vehicle_purchase": invoice.get("activityType") == "vehicle_purchase",
        }
        all_pass = all(checks.values())
        print_result(all_pass, f"Vehicle purchase created: {invoice.get('number')}", checks)
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 12: GET invoices - Search by registration
print_test(12, "GET /api/invoices - Search by registration AB-123-CD")
try:
    resp = requests.get(f"{BASE_URL}/invoices", params={
        "workspaceId": WORKSPACE_ID,
        "q": "AB-123-CD"
    })
    if verify_response(resp):
        invoices = resp.json()
        found_repair = any(i.get("id") == test_data["repair_invoice_id"] for i in invoices)
        print_result(found_repair, f"Search by registration found repair invoice. Total results: {len(invoices)}")
        if not found_repair:
            print(f"Invoice IDs in results: {[i.get('id') for i in invoices]}")
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 13: GET invoices - Search by make (BMW)
print_test(13, "GET /api/invoices - Search by make BMW")
try:
    resp = requests.get(f"{BASE_URL}/invoices", params={
        "workspaceId": WORKSPACE_ID,
        "q": "BMW"
    })
    if verify_response(resp):
        invoices = resp.json()
        found_repair = any(i.get("id") == test_data["repair_invoice_id"] for i in invoices)
        print_result(found_repair, f"Search by make found repair invoice. Total results: {len(invoices)}")
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 14: POST duplicate invoice
print_test(14, "POST /api/invoices/{id}/duplicate - Duplicate repair invoice")
try:
    if not test_data["repair_invoice_id"]:
        print_result(False, "No repair invoice ID available for duplication")
    else:
        resp = requests.post(f"{BASE_URL}/invoices/{test_data['repair_invoice_id']}/duplicate")
        if verify_response(resp):
            duplicate = resp.json()
            test_data["duplicate_invoice_id"] = duplicate.get("id")
            
            checks = {
                "new id assigned": duplicate.get("id") != test_data["repair_invoice_id"],
                "new number assigned": duplicate.get("number") != "",
                "status is draft": duplicate.get("status") == "draft",
                "depositPaid is 0": duplicate.get("depositPaid") == 0,
                "alreadyPaid is 0": duplicate.get("alreadyPaid") == 0,
            }
            all_pass = all(checks.values())
            print_result(all_pass, f"Duplicate created: {duplicate.get('number')}", checks)
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 15: PUT invoice - Update status to paid
print_test(15, "PUT /api/invoices/{id} - Update repair invoice status to paid")
try:
    if not test_data["repair_invoice_id"]:
        print_result(False, "No repair invoice ID available for update")
    else:
        # First get the current invoice to preserve all fields
        get_resp = requests.get(f"{BASE_URL}/invoices/{test_data['repair_invoice_id']}")
        if verify_response(get_resp):
            current = get_resp.json()
            current["status"] = "paid"
            
            resp = requests.put(f"{BASE_URL}/invoices/{test_data['repair_invoice_id']}", json=current)
            if verify_response(resp):
                updated = resp.json()
                checks = {
                    "status updated to paid": updated.get("status") == "paid",
                }
                print_result(all(checks.values()), "Invoice status updated", checks)
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 16: GET stats - Verify statistics
print_test(16, "GET /api/stats - Verify workspace statistics")
try:
    resp = requests.get(f"{BASE_URL}/stats", params={"workspaceId": WORKSPACE_ID})
    if verify_response(resp):
        stats = resp.json()
        
        # Expected:
        # - revenue: includes paid non-purchase invoices (repair invoice = 210)
        # - repairs: 2 (original + duplicate)
        # - sales: 1
        # - purchases: 1
        # - clients: 1
        
        checks = {
            "revenue > 0": stats.get("revenue", 0) > 0,
            "repairs count": stats.get("repairs") == 2,
            "sales count": stats.get("sales") == 1,
            "purchases count": stats.get("purchases") == 1,
            "clients count": stats.get("clients") == 1,
        }
        all_pass = all(checks.values())
        print_result(all_pass, "Statistics validation", {
            **checks,
            "actual_stats": stats
        })
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 17: DELETE vehicle and client - Cleanup
print_test(17, "DELETE /api/vehicles/{id} and /api/clients/{id} - Cleanup")
try:
    success_count = 0
    
    # Delete vehicle
    if test_data["vehicle_id"]:
        resp = requests.delete(f"{BASE_URL}/vehicles/{test_data['vehicle_id']}")
        if verify_response(resp):
            result = resp.json()
            if result.get("ok"):
                print("✅ Vehicle deleted successfully")
                success_count += 1
            else:
                print(f"❌ Vehicle delete returned: {result}")
    
    # Delete client
    if test_data["client_id"]:
        resp = requests.delete(f"{BASE_URL}/clients/{test_data['client_id']}")
        if verify_response(resp):
            result = resp.json()
            if result.get("ok"):
                print("✅ Client deleted successfully")
                success_count += 1
            else:
                print(f"❌ Client delete returned: {result}")
    
    print_result(success_count == 2, f"Cleanup completed: {success_count}/2 deletions successful")
    
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# Final summary
print("\n" + "="*80)
print("BACKEND API TEST SUMMARY")
print("="*80)
print(f"Test data collected:")
print(f"  Client ID: {test_data['client_id']}")
print(f"  Vehicle ID: {test_data['vehicle_id']}")
print(f"  Standard Invoice ID: {test_data['standard_invoice_id']}")
print(f"  Repair Invoice ID: {test_data['repair_invoice_id']}")
print(f"  Sale Invoice ID: {test_data['sale_invoice_id']}")
print(f"  Purchase Invoice ID: {test_data['purchase_invoice_id']}")
print(f"  Duplicate Invoice ID: {test_data['duplicate_invoice_id']}")
print("="*80)
