


router.post(
  "/",
  authMiddleware,
  authorize(ROLES.ADMIN),
  upload.single("image"),
  createProductValidator,
  validationMiddleware,
  createProduct
);