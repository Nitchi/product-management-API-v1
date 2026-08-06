import ApiError from "../utils/ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          "Authentication required."
        )
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          "You do not have permission to perform this action."
        )
      );
    }

    next();
  };
};

export default authorize;