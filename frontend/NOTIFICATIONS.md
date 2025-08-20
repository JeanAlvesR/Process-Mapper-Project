# Sistema de Notificações Customizadas

Este projeto implementa um sistema de notificações customizadas usando a biblioteca **Sonner** para fornecer feedback visual ao usuário de forma elegante e consistente.

## 🚀 Funcionalidades

### Tipos de Notificação
- ✅ **Sucesso**: Para operações bem-sucedidas
- ❌ **Erro**: Para erros e falhas
- ℹ️ **Informação**: Para informações gerais
- ⚠️ **Aviso**: Para alertas e warnings
- 🔄 **Loading**: Para operações em andamento
- 📊 **Progresso**: Para operações com progresso

### Posições Disponíveis
- `top-right` (padrão)
- `top-left`
- `bottom-right`
- `bottom-left`

### Recursos Avançados
- Ícones customizados (emojis)
- Ações clicáveis (ex: "Desfazer")
- Descrições detalhadas
- Duração configurável
- Atualização dinâmica

## 📖 Como Usar

### 1. Importar o Hook

```javascript
import { useNotifications } from '../hooks/useNotifications'
```

### 2. Usar no Componente

```javascript
export function MeuComponente() {
  const { showSuccess, showError, showInfo, showWarning, showLoading } = useNotifications()
  
  // ... resto do código
}
```

### 3. Exemplos de Uso

#### Notificação Simples
```javascript
// Sucesso
showSuccess('Operação realizada com sucesso!')

// Erro
showError('Erro ao processar dados')

// Informação
showInfo('Dados carregados do cache')
```

#### Notificação com Descrição
```javascript
showSuccess('Área criada!', {
  description: 'Nova área adicionada ao sistema.',
  icon: '✨',
  duration: 4000
})
```

#### Notificação com Ação
```javascript
toast.success('Item excluído!', {
  action: {
    label: 'Desfazer',
    onClick: () => {
      // Lógica para desfazer
      showInfo('Item restaurado!')
    }
  }
})
```

#### Notificação de Loading
```javascript
const loadingToast = showLoading('Carregando dados...')

// Após a operação
updateToast(loadingToast, 'Dados carregados com sucesso!', 'success')
```

#### Notificação com Progresso
```javascript
const toastId = toast.loading('Processando...', {
  description: '0%'
})

// Atualizar progresso
toast.loading('Processando...', {
  id: toastId,
  description: '50%'
})

// Finalizar
toast.success('Concluído!', {
  id: toastId,
  description: '100%'
})
```

#### Notificações em Diferentes Posições
```javascript
const { showTopLeft, showBottomRight } = useNotifications()

showTopLeft('Notificação no canto superior esquerdo', 'info')
showBottomRight('Notificação no canto inferior direito', 'success')
```

## 🎨 Personalização

### Configurações Globais
As configurações padrão estão no hook `useNotifications`:

```javascript
// Duração padrão
duration: 4000, // 4 segundos

// Posição padrão
position: 'top-right'

// Ícones padrão
icon: '✅' // Para sucesso
icon: '❌' // Para erro
icon: '⚠️' // Para aviso
```

### Configurações por Notificação
Cada notificação pode ter suas próprias configurações:

```javascript
showSuccess('Mensagem', {
  duration: 6000,        // Duração personalizada
  position: 'top-left',  // Posição personalizada
  icon: '🎉',           // Ícone personalizado
  description: 'Descrição detalhada'
})
```

## 🔧 Componentes Relacionados

### ConfirmDialog
Componente de confirmação customizado para substituir os `alert()` padrão:

```javascript
import { ConfirmDialog } from '../components/ui/confirm-dialog'

<ConfirmDialog
  isOpen={isOpen}
  onClose={onClose}
  onConfirm={onConfirm}
  title="Confirmar Exclusão"
  description="Tem certeza que deseja excluir este item?"
  confirmText="Excluir"
  cancelText="Cancelar"
  variant="destructive"
/>
```

## 📱 Responsividade

As notificações são responsivas e se adaptam automaticamente a diferentes tamanhos de tela:

- **Desktop**: Posicionamento completo com todas as opções
- **Tablet**: Ajuste automático de tamanho
- **Mobile**: Posicionamento otimizado para telas pequenas

## 🎯 Boas Práticas

1. **Use mensagens claras e concisas**
2. **Forneça contexto quando necessário** (use descrições)
3. **Use ícones apropriados** para melhor UX
4. **Configure duração adequada** (mais longa para informações importantes)
5. **Use ações quando apropriado** (ex: "Desfazer")
6. **Evite spam** - não mostre muitas notificações simultaneamente

## 🐛 Troubleshooting

### Notificação não aparece
- Verifique se o `<Toaster />` está no App.jsx
- Confirme se o hook está sendo importado corretamente
- Verifique se não há erros no console

### Posição incorreta
- Verifique se a posição está sendo passada corretamente
- Confirme se o valor da posição é válido

### Ícone não aparece
- Use emojis válidos
- Verifique se o ícone está sendo passado como string

## 📚 Recursos Adicionais

- [Documentação do Sonner](https://sonner.emilkowal.ski/)
- [Emojis para uso](https://emojipedia.org/)
- [Guia de UX para notificações](https://www.nngroup.com/articles/notification-systems/)
