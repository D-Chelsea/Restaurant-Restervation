/**
 * List handler for reservation resources
 */

 const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
 const service = require("./reservations.service")


 async function list(req, res, next) {
  res.json({ data: await service.list() });
}
 //return 400 if a field that is not a valid field is included in the request body
 function hasValidFields(req, res, next) {
  const { data = {} } = req.body;
  const validFields = new Set([
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
    "status",
    "created_at",
    "updated_at",
    "reservation_id"
  ]);

  const invalidFields = Object.keys(data).filter(
    field => !validFields.has(field)
  );

  if (invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  next();
};

async function create(req, res, next) {
  const data = await service.create(req.body.data)
  
  res.status(201).json({ data })  
};

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasValidFields, asyncErrorBoundary(create)]
};
