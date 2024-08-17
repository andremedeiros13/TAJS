import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import Task from "../src/task.js";
import { setTimeout } from "node:timers/promises";

describe("Task Test Suite", () => {
  let _logMock;
  let _task;
  beforeEach(() => {
    _logMock = jest.spyOn(console, console.log.name).mockImplementation();

    _task = new Task();
  });
  it.skip("should only run task are dua without fake timers (slow)", async () => {
    // AAA = Arrange, Act, Assert

    //Arrange
    const tasks = [
      {
        name: "Task-Will-Run-I-5-Secs",
        dueAt: new Date(Date.now() + 5000),
        fn: jest.fn(),
      },
      {
        name: "Task-Will-Run-I-10-Secs",
        dueAt: new Date(Date.now() + 10000),
        fn: jest.fn(),
      },
    ];
    //Act
    _task.save(tasks.at(0));
    _task.save(tasks.at(1));

    _task.run(200);

    await setTimeout(11e3); //11_000

    //Assert
    expect(tasks.at(0).fn).toHaveBeenCalled();
    expect(tasks.at(1).fn).toHaveBeenCalled();
  }, 15e3); //Configurar para o jest aguardar 15 segundos neste teste

  it("should only run task are dua without fake timers (fast )", async () => {
    // AAA = Arrange, Act, Assert
    jest.useFakeTimers();
    //Arrange
    const tasks = [
      {
        name: "Task-Will-Run-I-5-Secs",
        dueAt: new Date(Date.now() + 5000),
        fn: jest.fn(),
      },
      {
        name: "Task-Will-Run-I-10-Secs",
        dueAt: new Date(Date.now() + 10000),
        fn: jest.fn(),
      },
    ];
    //Act
    _task.save(tasks.at(0));
    _task.save(tasks.at(1));

    _task.run(200);
    jest.advanceTimersByTime(4000);

    //Assert
    //nenhum test deve ser executando ainda
    expect(tasks.at(0).fn).not.toHaveBeenCalled();
    expect(tasks.at(1).fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000);//6 segundos

    //Assert
    //Apenas a primeira task deve ser executada
    expect(tasks.at(0).fn).toHaveBeenCalled();
    expect(tasks.at(1).fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(4000);//10 segundos

    //Assert
    //A segunda tasks deve ser executada.    
    expect(tasks.at(1).fn).toHaveBeenCalled();

    jest.useRealTimers();

  }); 
});
