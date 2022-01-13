var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://192.168.30.146:27017"; // 数据库地址
var name = "gezi"; // 数据库名字

/**
 * 数据库操作
 * @param {string} collectionName 要操作的表名称
 * @returns {Promise} 操作的对象
 */
 const mongodb = async (collectionName) => {
    let connect = await MongoClient.connect(url); 
    let db = connect.db(name).collection(collectionName);
    return { connect, db };
  };
  
  module.exports = mongodb;