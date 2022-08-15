const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");
const jwt = require("jsonwebtoken");
const secret = require("../../config/secret");
const indexDao = require("../dao/indexDao");

// 식당 조회 
exports.readRestaurants = async function (req, res) {
  const { category } = req.query;

  // 카테고리 값이 넘어왔다면, 값이 유효한지 체크
  if(category) {
    const validCategroy = [

      "한식",
      "중식",
      "일식",
      "분식",
      "양식",
      "구이",
      "회/초밥",
      "기타"
    ];
    
    if (!validCategroy.includes(category)) {
      return res.send({
        isSuccess: false,
        code: 400,
        message: "유효한 카테고리가 아닙니다.",
      });
    }

  }

  try {
    const connection = await pool.getConnection(async (conn) => conn); // pool (객체)
    try {
      const [rows] = await indexDao.selectRestaurants(connection, category); // mysql 접속 

      // 비구조할당 [rows] ex) const[a,b,c] = 1,2,3  : 순서에 따라서 각각에 값이 할당됨 

      return res.send({
        result: rows,
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "식당 목록 요청 성공",
      });
    } catch (err) {
      logger.error(`readRestaurants Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`readRestaurants DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};



// 학생 업데이트
exports.updateStudent = async function (req, res) {
  const {studentName, major, birth, address }= req.body;
  const {studentIdx} =req.params;
  
  if(studentName && typeof studentName !== "string") {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "값을 정확히 입력해주세요.",
    });
  }
  if(major && typeof major !== "string") {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "값을 정확히 입력해주세요.",
    });
  }
  if(address && typeof address !== "string") {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "값을 정확히 입력해주세요.",
    });
  }
  var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
  if ( birth && !regex.test(birth)) {
    return res.send({
    isSuccess: false,
    code: 400, // 요청 실패시 400번대 코드
    message: "날짜 형식을 확인해주세요.",
    });

  }
  
  try {
    const connection = await pool.getConnection(async (conn) => conn); // pool (객체)
    try {
      const isValidStudentIdx = await indexDao.isValidStudentIdx(
        connection,
        studentIdx
        );
      if(!isValidStudentIdx) {
        return res.send({
          isSuccess: false,
          code: 410,
          message:"유효한 학생 인덱스가 아닙니다.",
        });
      }
      const [rows] = await indexDao.updateStudent(
        studentIdx,
        connection, 
        studentName,
        major,
        birth,
        address
        ); 
      return res.send({
        result: rows,
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "학생 수정 성공",
      });
    } catch (err) {
      logger.error(`updateStudents Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`updateStudents DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};



// 학생 생성
exports.createStudent = async function (req, res) {
  
  const {studentName, major, birth, address }= req.body;
  
  // validation 검증
  // studentName, major, address : 문자열
  if (
    typeof studentName !== "string" ||
    typeof major !== "string" ||
    typeof address !== "string"
  ) {
    return res.send({
      isSuccess: false,
      code: 400, // 요청 실패시 400번대 코드
      message: "값을 정확히 입력해주세요.",
    });
  }
  // birth : YYYY-MM-DD 형식검사
  var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
  if (!regex.test(birth)) {
    return res.send({
    isSuccess: false,
    code: 400, // 요청 실패시 400번대 코드
    message: "날짜 형식을 확인해주세요.",
    });
  }

  try {
    const connection = await pool.getConnection(async (conn) => conn); // pool (객체)
    try {
      const [rows] = await indexDao.insertStudents(
        connection, 
        studentName,
        major,
        birth,
        address
        ); 
      return res.send({
        result: rows,
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "학생 생성 성공",
      });
    } catch (err) {
      logger.error(`createStudents Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`createStudents DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};

// 학생 테이블 조회
exports.readStudents = async function(req, res) {
  // 데이터 파싱
  const { studentIdx } = req.params;

  try {
    const connection = await pool.getConnection(async (conn) => conn); // pool (객체)
    try {
      const [rows] = await indexDao.selectStudents(connection, studentIdx); // mysql 접속 
      return res.send({
        result: rows,
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "요청 성공",
      });
    } catch (err) {
      logger.error(`readStudents Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`readStudents DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};

// 예시 코드
exports.example = async function (req, res) {
  try {
    const connection = await pool.getConnection(async (conn) => conn); // pool (객체)
    try {
      const [rows] = await indexDao.exampleDao(connection); // mysql 접속 

      // 비구조할당 [rows] ex) const[a,b,c] = 1,2,3  : 순서에 따라서 각각에 값이 할당됨 

      return res.send({
        result: rows,
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "요청 성공",
      });
    } catch (err) {
      logger.error(`example Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`example DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};
