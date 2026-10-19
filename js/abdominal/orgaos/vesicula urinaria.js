window.CONFIGURACAO_ORGAOS = window.CONFIGURACAO_ORGAOS || {};

window.CONFIGURACAO_ORGAOS.vesicula_urinaria = {
  id: 'vesicula_urinaria',
  nome: 'Vesícula Urinária',
  icone: '🧪',
  oculto: false,

  campos: {
    distensao: 'moderada',
    paredes: 'normoespessas',
    medidaParedes: '0,30',
    mucosa: 'regular',
    sugestivoConteudo: '',
    sedimentosQtd: 'discreta',
    sedimentosPos: 'em suspensão após balotamento',
    sedimentosObs: '(Sugestivo de sedimentos e/ou celularidade)',
    focalTipo: 'amorfa',
    focalSuperficie: 'irregular',
    focalEcogenicidade: 'heterogênea',
    focalParede: 'ventral',
    focalMed1: '0,0',
    focalMed2: '0,0',
    litiaseQtd: 'pelo menos uma estrutura',
    litiaseDeposito: 'em parede dependente',
    litiaseMedidaTexto: 'medindo',
    litiaseMedida: '0,0'
  },

  options: {
    distensao: ['moderada', 'discreta', 'acentuada', 'baixa'],
    paredes: ['normoespessas', 'discretamente espessadas', 'espessadas'],
    mucosa: ['regular', 'irregular'],
    sugestivoConteudo: [
      { value: '', label: '[Sem sugestivo]' },
      { value: ' (Sugestivo de processo inflamatório / cistite)', label: '(Sugestivo de processo inflamatório / cistite)' }
    ],
    sedimentosQtd: ['discreta', 'moderada', 'acentuada'],
    sedimentosPos: ['em suspensão após balotamento', 'depositadas em parede dorsal'],
    sedimentosObs: [
      '(Sugestivo de sedimentos e/ou celularidade)',
      '(Sugestivo de sedimentos e/ou celularidade e/ou microlitíases)'
    ],
    focalTipo: ['amorfa', 'arredondada'],
    focalSuperficie: ['irregular', 'regular'],
    focalEcogenicidade: ['heterogênea', 'homogênea'],
    focalParede: ['ventral', 'dorsal'],
    litiaseQtd: ['pelo menos uma estrutura', 'diversas estruturas'],
    litiaseDeposito: ['em parede dependente', 'no lúmen'],
    litiaseMedidaTexto: ['medindo', 'medindo uma delas']
  },

  labels: {
    distensao: 'Distensão Líquida',
    paredes: 'Paredes',
    medidaParedes: 'Espessura Parietal (cm)',
    mucosa: 'Mucosa',
    sugestivoConteudo: 'Sugestivo no Conteúdo',
    sedimentosQtd: 'Quantidade de Sedimentos',
    sedimentosPos: 'Posição dos Sedimentos',
    sedimentosObs: 'Classificação dos Sedimentos',
    focalTipo: 'Tipo do Espessamento Focal',
    focalSuperficie: 'Superfície do Espessamento',
    focalEcogenicidade: 'Ecogenicidade Focal',
    focalParede: 'Parede de Origem',
    focalMed1: 'Medida 1 Focal (cm)',
    focalMed2: 'Medida 2 Focal (cm)',
    litiaseQtd: 'Quantidade de Litíase',
    litiaseDeposito: 'Local de Depósito',
    litiaseMedidaTexto: 'Texto da Medida',
    litiaseMedida: 'Diâmetro Maior Litíase (cm)'
  },

  chipsSelecionados: ['Sedimentos'],
  chipsPatologias: [
    { id: 'Sedimentos', rotulo: 'Sedimentos', texto: '' },
    { id: 'Avaliacao', rotulo: 'Sugerir melhor avaliação (Repleção)', texto: 'Sugere-se melhor avaliação e acompanhamento ultrassonográfico de vesícula urinária com repleção adequada, à critério do clínico responsável.' },
    { id: 'Gas', rotulo: 'Gás em parede', texto: 'Nota-se a presença de discreto conteúdo gasoso formador de artefato de reverberação advindo da parede ventral (Pode estar relacionado a cistite enfisematosa ou sondagem recente - Sugere-se a realização de demais exames complementares para melhor elucidação diagnóstica).' },
    { id: 'Enfisematosa', rotulo: 'Cistite enfisematosa', texto: 'Nota-se presença de conteúdo gasoso formador de artefato de reverberação advindo da parede ventral (Pode estar relacionado a cistite enfisematosa - Sugere-se a realização de demais exames complementares à critério do clínico responsável).' },
    { id: 'Focal', rotulo: 'Espessamento focal', texto: '' },
    { id: 'Cistolitiase', rotulo: 'Cistolitíase', texto: '' },
    { id: 'Sonda', rotulo: 'Sonda uretral', texto: 'Observa-se estrutura tubular, de paredes hiperecogênicas e centro anecogênico, estendendo-se desde o lúmen uretral até a vesícula urinária – Relacionado a sonda uretral.' }
  ],

  onFieldChange: function(campo, valor) {
    this.campos[campo] = valor;

    if (campo === 'medidaParedes') {
      const val = parseFloat((valor || '0').replace(',', '.')) || 0;
      const refMax = 0.30;
      const limiteDezPorCento = refMax * 1.10;

      if (val > limiteDezPorCento) {
        this.campos.paredes = 'espessadas';
        this.campos.mucosa = 'irregular';
        this.campos.sugestivoConteudo = ' (Sugestivo de processo inflamatório / cistite)';
      } else if (val > refMax) {
        this.campos.paredes = 'discretamente espessadas';
        this.campos.mucosa = 'regular';
        this.campos.sugestivoConteudo = '';
      } else {
        this.campos.paredes = 'normoespessas';
        this.campos.mucosa = 'regular';
        this.campos.sugestivoConteudo = '';
      }
    }

    if (campo === 'distensao') {
      const temAvaliacao = this.chipsSelecionados.includes('Avaliacao');
      if (['discreta', 'baixa', 'acentuada'].includes(valor) && !temAvaliacao) {
        this.chipsSelecionados.push('Avaliacao');
      } else if (valor === 'moderada' && temAvaliacao) {
        this.chipsSelecionados = this.chipsSelecionados.filter(id => id !== 'Avaliacao');
      }
    }

    if (campo === 'litiaseQtd') {
      this.campos.litiaseMedidaTexto = valor === 'diversas estruturas' ? 'medindo uma delas' : 'medindo';
    }
  },

  gerarTexto: function(c) {
    return `de distensão líquida ${c.distensao}, paredes ${c.paredes} medindo cerca de ${c.medidaParedes} cm de espessura, mucosa ${c.mucosa} e conteúdo anecogênico e homogêneo${c.sugestivoConteudo}.`;
  },

  gerarTextoAchado: function(chipId, c) {
    if (chipId === 'Sedimentos') {
      return `Observa-se ${c.sedimentosQtd} quantidade de imagens hiperecogênicas ${c.sedimentosPos} ${c.sedimentosObs}.`;
    }
    if (chipId === 'Focal') {
      return `Visibiliza-se espessamento focal de parede, evidenciada pela presença de estrutura ${c.focalTipo}, de superfície ${c.focalSuperficie}, ecogênica e ${c.focalEcogenicidade} advinda da parede ${c.focalParede} e projetando-se ao lúmen, medindo em seu todo cerca de ${c.focalMed1} x ${c.focalMed2} cm (Pode estar relacionado a pólipo/coágulo, não descartando a possibilidade de processo neoplásico – Sugere-se exame de lavado vesical e acompanhamento sonográfico à critério do clínico responsável).`;
    }
    if (chipId === 'Cistolitiase') {
      const formadoraTxt = c.litiaseQtd === 'diversas estruturas' ? 'formadoras' : 'formadora';
      return `Nota-se a presença de ${c.litiaseQtd} de interface hiperecogênica ${formadoraTxt} de sombreamento acústico posterior, depositada ${c.litiaseDeposito} e ${c.litiaseMedidaTexto} cerca de ${c.litiaseMedida} cm (Compatível com cistolitíase).`;
    }
    return '';
  }
};