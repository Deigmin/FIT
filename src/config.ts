export = {
    connection: {
        host: process.env.host || "localhost",
        user: process.env.user || "root",
        password: process.env.password || "1",
        database: process.env.database || "FIT",
        port: process.env.port || 3306
    }
}