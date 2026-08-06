'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      sku: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },

      discount_percentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },

      quantity_in_stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      image_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Price must be greater than zero
    await queryInterface.sequelize.query(`
      ALTER TABLE products
      ADD CONSTRAINT products_price_positive
      CHECK (price > 0);
    `);

    // Quantity cannot be negative
    await queryInterface.sequelize.query(`
      ALTER TABLE products
      ADD CONSTRAINT products_quantity_non_negative
      CHECK (quantity_in_stock >= 0);
    `);

    // Discount must be NULL or between 0 and 100
    await queryInterface.sequelize.query(`
      ALTER TABLE products
      ADD CONSTRAINT products_discount_range
      CHECK (
        discount_percentage IS NULL
        OR (
          discount_percentage >= 0
          AND discount_percentage <= 100
        )
      );
    `);

    // Prevent empty product names
    await queryInterface.sequelize.query(`
      ALTER TABLE products
      ADD CONSTRAINT products_name_not_empty
      CHECK (TRIM(name) <> '');
    `);

    // Prevent empty SKUs
    await queryInterface.sequelize.query(`
      ALTER TABLE products
      ADD CONSTRAINT products_sku_not_empty
      CHECK (TRIM(sku) <> '');
    `);

    // Prevent empty descriptions
    await queryInterface.sequelize.query(`
      ALTER TABLE products
      ADD CONSTRAINT products_description_not_empty
      CHECK (TRIM(description) <> '');
    `);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('products');
  },
};
