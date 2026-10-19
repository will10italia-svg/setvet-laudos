window.CONFIGURACAO_ORGAOS = window.CONFIGURACAO_ORGAOS || {};

window.CONFIGURACAO_ORGAOS.rins = {
  id: 'rins',
  nome: 'Rins',
  icone: '🫘',
  oculto: false,

  campos: {
    simetria: 'simétricos',

    // Estados de expansão dos menus no painel
    mostrarRimE: false,
    mostrarRimD: false,

    // Rim Esquerdo
    rimeDimensoes: '',
    rimeMedida: '0,00',
    rimeContornos: 'regulares',
    rimePerdaDist: 'preservada',
    rimeDetalheCort: '',
    rimeEco: 'dentro dos limites da normalidade',
    rimeExtrab: '',
    rimeSugestivo: '',
    rimeMineralizacao: '',
    rimeMedMicrolitiase: '0,00',

    // Rim Direito
    rimdDimensoes: '',
    rimdMedida: '0,00',
    rimdContornos: 'regulares',
    rimdPerdaDist: 'preservada',
    rimdDetalheCort: '',
    rimdEco: 'dentro dos limites da normalidade',
    rimdExtrab: '',
    rimdSugestivo: '',
    rimdMineralizacao: '',
    rimdMedMicrolitiase: '0,00',

    // Achados Adicionais
    retracaoLado: 'esquerdo',
    nefroLado: 'esquerda',
    nefroMedE: '0,00',
    nefroMedD: '0,00',
    policisticosMed: '0,00',
    sinalMedularTipo: 'inflamatório',
    pielectasiaLado: 'esquerda',
    pielectasiaMedE: '0,00',
    pielectasiaMedD: '0,00',
    hidronefroseLado: 'esquerda',
    hidronefroseMedE: '0,00',
    hidronefroseMedD: '0,00',
    hidronefroseEfeito: 'compressão',
    infartoAgudoLado: 'esquerdo',
    infartoCronicoLado: 'esquerdo',
    cistoLado: 'esquerdo',
    cistoMedE: '0,00',
    cistoMedD: '0,00'
  },

  options: {
    simetria: ['simétricos', 'assimétricos'],
    rimeContornos: ['regulares', 'irregulares', 'pouco irregulares'],
    rimePerdaDist: ['preservada', 'discreta perda', 'moderada perda', 'perda total'],
    rimeEco: ['dentro dos limites da normalidade', 'elevada', 'discretamente elevada'],
    rimeMineralizacao: [
      { value: '', label: '[Sem mineralização]' },
      { value: '(associado a pontos de mineralização)', label: 'pontos de mineralização' },
      { value: '(associado a pontos de mineralização / microlitíase)', label: 'mineralização / microlitíase' }
    ],
    rimdContornos: ['regulares', 'irregulares', 'pouco irregulares'],
    rimdPerdaDist: ['preservada', 'discreta perda', 'moderada perda', 'perda total'],
    rimdEco: ['dentro dos limites da normalidade', 'elevada', 'discretamente elevada'],
    rimdMineralizacao: [
      { value: '', label: '[Sem mineralização]' },
      { value: '(associado a pontos de mineralização)', label: 'pontos de mineralização' },
      { value: '(associado a pontos de mineralização / microlitíase)', label: 'mineralização / microlitíase' }
    ],
    ladosLadoRetracao: ['esquerdo', 'direito', 'esquerdo e direito'],
    ladosLadoGeral: ['esquerda', 'direita', 'esquerda e direito'],
    ladosLadoEsquerdoDireito: ['esquerdo', 'direito', 'esquerdo e direito'],
    sinalMedularOpcoes: ['inflamatório', 'infeccioso'],
    hidroEfeitoOpcoes: ['compressão', 'perda ou compressão']
  },

  labels: {
    simetria: 'Simetria Renal',
    rimeMedida: 'Comprimento Rim E (cm)',
    rimeContornos: 'Contornos Rim E',
    rimePerdaDist: 'Distinção Corticomedular E',
    rimeEco: 'Ecogenicidade Cortical E',
    rimeMineralizacao: 'Mineralização / Microlitíase E',
    rimeMedMicrolitiase: 'Medida Microlitíase E (cm)',
    rimdMedida: 'Comprimento Rim D (cm)',
    rimdContornos: 'Contornos Rim D',
    rimdPerdaDist: 'Distinção Corticomedular D',
    rimdEco: 'Ecogenicidade Cortical D',
    rimdMineralizacao: 'Mineralização / Microlitíase D',
    rimdMedMicrolitiase: 'Medida Microlitíase D (cm)'
  },

  chipsSelecionados: [],
  chipsPatologias: [
    { id: 'Retracao', rotulo: 'Área de Retração', texto: '' },
    { id: 'Nefrolitiase', rotulo: 'Nefrolitíase', texto: '' },
    { id: 'Policisticos', rotulo: 'Policísticos', texto: '' },
    { id: 'SinalMedular', rotulo: 'Sinal da Medular', texto: '' },
    { id: 'Calcificacao', rotulo: 'Calcificação Distrófica', texto: 'Nota-se presença de estruturas puntiformes e hiperecogênicas dispersas em ambas corticais renais (Compatível com calcificação distrófica, podendo estar relacionado a endocrinopatia).' },
    { id: 'Pielectasia', rotulo: 'Pielectasia', texto: '' },
    { id: 'Hidronefrose', rotulo: 'Hidronefrose', texto: '' },
    { id: 'InfartoAgudo', rotulo: 'Área de Infarto Agudo', texto: '' },
    { id: 'InfartoCronico', rotulo: 'Área de Infarto Crônico', texto: '' },
    { id: 'Cisto', rotulo: 'Cisto Renal', texto: '' },
    { id: 'Fluido', rotulo: 'Fluido Subcapsular', texto: 'Nota-se discreta quantidade de conteúdo anecogênico (líquido) livre em permeio a cápsula renal (Sugestivo de fluido subcapsular).' }
  ],

  onFieldChange: function(campo, valor) {
    this.campos[campo] = valor;

    if (campo === 'rimeMedida' || campo === 'rimdMedida') {
      this.verificarSimetriaEDimensoes();
    }

    if (['rimePerdaDist', 'rimeEco', 'rimeExtrab'].includes(campo)) {
      this.aplicarCondicionais('e');
    }
    if (['rimdPerdaDist', 'rimdEco', 'rimdExtrab'].includes(campo)) {
      this.aplicarCondicionais('d');
    }

    // Se houver alteração de lado ou clique nos botões de expandir, re-renderiza o painel
    if (['mostrarRimE', 'mostrarRimD', 'nefroLado', 'pielectasiaLado', 'hidronefroseLado', 'cistoLado', 'infartoAgudoLado', 'infartoCronicoLado', 'retracaoLado'].includes(campo)) {
      if (typeof PainelConfigurador !== 'undefined' && PainelConfigurador.renderizar) {
        PainelConfigurador.renderizar();
      }
    }
  },

  verificarSimetriaEDimensoes: function() {
    const valE = parseFloat((this.campos.rimeMedida || '0').replace(',', '.')) || 0;
    const valD = parseFloat((this.campos.rimdMedida || '0').replace(',', '.')) || 0;

    if (valE > 0 && valD > 0) {
      const menor = Math.min(valE, valD);
      const maior = Math.max(valE, valD);
      const diff = ((maior - menor) / menor) * 100;
      this.campos.simetria = diff > 10 ? 'assimétricos' : 'simétricos';
    }

    const limiteRef = 4.0;
    if (valE > limiteRef) this.campos.rimeDimensoes = 'de dimensões aumentadas';
    else if (valE > 0 && this.campos.rimeDimensoes === 'de dimensões aumentadas') this.campos.rimeDimensoes = '';

    if (valD > limiteRef) this.campos.rimdDimensoes = 'de dimensões aumentadas';
    else if (valD > 0 && this.campos.rimdDimensoes === 'de dimensões aumentadas') this.campos.rimdDimensoes = '';
  },

  aplicarCondicionais: function(lado) {
    const pKey = lado === 'e' ? 'rimePerdaDist' : 'rimdPerdaDist';
    const eKey = lado === 'e' ? 'rimeEco' : 'rimdEco';
    const exKey = lado === 'e' ? 'rimeExtrab' : 'rimdExtrab';
    const sugKey = lado === 'e' ? 'rimeSugestivo' : 'rimdSugestivo';
    const minKey = lado === 'e' ? 'rimeMineralizacao' : 'rimdMineralizacao';

    if (['discreta perda', 'moderada perda', 'perda total'].includes(this.campos[pKey])) {
      this.campos[sugKey] = '(Sugestivo de degeneração senil e/ou nefropatia)';
    } else if (this.campos[pKey] === 'preservada' && this.campos[eKey] === 'dentro dos limites da normalidade') {
      this.campos[sugKey] = '';
    }

    if (['elevada', 'discretamente elevada'].includes(this.campos[eKey])) {
      this.campos[sugKey] = '(Sugestivo de infiltração gordurosa)';
    }

    if (this.campos[exKey] !== '') {
      this.campos[minKey] = '(associado a pontos de mineralização)';
    }
  },

  gerarTexto: function(c) {
    const rimeDimTxt = c.rimeDimensoes ? `${c.rimeDimensoes} ` : '';
    const rimeDetalheCortTxt = c.rimeDetalheCort ? ` ${c.rimeDetalheCort}` : '';
    const rimeExtrabTxt = c.rimeExtrab ? ` ${c.rimeExtrab}` : '';
    const rimeSugestivoTxt = c.rimeSugestivo ? ` ${c.rimeSugestivo}` : '';
    const rimeMinTxt = c.rimeMineralizacao ? ` ${c.rimeMineralizacao}` : '';
    const rimeMicroTxt = (c.rimeMineralizacao === '(associado a pontos de mineralização / microlitíase)' && c.rimeMedMicrolitiase && c.rimeMedMicrolitiase !== '0,00') 
      ? ` mensurando uma delas cerca de ${c.rimeMedMicrolitiase} cm.` : '.';

    const rE = `Rim esquerdo: de contornos ${c.rimeContornos} com ${c.rimePerdaDist} de distinção corticomedular${rimeDetalheCortTxt} e ecogenicidade de corticais ${c.rimeEco}${rimeExtrabTxt}${rimeSugestivoTxt}${rimeMinTxt}${rimeMicroTxt}`;

    const rimdDimTxt = c.rimdDimensoes ? `${c.rimdDimensoes} ` : '';
    const rimdDetalheCortTxt = c.rimdDetalheCort ? ` ${c.rimdDetalheCort}` : '';
    const rimdExtrabTxt = c.rimdExtrab ? ` ${c.rimdExtrab}` : '';
    const rimdSugestivoTxt = c.rimdSugestivo ? ` ${c.rimdSugestivo}` : '';
    const rimdMinTxt = c.rimdMineralizacao ? ` ${c.rimdMineralizacao}` : '';
    const rimdMicroTxt = (c.rimdMineralizacao === '(associado a pontos de mineralização / microlitíase)' && c.rimdMedMicrolitiase && c.rimdMedMicrolitiase !== '0,00') 
      ? ` mensurando uma delas cerca de ${c.rimdMedMicrolitiase} cm.` : '.';

    const rD = `Rim direito: de contornos ${c.rimdContornos} com ${c.rimdPerdaDist} de distinção corticomedular${rimdDetalheCortTxt} e ecogenicidade de corticais ${c.rimdEco}${rimdExtrabTxt}${rimdSugestivoTxt}${rimdMinTxt}${rimdMicroTxt}`;

    return `tópicos e ${c.simetria}.<br>&bull; Esquerdo (E): ${rimeDimTxt}${c.rimeMedida} cm de comprimento<br>&bull; Direito (D): ${rimdDimTxt}${c.rimdMedida} cm de comprimento<br>${rE}<br>${rD}`;
  },

  gerarTextoAchado: function(chipId, c) {
    if (chipId === 'Retracao') {
      const isPlural = c.retracaoLado.includes(' e ');
      return `Nota-se ${isPlural ? 'áreas' : 'área'} de retração em polo cranial do rim ${c.retracaoLado}${isPlural ? 's' : ''}.`;
    }
    if (chipId === 'Nefrolitiase') {
      const isPlural = c.nefroLado.includes(' e ');
      const medTxt = isPlural ? `esquerda: ${c.nefroMedE} cm e direita: ${c.nefroMedD} cm, respectivamente` : `${c.nefroMedE} cm`;
      return `Observa-se presença de ${isPlural ? 'estruturas' : 'estrutura'} de interface ${isPlural ? 'hiperecogênicas' : 'hiperecogênica'} ${isPlural ? 'formadoras' : 'formadora'} de sombreamento acústico posterior, ${isPlural ? 'localizadas' : 'localizada'} em pelve renal ${c.nefroLado} medindo cerca de ${medTxt} (Compatível com nefrolitíase).`;
    }
    if (chipId === 'Policisticos') {
      return `Evidencia-se perda da arquitetura renal devido a presença de incontáveis estruturas arredondadas e anecogênicas (cistos) em permeio ao parênquima, medindo a maior delas cerca de ${c.policisticosMed} cm de diâmetro (Sugestivo de doença renal policística, podendo estar relacionada a anomalia congênita).`;
    }
    if (chipId === 'SinalMedular') {
      return `Visibiliza-se presença de halo hiperecogênico paralelo a junção corticomedular bilateralmente (Compatível com sinal da medular, podendo estar relacionado a processo ${c.sinalMedularTipo}, nefropatia ou variação individual - Sugere-se correlacionar com demais achados clínicos).`;
    }
    if (chipId === 'Calcificacao') {
      return 'Nota-se presença de estruturas puntiformes e hiperecogênicas dispersas em ambas corticais renais (Compatível com calcificação distrófica, podendo estar relacionado a endocrinopatia).';
    }
    if (chipId === 'Pielectasia') {
      const isPlural = c.pielectasiaLado.includes(' e ');
      const medTxt = isPlural ? `esquerda: ${c.pielectasiaMedE} cm e direita: ${c.pielectasiaMedD} cm, respectivamente` : `${c.pielectasiaMedE} cm`;
      return `Nota-se ${isPlural ? 'discretas' : 'discreta'} ${isPlural ? 'dilatações' : 'dilatação'} de pelve renal ${c.pielectasiaLado} por conteúdo anecogênico e homogêneo, medindo cerca de ${medTxt} de altura (Pielectasia, podendo estar relacionada a fluidoterapia ou nefropatia).`;
    }
    if (chipId === 'Hidronefrose') {
      const isPlural = c.hidronefroseLado.includes(' e ');
      const medTxt = isPlural ? `esquerda: ${c.hidronefroseMedE} cm e direita: ${c.hidronefroseMedD} cm, respectivamente` : `${c.hidronefroseMedE} cm`;
      return `Evidencia-se ${isPlural ? 'dilatações' : 'dilatação'} de pelve renal ${c.hidronefroseLado} por conteúdo anecogênico e homogêneo, medindo cerca de ${medTxt} de altura, causando ${c.hidronefroseEfeito} da arquitetura renal (Hidronefrose, secundária a possível processo obstrutivo).`;
    }
    if (chipId === 'InfartoAgudo') {
      const isPlural = c.infartoAgudoLado.includes(' e ');
      return `Nota-se ${isPlural ? 'estruturas' : 'estrutura'} triangular, ${isPlural ? 'hipoecogênicas' : 'hipoecogênica'} e ${isPlural ? 'homogêneas' : 'homogênea'} em cortical renal ${c.infartoAgudoLado}${isPlural ? ', respectivamente' : ''}, com base larga em periferia e estreitamento em direção a junção corticomedular, sem vascularização ao modo Doppler colorido (${isPlural ? 'Áreas' : 'Área'} de infarto renal agudo).`;
    }
    if (chipId === 'InfartoCronico') {
      const isPlural = c.infartoCronicoLado.includes(' e ');
      return `Nota-se ${isPlural ? 'estruturas' : 'estrutura'} triangular, ${isPlural ? 'hiperecogênicas' : 'hiperecogênica'} e ${isPlural ? 'homogêneas' : 'homogênea'} em cortical renal ${c.infartoCronicoLado}${isPlural ? ', respectivamente' : ''}, com base larga em periferia e estreitamento em direção a junção corticomedular, sem vascularização ao modo Doppler colorido (${isPlural ? 'Áreas' : 'Área'} de infarto renal crônico).`;
    }
    if (chipId === 'Cisto') {
      const isPlural = c.cistoLado.includes(' e ');
      const medTxt = isPlural ? `esquerdo: ${c.cistoMedE} cm e direito: ${c.cistoMedD} cm, respectivamente` : `${c.cistoMedE} cm`;
      return `Nota-se ${isPlural ? 'estruturas' : 'estrutura'} arredondada, de paredes finas e regulares, ${isPlural ? 'anecogênicas' : 'anecogênica'} e ${isPlural ? 'homogêneas' : 'homogênea'}, localizada em cortical renal ${c.cistoLado} e medindo cerca de ${medTxt} de diâmetro (Compatível com cisto renal).`;
    }
    if (chipId === 'Fluido') {
      return 'Nota-se discreta quantidade de conteúdo anecogênico (líquido) livre em permeio a cápsula renal (Sugestivo de fluido subcapsular).';
    }
    return '';
  },

  renderCamposCustomizados: function() {
    // Topo limpo contendo apenas a Simetria e os botões para recolher/expandir o Rim Esquerdo e o Rim Direito
    let html = `
      <div class="space-y-3">
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Simetria Renal</label>
          <select onchange="PainelConfigurador.atualizarCampo('rins', 'simetria', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            <option value="simétricos" ${this.campos.simetria === 'simétricos' ? 'selected' : ''}>simétricos</option>
            <option value="assimétricos" ${this.campos.simetria === 'assimétricos' ? 'selected' : ''}>assimétricos</option>
          </select>
        </div>

        <!-- Botão para abrir/fechar Configurações do Rim Esquerdo -->
        <div>
          <button type="button" onclick="PainelConfigurador.atualizarCampo('rins', 'mostrarRimE', ${!this.campos.mostrarRimE})" class="w-full flex items-center justify-between p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-400 transition">
            <span>🫘 Configurações do Rim Esquerdo (E)</span>
            <span>${this.campos.mostrarRimE ? '▲' : '▼'}</span>
          </button>
          
          ${this.campos.mostrarRimE ? `
            <div class="mt-2 p-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg space-y-2">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Comprimento Rim E (cm)</label>
                <input type="text" value="${this.campos.rimeMedida}" oninput="PainelConfigurador.atualizarCampo('rins', 'rimeMedida', this.value)" class="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200 text-center">
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Contornos Rim E</label>
                <select onchange="PainelConfigurador.atualizarCampo('rins', 'rimeContornos', this.value)" class="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                  ${this.options.rimeContornos.map(opt => `<option value="${opt}" ${this.campos.rimeContornos === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Distinção Corticomedular E</label>
                <select onchange="PainelConfigurador.atualizarCampo('rins', 'rimePerdaDist', this.value)" class="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                  ${this.options.rimePerdaDist.map(opt => `<option value="${opt}" ${this.campos.rimePerdaDist === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ecogenicidade Cortical E</label>
                <select onchange="PainelConfigurador.atualizarCampo('rins', 'rimeEco', this.value)" class="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                  ${this.options.rimeEco.map(opt => `<option value="${opt}" ${this.campos.rimeEco === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mineralização / Microlitíase E</label>
                <select onchange="PainelConfigurador.atualizarCampo('rins', 'rimeMineralizacao', this.value)" class="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                  ${this.options.rimeMineralizacao.map(opt => `<option value="${opt.value}" ${this.campos.rimeMineralizacao === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
                </select>
              </div>
              ${this.campos.rimeMineralizacao === '(associado a pontos de mineralização / microlitíase)' ? `
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Medida Microlitíase E (cm)</label>
                  <input type="text" value="${this.campos.rimeMedMicrolitiase}" oninput="PainelConfigurador.atualizarCampo('rins', 'rimeMedMicrolitiase', this.value)" class="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200 text-center">
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>

        <!-- Botão para abrir/fechar Configurações do Rim Direito -->
        <div>
          <button type="button" onclick="PainelConfigurador.atualizarCampo('rins', 'mostrarRimD', ${!this.campos.mostrarRimD})" class="w-full flex items-center justify-between p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-400 transition">
            <span>🫘 Configurações do Rim Direito (D)</span>
            <span>${this.campos.mostrarRimD ? '▲' : '▼'}</span>
          </button>

          ${this.campos.mostrarRimD ? `
            <div class="mt-2 p-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg space-y-2">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Comprimento Rim D (cm)</label>
                <input type="text" value="${this.campos.rimdMedida}" oninput="PainelConfigurador.atualizarCampo('rins', 'rimdMedida', this.value)" class="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200 text-center">
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Contornos Rim D</label>
                <select onchange="PainelConfigurador.atualizarCampo('rins', 'rimdContornos', this.value)" class="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                  ${this.options.rimdContornos.map(opt => `<option value="${opt}" ${this.campos.rimdContornos === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Distinção Corticomedular D</label>
                <select onchange="PainelConfigurador.atualizarCampo('rins', 'rimdPerdaDist', this.value)" class="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                  ${this.options.rimdPerdaDist.map(opt => `<option value="${opt}" ${this.campos.rimdPerdaDist === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ecogenicidade Cortical D</label>
                <select onchange="PainelConfigurador.atualizarCampo('rins', 'rimdEco', this.value)" class="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                  ${this.options.rimdEco.map(opt => `<option value="${opt}" ${this.campos.rimdEco === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mineralização / Microlitíase D</label>
                <select onchange="PainelConfigurador.atualizarCampo('rins', 'rimdMineralizacao', this.value)" class="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                  ${this.options.rimdMineralizacao.map(opt => `<option value="${opt.value}" ${this.campos.rimdMineralizacao === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
                </select>
              </div>
              ${this.campos.rimdMineralizacao === '(associado a pontos de mineralização / microlitíase)' ? `
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Medida Microlitíase D (cm)</label>
                  <input type="text" value="${this.campos.rimdMedMicrolitiase}" oninput="PainelConfigurador.atualizarCampo('rins', 'rimdMedMicrolitiase', this.value)" class="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200 text-center">
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Renderização dos submenus integrada exatamente abaixo de cada achado selecionado
    if (this.chipsSelecionados && this.chipsSelecionados.length > 0) {
      html += `<div class="mt-4 pt-3 border-t border-slate-200 dark:border-zinc-700 space-y-3">`;
      
      this.chipsSelecionados.forEach(chipId => {
        html += `
          <div class="p-3 bg-slate-100 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
            <span class="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block border-b border-slate-200 dark:border-zinc-700 pb-1">Configurações de: ${chipId}</span>
        `;

        if (chipId === 'Retracao') {
          html += `
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lado</label>
              <select onchange="PainelConfigurador.atualizarCampo('rins', 'retracaoLado', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                ${this.options.ladosLadoEsquerdoDireito.map(opt => `<option value="${opt}" ${this.campos.retracaoLado === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>
          `;
        } else if (chipId === 'Nefrolitiase') {
          html += `
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lado</label>
              <select onchange="PainelConfigurador.atualizarCampo('rins', 'nefroLado', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                ${this.options.ladosLadoGeral.map(opt => `<option value="${opt}" ${this.campos.nefroLado === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>
            ${this.campos.nefroLado.includes(' e ') ? `
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Medida Esq (cm)</label>
                  <input type="text" value="${this.campos.nefroMedE}" oninput="PainelConfigurador.atualizarCampo('rins', 'nefroMedE', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200 text-center">
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Medida Dir (cm)</label>
                  <input type="text" value="${this.campos.nefroMedD}" oninput="PainelConfigurador.atualizarCampo('rins', 'nefroMedD', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200 text-center">
                </div>
              </div>
            ` : `
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Medida (cm)</label>
                <input type="text" value="${this.campos.nefroMedE}" oninput="PainelConfigurador.atualizarCampo('rins', 'nefroMedE', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200 text-center">
              </div>
            `}
          `;
        } else if (chipId === 'Policisticos') {
          html += `
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Maior Cisto (cm)</label>
              <input type="text" value="${this.campos.policisticosMed}" oninput="PainelConfigurador.atualizarCampo('rins', 'policisticosMed', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200 text-center">
            </div>
          `;
        } else if (chipId === 'SinalMedular') {
          html += `
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipo de Processo</label>
              <select onchange="PainelConfigurador.atualizarCampo('rins', 'sinalMedularTipo', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                ${this.options.sinalMedularOpcoes.map(opt => `<option value="${opt}" ${this.campos.sinalMedularTipo === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>
          `;
        } else if (chipId === 'Pielectasia') {
          html += `
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lado</label>
              <select onchange="PainelConfigurador.atualizarCampo('rins', 'pielectasiaLado', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                ${this.options.ladosLadoGeral.map(opt => `<option value="${opt}" ${this.campos.pielectasiaLado === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>
            ${this.campos.pielectasiaLado.includes(' e ') ? `
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Altura Esq (cm)</label>
                  <input type="text" value="${this.campos.pielectasiaMedE}" oninput="PainelConfigurador.atualizarCampo('rins', 'pielectasiaMedE', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200 text-center">
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Altura Dir (cm)</label>
                  <input type="text" value="${this.campos.pielectasiaMedD}" oninput="PainelConfigurador.atualizarCampo('rins', 'pielectasiaMedD', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200 text-center">
                </div>
              </div>
            ` : `
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Altura (cm)</label>
                <input type="text" value="${this.campos.pielectasiaMedE}" oninput="PainelConfigurador.atualizarCampo('rins', 'pielectasiaMedE', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200 text-center">
              </div>
            `}
          `;
        } else if (chipId === 'Hidronefrose') {
          html += `
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lado</label>
              <select onchange="PainelConfigurador.atualizarCampo('rins', 'hidronefroseLado', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                ${this.options.ladosLadoGeral.map(opt => `<option value="${opt}" ${this.campos.hidronefroseLado === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>
            ${this.campos.hidronefroseLado.includes(' e ') ? `
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Altura Esq (cm)</label>
                  <input type="text" value="${this.campos.hidronefroseMedE}" oninput="PainelConfigurador.atualizarCampo('rins', 'hidronefroseMedE', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200 text-center">
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Altura Dir (cm)</label>
                  <input type="text" value="${this.campos.hidronefroseMedD}" oninput="PainelConfigurador.atualizarCampo('rins', 'hidronefroseMedD', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200 text-center">
                </div>
              </div>
            ` : `
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Altura (cm)</label>
                <input type="text" value="${this.campos.hidronefroseMedE}" oninput="PainelConfigurador.atualizarCampo('rins', 'hidronefroseMedE', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200 text-center">
              </div>
            `}
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Efeito na Arquitetura</label>
              <select onchange="PainelConfigurador.atualizarCampo('rins', 'hidronefroseEfeito', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                ${this.options.hidroEfeitoOpcoes.map(opt => `<option value="${opt}" ${this.campos.hidronefroseEfeito === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>
          `;
        } else if (chipId === 'InfartoAgudo') {
          html += `
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lado</label>
              <select onchange="PainelConfigurador.atualizarCampo('rins', 'infartoAgudoLado', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                ${this.options.ladosLadoEsquerdoDireito.map(opt => `<option value="${opt}" ${this.campos.infartoAgudoLado === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>
          `;
        } else if (chipId === 'InfartoCronico') {
          html += `
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lado</label>
              <select onchange="PainelConfigurador.atualizarCampo('rins', 'infartoCronicoLado', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                ${this.options.ladosLadoEsquerdoDireito.map(opt => `<option value="${opt}" ${this.campos.infartoCronicoLado === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>
          `;
        } else if (chipId === 'Cisto') {
          html += `
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lado</label>
              <select onchange="PainelConfigurador.atualizarCampo('rins', 'cistoLado', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                ${this.options.ladosLadoEsquerdoDireito.map(opt => `<option value="${opt}" ${this.campos.cistoLado === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>
            ${this.campos.cistoLado.includes(' e ') ? `
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Medida Esq (cm)</label>
                  <input type="text" value="${this.campos.cistoMedE}" oninput="PainelConfigurador.atualizarCampo('rins', 'cistoMedE', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200 text-center">
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Medida Dir (cm)</label>
                  <input type="text" value="${this.campos.cistoMedD}" oninput="PainelConfigurador.atualizarCampo('rins', 'cistoMedD', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200 text-center">
                </div>
              </div>
            ` : `
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Diâmetro (cm)</label>
                <input type="text" value="${this.campos.cistoMedE}" oninput="PainelConfigurador.atualizarCampo('rins', 'cistoMedE', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200 text-center">
              </div>
            `}
          `;
        }

        html += `</div>`;
      });

      html += `</div>`;
    }

    return html;
  }
};