'use strict';
/* SAOUDA NAILS — Dashboard e Resumo. */

/* ========== DASHBOARD E RESUMO ========== */
function vDash() {
  const T = calc(R(per.k, per.a, per.b)), s = per.k === 'mes' ? 'no mês' : 'no período';
  const sem = !db.clientes.length && !db.atendimentos.length && !db.dinheiro.length;
  return el('div', {}, head('SAOUDA NAILS'), pbar(),
    sem ? empty('Ainda não existem dados suficientes para gerar os indicadores.', '+ Cadastrar primeira cliente', () => fCliente()) : null,
    el('div', { class: 'grid', style: 'margin-top:16px' },
      card('Recebido ' + s, brl(T.rec), 'pos'), card('Pago ' + s, brl(T.pago), 'neg'), card('Saldo ' + (per.k === 'mes' ? 'do mês' : 'do período'), brl(T.saldo), T.saldo < 0 ? 'neg' : 'pos'),
      card('A receber', brl(T.arec)), card('A pagar', brl(T.apag)), card('Dívidas', brl(T.div)), card('Gastos extras', brl(T.extra)), card('Atendimentos ' + s, String(T.nAt))));
}
function vResumo() {
  const col = (t, k) => { const T = calc(R(k)); return el('div', { class: 'card' }, el('h2', {}, t),
    [['Total recebido', T.rec], ['Total pago', T.pago], ['Dívidas', T.div], ['Gastos extras', T.extra], ['Saldo', T.saldo], ['A receber', T.arec], ['A pagar', T.apag]].map(([l, v]) => el('div', { class: 'row' }, l, brl(v)))); };
  const G = calc(R('todos'));
  return el('div', {}, head('Resumo'),
    db.atendimentos.length + db.dinheiro.length ? null : empty('Ainda não existem dados suficientes para gerar este relatório.'),
    el('div', { class: 'cols', style: 'margin-top:16px' }, col('Mês passado', 'ant'), col('Mês atual', 'mes'), col('Próximo mês', 'prox')),
    el('h2', { style: 'margin-bottom:12px' }, 'Indicadores gerais'),
    el('div', { class: 'grid' }, card('Total recebido', brl(G.rec), 'pos'), card('Total pago', brl(G.pago), 'neg'), card('Faturamento de atendimentos', brl(G.fat)),
      card('Ticket médio', G.nAt ? brl(G.fat / G.nAt) : '—'), card('Clientes', String(db.clientes.length)), card('Atendimentos', String(G.nAt)), card('Fichas de anamnese', String(db.anamneses.length))));
}

