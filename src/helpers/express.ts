export const morganProdOptions =
  '":req[x-forwarded-for]/:remote-addr/:remote-user" [:date[web]] ' +
  '":method :url HTTP/:http-version" :status ' +
  '":referrer" ":user-agent" :response-time ms';