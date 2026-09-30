<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Government AI Portal - Comprehensive Workflow</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #f0f4f8; padding: 20px; display: flex; justify-content: center; }
    .container { width: 100%; max-width: 600px; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    h2 { color: #1a365d; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
    .section { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    button { background: #2563eb; color: white; border: none; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: bold; }
    button:hover { background: #1d4ed8; }
    input { padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; width: calc(100% - 20px); margin-bottom: 10px; }
    .captcha-badge { background: #e2e8f0; font-family: monospace; font-size: 1.2rem; letter-spacing: 4px; padding: 6px 12px; border-radius: 4px; display: inline-block; margin-bottom: 8px; }
  </style>
</head>
<body>

<div class="container">
  <h2>🇮🇳 Scheme Portal & Automation Hub</h2>

  <!-- 1. Voice Query -->
  <div class="section">
    <h3>1. Voice Query Assistant</h3>
    <button id="recordBtn">🎙️ Record Voice Query</button>
    <p id="transcript">Transcript: (Restored from Session Storage)</p>
  </div>

  <!-- 2. Meri Pechhan & DigiLocker -->
  <div class="section">
    <h3>2. Verification & SSO</h3>
    <button onclick="loginMeriPechaan()">🔐 Login with Meri Pechhan</button>
    <button onclick="verifyDigiLocker()">📄 Verify DigiLocker via API Setu</button>
  </div>

  <!-- 3. Automated Application & CAPTCHA -->
  <div class="section">
    <h3>3. Application Guardrail & Playwright Automation</h3>
    <form id="autoForm">
      <input type="text" id="name" placeholder="Full Name" required />
      <input type="text" id="aadhaar" placeholder="Aadhaar Number" required />
      <div>
        <span class="captcha-badge" id="captchaCode">------</span>
        <button type="button" onclick="loadCaptcha()">🔄 Refresh</button>
      </div>
      <input type="text" id="captchaInput" placeholder="Enter CAPTCHA" required />
      <button type="button" onclick="submitAutomatedForm()">🚀 Submit Background Application</button>
    </form>
  </div>

  <!-- 4. Offline PDF Generation -->
  <div class="section">
    <h3>4. Verified Receipts</h3>
    <button onclick="downloadReceipt()">📥 Download PyPDF-Verified Receipt</button>
  </div>
</div>

<script>
  let captchaSessionId = "";

  // Client-Side Session Persistence (IndexedDB / sessionStorage)
  window.onload = () => {
    loadCaptcha();
    const savedTranscript = sessionStorage.getItem('last_transcript');
    if (savedTranscript) {
      document.getElementById('transcript').innerText = "Transcript (Restored): " + savedTranscript;
    }
  };

  async function loadCaptcha() {
    const res = await fetch('/api/security/captcha');
    const data = await res.json();
    captchaSessionId = data.session_id;
    document.getElementById('captchaCode').innerText = data.captcha;
  }

  async function loginMeriPechaan() {
    const res = await fetch('/api/auth/meri-pechaan/login');
    const data = await res.json();
    alert("Redirecting to: " + data.sso_url);
  }

  async function verifyDigiLocker() {
    const res = await fetch('/api/apisetu/digilocker/fetch-doc?aadhaar_number=999988887777&doc_type=Aadhaar');
    const data = await res.json();
    alert("API Setu Verification: " + JSON.stringify(data));
  }

  async function submitAutomatedForm() {
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('aadhaar', document.getElementById('aadhaar').value);
    formData.append('captcha_session', captchaSessionId);
    formData.append('captcha_answer', document.getElementById('captchaInput').value);

    const res = await fetch('/api/scheme/apply-automated', { method: 'POST', body: formData });
    const data = await res.json();
    alert(data.message || data.detail);
    loadCaptcha();
  }

  async function downloadReceipt() {
    const formData = new FormData();
    formData.append('name', 'Rahul Sharma');
    formData.append('scheme', 'PM Vishwakarma');

    const res = await fetch('/api/scheme/download-confirmation', { method: 'POST', body: formData });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "Confirmation_Receipt.pdf";
    a.click();
  }
</script>

</body>
</html>
