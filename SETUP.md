# Guia de Instalação

## Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

## Passo 1: Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em "New Project"
3. Preencha os dados e crie o projeto
4. Aguarde a inicialização (pode levar alguns minutos)

## Passo 2: Obter Chaves de API

1. No seu projeto, vá para **Settings** → **API**
2. Copie:
   - **Project URL** (ex: `https://seu-projeto.supabase.co`)
   - **anon public** (sua chave pública)

## Passo 3: Criar Tabelas

1. No seu projeto, vá para **SQL Editor**
2. Clique em "New Query"
3. Cole o SQL abaixo:

```sql
-- Criar tabela de membros vocais
CREATE TABLE voice_members (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  naipe TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de músicos da banda
CREATE TABLE band_members (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  instrument TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de músicas
CREATE TABLE songs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT,
  tone TEXT,
  external_link TEXT,
  video_link TEXT,
  lyrics TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de escalas
CREATE TABLE scales (
  id BIGSERIAL PRIMARY KEY,
  scale_date DATE NOT NULL,
  type TEXT NOT NULL,
  notes TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de histórico de músicas
CREATE TABLE song_history (
  id BIGSERIAL PRIMARY KEY,
  song_id BIGINT REFERENCES songs(id) ON DELETE CASCADE,
  scale_id BIGINT REFERENCES scales(id) ON DELETE CASCADE,
  used_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE voice_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE band_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scales ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_history ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso (todos os usuários autenticados podem ver todos os dados)
CREATE POLICY "Todos podem ver membros vocais"
ON voice_members FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuários autenticados podem inserir membros vocais"
ON voice_members FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Todos podem ver músicos da banda"
ON band_members FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuários autenticados podem inserir músicos da banda"
ON band_members FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Todos podem ver músicas"
ON songs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuários autenticados podem inserir músicas"
ON songs FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Todos podem ver escalas"
ON scales FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuários autenticados podem inserir escalas"
ON scales FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Todos podem ver histórico"
ON song_history FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuários autenticados podem inserir no histórico"
ON song_history FOR INSERT
TO authenticated
WITH CHECK (true);
```

4. Clique em "Run" para executar

## Passo 4: Configurar a Aplicação

1. Abra o arquivo `config.js`
2. Substitua:
   ```javascript
   SUPABASE_URL: 'https://seu-projeto.supabase.co',
   SUPABASE_KEY: 'sua-chave-publica-aqui',
   ```

3. Salve o arquivo

## Passo 5: Executar

1. Abra `index.html` no navegador
2. Crie uma conta ou faça login
3. Comece a usar!

## ✅ Verificação

Para verificar se tudo está funcionando:

1. Crie um novo membro vocal
2. Abra em outra aba/navegador
3. O novo membro deve aparecer automaticamente

## 🔧 Troubleshooting

### "Erro de conexão com Supabase"
- Verifique se a URL e chave estão corretas em `config.js`
- Verifique se o projeto está ativo no Supabase

### "Erro ao criar tabelas"
- Verifique se você está no SQL Editor correto
- Tente executar cada CREATE TABLE separadamente

### "Dados não sincronizam"
- Verifique se o Row Level Security está habilitado
- Verifique as políticas de acesso

### "Erro de autenticação"
- Verifique se a autenticação está habilitada em Settings → Auth

## 📚 Recursos Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

## 🎉 Pronto!

Seu sistema está pronto para uso. Comece a criar escalas!
