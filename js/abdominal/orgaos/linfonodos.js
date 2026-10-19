// js/orgaos/linfonodos.js

if (!window.CONFIGURACAO_ORGAOS) {
  window.CONFIGURACAO_ORGAOS = {};
}

window.CONFIGURACAO_ORGAOS.linfonodos = {
  id: 'linfonodos',
  nome: 'Linfonodos',
  icone: '🔬',
  oculto: false,

  listaLinfonodos: [
    "Íleo-cecais", "Jejunal", "Cólico", "Mesentérico", "Inguinal",
    "Gástrico", "Hepático", "Ilíaco medial", "Esplênico", "Renal"
  ],

  campos: {
    semAlteracao: true,
    infiltrativoAtivo: false,
    linfonodosSelecionados: [],
    ecogenicidade: 'pouco reduzida',
    medidas: {}, 
    medidaUnica1: '0,00',
    medidaUnica2: '0,00',
    mesenterio: ''
  },

  labels: {
    semAlteracao: 'Linfonodos sem alterações sonográficas',
    infiltrativoAtivo: 'Dimensões Aumentadas / Processo Infiltrativo-Reacional'
  },

  chipsPatologias: [
    { id: 'infiltrativo', rotulo: 'Dimensões Aumentadas / Reacional', texto: 'Linfonodo(s) com dimensões aumentadas e alteração ecogênica.' }
  ],

  chipsSelecionados: [],

  onInit: function() {
    this.atualizarVisibilidadeCampos();
  },

  onFieldChange: function(campo, valor) {
    this.campos[campo] = valor;

    if (campo === 'infiltrativoAtivo') {
      if (valor) {
        this.campos.semAlteracao = false;
        if (!this.chipsSelecionados.includes('infiltrativo')) {
          this.chipsSelecionados.push('infiltrativo');
        }
      } else {
        const idx = this.chipsSelecionados.indexOf('infiltrativo');
        if (idx >= 0) this.chipsSelecionados.splice(idx, 1);
        if (this.chipsSelecionados.length === 0) {
          this.campos.semAlteracao = true;
        }
      }
    }

    delete EstadoApp.textosEditadosManualmente['linfonodos'];
    this.atualizarVisibilidadeCampos();
    AppInterface.marcarComoRascunho();
    MotorLaudo.atualizarPaginasLaudo();
  },

  toggleLinfonodoSelecao: function(nomeLinfonodo) {
    const idx = this.campos.linfonodosSelecionados.indexOf(nomeLinfonodo);
    if (idx >= 0) {
      this.campos.linfonodosSelecionados.splice(idx, 1);
      delete this.campos.medidas[nomeLinfonodo];
    } else {
      this.campos.linfonodosSelecionados.push(nomeLinfonodo);
      if (!this.campos.medidas[nomeLinfonodo]) {
        this.campos.medidas[nomeLinfonodo] = { m1: '0,00', m2: '0,00' };
      }
    }

    if (this.campos.linfonodosSelecionados.length === 1) {
      const unico = this.campos.linfonodosSelecionados[0];
      if (this.campos.medidas[unico]) {
        this.campos.medidaUnica1 = this.campos.medidas[unico].m1 || '0,00';
        this.campos.medidaUnica2 = this.campos.medidas[unico].m2 || '0,00';
      }
    }

    delete EstadoApp.textosEditadosManualmente['linfonodos'];
    PainelConfigurador.renderizar();
    AppInterface.marcarComoRascunho();
    MotorLaudo.atualizarPaginasLaudo();
  },

  atualizarMedidaUnica: function(campo, valor) {
    this.campos[campo] = valor;

    if (this.campos.linfonodosSelecionados.length === 1) {
      const linfo = this.campos.linfonodosSelecionados[0];
      if (!this.campos.medidas[linfo]) {
        this.campos.medidas[linfo] = { m1: '0,00', m2: '0,00' };
      }
      if (campo === 'medidaUnica1') this.campos.medidas[linfo].m1 = valor;
      if (campo === 'medidaUnica2') this.campos.medidas[linfo].m2 = valor;
    }

    delete EstadoApp.textosEditadosManualmente['linfonodos'];
    AppInterface.marcarComoRascunho();
    MotorLaudo.atualizarPaginasLaudo();
  },

  atualizarMedidaEspecifica: function(nomeLinfonodo, campoMedida, valor) {
    if (!this.campos.medidas[nomeLinfonodo]) {
      this.campos.medidas[nomeLinfonodo] = { m1: '0,00', m2: '0,00' };
    }
    this.campos.medidas[nomeLinfonodo][campoMedida] = valor;

    if (this.campos.linfonodosSelecionados.length === 1) {
      if (campoMedida === 'm1') this.campos.medidaUnica1 = valor;
      if (campoMedida === 'm2') this.campos.medidaUnica2 = valor;
    }

    delete EstadoApp.textosEditadosManualmente['linfonodos'];
    AppInterface.marcarComoRascunho();
    MotorLaudo.atualizarPaginasLaudo();
  },

  atualizarVisibilidadeCampos: function() {
    const boxInfiltrativo = document.getElementById('box-linfo-infiltrativo-details');
    if (boxInfiltrativo) {
      if (this.campos.infiltrativoAtivo || this.chipsSelecionados.includes('infiltrativo')) {
        boxInfiltrativo.classList.remove('hidden');
      } else {
        boxInfiltrativo.classList.add('hidden');
      }
    }
  },

  renderCamposCustomizados: function() {
    const isInf = this.campos.infiltrativoAtivo || this.chipsSelecionados.includes('infiltrativo');
    const temLinfonodoSelecionado = this.campos.linfonodosSelecionados.length > 0;

    let html = `
      <div class="space-y-3">
        <div class="p-2.5 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700">
          <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-200 cursor-pointer">
            <input type="checkbox" ${this.campos.semAlteracao && !isInf ? 'checked' : ''} 
                   onchange="CONFIGURACAO_ORGAOS.linfonodos.campos.semAlteracao = this.checked; if(this.checked){ CONFIGURACAO_ORGAOS.linfonodos.campos.infiltrativoAtivo=false; CONFIGURACAO_ORGAOS.linfonodos.chipsSelecionados=[]; CONFIGURACAO_ORGAOS.linfonodos.campos.linfonodosSelecionados=[]; } delete EstadoApp.textosEditadosManualmente['linfonodos']; PainelConfigurador.renderizar(); MotorLaudo.atualizarPaginasLaudo();" 
                   class="accent-emerald-600 w-4 h-4 rounded">
            <span>Linfonodos sem alterações visibilizadas</span>
          </label>
        </div>

        <div class="p-2.5 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
          <label class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-200 cursor-pointer">
            <input type="checkbox" ${isInf ? 'checked' : ''} 
                   onchange="CONFIGURACAO_ORGAOS.linfonodos.onFieldChange('infiltrativoAtivo', this.checked); PainelConfigurador.renderizar();" 
                   class="accent-emerald-600 w-4 h-4 rounded">
            <span>Dimensões Aumentadas / Reacional</span>
          </label>

          <div id="box-linfo-infiltrativo-details" class="${isInf ? '' : 'hidden'} pt-2 space-y-3 border-t border-slate-200 dark:border-zinc-700">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Selecione o(s) Linfonodo(s) Alterado(s):</label>
              <div class="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-700">
                ${this.listaLinfonodos.map(linfo => {
                  const sel = this.campos.linfonodosSelecionados.includes(linfo);
                  return `
                    <button type="button" onclick="CONFIGURACAO_ORGAOS.linfonodos.toggleLinfonodoSelecao('${linfo}')" 
                            class="px-2 py-1 rounded text-[11px] font-semibold border transition-all ${sel ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700'}">
                      ${sel ? '✓ ' : '+ '} ${linfo}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- As demais opções só aparecem se houver pelo menos um linfonodo selecionado -->
            <div class="${temLinfonodoSelecionado ? '' : 'hidden'} space-y-3 pt-2 border-t border-slate-100 dark:border-zinc-800">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ecogenicidade:</label>
                <select onchange="CONFIGURACAO_ORGAOS.linfonodos.campos.ecogenicidade = this.value; delete EstadoApp.textosEditadosManualmente['linfonodos']; MotorLaudo.atualizarPaginasLaudo();" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
                  <option value="pouco reduzida" ${this.campos.ecogenicidade === 'pouco reduzida' ? 'selected' : ''}>Pouco reduzida</option>
                  <option value="reduzida" ${this.campos.ecogenicidade === 'reduzida' ? 'selected' : ''}>Reduzida</option>
                  <option value="acentuadamente reduzida" ${this.campos.ecogenicidade === 'acentuadamente reduzida' ? 'selected' : ''}>Acentuadamente reduzida</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Medidas do(s) Linfonodo(s):</label>
                ${this.campos.linfonodosSelecionados.length <= 1 ? `
                  <div class="flex items-center gap-1 text-xs">
                    <input type="text" value="${this.campos.medidaUnica1}" 
                           onclick="if(this.value==='0,00'||this.value==='0') this.value='';" 
                           onblur="if(this.value.trim()==='') { this.value='0,00'; CONFIGURACAO_ORGAOS.linfonodos.atualizarMedidaUnica('medidaUnica1', '0,00'); }"
                           oninput="CONFIGURACAO_ORGAOS.linfonodos.atualizarMedidaUnica('medidaUnica1', this.value)" 
                           class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm x
                    <input type="text" value="${this.campos.medidaUnica2}" 
                           onclick="if(this.value==='0,00'||this.value==='0') this.value='';" 
                           onblur="if(this.value.trim()==='') { this.value='0,00'; CONFIGURACAO_ORGAOS.linfonodos.atualizarMedidaUnica('medidaUnica2', '0,00'); }"
                           oninput="CONFIGURACAO_ORGAOS.linfonodos.atualizarMedidaUnica('medidaUnica2', this.value)" 
                           class="w-16 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-bold"> cm
                  </div>
                ` : `
                  <div class="space-y-1.5 max-h-32 overflow-y-auto">
                    ${this.campos.linfonodosSelecionados.map(linfo => {
                      const m = this.campos.medidas[linfo] || { m1: '0,00', m2: '0,00' };
                      return `
                        <div class="flex items-center justify-between text-xs bg-white dark:bg-zinc-900 p-1.5 rounded border border-slate-200 dark:border-zinc-700">
                          <span class="font-bold text-slate-700 dark:text-zinc-300 truncate max-w-[120px]">${linfo}:</span>
                          <div class="flex items-center gap-1">
                            <input type="text" value="${m.m1}" 
                                   onclick="if(this.value==='0,00'||this.value==='0') this.value='';" 
                                   onblur="if(this.value.trim()==='') { this.value='0,00'; CONFIGURACAO_ORGAOS.linfonodos.atualizarMedidaEspecifica('${linfo}', 'm1', '0,00'); }"
                                   oninput="CONFIGURACAO_ORGAOS.linfonodos.atualizarMedidaEspecifica('${linfo}', 'm1', this.value)" 
                                   class="w-14 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-mono text-[11px]"> cm x
                            <input type="text" value="${m.m2}" 
                                   onclick="if(this.value==='0,00'||this.value==='0') this.value='';" 
                                   onblur="if(this.value.trim()==='') { this.value='0,00'; CONFIGURACAO_ORGAOS.linfonodos.atualizarMedidaEspecifica('${linfo}', 'm2', '0,00'); }"
                                   oninput="CONFIGURACAO_ORGAOS.linfonodos.atualizarMedidaEspecifica('${linfo}', 'm2', this.value)" 
                                   class="w-14 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded p-1 text-center font-mono text-[11px]"> cm
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                `}
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Envolvimento Mesentérico:</label>
                <select onchange="CONFIGURACAO_ORGAOS.linfonodos.campos.mesenterio = this.value; delete EstadoApp.textosEditadosManualmente['linfonodos']; MotorLaudo.atualizarPaginasLaudo();" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-semibold dark:text-zinc-200">
                  <option value="" ${this.campos.mesenterio === '' ? 'selected' : ''}>[Sem reação mesentérica]</option>
                  <option value="associado ao aumento de ecogenicidade do mesentério adjacente" ${this.campos.mesenterio !== '' ? 'selected' : ''}>Associado ao aumento de ecogenicidade do mesentério adjacente</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    return html;
  },

  formatarNomesLinfonodos: function(lista) {
    if (!lista || lista.length === 0) return "Linfonodo";
    if (lista.length === 1) return `Linfonodo ${lista[0]}`;
    if (lista.length === 2) return `Linfonodos ${lista[0]} e ${lista[1]}`;
    const copia = [...lista];
    const ultimo = copia.pop();
    return `Linfonodos ${copia.join(', ')} e ${ultimo}`;
  },

  gerarTexto: function(c) {
    const isInf = c.infiltrativoAtivo || this.chipsSelecionados.includes('infiltrativo');

    if (!isInf || c.semAlteracao || c.linfonodosSelecionados.length === 0) {
      return "Não foram observados sinais sonográficos de alteração/aumento em região topográfica de linfonodos visibilizados.";
    }

    const nomesFormatados = this.formatarNomesLinfonodos(c.linfonodosSelecionados);
    const eco = c.ecogenicidade || 'pouco reduzida';

    let textoMedidas = '';
    if (c.linfonodosSelecionados.length <= 1) {
      const m1 = c.medidaUnica1 || '0,00';
      const m2 = c.medidaUnica2 || '0,00';
      textoMedidas = `, medindo cerca de ${m1} cm x ${m2} cm`;
    } else {
      const trechos = c.linfonodosSelecionados.map(linfo => {
        const m = c.medidas[linfo] || { m1: '0,00', m2: '0,00' };
        return `<b>${linfo}</b>: ${m.m1 || '0,00'} cm x ${m.m2 || '0,00'} cm`;
      });
      textoMedidas = `, medindo respectivamente ${trechos.join(' e ')}`;
    }

    let textoMesenterio = '';
    let textoConclusao = ' (Sugestivo de linfonodo reacional inflamatório).';

    if (c.mesenterio && c.mesenterio.trim() !== '') {
      textoMesenterio = `, ${c.mesenterio}`;
      textoConclusao = ' (Sugestivo de linfonodo reacional inflamatório, não descartando a possibilidade de processo infiltrativo neoplásico).';
    }

    return `${nomesFormatados} em maior evidência, de dimensões aumentadas, contornos definidos e regulares, ecogenicidade ${eco} e ecotextura homogênea${textoMedidas}${textoMesenterio}${textoConclusao}`;
  }
};