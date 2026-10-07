<div align="center">

# 💅 SAOUDA NAILS

**Sistema de gestão para nail designers — clientes, anamnese, atendimentos e finanças em um só lugar.**

![HTML5](https://img.shields.io/badge/HTML5-8C3A63?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-3A1F3E?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript_Vanilla-D98BB0?style=for-the-badge&logo=javascript&logoColor=2A1A2C)
![Sem dependências](https://img.shields.io/badge/depend%C3%AAncias-zero-8C3A63?style=for-the-badge)
![Funciona offline](https://img.shields.io/badge/funciona-offline-3A1F3E?style=for-the-badge)

*Elegante no celular, completo no computador — e totalmente seu: os dados nunca saem do seu navegador.*

</div>

---

## ✨ Visão geral

O **SAOUDA NAILS** transforma uma planilha de controle em um aplicativo moderno, feito para o dia a dia de quem atende clientes. Cadastre clientes, preencha fichas de anamnese, registre atendimentos, acompanhe o dinheiro que entra e sai e veja tudo resumido automaticamente.

> 🌸 **O sistema começa 100% vazio.** Não existe nenhum dado de exemplo: tudo o que você vê foi cadastrado por você.

## 🧭 Funcionalidades

| Módulo | O que faz |
|---|---|
| 🏠 **Dashboard** | Recebido, pago, saldo, a receber, a pagar, dívidas, gastos extras e atendimentos, calculados em tempo real e filtráveis por período. |
| 👩 **Clientes** | Cadastro com nome, WhatsApp e nascimento; pesquisa, histórico de atendimentos e botão que abre a conversa no WhatsApp. |
| 📋 **Anamnese** | Ficha vinculada à cliente com 10 perguntas Sim/Não (nenhuma pré-marcada) e campo de observações. |
| 💅 **Atendimentos** | Data, cliente, procedimento, valor, forma de pagamento e status de recebimento, com alternância rápida. |
| 💰 **Dinheiro** | Lançamentos de recebimento, despesa, dívida e gasto extra, com status pago/recebido. |
| 📊 **Resumo** | Mês passado, mês atual e próximo mês lado a lado, mais indicadores gerais como ticket médio. |
| ⚙️ **Configurações** | Exportar e importar backup em JSON e limpar dados, sempre com confirmação. |

### Também inclui

- 🔎 Pesquisa em clientes, atendimentos e lançamentos
- 🗓️ Filtros: hoje, semana, mês atual, mês anterior, próximo mês, período personalizado e todo o período
- 📱 Layout responsivo com prioridade para o celular: menu inferior, tabelas que viram cards e formulários em uma coluna
- 🌗 Tema claro e escuro automático, conforme o dispositivo
- ✅ Validação de campos, confirmação antes de excluir e avisos (toasts) após cada ação
- 🇧🇷 Datas em `DD/MM/AAAA` e valores em `R$ 0,00`

## 🚀 Como usar

Não é preciso instalar nada.

```bash
# 1. Baixe ou clone o projeto
git clone <url-do-seu-repositorio>

# 2. Abra o arquivo no navegador
SAOUDA-NAILS/index.html
```

Ou simplesmente dê dois cliques no `index.html`. Para usar no celular, hospede a pasta em qualquer serviço de páginas estáticas (como o GitHub Pages) e abra o link.

## 🗂️ Estrutura do projeto

```
SAOUDA-NAILS/
├── index.html
├── css/
│   └── style.css            # identidade visual, tema claro/escuro, responsividade
├── js/
│   ├── utils.js             # constantes, formatação, toasts, modais, formulário genérico
│   ├── database.js          # persistência (localStorage/JSON) e cálculos financeiros
│   ├── clientes.js
│   ├── anamnese.js
│   ├── atendimentos.js
│   ├── dinheiro.js
│   ├── resumo.js            # Dashboard e Resumo
│   └── app.js               # configurações, backup, rotas e inicialização
├── assets/
│   ├── logo/
│   └── icons/
└── data/
    └── database.json        # estrutura vazia de referência
```

Os scripts são carregados na ordem acima pelo `index.html`, sem bundler e sem build.

## 🧮 Como o dinheiro é calculado

Cada registro é contado **uma única vez**, sem duplicar valores:

| Origem | Condição | Entra em |
|---|---|---|
| Atendimento | Recebido = Sim | **Recebido** |
| Atendimento | Recebido = Não | **A receber** |
| Lançamento · Recebimento | Pago/recebido = Sim / Não | **Recebido** / **A receber** |
| Lançamento · Despesa, Dívida, Gasto extra | Pago = Sim / Não | **Pago** / **A pagar** |
| Lançamento · Dívida | sempre | também soma em **Dívidas** |
| Lançamento · Gasto extra | sempre | também soma em **Gastos extras** |

**Saldo = Recebido − Pago.**

Atendimentos já entram nos totais sozinhos: você não precisa criar um lançamento em Dinheiro para o mesmo serviço.

## 💾 Seus dados e backup

- Os dados ficam salvos no **localStorage** do navegador, sob a chave `SAOUDA-NAILS-db`, e continuam ali depois de atualizar a página ou fechar o navegador.
- Eles **não são enviados para nenhum servidor**.
- Limpar os dados do navegador apaga o sistema. Por isso, use **Configurações → Exportar dados** com frequência. O arquivo gerado é `SAOUDA-NAILS-backup.json`.
- Para restaurar ou migrar de aparelho, use **Importar dados**. O sistema pede confirmação antes de substituir qualquer coisa.

## 🔒 Segurança

- Textos digitados pelo usuário são inseridos na tela com `textContent` e criação de elementos, sem `innerHTML`.
- Nenhuma exclusão acontece sem confirmação.
- Uma cliente com atendimentos registrados não pode ser excluída, para não deixar histórico sem dono.

## 🛣️ Ideias para o futuro

- [ ] Migração para IndexedDB
- [ ] Gráficos a partir dos dados cadastrados
- [ ] Agenda com lembretes de aniversário
- [ ] Instalação como app (PWA)
- [ ] Exportação de relatórios em PDF

## 🤝 Contribuindo

Sugestões e melhorias são bem-vindas. Abra uma *issue* descrevendo a ideia ou envie um *pull request*.

Ao contribuir, mantenha duas regras do projeto: **nunca** incluir dados de demonstração e **nunca** deixar valores fixos no código. Todo número exibido deve vir de um cálculo sobre os dados cadastrados.

## 📄 Licença

Defina aqui a licença do projeto (por exemplo, MIT) e adicione o arquivo `LICENSE` na raiz.

---

<div align="center">

**SAOUDA NAILS** · feito com carinho para quem cuida de cada detalhe 💅

</div>
