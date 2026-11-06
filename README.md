# STILL STUDIO — Landing Page

Site estático (HTML/CSS/JS puro, sem build), baseado na LP de referência da STILL com melhorias de motion ao rolar.

## Arquivos
- `index.html` → home (/)
- `proposta/index.html` → página de proposta (/proposta)
- `404.html`, `favicon.svg`, `og.png`, `robots.txt`

## Motion ao rolar (novidades em relação à referência)
- **Barra de progresso** de leitura no topo.
- **Hero**: título palavra por palavra; ao rolar, o conteúdo sobe e some e as manchas de cor fazem parallax.
- **Faixa (marquee)** de serviços que anda sozinha e acelera conforme a velocidade da rolagem.
- **Texto de destaque**: as palavras acendem uma a uma conforme a seção atravessa a tela.
- **Títulos**: cada linha sobe por trás de uma máscara quando entra na tela.
- **Projetos**: quadros em estilo desenho (traço a lápis) que se desenham ao entrar na tela; ao clicar, o quadro se expande e abre o projeto completo (desafio, solução, entregáveis e galeria), com navegação para o próximo projeto.
  O conteúdo de cada projeto fica no objeto `CASES`, no script do `index.html`.
- **Saída das seções**: ao deixar a tela, cada seção dá um pequeno pulo, encolhe e some; as entradas usam uma curva com leve quique.
- **Serviços / Estúdio / FAQ**: entradas escalonadas (de lado, de baixo, com escala).
- **Processo** (seção nova): linha vertical que preenche com a rolagem e acende cada etapa.
- **CTA**: círculo decorativo gira com a rolagem; **rodapé**: letras de STILL sobem.
- Menu destaca a seção ativa; respeita `prefers-reduced-motion` (tudo aparece sem animação).

Para animar um novo elemento, basta adicionar `data-rv` (ou `data-rv="left|right|scale|blur|mask"`);
para um título com linhas mascaradas, use `data-split`.

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
