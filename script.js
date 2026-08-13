document.addEventListener('DOMContentLoaded', () => {
  // Elements - Tabs & Navigation
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Elements - Login Form
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const eyeIcon = document.getElementById('eyeIcon');
  const loginSubmitBtn = document.getElementById('loginSubmitBtn');
  
  // Elements - Direct Message Form
  const messageForm = document.getElementById('messageForm');
  const senderNameInput = document.getElementById('senderName');
  const senderEmailInput = document.getElementById('senderEmail');
  const msgSubjectInput = document.getElementById('msgSubject');
  const messageTextInput = document.getElementById('messageText');
  const msgSubmitBtn = document.getElementById('msgSubmitBtn');
  
  // Elements - Alerts & SMTP Footer
  const statusAlert = document.getElementById('statusAlert');
  const alertIcon = document.getElementById('alertIcon');
  const alertTitle = document.getElementById('alertTitle');
  const alertBody = document.getElementById('alertBody');
  const alertCloseBtn = document.getElementById('alertCloseBtn');
  
  const headerTargetEmail = document.getElementById('headerTargetEmail');
  const smtpBadgePill = document.getElementById('smtpBadgePill');
  const smtpModeText = document.getElementById('smtpModeText');
  const smtpInfoToggleBtn = document.getElementById('smtpInfoToggleBtn');
  const smtpDetailsPanel = document.getElementById('smtpDetailsPanel');
  const smtpDetailsMsg = document.getElementById('smtpDetailsMsg');

  // Elements - Modal Inspector
  const payloadModal = document.getElementById('payloadModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalOkBtn = document.getElementById('modalOkBtn');
  const modalIntro = document.getElementById('modalIntro');
  const modalJsonDisplay = document.getElementById('modalJsonDisplay');

  // Regex Helper
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Initial SMTP Status Verification
  checkSmtpStatus();

  // 1. TAB SWITCHING LOGIC
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      const activeContent = document.getElementById(targetId);
      if (activeContent) {
        activeContent.classList.add('active');
      }
      
      hideAlert();
    });
  });

  // 2. TOGGLE PASSWORD VISIBILITY
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      
      if (isPassword) {
        eyeIcon.innerHTML = `
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
      } else {
        eyeIcon.innerHTML = `
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        `;
      }
    });
  }

  // 3. ALERT / TOAST MESSAGES
  function showAlert(title, body, isSuccess = true) {
    alertTitle.textContent = title;
    alertBody.textContent = body;
    alertIcon.textContent = isSuccess ? '✅' : '⚠️';
    
    statusAlert.className = `status-alert ${isSuccess ? 'success' : 'error'}`;
    statusAlert.classList.remove('hidden');
  }

  function hideAlert() {
    statusAlert.classList.add('hidden');
  }

  alertCloseBtn.addEventListener('click', hideAlert);

  // 4. BUTTON LOADING STATE
  function setBtnLoading(btn, isLoading, defaultText) {
    const textSpan = btn.querySelector('.btn-text');
    const spinnerSpan = btn.querySelector('.btn-spinner');
    
    btn.disabled = isLoading;
    if (isLoading) {
      textSpan.textContent = 'Processing...';
      if (spinnerSpan) spinnerSpan.hidden = false;
    } else {
      textSpan.textContent = defaultText;
      if (spinnerSpan) spinnerSpan.hidden = true;
    }
  }

  // 5. LOGIN FORM SUBMISSION
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!emailRegex.test(email)) {
      showAlert('Invalid Email', 'Please provide a valid email address (e.g. name@domain.com).', false);
      emailInput.focus();
      return;
    }

    if (password.length < 6) {
      showAlert('Weak Password', 'Password must contain at least 6 characters.', false);
      passwordInput.focus();
      return;
    }

    setBtnLoading(loginSubmitBtn, true, 'Sign In & Send Alert');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Please try again.');
      }

      showAlert(
        data.demoMode ? 'Login Success (Demo Mode)' : 'Login Successful!',
        data.message,
        true
      );

      if (data.emailPayload) {
        openModal(
          'Login Alert Notification Payload',
          `Login received! Target email: irfangames1065@gmail.com. Below is the generated email payload:`,
          data.emailPayload
        );
      }
    } catch (err) {
      showAlert('Login Error', err.message || 'Network error occurred.', false);
    } finally {
      setBtnLoading(loginSubmitBtn, false, 'Sign In & Send Alert');
    }
  });

  // 6. DIRECT EMAIL MESSAGE FORM SUBMISSION
  messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const senderName = senderNameInput.value.trim();
    const senderEmail = senderEmailInput.value.trim();
    const subject = msgSubjectInput.value.trim();
    const message = messageTextInput.value.trim();

    if (!senderName) {
      showAlert('Missing Name', 'Please enter your name.', false);
      senderNameInput.focus();
      return;
    }

    if (!emailRegex.test(senderEmail)) {
      showAlert('Invalid Email', 'Please enter a valid sender email address.', false);
      senderEmailInput.focus();
      return;
    }

    if (!message) {
      showAlert('Empty Message', 'Please enter a message to send.', false);
      messageTextInput.focus();
      return;
    }

    setBtnLoading(msgSubmitBtn, true, 'Send Message to Email');

    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderName, senderEmail, subject, message })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to dispatch email.');
      }

      showAlert(
        data.demoMode ? 'Message Dispatched (Demo Mode)' : 'Message Sent!',
        data.message,
        true
      );

      if (data.emailPayload) {
        openModal(
          'Email Message Payload',
          `Message processed! Receiver: irfangames1065@gmail.com. Below is the full email payload details:`,
          data.emailPayload
        );
      }

      // Reset message form on success
      messageTextInput.value = '';
    } catch (err) {
      showAlert('Message Delivery Error', err.message || 'Network error occurred.', false);
    } finally {
      setBtnLoading(msgSubmitBtn, false, 'Send Message to Email');
    }
  });

  // 7. CHECK SMTP STATUS FROM SERVER
  async function checkSmtpStatus() {
    try {
      const res = await fetch('/api/config-status');
      if (!res.ok) return;
      const data = await res.json();

      if (data.targetEmail && headerTargetEmail) {
        headerTargetEmail.textContent = data.targetEmail;
      }

      if (data.smtpConfigured) {
        smtpBadgePill.className = 'smtp-badge-pill ready';
        smtpModeText.textContent = 'Live SMTP Active';
        smtpDetailsMsg.textContent = `Real emails will be sent directly to ${data.targetEmail}.`;
      } else {
        smtpBadgePill.className = 'smtp-badge-pill demo';
        smtpModeText.textContent = 'Interactive Demo Mode';
        smtpDetailsMsg.textContent = data.message;
      }
    } catch (err) {
      console.warn('Could not check SMTP status:', err);
    }
  }

  // 8. SMTP DETAILS ACCORDION
  smtpInfoToggleBtn.addEventListener('click', () => {
    smtpDetailsPanel.classList.toggle('hidden');
    smtpInfoToggleBtn.textContent = smtpDetailsPanel.classList.contains('hidden') ? 'Mode Details' : 'Hide Details';
  });

  // 9. MODAL PAYLOAD INSPECTOR
  function openModal(title, intro, payload) {
    const modalTitle = payloadModal.querySelector('h3');
    if (modalTitle) modalTitle.textContent = title;
    modalIntro.textContent = intro;
    modalJsonDisplay.textContent = JSON.stringify(payload, null, 2);
    payloadModal.classList.remove('hidden');
  }

  function closeModal() {
    payloadModal.classList.add('hidden');
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalOkBtn.addEventListener('click', closeModal);
  payloadModal.addEventListener('click', (e) => {
    if (e.target === payloadModal) closeModal();
  });
});
