// js/orgaos/estomago.js

if (!window.CONFIGURACAO_ORGAOS) {
  window.CONFIGURACAO_ORGAOS = {};
}

window.CONFIGURACAO_ORGAOS.estomago = {
  id: 'estomago',
  nome: 'Estômago',
  icone: '🍽️',
  oculto: false,

  campos: {
    conteudo: 'sem conteúdo luminal (vazio)',
    padrao: '',
    paredes: 'paredes com padrão em camadas preservadas',
    ecogenicidadeSelect: 'dentro dos limites da normalidade',
    medida: '0,00',
    achadoAtivo: 'normal',
    dilatado: false,
    gastritePeristaltismo: 'discreta diminuição',
    gastriteMed1: '0,00',
    gastriteMed2: '0,00',
    geoMed1: '0,00',
    geoMed2: '0,00',
    espessamentoTipo: 'maior evidência da camada muscular difusamente',
    espessamentoMed1: '0,00',
    espessamentoMed2: '0,00',
    espessamentoRegiao: 'fundo',
    ceMedida: '0,00'
  },

  labels: {
    conteudo: 'Conteúdo Luminal',
    padrao: 'Padrão do Conteúdo',
    paredes: 'Padrão de Paredes',
    ecogenicidadeSelect: 'Ecogenicidade',
    medida: 'Espessura da Parede (cm)'
  },

  chipsPatologias: [],
  chipsSelecionados: [],

  onInit: function() {},

  onFieldChange: function(campo, valor) {
    this.campos[campo] = valor;
    delete EstadoApp.textosEditadosManualmente['estomago'];
    AppInterface.marcarComoRascunho();
    MotorLaudo.atualizarPaginasLaudo();
  },

  ativarAchado: function(tipoAchado) {
    if (this.campos.achadoAtivo === tipoAchado) {
      this.campos.achadoAtivo = 'normal';
    } else {
      this.campos.achadoAtivo = tipoAchado;
    }

    delete EstadoApp.textosEditadosManualmente['estomago'];
    PainelConfigurador.renderizar();
    AppInterface.marcarComoRascunho();
    MotorLaudo.atualizarPaginasLaudo();
  },

  obterLimiteReferencia: function() {
    const especie = (document.getElementById('p-especie')?.value || 'Canino').toLowerCase();
    const porte = document.getElementById('p-porte')?.value || 'Cão P';
    const isFelino = especie.includes('felino') || especie.includes('gato');

    if (isFelino) return { label: 'Gato: 0,25cm', limite: 0.25 };
    if (porte.includes('Cão M')) return { label: 'Cão M: 0,40cm', limite: 0.40 };
    if (porte.includes('Cão G') || porte.includes('Gigante')) return { label: 'Cão G: 0,50cm', limite: 0.50 };
    return { label: 'Cão P: 0,30cm', limite: 0.30 };
  },

  renderCamposCustomizados: function() {
    const achado = this.campos.achadoAtivo;
    const ref = this.obterLimiteReferencia();

    let html = `
      <div class="space-y-3">
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipo de Avaliação do Estômago:</label>
          <div class="grid grid-cols-1 gap-1.5">
            <button type="button" onclick="CONFIGURACAO_ORGAOS.estomago.ativarAchado('normal')" class="px-3 py-2 rounded-lg text-xs font-bold border text-left transition-all ${achado === 'normal' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-700'}">
              ✓ Padrão / Normal
            </button>
            <button type="button" onclick="CONFIGURACAO_ORGAOS.estomago.ativarAchado('gastrite')" class="px-3 py-2 rounded-lg text-xs font-bold border text-left transition-all ${achado === 'gastrite' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-700'}">
              🔬 Gastrite / Processo Inflamatório
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

        ${achado === 'normal' ? `
          <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
            <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-200 cursor-pointer">
              <input type="checkbox" ${this.campos.dilatado ? 'checked' : ''} onchange="CONFIGURACAO_ORGAOS.estomago.onFieldChange('dilatado', this.checked)" class="accent-emerald-600 w-4 h-4 rounded">
              <span>Apresenta-se dilatado</span>
            </label>

            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Conteúdo Luminal:</label>
              <select onchange="CONFIGURACAO_ORGAOS.estomago.onFieldChange('conteudo', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
                <option value="sem conteúdo luminal (vazio)" ${this.campos.conteudo === 'sem conteúdo luminal (vazio)' ? 'selected' : ''}>sem conteúdo luminal (vazio)</option>
                <option value="com presença de conteúdo luminal" ${this.campos.conteudo === 'com presença de conteúdo luminal' ? 'selected' : ''}>com presença de conteúdo luminal</option>
                <option value="com acentuada presença de conteúdo luminal" ${this.campos.conteudo === 'com acentuada presença de conteúdo luminal' ? 'selected' : ''}>com acentuada presença de conteúdo luminal</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Padrão do Conteúdo:</label>
              <select onchange="CONFIGURACAO_ORGAOS.estomago.onFieldChange('padrao', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
                <option value="" ${this.campos.padrao === '' ? 'selected' : ''}>[sobre conteudo]</option>
                <option value="predominantemente hiperecogênico (gasoso)" ${this.campos.padrao === 'predominantemente hiperecogênico (gasoso)' ? 'selected' : ''}>predominantemente hiperecogênico (gasoso)</option>
                <option value="ecogênico (alimento)" ${this.campos.padrao === 'ecogênico (alimento)' ? 'selected' : ''}>ecogênico (alimento)</option>
                <option value="de padrão misto (gás e alimento)" ${this.campos.padrao === 'de padrão misto (gás e alimento)' ? 'selected' : ''}>de padrão misto (gás e alimento)</option>
                <option value="anecogênico (líquido)" ${this.campos.padrao === 'anecogênico (líquido)' ? 'selected' : ''}>anecogênico (líquido)</option>
                <option value="ecogênico particulado (alimento digerido / conteúdo inflamatório?)" ${this.campos.padrao === 'ecogênico particulado (alimento digerido / conteúdo inflamatório?)' ? 'selected' : ''}>ecogênico particulado (alimento digerido / conteúdo inflamatório?)</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Padrão de Paredes:</label>
              <select onchange="CONFIGURACAO_ORGAOS.estomago.onFieldChange('paredes', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
                <option value="paredes com padrão em camadas preservadas" ${this.campos.paredes === 'paredes com padrão em camadas preservadas' ? 'selected' : ''}>paredes com padrão em camadas preservadas</option>
                <option value="paredes com camada muscular mais evidente" ${this.campos.paredes === 'paredes com camada muscular mais evidente' ? 'selected' : ''}>paredes com camada muscular mais evidente</option>
              </select>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-[10px] font-bold text-slate-500 uppercase">Ecogenicidade / Espessura (cm):</label>
                <span class="text-[10px] font-mono text-slate-400">(Ref: ${ref.label})</span>
              </div>
              <div class="flex items-center gap-2">
                <select onchange="CONFIGURACAO_ORGAOS.estomago.onFieldChange('ecogenicidadeSelect', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
                  <option value="dentro dos limites da normalidade" ${this.campos.ecogenicidadeSelect === 'dentro dos limites da normalidade' ? 'selected' : ''}>normal</option>
                  <option value="elevada (Sugestivo de processo inflamatório / gastrite)" ${this.campos.ecogenicidadeSelect.includes('elevada') ? 'selected' : ''}>elevada (Gastrite)</option>
                </select>
                <input type="text" value="${this.campos.medida}" onclick="this.select()" onfocus="this.select()" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.estomago.onFieldChange('medida', this.value)" class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1.5 text-center font-bold text-xs"> cm
              </div>
            </div>
          </div>
        ` : ''}

        ${achado === 'gastrite' ? `
          <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
            <label class="block text-[10px] font-bold text-slate-500 uppercase">Medidas da Parede (cm x cm):</label>
            <div class="flex items-center gap-2 text-xs">
              <input type="text" value="${this.campos.gastriteMed1}" onclick="this.select()" onfocus="this.select()" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.estomago.onFieldChange('gastriteMed1', this.value)" class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm x
              <input type="text" value="${this.campos.gastriteMed2}" onclick="this.select()" onfocus="this.select()" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.estomago.onFieldChange('gastriteMed2', this.value)" class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Peristaltismo:</label>
              <select onchange="CONFIGURACAO_ORGAOS.estomago.onFieldChange('gastritePeristaltismo', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
                <option value="discreta diminuição" ${this.campos.gastritePeristaltismo === 'discreta diminuição' ? 'selected' : ''}>discreta diminuição</option>
                <option value="diminuição" ${this.campos.gastritePeristaltismo === 'diminuição' ? 'selected' : ''}>diminuição</option>
                <option value="aumento" ${this.campos.gastritePeristaltismo === 'aumento' ? 'selected' : ''}>aumento</option>
              </select>
            </div>
          </div>
        ` : ''}

        ${achado === 'geometrico' ? `
          <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
            <label class="block text-[10px] font-bold text-slate-500 uppercase">Medidas da Estrutura (cm x cm):</label>
            <div class="flex items-center gap-2 text-xs">
              <input type="text" value="${this.campos.geoMed1}" onclick="this.select()" onfocus="this.select()" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.estomago.onFieldChange('geoMed1', this.value)" class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm x
              <input type="text" value="${this.campos.geoMed2}" onclick="this.select()" onfocus="this.select()" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.estomago.onFieldChange('geoMed2', this.value)" class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm
            </div>
          </div>
        ` : ''}

        ${achado === 'espessamento' ? `
          <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipo de Espessamento:</label>
              <select onchange="CONFIGURACAO_ORGAOS.estomago.onFieldChange('espessamentoTipo', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
                <option value="maior evidência da camada muscular difusamente" ${this.campos.espessamentoTipo === 'maior evidência da camada muscular difusamente' ? 'selected' : ''}>maior evidência da camada muscular difusamente</option>
                <option value="espessamento focal de parede" ${this.campos.espessamentoTipo === 'espessamento focal de parede' ? 'selected' : ''}>espessamento focal de parede</option>
              </select>
            </div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase">Medidas (cm x cm):</label>
            <div class="flex items-center gap-2 text-xs">
              <input type="text" value="${this.campos.espessamentoMed1}" onclick="this.select()" onfocus="this.select()" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.estomago.onFieldChange('espessamentoMed1', this.value)" class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm x
              <input type="text" value="${this.campos.espessamentoMed2}" onclick="this.select()" onfocus="this.select()" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.estomago.onFieldChange('espessamentoMed2', this.value)" class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Região:</label>
              <select onchange="CONFIGURACAO_ORGAOS.estomago.onFieldChange('espessamentoRegiao', this.value)" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
                <option value="fundo" ${this.campos.espessamentoRegiao === 'fundo' ? 'selected' : ''}>fundo</option>
                <option value="corpo" ${this.campos.espessamentoRegiao === 'corpo' ? 'selected' : ''}>corpo</option>
                <option value="piloro" ${this.campos.espessamentoRegiao === 'piloro' ? 'selected' : ''}>piloro</option>
              </select>
            </div>
          </div>
        ` : ''}

        ${achado === 'corpoEstranho' ? `
          <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
            <label class="block text-[10px] font-bold text-slate-500 uppercase">Comprimento (cm):</label>
            <input type="text" value="${this.campos.ceMedida}" onclick="this.select()" onfocus="this.select()" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.estomago.onFieldChange('ceMedida', this.value)" class="w-20 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1.5 text-center font-bold text-xs"> cm
          </div>
        ` : ''}
      </div>
    `;

    return html;
  },

  gerarTexto: function(c) {
    const achado = c.achadoAtivo || 'normal';
    const prefixoDilatado = c.dilatado ? 'apresentando-se dilatado, ' : '';

    if (achado === 'gastrite') {
      return `com paredes (medindo ${c.gastriteMed1}cm x ${c.gastriteMed2}cm), preenchido por conteúdo líquido particulado, com estratificação parietal preservada e ${c.gastritePeristaltismo} do peristaltismo (Sugestivo de processo inflamatório gástrico, não descartando a possibilidade de processo obstrutivo parcial/total, podendo ser secundário a estenose pilórica, corpo estranho, processo inflamatório ou neoplásico – à esclarecer).`;
    }

    if (achado === 'geometrico') {
      return `Nota-se presença de estruturas de formato geométrico não formadoras de sombreamento acústico posterior entremeadas ao conteúdo gástrico, medindo uma delas cerca de ${c.geoMed1}cm x ${c.geoMed2}cm (Corpo estranho gástrico? Alimento não digerido? – A esclarecer, sugere-se acompanhamento sonográfico a critério do clínico responsável).`;
    }

    if (achado === 'espessamento') {
      return `com ${c.espessamentoTipo} (medindo ${c.espessamentoMed1}cm x ${c.espessamentoMed2}cm), com perda da estratificação parietal em região de ${c.espessamentoRegiao} (Pode estar relacionado a processo neoplásico).`;
    }

    if (achado === 'corpoEstranho') {
      return `Nota-se presença de estrutura formadora de sombreamento acústico posterior entremeada ao conteúdo gástrico, medindo cerca de ${c.ceMedida}cm de comprimento (Corpo estranho gástrico? Alimento não digerido? – A esclarecer, sugere-se acompanhamento sonográfico à critério do clínico responsável).`;
    }

    // Padrão Normal com Referência
    const ref = this.obterLimiteReferencia();
    const valMedida = parseFloat((c.medida || '0').replace(',', '.')) || 0;
    const isAlerta = valMedida > ref.limite;
    const estiloRef = isAlerta ? 'style="color: #E5252A; font-weight: 700;"' : 'style="color: #64748b;"';

    const padraoStr = c.padrao && c.padrao.trim() !== '' ? `, ${c.padrao}` : '';
    return `${prefixoDilatado}${c.conteudo}${padraoStr}, ${c.paredes}, ecogenicidade das camadas mantida e espessura ${c.ecogenicidadeSelect}, mensurando: ${c.medida} cm de espessura, em região de corpo gástrico <span ${estiloRef}>(Ref: ${ref.label})</span>.`;
  }
};