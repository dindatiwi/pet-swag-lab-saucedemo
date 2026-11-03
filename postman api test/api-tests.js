import { describe, it } from 'mocha';
import { expect } from 'chai';
import { PetstoreApi } from './pom/PetstoreApi.js';

const api = new PetstoreApi();
const deletePetId = Date.now();

describe('Petstore API', function () {
  it('Test Case 1: Create pet with status "available"', async function () {
    const result = await api.createPet({
      id: 0,
      category: { id: 0, name: 'dog' },
      name: 'doggie-available',
      photoUrls: ['https://example.com/dog.jpg'],
      tags: [{ id: 0, name: 'available-tag' }],
      status: 'available',
    });

    expect(result.status).to.equal(200);
    expect(result.body.status).to.equal('available');
  });

  it('Test Case 2: Create pet with status "pending"', async function () {
    const result = await api.createPet({
      id: 0,
      category: { id: 0, name: 'dog' },
      name: 'doggie-pending',
      photoUrls: ['https://example.com/dog.jpg'],
      tags: [{ id: 0, name: 'pending-tag' }],
      status: 'pending',
    });

    expect(result.status).to.equal(200);
    expect(result.body.status).to.equal('pending');
  });

  it('Test Case 3: Create pet with status "sold"', async function () {
    const result = await api.createPet({
      id: 0,
      category: { id: 0, name: 'dog' },
      name: 'doggie-sold',
      photoUrls: ['https://example.com/dog.jpg'],
      tags: [{ id: 0, name: 'sold-tag' }],
      status: 'sold',
    });

    expect(result.status).to.equal(200);
    expect(result.body.status).to.equal('sold');
  });

  it('Test Case 4: Create pet with only name and status', async function () {
    const result = await api.createPet({
      name: 'doggie-name-status',
      status: 'available',
    });

    expect(result.status).to.equal(200);
    expect(result.body).to.include({ name: 'doggie-name-status', status: 'available' });
  });

  it('Test Case 5: Create pet with only name', async function () {
    const result = await api.createPet({ name: 'doggie-name-only' });

    expect(result.status).to.equal(200);
    expect(result.body.name).to.equal('doggie-name-only');
  });

  it('Test Case 6: Send empty JSON payload', async function () {
    const result = await api.createPet({});

    expect(result.status).to.be.at.least(400);
  });

  it('Test Case 7: Invalid JSON syntax', async function () {
    const result = await api.createPet('{bad-json');

    expect(result.status).to.be.at.least(400);
  });

  it('Filter by status "available"', async function () {
    const result = await api.findPetsByStatus('available');

    expect(result.status).to.equal(200);
    expect(result.body).to.be.an('array');
    expect(result.body.every((pet) => pet.status === 'available')).to.equal(true);
  });

  it('Filter by status "pending"', async function () {
    const result = await api.findPetsByStatus('pending');

    expect(result.status).to.equal(200);
    expect(result.body).to.be.an('array');
    expect(result.body.every((pet) => pet.status === 'pending')).to.equal(true);
  });

  it('Filter by status "sold"', async function () {
    const result = await api.findPetsByStatus('sold');

    expect(result.status).to.equal(200);
    expect(result.body).to.be.an('array');
    expect(result.body.every((pet) => pet.status === 'sold')).to.equal(true);
  });

  it('Filter by invalid or unregistered status', async function () {
    const result = await api.findPetsByStatus('not-a-real-status');

    expect(result.status).to.be.at.least(400);
  });

  it('Prepare DELETE test: create pet to delete', async function () {
    const result = await api.createPet({
      id: deletePetId,
      name: 'doggie-delete-test',
      photoUrls: [],
    });

    expect(result.status).to.equal(200);
  });

  it('Delete existing pet ID', async function () {
    const result = await api.deletePet(deletePetId);

    expect(result.status).to.equal(200);
  });

  it('Delete already deleted pet ID', async function () {
    const result = await api.deletePet(deletePetId);

    expect(result.status).to.be.at.least(400);
  });

  it('Delete with non-numeric pet ID', async function () {
    const result = await api.deletePet('abc');

    expect(result.status).to.be.at.least(400);
  });
});
