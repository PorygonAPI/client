const fetchWithInterceptors = async (url, options = {}) => {
  // Interceptor de requisição
  const token = localStorage.getItem('token');
  if (token) {
    if (!options.headers) {
      options.headers = {};
    }
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const uri = 'http://localhost:8080'+url;
    const response = await fetch(uri, options);

    // Interceptor de resposta
    if (response.status === 401) {
      // Redireciona se o status for 401 (não autorizado)
      window.location.href = '/';
    }

    // Verificando se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error('Erro na requisição');
    }

    // Retorna a resposta como JSON (caso seja o esperado)
    return await response.json();
  } catch (error) {
    // Lida com os erros da requisição
    return Promise.reject(error);
  }
};

// Usar a função `fetchWithInterceptors` com Vue
export default {
  install: (app) => {
    app.config.globalProperties.$fetch = fetchWithInterceptors;
  },
};
