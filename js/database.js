'use strict';
/* SAOUDA NAILS — Persistência (localStorage em JSON) e cálculos financeiros. */

/* ========== PERSISTÊNCIA ========== */
const vazio = () => ({ clientes: [], anamneses: [], atendimentos: [], dinheiro: [], configuracoes: {} });
const normaliza = d => {
  const b = vazio();
  for (const k of Object.keys(b)) if (d && typeof d === 'object' && d[k] && typeof d[k] === typeof b[k]) b[k] = d[k];
  return b;
};
let db = (() => { try { return normaliza(JSON.parse(localStorage.getItem(DB_KEY))); } catch (e) { return vazio(); } })();
function save() {
  try { localStorage.setItem(DB_KEY, JSON.stringify(db)); }
  catch (e) { toast('Não foi possível salvar os dados neste navegador.', true); }
}
function upsert(col, id, data) {
  if (id) Object.assign(db[col].find(x => x.id === id), data);
  else db[col].push({ id: uid(), cadastro: today(), ...data });
  save();
}

/* ========== CÁLCULOS FINANCEIROS ========== */
/* Arquitetura: atendimento = faturamento do serviço (recebido sim/não define recebido ou a receber).
   Lançamento em Dinheiro = movimentação avulsa. Cada registro é contado uma única vez; nada é duplicado. */
const R = (k, a, b) => {
  const n = new Date(), y = n.getFullYear(), m = n.getMonth(), d = n.getDate(), w = n.getDay();
  if (k === 'hoje') return [today(), today()];
  if (k === 'semana') return [iso(new Date(y, m, d - w)), iso(new Date(y, m, d - w + 6))];
  if (k === 'mes') return [iso(new Date(y, m, 1)), iso(new Date(y, m + 1, 0))];
  if (k === 'ant') return [iso(new Date(y, m - 1, 1)), iso(new Date(y, m, 0))];
  if (k === 'prox') return [iso(new Date(y, m + 1, 1)), iso(new Date(y, m + 2, 0))];
  if (k === 'custom') return [a || '0000-00-00', b || '9999-99-99'];
  return ['0000-00-00', '9999-99-99'];
};
const inR = (d, r) => d >= r[0] && d <= r[1];
function calc(r) {
  const T = { rec: 0, pago: 0, arec: 0, apag: 0, div: 0, extra: 0, fat: 0, nAt: 0 };
  db.atendimentos.filter(a => inR(a.data, r)).forEach(a => {
    T.nAt++; T.fat += a.valor;
    if (a.recebido === 'sim') T.rec += a.valor; else T.arec += a.valor;
  });
  db.dinheiro.filter(l => inR(l.data, r)).forEach(l => {
    const ok = l.pago === 'sim';
    if (l.tipo === 'recebimento') { if (ok) T.rec += l.valor; else T.arec += l.valor; return; }
    if (ok) T.pago += l.valor; else T.apag += l.valor;
    if (l.tipo === 'divida') T.div += l.valor;
    if (l.tipo === 'extra') T.extra += l.valor;
  });
  T.saldo = T.rec - T.pago;
  return T;
}

