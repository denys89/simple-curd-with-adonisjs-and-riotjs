'use strict'

const Schema = use('Schema')

class ArticlesTableSchema extends Schema {

  up () {
    this.create('articles', (table) => {
      table.increments()
      table.string('title')
      table.longText('body')
      table.string('author')
      table.softDeletes()
      table.timestamps()
    })
  }

  down () {
    this.drop('articles')
  }

}

module.exports = ArticlesTableSchema
