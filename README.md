# Sistema de Escala de Louvor

Sistema web para gerenciamento de escalas de louvor da igreja com separação entre vocal e banda.

## 🎯 Funcionalidades

- ✅ Autenticação com Supabase
- ✅ Cadastro de membros vocais (por naipes)
- ✅ Cadastro de músicos da banda
- ✅ Criação de escalas vocais e de banda
- ✅ Gerenciamento de músicas com letras
- ✅ Histórico de músicas
- ✅ Sincronização em tempo real
- ✅ Dashboard com estatísticas
- ✅ Interface responsiva

## 📋 Estrutura de Arquivos

```
.
├── index.html              # Arquivo principal HTML
├── config.js              # Configurações do Supabase
├── supabase-client.js     # Cliente Supabase
├── auth.js                # Autenticação
├── db.js                  # Operações de banco de dados
├── ui.js                  # Componentes de interface
├── app.js                 # Lógica principal
├── styles.css             # Estilos CSS
├── README.md              # Este arquivo
└── SETUP.md               # Guia de instalação
```

## 🚀 Como Usar

### 1. Configurar Supabase

1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie a URL e chave pública do projeto
4. Edite `config.js` e substitua:
   - `SUPABASE_URL` pela sua URL
   - `SUPABASE_KEY` pela sua chave pública

### 2. Criar Tabelas no Supabase

Execute o SQL fornecido em `SETUP.md` no editor SQL do Supabase.

### 3. Abrir o Aplicativo

Simplesmente abra `index.html` no navegador.

## 🔑 Chaves Supabase

Você pode encontrar suas chaves em:
1. Acesse seu projeto no Supabase
2. Vá para Settings → API
3. Copie `Project URL` e `anon public key`

## 📱 Sincronização em Tempo Real

O sistema sincroniza dados automaticamente a cada 5 segundos. Todos os usuários veem os mesmos dados criados por qualquer admin/usuário.

## 🔐 Segurança

- Dados compartilhados entre todos os usuários (sem isolamento por usuário)
- Autenticação obrigatória
- Senhas criptografadas no Supabase

## 📝 Notas Importantes

- Email é opcional ao cadastrar membros
- Todos os usuários veem todos os dados
- As mudanças sincronizam em tempo real
- Não há dependências externas (apenas Supabase CDN)

## 🛠️ Desenvolvimento

Para adicionar novas funcionalidades:

1. Adicione a tabela no Supabase
2. Crie métodos em `db.js`
3. Adicione UI em `app.js`
4. Estilize em `styles.css`

## 📞 Suporte

Para problemas com Supabase, consulte a documentação oficial em [supabase.com/docs](https://supabase.com/docs)

## 📄 Licença

MIT
