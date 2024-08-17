import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import Task from "../src/task.js";

describe("Task Test Suite", () => {
  let _logMock;
  let _task;
  beforeEach(() => {
    _logMock = jest.spyOn(console, 'log').mockImplementation();

    _task = new Task();
  });

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

  it("should have task size 0 after all tasks have run", async () => {
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

    expect(_task.size()).toBe(0)

    jest.advanceTimersByTime(200); 
    expect(console.log).toHaveBeenCalledWith("tasks fineshed!");

    jest.useRealTimers();

  }); 
});
