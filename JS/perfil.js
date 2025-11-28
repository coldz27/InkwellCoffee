// Variável global para armazenar a nova conta
let novaConta = null;

// Funçãovda nova conta
function criarNovaConta(nome, email, senha) {
    // Criar um objeto com os dados da conta
    novaConta = {
        nome: nome,
        email: email,
        senha: senha,
        dataCriacao: new Date().toISOString()
    };
    
    // Armazenar no localStorage para persistência
    localStorage.setItem('novaConta', JSON.stringify(novaConta));
    
    return novaConta;
}

// Função para recuperar a conta armazenada
function recuperarConta() {
    const contaArmazenada = localStorage.getItem('novaConta');
    if (contaArmazenada) {
        novaConta = JSON.parse(contaArmazenada);
        return novaConta;
    }
    return null;
}

// Função para validar os campos do formulário
function validarFormulario(nome, email, senha) {
    if (!nome || !email || !senha) {
        return false;
    }
    
    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false;
    }
    
    return true;
}

// Função para exibir alerta
function exibirAlerta(id, mostrar) {
    const alerta = document.getElementById(id);
    if (alerta) {
        alerta.style.display = mostrar ? 'block' : 'none';
    }
}

// Função para limpar o formulário
function limparFormulario() {
    document.getElementById('loginForm').reset();
}

// Manipular o envio do formulário
document.addEventListener('DOMContentLoaded', function() {
    // Recuperar conta existente ao carregar a página
    const contaExistente = recuperarConta();
    if (contaExistente) {
        console.log('Conta recuperada:', contaExistente);
    }
    
    // Adicionar evento de submit ao formulário
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Impedir o envio padrão do formulário
        
        // Obter os valores dos campos
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        
        // Validar se todos os campos foram preenchidos corretamente
        if (validarFormulario(nome, email, senha)) {
            // Criar a nova conta
            const contaCriada = criarNovaConta(nome, email, senha);
            
            // Mostrar mensagem de sucesso
            exibirAlerta('successAlert', true);
            exibirAlerta('errorAlert', false);
            
            // Limpar o formulário
            limparFormulario();
            
            // Log para demonstração
            console.log('Nova conta criada:', contaCriada);
            console.log('Dados armazenados no localStorage:', localStorage.getItem('novaConta'));
            
            // Exemplo de como usar a conta armazenada posteriormente
            setTimeout(function() {
                alert(`Conta criada com sucesso! Bem-vindo, ${novaConta.nome}!`);
            }, 500);
        } else {
            // Mostrar mensagem de erro
            exibirAlerta('errorAlert', true);
            exibirAlerta('successAlert', false);
        }
    });
});

// Função de exemplo para usar a conta armazenada posteriormente
function usarContaArmazenada() {
    if (novaConta) {
        console.log('Usando conta armazenada:', novaConta);
        return novaConta;
    } else {
        console.log('Nenhuma conta armazenada encontrada.');
        return null;
    }
}