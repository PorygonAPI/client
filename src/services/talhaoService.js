const TOKEN = localStorage.getItem('token')

export async function listarTalhoesPorUsuario(userId) {

  try {
    const response = await fetch(`/api/safras/api/talhoes/usuario/${userId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro da API:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      atribuidos: data.atribuidos.map(t => ({
        id: t.talhaoId,
        fazenda: t.nomeFazenda,
        numero: t.talhaoId,
        cultura: t.cultura,
        safraId: t.safraId
      })),
      aprovados: data.aprovados.map(t => ({
        id: t.talhaoId,
        fazenda: t.nomeFazenda,
        numero: t.talhaoId,
        cultura: t.cultura,
        safraId: t.safraId
      }))
    };
  } catch (error) {
    console.error('Erro na chamada à API:', error);
    throw error;
  }
}
