
const mongodb = require('../../mongodb/index.js');
const axios = require('axios');

const guid = require('../../untils/uuid.js');

module.exports = function(app){

     // 更新自定义迭代信息
     app.post('/iteration/add', async function(request, response){
		// TODO 在这里连接数据库，开发业务逻辑等
        const { db, connect } = await mongodb('student'); // login-集合-表的名字
        let params = {
            test:[]
        }
        await db.insertOne(params);

        connect.close();

        response.status(200)
        let data = {
            status:200,
            info:'更新成功',
        }
        response.send(data)
	});

    // 更新自定义迭代信息
    app.post('/iteration/update', async function(request, response){
		// TODO 在这里连接数据库，开发业务逻辑等
        let params = {
            name:request.body.name,
            password:request.body.password,
            uuid: request.body.uuid || guid(),
        }
        
        const { db, connect } = await mongodb('student'); // login-集合-表的名字
        var ObjectID = require('mongodb').ObjectId;

        const searchInfo = await db.findOne({_id:new ObjectID(request.body.id),'test.uuid':params.uuid})

        console.log("searchInfo",searchInfo)

        if(searchInfo){
            // 更新
            await db.updateMany(searchInfo,{$set:{'test.$[element]':params}},{ arrayFilters: [ { "element.uuid": params.uuid } ] })
        } else {
            // 新增
            await db.updateOne({_id:new ObjectID(request.body.id)},{$push:{test:params}})
        }

        connect.close();

        response.status(200)
        let data = {
            status:200,
            info:'更新成功',
        }
        response.send(data)
	});

    app.post('/iteration/del', async function(request, response){
		// TODO 在这里连接数据库，开发业务逻辑等
        if(!request.body.id){
            return response.status(400).send('id不能为空');
        }
        let params = {
            id:request.body.id,
            uuid:request.body.uuid
        }
        const { db, connect } = await mongodb('student'); // user-集合-表的名字
        var ObjectID = require('mongodb').ObjectId;
        const searchInfo = await db.findOne({_id:new ObjectID(request.body.id)})

       if(searchInfo){
        await db.updateOne({_id:new ObjectID(request.body.id)},{$pull: {"test": { "uuid" : params.uuid}}})
       }

        connect.close();
        let data = {
            status:200,
            info:'删除成功',
        }
        response.send(data)
	});

    app.post('/iteration/search', async function(request, response){
		// TODO 在这里连接数据库，开发业务逻辑等
        const { db, connect } = await mongodb('student'); // login-集合-表的名字
        const data = await db.find().toArray();
        connect.close();
        response.send(data)
	});
};