import { Product, Category } from "../models/index.js";
import Role from "../models/Role"; 
import { randomUUID } from "crypto";
import slugify from "slugify";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";
import ApiError from "../utils/ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";

export const createProduct = async (productData, imageFile) => {

  let uploadedImage = null;

  try {

    const {
      name,
      description,
      category_id,
      price,
      quantity_in_stock,
      discount_percentage = 0,
    } = productData;

    const category = await Category.findByPk(category_id);

    if (!category) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Category not found."
      );
    }

    const existingProduct = await Product.findOne({
      where: {
        name,
        category_id,
      },
    });

    if (existingProduct) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "A product with this name already exists in this category."
      );
    }

    uploadedImage = await uploadToCloudinary(imageFile);

    const slug = `${slugify(name, {
      lower: true,
      strict: true,
    })}-${randomUUID().slice(0, 8)}`;

    const product = await Product.create({
      name,
      slug,
      description,
      category_id,
      price,
      quantity_in_stock,
      discount_percentage,
      image_url: uploadedImage.image_url,
      image_public_id: uploadedImage.public_id,
    });

    const createdProduct = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });

    return {
      success: true,
      message: "Product created successfully.",
      data: {
        ...createdProduct.toJSON(),
        discounted_price:
          Number(createdProduct.price) *
          (1 - Number(createdProduct.discount_percentage) / 100),
      },
    };

  } catch (error) {

    if (uploadedImage?.public_id) {
      await deleteFromCloudinary(uploadedImage.public_id);
    }

    throw error;
  }
};


export const getAllProducts = async() => {
    return await Product.findAll();
    
};

export const getProductById = async() => {
    const product = await Product.findByPk(id);

    if (!product) {
        throw new Error("Product not found.");
    };
  return product;
};

export const updateProductById = async() => {
    
  // Fields users are allowed to update
  const allowedFields = [
    "name",
    "description",
    "discount_percentage",
    "img_url",
    "catgory_id"
    
  ];

  

  // Checks that at least one valid field was sent
  const receivedFields = Object.keys(body);

  const hasValidUpdate = receivedFields.some(field =>
    allowedFields.includes(field)
  );

  if (!hasValidUpdate) {
    throw new Error("Please provide at least one valid field to update.");
  }

  // Find project
  const project = await Project.findByPk(id);

  if (!project) {
    throw new Error("Project not found.");
  }

  
  const {
    title,
    description,
    status,
    startDate,
    endDate,
  } = body;

  // Check title uniqueness
  if (title) {

    const existingProject = await Project.findOne({
      where: {
        title,
      },
    });

    if (
      existingProject &&
      existingProject.id !== project.id
    ) {
      throw new Error("Project title already exists.");
    }
  }

  
  const updatedData = {

    title: title ?? project.title,
    description: description ?? project.description,
    status: status ?? project.status,
    startDate: startDate ?? project.startDate,
    endDate: endDate ?? project.endDate,

  };

  // Validate dates
  const start = new Date(updatedData.startDate);
  const end = new Date(updatedData.endDate);

  start.setHours(0,0,0,0);
  end.setHours(0,0,0,0);

  if (end < start) {
    throw new Error(
      "End date cannot be before the start date."
    );
  }

  // Update database
  await project.update(updatedData);

  return project;



};

export const deleteProjectById = async() => {

};