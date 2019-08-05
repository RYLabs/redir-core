import { Redir, Script, StringIO, Prerequisite } from "../index";

let redir: Redir = new Redir();

const scriptContent = `
function handle(input) {
  return "Hello " + input;
}`;

beforeEach(() => {
  redir = new Redir();
});

test("Simple Test", () => {
  const input = new StringIO("Carl");
  const script = new Script("testScript", [], scriptContent, {});
  return redir.runScript(script, input.promise()).then(output => {
    expect(output.toString()).toBe("Hello Carl");
  });
});

test("Simple Test with Prerequisite", () => {
  const lowercaseScript = `
  function handle(input) {
    return input.toLowerCase();
  }`;
  const lowercase = new Script("lowercase", [], lowercaseScript, {});
  const prereq = new Prerequisite(lowercase);

  const input = new StringIO("Carl");
  const script = new Script("testScript", [prereq], scriptContent, {});
  return redir.runScript(script, input.promise()).then(output => {
    expect(output.toString()).toBe("Hello carl");
  });
});
