'use strict'

const Article = use('App/Model/Article')
const Validator = use('Validator')

class ArticlesController {

  * index(request, response) {
    var page = request.all().page
    var search = request.all().search
    var order = request.all().order
    var orderBy = request.all().order_by
    var limit = 10
    var offset

    if (page == null) {
      page = 1
    }

    if (search == null) {
      search = ''
    }

    if (order == null) {
      order = 'desc'
    }

    if (orderBy == null) {
      orderBy = 'id'
    }

    offset = page * limit - limit

    const count_article = yield Article
                          .query()
                          .where('title', 'LIKE', '%'+search+'%').count('id as total').first()

    const articles = yield Article
                          .query()
                          .where('title', 'LIKE', '%'+search+'%')
                          .offset(offset)
                          .limit(limit)
                          .orderBy(orderBy, order)
                          .fetch()
    var total_page = Math.round(count_article.total/limit)
    response.json({'status':'success', 'totalPage':total_page, 'data':articles, 'offset':offset, 'limit':limit})
  }

  * store(request, response) {
    const article = new Article()
    article.title = request.input('title')
    article.body  = request.input('body')
    article.author = request.input('author')

    const validation = yield Validator.validate(request.all(), Article.rules)  

    if (validation.fails()) { 
      const messages = validation.messages()
      const error = messages[0].field + ' is required';
      response.json({'status':'failed', 'message':error})
      return
    }

    const result = yield article.save()
    if (result) {
      response.json({'status':'success', 'message':'Create new article successfully'})
    } else {
      response.json({'status':'failed', 'message':'Create new article failed'})
    }
  }

  * show(request, response) {
    const articleId = request.param('id')
    const article = yield Article.find(articleId)
    if (article) {
      response.json({'status':'success', 'data':article})
    } else{
      response.json({'status':'failed', 'message':'Article not found'})
    }
  }

  * update(request, response) {
    const articleId = request.param('id')
    const article = yield Article.find(articleId)
    if (article) {
      article.fill({
        title: request.input('title'),
        body: request.input('body'), 
        author:request.input('author')})

      const result = yield article.save()
      if (result) {
        response.json({'status':'success', 'message':'Update article successfully'})
      } else {
        response.json({'status':'failed', 'message':'Update article failed'})
      }
    } else {
      response.json({'status':'failed', 'message':'Article not found'})
    }
  }

  * destroy(request, response) {
    const articleId = request.param('id')
    const article = yield Article.find(articleId)
    if (article) {
      const result = yield article.delete()
      if (result) {
        response.json({'status':'success', 'message':'Delete article successfully'})
      } else {
        response.json({'status':'failed', 'message':'Delete article failed'})
      }
    } else {
      response.json({'status':'failed', 'message':'Article not found'})
    }
  }

}

module.exports = ArticlesController
