import { BeforeStep, When, Then } from '@cucumber/cucumber'
import assert from 'node:assert'

let _testServerAddress = ''
let _context = {}

async function createUser(data) {
  return fetch(`${_testServerAddress}/users`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

BeforeStep(function() {
  _testServerAddress = this.testServerAddress
})

When('I create a young user with the following details:', async function(dataTable) {
  const [data] = dataTable.hashes()
  const response = await createUser(data)
  _context.responseData = {
    status: response.status,
    body: await response.json()
  }
})

Then('I should receive an error message that the user must be at least 18 years old', async function() {
  assert.strictEqual(_context.responseData.status, 400)
  assert.strictEqual(_context.responseData.body.message, 'User must be 18yo or older')
})