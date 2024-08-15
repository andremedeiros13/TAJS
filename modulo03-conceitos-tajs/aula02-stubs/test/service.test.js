import { describe, beforeEach, it, expect, jest } from "@jest/globals";
import Service from "../src/service";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import fsSync from "node:fs";

describe("Service Test Suite", () => {
  let _service;
  const filename = "testfile.ndjson";
  beforeEach(() => {
    _service = new Service({ filename });
  });

  describe("#read", () => {
    it("should return a empty array if then file is empty", async () => {
      jest.spyOn(fs, fs.readFile.name).mockResolvedValue("");

      const result = await _service.read();

      expect(result).toEqual([]);
    });
    it("should return a empty array if then file not exists", async () => {
      jest.spyOn(fsSync, "existsSync").mockReturnValue(true);

      const result = await _service.read();
      expect(result).toEqual([]);
    });

    it("should return users without password if file contains users", async () => {
      // Arrange
      const dbData = [
        {
          username: "user1",
          password: "pass1",
          createdAt: new Date().toISOString(),
        },
        {
          username: "user2",
          password: "pass2",
          createdAt: new Date().toISOString(),
        },
      ];
      const fileContents = dbData
        .map((item) => JSON.stringify(item).concat("\n"))
        .join("");

      jest.spyOn(fsSync, "existsSync").mockReturnValue(true);
      jest.spyOn(fs, "readFile").mockResolvedValue(fileContents);

      // Act
      const result = await _service.read();

      // Assert
      const expected = dbData.map(({ password, ...rest }) => ({ ...rest }));
      expect(result).toEqual(expected);
    });
  });
});
