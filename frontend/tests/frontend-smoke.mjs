const baseUrl = process.env.FRONTEND_SMOKE_URL || 'http://127.0.0.1:3100'

async function assertPage(path, expectedText) {
  const response = await fetch(`${baseUrl}${path}`)
  if (!response.ok) {
    throw new Error(`${path} returned status ${response.status}`)
  }

  const html = await response.text()
  if (!html.includes(expectedText)) {
    throw new Error(`${path} did not include expected text "${expectedText}"`)
  }
}

await assertPage('/login', 'Login')
await assertPage('/products', 'INSTANT COFFEE')

console.log(`Frontend smoke test passed against ${baseUrl}`)
