import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { mapPerson } from "../src/person.js";

describe("Person Test Suite", () => {
  describe("happy path", () => {
    it("shold map person", () => {
      const person = '{"name":"andremedeiros","age":"33"}';
      const personObj = mapPerson(person);
      expect(personObj).toEqual({
        name: "andremedeiros",
        age: "33",
        createdAt: expect.any(Date),
      });
    });
  });

  describe("wath coverage doenst tell you", () => {
    it("shold not map person give invalid JSON String", () => {
      const person = '{"name"';
      expect(() => mapPerson(person)).toThrow(
        "after property name in JSON at position 7"
      );
    });

    it("shold not map person given invalid JSON Data", () => {
      const person = "{}";
      const personObj = mapPerson(person);
      
      expect(personObj).toEqual({
        age: undefined,
        name: undefined,
        createdAt: expect.any(Date),
      });
    });
  });
});
