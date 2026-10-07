'use strict';
/* SAOUDA NAILS — Constantes, utilitários, toasts, modais, formulário genérico e componentes reutilizáveis. */

/* ========== CONSTANTES ========== */
const DB_KEY = 'SAOUDA-NAILS-db';
const FPG = ['Pix', 'Dinheiro', 'Débito', 'Crédito', 'Outro'];
const TIPOS = [['recebimento', 'Recebimento'], ['despesa', 'Despesa'], ['divida', 'Dívida'], ['extra', 'Gasto extra / besteira']];
const SN = [['sim', 'Sim'], ['nao', 'Não']];
const QS = [['diabetes', 'Diabetes?'], ['gravida', 'Grávida?'], ['alergia', 'Alergia?'], ['alergiaUnhas', 'Alergia a produtos de unhas?'], ['micose', 'Micose/infecção?'], ['feridas', 'Feridas/lesões?'], ['pele', 'Problema de pele?'], ['reacao', 'Reação anterior a produtos?'], ['medicamentos', 'Usa medicamentos?'], ['dor', 'Dor/sensibilidade/irritação?']];
const PER = [['hoje', 'Hoje'], ['semana', 'Semana'], ['mes', 'Mês atual'], ['ant', 'Mês anterior'], ['prox', 'Próximo mês'], ['custom', 'Período personalizado'], ['todos', 'Todo o período']];
const ROTAS = [['dashboard', '🏠', 'Dashboard', 'Início'], ['clientes', '👩', 'Clientes', 'Clientes'], ['anamnese', '📋', 'Anamnese', 'Ficha'], ['atendimentos', '💅', 'Atendimentos', 'Atend.'], ['dinheiro', '💰', 'Dinheiro', 'Dinheiro'], ['resumo', '📊', 'Resumo', 'Resumo'], ['config', '⚙️', 'Configurações', 'Config']];

/* ========== UTILS ========== */
const $ = (s, r = document) => r.querySelector(s);
const el = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) e.setAttribute(k, v);
  }
  kids.flat().forEach(c => { if (c !== null && c !== undefined && c !== false) e.append(c.nodeType ? c : document.createTextNode(String(c))); });
  return e;
};
const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = () => iso(new Date());
const fdate = s => s ? s.split('-').reverse().join('/') : '—';
const brl = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
const digits = s => String(s || '').replace(/\D/g, '');
const validDate = s => /^\d{4}-\d{2}-\d{2}$/.test(s) && iso(new Date(s + 'T00:00:00')) === s;
const num = s => {
  s = String(s).trim().replace(/[R$\s]/g, '');
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  const n = Number(s);
  return s !== '' && isFinite(n) ? n : NaN;
};
const match = (q, ...f) => !q || f.some(x => String(x || '').toLowerCase().includes(q.toLowerCase()));
const tipoLabel = v => (TIPOS.find(t => t[0] === v) || [])[1] || v;

/* ========== UI: TOAST, MODAIS ========== */
function toast(msg, erro) {
  const t = el('div', { class: 'toast' + (erro ? ' err' : ''), role: 'status' }, msg);
  $('#toasts').append(t);
  setTimeout(() => t.remove(), 3200);
}
function dialog(...kids) {
  const d = el('dialog', {}, kids);
  d.addEventListener('close', () => d.remove());
  document.body.append(d);
  d.showModal();
  return d;
}
function ask(msg, okLabel, fn) {
  const d = dialog(el('p', {}, msg), el('div', { class: 'mfoot' },
    el('button', { class: 'btn', type: 'button', onclick: () => d.close() }, 'Cancelar'),
    el('button', { class: 'btn pri', type: 'button', onclick: () => { d.close(); fn(); } }, okLabel)));
}
function info(title, ...nodes) {
  const d = dialog(el('h2', {}, title), nodes, el('div', { class: 'mfoot' }, el('button', { class: 'btn', type: 'button', onclick: () => d.close() }, 'Fechar')));
}
/* Formulário genérico guiado por especificação de campos */
function openForm(title, fields, v, onSave) {
  const err = el('p', { class: 'err', role: 'alert' });
  const f = el('form', { novalidate: 'novalidate' }, el('h2', {}, title));
  fields.forEach(x => {
    const id = 'f_' + x.k;
    let i;
    if (x.t === 'select') {
      i = el('select', { id, name: x.k }, el('option', { value: '' }, 'Selecione…'), x.o.map(([a, b]) => el('option', { value: a }, b)));
      i.value = v[x.k] || '';
    } else if (x.t === 'textarea') {
      i = el('textarea', { id, name: x.k, rows: 3 }); i.value = v[x.k] || '';
    } else if (x.t === 'radio') {
      i = el('div', { class: 'opts', role: 'radiogroup', 'aria-label': x.l }, SN.map(([a, b]) => el('label', { class: 'opt' }, el('input', { type: 'radio', name: x.k, value: a, checked: v[x.k] === a }), b)));
    } else {
      i = el('input', { id, name: x.k, type: x.t === 'money' ? 'text' : x.t, inputmode: x.t === 'money' ? 'decimal' : null, list: x.dl ? 'dl_' + x.k : null });
      i.value = x.t === 'money' && typeof v[x.k] === 'number' ? String(v[x.k]).replace('.', ',') : (v[x.k] || '');
    }
    f.append(el('div', { class: 'fld' }, x.t === 'radio' ? el('span', { class: 'lbl' }, x.l) : el('label', { for: id }, x.l), i,
      x.dl ? el('datalist', { id: 'dl_' + x.k }, x.dl.map(o => el('option', { value: o }))) : null));
  });
  const d = dialog(f);
  f.append(err, el('div', { class: 'mfoot' },
    el('button', { class: 'btn', type: 'button', onclick: () => d.close() }, 'Cancelar'),
    el('button', { class: 'btn pri', type: 'submit' }, 'Salvar')));
  f.addEventListener('submit', e => {
    e.preventDefault();
    const out = {};
    for (const x of fields) {
      const raw = x.t === 'radio' ? ((f.querySelector(`input[name="${x.k}"]:checked`) || {}).value || '') : f.elements[x.k].value.trim();
      let msg = '';
      if (x.req && !raw) msg = x.m || 'Preencha este campo.';
      else if (raw && x.t === 'tel' && (digits(raw).length < 10 || digits(raw).length > 13)) msg = 'Informe um WhatsApp válido, com DDD.';
      else if (raw && x.t === 'date' && (!validDate(raw) || (x.past && raw > today()))) msg = 'Informe uma data válida.';
      else if (x.t === 'money' && (x.req || raw) && !(num(raw) > 0)) msg = 'Informe um valor válido.';
      if (msg) { err.textContent = msg; const t = f.elements[x.k]; if (t && t.focus) t.focus(); return; }
      out[x.k] = x.t === 'money' ? num(raw) : raw;
    }
    const r = onSave(out);
    if (r) err.textContent = r; else d.close();
  });
}
function del(col, id, after) {
  ask('Tem certeza que deseja excluir este registro?', 'Excluir', () => {
    db[col] = db[col].filter(x => x.id !== id); save(); toast('Registro excluído.'); (after || render)();
  });
}

