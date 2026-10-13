/**
 * MV3 service worker：
 *  1) 代理面板发来的 AI 请求（background 发请求不受页面 CSP / CORS 限制）
 *  2) 读写 AI 接口设置
 *  3) 首次安装 / 点击工具栏图标 → 打开设置页
 *
 * 面板侧只认 { ok, data } / { ok:false, code, message } 这两种应答。
 */
const DEFAULTS = { endpoint: '', apiKey: '', model: '' };

async function getSettings() {
  const raw = await chrome.storage.local.get('aiSettings');
  return Object.assign({}, DEFAULTS, raw && raw.aiSettings ? raw.aiSettings : {});
}

function joinUrl(base, path) {
  return String(base || '').replace(/\/+$/, '') + path;
}

/** 'auto' / 空 → 用设置里的默认模型 */
function pickModel(requested, fallback) {
  const want = String(requested || '').trim();
  if (!want || want === 'auto') return String(fallback || '').trim();
  return want;
}

async function chat(body) {
  const s = await getSettings();
  if (!s.endpoint) return { ok: false, code: 'NO_ENDPOINT', message: '还没配置 AI 接口地址' };
  if (!s.apiKey) return { ok: false, code: 'NO_API_KEY', message: '还没配置 API Key' };
  const model = pickModel(body && body.model, s.model);
  if (!model) return { ok: false, code: 'NO_MODEL', message: '还没填写默认模型名' };

  const payload = {
    model,
    messages: (body && body.messages) || [],
    max_tokens: body && body.max_tokens,
    temperature: body && body.temperature,
  };

  let res;
  try {
    res = await fetch(joinUrl(s.endpoint, '/chat/completions'), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer ' + s.apiKey,
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    return { ok: false, code: 'NETWORK_ERROR', message: String((e && e.message) || e) };
  }

  const text = await res.text();
  if (!res.ok) {
    const code = res.status === 401 || res.status === 403 ? 'INVALID_API_KEY' : 'HTTP_' + res.status;
    return { ok: false, code, message: 'HTTP ' + res.status + ': ' + text.slice(0, 240) };
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    return { ok: false, code: 'BAD_RESPONSE', message: 'AI 接口返回的不是 JSON' };
  }
  return { ok: true, data };
}

async function listModels() {
  const s = await getSettings();
  if (!s.endpoint) return { ok: false, code: 'NO_ENDPOINT', message: '还没配置 AI 接口地址' };
  if (!s.apiKey) return { ok: false, code: 'NO_API_KEY', message: '还没配置 API Key' };
  let res;
  try {
    res = await fetch(joinUrl(s.endpoint, '/models'), {
      headers: { authorization: 'Bearer ' + s.apiKey },
    });
  } catch (e) {
    return { ok: false, code: 'NETWORK_ERROR', message: String((e && e.message) || e) };
  }
  if (!res.ok) {
    const code = res.status === 401 || res.status === 403 ? 'INVALID_API_KEY' : 'HTTP_' + res.status;
    return { ok: false, code, message: 'HTTP ' + res.status };
  }
  const json = await res.json().catch(() => null);
  const arr = Array.isArray(json && json.data) ? json.data : Array.isArray(json) ? json : [];
  return {
    ok: true,
    data: arr
      .filter((m) => m && m.id)
      .map((m) => ({ id: String(m.id), name: String(m.name || m.id) })),
  };
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  const type = msg && msg.type;
  if (type === 'lfmodel.chat') {
    chat(msg.body).then(sendResponse);
    return true;
  }
  if (type === 'lfmodel.listModels') {
    listModels().then(sendResponse);
    return true;
  }
  if (type === 'lfmodel.getSettings') {
    getSettings().then((s) => sendResponse({ ok: true, data: s }));
    return true;
  }
  if (type === 'lfmodel.openOptions') {
    chrome.runtime.openOptionsPage();
    sendResponse({ ok: true });
    return true;
  }
  return false;
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') chrome.runtime.openOptionsPage();
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});
