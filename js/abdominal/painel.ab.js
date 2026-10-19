// js/abdominal/painel.ab.js
const ModuloPainelPaciente = {
  renderizarFicha: function(paciente, idAnimal, tutor, especie, raca, sexo, textoStatusRepro, idadeAnos, idadeMeses, porte, requisitante, clinica) {
    return `
      <div>
        <div class="laudo-header">
          <div>
            <div class="text-2xl font-extrabold text-vet-600 dark:text-emerald-400 leading-none">Setvet</div>
            <div class="text-[10px] font-bold tracking-widest text-slate-400 mt-1 uppercase">MEDICINA VETERINÁRIA DIAGNÓSTICA</div>
          </div>
          <div class="text-right">
            <h2 class="text-base font-bold">Laudo Ultrassonográfico</h2>
            <div class="text-xs text-slate-500 font-medium"><b>Data:</b> <span contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('hdr_data', this)">${EstadoApp.textosEditadosManualmente['hdr_data'] || new Date().toLocaleString('pt-BR')}</span></div>
          </div>
        </div>
        <div class="patient-card-clean">
          <div class="grid grid-cols-3 gap-x-6 gap-y-3 text-xs">
            <div><span class="card-label">PACIENTE:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_paciente', this)">${EstadoApp.textosEditadosManualmente['p_paciente'] || paciente}</span></div>
            <div><span class="card-label">ID / PRONTUÁRIO:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_id', this)">${EstadoApp.textosEditadosManualmente['p_id'] || idAnimal}</span></div>
            <div><span class="card-label">TUTOR:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_tutor', this)">${EstadoApp.textosEditadosManualmente['p_tutor'] || tutor}</span></div>
            <div><span class="card-label">ESPÉCIE / RAÇA:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_raca', this)">${EstadoApp.textosEditadosManualmente['p_raca'] || `${especie} -${raca}`}</span></div>
            <div><span class="card-label">SEXO / REPRO:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_sexo', this)">${EstadoApp.textosEditadosManualmente['p_sexo'] || `${sexo} (${textoStatusRepro})`}</span></div>
            <div><span class="card-label">IDADE / PORTE:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_idade', this)">${EstadoApp.textosEditadosManualmente['p_idade'] || `${idadeAnos}a ${idadeMeses}m / ${porte}`}</span></div>
            <div><span class="card-label">REQUISITANTE:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_req', this)">${EstadoApp.textosEditadosManualmente['p_req'] || requisitante}</span></div>
            <div><span class="card-label">CLÍNICA PARCEIRA:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_clinica', this)">${EstadoApp.textosEditadosManualmente['p_clinica'] || clinica}</span></div>
            <div></div>
          </div>
        </div>
      </div>
    `;
  }
};