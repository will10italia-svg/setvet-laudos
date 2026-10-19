// js/orgaos/estomago.js

if (!window.CONFIGURACAO_ORGAOS) {
  window.CONFIGURACAO_ORGAOS = {};
}

window.CONFIGURACAO_ORGAOS.estomago = {
  id: 'estomago',
  nome: 'Estômago',
  icone: '🫃',
  oculto: false,

  campos: {
    achadoAtivo: 'padrao', // 'padrao', 'gastrite', 'geometrico', 'espessamento', 'corpoEstranho'
    
    // Parâmetros Gerais
    dilatado: false,
    conteudoLuminal: 'sem conteúdo luminal (vazio)',
    padraoConteudo: '[sobre conteúdo]',
    padraoParedes: 'paredes com padrão em camadas preservadas',
    ecogenicidadeEspessura: 'dentro dos limites da normalidade',
    medidaEstomago: '0',

    // Gastrite / Processo Inflamatório
    gastriteConteudo: 'focado / gasoso / líquido',
    gastriteParedes: 'espessamento parietal difuso',
    gastriteMedida: '0,00',

    // Formato Geométrico
    geometricoDescricao: 'com alteração de formato geométrico',
    geometricoMedida1: '0,00',
    geometricoMedida2: '0,00',

    // Espessamento Focal
    espessamentoSegmento: '[segmento]',
    espessamentoMed1: '0,00',
    espessamentoMed2: '0,00',

    // Corpo Estranho
    ceTipo: 'estrutura hiperecogênica',
    ceSombra: 'formadora de sombreamento acústico posterior',
    ceMedida: '0,00'
  },

  options: {
    conteudoLuminal: [
      'sem conteúdo luminal (vazio)',
      'com conteúdo luminal moderado',
      'com conteúdo luminal repleto',
      'com gás e líquido'
    ],
    padraoConteudo: [
      '[sobre conteúdo]',
      'fecalóide',
      'alimentar',
      'líquido espumoso'
    ],
    padraoParedes: [
      'paredes com padrão em camadas preservadas',
      'paredes com perda da estratificação'
    ],
    ecogenicidadeEspessura: [
      'dentro dos limites da normalidade',
      'com espessura aumentada'
    ],
    gastriteConteudo: [
      'focado / gasoso / líquido',
      'líquido livre',
      'gasoso'
    ],
    gastriteParedes: [
      'espessamento parietal difuso',
      'espessamento da camada muscular'
    ]
  },

  labels: {},
  chipsPatologias: [],
  chipsSelecionados: [],

  onInit: function() {},

  onFieldChange: function(campo, valor) {
    this.campos[campo] = valor;
    delete EstadoApp.textosEditadosManualmente['estomago'];
    AppInterface.marcarComoRascunho();
    MotorLaudo.atualizarPaginasLaudo();
  },

  ativarAchado: function(tipo) {
    this.campos.achadoAtivo = tipo;
    delete EstadoApp.textosEditadosManualmente['estomago'];
    PainelConfigurador.renderizar();
    AppInterface.marcarComoRascunho();
    MotorLaudo.atualizarPaginasLaudo();
  },

  renderCamposCustomizados: function() {
    const achado = this.campos.achadoAtivo;

    let html = `
      <div class="space-y-3">
        <!-- Menu Único de Seleção de Condição / Patologia -->
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">SELECIONE A CONDIÇÃO / PATOLOGIA:</label>
          <div class="grid grid-cols-1 gap-1.5">
            <button type="button" onclick="CONFIGURACAO_ORGAOS.estomago.ativarAchado('padrao')" class="px-3 py-2 rounded-lg text-xs font-bold border text-left transition-all ${achado === 'padrao' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-700'}">
              • Parâmetros Gerais / Padrão
            </button>
            <button type="button" onclick="CONFIGURACAO_ORGAOS.estomago.ativarAchado('gastrite')" class="px-3 py-2 rounded-lg text-xs font-bold border text-left transition-all ${achado === 'gastrite' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-700'}">
              🩻 Gastrite / Processo Inflamatório
            </button>
            <button type="button" onclick="CONFIGURACAO_ORGAOS.estomago.ativarAchado('geometrico')" class="px-3 py-2 rounded-lg text-xs font-bold border text-left transition-all ${achado === 'geometrico' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-700'}">
              📐 Formato Geométrico (Conteúdo / CE)
            </button>
            <button type="button" onclick="CONFIGURACAO_ORGAOS.estomago.ativarAchado('espessamento')" class="px-3 py-2 rounded-lg text-xs font-bold border text-left transition-all ${achado === 'espessamento' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-700'}">
              📏 Espessamento Focal / Camada Muscular
            </button>
            <button type="button" onclick="CONFIGURACAO_ORGAOS.estomago.ativarAchado('corpoEstranho')" class="px-3 py-2 rounded-lg text-xs font-bold border text-left transition-all ${achado === 'corpoEstranho' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-700'}">
              ⚠️ Corpo Estranho (Sombreamento)
            </button>
          </div>
        </div>

        <hr class="border-slate-200 dark:border-zinc-800 my-2">

        <!-- Painéis de Configuração Exclusivos para a Opção Selecionada -->
        ${achado === 'padrao' ? `
          <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-3">
            <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-200 cursor-pointer">
              <input type="checkbox" ${this.campos.dilatado ? 'checked' : ''} onchange="CONFIGURACAO_ORGAOS.estomago.onFieldChange('dilatado', this.checked)" class="accent-emerald-600 w-4 h-4 rounded">
              <span>Apresenta-se dilatado</span>
            </label>

            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Conteúdo Luminal:</label>
              <select onchange="CONFIGURACAO_ORGAOS.estomago.onFieldChange('conteudoLuminal', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
                ${this.options.conteudoLuminal.map(opt => `<option value="${opt}" ${this.campos.conteudoLuminal === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Padrão do Conteúdo:</label>
              <select onchange="CONFIGURACAO_ORGAOS.estomago.onFieldChange('padraoConteudo', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
                ${this.options.padraoConteudo.map(opt => `<option value="${opt}" ${this.campos.padraoConteudo === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Padrão de Paredes:</label>
              <select onchange="CONFIGURACAO_ORGAOS.estomago.onFieldChange('padraoParedes', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
                ${this.options.padraoParedes.map(opt => `<option value="${opt}" ${this.campos.padraoParedes === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Ecogenicidade / Espessura</label>
                <select onchange="CONFIGURACAO_ORGAOS.estomago.onFieldChange('ecogenicidadeEspessura', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1.5 text-xs font-semibold dark:text-zinc-200">
                  ${this.options.ecogenicidadeEspessura.map(opt => `<option value="${opt}" ${this.campos.ecogenicidadeEspessura === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Medida (cm)</label>
                <input type="text" value="${this.campos.medidaEstomago}" onclick="if(this.value==='0,00'||this.value==='0') this.value='';" onblur="if(this.value.trim()==='') this.value='0';" oninput="CONFIGURACAO_ORGAOS.estomago.onFieldChange('medidaEstomago', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1.5 text-center font-bold text-xs">
              </div>
            </div>
          </div>
        ` : ''}

        ${achado === 'gastrite' ? `
          <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-3">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Conteúdo da Gastrite:</label>
              <select onchange="CONFIGURACAO_ORGAOS.estomago.onFieldChange('gastriteConteudo', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
                ${this.options.gastriteConteudo.map(opt => `<option value="${opt}" ${this.campos.gastriteConteudo === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Padrão de Paredes:</label>
              <select onchange="CONFIGURACAO_ORGAOS.estomago.onFieldChange('gastriteParedes', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
                ${this.options.gastriteParedes.map(opt => `<option value="${opt}" ${this.campos.gastriteParedes === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Medida (cm)</label>
              <input type="text" value="${this.campos.gastriteMedida}" onclick="if(this.value==='0,00'||this.value==='0') this.value='';" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.estomago.onFieldChange('gastriteMedida', this.value)" class="w-24 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1.5 text-center font-bold text-xs">
            </div>
          </div>
        ` : ''}

        ${achado === 'geometrico' ? `
          <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-3">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Descrição:</label>
              <input type="text" value="${this.campos.geometricoDescricao}" oninput="CONFIGURACAO_ORGAOS.estomago.onFieldChange('geometricoDescricao', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            </div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase">Medidas (cm x cm):</label>
            <div class="flex items-center gap-2 text-xs">
              <input type="text" value="${this.campos.geometricoMedida1}" onclick="if(this.value==='0,00'||this.value==='0') this.value='';" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.estomago.onFieldChange('geometricoMedida1', this.value)" class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm x
              <input type="text" value="${this.campos.geometricoMedida2}" onclick="if(this.value==='0,00'||this.value==='0') this.value='';" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.estomago.onFieldChange('geometricoMedida2', this.value)" class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm
            </div>
          </div>
        ` : ''}

        ${achado === 'espessamento' ? `
          <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-3">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Segmento:</label>
              <input type="text" value="${this.campos.espessamentoSegmento}" oninput="CONFIGURACAO_ORGAOS.estomago.onFieldChange('espessamentoSegmento', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            </div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase">Medidas (cm x cm):</label>
            <div class="flex items-center gap-2 text-xs">
              <input type="text" value="${this.campos.espessamentoMed1}" onclick="if(this.value==='0,00'||this.value==='0') this.value='';" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.estomago.onFieldChange('espessamentoMed1', this.value)" class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm x
              <input type="text" value="${this.campos.espessamentoMed2}" onclick="if(this.value==='0,00'||this.value==='0') this.value='';" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.estomago.onFieldChange('espessamentoMed2', this.value)" class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm
            </div>
          </div>
        ` : ''}

        ${achado === 'corpoEstranho' ? `
          <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-3">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipo:</label>
              <input type="text" value="${this.campos.ceTipo}" oninput="CONFIGURACAO_ORGAOS.estomago.onFieldChange('ceTipo', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sombra:</label>
              <input type="text" value="${this.campos.ceSombra}" oninput="CONFIGURACAO_ORGAOS.id.onFieldChange('ceSombra', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Medida (cm)</label>
              <input type="text" value="${this.campos.ceMedida}" onclick="if(this.value==='0,00'||this.value==='0') this.value='';" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.estomago.onFieldChange('ceMedida', this.value)" class="w-24 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1.5 text-center font-bold text-xs">
            </div>
          </div>
        ` : ''}
      </div>
    `;

    return html;
  },

  gerarTexto: function(c) {
    const achado = c.achadoAtivo || 'padrao';

    if (achado === 'gastrite') {
      return `Estômago apresentando ${c.gastriteParedes}, contendo ${c.gastriteConteudo}, mensurando cerca de ${c.gastriteMedida} cm de espessura de parede (Achados sugestivos de gastrite/processo inflamatório).`;
    }
    if (achado === 'geometrico') {
      return `Estômago ${c.geometricoDescricao}, medindo cerca de ${c.geometricoMedida1} cm x ${c.geometricoMedida2} cm.`;
    }
    if (achado === 'espessamento') {
      return `Estômago com espessamento focal em ${c.espessamentoSegmento}, medindo cerca de ${c.espessamentoMed1} cm x ${c.espessamentoMed2} cm.`;
    }
    if (achado === 'corpoEstranho') {
      return `Estômago contendo ${c.ceTipo}, ${c.ceSombra}, medindo cerca de ${c.ceMedida} cm (Compatível com corpo estranho gástrico).`;
    }

    // Texto Padrão
    const textoDilatado = c.dilatado ? 'apresentando-se dilatado, ' : '';
    const textoEspessura = c.ecogenicidadeEspessura === 'com espessura aumentada' ? `, com espessura aumentada mensurando ${c.medidaEstomago} cm` : '';

    return `Estômago ${textoDilatado}com conteúdo luminal ${c.conteudoLuminal} (${c.padraoConteudo}), ${c.padraoParedes} e ecogenicidade ${c.ecogenicidadeEspessura}${textoEspessura}.`;
  }
};