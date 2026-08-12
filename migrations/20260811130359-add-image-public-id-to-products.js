"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("products", "image_public_id", {
    type: Sequelize.STRING,
    allowNull: false,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("products", "image_public_id");
}


export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("products", "deleted_at", {
    type: Sequelize.DATE,
    allowNull: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("products", "deleted_at");
}