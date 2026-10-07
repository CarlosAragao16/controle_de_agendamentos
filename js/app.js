'use strict';
/* SAOUDA NAILS — Configurações, backup, rotas e inicialização. */

/* ========== CONFIGURAÇÕES / BACKUP ========== */
function vConfig() {
  const file = el('input', { type: 'file', accept: 'application/json,.json', hidden: 'hidden' });
  file.onchange = () => {
    const f = file.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      let d; try { d = JSON.parse(rd.result); } catch (e) { return toast('Arquivo de backup inválido.', true); }
      if (!d || typeof d !== 'object' || !Array.isArray(d.clientes)) return toast('Arquivo de backup inválido.', true);
      ask('Atenção: a importação poderá substituir os dados atuais. Deseja continuar?', 'Importar', () => { db = normaliza(d); save(); toast('Dados importados com sucesso.'); render(); });
    };
    rd.readAsText(f); file.value = '';
  };
  return el('div', {}, head('Configurações'),
    el('div', { class: 'card' }, el('h2', {}, 'SAOUDA NAILS'), el('p', { class: 'note' }, 'Os dados ficam salvos somente neste navegador. Faça backups com frequência.'),
      el('div', { class: 'acts' },
        el('button', { class: 'btn pri', type: 'button', onclick: () => {
          const a = el('a', { href: URL.createObjectURL(new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' })), download: 'SAOUDA-NAILS-backup.json' });
          document.body.append(a); a.click(); a.remove(); toast('Backup exportado com sucesso.');
        } }, 'Exportar dados'),
        el('button', { class: 'btn', type: 'button', onclick: () => file.click() }, 'Importar dados'), file,
        el('button', { class: 'btn danger', type: 'button', onclick: () => ask('Todos os dados serão apagados. Deseja continuar?', 'Apagar tudo', () => { db = vazio(); save(); toast('Dados apagados.'); render(); }) }, 'Limpar dados'))));
}

/* ========== ROTAS ========== */
const VIEWS = { dashboard: vDash, clientes: vClientes, anamnese: vAnam, atendimentos: vAt, dinheiro: vDin, resumo: vResumo, config: vConfig };
function render() {
  const r = (location.hash || '#dashboard').slice(1);
  const rota = VIEWS[r] ? r : 'dashboard';
  $('#main').replaceChildren(VIEWS[rota](), el('footer', {}, 'SAOUDA NAILS'));
  document.querySelectorAll('nav a').forEach(a => a.getAttribute('href') === '#' + rota ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
}
ROTAS.forEach(([id, ico, nome, curto]) => {
  $('#snav').append(el('a', { href: '#' + id }, el('span', {}, ico), el('span', {}, nome)));
  $('#bnav').append(el('a', { href: '#' + id, 'aria-label': nome }, el('span', {}, ico), el('span', {}, curto)));
});
window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });
render();