/* ========== COMPONENTES ========== */
const Q = {};
let per = { k: 'mes', a: '', b: '' };
const cn = id => (db.clientes.find(c => c.id === id) || {}).nome || '(cliente removida)';
const head = (t, lbl, fn) => el('div', { class: 'head' }, el('h1', {}, t), lbl ? el('button', { class: 'btn pri', type: 'button', onclick: fn }, lbl) : null);
const empty = (t, lbl, fn) => el('div', { class: 'empty' }, el('p', {}, t), lbl ? el('button', { class: 'btn pri', type: 'button', onclick: fn }, lbl) : null);
const tag = ok => el('span', { class: 'tag ' + (ok ? 'ok' : 'no') }, ok ? 'Sim' : 'Não');
const card = (l, v, cls) => el('div', { class: 'card' }, el('span', { class: 'lab' }, l), el('strong', { class: cls || '' }, v));
const search = (view, fill, ph) => {
  const i = el('input', { type: 'search', placeholder: ph, 'aria-label': ph });
  i.value = Q[view] || '';
  i.addEventListener('input', () => { Q[view] = i.value; fill(); });
  return i;
};
function pbar() {
  const s = el('select', { 'aria-label': 'Período' }, PER.map(([a, b]) => el('option', { value: a }, b)));
  s.value = per.k; s.onchange = () => { per.k = s.value; render(); };
  const box = el('div', { class: 'bar' }, s);
  if (per.k === 'custom') {
    ['a', 'b'].forEach(k => {
      const i = el('input', { type: 'date', 'aria-label': k === 'a' ? 'Data inicial' : 'Data final' });
      i.value = per[k]; i.onchange = () => { per[k] = i.value; render(); }; box.append(i);
    });
  }
  return box;
}
function tbl(cols, rows, acts) {
  const hr = el('tr', {}, cols.map(c => el('th', {}, c[0])), el('th', {}, 'Ações'));
  const tb = el('tbody');
  rows.forEach(r => {
    const tr = el('tr', {}, cols.map(c => el('td', { 'data-label': c[0] }, c[1](r))));
    tr.append(el('td', { class: 'acts', 'data-label': 'Ações' }, acts(r).map(a => a.nodeType ? a : el('button', { class: 'btn sm ' + (a[2] || ''), type: 'button', onclick: a[1] }, a[0]))));
    tb.append(tr);
  });
  return el('div', { class: 'tw' }, el('table', {}, el('thead', {}, hr), tb));
}
const waLink = c => { const d = digits(c.whatsapp); return el('a', { class: 'btn sm', href: 'https://wa.me/' + (d.length <= 11 ? '55' + d : d), target: '_blank', rel: 'noopener' }, 'WhatsApp'); };
const procs = () => [...new Set([...db.atendimentos, ...db.anamneses].map(x => x.procedimento).filter(Boolean))];
const finCards = T => [card('Entradas', brl(T.rec), 'pos'), card('Saídas', brl(T.pago), 'neg'), card('A receber', brl(T.arec)), card('A pagar', brl(T.apag)), card('Saldo', brl(T.saldo), T.saldo < 0 ? 'neg' : 'pos'), card('Dívidas', brl(T.div)), card('Gastos extras', brl(T.extra))];

