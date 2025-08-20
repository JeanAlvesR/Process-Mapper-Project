#!/bin/bash

# Script para testar os endpoints de paginação
# Certifique-se de que o backend está rodando

BASE_URL="http://localhost:3000/api"

echo "🧪 Testando Endpoints de Paginação"
echo "=================================="

# Teste 1: Buscar áreas com paginação
echo -e "\n1. Testando paginação de áreas..."
curl -s "$BASE_URL/areas/paginated?page=1&limit=5" | jq '.'

# Teste 2: Buscar áreas com busca
echo -e "\n2. Testando busca em áreas..."
curl -s "$BASE_URL/areas/paginated?page=1&limit=5&search=rh" | jq '.'

# Teste 3: Buscar áreas com ordenação
echo -e "\n3. Testando ordenação em áreas..."
curl -s "$BASE_URL/areas/paginated?page=1&limit=5&sortBy=name&sortOrder=ASC" | jq '.'

# Teste 4: Contar total de áreas
echo -e "\n4. Testando contagem de áreas..."
curl -s "$BASE_URL/areas/count" | jq '.'

# Teste 5: Buscar processos com paginação
echo -e "\n5. Testando paginação de processos..."
curl -s "$BASE_URL/processes/paginated?page=1&limit=5" | jq '.'

# Teste 6: Buscar processos com filtros
echo -e "\n6. Testando filtros em processos..."
curl -s "$BASE_URL/processes/paginated?page=1&limit=5&type=manual" | jq '.'

# Teste 7: Buscar processos hierárquicos
echo -e "\n7. Testando processos hierárquicos..."
curl -s "$BASE_URL/processes/hierarchical?page=1&limit=5" | jq '.'

# Teste 8: Contar total de processos
echo -e "\n8. Testando contagem de processos..."
curl -s "$BASE_URL/processes/count" | jq '.'

# Teste 9: Buscar processos por área
echo -e "\n9. Testando processos por área..."
# Primeiro, vamos pegar o ID de uma área
AREA_ID=$(curl -s "$BASE_URL/areas/paginated?page=1&limit=1" | jq -r '.data[0].id')
if [ "$AREA_ID" != "null" ] && [ "$AREA_ID" != "" ]; then
    curl -s "$BASE_URL/processes/area/$AREA_ID/paginated?page=1&limit=5" | jq '.'
else
    echo "Nenhuma área encontrada para testar"
fi

# Teste 10: Contar processos por área
echo -e "\n10. Testando contagem de processos por área..."
if [ "$AREA_ID" != "null" ] && [ "$AREA_ID" != "" ]; then
    curl -s "$BASE_URL/processes/area/$AREA_ID/count" | jq '.'
else
    echo "Nenhuma área encontrada para testar"
fi

echo -e "\n✅ Testes concluídos!"
echo "Verifique as respostas acima para validar a paginação."
