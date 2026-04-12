import jwt from 'jsonwebtoken'

const baseUrl = process.env.BACKEND_BASE_URL || 'http://127.0.0.1:5000'
const secret = process.env.JWT_SECRET

if (!secret) {
  throw new Error('JWT_SECRET is required for the subscription integration test')
}

const testUserId = process.env.INTEGRATION_USER_ID || '11111111-1111-4111-8111-111111111111'
const token =
  process.env.INTEGRATION_JWT ||
  jwt.sign(
    {
      id: testUserId,
      email: process.env.INTEGRATION_USER_EMAIL || 'integration@test.local',
      name: 'Integration Test User',
      role: 'user',
    },
    secret,
    { expiresIn: '1h' },
  )

const defaultPlanId =
  process.env.INTEGRATION_PLAN_ID || '550e8400-e29b-41d4-a716-446655440002'

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

function makePlaceholderId(seed) {
  return `22222222-2222-4222-8222-${String(seed).padStart(12, '0').slice(-12)}`
}

const createResponse = await fetch(`${baseUrl}/api/subscriptions`, {
  method: 'POST',
  headers: authHeaders(),
  body: JSON.stringify({
    plan_id: defaultPlanId,
    delivery_address_id: makePlaceholderId(1),
    payment_method_id: makePlaceholderId(2),
  }),
})

if (!createResponse.ok) {
  const errorPayload = await createResponse.text()
  throw new Error(`Create subscription failed: ${createResponse.status} ${errorPayload}`)
}

const createdPayload = await createResponse.json()
const subscriptionId = createdPayload?.data?.subscription_id

if (!subscriptionId) {
  throw new Error(`Create subscription response missing subscription_id: ${JSON.stringify(createdPayload)}`)
}

const listResponse = await fetch(`${baseUrl}/api/subscriptions`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
const listPayload = await listResponse.json()
if (!listResponse.ok || !Array.isArray(listPayload.data)) {
  throw new Error(`List subscriptions failed: ${JSON.stringify(listPayload)}`)
}

if (!listPayload.data.some((subscription) => subscription.subscription_id === subscriptionId)) {
  throw new Error('Created subscription was not returned by GET /api/subscriptions')
}

const pauseResponse = await fetch(`${baseUrl}/api/subscriptions/${subscriptionId}/pause`, {
  method: 'PUT',
  headers: authHeaders(),
})
const pausePayload = await pauseResponse.json()
if (!pauseResponse.ok || pausePayload?.data?.subscription_status !== 'PAUSED') {
  throw new Error(`Pause subscription failed: ${JSON.stringify(pausePayload)}`)
}

const resumeResponse = await fetch(`${baseUrl}/api/subscriptions/${subscriptionId}/resume`, {
  method: 'PUT',
  headers: authHeaders(),
})
const resumePayload = await resumeResponse.json()
if (!resumeResponse.ok || resumePayload?.data?.subscription_status !== 'ACTIVE') {
  throw new Error(`Resume subscription failed: ${JSON.stringify(resumePayload)}`)
}

const skipResponse = await fetch(`${baseUrl}/api/subscriptions/${subscriptionId}/skip`, {
  method: 'POST',
  headers: authHeaders(),
})
const skipPayload = await skipResponse.json()
if (!skipResponse.ok || !skipPayload?.data?.skipped_months) {
  throw new Error(`Skip subscription failed: ${JSON.stringify(skipPayload)}`)
}

const cancelResponse = await fetch(`${baseUrl}/api/subscriptions/${subscriptionId}`, {
  method: 'DELETE',
  headers: authHeaders(),
  body: JSON.stringify({ reason: 'Integration cleanup' }),
})
const cancelPayload = await cancelResponse.json()
if (!cancelResponse.ok || cancelPayload?.data?.subscription_status !== 'CANCELLED') {
  throw new Error(`Cancel subscription failed: ${JSON.stringify(cancelPayload)}`)
}

console.log(`Subscription integration flow passed against ${baseUrl}`)
