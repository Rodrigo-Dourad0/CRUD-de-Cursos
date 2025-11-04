const API_URL = 'http://localhost:8080/api/cursos';

let idCursoEmEdicao = null;

// --- REFERÊNCIAS DO DOM (Elementos da página) ---
const formAddCurso = document.getElementById('form-add-curso');
const btnLoadCursos = document.getElementById('btn-load');
const tableBody = document.getElementById('cursos-table-body');
const inputCursoId = document.getElementById('curso-id');
const formTitulo = document.getElementById('form-titulo');
const formSubmitBtn = document.getElementById('form-submit-btn');
const btnCancelar = document.getElementById('btn-cancelar');

// --- FUNÇÕES ---

async function listarCursos() {
    console.log("Buscando cursos...");
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Erro na rede: ${response.statusText}`);
        
        const data = await response.json();
        console.log("Cursos recebidos:", data);

        tableBody.innerHTML = ''; 

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum curso cadastrado.</td></tr>';
            return;
        }

        data.forEach(curso => {
            const tr = document.createElement('tr');
            
            // <-- MUDANÇA AQUI: Lógica de checagem mais robusta
            const isAtivo = (curso.ativo === true || curso.ativo == 1 || curso.ativo === 'true');
            
            const statusAtivo = isAtivo
                ? '<span class="badge bg-success">Sim</span>'
                : '<span class="badge bg-danger">Não</span>';


            tr.innerHTML = `
                <td>${curso.id}</td>
                <td>${curso.nome}</td>
                <td>${curso.codigo}</td>
                <td>${curso.cargaHoraria}</td>
                <td>${statusAtivo}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-warning btn-sm btn-editar" data-id="${curso.id}">
                            Editar
                        </button>
                        <button class="btn btn-danger btn-sm btn-excluir" data-id="${curso.id}">
                            Excluir
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });

    } catch (error) {
        console.error("Falha ao buscar cursos:", error);
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Falha ao carregar dados. Verifique a API.</td></tr>';
    }
}


async function salvarCurso(event) {
    event.preventDefault(); 

    // 1. Pega os dados do formulário
    const dadosCurso = {
        nome: document.getElementById('nome').value,
        codigo: document.getElementById('codigo').value,
        cargaHoraria: parseInt(document.getElementById('cargaHoraria').value),
        ativo: document.getElementById('ativo').checked
    };

    let url = API_URL;
    let method = 'POST';

    // 2. Verifica se está em modo de edição
    if (idCursoEmEdicao) {
        url = `${API_URL}/${idCursoEmEdicao}`;
        method = 'PUT';
        console.log("Atualizando curso:", url, dadosCurso);
    } else {
        console.log("Enviando novo curso:", url, dadosCurso);
    }

    try {
        // 3. Envia para a API (POST ou PUT)
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosCurso)
        });

        if (response.ok) {
            console.log(idCursoEmEdicao ? "Curso atualizado!" : "Curso salvo!");
            resetarFormulario();
            listarCursos(); // Atualiza a lista
        } else {
            console.error("Erro ao salvar curso");
            alert("Erro ao salvar o curso. Verifique o console.");
        }
    } catch (error) {
        console.error("Falha ao enviar curso:", error);
        alert("Erro de rede ao salvar. Verifique a API e o console.");
    }
}


async function prepararEdicao(id) {
    console.log("Preparando edição para o ID:", id);
    try {
        // 1. Busca os dados atuais do curso na API
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Curso não encontrado");
        
        const curso = await response.json();

        // ** DIAGNÓSTICO ** (Se o erro persistir, me diga o que aparece aqui no console)
        console.log('--- DIAGNÓSTICO DE VALOR ---');
        console.log('Valor recebido de "curso.ativo":', curso.ativo);
        console.log('Tipo do valor:', typeof curso.ativo);

        // 2. Preenche o formulário com os dados
        document.getElementById('nome').value = curso.nome;
        document.getElementById('codigo').value = curso.codigo;
        document.getElementById('cargaHoraria').value = curso.cargaHoraria;
        
        // <-- MUDANÇA AQUI: Lógica de checagem mais robusta
        document.getElementById('ativo').checked = (curso.ativo === true || curso.ativo == 1 || curso.ativo === 'true');
        
        // 3. Preenche o campo oculto com o ID
        inputCursoId.value = curso.id;
        
        // 4. Atualiza o estado da aplicação
        idCursoEmEdicao = curso.id;

        // 5. Muda a UI do formulário para o modo "Edição"
        formTitulo.textContent = 'Editar Curso';
        formSubmitBtn.textContent = 'Atualizar Curso';
        formSubmitBtn.classList.remove('btn-primary');
        formSubmitBtn.classList.add('btn-success');
        btnCancelar.classList.remove('d-none'); // Mostra o botão "Cancelar"

        // Rola a página para o topo para o usuário ver o formulário
        window.scrollTo(0, 0);

    } catch (error) {
        console.error("Falha ao buscar curso para edição:", error);
        alert("Não foi possível carregar o curso para edição.");
    }
}

async function excluirCurso(id) {
    console.log("Tentando excluir ID:", id);
    
    // Pede confirmação
    if (!confirm('Tem certeza que deseja excluir este curso?')) {
        return; // Usuário cancelou
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log("Curso excluído!");
            listarCursos(); // Atualiza a lista
        } else {
            console.error("Erro ao excluir curso");
            alert("Erro ao excluir o curso. Verifique o console.");
        }
    } catch (error) {
        console.error("Falha ao enviar requisição DELETE:", error);
        alert("Erro de rede ao excluir. Verifique a API e o console.");
    }
}


function resetarFormulario() {
    formAddCurso.reset(); // Limpa os campos do formulário
    idCursoEmEdicao = null; // Reseta o estado
    inputCursoId.value = ''; // Limpa o ID oculto

    // Reseta a UI do formulário para o modo "Adicionar"
    formTitulo.textContent = 'Adicionar Novo Curso';
    formSubmitBtn.textContent = 'Salvar Curso';
    formSubmitBtn.classList.remove('btn-success');
    formSubmitBtn.classList.add('btn-primary');
    btnCancelar.classList.add('d-none'); // Esconde o botão "Cancelar"
}


// --- "Listeners" (Ouvintes de Eventos) ---

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Botão de Carregar Cursos
    if (btnLoadCursos) {
        btnLoadCursos.addEventListener('click', listarCursos);
    }

    // 2. Envio do Formulário (agora chama salvarCurso)
    if (formAddCurso) {
        formAddCurso.addEventListener('submit', salvarCurso);
    }

    // 3. NOVO - Botão de Cancelar Edição
    if (btnCancelar) {
        btnCancelar.addEventListener('click', resetarFormulario);
    }

    // 4. NOVO - Delegação de Evento para botões na tabela
    if (tableBody) {
        tableBody.addEventListener('click', (event) => {
            const target = event.target; // Onde o usuário clicou

            // Verifica se o clique foi em um botão "btn-editar"
            if (target.classList.contains('btn-editar')) {
                const id = target.dataset.id; // Pega o 'data-id' do botão
                prepararEdicao(id);
            }

            // Verifica se o clique foi em um botão "btn-excluir"
            if (target.classList.contains('btn-excluir')) {
                const id = target.dataset.id; // Pega o 'data-id' do botão
                excluirCurso(id);
            }
        });
    }

    listarCursos();
});