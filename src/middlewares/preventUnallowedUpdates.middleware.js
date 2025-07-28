const preventUnallowedUpdates = (req, res, next) => {
  const unAllowedUpdateProperties = ["_id", "email"];
  const { body } = req;
  const isContainUnallowedProperties = !Object.keys(body).every(
    (property) => !unAllowedUpdateProperties.includes(property)
  );
  if (isContainUnallowedProperties) {
    res.status(400).send("Email and _id can't be modified");
  } else {
    next();
  }
};

module.exports = preventUnallowedUpdates;
