export function useSrcH264 () : string {
  const params = new URL(document.location.href).searchParams
  const src = params.get("src2") || import.meta.env.VITE_DEFAULT_SRC_H264
  if (src) return src
  throw new Error("could not parse standard source from the queryparams or the env")
}