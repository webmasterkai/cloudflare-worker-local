const { Worker } = require("../worker");

describe("Workers", () => {
  test("It Can Create and Execute a Listener", () => {
    const worker = new Worker('addEventListener("add", (a, b) => a + b)');
    expect(worker.triggerEvent('add', 1, 2)).toBe(3);
  });

  test("It has Node buildins like Object in scope", () => {
    const worker = new Worker('addEventListener("test", () => Object.assign({}, {foo: "bar"}))');
    expect(worker.triggerEvent('test').foo).toBe('bar');
  });

  test("It has Fetch buildins like Request in scope", () => {
    const worker = new Worker('addEventListener("test", () => new Request())');
    expect(worker.triggerEvent('test').method).toBe('GET');
  });

  test("It can stub out responses", async () => {
    const worker = new Worker('addEventListener("fetch", (e) => e.respondWith(new Response("hello")))');
    const response = await worker.executeFetchEvent("http://foo.com")
    expect(response.status).toBe(200)
    expect(await response.text()).toBe("hello")
  });
})