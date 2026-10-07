'use strict';
/* SAOUDA NAILS — Módulo Ficha de Anamnese. */

/* ========== ANAMNESE ========== */
function fAnam(a = {}) {
  if (!db.clientes.length) return toast('Cadastre uma cliente antes de criar a ficha.', true);
  openForm(a.id ? 'Editar ficha de anamnese' : 'Nova ficha de anamnese', [
    { k: 'clienteId', l: 'Cliente', t: 'select', o: db.clientes.map(c => [c.id, c.nome]), req: 1, m: 'Selecione a cliente.' },
    { k: 'data', l: 'Data de preenchimento', t: 'date', req: 1 },
    { k: 'procedimento', l: 'Procedimento', t: 'text', req: 1, m: 'Informe o procedimento.', dl: procs() },
    ...QS.map(([k, l]) => ({ k, l, t: 'radio', req: 1, m: `Responda: ${l}` })),
    { k: 'obs', l: 'Observações', t: 'textarea' }
  ], { data: today(), ...a }, d => { upsert('anamneses', a.id, d); toast('Ficha de anamnese salva.'); render(); });
}
function verAnam(a) {
  const c = db.clientes.find(x => x.id === a.clienteId) || {};
  info('Ficha de anamnese',
    el('div', { class: 'row' }, 'Cliente', c.nome || '(cliente removida)'), el('div', { class: 'row' }, 'WhatsApp', c.whatsapp || '—'),
    el('div', { class: 'row' }, 'Nascimento', fdate(c.nascimento)), el('div', { class: 'row' }, 'Preenchimento', fdate(a.data)), el('div', { class: 'row' }, 'Procedimento', a.procedimento),
    QS.map(([k, l]) => el('div', { class: 'row' }, l, a[k] === 'sim' ? 'Sim' : 'Não')),
    a.obs ? el('p', {}, 'Observações: ' + a.obs) : null);
}
function vAnam() {
  const L = [...db.anamneses].sort((a, b) => b.data.localeCompare(a.data));
  return el('div', {}, head('Anamnese', '+ Nova ficha', () => fAnam()),
    !L.length ? empty('Nenhuma ficha de anamnese registrada.', '+ Nova ficha', () => fAnam())
      : tbl([['Cliente', a => cn(a.clienteId)], ['Procedimento', a => a.procedimento], ['Data', a => fdate(a.data)]], L,
        a => [['Ver', () => verAnam(a)], ['Editar', () => fAnam(a)], ['Excluir', () => del('anamneses', a.id), 'danger']]));
}

