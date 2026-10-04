import { TaskPriority, type ICreateTask } from "..";
import { faker } from "@faker-js/faker";

export const generateSeedTask = (
  overrides?: Partial<ICreateTask>,
): ICreateTask => {
  return {
    name: `${faker.word.verb()} ${faker.word.noun()}`,
    details: faker.helpers.maybe(() => faker.lorem.paragraph(), {
      probability: 0.5,
    }),
    isCompleted: faker.datatype.boolean(),
    priority: faker.helpers.arrayElement(Object.values(TaskPriority)),
    category: faker.helpers.maybe(() => faker.word.sample(), {
      probability: 0.5,
    }),
    ...overrides,
  };
};
