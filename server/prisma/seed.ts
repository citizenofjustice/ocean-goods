import * as bcrypt from "bcrypt";
import { prisma } from "../src/db";

const createPriveleges = async () => {
  try {
    await prisma.privelege.createMany({
      data: [
        { title: "администратор" },
        { title: "управление ролями" },
        { title: "управление каталогом" },
        { title: "управление учетными записями" },
        { title: "доступ к заказам" },
      ],
      skipDuplicates: true,
    });
  } catch (error) {
    console.error(error);
  }
};

const createAdmin = async () => {
  try {
    const priveleges = await prisma.privelege.findMany();

    const role = await prisma.roles.create({
      data: {
        title: "Администратор",
        rolePriveleges: {
          create: priveleges.map((item) => ({
            privelege: {
              connect: {
                privelegeId: item.privelegeId,
              },
            },
          })),
        },
      },
    });
    return role.roleId;
  } catch (error) {
    console.error(error);
  }
};

const createUser = async (roleId: number) => {
  try {
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const email: string = process.env.ADMIN_EMAIL;
      const password: string = process.env.ADMIN_PASSWORD;

      // Encrypt the password
      const passwordHash = await bcrypt.hash(password, 13);
      // Insert a new user into the database
      await prisma.users.create({
        data: {
          login: email,
          passwordHash: passwordHash,
          roleId: roleId,
        },
      });
    } else
      throw new Error(
        "Unable to create default admin. Not found env variables."
      );
  } catch (error) {
    console.error(error);
  }
};

const fillData = async () => {
  await createPriveleges();
  const roleId = await createAdmin();
  if (roleId) await createUser(roleId);
};

fillData();
