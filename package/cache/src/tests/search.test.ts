import { client } from "../..";
import { faker } from "@faker-js/faker";
import { performanceBenchmark } from "../utils/performance";
import { logResult } from "../utils/logger";
import { generateUuid } from "../utils/uuid";

const cache = client({
  isCheckerActive: false,
});

type TPersonalInformation = {
  id: number | string;
  firstName: string;
  middleName: string;
  lastName: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
};

const cacheOptions = [
  {
    key: "personalInformation",
  },
];

const generatePersonalInformation = (id: any): TPersonalInformation => ({
  id: id,
  firstName: faker.person.firstName(),
  middleName: faker.person.middleName(),
  lastName: faker.person.lastName(),
  address: {
    street: faker.location.street(),
    city: faker.location.city(),
    zipCode: faker.location.zipCode(),
  },
});

describe("search through sorted id", () => {
  const DATA_LENGTH = 5000;
  const searchId = Math.floor(Math.random() * DATA_LENGTH);

  beforeEach(() => {
    const data: TPersonalInformation[] = new Array(DATA_LENGTH)
      .fill(null)
      .map((_, index) => {
        return generatePersonalInformation(index + 1);
      });

    cache.set(cacheOptions[0].key, data);
  });

  test("linear search (for loop)", () => {
    console.log("linear search (for loop)");
    performanceBenchmark(() => {
      const id = searchId;
      const personalInformations: TPersonalInformation[] = cache.get(
        cacheOptions[0].key,
      );

      let idx = -1;

      for (let i = 0; i < personalInformations.length; i++) {
        if (personalInformations[i].id === id) {
          idx = i;
          break;
        }
      }

      logResult(id, personalInformations[idx].id);
      expect(idx).not.toBe(-1);
    });
  });

  test("linear search (find)", () => {
    console.log("linear search (find)");
    performanceBenchmark(() => {
      const id = searchId;
      const personalInformations: TPersonalInformation[] = cache.get(
        cacheOptions[0].key,
      );

      const personalInformation = personalInformations.find(
        (personalInformation) => personalInformation.id === id,
      );

      logResult(id, personalInformation?.id);
      expect(personalInformation).not.toBeUndefined();
    });
  });

  test.skip("binary search", async () => {
    // code here...
  });
});

describe("search through uuid", () => {
  const DATA_LENGTH = 10000;
  let searchUuid: string = "";
  const randomIndex = Math.floor(Math.random() * DATA_LENGTH);

  beforeEach(() => {
    const data: TPersonalInformation[] = new Array(DATA_LENGTH)
      .fill(null)
      .map((_, index) => {
        const uuid = generateUuid();

        if (index === randomIndex) {
          searchUuid = uuid;
        }

        return generatePersonalInformation(uuid);
      });

    cache.set(cacheOptions[0].key, data);
  });

  test("linear search (for loop)", () => {
    console.log("linear search (for loop)");
    performanceBenchmark(() => {
      const id = searchUuid;
      const personalInformations: TPersonalInformation[] = cache.get(
        cacheOptions[0].key,
      );

      let idx = -1;

      for (let i = 0; i < personalInformations.length; i++) {
        if (personalInformations[i].id === id) {
          idx = i;
          break;
        }
      }

      logResult(id, `id: ${personalInformations[idx].id}; index: ${idx}`);
      expect(idx).not.toBe(-1);
    });
  });

  test("linear search (find)", () => {
    console.log("linear search (find)");
    performanceBenchmark(() => {
      const id = searchUuid;
      const personalInformations: TPersonalInformation[] = cache.get(
        cacheOptions[0].key,
      );

      let idx = -1;
      const personalInformation = personalInformations.find(
        (personalInformation, index) => {
          idx = index;
          return personalInformation.id === id;
        },
      );

      logResult(id, `id: ${personalInformation?.id}; index: ${idx}`);
      expect(personalInformation).not.toBeUndefined();
    });
  });

  test.skip("binary search", async () => {
    // code here...
  });
});
