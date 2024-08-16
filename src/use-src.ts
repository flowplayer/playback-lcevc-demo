export function useSrc () : string {
  const params = new URL(document.location.href).searchParams
  const src = params.get("src") || import.meta.env.VITE_DEFAULT_SRC
  if (src) return src
  throw new Error("could not parse a source from the queryparams or the env")
}