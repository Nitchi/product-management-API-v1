import Product from "../models/Product";
import Role from "../models/Role"; 


export const createProduct = async(data, user) =>{
    const product = await Product.create({
        name: data.name,
        description: data.description,
        price: data.price,
        discount_percentage: discount_percentage,
        quantity_in_stock: data.quantity_in_stock,
        img_url: data.img_url, 
    });
    return product
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