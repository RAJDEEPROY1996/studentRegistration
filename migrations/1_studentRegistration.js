var StudentRegistration = artifacts.require("studentRegistration");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(StudentRegistration);
};
