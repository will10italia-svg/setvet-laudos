// js/orgaos/vesicula.js

if (!window.CONFIGURACAO_ORGAOS) {
  window.CONFIGURACAO_ORGAOS = {};
}

window.CONFIGURACAO_ORGAOS.vesicula_biliar = {
  id: 'vesicula_biliar',
  nome: 'Vesícula Biliar',
  icone: '🧪',
  oculto: false,

  listaOpcoesConteudo: [
    "anecogênico e homogêneo",
    "com discreta quantidade de material ecogênico amorfo, não formador de sombreamento acústico posterior (lama biliar densa)",
    "com discreta quantidade de material ecogênico amorfo, não formador de sombreamento acústico posterior (lama biliar)",
    "com moderada quantidade de material ecogênico amorfo, não formador de sombreamento acústico posterior (lama biliar densa)",
    "com moderada quantidade de material ecogênico amorfo, não formador de sombreamento acústico posterior (lama biliar)",
    "com acentuada quantidade de material ecogênico amorfo, não formador de sombreamento acústico posterior (lama biliar densa)",
    "com acentuada quantidade de material ecogênico amorfo, não formador de sombreamento acústico posterior (lama biliar)",
    "discreta quantidade de pontos ecogênicos flutuantes (sedimentos)",
    "moderada quantidade de pontos ecogênicos flutuantes (sedimentos)",
    "acentuada quantidade de pontos ecogênicos flutuantes (sedimentos)",
    "discreta quantidade de pontos ecogênicos flutuantes (sedimentos/microlitíase)",
    "moderada quantidade de pontos ecogênicos flutuantes (sedimentos/microlitíase)",
    "acentuada quantidade de pontos ecogênicos flutuantes (sedimentos/microlitíase)"
  ],

  campos: {
    conteudosSelecionados: ["anecogênico e homogêneo"],
    medC: '0,00',
    medL: '0,00',
    medA: '0,00',
    viasBiliaresAtivo: false,
    viasConteudoTipo: 'anecogênico',
    viasMedC: '0,00',
    viasMedL: '0,00'
  },

  labels: {
    conteudosSelecionados: 'Conteúdo da Vesícula',
    viasBiliaresAtivo: 'Vias Biliares Dilatadas'
  },

  chipsPatologias: [
    { id: 'viasBiliares', rotulo: 'Vias Biliares Dilatadas', texto: 'Nota-se maior evidência dos ductos cístico e colédoco dilatados.' }
  ],
  chipsSelecionados: [],

  onInit: function() {
    this.atualizarVisibilidadeCampos();
  },

  onFieldChange: function(campo, valor) {
    this.campos[campo] = valor;

    if (campo === 'viasBiliaresAtivo') {
      if (valor && !this.chipsSelecionados.includes('viasBiliares')) {
        this.chipsSelecionados.push('viasBiliares');
      } else if (!valor) {
        const idx = this.chipsSelecionados.indexOf('viasBiliares');
        if (idx >= 0) this.chipsSelecionados.splice(idx, 1);
      }
    }

    delete EstadoApp.textosEditadosManualmente['vesicula_biliar'];
    this.atualizarVisibilidadeCampos();
    AppInterface.marcarComoRascunho();
    MotorLaudo.atualizarPaginasLaudo();
  },

  toggleConteudoSelecao: function(opcao) {
    const idx = this.campos.conteudosSelecionados.indexOf(opcao);
    if (idx >= 0) {
      if (this.campos.conteudosSelecionados.length > 1) {
        this.campos.conteudosSelecionados.splice(idx, 1);
      }
    } else {
      this.campos.conteudosSelecionados.push(opcao);
    }

    delete EstadoApp.textosEditadosManualmente['vesicula_biliar'];
    PainelConfigurador.renderizar();
    AppInterface.marcarComoRascunho();
    MotorLaudo.atualizarPaginasLaudo();
  },

  atualizarMedida: function(campo, valor) {
    this.campos[campo] = valor;
    delete EstadoApp.textosEditadosManualmente['vesicula_biliar'];
    AppInterface.marcarComoRascunho();
    MotorLaudo.atualizarPaginasLaudo();
  },

  atualizarVisibilidadeCampos: function() {
    const boxVias = document.getElementById('box-vias-biliares-details');
    if (boxVias) {
      if (this.campos.viasBiliaresAtivo || this.chipsSelecionados.includes('viasBiliares')) {
        boxVias.classList.remove('hidden');
      } else {
        boxVias.classList.add('hidden');
      }
    }
  },

  renderCamposCustomizados: function() {
    const isVias = this.campos.viasBiliaresAtivo || this.chipsSelecionados.includes('viasBiliares');
    const c = parseFloat((this.campos.medC || '0').replace(',', '.')) || 0;
    const l = parseFloat((this.campos.medL || '0').replace(',', '.')) || 0;
    const a = parseFloat((this.campos.medA || '0').replace(',', '.')) || 0;
    const volumeCalculado = (c * l * a * 0.523).toFixed(2).replace('.', ',');
    const temVolume = c > 0 || l > 0 || a > 0;

    let html = `
      <div class="space-y-3">
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Conteúdo da Vesícula Biliar:</label>
          <div class="space-y-1 max-h-40 overflow-y-auto p-1.5 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700">
            ${this.listaOpcoesConteudo.map(opcao => {
              const sel = this.campos.conteudosSelecionados.includes(opcao);
              return `
                <label class="flex items-center gap-2 text-xs p-1 rounded hover:bg-white dark:hover:bg-zinc-900 cursor-pointer">
                  <input type="checkbox" ${sel ? 'checked' : ''} onchange="CONFIGURACAO_ORGAOS.vesicula_biliar.toggleConteudoSelecao('${opcao}')" class="accent-emerald-600 w-3.5 h-3.5 rounded">
                  <span class="dark:text-zinc-200">${opcao}</span>
                </label>
              `;
            }).join('')}
          </div>
        </div>

        <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
          <label class="block text-[10px] font-bold text-slate-500 uppercase">Volume Vesicular Estimado: <span class="text-emerald-600 font-bold">${volumeCalculado} ml</span></label>
          <div class="flex items-center gap-2 text-xs">
            <input type="text" value="${this.campos.medC}" onclick="if(this.value==='0,00'||this.value==='0') this.value='';" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.vesicula_biliar.atualizarMedida('medC', this.value)" class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm x
            <input type="text" value="${this.campos.medL}" onclick="if(this.value==='0,00'||this.value==='0') this.value='';" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.vesicula_biliar.atualizarMedida('medL', this.value)" class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm x
            <input type="text" value="${this.campos.medA}" onclick="if(this.value==='0,00'||this.value==='0') this.value='';" onblur="if(this.value.trim()==='') this.value='0,00';" oninput="CONFIGURACAO_ORGAOS.vesicula_biliar.atualizarMedida('medA', this.value)" class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm
          </div>
          <p class="text-[10px] text-slate-400">Deixe zerado se não desejar exibir o volume no laudo.</p>
        </div>

        <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
          <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-200 cursor-pointer">
            <input type="checkbox" ${isVias ? 'checked' : ''} onchange="CONFIGURACAO_ORGAOS.vesicula_biliar.onFieldChange('viasBiliaresAtivo', this.checked); PainelConfigurador.renderizar();" class="accent-emerald-600 w-4 h-4 rounded">
            <span>Vias Biliares Dilatadas</span>
          </label>

          <div id="box-vias-biliares-details" class="${isVias ? '' : 'hidden'} pt-2 space-y-2 border-t border-slate-200 dark:border-zinc-700">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Conteúdo:</label>
              <select onchange="CONFIGURACAO_ORGAOS.vesicula_biliar.campos.viasConteudoTipo = this.value; delete EstadoApp.textosEditadosManualmente['vesicula_biliar']; MotorLaudo.atualizarPaginasLaudo();" class="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
                <option value="anecogênico" ${this.campos.viasConteudoTipo === 'anecogênico' ? 'selected' : ''}>anecogênico</option>
                <option value="ecogênico" ${this.campos.viasConteudoTipo === 'ecogênico' ? 'selected' : ''}>ecogênico</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Diâmetros (cm):</label>
              <div class="flex items-center gap-2 text-xs">
                <input type="text" value="${this.campos.viasMedC}" oninput="CONFIGURACAO_ORGAOS.vesicula_biliar.atualizarMedida('viasMedC', this.value)" class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm e
                <input type="text" value="${this.campos.viasMedL}" oninput="CONFIGURACAO_ORGAOS.vesicula_biliar.atualizarMedida('viasMedL', this.value)" class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    return html;
  },

  formatarListaTextos: function(lista) {
    if (!lista || lista.length === 0) return "anecogênico e homogêneo";
    if (lista.length === 1) return lista[0];
    if (lista.length === 2) return `${lista[0]} e ${lista[1]}`;
    const copia = [...lista];
    const ultimo = copia.pop();
    return `${copia.join(', ')} e ${ultimo}`;
  },

  gerarTexto: function(c) {
    const cVal = parseFloat((c.medC || '0').replace(',', '.')) || 0;
    const lVal = parseFloat((c.medL || '0').replace(',', '.')) || 0;
    const aVal = parseFloat((c.medA || '0').replace(',', '.')) || 0;
    let textoVolume = '';

    if (cVal > 0 || lVal > 0 || aVal > 0) {
      const vol = (cVal * lVal * aVal * 0.523).toFixed(2).replace('.', ',');
      textoVolume = ` com volume estimado de ${vol}ml (${c.medC}cm x ${c.medL}cm x ${c.medA}cm)`;
    }

    const conteudoStr = this.formatarListaTextos(c.conteudosSelecionados);
    let textoPrincipal = `vesícula biliar repleta${textoVolume}, paredes finas e ecogênicas com conteúdo ${conteudoStr}.`;

    const isVias = c.viasBiliaresAtivo || this.chipsSelecionados.includes('viasBiliares');
    if (isVias) {
      textoPrincipal += ` Nota-se maior evidência dos ductos cístico e colédoco, dilatados por conteúdo ${c.viasConteudoTipo} em até ${c.viasMedC} cm e ${c.viasMedL} cm de diâmetro, respectivamente, sem evidências de processo obstrutivo (Sugestivo de colangite).`;
    } else {
      textoPrincipal += ` Não há alterações em vias biliares intra ou extrahepáticas.`;
    }

    return textoPrincipal;
  }
};