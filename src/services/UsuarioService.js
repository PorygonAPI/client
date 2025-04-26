export default {
  async getAnalistas() {
    try {
      const response = await fetch('/api/usuarios/analistas', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar analistas: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching analysts:', error);
      throw error;
    }
  }
}
