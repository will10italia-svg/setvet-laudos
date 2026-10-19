// js/orgaos/alcas.js

if (!window.CONFIGURACAO_ORGAOS) {
  window.CONFIGURACAO_ORGAOS = {};
}

window.CONFIGURACAO_ORGAOS.alcas = {
  id: 'alcas',
  nome: 'Alças Intestinais',
  icone: '🌀',
  oculto: false,

  campos: {
    intestinoPadrao: 'com padrão em camadas mantido',
    conteudoGeralAtivo: false,
    conteudoGeral: 'fecal / gasoso',

    // Todos recolhidos por padrão
    exibirDuodeno: false,
    medDuodeno: '0,00',
    conteudoDuodeno: 'fecal / gasoso',

    exibirJejuno: false,
    medJejuno: '0,00',
    conteudoJejuno: 'fecal / gasoso',

    exibirColonD: false,
    medColonD: '0,00',
    conteudoColonD: 'fecal / gasoso',

    exibirColonA: false,
    medColonA: '0,00',
    conteudoColonA: 'fecal / gasoso',

    exibirColonT: false,
    medColonT: '0,00',
    conteudoColonT: 'fecal / gasoso',

    exibirIleo: false,
    medIleo: '0,00',
    conteudoIleo: 'fecal / gasoso',

    peristaltismoAtivo: true,

    // Controle de Achados Adicionais
    achadoAtivo: 'nenhum',
    sombreamentoColon: 'cólon',
    intussuscepcaoRegiao: '[região]',
    intussuscepcaoMed1: '0,00',
    intussuscepcaoMed2: '0,00',
    espessamentoSegmento: '[segmento]',
    espessamentoMed1: '0,00',
    espessamentoMed2: '0,00',
    ceEstrutura: 'estrutura',
    ceComprimento: '0,00',
    cePlural: '(Sugestivo de corpo estranho intestinal)',
    ceLinearSegmento: '[segmento]',
    ceLinearComprimento: '0,00'
  },

  options: {
    intestinoPadrao: [
      { value: 'com padrão em camadas mantido', label: 'com padrão em camadas mantido' },
      { value: 'com alguns segmentos de aspecto corrugado e camada muscular mais evidente', label: 'com alguns segmentos de aspecto corrugado e camada muscular mais evidente' },
      { value: 'com alguns segmentos de aspecto levemente corrugado e camada muscular discretamente evidente', label: 'com alguns segmentos de aspecto levemente corrugado e camada muscular discretamente evidente' }
    ],
    conteudoGeral: [
      'fecal / gasoso',
      'predominantemente fecal',
      'fecal',
      'fecal / pastoso',
      'fecal / gasoso / pastoso',
      'pastoso',
      'pastoso / gasoso'
    ]
  },

  labels: {
    intestinoPadrao: 'Padrão Geral',
    conteudoGeralAtivo: 'Aplicar Conteúdo Geral para todas as alças',
    conteudoGeral: 'Conteúdo Geral'
  },

  chipsPatologias: [],
  chipsSelecionados: [],

  onInit: function() {},

  onFieldChange: function(campo, valor) {
    this.campos[campo] = valor;

    if (campo === 'conteudoGeralAtivo' && valor) {
      this.aplicarConteudoGeral(this.campos.conteudoGeral);
    } else if (campo === 'conteudoGeral' && this.campos.conteudoGeralAtivo) {
      this.aplicarConteudoGeral(valor);
    }

    delete EstadoApp.textosEditadosManualmente['alcas'];
    AppInterface.marcarComoRascunho();
    MotorLaudo.atualizarPaginasLaudo();
  },

  aplicarConteudoGeral: function(val) {
    this.campos.conteudoDuodeno = val;
    this.campos.conteudoJejuno = val;
    this.campos.conteudoColonD = val;
    this.campos.conteudoColonA = val;
    this.campos.conteudoColonT = val;
    this.campos.conteudoIleo = val;
  },

  ativarAchado: function(tipoAchado) {
    if (this.campos.achadoAtivo === tipoAchado) {
      this.campos.achadoAtivo = 'nenhum';
    } else {
      this.campos.achadoAtivo = tipoAchado;
    }

    delete EstadoApp.textosEditadosManualmente['alcas'];
    PainelConfigurador.renderizar();
    AppInterface.marcarComoRascunho();
    MotorLaudo.atualizarPaginasLaudo();
  },

  obterLimitesReferencia: function() {
    const especie = (document.getElementById('p-especie')?.value || 'Canino').toLowerCase();
    const porte = document.getElementById('p-porte')?.value || 'Cão P';
    const isFelino = especie.includes('felino') || especie.includes('gato');

    let limites = {
      duodeno: '0,51', jejuno: '0,40', colonD: '0,30', colonA: '0,30', colonT: '0,30', ileo: '0,28'
    };
    let limitesNum = {
      duodeno: 0.51, jejuno: 0.40, colonD: 0.30, colonA: 0.30, colonT: 0.30, ileo: 0.28
    };

    if (isFelino) {
      limites = { duodeno: '0,25', jejuno: '0,25', colonD: '0,25', colonA: '0,25', colonT: '0,25', ileo: '0,25' };
      limitesNum = { duodeno: 0.25, jejuno: 0.25, colonD: 0.25, colonA: 0.25, colonT: 0.25, ileo: 0.25 };
    } else if (porte.includes('Cão M')) {
      limites = { duodeno: '0,60', jejuno: '0,50', colonD: '0,35', colonA: '0,35', colonT: '0,35', ileo: '0,32' };
      limitesNum = { duodeno: 0.60, jejuno: 0.50, colonD: 0.35, colonA: 0.35, colonT: 0.35, ileo: 0.32 };
    } else if (porte.includes('Cão G') || porte.includes('Cão Gigante')) {
      limites = { duodeno: '0,70', jejuno: '0,60', colonD: '0,40', colonA: '0,40', colonT: '0,40', ileo: '0,35' };
      limitesNum = { duodeno: 0.70, jejuno: 0.60, colonD: 0.40, colonA: 0.40, colonT: 0.40, ileo: 0.35 };
    }
    return { str: limites, num: limitesNum, porteStr: porte.includes('Cão') ? porte : 'Cão P' };
  },

  renderCamposCustomizados: function() {
    const segmentos = [
      { key: 'Duodeno', label: 'Duodeno', med: 'medDuodeno', cont: 'conteudoDuodeno', chk: 'exibirDuodeno', tipoRef: 'duodeno' },
      { key: 'Jejuno', label: 'Jejuno', med: 'medJejuno', cont: 'conteudoJejuno', chk: 'exibirJejuno', tipoRef: 'jejuno' },
      { key: 'ColonD', label: 'Cólon Descendente', med: 'medColonD', cont: 'conteudoColonD', chk: 'exibirColonD', tipoRef: 'colonD' },
      { key: 'ColonA', label: 'Cólon Ascendente', med: 'medColonA', cont: 'conteudoColonA', chk: 'exibirColonA', tipoRef: 'colonA' },
      { key: 'ColonT', label: 'Cólon Transverso', med: 'medColonT', cont: 'conteudoColonT', chk: 'exibirColonT', tipoRef: 'colonT' },
      { key: 'Ileo', label: 'Íleo', med: 'medIleo', cont: 'conteudoIleo', chk: 'exibirIleo', tipoRef: 'ileo' }
    ];

    const achado = this.campos.achadoAtivo;
    const limites = this.obterLimitesReferencia();

    let html = `
      <div class="space-y-3">
        <!-- Padrão Geral -->
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Padrão Geral das Alças:</label>
          <select onchange="CONFIGURACAO_ORGAOS.alcas.onFieldChange('intestinoPadrao', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            ${this.options.intestinoPadrao.map(opt => `<option value="${opt.value}" ${this.campos.intestinoPadrao === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
          </select>
        </div>

        <!-- Conteúdo Geral -->
        <div class="p-2.5 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
          <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-200 cursor-pointer">
            <input type="checkbox" ${this.campos.conteudoGeralAtivo ? 'checked' : ''} onchange="CONFIGURACAO_ORGAOS.alcas.onFieldChange('conteudoGeralAtivo', this.checked); PainelConfigurador.renderizar();" class="accent-emerald-600 w-4 h-4 rounded">
            <span>Aplicar Conteúdo Geral para todas as alças</span>
          </label>

          <div class="${this.campos.conteudoGeralAtivo ? '' : 'hidden'} pt-1">
            <select onchange="CONFIGURACAO_ORGAOS.alcas.onFieldChange('conteudoGeral', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
              ${this.options.conteudoGeral.map(opt => `<option value="${opt}" ${this.campos.conteudoGeral === opt ? 'selected' : ''}>${opt}</option>`).join('')}
            </select>
          </div>
        </div>

        <hr class="border-slate-200 dark:border-zinc-800 my-2">

        <!-- Segmentos Intestinais -->
        <div class="space-y-2">
          <label class="block text-[10px] font-bold text-slate-500 uppercase">Segmentos Avaliados:</label>
          ${segmentos.map(s => {
            const isExibir = this.campos[s.chk];
            const valorMedida = parseFloat((this.campos[s.med] || '0').replace(',', '.')) || 0;
            const limiteSegNum = limites.num[s.tipoRef];
            const isAlerta = valorMedida > limiteSegNum;

            return `
              <div class="p-2 bg-slate-50 dark:bg-zinc-800/50 rounded-lg border border-slate-200 dark:border-zinc-700 space-y-2">
                <div class="flex items-center justify-between">
                  <label class="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-zinc-200 cursor-pointer">
                    <input type="checkbox" ${isExibir ? 'checked' : ''} onchange="CONFIGURACAO_ORGAOS.alcas.onFieldChange('${s.chk}', this.checked); PainelConfigurador.renderizar();" class="accent-emerald-600 w-3.5 h-3.5 rounded">
                    <span>${s.label}</span>
                  </label>
                  <span class="text-[10px] font-mono ${isAlerta ? 'text-red-500 font-bold' : 'text-slate-400'}">(Ref: ${limites.porteStr}:${limites.str[s.tipoRef]}cm)</span>
                </div>

                <div class="${isExibir ? 'grid' : 'hidden'} grid-cols-2 gap-2 pt-1">
                  <div>
                    <label class="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Medida (cm)</label>
                    <input type="text" value="${this.campos[s.med]}" onclick="this.select()" onfocus="this.select()" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.alcas.onFieldChange('${s.med}', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold text-xs">
                  </div>
                  <div>
                    <label class="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Conteúdo</label>
                    <select onchange="CONFIGURACAO_ORGAOS.alcas.onFieldChange('${s.cont}', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-xs font-semibold dark:text-zinc-200">
                      ${this.options.conteudoGeral.map(opt => `<option value="${opt}" ${this.campos[s.cont] === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                    </select>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <hr class="border-slate-200 dark:border-zinc-800 my-2">

        <!-- Peristaltismo -->
        <div class="p-2.5 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700">
          <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-200 cursor-pointer">
            <input type="checkbox" ${this.campos.peristaltismoAtivo ? 'checked' : ''} onchange="CONFIGURACAO_ORGAOS.alcas.onFieldChange('peristaltismoAtivo', this.checked)" class="accent-emerald-600 w-4 h-4 rounded">
            <span>Peristaltismo evolutivo nos segmentos passíveis de serem visibilizados</span>
          </label>
        </div>

        <hr class="border-slate-200 dark:border-zinc-800 my-2">

        <!-- Menu de Achados Adicionais -->
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Achados Adicionais / Patologias:</label>
          <div class="grid grid-cols-1 gap-1.5">
            <button type="button" onclick="CONFIGURACAO_ORGAOS.alcas.ativarAchado('nenhum')" class="px-3 py-2 rounded-lg text-xs font-bold border text-left transition-all ${achado === 'nenhum' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-700'}">
              • Nenhum Achado Adicional
            </button>
            <button type="button" onclick="CONFIGURACAO_ORGAOS.alcas.ativarAchado('sombreamento')" class="px-3 py-2 rounded-lg text-xs font-bold border text-left transition-all ${achado === 'sombreamento' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-700'}">
              🌑 Sombreamento em Cólon
            </button>
            <button type="button" onclick="CONFIGURACAO_ORGAOS.alcas.ativarAchado('intussuscepcao')" class="px-3 py-2 rounded-lg text-xs font-bold border text-left transition-all ${achado === 'intussuscepcao' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-700'}">
              🎯 Intussuscepção
            </button>
            <button type="button" onclick="CONFIGURACAO_ORGAOS.alcas.ativarAchado('espessamento')" class="px-3 py-2 rounded-lg text-xs font-bold border text-left transition-all ${achado === 'espessamento' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-700'}">
              📏 Espessamento Focal
            </button>
            <button type="button" onclick="CONFIGURACAO_ORGAOS.alcas.ativarAchado('corpoEstranho')" class="px-3 py-2 rounded-lg text-xs font-bold border text-left transition-all ${achado === 'corpoEstranho' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-700'}">
              ⚠️ Corpo Estranho
            </button>
            <button type="button" onclick="CONFIGURACAO_ORGAOS.alcas.ativarAchado('ceLinear')" class="px-3 py-2 rounded-lg text-xs font-bold border text-left transition-all ${achado === 'ceLinear' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-700'}">
              〰️ Corpo Estranho Linear
            </button>
          </div>
        </div>

        <!-- Painel dinâmico do achado selecionado -->
        ${achado === 'sombreamento' ? `
          <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Localização no Cólon:</label>
            <select onchange="CONFIGURACAO_ORGAOS.alcas.onFieldChange('sombreamentoColon', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
              <option value="cólon" ${this.campos.sombreamentoColon === 'cólon' ? 'selected' : ''}>cólon</option>
              <option value="cólon descendente" ${this.campos.sombreamentoColon === 'cólon descendente' ? 'selected' : ''}>cólon descendente</option>
              <option value="cólon transverso" ${this.campos.sombreamentoColon === 'cólon transverso' ? 'selected' : ''}>cólon transverso</option>
              <option value="cólon ascendente" ${this.campos.sombreamentoColon === 'cólon ascendente' ? 'selected' : ''}>cólon ascendente</option>
            </select>
          </div>
        ` : ''}

        ${achado === 'intussuscepcao' ? `
          <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Região:</label>
              <input type="text" value="${this.campos.intussuscepcaoRegiao}" oninput="CONFIGURACAO_ORGAOS.alcas.onFieldChange('intussuscepcaoRegiao', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            </div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase">Medidas (cm x cm):</label>
            <div class="flex items-center gap-2 text-xs">
              <input type="text" value="${this.campos.intussuscepcaoMed1}" onclick="this.select()" onfocus="this.select()" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.alcas.onFieldChange('intussuscepcaoMed1', this.value)" class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm x
              <input type="text" value="${this.campos.intussuscepcaoMed2}" onclick="this.select()" onfocus="this.select()" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.alcas.onFieldChange('intussuscepcaoMed2', this.value)" class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm
            </div>
          </div>
        ` : ''}

        ${achado === 'espessamento' ? `
          <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Segmento:</label>
              <input type="text" value="${this.campos.espessamentoSegmento}" oninput="CONFIGURACAO_ORGAOS.alcas.onFieldChange('espessamentoSegmento', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            </div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase">Medidas (cm x cm):</label>
            <div class="flex items-center gap-2 text-xs">
              <input type="text" value="${this.campos.espessamentoMed1}" onclick="this.select()" onfocus="this.select()" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.alcas.onFieldChange('espessamentoMed1', this.value)" class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm x
              <input type="text" value="${this.campos.espessamentoMed2}" onclick="this.select()" onfocus="this.select()" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.alcas.onFieldChange('espessamentoMed2', this.value)" class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm
            </div>
          </div>
        ` : ''}

        ${achado === 'corpoEstranho' ? `
          <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipo de Estrutura:</label>
              <select onchange="CONFIGURACAO_ORGAOS.alcas.onFieldChange('ceEstrutura', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
                <option value="estrutura" ${this.campos.ceEstrutura === 'estrutura' ? 'selected' : ''}>estrutura</option>
                <option value="estruturas" ${this.campos.ceEstrutura === 'estruturas' ? 'selected' : ''}>estruturas</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Comprimento (cm):</label>
              <input type="text" value="${this.campos.ceComprimento}" onclick="this.select()" onfocus="this.select()" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.alcas.onFieldChange('ceComprimento', this.value)" class="w-20 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1.5 text-center font-bold text-xs"> cm
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Conclusão:</label>
              <select onchange="CONFIGURACAO_ORGAOS.alcas.onFieldChange('cePlural', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
                <option value="(Sugestivo de corpo estranho intestinal)" ${this.campos.cePlural.includes('corpo estranho') ? 'selected' : ''}>(Sugestivo de corpo estranho intestinal)</option>
                <option value="(Sugestivos de corpos estranhos intestinais)" ${this.campos.cePlural.includes('corpos estranhos') ? 'selected' : ''}>(Sugestivos de corpos estranhos intestinais)</option>
              </select>
            </div>
          </div>
        ` : ''}

        ${achado === 'ceLinear' ? `
          <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Segmento:</label>
              <input type="text" value="${this.campos.ceLinearSegmento}" oninput="CONFIGURACAO_ORGAOS.alcas.onFieldChange('ceLinearSegmento', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Comprimento (cm):</label>
              <input type="text" value="${this.campos.ceLinearComprimento}" onclick="this.select()" onfocus="this.select()" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.alcas.onFieldChange('ceLinearComprimento', this.value)" class="w-20 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1.5 text-center font-bold text-xs"> cm
            </div>
          </div>
        ` : ''}
      </div>
    `;

    return html;
  },

  gerarTexto: function(c) {
    let textoComp = '';
    if (c.intestinoPadrao.includes('corrugado')) {
      textoComp = ' (Sugestivo de processo inflamatório intestinal, tendo como diagnóstico diferencial a Doença Inflamatória Intestinal, não descartando a possibilidade de processo infiltrativo neoplásico)';
    }

    const limites = this.obterLimitesReferencia();
    let linhasSegmentos = [];

    const segmentosConfig = [
      { key: 'duodeno', chk: 'exibirDuodeno', med: 'medDuodeno', cont: 'conteudoDuodeno', tipoRef: 'duodeno' },
      { key: 'jejuno', chk: 'exibirJejuno', med: 'medJejuno', cont: 'conteudoJejuno', tipoRef: 'jejuno' },
      { key: 'cólon descendente', chk: 'exibirColonD', med: 'medColonD', cont: 'conteudoColonD', tipoRef: 'colonD' },
      { key: 'cólon ascendente', chk: 'exibirColonA', med: 'medColonA', cont: 'conteudoColonA', tipoRef: 'colonA' },
      { key: 'cólon transverso', chk: 'exibirColonT', med: 'medColonT', cont: 'conteudoColonT', tipoRef: 'colonT' },
      { key: 'íleo', chk: 'exibirIleo', med: 'medIleo', cont: 'conteudoIleo', tipoRef: 'ileo' }
    ];

    segmentosConfig.forEach(s => {
      if (c[s.chk]) {
        const valorMed = parseFloat((c[s.med] || '0').replace(',', '.')) || 0;
        const limiteSegNum = limites.num[s.tipoRef];
        const isAlerta = valorMed > limiteSegNum;
        const limiteStr = limites.str[s.tipoRef];
        
        const estiloRef = isAlerta ? 'style="color: #E5252A; font-weight: normal; font-size: 85%;"' : 'style="color: #64748b; font-size: 85%;"';

        linhasSegmentos.push(`<br>• <b>${s.key}</b> mensurando ${c[s.med]} cm, preenchido por conteúdo ${c[s.conteudo || s.cont]}<br><span ${estiloRef}>(Ref: ${limites.porteStr}: ${limiteStr}cm)</span>`);
      }
    });

    let textoSegmentos = '';
    if (linhasSegmentos.length > 0) {
      textoSegmentos = ':' + linhasSegmentos.join('');
    }

    const peristaltismoStr = c.peristaltismoAtivo ? (linhasSegmentos.length > 0 ? '<br>apresentando peristaltismo evolutivo nos segmentos passíveis de serem visibilizados.' : ', apresentando peristaltismo evolutivo nos segmentos passíveis de serem visibilizados.') : '.';

    let textoBase = `de distribuição topográfica habitual, ${c.intestinoPadrao}${textoComp} e ecogenicidade dentro dos limites da normalidade${textoSegmentos}${peristaltismoStr}`;

    // Adiciona o achado com a borda lateral verde mantida e o texto em cor neutra
    const achado = c.achadoAtivo || 'nenhum';
    if (achado !== 'nenhum') {
      let tituloAchado = '';
      let textoAchado = '';

      if (achado === 'sombreamento') {
        tituloAchado = 'Conteúdo Fecal / Sombreamento';
        textoAchado = `Em ${c.sombreamentoColon} nota-se conteúdo formador de sombreamento acústico posterior, sem dilatação/alteração de segmentos anteriores (Sugestivo de conteúdo fecal acumulado/ressecado, não descartando-se totalmente a possibilidade de corpo estranho intestinal – sugere-se acompanhamento sonográfico e/ou radiográfico à critério do clínico responsável).`;
      } else if (achado === 'intussuscepcao') {
        tituloAchado = 'Intussuscepção';
        textoAchado = `Em região ${c.intussuscepcaoRegiao}, visibiliza-se segmento intestinal com aspecto de múltiplas camadas, caracterizado por imagem de anéis concêntricos no corte longitudinal e imagem em alvo no corte transversal, medindo em seu todo cerca de ${c.intussuscepcaoMed1} cm x ${c.intussuscepcaoMed2} cm (Relacionado a intussuscepção).`;
      } else if (achado === 'espessamento') {
        tituloAchado = 'Espessamento Focal';
        textoAchado = `Nota-se segmento intestinal ${c.espessamentoSegmento} espessamento focal de parede com perda da estratificação parietal, medindo cerca de ${c.espessamentoMed1} cm x ${c.espessamentoMed2} cm (Pode estar relacionado a processo infiltrativo neoplásico).`;
      } else if (achado === 'corpoEstranho') {
        tituloAchado = 'Corpo Estranho';
        textoAchado = `Nota-se presença de ${c.ceEstrutura} formadora de sombreamento acústico posterior, medindo cerca de ${c.ceComprimento} cm de comprimento, associado a acúmulo de conteúdo líquido particulado intraluminal anteriormente à estrutura supracitada ${c.cePlural}.`;
      } else if (achado === 'ceLinear') {
        tituloAchado = 'Corpo Estranho Linear';
        textoAchado = `Em segmento intestinal ${c.ceLinearSegmento}, evidencia-se plissamento de alça secundário à presença de estrutura linear e hiperecogênica intraluminal, não formadora de sombreamento acústico posterior, medindo cerca de ${c.ceLinearComprimento} cm de comprimento (Relacionado a corpo estranho linear).`;
      }

      if (textoAchado) {
        // Borda vertical verde mantida, com o texto interno em cor neutra padrão
        textoBase += `<br><br><div style="border-left: 3px solid #10B981; padding-left: 8px; margin-top: 4px;"><span style="font-weight: bold;">[${tituloAchado}]:</span> ${textoAchado}</div>`;
      }
    }

    return textoBase;
  }
};