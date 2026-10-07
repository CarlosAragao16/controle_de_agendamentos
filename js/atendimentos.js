'use strict';
/* SAOUDA NAILS — Módulo Atendimentos. */

/* ========== ATENDIMENTOS ========== */
function fAt(a = {}) {
  if (!db.clientes.length) return toast('Cadastre uma cliente antes de registrar um atendimento.', true);
  openForm(a.id ? 'Editar atendimento' : 'Novo atendimento', [
    { k: 'data', l: 'Data', t: 'date', req: 1 },
    { k: 'clienteId', l: 'Cliente', t: 'select', o: db.clientes.map(c => [c.id, c.nome]), req: 1, m: 'Selecione a cliente.' },
    { k: 'procedimento', l: 'Procedimento', t: 'text', req: 1, m: 'Informe o procedimento.', dl: procs() },
    { k: 'valor', l: 'Valor (R$)', t: 'money', req: 1 },
    { k: 'pagamento', l: 'Forma de pagamento', t: 'select', o: FPG.map(x => [x, x]), req: 1, m: 'Selecione a forma de pagamento.' },
    { k: 'recebido', l: 'Recebido?', t: 'radio', req: 1, m: 'Informe se já foi recebido.' }
  ], { data: today(), ...a }, d => { upsert('atendimentos', a.id, d); toast('Atendimento salvo com sucesso.'); render(); });
}
function vAt() {
  const r = R(per.k, per.a, per.b), body = el('div'), sum = el('div', { class: 'grid' });
  const T = calc(r);
  sum.append(card('Atendimentos', String(T.nAt)), card('Faturamento', brl(T.fat)), card('Recebido', brl(T.rec - db.dinheiro.filter(l => l.tipo === 'recebimento' && l.pago === 'sim' && inR(l.data, r)).reduce((s, l) => s + l.valor, 0))));
  const fill = () => {
    const L = db.atendimentos.filter(a => inR(a.data, r) && match(Q.at, cn(a.clienteId), a.procedimento)).sort((a, b) => b.data.localeCompare(a.data));
    body.replaceChildren(!db.atendimentos.length ? empty('Nenhum atendimento registrado.', '+ Novo atendimento', () => fAt())
      : !L.length ? empty('Nenhum atendimento encontrado.')
      : tbl([['Data', a => fdate(a.data)], ['Cliente', a => cn(a.clienteId)], ['Procedimento', a => a.procedimento], ['Valor', a => brl(a.valor)], ['Pagamento', a => a.pagamento], ['Recebido?', a => tag(a.recebido === 'sim')]], L,
        a => [[a.recebido === 'sim' ? 'Marcar não recebido' : 'Marcar recebido', () => { a.recebido = a.recebido === 'sim' ? 'nao' : 'sim'; save(); toast('Atendimento salvo com sucesso.'); render(); }],
          ['Editar', () => fAt(a)], ['Excluir', () => del('atendimentos', a.id), 'danger']]));
  };
  fill();
  return el('div', {}, head('Atendimentos', '+ Novo atendimento', () => fAt()), pbar(), el('div', { class: 'bar' }, search('at', fill, 'Pesquisar por cliente ou procedimento')), sum, body);
}

