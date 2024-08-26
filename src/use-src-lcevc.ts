export function useSrcLCEVC () : string {
  const params = new URL(document.location.href).searchParams
  const src = params.get("src") || import.meta.env.VITE_DEFAULT_SRC_LCEVC
  if (src) return src
  throw new Error("could not parse lcevc source from the queryparams or the env")
}