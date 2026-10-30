import { fileURLToPath } from 'node:url';
import { PetstoreApi } from './pom/PetstoreApi.js';
import { TestReporter } from './pom/TestReporter.js';

const api = new PetstoreApi();
const reporter = new TestReporter(fileURLToPath(new URL('./api-test-report.json', import.meta.url)));

const petPayload = (name, status, tag = status) => ({
  id: 0,
  category: { id: 0, name: 'dog' },
  name,
  photoUrls: [`https://example.com/${name}.jpg`],
  tags: [{ id: 0, name: `${tag}-tag` }],
  status,
});

async function runTests() {
  console.log('=== Petstore API Test Suite ===');

  const createdPets = {};
  const createCases = [
    ['Test Case 1: Create pet with status "available"', petPayload('doggie-available', 'available'), 'available'],
    ['Test Case 2: Create pet with status "pending"', petPayload('doggie-pending', 'pending'), 'pending'],
    ['Test Case 3: Create pet with status "sold"', petPayload('doggie-sold', 'sold'), 'sold'],
    ['Test Case 4: Create pet with only name and status', { name: 'doggie-name-status-only', status: 'available' }],
    ['Test Case 5: Create pet with only name', { name: 'doggie-name-only' }],
  ];

  for (const [name, payload, status] of createCases) {
    const pet = await reporter.run(name, () => api.createPet(payload));
    if (status) createdPets[status] = pet?.id;
  }

  await reporter.run('Test Case 6: Send empty JSON payload', () =>
    api.createPetExpectingError({}));
  await reporter.run('Test Case 7: Invalid JSON syntax', () =>
    api.createPetExpectingError('{bad-json'));

  for (const status of ['available', 'pending', 'sold']) {
    await reporter.run(`Filter by status "${status}"`, () =>
      api.findPetByStatus(status, createdPets[status], status));
  }
  await reporter.run('Filter by invalid or unregistered status', () =>
    api.findPetByInvalidStatus('not-a-real-status'));

  const deletePet = await reporter.run('Prepare DELETE test: create pet to delete', () =>
    api.createPet(petPayload('doggie-delete-test', 'available', 'delete-test')));

  if (deletePet?.id) {
    await reporter.run('Delete existing pet ID', () => api.deletePet(deletePet.id));
    await reporter.run('Delete already deleted pet ID', () => api.deletePetExpectingError(deletePet.id));
  } else {
    const reason = 'Skipped because the DELETE test pet could not be created';
    reporter.skip('Delete existing pet ID', reason);
    reporter.skip('Delete already deleted pet ID', reason);
    console.error(`\nDELETE-by-ID cases skipped: ${reason}.`);
  }

  await reporter.run('Delete with non-numeric pet ID', () =>
    api.deletePetExpectingError('abc'));

  const summary = await reporter.write();
  console.log(`\n=== Finished: ${summary.passed} passed, ${summary.failed} failed, ${summary.skipped} skipped ===`);
  if (summary.failed) process.exitCode = 1;
}

runTests().catch(async (error) => {
  console.error('\nAPI test suite failed');
  console.error(String(error.stack || error));
  reporter.fail('API test suite runner', error);
  try {
    await reporter.write();
  } catch (reportError) {
    console.error(`Could not write API test report: ${String(reportError.stack || reportError)}`);
  }
  process.exitCode = 1;
});
