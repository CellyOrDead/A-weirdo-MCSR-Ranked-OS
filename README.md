# MCSR Rank

Aplicativo desktop bilíngue (português do Brasil e inglês) para acompanhar os dados públicos do MCSR Ranked. Ele consulta a API oficial `api.mcsrranked.com`; não usa rankings de exemplo.
<img width="2559" height="1393" alt="Screenshot 2026-10-17 190608" src="https://github.com/user-attachments/assets/ab1a40af-bb41-4df0-8829-25fc464506cd" />
<img width="2545" height="1346" alt="Screenshot 2026-10-17 190622" src="https://github.com/user-attachments/assets/590f4e52-db89-4814-a86c-4fbbb1cbdf77" />
<img width="2545" height="1355" alt="Screenshot 2026-10-17 190630" src="https://github.com/user-attachments/assets/36ca7c34-836c-4720-a66b-a601701db698" />
<img width="2535" height="1351" alt="Screenshot 2026-10-17 190644" src="https://github.com/user-attachments/assets/d0960038-97ba-4bb0-bf2d-3c7bbe0e5e4d" />



## Executar no Windows

1. Instale o Node.js LTS.
2. Abra esta pasta no terminal e execute `npm install`.
3. Inicie com `npm start`.
4. Execute `npm test` para validar as funções locais.

## Recursos

- Rankings oficiais de ELO, pontos da fase, melhores tempos e Weekly Race.
- Filtro de temporada/país, busca local nos resultados da API, ordenação, divisão e opção de projeção/personalização de recordes quando suportadas pela API.
- Página de perfil de cada jogador, também acessível pelo endereço `#/profile/nickname`, com resumo gerado por estatísticas oficiais, links de YouTube/Twitch/Discord vinculados, conquistas e melhores temporadas.
- Histórico oficial de Playoffs e campeonatos ganhos, diferenciados de pódios/participações; estatísticas de carreira, gráfico de variação de ELO com até 100 partidas recentes e detalhes/VOD quando disponíveis.
- Comparação de jogadores e confrontos diretos.
- Favoritos e torneios eliminatórios salvos localmente neste dispositivo.
- Cabeças dos jogadores carregadas por UUID ou nome usando Skin Render, com Crafatar como alternativa quando o UUID está disponível e iniciais se as fontes falharem; a opção pode ser desligada em Configurações.
- Criação de torneios com 2 a 64 participantes, ELO/sorteio/ordem manual, séries melhor de 1/3/5, BYEs para os seeds mais altos e placares de série com desfazer.
- Temas Floresta MCSR, Roxo, Azul, Carmesim e Nether, além de opção para tabelas compactas; preferências ficam salvas localmente.
- Interface em PT-BR, inglês e espanhol.
- Minigame roguelike Cometfall: três naves, hordas e chefes de cometas, 20 melhorias acumuláveis, controles por teclado/toque e recorde local.

## Limites e dados


Os dados competitivos, perfis, redes vinculadas e conquistas vêm da API pública do MCSR Ranked e estão sujeitos à disponibilidade, ao formato e aos limites dessa API. As cabeças usam um serviço externo de renderização por UUID ou nome e Crafatar como alternativa por UUID; se as fontes falharem, o app mostra a inicial do jogador. Participantes de torneios são consultados pelo perfil público; nomes não encontrados continuam permitidos como participantes manuais, sem UUID/ELO. O resumo do perfil é gerado a partir desses dados; biografia pessoal só está disponível se a API oficial passar a fornecê-la. O app não faz login nem envia resultados para o MCSR Ranked. Campeonatos exibidos são os títulos de Playoffs registrados no perfil oficial; favoritos, preferências e torneios criados aqui ficam somente no armazenamento local deste computador. Esses torneios não são oficiais nem sincronizados entre dispositivos. A busca e os filtros de texto refinam os resultados devolvidos pela API, não consultam todo o cadastro global.

O aplicativo consulta endpoints públicos documentados pelo MCSR Ranked. Nenhuma chave privada é solicitada ou armazenada.
