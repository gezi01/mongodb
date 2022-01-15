
const mongodb = require('../../mongodb/index.js');
const axios = require('axios');

const guid = require('../../untils/uuid.js');

module.exports = function(app){

    // 更新自定义迭代信息
    app.post('/iteration/custom/update', async function(request, response){
		// TODO 在这里连接数据库，开发业务逻辑等
        let params = {
            name:request.body.name,
            password:request.body.password,
        }
        
        const { db, connect } = await mongodb('user'); // login-集合-表的名字
        var ObjectID = require('mongodb').ObjectId;

        const searchInfo = await db.findOne({_id:new ObjectID(request.body._id)})
        if(searchInfo){
            await db.updateOne({_id:new ObjectID(request.body._id)},{$set: params}, {multi: true})

        } else {
            await db.insertOne(params)
        }

        connect.close();

        response.status(200)
        let data = {
            status:200,
            info:'更新成功',
            data:{
                name:request.body.name,
                password:request.body.password,
            }
        }
        console.log()
        response.send(data)
	});

    app.post('/iteration/custom/del', async function(request, response){
		// TODO 在这里连接数据库，开发业务逻辑等
        if(!request.body.id){
            return response.status(400).send('id不能为空');
        }
        let params = {
            id:request.body.id
        }
        const { db, connect } = await mongodb('user'); // user-集合-表的名字

        var ObjectID = require('mongodb').ObjectId;
        await db.deleteOne({_id:new ObjectID(params.id)})

        connect.close();
        let data = {
            status:200,
            info:'删除成功',
        }
        response.send(data)
	});

    app.post('/iteration/custom/search', async function(request, response){
		// TODO 在这里连接数据库，开发业务逻辑等
        const { db, connect } = await mongodb('user'); // login-集合-表的名字
        const data = await db.find().toArray();
        connect.close();
        response.send(data)
	});
};