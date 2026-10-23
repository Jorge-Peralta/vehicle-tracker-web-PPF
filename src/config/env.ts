import { z } from 'zod'

/**
 * Build-time environment variables (Vite inlines `import.meta.env.VITE_*`).
 * Validated once so a missing API URL fails loudly instead of producing broken requests.
 */
const envSchema = z.object({
  VITE_API_URL: z.url().default('http://localhost:3000/api'),
  // PrimeUI Community license. Without it PrimeReact may show a license notice.
  VITE_PRIMEREACT_LICENSE: z.string().optional(),
})

const result = envSchema.safeParse(import.meta.env)

if (!result.success) {
  throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`)
}

export const env = {
  apiUrl: result.data.VITE_API_URL.replace(/\/$/, ''),
  primeReactLicense: result.data.VITE_PRIMEREACT_LICENSE,
}
