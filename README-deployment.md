# Deploy no Vercel - Valença & Soares Law Firm

## Preparação para Deploy

### 1. Build da aplicação
```bash
# Instalar dependências
npm install

# Build do cliente
cd client && npm run build && cd ..

# Ou usar o script personalizado
node build.js
```

### 2. Configuração no Vercel

1. **Conecte seu repositório ao Vercel**
   - Vá para [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Conecte seu repositório GitHub

2. **Configurações do projeto**
   - Framework Preset: **Other**
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm install`

3. **Variáveis de ambiente**
   Adicione estas variáveis no painel do Vercel:
   ```
   NODE_ENV=production
   SESSION_SECRET=sua-chave-secreta-aqui
   ```

### 3. Estrutura de arquivos para Vercel

O projeto está configurado com:
- `/api/index.ts` - Função serverless para API
- `/vercel.json` - Configuração de roteamento
- Build otimizado do cliente em `client/dist/`

### 4. Funcionalidades incluídas

✅ **Sistema de contato funcional**
- Formulário salva mensagens no storage em memória
- Painel admin para gerenciar mensagens

✅ **Chatbot inteligente**
- Respostas automáticas baseadas em palavras-chave
- Interface moderna e responsiva
- Histórico de conversas no admin

✅ **Painel administrativo**
- Acesso com senha "v"
- Gerenciamento de mensagens de contato
- Visualização de conversas do chat
- Interface responsiva e moderna

✅ **Design profissional**
- Layout inspirado no FAS Advogados
- Totalmente responsivo
- Animações suaves
- Cores e tipografia consistentes

### 5. Pós-deploy

Após o deploy no Vercel:

1. **Teste todas as funcionalidades**
   - Formulário de contato
   - Chatbot no canto inferior direito
   - Acesso ao admin via ícone de engrenagem no footer

2. **Domínio personalizado** (opcional)
   - Configure seu domínio personalizado no painel do Vercel
   - Atualize as configurações de CORS se necessário

3. **Monitoramento**
   - Use o painel do Vercel para monitorar logs
   - Verifique analytics de uso

### Problemas comuns

**Se o chatbot não aparecer:**
- Verifique se não há erros no console do navegador
- Confirme que o botão circular azul aparece no canto inferior direito

**Se o formulário não enviar:**
- Verifique os logs da função serverless no Vercel
- Confirme que as rotas da API estão funcionando

**Se o admin não funcionar:**
- Senha correta é "v"
- Verifique se as requisições para `/api/admin/auth` estão sendo processadas

### Contato

Este projeto foi desenvolvido para Valença & Soares Advogados com todas as funcionalidades solicitadas implementadas e testadas.