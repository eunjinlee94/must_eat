const { pool } = require("../../config/database");

exports.selectRestaurants = async function(connection, category) {

const selectAllRestaurantsQuery = `SELECT title, address, category, videoUrl FROM Restaurants where status = 'A';`;
const selectCategorizedRestaurantsQuery = `SELECT title, address, category, videoUrl FROM Restaurants where status = 'A' and category = ?`;

const Params = [category];

const Query = category ? selectCategorizedRestaurantsQuery : selectAllRestaurantsQuery;

const rows = await connection.query(Query, Params);

return rows;
};





exports.selectStudents = async function(connection, studentIdx) {
  const Query = `select * from Students where studentIdx = ?;`;
  const Params = [studentIdx];

  const rows = await connection.query(Query, Params);

  return rows;
  
  // 삼항연산자로 쿼리 불러오기 
  // let Query = studentName ? selectStudentByNameQuery : selectAllStudentQuery;

  // if(!studentName) {
  //   Query = selectAllStudentQuery;
  // } else {
  //   Query = selectStudentByNameQuery;
  // }


};

exports.isValidStudentIdx = async function (connection, studentIdx) {
  const Query = `SELECT * FROM Students where studentIdx = ?;`;
  const Params = [studentIdx];

  const rows = await connection.query(Query, Params);

  if(rows < 1) {
    return false
  }
  return true;
};



exports.insertStudents = async function (
  connection,
  studentName,
  major,
  birth,
  address
  ) {
  const Query = `insert into Students(studentName, major, birth, address) values (?,?,?,?);`;
  const Params = [studentName, major, birth, address];

  const rows = await connection.query(Query, Params);

  return rows;
};


exports.exampleDao = async function (connection, params) {
  const Query = `SELECT * FROM Students;`;
  const Params = [];

  const rows = await connection.query(Query, Params);

  return rows;
};
