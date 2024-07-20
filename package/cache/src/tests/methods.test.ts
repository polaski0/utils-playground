import { client } from "../..";
import { logResult } from "../utils/logger";

const cache = client({
  isCheckerActive: false,
});

describe("cache methods", () => {
  beforeEach(() => {
    const data = [
      {
        id: 1,
        name: "John",
      },
      {
        id: 2,
        name: "Jane",
      },
      {
        id: 3,
        name: "Doe",
      },
    ];

    for (let i = 0; i < data.length; i++) {
      cache.set(i, data[i]);
    }
  });

  test("should not be undefined", () => {
    const data = {
      id: 4,
      name: "Andrew",
    };

    cache.set(data.id, data);
    logResult(data, cache.get(data.id));
    expect(cache.get(data.id)).not.toBeUndefined();
  });

  test("should expire", async () => {
    const data = {
      id: 5,
      name: "Matt",
    };

    cache.set(data.id, data, 1);

    await new Promise((resolve) => {
      setTimeout(() => resolve(1), 2000);
    });
    logResult("undefined", cache.get(data.id));
    expect(cache.get(data.id)).toBeUndefined();
  });
});
