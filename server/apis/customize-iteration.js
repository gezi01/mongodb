
const mongodb = require('../../mongodb/index.js');
const axios = require('axios');
const { param } = require('express/lib/request');
const bodyParser = require('body-parser').json();


// const bodyParser = require('body-parser');

module.exports = function(app){

    // 更新自定义迭代信息
    app.post('/iteration/custom/update',bodyParser, async function(request, response){
		// TODO 在这里连接数据库，开发业务逻辑等

        let result = {
            status:200,
            info:""
        };
    
        if(!request.body.name){
            result.status = 400;
            result.info = '自定义不能为空'
            return response.status(400).send(result);
        }
        if(!request.body.password){
            result.status = 400;
            result.info = '描述不能为空'
            return response.status(400).send(result);
        }


        let params = {
            name:request.body.name,
            password:request.body.password
        }
        const { db, connect } = await mongodb('user'); // login-集合-表的名字
        const searchInfo = await db.findOne({name:params.name});
        if(searchInfo){
            await db.updateOne({name:params.name},{$set: params}, {multi: true})
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