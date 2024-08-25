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

When('I create a new user with the following details 4:', async function(dataTable) {
  const [data] = dataTable.hashes()
  const response = await createUser(data)
  _context.responseData = {
    status: response.status,
    body: await response.json()
  }
})

Then('I should receive an error message that the name cannot be empty', async function() {
  assert.strictEqual(_context.responseData.status, 400)
  assert.strictEqual(_context.responseData.body.message, 'Should contain valid name')
})