"use strict";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("roles", [
      {
        name: "ADMIN",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "CUSTOMER",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", {
      name: ["ADMIN", "CUSTOMER"],
    });
  },
};
