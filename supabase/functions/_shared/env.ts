// Reads an Edge Function secret, failing loudly when it isn't set.
export const env = (k: string) => {
  const v = Deno.env.get(k)
  if (!v) throw new Error(`Missing secret ${k}`)
  return v
}
