window.CONFIGURACAO_ORGAOS = window.CONFIGURACAO_ORGAOS || {};

window.CONFIGURACAO_ORGAOS.baco = {
  id: 'baco',
  nome: 'Baço',
  icone: '🩸',
  oculto: false,

  campos: {
    modoEspecial: 'padrao',
    margens: 'finas',
    dimensoes: 'preservadas',
    ecotextura: 'homogêneo',
    ecogenicidade: 'preservada',
    
    rendDimensoes: 'aumentadas',
    rendBordas: 'afiladas',
    rendEcogenicidade: 'mantida',

    mielolipomaQtd: 'singular',
    mielolipomaLoc: 'cabeça',
    mielolipomaMed1: '0,00',
    mielolipomaMed2: '0,00',

    hiperplasiaQtd: 'singular',
    hiperplasiaLoc: 'cabeça',
    hiperplasiaMed1: '0,00',
    hiperplasiaMed2: '0,00',

    cistoQtd: 'singular',
    cistoLoc: 'cabeça',
    cistoMed: '0,00',

    abscessoQtd: 'singular',
    abscessoLoc: 'cabeça',
    abscessoMed1: '0,00',
    abscessoMed2: '0,00',

    lesaoAlvoQtd: 'singular',
    lesaoAlvoLoc: 'cabeça',
    lesaoAlvoMed1: '0,00',
    lesaoAlvoMed2: '0,00',

    neoplasicoQtd: 'singular',
    neoplasicoLoc: 'cabeça',
    neoplasicoMed1: '0,00',
    neoplasicoMed2: '0,00',
    neoplasicoDoppler: 'com vascularização',

    infartoLoc: 'cabeça',
    torsaoRegiao: 'hilar'
  },

  options: {
    modoEspecial: ['padrao', 'esplenectomia', 'rendilhado'],
    margens: ['finas', 'abauladas'],
    dimensoes: ['preservadas', 'aumentadas (esplenomegalia)', 'diminuídas (microesplenia)'],
    ecotextura: ['homogêneo', 'grosseiro'],
    ecogenicidade: [
      'preservada',
      'preservada (Sugestivo de processo inflamatório / infeccioso)',
      'preservada (Sugestivo de desidratação / senescência / alteração sistêmica)',
      'reduzida',
      'reduzida (Sugestivo de toxemia e/ou congestão / processo inflamatório / infeccioso)',
      'reduzida (Sugestivo de desidratação, senescência ou alteração sistêmica, associado a toxemia e/ou congestão e/ou processo inflamatório/infeccioso)',
      'elevada'
    ],
    rendDimensoes: ['aumentadas', 'diminuídas'],
    rendBordas: ['afiladas', 'abauladas'],
    rendEcogenicidade: ['mantida', 'reduzida'],
    localizacao: ['cabeça', 'corpo', 'cauda', 'cabeça e corpo', 'corpo e cauda', 'cabeça e cauda', 'cabeça/corpo/cauda']
  },

  labels: {
    modoEspecial: 'Modo / Estado do Baço',
    margens: 'Margens',
    dimensoes: 'Dimensões',
    ecotextura: 'Ecotextura',
    ecogenicidade: 'Ecogenicidade',
    rendDimensoes: 'Dimensões (Rendilhado)',
    rendBordas: 'Bordas (Rendilhado)',
    rendEcogenicidade: 'Ecogenicidade (Rendilhado)'
  },

  chipsSelecionados: [],
  chipsPatologias: [
    { id: 'Fibrose', rotulo: 'Fibrose perivascular esplênica', texto: 'Nota-se a presença de áreas amorfas, ecogênicas e homogêneas adjacente aos trajetos vasculares esplênicos (Compatível com fibrose perivascular).' },
    { id: 'Mielolipoma', rotulo: 'Mielolipoma / área de fibrose', texto: '' },
    { id: 'Calcificacao', rotulo: 'Calcificação distrófica esplênica', texto: 'Evidencia-se a presença de estruturas puntiformes e hiperecogênicas dispersas por todo o parênquima esplênico (Calcificação distrófica, podendo estar relacionado a endocrinopatia).' },
    { id: 'Hiperplasia', rotulo: 'Hiperplasia nodular / nódulo', texto: '' },
    { id: 'Cisto', rotulo: 'Cisto esplênico', texto: '' },
    { id: 'Abscesso', rotulo: 'Abscesso esplênico', texto: '' },
    { id: 'LesaoAlvo', rotulo: 'Lesão em alvo', texto: '' },
    { id: 'Neoplasico', rotulo: 'Processo neoplásico esplênico', texto: '' },
    { id: 'Infarto', rotulo: 'Infarto esplênico', texto: '' },
    { id: 'Torsao', rotulo: 'Torção esplênica', texto: '' }
  ],

  onFieldChange: function(campo, valor) {
    this.campos[campo] = valor;
    if (campo === 'modoEspecial') {
      PainelConfigurador.renderizar();
    }
  },

  gerarTexto: function(c) {
    if (c.modoEspecial === 'esplenectomia') {
      return 'baço não caracterizado – Histórico de esplenectomia.';
    }
    if (c.modoEspecial === 'rendilhado') {
      return `de dimensões ${c.rendDimensoes}, contornos regulares, bordas ${c.rendBordas}, ecogenicidade ${c.rendEcogenicidade} e ecotextura heterogênea às custas de incontáveis diminutas estruturas arredondadas e hipoecogênicas dispersas pelo parênquima (aspecto rendilhado) (Pode estar relacionado a esplenite ou hematopoiese extramedular, não descartando a possibilidade de infiltrado neoplásico).`;
    }
    return `contornos definidos e regulares, margens ${c.margens}, dimensões ${c.dimensoes}, parênquima ${c.ecotextura} e ecogenicidade ${c.ecogenicidade}.`;
  },

  gerarTextoAchado: function(chipId, c) {
    if (chipId === 'Fibrose') {
      return 'Nota-se a presença de áreas amorfas, ecogênicas e homogêneas adjacente aos trajetos vasculares esplênicos (Compatível com fibrose perivascular).';
    }
    if (chipId === 'Mielolipoma') {
      const isPlural = c.mielolipomaQtd === 'plural';
      return `Observa${isPlural ? 'm' : ''}-se estrutura${isPlural ? 's' : ''} tendendo a arredondada${isPlural ? 's' : ''}, de contornos definidos e regulares, hiperecogênica${isPlural ? 's' : ''} e homogênea${isPlural ? 's' : ''} localizada${isPlural ? 's' : ''} em ${c.mielolipomaLoc} esplênica e medindo ${isPlural ? 'uma delas ' : ''}cerca de ${c.mielolipomaMed1} x ${c.mielolipomaMed2} cm (Sugestivo de mielolipoma${isPlural ? 's' : ''} ou área${isPlural ? 's' : ''} de fibrose).`;
    }
    if (chipId === 'Calcificacao') {
      return 'Evidencia-se a presença de estruturas puntiformes e hiperecogênicas dispersas por todo o parênquima esplênico (Calcificação distrófica, podendo estar relacionado a endocrinopatia).';
    }
    if (chipId === 'Hiperplasia') {
      const isPlural = c.hiperplasiaQtd === 'plural';
      return `Nota${isPlural ? 'm' : ''}-se estrutura${isPlural ? 's' : ''} arredondada${isPlural ? 's' : ''}, de contornos definidos e regulares, hipoecogênica${isPlural ? 's' : ''}/ecogênica${isPlural ? 's' : ''} e homogênea${isPlural ? 's' : ''} localizada${isPlural ? 's' : ''} em ${c.hiperplasiaLoc} esplênica e medindo ${isPlural ? 'uma delas ' : ''}cerca de ${c.hiperplasiaMed1} x ${c.hiperplasiaMed2} cm (Pode estar relacionado a nódulo${isPlural ? 's' : ''} hiperplásico${isPlural ? 's' : ''} ou regenerativo${isPlural ? 's' : ''}).`;
    }
    if (chipId === 'Cisto') {
      const isPlural = c.cistoQtd === 'plural';
      return `Observa${isPlural ? 'm' : ''}-se estrutura${isPlural ? 's' : ''} arredondada${isPlural ? 's' : ''}, de paredes finas e regulares, anecogênica${isPlural ? 's' : ''} e homogênea${isPlural ? 's' : ''} localizada${isPlural ? 's' : ''} em ${c.cistoLoc} esplênica e medindo ${isPlural ? 'uma delas ' : ''}cerca de ${c.cistoMed} cm de diâmetro (Compatível com cisto${isPlural ? 's' : ''} esplênico${isPlural ? 's' : ''}).`;
    }
    if (chipId === 'Abscesso') {
      const isPlural = c.abscessoQtd === 'plural';
      return `Nota${isPlural ? 'm' : ''}-se estrutura${isPlural ? 's' : ''} tendendo a arredondada${isPlural ? 's' : ''}, de contornos definidos e pouco irregulares, anecogênica${isPlural ? 's' : ''}/hipoecogênica${isPlural ? 's' : ''} e homogênea${isPlural ? 's' : ''}, exceto pela presença de diminutas partículas ecogênicas em permeio (celularidade), localizada${isPlural ? 's' : ''} em ${c.abscessoLoc} esplênica e medindo ${isPlural ? 'uma delas ' : ''}cerca de ${c.abscessoMed1} x ${c.abscessoMed2} cm (Sugestivo de abscesso${isPlural ? 's' : ''} esplênico${isPlural ? 's' : ''}).`;
    }
    if (chipId === 'LesaoAlvo') {
      const isPlural = c.lesaoAlvoQtd === 'plural';
      return `Nota${isPlural ? 'm' : ''}-se estrutura${isPlural ? 's' : ''} arredondada${isPlural ? 's' : ''}, de contornos definidos e regulares, com centro ecogênico e periferia hipoecogênica, caracterizando “lesão${isPlural ? 'ões' : ''} em alvo”, localizada${isPlural ? 's' : ''} em ${c.lesaoAlvoLoc} esplênica e medindo ${isPlural ? 'uma delas ' : ''}cerca de ${c.lesaoAlvoMed1} x ${c.lesaoAlvoMed2} cm (Nódulo${isPlural ? 's' : ''} esplênico${isPlural ? 's' : ''}, geralmente indicativo${isPlural ? 's' : ''} de malignidade).`;
    }
    if (chipId === 'Neoplasico') {
      const isPlural = c.neoplasicoQtd === 'plural';
      return `Observa${isPlural ? 'm' : ''}-se estrutura${isPlural ? 's' : ''} tendendo a arredondada${isPlural ? 's' : ''}, de contornos definidos e regulares, ecogenicidade mista e ecotextura heterogênea localizada${isPlural ? 's' : ''} em ${c.neoplasicoLoc} esplênica, medindo ${isPlural ? 'uma delas ' : ''}cerca de ${c.neoplasicoMed1} x ${c.neoplasicoMed2} cm e ${c.neoplasicoDoppler} ao modo Doppler colorido (Pode estar relacionado a processo${isPlural ? 's' : ''} neoplásico${isPlural ? 's' : ''}).`;
    }
    if (chipId === 'Infarto') {
      return `Em região de ${c.infartoLoc} esplênica, evidencia-se área com evidente diminuição da ecogenicidade, de aspecto grosseiro e sem sinais de vascularização ao modo Doppler colorido (Pode estar relacionado a infarto esplênico).`;
    }
    if (chipId === 'Torsao') {
      return `Observa-se baço de dimensões aumentadas, contornos irregulares, bordos arredondados, ecogenicidade reduzida, ecotextura grosseira e ausência de fluxo ao modo Doppler colorido em região ${c.torsaoRegiao}, podendo estar associado a imagem triangular e hiperecogênica em hilo esplênico (Achados ultrassonográficos que sugerem torção esplênica).`;
    }
    return '';
  },

  renderCamposCustomizados: function() {
    let html = `
      <div class="space-y-3">
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Modo / Estado do Baço</label>
          <select onchange="PainelConfigurador.atualizarCampo('baco', 'modoEspecial', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            <option value="padrao" ${this.campos.modoEspecial === 'padrao' ? 'selected' : ''}>Padrão (Normal)</option>
            <option value="esplenectomia" ${this.campos.modoEspecial === 'esplenectomia' ? 'selected' : ''}>Esplenectomia</option>
            <option value="rendilhado" ${this.campos.modoEspecial === 'rendilhado' ? 'selected' : ''}>Aspecto Rendilhado</option>
          </select>
        </div>
    `;

    if (this.campos.modoEspecial === 'padrao') {
      html += `
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Margens</label>
          <select onchange="PainelConfigurador.atualizarCampo('baco', 'margens', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            ${this.options.margens.map(opt => `<option value="${opt}" ${this.campos.margens === opt ? 'selected' : ''}>${opt}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Dimensões</label>
          <select onchange="PainelConfigurador.atualizarCampo('baco', 'dimensoes', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            ${this.options.dimensoes.map(opt => `<option value="${opt}" ${this.campos.dimensoes === opt ? 'selected' : ''}>${opt}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ecotextura</label>
          <select onchange="PainelConfigurador.atualizarCampo('baco', 'ecotextura', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            ${this.options.ecotextura.map(opt => `<option value="${opt}" ${this.campos.ecotextura === opt ? 'selected' : ''}>${opt}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ecogenicidade</label>
          <select onchange="PainelConfigurador.atualizarCampo('baco', 'ecogenicidade', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            ${this.options.ecogenicidade.map(opt => `<option value="${opt}" ${this.campos.ecogenicidade === opt ? 'selected' : ''}>${opt}</option>`).join('')}
          </select>
        </div>
      `;
    } else if (this.campos.modoEspecial === 'rendilhado') {
      html += `
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Dimensões (Rendilhado)</label>
          <select onchange="PainelConfigurador.atualizarCampo('baco', 'rendDimensoes', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            ${this.options.rendDimensoes.map(opt => `<option value="${opt}" ${this.campos.rendDimensoes === opt ? 'selected' : ''}>${opt}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Bordas (Rendilhado)</label>
          <select onchange="PainelConfigurador.atualizarCampo('baco', 'rendBordas', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            ${this.options.rendBordas.map(opt => `<option value="${opt}" ${this.campos.rendBordas === opt ? 'selected' : ''}>${opt}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ecogenicidade (Rendilhado)</label>
          <select onchange="PainelConfigurador.atualizarCampo('baco', 'rendEcogenicidade', this.value)" class="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            ${this.options.rendEcogenicidade.map(opt => `<option value="${opt}" ${this.campos.rendEcogenicidade === opt ? 'selected' : ''}>${opt}</option>`).join('')}
          </select>
        </div>
      `;
    }

    // Renderização integrada dos submenus logo abaixo de cada achado selecionado (somente se não for esplenectomia)
    if (this.campos.modoEspecial !== 'esplenectomia') {
      this.chipsSelecionados.forEach(chipId => {
        html += `
          <div class="mt-2 p-2.5 bg-slate-100 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
            <span class="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block border-b border-slate-200 dark:border-zinc-700 pb-1">Configurações de: ${chipId}</span>
        `;

        if (['Mielolipoma', 'Hiperplasia', 'Cisto', 'Abscesso', 'LesaoAlvo', 'Neoplasico'].includes(chipId)) {
          const keyQtd = `${chipId.toLowerCase()}Qtd`;
          const keyLoc = `${chipId.toLowerCase()}Loc`;
          html += `
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Quantidade</label>
              <select onchange="PainelConfigurador.atualizarCampo('baco', '${keyQtd}', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                <option value="singular" ${this.campos[keyQtd] === 'singular' ? 'selected' : ''}>Única / Singular</option>
                <option value="plural" ${this.campos[keyQtd] === 'plural' ? 'selected' : ''}>Múltiplas / Plural</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Localização</label>
              <select onchange="PainelConfigurador.atualizarCampo('baco', '${keyLoc}', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                ${this.options.localizacao.map(opt => `<option value="${opt}" ${this.campos[keyLoc] === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>
          `;
        }

        if (['Mielolipoma', 'Hiperplasia', 'Abscesso', 'LesaoAlvo', 'Neoplasico'].includes(chipId)) {
          const keyM1 = `${chipId.toLowerCase()}Med1`;
          const keyM2 = `${chipId.toLowerCase()}Med2`;
          html += `
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Medida 1 (cm)</label>
                <input type="text" value="${this.campos[keyM1]}" oninput="PainelConfigurador.atualizarCampo('baco', '${keyM1}', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200 text-center">
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Medida 2 (cm)</label>
                <input type="text" value="${this.campos[keyM2]}" oninput="PainelConfigurador.atualizarCampo('baco', '${keyM2}', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200 text-center">
              </div>
            </div>
          `;
        } else if (chipId === 'Cisto') {
          html += `
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Diâmetro (cm)</label>
              <input type="text" value="${this.campos.cistoMed}" oninput="PainelConfigurador.atualizarCampo('baco', 'cistoMed', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200 text-center">
            </div>
          `;
        } else if (chipId === 'Neoplasico') {
          html += `
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Modo Doppler</label>
              <select onchange="PainelConfigurador.atualizarCampo('baco', 'neoplasicoDoppler', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                <option value="com vascularização" ${this.campos.neoplasicoDoppler === 'com vascularização' ? 'selected' : ''}>Com vascularização</option>
                <option value="sem vascularização" ${this.campos.neoplasicoDoppler === 'sem vascularização' ? 'selected' : ''}>Sem vascularização</option>
                <option value="com/sem vascularização" ${this.campos.neoplasicoDoppler === 'com/sem vascularização' ? 'selected' : ''}>Com/sem vascularização</option>
              </select>
            </div>
          `;
        } else if (chipId === 'Infarto') {
          html += `
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Região</label>
              <select onchange="PainelConfigurador.atualizarCampo('baco', 'infartoLoc', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
                ${this.options.localizacao.map(opt => `<option value="${opt}" ${this.campos.infartoLoc === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>
          `;
        } else if (chipId === 'Torsao') {
          html += `
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Região Afetada</label>
              <input type="text" value="${this.campos.torsaoRegiao}" oninput="PainelConfigurador.atualizarCampo('baco', 'torsaoRegiao', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-1.5 text-xs font-semibold dark:text-zinc-200">
            </div>
          `;
        }

        html += `</div>`;
      });
    }

    html += `</div>`;
    return html;
  }
};