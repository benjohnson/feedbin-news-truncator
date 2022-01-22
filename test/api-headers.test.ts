import headers from "../src/api-headers";

test("sets the content type to json", () => {
  const contentType = headers.get("Content-Type");
  expect(contentType).toBe("application/json");
});

test("sets the basic authentication", () => {
  const auth = headers.get("Authorization");
  // "12345:45678" from .env.test base64'd
  expect(auth).toBe("Basic MTIzNDU6NDU2Nzg=");
});
