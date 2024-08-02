import { cleanEnv, str } from 'envalid'

const { isProd, CLIENT_PORT, SERVER_PORT } = cleanEnv(process.env, {
    CLIENT_PORT: str({ desc: 'The port the react app is running on' }),
    SERVER_PORT: str({ desc: 'The port the server is running on' }),
})

export class HttpService {
    private static readonly host = 'react-vite-trpc.onrender.com' // NOTE: must be a raw hostname

    private static readonly serverPort = SERVER_PORT

    private static readonly clientPort = CLIENT_PORT

    public static readonly serverUrl = isProd ? `https://${this.host}` : `http://localhost:${this.serverPort}`

    public static readonly clientUrl = isProd ? `https://${this.host}` : `http://localhost:${this.clientPort}`
}
