const AttendanceContract = artifacts.require("AttendanceContract");

module.exports = function (deployer) {
  deployer.deploy(AttendanceContract);
};
