(function () {
  'use strict';

  var API = 'https://a94l76zovf.execute-api.ap-northeast-2.amazonaws.com/prod/mail';

  // DOM elements
  var loginSection = document.getElementById('mail-login');
  var appSection = document.getElementById('mail-app');
  var loginForm = document.getElementById('mail-login-form');
  var loginError = document.getElementById('mail-login-error');
  var mailList = document.getElementById('mail-list');
  var mailDetail = document.getElementById('mail-detail');
  var composeOverlay = document.getElementById('mail-compose');
  var composeForm = document.getElementById('mail-compose-form');
  var composeError = document.getElementById('mail-compose-error');
  var tabInbox = document.getElementById('tab-inbox');
  var tabSent = document.getElementById('tab-sent');
  var btnCompose = document.getElementById('mail-compose-btn');
  var btnRefresh = document.getElementById('mail-refresh-btn');
  var btnLogout = document.getElementById('mail-logout-btn');
  var btnDetailBack = document.getElementById('mail-back-btn');
  var btnReply = document.getElementById('mail-reply-btn');
  var btnForward = document.getElementById('mail-forward-btn');

  var currentFolder = 'inbox';
  var currentEmail = null;
  var composeReplyTo = null; // Track reply context separately

  // ── Helpers ──────────────────────────────────────────────
  function getToken() {
    return sessionStorage.getItem('mail-token');
  }

  function setToken(token) {
    sessionStorage.setItem('mail-token', token);
  }

  function clearToken() {
    sessionStorage.removeItem('mail-token');
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function formatDate(dateStr) {
    var d = new Date(dateStr);
    var now = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    var hh = String(d.getHours()).padStart(2, '0');
    var mm = String(d.getMinutes()).padStart(2, '0');

    if (y === now.getFullYear() && m === String(now.getMonth() + 1).padStart(2, '0') && day === String(now.getDate()).padStart(2, '0')) {
      return hh + ':' + mm;
    }
    return m + '.' + day + ' ' + hh + ':' + mm;
  }

  function formatFullDate(dateStr) {
    var d = new Date(dateStr);
    return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  async function apiFetch(path, options) {
    var opts = options || {};
    var headers = opts.headers || {};
    var token = getToken();
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    opts.headers = headers;

    var res = await fetch(API + path, opts);

    if (res.status === 401) {
      clearToken();
      showLogin();
      throw new Error('Unauthorized');
    }

    var data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'API error');
    }
    return data;
  }

  // ── View Switching ─────────────────────────────────────────
  function showLogin() {
    loginSection.style.display = '';
    appSection.style.display = 'none';
    composeOverlay.style.display = 'none';
    mailDetail.style.display = 'none';
    loginError.textContent = '';
    document.title = '로그인 — 메일';
  }

  function showApp() {
    loginSection.style.display = 'none';
    appSection.style.display = '';
    mailList.style.display = '';
    mailDetail.style.display = 'none';
    composeOverlay.style.display = 'none';
    document.title = '메일 — 박성욱';
  }

  function showList() {
    mailList.style.display = '';
    mailDetail.style.display = 'none';
  }

  function showDetail() {
    mailList.style.display = 'none';
    mailDetail.style.display = '';
  }

  function showCompose(prefill) {
    composeOverlay.style.display = '';
    composeError.textContent = '';
    var titleEl = document.getElementById('compose-title');
    var toField = document.getElementById('compose-to');
    var ccField = document.getElementById('compose-cc');
    var subjectField = document.getElementById('compose-subject');
    var bodyField = document.getElementById('compose-body');

    if (prefill) {
      titleEl.textContent = prefill.title || '새 메일 작성';
      toField.value = prefill.to || '';
      ccField.value = prefill.cc || '';
      subjectField.value = prefill.subject || '';
      bodyField.value = prefill.body || '';
    } else {
      titleEl.textContent = '새 메일 작성';
      toField.value = '';
      ccField.value = '';
      subjectField.value = '';
      bodyField.value = '';
    }
    toField.focus();
  }

  function hideCompose() {
    composeOverlay.style.display = 'none';
    composeReplyTo = null;
  }

  // ── Login ──────────────────────────────────────────────────
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    loginError.textContent = '';
    var password = document.getElementById('mail-password').value;
    var btn = loginForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = '인증 중...';

    try {
      var data = await apiFetch('/auth', {
        method: 'POST',
        body: JSON.stringify({ password: password }),
      });
      setToken(data.token);
      showApp();
      loadInbox();
    } catch (err) {
      loginError.textContent = err.message || '로그인에 실패했습니다.';
    } finally {
      btn.disabled = false;
      btn.textContent = '로그인';
    }
  });

  // ── Load Emails ────────────────────────────────────────────
  async function loadInbox() {
    var folderParam = currentFolder === 'sent' ? '?folder=sent' : '';
    mailList.innerHTML = '<div class="mail-loading">메일을 불러오는 중...</div>';

    try {
      var data = await apiFetch('/inbox' + folderParam);
      renderEmailList(data.emails);
    } catch (err) {
      if (err.message !== 'Unauthorized') {
        mailList.innerHTML = '<div class="mail-empty">메일을 불러오지 못했습니다.</div>';
      }
    }
  }

  function renderEmailList(emails) {
    if (!emails || !emails.length) {
      mailList.innerHTML = '<div class="mail-empty">' + (currentFolder === 'sent' ? '보낸 메일이 없습니다.' : '받은 메일이 없습니다.') + '</div>';
      return;
    }

    var html = '';
    emails.forEach(function (email) {
      html += '<div class="mail-item" data-id="' + escapeHtml(email.id) + '">' +
        '<div class="mail-item-header">' +
          '<span class="mail-item-from">' + escapeHtml(email.fromName || email.from) + '</span>' +
          '<time class="mail-item-date">' + formatDate(email.date) + '</time>' +
        '</div>' +
        '<div class="mail-item-subject">' + escapeHtml(email.subject) + '</div>' +
        '<div class="mail-item-preview">' + escapeHtml(email.preview) + '</div>' +
      '</div>';
    });

    mailList.innerHTML = html;

    // Attach click listeners
    var items = mailList.querySelectorAll('.mail-item');
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        loadEmail(item.getAttribute('data-id'));
      });
    });
  }

  // ── Load Single Email ──────────────────────────────────────
  async function loadEmail(id) {
    showDetail();
    var subjectEl = document.getElementById('mail-detail-subject');
    var fromEl = document.getElementById('mail-detail-from');
    var iframe = document.getElementById('mail-detail-iframe');
    var bodyEl = mailDetail.querySelector('.mail-detail-body');
    subjectEl.textContent = '';
    fromEl.textContent = '불러오는 중...';
    // Hide iframe and text body, show loading indicator without destroying iframe
    if (iframe) iframe.style.display = 'none';
    var existingPre = bodyEl ? bodyEl.querySelector('.mail-text-body') : null;
    if (existingPre) existingPre.style.display = 'none';
    // Add or reuse loading indicator
    var loadingEl = bodyEl ? bodyEl.querySelector('.mail-loading') : null;
    if (!loadingEl && bodyEl) {
      loadingEl = document.createElement('div');
      loadingEl.className = 'mail-loading';
      loadingEl.textContent = '메일을 불러오는 중...';
      bodyEl.appendChild(loadingEl);
    }
    if (loadingEl) loadingEl.style.display = '';

    try {
      var email = await apiFetch('/read?id=' + id);
      currentEmail = email;
      if (loadingEl) loadingEl.style.display = 'none';
      renderEmailDetail(email);
    } catch (err) {
      if (loadingEl) loadingEl.textContent = '메일을 불러오지 못했습니다.';
      if (err.message === 'Unauthorized') {
        if (loadingEl) loadingEl.style.display = 'none';
      }
    }
  }

  function renderEmailDetail(email) {
    var subjectEl = document.getElementById('mail-detail-subject');
    var fromEl = document.getElementById('mail-detail-from');
    var toEl = document.getElementById('mail-detail-to');
    var ccEl = document.getElementById('mail-detail-cc');
    var ccRow = document.getElementById('mail-detail-cc-row');
    var dateEl = document.getElementById('mail-detail-date');
    var bodyEl = mailDetail.querySelector('.mail-detail-body');
    var iframe = document.getElementById('mail-detail-iframe');

    subjectEl.textContent = email.subject || '(제목 없음)';
    fromEl.textContent = email.fromName ? email.fromName + ' <' + email.from + '>' : email.from;

    var toStr = (email.to || []).map(function (a) { return a.name ? a.name + ' <' + a.address + '>' : a.address; }).join(', ');
    toEl.textContent = toStr;

    if (email.cc && email.cc.length) {
      ccRow.style.display = '';
      ccEl.textContent = email.cc.map(function (a) { return a.name ? a.name + ' <' + a.address + '>' : a.address; }).join(', ');
    } else {
      ccRow.style.display = 'none';
    }

    dateEl.textContent = formatFullDate(email.date);

    // Render body
    if (email.htmlBody && iframe) {
      iframe.style.display = '';
      iframe.srcdoc = email.htmlBody;
      iframe.onload = function () {
        try {
          var h = iframe.contentDocument.documentElement.scrollHeight;
          iframe.style.height = Math.min(Math.max(h + 32, 200), 800) + 'px';
        } catch (e) { /* cross-origin */ }
      };
    } else if (iframe) {
      iframe.style.display = 'none';
    }

    if (!email.htmlBody && bodyEl) {
      var textPre = bodyEl.querySelector('.mail-text-body');
      if (!textPre) {
        textPre = document.createElement('pre');
        textPre.className = 'mail-text-body';
        bodyEl.appendChild(textPre);
      }
      textPre.textContent = email.textBody || '';
      textPre.style.display = '';
    } else {
      var existingPre = bodyEl ? bodyEl.querySelector('.mail-text-body') : null;
      if (existingPre) existingPre.style.display = 'none';
    }

    // Attachments
    var existingAtt = mailDetail.querySelector('.mail-attachments');
    if (existingAtt) existingAtt.remove();

    if (email.attachments && email.attachments.length) {
      var attDiv = document.createElement('div');
      attDiv.className = 'mail-attachments';
      attDiv.innerHTML = '<p class="mail-attachments-label">첨부파일</p><div class="mail-attachments-list">' +
        email.attachments.map(function (att) {
          var size = att.size < 1024 ? att.size + 'B' : Math.round(att.size / 1024) + 'KB';
          return '<span class="mail-attachment-badge"><span class="mail-attachment-name">' + escapeHtml(att.filename) + '</span> <span class="mail-attachment-size">(' + size + ')</span></span>';
        }).join('') +
        '</div><p style="font-size:0.75rem;color:var(--text-subtle);margin-top:var(--space-xs);">이 버전에서는 첨부파일 다운로드를 지원하지 않습니다.</p>';
      mailDetail.querySelector('.mail-detail-content').appendChild(attDiv);
    }

    document.title = email.subject + ' — 메일';
  }

  // ── Compose & Send ─────────────────────────────────────────
  composeForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    composeError.textContent = '';
    var btn = composeForm.querySelector('button[type="submit"]');
    var btnText = btn.querySelector('.btn-text');
    btn.disabled = true;
    if (btnText) btnText.textContent = '전송 중...';

    var payload = {
      to: document.getElementById('compose-to').value.trim(),
      cc: document.getElementById('compose-cc').value.trim(),
      subject: document.getElementById('compose-subject').value.trim(),
      body: document.getElementById('compose-body').value.trim(),
    };

    if (composeReplyTo) {
      payload.inReplyTo = composeReplyTo;
    }

    try {
      await apiFetch('/send', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      hideCompose();
      composeReplyTo = null;
      if (currentFolder === 'sent') {
        loadInbox();
      }
    } catch (err) {
      composeError.textContent = err.message || '전송에 실패했습니다.';
    } finally {
      btn.disabled = false;
      if (btnText) btnText.textContent = '보내기';
    }
  });

  // ── Event Listeners ────────────────────────────────────────
  // Tabs
  tabInbox.addEventListener('click', function () {
    currentFolder = 'inbox';
    tabInbox.classList.add('active');
    tabSent.classList.remove('active');
    showList();
    loadInbox();
  });

  tabSent.addEventListener('click', function () {
    currentFolder = 'sent';
    tabSent.classList.add('active');
    tabInbox.classList.remove('active');
    showList();
    loadInbox();
  });

  // Compose
  btnCompose.addEventListener('click', function () {
    composeReplyTo = null;
    showCompose();
  });

  // Close compose
  var btnComposeCancel = document.getElementById('mail-compose-cancel');
  var btnComposeClose = document.getElementById('mail-compose-close');
  if (btnComposeCancel) {
    btnComposeCancel.addEventListener('click', hideCompose);
  }
  if (btnComposeClose) {
    btnComposeClose.addEventListener('click', hideCompose);
  }

  // Close compose on overlay click
  composeOverlay.addEventListener('click', function (e) {
    if (e.target === composeOverlay) {
      hideCompose();
    }
  });

  // Refresh
  btnRefresh.addEventListener('click', function () {
    loadInbox();
  });

  // Logout
  btnLogout.addEventListener('click', function () {
    clearToken();
    showLogin();
  });

  // Back from detail
  btnDetailBack.addEventListener('click', function () {
    currentEmail = null;
    showList();
    document.title = '메일 — 박성욱';
  });

  // Reply
  btnReply.addEventListener('click', function () {
    if (!currentEmail) return;
    var replySubject = currentEmail.subject || '';
    if (!/^Re:/i.test(replySubject)) {
      replySubject = 'Re: ' + replySubject;
    }

    var quotedBody = '\n\n--- Original Message ---\n' +
      'From: ' + (currentEmail.fromName || currentEmail.from) + '\n' +
      'Date: ' + formatFullDate(currentEmail.date) + '\n\n' +
      (currentEmail.textBody || '').split('\n').map(function (line) { return '> ' + line; }).join('\n');

    composeReplyTo = currentEmail.id || null;
    showCompose({
      title: '답장',
      to: currentEmail.from,
      cc: '',
      subject: replySubject,
      body: quotedBody,
    });
  });

  // Forward
  if (btnForward) {
    btnForward.addEventListener('click', function () {
      if (!currentEmail) return;
      var fwdSubject = currentEmail.subject || '';
      if (!/^Fwd:/i.test(fwdSubject)) {
        fwdSubject = 'Fwd: ' + fwdSubject;
      }

      var fwdBody = '\n\n---------- Forwarded message ----------\n' +
        'From: ' + (currentEmail.fromName || currentEmail.from) + '\n' +
        'Date: ' + formatFullDate(currentEmail.date) + '\n' +
        'Subject: ' + (currentEmail.subject || '') + '\n' +
        'To: ' + (currentEmail.to || []).map(function (a) { return a.name ? a.name + ' <' + a.address + '>' : a.address; }).join(', ') + '\n\n' +
        (currentEmail.textBody || '');

      composeReplyTo = null;
      showCompose({
        title: '전달',
        to: '',
        cc: '',
        subject: fwdSubject,
        body: fwdBody,
      });
    });
  }

  // Keyboard shortcut: Escape to close compose
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && composeOverlay.style.display !== 'none') {
      hideCompose();
    }
  });

  // ── Init ───────────────────────────────────────────────────
  if (getToken()) {
    showApp();
    loadInbox();
  } else {
    showLogin();
  }
})();
