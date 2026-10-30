const BASE_URL = 'https://petstore.swagger.io/v2';

export class PetstoreApi {
  async request(path, options = {}) {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: { accept: 'application/json', ...options.headers },
      ...options,
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

    return { response, body };
  }

  async createPet(payload) {
    const result = await this.request('/pet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: typeof payload === 'string' ? payload : JSON.stringify(payload),
    });

    this.expectStatus(result, 200);
    this.expectPetMatches(payload, result.body);
    return result.body;
  }

  async createPetExpectingError(payload) {
    const result = await this.request('/pet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: typeof payload === 'string' ? payload : JSON.stringify(payload),
    });

    this.expectErrorStatus(result);
  }

  async findPetByStatus(status, expectedPetId, expectedStatus) {
    const result = await this.request(`/pet/findByStatus?status=${encodeURIComponent(status)}`);
    this.expectStatus(result, 200);

    const pets = Array.isArray(result.body) ? result.body : [];
    const pet = pets.find(({ id }) => String(id) === String(expectedPetId));
    this.expect(Boolean(pet), `Expected pet id ${expectedPetId} for status "${status}"`);
    this.expect(pet.status === expectedStatus, `Expected pet ${expectedPetId} to have status "${expectedStatus}"`);
    return pet;
  }

  async findPetByInvalidStatus(status) {
    const result = await this.request(`/pet/findByStatus?status=${encodeURIComponent(status)}`);
    this.expectErrorStatus(result);
  }

  async deletePet(petId) {
    const result = await this.request(`/pet/${encodeURIComponent(petId)}`, {
      method: 'DELETE',
    });
    this.expectStatus(result, 200);
  }

  async deletePetExpectingError(petId) {
    const result = await this.request(`/pet/${encodeURIComponent(petId)}`, {
      method: 'DELETE',
    });
    this.expectErrorStatus(result);
  }

  expectPetMatches(expected, actual) {
    this.expect(actual && typeof actual === 'object', 'Expected a JSON object response');
    this.expect(Number.isInteger(actual.id) && actual.id > 0, 'Response is missing a valid positive id');

    for (const key of ['name', 'status']) {
      if (expected[key] !== undefined) {
        this.expect(actual[key] === expected[key], `Field "${key}" did not match`);
      }
    }

    if (expected.category) {
      for (const key of ['id', 'name']) {
        if (expected.category[key] !== undefined) {
          this.expect(
            actual.category?.[key] === expected.category[key],
            `Category field "${key}" did not match`,
          );
        }
      }
    }
  }

  expectStatus({ response, body }, expectedStatus) {
    this.logStatus(response);
    this.expect(
      response.status === expectedStatus,
      `Expected status ${expectedStatus}, received ${response.status}. Response: ${JSON.stringify(body)}`,
    );
  }

  expectErrorStatus({ response, body }) {
    this.logStatus(response);
    this.expect(
      response.status >= 400,
      `Expected an error status, received ${response.status}. Response: ${JSON.stringify(body)}`,
    );
  }

  expect(condition, message) {
    if (!condition) throw new Error(message);
  }

  logStatus(response) {
    console.log(`HTTP status: ${response.status}`);
  }
}
