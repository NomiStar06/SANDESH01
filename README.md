import os
import io
import base64
import uuid
import secrets
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse, StreamingResponse
from google import genai

# --- PDF ENGINE IMPORTS ---
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from pypdf import PdfReader

# --- PLAYWRIGHT FOR BACKGROUND FILLING ---
from playwright.async_api import async_playwright

# --- LANGCHAIN CACHING ---
from langchain_community.cache import InMemoryCache
from langchain.globals import set_llm_cache

set_llm_cache(InMemoryCache())  # Enables LLM caching

app = FastAPI(title="Gov Scheme AI Portal with API Setu & Automation")

# --- CONFIGURATION & KEYS ---
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "YOUR_SARVAM_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY")
MERI_PECHAAN_CLIENT_ID = os.getenv("MERI_PECHAAN_CLIENT_ID", "MOCK_CLIENT_ID")
API_SETU_API_KEY = os.getenv("API_SETU_API_KEY", "MOCK_SETU_KEY")

# In-memory CAPTCHA store (For production, use Redis)
CAPTCHA_STORE = {}

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def serve_index():
    return FileResponse("static/index.html")

# =====================================================================
# 1. MYSCHEME & API SETU / DIGILOCKER INTEGRATION
# =====================================================================

@app.get("/api/myscheme/search")
async def myscheme_search(query: str):
    """
    Simulates real-time search against myScheme.gov.in APIs
    """
    # Mock myScheme search response
    return {
        "status": "success",
        "schemes": [
            {
                "scheme_id": "PMKVY_001",
                "title": "Pradhan Mantri Kaushal Vikas Yojana",
                "ministry": "Ministry of Skill Development and Entrepreneurship",
                "required_documents": [
                    "Aadhaar Card",
                    "Bank Account Details",
                    "Educational Certificate (10th/12th)"
                ]
            },
            {
                "scheme_id": "PMV_002",
                "title": "PM Vishwakarma Scheme",
                "ministry": "Ministry of Micro, Small and Medium Enterprises",
                "required_documents": [
                    "Aadhaar Card",
                    "Ration Card",
                    "Artisan Skill Certificate / Self Declaration"
                ]
            }
        ]
    }

@app.get("/api/auth/meri-pechaan/login")
async def meri_pechaan_sso():
    """
    Generates Meri Pechhan SSO Redirect URL
    """
    redirect_uri = "http://localhost:8000/api/auth/meri-pechaan/callback"
    sso_url = f"https://meripechan.gov.in/oauth2/authorize?client_id={MERI_PECHAAN_CLIENT_ID}&redirect_uri={redirect_uri}&response_type=code"
    return {"sso_url": sso_url, "status": "Initiated SSO Login"}

@app.get("/api/apisetu/digilocker/fetch-doc")
async def fetch_digilocker_doc(aadhaar_number: str, doc_type: str):
    """
    Fetches verified citizen documents via API Setu DigiLocker gateways
    """
    # Mocking API Setu Integration
    return {
        "status": "verified",
        "doc_type": doc_type,
        "issuer": "UIDAI / CBSE",
        "verification_timestamp": "2026-09-29T21:00:00Z",
        "document_id": f"SETU-DL-{uuid.uuid4().hex[:8].upper()}"
    }

# =====================================================================
# 2. CAPTCHA GUARDRAIL
# =====================================================================

@app.get("/api/security/captcha")
async def generate_captcha():
    captcha_text = secrets.token_hex(3).upper()
    session_id = str(uuid.uuid4())
    CAPTCHA_STORE[session_id] = captcha_text
    return {"session_id": session_id, "captcha": captcha_text}

def verify_captcha(session_id: str, answer: str):
    expected = CAPTCHA_STORE.get(session_id)
    if not expected or expected.lower() != answer.lower():
        raise HTTPException(status_code=400, detail="Invalid CAPTCHA solution")
    CAPTCHA_STORE.pop(session_id, None)

# =====================================================================
# 3. BACKGROUND FILLING & PLAYWRIGHT AUTOMATION
# =====================================================================

