'use strict';
/* SAOUDA NAILS — Módulo Dinheiro (lançamentos financeiros). */

/* ========== DINHEIRO ========== */
function fDin(l = {}) {
  openForm(l.id ? 'Editar lançamento' : 'Novo lançamento', [
    { k: 'data', l: 'Data', t: 'date', req: 1 },
    { k: 'descricao', l: 'Descrição', t: 'text', req: 1, m: 'Informe a descrição.' },
    { k: 'tipo', l: 'Tipo', t: 'select', o: TIPOS, req: 1, m: 'Selecione o tipo.' },
    { k: 'valor', l: 'Valor (R$)', t: 'money', req: 1 },
    { k: 'pago', l: 'Pago/recebido?', t: 'radio', req: 1, m: 'Informe se já foi pago/recebido.' },
    { k: 'obs', l: 'Observação', t: 'textarea' }
  ], { data: today(), ...l }, d => { upsert('dinheiro', l.id, d); toast('Lançamento financeiro salvo.'); render(); });
}
function vDin() {
  const r = R(per.k, per.a, per.b), body = el('div');
  const fill = () => {
    const L = db.dinheiro.filter(l => inR(l.data, r) && match(Q.din, l.descricao, tipoLabel(l.tipo))).sort((a, b) => b.data.localeCompare(a.data));
    body.replaceChildren(!db.dinheiro.length ? empty('Nenhum lançamento financeiro.', '+ Novo lançamento', () => fDin())
      : !L.length ? empty('Nenhum lançamento financeiro encontrado.')
      : tbl([['Data', l => fdate(l.data)], ['Descrição', l => l.descricao], ['Tipo', l => tipoLabel(l.tipo)], ['Valor', l => brl(l.valor)], ['Pago/recebido?', l => tag(l.pago === 'sim')], ['Observação', l => l.obs || '—']], L,
        l => [[l.pago === 'sim' ? 'Marcar não' : 'Marcar sim', () => { l.pago = l.pago === 'sim' ? 'nao' : 'sim'; save(); toast('Lançamento financeiro salvo.'); render(); }],
          ['Editar', () => fDin(l)], ['Excluir', () => del('dinheiro', l.id), 'danger']]));
  };
  fill();
  return el('div', {}, head('Dinheiro', '+ Novo lançamento', () => fDin()), pbar(),
    el('p', { class: 'note' }, 'Atendimentos entram nos totais automaticamente, sem criar lançamentos duplicados.'),
    el('div', { class: 'grid' }, finCards(calc(r))), el('div', { class: 'bar' }, search('din', fill, 'Pesquisar por descrição ou tipo')), body);
}

