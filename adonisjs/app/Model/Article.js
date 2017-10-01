'use strict'

const Lucid = use('Lucid')

class Article extends Lucid {
  static get deleteTimestamp () {
    return null
  }

  static get rules () { 
    return {
      title: 'required',
      body: 'required',
      author: 'required',
    }
  }
}

module.exports = Article
