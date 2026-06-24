export function extractMessage(err: unknown): string | null {
  if (
    err &&
    typeof err === 'object' &&
    'response' in err &&
    err.response &&
    typeof err.response === 'object' &&
    'data' in err.response
  ) {
    const data = err.response.data as { message?: string; error?: string }
    return data.message ?? data.error ?? null
  }
  return null
}
