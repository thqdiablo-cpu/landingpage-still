# STILL STUDIO — Landing Page

Site estático (HTML/CSS/JS puro, sem build), baseado na LP de referência da STILL com melhorias de motion ao rolar.

## Arquivos
- `index.html` → home (/)
- `proposta/index.html` → página de proposta (/proposta)
- `404.html`, `favicon.svg`, `og.png`, `robots.txt`

## Estrutura e motion
Página clara com "cartões" escuros arredondados (abertura, serviços e chamada final).
- **Abertura**: título palavra por palavra; ao fundo, "STILL" com rastro de movimento que se assenta (fica "parado") conforme a rolagem.
- **Menu flutuante** aparece depois da abertura e destaca a seção atual; barra de progresso no topo.
- **Clientes**: faixa de logos logo abaixo da abertura (ver "Logos de clientes e parceiros").
- **Quem somos**: as palavras acendem uma a uma conforme a rolagem.
- **Projetos**: a seção fica presa e os quadros (desenhos a lápis que se desenham sozinhos) andam na horizontal;
  ao clicar, o quadro se expande e abre o projeto completo. O conteúdo de cada projeto fica no objeto `CASES`, no script.
- **Em números**: os números contam até o valor final. Hoje mostram dados tirados do próprio conteúdo do site
  (3 frentes, 4 etapas…); troque pelos números reais do estúdio (atributos `data-to` e `data-suf`).
- **Serviços**: lista em bloco escuro; no computador, um desenho segue o cursor sobre cada serviço.
- **Processo**: linha que preenche com a rolagem; **seções** saem com um pequeno pulo ao deixar a tela.
- Respeita `prefers-reduced-motion` (tudo aparece sem animação).

Para animar um novo elemento, adicione `data-rv` (ou `data-rv="left|scale|blur"`); para um título com linhas mascaradas, use `data-split`.

## Versão B (teste)
`versao-b/index.html` (/versao-b) é uma alternativa no formato de página de conversão: faixas escuras granuladas
alternando com faixas claras, títulos pesados em caixa alta, selos inclinados, faixas de texto correndo,
cartões de "frentes" no estilo de planos, carrossel do portfólio (abre o projeto completo), FAQ e barra fixa
de proposta no rodapé. Está marcada com `noindex` enquanto for teste.

## Publicar
Funciona em qualquer hospedagem estática (Vercel, Netlify, Cloudflare Pages, GitHub Pages): envie a pasta inteira.

## ANTES de divulgar (2 itens obrigatórios)
1. Receber as propostas: em `proposta/index.html`, preencha `FORM_ENDPOINT` (perto do fim do arquivo)
   com a URL do serviço que recebe POST em JSON (Formspree, Google Apps Script, Make, Zapier, backend próprio).
2. Pré-visualização em redes sociais: em `index.html` e `proposta/index.html`, troque
   `content="/og.png"` pela URL completa, ex.: `content="https://seudominio.com.br/og.png"`.

## Logos de clientes e parceiros
A faixa "Veja com quem já fizemos projetos" (seção `#clientes` no `index.html`) está com 8 espaços reservados.
1. Coloque os arquivos na pasta `logos/` (de preferência SVG ou PNG com fundo transparente).
2. No `index.html`, troque cada `<span class="lg ph">Logo 01</span>` por
   `<span class="lg"><img src="logos/nome-do-cliente.svg" alt="Nome do cliente"></span>`.
Pode ter quantos logos quiser: a lista é duplicada automaticamente para a faixa girar sem emenda.
Os logos aparecem em tons de cinza e ganham a cor original ao passar o mouse; a faixa pausa com o mouse em cima.
