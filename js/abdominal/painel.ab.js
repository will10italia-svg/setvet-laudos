// js/abdominal/painel.ab.js
const ModuloPainelPaciente = {
  renderizarFicha: function(paciente, idAnimal, tutor, especie, raca, sexo, textoStatusRepro, idadeAnos, idadeMeses, porte, requisitante, clinica) {
    // Se o usuário digitou/editou manualmente, prioriza a edição manual. 
    // Caso contrário, usa o valor vindo do formulário (se houver), senão exibe em branco ('').
    const safePaciente = EstadoApp.textosEditadosManualmente['p_paciente'] !== undefined ? EstadoApp.textosEditadosManualmente['p_paciente'] : (paciente || '');
    const safeId = EstadoApp.textosEditadosManualmente['p_id'] !== undefined ? EstadoApp.textosEditadosManualmente['p_id'] : (idAnimal || '');
    const safeTutor = EstadoApp.textosEditadosManualmente['p_tutor'] !== undefined ? EstadoApp.textosEditadosManualmente['p_tutor'] : (tutor || '');
    
    let racaBase = '';
    if (especie || raca) {
      racaBase = `${especie || ''} ${raca ? '- ' + raca : ''}`.trim();
    }
    const safeRacaFinal = EstadoApp.textosEditadosManualmente['p_raca'] !== undefined ? EstadoApp.textosEditadosManualmente['p_raca'] : racaBase;

    let sexoBase = '';
    if (sexo) {
      sexoBase = `${sexo}${textoStatusRepro ? ' (' + textoStatusRepro + ')' : ''}`;
    }
    const safeSexoFinal = EstadoApp.textosEditadosManualmente['p_sexo'] !== undefined ? EstadoApp.textosEditadosManualmente['p_sexo'] : sexoBase;

    let idadePorteBase = '';
    if ((idadeAnos !== undefined && idadeAnos !== '') || (idadeMeses !== undefined && idadeMeses !== '') || porte) {
      const anosStr = idadeAnos ? `${idadeAnos}a ` : '';
      const mesesStr = idadeMeses !== undefined && idadeMeses !== '' ? `${idadeMeses}m` : '0m';
      const parteIdade = (anosStr || mesesStr) ? `${anosStr}${mesesStr}` : '';
      
      if (parteIdade && porte) {
        idadePorteBase = `${parteIdade} / ${porte}`;
      } else {
        idadePorteBase = parteIdade || porte || '';
      }
    }
    const safeIdadeFinal = EstadoApp.textosEditadosManualmente['p_idade'] !== undefined ? EstadoApp.textosEditadosManualmente['p_idade'] : idadePorteBase;

    const safeReq = EstadoApp.textosEditadosManualmente['p_req'] !== undefined ? EstadoApp.textosEditadosManualmente['p_req'] : (requisitante || '');
    const safeClinica = EstadoApp.textosEditadosManualmente['p_clinica'] !== undefined ? EstadoApp.textosEditadosManualmente['p_clinica'] : (clinica || '');
    const safeData = EstadoApp.textosEditadosManualmente['hdr_data'] !== undefined ? EstadoApp.textosEditadosManualmente['hdr_data'] : '';

    return `
      <div>
        <div class="laudo-header">
          <div>
            <div class="text-2xl font-extrabold text-vet-600 dark:text-emerald-400 leading-none">Setvet</div>
            <div class="text-[10px] font-bold tracking-widest text-slate-400 mt-1 uppercase">MEDICINA VETERINÁRIA DIAGNÓSTICA</div>
          </div>
          <div class="text-right">
            <h2 class="text-base font-bold">Laudo Ultrassonográfico</h2>
            <div class="text-xs text-slate-500 font-medium"><b>Data:</b> <span contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('hdr_data', this)">${safeData}</span></div>
          </div>
        </div>
        <div class="patient-card-clean">
          <div class="grid grid-cols-3 gap-x-6 gap-y-3 text-xs">
            <div><span class="card-label">PACIENTE:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_paciente', this)">${safePaciente}</span></div>
            <div><span class="card-label">ID / PRONTUÁRIO:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_id', this)">${safeId}</span></div>
            <div><span class="card-label">TUTOR:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_tutor', this)">${safeTutor}</span></div>
            <div><span class="card-label">ESPÉCIE / RAÇA:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_raca', this)">${safeRacaFinal}</span></div>
            <div><span class="card-label">SEXO / REPRO:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_sexo', this)">${safeSexoFinal}</span></div>
            <div><span class="card-label">IDADE / PORTE:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_idade', this)">${safeIdadeFinal}</span></div>
            <div><span class="card-label">REQUISITANTE:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_req', this)">${safeReq}</span></div>
            <div><span class="card-label">CLÍNICA PARCEIRA:</span><span class="card-value" contenteditable="true" spellcheck="false" onblur="AppInterface.salvarEdicaoManualTexto('p_clinica', this)">${safeClinica}</span></div>
            <div></div>
          </div>
        </div>
      </div>
    `;
  }
};
