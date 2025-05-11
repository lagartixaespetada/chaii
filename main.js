document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const tituloInput = document.getElementById('titulo');
    const descricaoInput = document.getElementById('descricao');
    const adicionarBtn = document.getElementById('adicionar');
    const limparBtn = document.getElementById('limpar');
    const listaMetas = document.getElementById('listaMetas');
    
    // Carregar metas do localStorage ao iniciar
    carregarMetas();

    // Adicionar meta
    adicionarBtn.addEventListener('click', adicionarMeta);
    
    // Limpar todas as metas
    limparBtn.addEventListener('click', limparMetas);
    
    // Permitir adicionar com Enter
    descricaoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            adicionarMeta();
        }
    });

    // Função para adicionar nova meta
    function adicionarMeta() {
        const titulo = tituloInput.value.trim();
        const descricao = descricaoInput.value.trim();
        
        if (!validarCampos(titulo, descricao)) return;
        
        const novaMeta = criarMeta(titulo, descricao);
        adicionarMetaNoDOM(novaMeta);
        salvarMeta(novaMeta);
        limparCampos();
    }

    // Validar campos do formulário
    function validarCampos(titulo, descricao) {
        if (titulo === '' || descricao === '') {
            mostrarAlerta('Por favor, preencha todos os campos!', 'erro');
            return false;
        }
        return true;
    }

    // Criar objeto de meta
    function criarMeta(titulo, descricao) {
        return {
            id: Date.now(),
            titulo,
            descricao,
            data: new Date().toISOString()
        };
    }

    // Adicionar meta na lista (DOM)
    function adicionarMetaNoDOM(meta) {
        const dataFormatada = formatarData(meta.data);
        
        const metaElement = document.createElement('div');
        metaElement.className = 'meta';
        metaElement.dataset.id = meta.id;
        metaElement.innerHTML = `
            <h5>${meta.titulo}</h5>
            <p>${meta.descricao}</p>
            <small>Adicionado em: ${dataFormatada}</small>
            <button class="remover-meta"><i class="fas fa-times"></i></button>
        `;
        
        listaMetas.prepend(metaElement);
        
        // Adicionar evento de remoção
        metaElement.querySelector('.remover-meta').addEventListener('click', function() {
            removerMeta(meta.id);
        });
    }

    // Formatador de data
    function formatarData(dataString) {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Limpar campos do formulário
    function limparCampos() {
        tituloInput.value = '';
        descricaoInput.value = '';
        tituloInput.focus();
    }

    // Mostrar alerta
    function mostrarAlerta(mensagem, tipo) {
        const alerta = document.createElement('div');
        alerta.className = `alerta ${tipo}`;
        alerta.textContent = mensagem;
        
        document.body.prepend(alerta);
        
        setTimeout(() => {
            alerta.classList.add('fade-out');
            setTimeout(() => alerta.remove(), 500);
        }, 3000);
    }

    // ===== FUNÇÕES DE PERSISTÊNCIA (localStorage) =====
    
    // Salvar meta no localStorage
    function salvarMeta(meta) {
        const metas = JSON.parse(localStorage.getItem('metas')) || [];
        metas.unshift(meta);
        localStorage.setItem('metas', JSON.stringify(metas));
    }

    // Carregar metas do localStorage
    function carregarMetas() {
        const metas = JSON.parse(localStorage.getItem('metas')) || [];
        metas.forEach(meta => adicionarMetaNoDOM(meta));
    }

    // Remover meta do localStorage
    function removerMeta(id) {
        let metas = JSON.parse(localStorage.getItem('metas')) || [];
        metas = metas.filter(meta => meta.id !== id);
        localStorage.setItem('metas', JSON.stringify(metas));
        
        // Remover do DOM
        document.querySelector(`.meta[data-id="${id}"]`).remove();
        mostrarAlerta('Meta removida com sucesso!', 'sucesso');
    }

    // Limpar todas as metas
    function limparMetas() {
        if (listaMetas.children.length === 0) {
            mostrarAlerta('Não há metas para limpar!', 'info');
            return;
        }
        
        if (!confirm('Tem certeza que deseja limpar TODAS as metas?')) return;
        
        localStorage.removeItem('metas');
        listaMetas.innerHTML = '';
        mostrarAlerta('Todas as metas foram removidas!', 'sucesso');
    }
});

// Estilos dinâmicos para os alertas (pode ser movido para o CSS)
const style = document.createElement('style');
style.textContent = `
    .alerta {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        opacity: 1;
        transition: opacity 0.5s ease;
    }
    
    .alerta.erro {
        background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
    }
    
    .alerta.sucesso {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
    
    .alerta.info {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .alerta.fade-out {
        opacity: 0;
    }
    
    .meta .remover-meta {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 0, 0, 0.1);
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        color: #ff758c;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .meta .remover-meta:hover {
        background: rgba(255, 0, 0, 0.2);
        color: #ff4757;
    }
`;
document.head.appendChild(style);