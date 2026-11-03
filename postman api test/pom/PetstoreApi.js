const BASE_URL = 'https://petstore.swagger.io/v2';

export class PetstoreApi {
  async request(path, options = {}) {
    const { headers = {}, ...requestOptions } = options;
    const response = await fetch(`${BASE_URL}${path}`, {
      ...requestOptions,
      headers: { accept: 'application/json', ...headers },
    });

    const text = await response.text();
    let body = null;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }

    return { status: response.status, body };
  }

  createPet(payload) {
    return this.request('/pet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: typeof payload === 'string' ? payload : JSON.stringify(payload),
    });
  }

  findPetsByStatus(status) {
    return this.request(`/pet/findByStatus?status=${encodeURIComponent(status)}`);
  }

  deletePet(petId) {
    return this.request(`/pet/${encodeURIComponent(petId)}`, {
      method: 'DELETE',
    });
  }
}
