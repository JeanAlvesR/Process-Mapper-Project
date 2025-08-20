const API_BASE_URL = import.meta.env.VITE_API_URL;

// Função auxiliar para fazer requisições HTTP
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    // Se a resposta for 204 (No Content), não tenta fazer parse do JSON
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('[API] Erro na requisição:', error);
    throw error;
  }
};

// Função auxiliar para construir query string de paginação
const buildPaginationQuery = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });
  
  return queryParams.toString();
};

// Serviços para Áreas
export const areaService = {
  // Buscar todas as áreas
  getAll: () => apiRequest('/areas'),
  
  // Buscar áreas com paginação
  getPaginated: (params = {}) => {
    const query = buildPaginationQuery(params);
    const endpoint = query ? `/areas/paginated?${query}` : '/areas/paginated';
    return apiRequest(endpoint);
  },
  
  // Buscar área por ID
  getById: (id) => apiRequest(`/areas/${id}`),
  
  // Buscar áreas por nome
  getByName: (name, params = {}) => {
    const query = buildPaginationQuery(params);
    const endpoint = query ? `/areas/search/${encodeURIComponent(name)}?${query}` : `/areas/search/${encodeURIComponent(name)}`;
    return apiRequest(endpoint);
  },
  
  // Contar total de áreas
  getCount: () => apiRequest('/areas/count'),
  
  // Criar nova área
  create: (areaData) => apiRequest('/areas', {
    method: 'POST',
    body: JSON.stringify(areaData),
  }),
  
  // Atualizar área
  update: (id, areaData) => apiRequest(`/areas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(areaData),
  }),
  
  // Deletar área
  delete: (id) => apiRequest(`/areas/${id}`, {
    method: 'DELETE',
  }),
};

// Serviços para Processos
export const processService = {
  // Buscar todos os processos (com filtro opcional por área)
  getAll: (areaId = null) => {
    const endpoint = areaId ? `/processes?areaId=${areaId}` : '/processes';
    return apiRequest(endpoint);
  },
  
  // Buscar processos com paginação
  getPaginated: (params = {}) => {
    const query = buildPaginationQuery(params);
    const endpoint = query ? `/processes/paginated?${query}` : '/processes/paginated';
    return apiRequest(endpoint);
  },
  
  // Buscar processos hierárquicos
  getHierarchical: (params = {}) => {
    const query = buildPaginationQuery(params);
    const endpoint = query ? `/processes/hierarchical?${query}` : '/processes/hierarchical';
    return apiRequest(endpoint);
  },
  
  // Buscar processos por área com paginação
  getByAreaPaginated: (areaId, params = {}) => {
    const query = buildPaginationQuery(params);
    const endpoint = query ? `/processes/area/${areaId}/paginated?${query}` : `/processes/area/${areaId}/paginated`;
    return apiRequest(endpoint);
  },
  
  // Contar total de processos
  getCount: () => apiRequest('/processes/count'),
  
  // Contar processos por área
  getCountByArea: (areaId) => apiRequest(`/processes/area/${areaId}/count`),
  
  // Buscar processo por ID
  getById: (id) => apiRequest(`/processes/${id}`),
  
  // Criar novo processo
  create: (processData) => apiRequest('/processes', {
    method: 'POST',
    body: JSON.stringify(processData),
  }),
  
  // Atualizar processo
  update: (id, processData) => apiRequest(`/processes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(processData),
  }),
  
  // Deletar processo
  delete: (id) => apiRequest(`/processes/${id}`, {
    method: 'DELETE',
  }),
};

// Serviços para o banco de dados em memória (H2-like console)
export const dbService = {
  // Obter estado completo do banco
  getState: () => apiRequest('/db/state', { 
    headers: {} // Remove Content-Type para GET requests
  }),
  
  // Popular banco com dados de exemplo
  seed: () => fetch(`${API_BASE_URL.replace('/api', '')}/db/seed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.json()),
  
  // Resetar banco de dados
  reset: () => fetch(`${API_BASE_URL.replace('/api', '')}/db/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.json()),
};

