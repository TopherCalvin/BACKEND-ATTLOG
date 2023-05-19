module.exports = (sequelize, Sequelize) => {
  const attendancelog = sequelize.define("Attendance_Logs", {
    clock_in: Sequelize.STRING,
    clock_out: Sequelize.STRING,
    deleted: Sequelize.BOOLEAN,
  });
  return attendancelog;
};
