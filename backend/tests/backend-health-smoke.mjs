const baseUrl = process.env.BACKEND_SMOKE_URL || 'http://127.0.0.1:5050'

const response = await fetch(`${baseUrl}/health`)
if (!response.ok) {
  throw new Error(`Health endpoint failed with status ${response.status}`)
}

const payload = await response.json()
if (payload.status !== 'OK') {
  throw new Error(`Unexpected health payload: ${JSON.stringify(payload)}`)
}

console.log(`Backend smoke test passed against ${baseUrl}`)
