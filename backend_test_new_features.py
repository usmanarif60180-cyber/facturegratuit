#!/usr/bin/env python3
"""
Backend API test for NEW ProFacture AI features:
- Companies CRUD with isDefault logic
- Chantiers CRUD
- Building invoices with sections and hourly pricing
- Quote to invoice conversion
- Deposit invoice creation
- Analytics endpoint with filters
- Expenses CRUD
"""

import requests
import json
from typing import Dict, Any, Optional

# Backend URL from frontend/.env
BASE_URL = "https://easy-invoicing-5.preview.emergentagent.com/api"
WORKSPACE_ID = "test-ws-v3"

# Store IDs for cross-test references
test_data = {
    "first_company_id": None,
    "second_company_id": None,
    "chantier_id": None,
    "client_id": None,
    "quote_id": None,
    "invoice_id": None,
    "deposit_id": None,
    "expense_id": None,
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

# TEST 1: POST /api/companies - Create first company (should be default)
print_test(1, "POST /api/companies - Create first company SARL Dupont Bâtiment")
try:
    payload = {
        "workspaceId": WORKSPACE_ID,
        "tradeName": "SARL Dupont Bâtiment",
        "legalName": "Dupont SARL",
        "legalForm": "SARL",
        "siret": "12345678900001",
        "vatNumber": "FR12345678900",
        "address": "12 rue Example",
        "postalCode": "75000",
        "city": "Paris",
        "phone": "0100000000",
        "email": "contact@dupont.fr",
        "iban": "FR76...",
        "bic": "BNPAFRPP",
        "logoBase64": "data:image/png;base64,iVBORw0KGgo=",
        "stampBase64": "data:image/png;base64,iVBORw0KGgo=",
        "accentColor": "#f59e0b",
        "defaultTerms": "Paiement à 30j"
    }
    resp = requests.post(f"{BASE_URL}/companies", json=payload)
    if verify_response(resp):
        company = resp.json()
        test_data["first_company_id"] = company.get("id")
        checks = {
            "id exists": "id" in company,
            "tradeName correct": company.get("tradeName") == "SARL Dupont Bâtiment",
            "isDefault is True (first company)": company.get("isDefault") == True,
            "siret correct": company.get("siret") == "12345678900001",
        }
        all_pass = all(checks.values())
        print_result(all_pass, f"First company created with ID: {test_data['first_company_id']}", checks)
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 2: POST /api/companies - Create second company (should NOT be default)
print_test(2, "POST /api/companies - Create second company Dupont Auto")
try:
    payload = {
        "workspaceId": WORKSPACE_ID,
        "tradeName": "Dupont Auto",
        "siret": "22222222200002"
    }
    resp = requests.post(f"{BASE_URL}/companies", json=payload)
    if verify_response(resp):
        company = resp.json()
        test_data["second_company_id"] = company.get("id")
        checks = {
            "id exists": "id" in company,
            "tradeName correct": company.get("tradeName") == "Dupont Auto",
            "isDefault is False (second company)": company.get("isDefault") == False,
        }
        all_pass = all(checks.values())
        print_result(all_pass, f"Second company created with ID: {test_data['second_company_id']}", checks)
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 3: GET /api/companies - List companies
print_test(3, "GET /api/companies - List companies for workspace")
try:
    resp = requests.get(f"{BASE_URL}/companies", params={"workspaceId": WORKSPACE_ID})
    if verify_response(resp):
        companies = resp.json()
        checks = {
            "at least 2 companies": len(companies) >= 2,
            "first company found": any(c.get("id") == test_data["first_company_id"] for c in companies),
            "second company found": any(c.get("id") == test_data["second_company_id"] for c in companies),
        }
        all_pass = all(checks.values())
        print_result(all_pass, f"Companies list retrieved. Total: {len(companies)}", checks)
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 4: PUT /api/companies/{id} - Make second company default
print_test(4, "PUT /api/companies/{id} - Make second company default")
try:
    if not test_data["second_company_id"]:
        print_result(False, "No second company ID available")
    else:
        payload = {
            "tradeName": "Dupont Auto",
            "isDefault": True
        }
        resp = requests.put(f"{BASE_URL}/companies/{test_data['second_company_id']}", json=payload)
        if verify_response(resp):
            company = resp.json()
            checks = {
                "isDefault is True": company.get("isDefault") == True,
            }
            
            # Verify first company is no longer default
            resp2 = requests.get(f"{BASE_URL}/companies", params={"workspaceId": WORKSPACE_ID})
            if verify_response(resp2):
                companies = resp2.json()
                first_company = next((c for c in companies if c.get("id") == test_data["first_company_id"]), None)
                if first_company:
                    checks["first company isDefault is False"] = first_company.get("isDefault") == False
            
            all_pass = all(checks.values())
            print_result(all_pass, "Second company is now default, first is not", checks)
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 5: POST /api/chantiers - Create chantier
print_test(5, "POST /api/chantiers - Create chantier Rénovation Dupont")
try:
    payload = {
        "workspaceId": WORKSPACE_ID,
        "name": "Rénovation Dupont",
        "reference": "CH-001",
        "address": "15 rue Test",
        "city": "Paris",
        "postalCode": "75015",
        "status": "in_progress",
        "budget": 25000,
        "clientId": None
    }
    resp = requests.post(f"{BASE_URL}/chantiers", json=payload)
    if verify_response(resp):
        chantier = resp.json()
        test_data["chantier_id"] = chantier.get("id")
        checks = {
            "id exists": "id" in chantier,
            "name correct": chantier.get("name") == "Rénovation Dupont",
            "reference correct": chantier.get("reference") == "CH-001",
            "status correct": chantier.get("status") == "in_progress",
            "budget correct": chantier.get("budget") == 25000,
        }
        all_pass = all(checks.values())
        print_result(all_pass, f"Chantier created with ID: {test_data['chantier_id']}", checks)
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 6: GET /api/chantiers - List chantiers
print_test(6, "GET /api/chantiers - List chantiers for workspace")
try:
    resp = requests.get(f"{BASE_URL}/chantiers", params={"workspaceId": WORKSPACE_ID})
    if verify_response(resp):
        chantiers = resp.json()
        found = any(c.get("id") == test_data["chantier_id"] for c in chantiers)
        print_result(found, f"Chantier list contains created chantier. Total: {len(chantiers)}")
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 7: POST /api/clients - Create client for invoices
print_test(7, "POST /api/clients - Create client Jean Dupont")
try:
    payload = {
        "workspaceId": WORKSPACE_ID,
        "name": "Jean Dupont",
        "email": "jean.dupont@test.com",
        "address": "10 rue Client",
        "city": "Paris",
        "postalCode": "75001",
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
        }
        all_pass = all(checks.values())
        print_result(all_pass, f"Client created with ID: {test_data['client_id']}", checks)
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 8: POST /api/invoices - Create BUILDING QUOTE with sections
print_test(8, "POST /api/invoices - Create BUILDING QUOTE with sections and hourly pricing")
try:
    payload = {
        "workspaceId": WORKSPACE_ID,
        "activityType": "building",
        "docType": "quote",
        "status": "draft",
        "issueDate": "2026-08-11",
        "validityDate": "2026-09-11",
        "clientId": test_data["client_id"],
        "clientSnapshot": {
            "name": "Jean Dupont"
        },
        "companyId": test_data["first_company_id"],
        "companySnapshot": {
            "tradeName": "SARL Dupont Bâtiment"
        },
        "chantierId": test_data["chantier_id"],
        "chantierSnapshot": {
            "name": "Rénovation Dupont"
        },
        "lineItems": [
            {
                "description": "Peinture murs",
                "category": "Peinture",
                "unit": "m²",
                "sectionName": "Peinture",
                "qty": 50,
                "unitPrice": 25,
                "vat": 20
            },
            {
                "description": "Main-d'œuvre",
                "category": "Main-d'œuvre",
                "sectionName": "Peinture",
                "pricingMethod": "hourly",
                "hours": 8,
                "unitPrice": 45,
                "vat": 20
            }
        ],
        "taxRegime": "standard",
        "discount": 0
    }
    resp = requests.post(f"{BASE_URL}/invoices", json=payload)
    if verify_response(resp):
        quote = resp.json()
        test_data["quote_id"] = quote.get("id")
        
        # Verify calculations: 50*25 + 8*45 = 1250 + 360 = 1610 HT, 20% VAT = 322, Total = 1932
        checks = {
            "id exists": "id" in quote,
            "number starts with DEV-": quote.get("number", "").startswith("DEV-"),
            "docType is quote": quote.get("docType") == "quote",
            "activityType is building": quote.get("activityType") == "building",
            "subtotalHT is 1610": quote.get("subtotalHT") == 1610.0,
            "totalTax is 322": quote.get("totalTax") == 322.0,
            "totalTTC is 1932": quote.get("totalTTC") == 1932.0,
            "chantierId linked": quote.get("chantierId") == test_data["chantier_id"],
        }
        all_pass = all(checks.values())
        print_result(all_pass, f"Building quote created: {quote.get('number')}", {
            **checks,
            "subtotalHT": quote.get("subtotalHT"),
            "totalTax": quote.get("totalTax"),
            "totalTTC": quote.get("totalTTC"),
        })
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 9: POST /api/invoices/{id}/convert-to-invoice - Convert quote to invoice
print_test(9, "POST /api/invoices/{id}/convert-to-invoice - Convert quote to invoice")
try:
    if not test_data["quote_id"]:
        print_result(False, "No quote ID available for conversion")
    else:
        resp = requests.post(f"{BASE_URL}/invoices/{test_data['quote_id']}/convert-to-invoice")
        if verify_response(resp):
            invoice = resp.json()
            test_data["invoice_id"] = invoice.get("id")
            
            checks = {
                "new id assigned": invoice.get("id") != test_data["quote_id"],
                "number starts with FAC-": invoice.get("number", "").startswith("FAC-"),
                "docType is invoice": invoice.get("docType") == "invoice",
                "status is draft": invoice.get("status") == "draft",
                "convertedFromQuoteId matches": invoice.get("convertedFromQuoteId") == test_data["quote_id"],
                "totals preserved": invoice.get("totalTTC") == 1932.0,
            }
            
            # Verify original quote status is "converted"
            resp2 = requests.get(f"{BASE_URL}/invoices/{test_data['quote_id']}")
            if verify_response(resp2):
                original_quote = resp2.json()
                checks["original quote status is converted"] = original_quote.get("status") == "converted"
                checks["original quote has convertedToInvoiceId"] = original_quote.get("convertedToInvoiceId") == test_data["invoice_id"]
            
            all_pass = all(checks.values())
            print_result(all_pass, f"Quote converted to invoice: {invoice.get('number')}", checks)
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 10: POST /api/invoices/{id}/deposit-invoice - Create deposit invoice
print_test(10, "POST /api/invoices/{id}/deposit-invoice - Create 30% deposit invoice")
try:
    if not test_data["invoice_id"]:
        print_result(False, "No invoice ID available for deposit")
    else:
        payload = {
            "percent": 30
        }
        resp = requests.post(f"{BASE_URL}/invoices/{test_data['invoice_id']}/deposit-invoice", json=payload)
        if verify_response(resp):
            deposit = resp.json()
            test_data["deposit_id"] = deposit.get("id")
            
            # Expected: 30% of 1932 = 579.6
            expected_total = round(1932.0 * 0.30, 2)
            
            checks = {
                "id exists": "id" in deposit,
                "number starts with ACP-": deposit.get("number", "").startswith("ACP-"),
                "docType is deposit": deposit.get("docType") == "deposit",
                "linkedInvoiceId set": deposit.get("linkedInvoiceId") == test_data["invoice_id"],
                "totalTTC approximately 579.6": abs(deposit.get("totalTTC", 0) - expected_total) < 1,
            }
            all_pass = all(checks.values())
            print_result(all_pass, f"Deposit invoice created: {deposit.get('number')}", {
                **checks,
                "totalTTC": deposit.get("totalTTC"),
                "expected": expected_total,
            })
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 11: GET /api/analytics - Get analytics for year
print_test(11, "GET /api/analytics - Get analytics for year")
try:
    resp = requests.get(f"{BASE_URL}/analytics", params={
        "workspaceId": WORKSPACE_ID,
        "period": "year"
    })
    if verify_response(resp):
        analytics = resp.json()
        
        checks = {
            "revenueHT exists": "revenueHT" in analytics,
            "revenueTTC exists": "revenueTTC" in analytics,
            "vat exists": "vat" in analytics,
            "paid exists": "paid" in analytics,
            "outstanding exists": "outstanding" in analytics,
            "invoiceCount exists": "invoiceCount" in analytics,
            "quoteCount exists": "quoteCount" in analytics,
            "quoteAcceptanceRate exists": "quoteAcceptanceRate" in analytics,
            "byActivity exists": "byActivity" in analytics,
            "byActivity has building": "building" in analytics.get("byActivity", {}),
            "monthly exists": "monthly" in analytics,
            "monthly has 12 entries": len(analytics.get("monthly", [])) == 12,
            "topClients exists": "topClients" in analytics,
            "topClients is list": isinstance(analytics.get("topClients"), list),
            "aging exists": "aging" in analytics,
            "aging has soon": "soon" in analytics.get("aging", {}),
            "aging has 1_7": "1_7" in analytics.get("aging", {}),
            "aging has 8_30": "8_30" in analytics.get("aging", {}),
            "aging has 31_60": "31_60" in analytics.get("aging", {}),
            "aging has 60_plus": "60_plus" in analytics.get("aging", {}),
        }
        all_pass = all(checks.values())
        print_result(all_pass, "Analytics structure validated", {
            **checks,
            "sample_data": {
                "revenueHT": analytics.get("revenueHT"),
                "revenueTTC": analytics.get("revenueTTC"),
                "invoiceCount": analytics.get("invoiceCount"),
                "quoteCount": analytics.get("quoteCount"),
                "byActivity": analytics.get("byActivity"),
            }
        })
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 12: GET /api/analytics - Get analytics with companyId filter
print_test(12, "GET /api/analytics - Get analytics filtered by companyId")
try:
    if not test_data["first_company_id"]:
        print_result(False, "No company ID available for filter")
    else:
        resp = requests.get(f"{BASE_URL}/analytics", params={
            "workspaceId": WORKSPACE_ID,
            "period": "year",
            "companyId": test_data["first_company_id"]
        })
        if verify_response(resp):
            analytics = resp.json()
            checks = {
                "response received": analytics is not None,
                "structure valid": "revenueHT" in analytics and "byActivity" in analytics,
            }
            all_pass = all(checks.values())
            print_result(all_pass, "Analytics with companyId filter works", checks)
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 13: POST /api/expenses - Create expense
print_test(13, "POST /api/expenses - Create expense for chantier")
try:
    if not test_data["chantier_id"]:
        print_result(False, "No chantier ID available for expense")
    else:
        payload = {
            "workspaceId": WORKSPACE_ID,
            "chantierId": test_data["chantier_id"],
            "date": "2026-08-11",
            "supplier": "Castorama",
            "category": "Matériaux",
            "description": "Peinture",
            "ht": 200,
            "vat": 20
        }
        resp = requests.post(f"{BASE_URL}/expenses", json=payload)
        if verify_response(resp):
            expense = resp.json()
            test_data["expense_id"] = expense.get("id")
            
            # Expected: 200 HT * 1.20 = 240 TTC
            checks = {
                "id exists": "id" in expense,
                "ht correct": expense.get("ht") == 200,
                "vat correct": expense.get("vat") == 20,
                "ttc computed correctly": expense.get("ttc") == 240,
                "supplier correct": expense.get("supplier") == "Castorama",
            }
            all_pass = all(checks.values())
            print_result(all_pass, f"Expense created with ID: {test_data['expense_id']}", checks)
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 14: GET /api/chantiers/{id} - Get chantier with documents and expenses
print_test(14, "GET /api/chantiers/{id} - Get chantier with documents and expenses")
try:
    if not test_data["chantier_id"]:
        print_result(False, "No chantier ID available")
    else:
        resp = requests.get(f"{BASE_URL}/chantiers/{test_data['chantier_id']}")
        if verify_response(resp):
            chantier = resp.json()
            
            checks = {
                "id matches": chantier.get("id") == test_data["chantier_id"],
                "documents array exists": "documents" in chantier,
                "documents is list": isinstance(chantier.get("documents"), list),
                "expenses array exists": "expenses" in chantier,
                "expenses is list": isinstance(chantier.get("expenses"), list),
                "has quote in documents": any(d.get("id") == test_data["quote_id"] for d in chantier.get("documents", [])),
                "has invoice in documents": any(d.get("id") == test_data["invoice_id"] for d in chantier.get("documents", [])),
                "has deposit in documents": any(d.get("id") == test_data["deposit_id"] for d in chantier.get("documents", [])),
                "has expense": any(e.get("id") == test_data["expense_id"] for e in chantier.get("expenses", [])),
            }
            all_pass = all(checks.values())
            print_result(all_pass, "Chantier detail includes documents and expenses", {
                **checks,
                "documents_count": len(chantier.get("documents", [])),
                "expenses_count": len(chantier.get("expenses", [])),
            })
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# TEST 15: DELETE /api/expenses/{id} - Cleanup expense
print_test(15, "DELETE /api/expenses/{id} - Delete expense")
try:
    if not test_data["expense_id"]:
        print_result(False, "No expense ID available for deletion")
    else:
        resp = requests.delete(f"{BASE_URL}/expenses/{test_data['expense_id']}")
        if verify_response(resp):
            result = resp.json()
            checks = {
                "ok is True": result.get("ok") == True,
            }
            print_result(all(checks.values()), "Expense deleted successfully", checks)
except Exception as e:
    print_result(False, f"Exception: {str(e)}")

# Final summary
print("\n" + "="*80)
print("NEW FEATURES BACKEND API TEST SUMMARY")
print("="*80)
print(f"Test data collected:")
print(f"  First Company ID: {test_data['first_company_id']}")
print(f"  Second Company ID: {test_data['second_company_id']}")
print(f"  Chantier ID: {test_data['chantier_id']}")
print(f"  Client ID: {test_data['client_id']}")
print(f"  Quote ID: {test_data['quote_id']}")
print(f"  Invoice ID: {test_data['invoice_id']}")
print(f"  Deposit ID: {test_data['deposit_id']}")
print(f"  Expense ID: {test_data['expense_id']}")
print("="*80)
print("\nAll 15 tests completed. Review results above for any failures.")
print("="*80)
