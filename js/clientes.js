'use strict';
/* SAOUDA NAILS — Módulo Clientes. */

/* ========== CLIENTES ========== */
function fCliente(c = {}) {
  openForm(c.id ? 'Editar cliente' : 'Novo cliente', [
    { k: 'nome', l: 'Nome completo', t: 'text', req: 1, m: 'Informe o nome da cliente.' },
    { k: 'whatsapp', l: 'WhatsApp', t: 'tel', req: 1, m: 'Informe o WhatsApp da cliente.' },
    { k: 'nascimento', l: 'Data de nascimento', t: 'date', past: 1 }
  ], c, d => { upsert('clientes', c.id, d); toast('Cliente cadastrado com sucesso.'); render(); });
}
function verCliente(c) {
  const at = db.atendimentos.filter(a => a.clienteId === c.id).sort((a, b) => b.data.localeCompare(a.data));
  const an = db.anamneses.filter(a => a.clienteId === c.id);
  info(c.nome,
    el('div', { class: 'row' }, 'WhatsApp', c.whatsapp), el('div', { class: 'row' }, 'Cadastro', fdate(c.cadastro)), el('div', { class: 'row' }, 'Nascimento', fdate(c.nascimento)),
    el('h2', { style: 'margin-top:14px' }, 'Histórico'),
    at.length ? at.map(a => el('div', { class: 'row' }, el('span', {}, `${fdate(a.data)} · ${a.procedimento}`), el('span', {}, brl(a.valor)))) : el('p', { class: 'note' }, 'Nenhum atendimento encontrado.'),
    el('p', { class: 'note' }, `Fichas de anamnese: ${an.length}`));
}
function vClientes() {
  const body = el('div');
  const fill = () => {
    const q = Q.clientes || '';
    const L = db.clientes.filter(c => match(q, c.nome, c.whatsapp, digits(c.whatsapp))).sort((a, b) => a.nome.localeCompare(b.nome));
    body.replaceChildren(!db.clientes.length ? empty('Nenhuma cliente cadastrada ainda.', '+ Cadastrar primeira cliente', () => fCliente())
      : !L.length ? empty('Nenhuma cliente encontrada.')
      : tbl([['Nome', c => c.nome], ['WhatsApp', c => c.whatsapp], ['Cadastro', c => fdate(c.cadastro)], ['Nascimento', c => fdate(c.nascimento)]], L,
        c => [['Ver', () => verCliente(c)], waLink(c), ['Editar', () => fCliente(c)], ['Excluir', () => {
          if (db.atendimentos.some(a => a.clienteId === c.id)) return toast('Esta cliente possui atendimentos e não pode ser excluída.', true);
          ask('Tem certeza que deseja excluir este registro?', 'Excluir', () => {
            db.clientes = db.clientes.filter(x => x.id !== c.id); db.anamneses = db.anamneses.filter(x => x.clienteId !== c.id);
            save(); toast('Registro excluído.'); render();
          });
        }, 'danger']]));
  };
  fill();
  return el('div', {}, head('Clientes', '+ Novo cliente', () => fCliente()), el('div', { class: 'bar' }, search('clientes', fill, 'Pesquisar por nome ou WhatsApp')), body);
}

