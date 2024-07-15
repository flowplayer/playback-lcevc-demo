export function useToken () {
    const params = new URL(document.location.href).searchParams
    const token = params.get("token") || import.meta.env.VITE_FLOWPLAYER_TOKEN
    if (token) return token
    throw new Error("could not parse a flowplayer playback token from the queryparams or the env")
  }