<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Adhikar AI - Dark Portal</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #121212; /* Dark background */
      color: #e0e0e0;
      padding: 20px;
      display: flex;
      justify-content: center;
      min-height: 100vh;
    }

    .container {
      width: 100%;
      max-width: 700px;
      background: #1e1e1e;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 0 20px rgba(186, 148, 255, 0.3); /* pastel purple glow */
    }

    h1 {
      font-size: 3rem;
      text-align: center;
      color: #b694ff; /* pastel purple */
      text-shadow: 0 0 12px #b694ff, 0 0 20px #a0c4ff; /* purple + soft blue glow */
      margin-bottom: 20px;
      letter-spacing: 3px;
    }

    h2 {
      color: #a0c4ff; /* pastel blue */
      padding-bottom: 8px;
      text-shadow: 0 0 10px #a0c4ff;
    }

    .section {
      background: #2a2a2a;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      box-shadow: inset 0 0 12px rgba(186,148,255,0.2); /* subtle pastel purple inset glow */
    }

    button {
      background: linear-gradient(90deg, #b694ff, #a0c4ff); /* pastel purple to blue gradient */
      color: #121212;
      border: none;
      padding: 10px 18px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 0 12px #b694ff, 0 0 18px #a0c4ff;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    button:hover {
      transform: scale(1.05);
      box-shadow: 0 0 20px #b694ff, 0 0 25px #a0c4ff;
    }

    input {
      padding: 8px;
      border: none;
      border-radius: 4px;
      width: 100%;
      margin-bottom: 10px;
      background: #111;
      color: #b694ff;
      box-shadow: inset 0 0 8px rgba(160,196,255,0.4); /* pastel blue glow inside */
    }

    .captcha-badge {
      background: #111;
      color: #a0c4ff;
      font-family: monospace;
      font-size: 1.2rem;
      letter-spacing: 4px;
      padding: 6px 12px;
      border-radius: 4px;
      display: inline-block;
      margin-bottom: 8px;
      box-shadow: 0 0 10px rgba(186,148,255,0.6); /* pastel purple glow */
    }
  </style>
</head>
<body>

<div class="container">
  <h1>Adhikar AI</h1>
  <h2>🇮🇳 Scheme Portal & Automation Hub</h2>

  <div class="section">
    <h3>1. Voice Query Assistant</h3>
    <button id="recordBtn">🎙️ Record Voice Query</button>
    <p id="transcript">Transcript: (Restored from Session Storage)</p>
  </div>

  <div class="section">
    <h3>2. Verification & SSO</h3>
    <button id="meriBtn">🔐 Login with Meri Pechhan</button>
    <button id="digilockerBtn">📄 Verify DigiLocker via API Setu</button>
  </div>

  <div class="section">
    <h3>3. Application Guardrail & Playwright Automation</h3>
    <form id="autoForm">
      <input type="text" id="name" placeholder="Full Name" required />
      <input type="text" id="aadhaar" placeholder="Aadhaar Number" required />
      <div>
        <span class="captcha-badge" id="captchaCode">------</span>
        <button type="button" id="refreshCaptcha">🔄 Refresh</button>
      </div>
      <input type="text" id="captchaInput" placeholder="Enter CAPTCHA" required />
      <button type="submit">🚀 Submit Background Application</button>
    </form>
  </div>

  <div class="section">
    <h3>4. Verified Receipts</h3>
    <button id="downloadBtn">📥 Download PyPDF-Verified Receipt</button>
  </div>
</div>

</body>
</html>
