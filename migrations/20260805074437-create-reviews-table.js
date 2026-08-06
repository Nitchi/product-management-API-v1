'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reviews', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      comment: {
        type: Sequelize.TEXT,
        allowNull: false,
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

    // Rating must be between 1 and 5
    await queryInterface.sequelize.query(`
      ALTER TABLE reviews
      ADD CONSTRAINT reviews_rating_range
      CHECK (rating BETWEEN 1 AND 5);
    `);

    // Prevent empty comments
    await queryInterface.sequelize.query(`
      ALTER TABLE reviews
      ADD CONSTRAINT reviews_comment_not_empty
      CHECK (TRIM(comment) <> '');
    `);

    // One review per product per user
    await queryInterface.addConstraint('reviews', {
      fields: ['product_id', 'user_id'],
      type: 'unique',
      name: 'unique_review_per_product_per_user',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('reviews');
  },
};