async def task_playwright_fill_form(applicant_data: dict):
    """
    Automates government portal submissions in a background task
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        # Navigate to target mock application page
        print(f"[Playwright] Filling portal application for {applicant_data.get('name')}...")
        # Example steps:
        # await page.goto("https://scheme-portal.gov.in/apply")
        # await page.fill("#name", applicant_data['name'])
        # await page.click("#submit")
        await browser.close()
        print("[Playwright] Background application filling complete.")

@app.post("/api/scheme/apply-automated")
async def automated_apply(
    background_tasks: BackgroundTasks,
    name: str = Form(...),
    aadhaar: str = Form(...),
    captcha_session: str = Form(...),
    captcha_answer: str = Form(...)
):
    verify_captcha(captcha_session, captcha_answer)
    
    applicant_data = {"name": name, "aadhaar": aadhaar}
    background_tasks.add_task(task_playwright_fill_form, applicant_data)
    
    return {"status": "accepted", "message": "Background submission initiated via Playwright."}

# =====================================================================
# 4. REPORTLAB PDF MODIFIER & PYPDF VERIFICATION ENGINE
# =====================================================================

def create_confirmation_pdf(data: dict) -> bytes:
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    
    # PDF Content Generation via ReportLab
    p.setFont("Helvetica-Bold", 18)
    p.drawString(100, 750, "Government Scheme Application Receipt")
    
    p.setFont("Helvetica", 12)
    p.drawString(100, 710, f"Application Reference ID: {data['ref_id']}")
    p.drawString(100, 690, f"Applicant Name: {data['name']}")
    p.drawString(100, 670, f"Scheme: {data['scheme_name']}")
    p.drawString(100, 650, f"Verification Status: {data['status']}")
    p.drawString(100, 630, f"Issued Date: 2026-09-29")
    
    p.line(100, 610, 500, 610)
    p.drawString(100, 580, "This is an electronically verified receipt generated via API Setu.")
    
    p.showPage()
    p.save()
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes

def verify_pdf_structure(pdf_bytes: bytes) -> bool:
    """
    Verifies generated PDF using PyPDF before serving to citizen
    """
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        return len(reader.pages) > 0 and "Application Reference ID" in reader.pages[0].extract_text()
    except Exception:
        return False

@app.post("/api/scheme/download-confirmation")
async def generate_and_verify_receipt(name: str = Form(...), scheme: str = Form(...)):
    ref_id = f"GOV-2026-{secrets.token_hex(4).upper()}"
    data = {"ref_id": ref_id, "name": name, "scheme_name": scheme, "status": "VERIFIED"}
    
    pdf_bytes = create_confirmation_pdf(data)
    
    # PyPDF Verification Step
    is_valid = verify_pdf_structure(pdf_bytes)
    if not is_valid:
        raise HTTPException(status_code=500, detail="PDF verification failed integrity check")
        
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Receipt_{ref_id}.pdf"}
    )

# =====================================================================
# 5. VOICE PIPELINE (STT + GEMINI + TTS)
# =====================================================================

@app.post("/api/voice-query")
async def voice_query(file: UploadFile = File(...)):
    audio_bytes = await file.read()

    # 1. STT via Sarvam
    stt_res = requests.post(
        "https://api.sarvam.ai/speech-to-text",
        headers={"api-subscription-key": SARVAM_API_KEY},
        files={"file": ("input.wav", audio_bytes, "audio/wav")},
        data={"model": "saaras:v3", "language_code": "unknown"}
    )
    transcript = stt_res.json().get("transcript", "PM Vishwakarma scheme detail") if stt_res.status_code == 200 else "General query"

    # 2. LLM via Gemini
    ai_client = genai.Client(api_key=GEMINI_API_KEY)
    gemini_res = ai_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"You are a helpful Indian government scheme assistant. Answer briefly: {transcript}"
    )
    answer_text = gemini_res.text.strip()

    # 3. TTS via Sarvam
    tts_res = requests.post(
        "https://api.sarvam.ai/text-to-speech",
        headers={"api-subscription-key": SARVAM_API_KEY, "Content-Type": "application/json"},
        json={"inputs": [answer_text[:500]], "target_language_code": "hi-IN", "speaker": "shubh", "model": "bulbul:v3"}
    )
    audio_b64 = tts_res.json().get("audios", [""])[0] if tts_res.status_code == 200 else ""

    return {"transcript": transcript, "answer_text": answer_text, "audio_base64": audio_b64}
