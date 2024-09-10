import server from './api.js';

if (process.env.NODE_ENV !== "test") {
  server.listen(process.env.PORT, () => {
    const serverInfo = server.address();
    console.log(
      `server is running as ${serverInfo.address}:${serverInfo.port}`
    );
  });
}

export default server;
