import { createServer } from "node:http";
import { once } from "node:events";
import { randomUUID } from "node:crypto";
import { error } from "node:console";

const usersDB = [];
function getUserCategory(birthDay) {
  const age = new Date().getFullYear() - new Date(birthDay).getFullYear();
  const now = new Date();
  if (isNaN(new Date(birthDay))) throw new Error("Invalid birth date");

  if (new Date(birthDay) > now) throw new Error("Invalid birth date");

  if (age < 18) throw new Error("User must be 18yo or older");

  if (age >= 18 && age <= 25) return "young-adult";

  if (age >= 26 && age <= 50) return "adult";

  if (age >= 51) return "senior";
}
const server = createServer(async (request, response) => {
  try {
    if (request.url === "/users" && request.method === "POST") {
      const user = JSON.parse(await once(request, "data"));

      if (!user.name) throw new Error("Should contain valid name");
      const updatedUser = {
        ...user,
        id: randomUUID(),
        category: getUserCategory(user.birthDay),
      };

      usersDB.push(updatedUser);

      response.writeHead(201, {
        "Content-Type": "application/json",
      });

      response.end(
        JSON.stringify({
          id: updatedUser.id,
        })
      );
      return;
    }

    if (request.url.startsWith("/users") && request.method === "GET") {
      const [, , id] = request.url.split("/");
      const user = usersDB.find((user) => user.id === id);
      response.end(JSON.stringify(user));

      return;
    }
  } catch (error) {
    if (
      error.message.includes("18yo") ||
      error.message.includes("Should contain valid name") ||
      error.message.includes("Invalid birth date")
    ) {
      response.writeHead(400, {
        "Content-Typo": "application/json",
      });
      response.end(
        JSON.stringify({
          message: error.message,
        })
      );

      return;
    }
    response.writeHead(500);
    response.end("Deu Ruim!!");
  }
  response.end("Hello world!!");
});

export { server };
