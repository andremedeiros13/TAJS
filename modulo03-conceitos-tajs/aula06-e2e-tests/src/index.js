import server from "./server.js";

if (process.env.NODE_ENV !== "test") {
  server.listen(process.env.PORT, () => {
    const serverInfo = server.address();
    console.log(
      `server is running as ${serverInfo.address}:${serverInfo.port}`
    );
  });
}

export default server;

/*
    curl -i -X POST \
    -H 'Content-Type: application/json' \
    -d '{
        "name": "andre medeiros",
        "cpf": "111.111.111-11"
    }' \
    http://localhost:3000/persons
*/