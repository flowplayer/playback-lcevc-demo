export function useSrcWebRTC () : string {
  const params = new URL(document.location.href).searchParams
  const src = params.get("src4") || import.meta.env.VITE_DEFAULT_SRC_WEBRTC
  if (src) return src
  throw new Error("could not parse standard source from the queryparams or the env")
}