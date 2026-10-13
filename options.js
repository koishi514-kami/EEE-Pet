/** 设置页逻辑：读写 chrome.storage 里的 aiSettings */
const el = (id) => document.getElementById(id);
const statusEl = el('status');

function say(text, kind) {
  statusEl.textContent = text;
  statusEl.className = kind || '';
}

async function load() {
  const raw = await chrome.storage.local.get('aiSettings');
  const s = Object.assign({ endpoint: '', apiKey: '', model: '' }, raw && raw.aiSettings);
  el('endpoint').value = s.endpoint;
  el('apiKey').value = s.apiKey;
  el('model').value = s.model;
}

async function save() {
  const s = {
    endpoint: el('endpoint').value.trim(),
    apiKey: el('apiKey').value.trim(),
    model: el('model').value.trim(),
  };
  await chrome.storage.local.set({ aiSettings: s });
  return s;
}

el('save').addEventListener('click', async () => {
  await save();
  say('已保存。回到网页打开小人的面板就能聊了。', 'ok');
});

el('fetchModels').addEventListener('click', async () => {
  const btn = el('fetchModels');
  btn.disabled = true;
  say('正在拉取模型列表…');
  try {
    await save();
    const res = await chrome.runtime.sendMessage({ type: 'lfmodel.listModels' });
    if (!res || res.ok === false) {
      say('拉取失败：' + ((res && res.message) || '后台没有响应'), 'err');
      return;
    }
    const list = res.data || [];
    if (!list.length) {
      say('接口没有返回任何模型，手动填写「默认模型名」也行。', 'err');
      return;
    }
    const names = list.map((m) => m.id);
    const pick = window.prompt('接口里有 ' + names.length + ' 个模型，请输入要用的模型名：\n' + names.slice(0, 60).join('\n'), el('model').value || names[0]);
    if (pick && pick.trim()) {
      el('model').value = pick.trim();
      await save();
      say('已保存模型：' + pick.trim(), 'ok');
    } else {
      say('已取消，模型名没有改动。');
    }
  } catch (e) {
    say('拉取失败：' + String((e && e.message) || e), 'err');
  } finally {
    btn.disabled = false;
  }
});

void load();
