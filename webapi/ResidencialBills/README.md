# Residencial Bills - Backend Setup

## 🚀 Setup Inicial (Primeira Configuração)

### 1. Instalar EF Core Tools (executar uma única vez)
```bash
dotnet tool install --global dotnet-ef
```

### 2. Configurar arquivo .env
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar com suas credenciais PostgreSQL
# Windows: notepad .env
# Linux/Mac: nano .env
```

**Exemplo de .env:**
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario_postgres
DB_PASSWORD=sua_senha
DB_NAME=ResidencialBills
```

### 3. Criar banco de dados (se necessário)
```bash
# Se seu usuário PostgreSQL não tiver permissão de criar banco automaticamente:
psql -U postgres -c "CREATE DATABASE \"ResidencialBills\";"
```

### 4. Restaurar dependências do projeto
```bash
cd ResidencialBills
dotnet restore
```

### 5. Aplicar migrações (criar tabelas no banco)
```bash
dotnet ef database update
```

### 6. Rodar o projeto
```bash
dotnet run
```

---

## 📝 Quando o Modelo Muda (Durante Desenvolvimento)

**Toda vez que você modificar uma classe de Model** (adicionar/remover/alterar propriedades), precisa:

### 1. Criar uma nova migration
```bash
cd ResidencialBills
dotnet ef migrations add NomeDaMigration
# Exemplo: dotnet ef migrations add AddForeignKeys
```

### 2. Aplicar a migration ao banco
```bash
dotnet ef database update
```

**⚠️ IMPORTANTE:** Sem fazer esses dois passos, o EF Core não vai saber que o modelo mudou e pode gerar erros como:
- `DbUpdateException: duplicar valor da chave viola a restrição de unicidade`
- Colunas faltando na tabela
- Foreign keys não reconhecidas

---

## 🐛 Troubleshooting

### Erro: "Foreign Key Constraint Violated"
**Causa:** Modelo tem FK (ex: `CategoryId`) mas a coluna não existe no banco.
**Solução:**
```bash
dotnet ef migrations add AddForeignKeys
dotnet ef database update
```

### Erro: "Table does not exist"
**Causa:** Migrations não foram aplicadas ao banco.
**Solução:**
```bash
dotnet ef database update
```

### Erro: "Migrations folder not found"
**Causa:** Você está na pasta errada.
**Solução:** Certifique-se que está em `ResidencialBills/` (onde está Program.cs)

### Erro: "Cannot create database - permission denied"
**Causa:** Usuário PostgreSQL não tem permissão.
**Solução:**
```bash
# Criar manualmente como superuser
psql -U postgres -c "CREATE DATABASE \"ResidencialBills\";"

# Depois dar permissão (opcional)
psql -U postgres -c "ALTER DATABASE \"ResidencialBills\" OWNER TO seu_usuario;"
```

---

## 📂 Estrutura do Projeto Backend

```
ResidencialBills/
├── Controllers/          # Endpoints da API
├── Models/              # Definição de entidades (Category, Person, Transaction)
├── Data/                # DbContext e configurações de banco
├── Migrations/          # Histórico de mudanças do banco
├── Program.cs           # Configuração da aplicação
└── README.md            # Este arquivo
```

---

## 💡 Dicas de Desenvolvimento

1. **Sempre crie uma migration após mudar modelos** → garante sincronização
2. **Não edite migrations manualmente** → deixe o EF Core gerar
3. **Faça backup do banco antes de delete** → `database delete` é irreversível
4. **Teste migrações localmente primeiro** → antes de ir pra produção

---

## 🔧 Comandos Úteis

```bash
# Listar todas as migrações
dotnet ef migrations list

# Remover última migration (se ainda não foi aplicada)
dotnet ef migrations remove

# Desfazer última migration aplicada
dotnet ef database update <NomeDaMigrationAnterior>

# Deletar todo o banco (cuidado!)
dotnet ef database delete

# Recriar do zero
dotnet ef database drop -f
dotnet ef database update
```