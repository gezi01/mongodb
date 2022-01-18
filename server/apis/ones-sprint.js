   /**
     * 更新自定义迭代信息
     * @param {String} sprintId 迭代id
     * @param {String} byYearMonth 日期
     * @param {Array}  sprintCustomKeysParams 自定义迭代数组
     * @param {String} sprintCustomKeysParams[].id 自定义迭代id
     * @param {String} sprintCustomKeysParams[].key  自定义迭代名称
     * @param {String} sprintCustomKeysParams[].value 自定义迭代值
     */
    app.post('/sprint/custom/update',async function (request,response) { 

      let sprintCustomKeysParams = {
         id: request.body.id, // 自定义迭代id
         key:request.body.key, // 自定义迭代名称
         value:request.body.value, // 自定义迭代值
      }

      let byYearMonth = request.body.byYearMonth; // 日期
      let sprintId = request.body.sprintId; // 迭代id

      if(!sprintId){
        throw new CustomerError('迭代标识不能为空')
      }

      const { db, connect } = await mongodb(); // 连接数据库
      const sprintDB = await db.collection(config.dataSheet.sprint);// additional-sprint-detail迭代集合

      let sprintDetail = await sprintDB.findOne({'sprintId':sprintId});

      // 判断 迭代id 是否存在
      if(!sprintDetail) {
        // 不存在：在sprint-list查询迭代是否存在，存在就在additional-sprint-detail表里插入新数据，不存在报错
          const sprintListDB = await db.collection(config.dataSheet.sprint_list + '_' + byYearMonth);// sprint-list迭代集合
          
          const sprintDetails = await sprintListDB.findOne({'sprintId':sprintId});

          if(!sprintDetails){
            throw new CustomerError('迭代标识不存在');
          } 
          await sprintDB.insertOne({'sprintId':sprintId,'sprintCustomKeys':[]}); // 插入
      } 

      // 查询自定义迭代信息
      const customSprintInfo = await sprintDB.findOne({'sprintId':sprintId,'sprintCustomKeys.id':sprintCustomKeysParams.id}); // 查询自定义迭代信息


      if(!customSprintInfo && sprintCustomKeysParams.id){
        throw new CustomerError('自定义迭代标识不存在');
      }

      // 判断自定义迭代是否存在表里
      if(customSprintInfo) {
        // 存在： 更新
          await sprintDB.updateMany(customSprintInfo,{$set:{'sprintCustomKeys.$[element]':sprintCustomKeysParams}},{ arrayFilters: [ { "element.id": sprintCustomKeysParams.id } ] });

      } else {
          // 不存在：新增
          sprintCustomKeysParams.id = uuid(); // 自动生成自定义迭代id
          await sprintDB.updateOne({'sprintId':sprintId},{$push:{sprintCustomKeys:sprintCustomKeysParams}}); // 新增
      }

      connect.close(); // 关闭数据库

      // 发送数据
      response.send(new Result({
        data:sprintCustomKeysParams
      }));

    })

    /**
     * 删除自定义迭代
     * @param {String} sprintId 迭代标识
     * @param {String} id 自定义迭代标识
     */
     app.post('/sprint/custom/del', async function(request,response){
        let sprintId = request.query.sprintId;
        let id = request.query.id;

        if(!sprintId){
          throw new CustomerError('迭代标识不能为空');
        }
        if(!id){
          throw new CustomerError('自定义标识不能为空');
        }

        const { db, connect } = await mongodb(); // 连接数据库
        const sprintDB = await db.collection(config.dataSheet.sprint);// additional-sprint-detail迭代集合

        let sprintDetail = await sprintDB.findOne({'sprintId':sprintId}); // 查询迭代信息

        if(!sprintDetail){
          throw new CustomerError('迭代标识不存在');
        }

        // 查询自定义迭代信息
        const customSprintInfo = await sprintDB.findOne({'sprintId':sprintId,'sprintCustomKeys.id':id}); // 查询自定义迭代信息

        if(!customSprintInfo){
          throw new CustomerError('自定义迭代标识不存在');
        }

        await sprintDB.updateOne({'sprintId':sprintId},{$pull: {"sprintCustomKeys": { "id": id}}}); // 删除自定义迭代信息

        connect.close(); // 关闭数据库

        // 发送数据
        response.send(new Result({
          message:"删除成功",
          data:{
            sprintId:sprintId,
            id:id
          }
        }));
     })