import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const PLACEHOLDER_IMAGE = '/placeholder.svg'

function getSupabasePublicBaseUrl(): string | null {
  const endpoint = process.env.NEXT_PUBLIC_STORAGE_ENDPOINT?.trim()
  const bucket = process.env.NEXT_PUBLIC_STORAGE?.trim()

  if (!endpoint || !bucket) return null

  const normalizedEndpoint = endpoint.replace(/\/+$/, '')
  if (normalizedEndpoint.includes('/storage/v1/object/public')) {
    return `${normalizedEndpoint}/${bucket}`
  }

  const projectBase = normalizedEndpoint.replace(/\/storage\/v1\/s3$/i, '')
  return `${projectBase}/storage/v1/object/public/${bucket}`
}

function getCandidates(folderPath: string) {
  const cleanPath = folderPath.replace(/^\/+|\/+$/g, '')
  if (!cleanPath) return []

  return [
    `${cleanPath}/image.jpg`,
    `${cleanPath}/image.jpeg`,
    `${cleanPath}/image.png`,
    `${cleanPath}/image.webp`,
    `${cleanPath}/0.jpg`,
    `${cleanPath}/0.jpeg`,
    `${cleanPath}/0.png`,
    `${cleanPath}/0.webp`,
  ]
}

async function exists(url: string) {
  try {
    const res = await fetch(url, { method: 'HEAD', cache: 'no-store' })
    return res.ok
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const base = getSupabasePublicBaseUrl()
  const folderPath = request.nextUrl.searchParams.get('path')?.trim()

  if (!base || !folderPath) {
    return NextResponse.redirect(new URL(PLACEHOLDER_IMAGE, request.url))
  }

  const candidates = getCandidates(folderPath)

  for (const candidate of candidates) {
    const url = `${base}/${candidate}`
    if (await exists(url)) {
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.redirect(new URL(PLACEHOLDER_IMAGE, request.url))
}
