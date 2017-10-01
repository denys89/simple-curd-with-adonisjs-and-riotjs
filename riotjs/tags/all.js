riot.tag2('article-apps', '<button type="button" class="btn btn-outline-primary" id="article-add" style="margin-bottom: 20px; " onclick="{addArticle}">New Article</button> <form id="article-form" style="display: none;"> <div class="form-group"> <label for="Title">Title</label> <input type="text" class="form-control" ref="title" id="title" placeholder="Enter Title"> <input type="hidden" ref="id" id="id" value=""> </div> <div class="form-group"> <label for="body">Body</label> <textarea class="form-control" ref="body" id="body" rows="3"></textarea> </div> <div class="form-group"> <label for="author">Author</label> <input type="text" class="form-control" ref="author" id="author" placeholder="Enter Author"> </div> <button class="btn btn-primary" onclick="{saveArticle}">Save</button> <button class="btn btn-default" onclick="{cancelArticle}">Cancel</button> </form> <div id="article-list"> <div class="input-group" style="margin-bottom: 20px;"> <input type="text" class="form-control" ref="search" placeholder="Search for..."> <span class="input-group-btn"> <button class="btn btn-secondary" type="button" onclick="{searchArticle}">Go!</button> </span> </div> <div class="table-responsive"> <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0"> <thead> <tr> <th><a href="javascript:void(0)" ref="id" onclick="{orderArticle}">ID</a></th> <th width="20%"><a href="javascript:void(0)" ref="title" onclick="{orderArticle}">Title</a></th> <th width="40%"><a href="javascript:void(0)" ref="body" onclick="{orderArticle}">Body</a></th> <th><a href="javascript:void(0)" ref="author" onclick="{orderArticle}">Author</a></th> <th><a href="javascript:void(0)" ref="date" onclick="{orderArticle}">Create Date</a></th> <th>Options</th> </tr> </thead> <tfoot> <tr> <th><a href="javascript:void(0)" ref="id" onclick="{orderArticle}">ID</a></th> <th width="20%"><a href="javascript:void(0)" ref="title" onclick="{orderArticle}">Title</a></th> <th width="40%"><a href="javascript:void(0)" ref="body" onclick="{orderArticle}">Body</a></th> <th><a href="javascript:void(0)" ref="author" onclick="{orderArticle}">Author</a></th> <th><a href="javascript:void(0)" ref="date" onclick="{orderArticle}">Create Date</a></th> <th>Options</th> </tr> </tfoot> <tbody> <tr each="{a in opts.articles}"> <td>{a.id}</td> <td>{a.title}</td> <td>{a.body}</td> <td>{a.author}</td> <td>{a.created_at}</td> <td> <button type="button" class="btn btn-sm btn-outline-warning" data-id="{a.id}" onclick="{editArticle}">Edit</button> <button type="button" class="btn btn-sm btn-outline-danger" data-id="{a.id}" onclick="{deleteArticle}">Delete</button> </td> </tr> </tbody> </table> <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups"> <div id="paging" class="btn-group mr-2" role="group" aria-label="First group"> <button each="{b in paging}" if="{b > 0}" onclick="{changePage}" class="btn btn-secondary"> {b} </button> </div> </div> </div> </div>', '', '', function(opts) {
		this.paging = [];
		this.currentPage = 0;

		this.on('mount', function(){
			opts.callback(this)
		})

		this.on('data_loader', function(articles){
			opts.articles 		= articles.data
			opts.total_pages 	= articles.totalPage + 1

	    	for(i=1; i < opts.total_pages; i++) {
	    		this.paging[i] = i;
	    	}

			this.update()
		})

		this.changePage = function(page) {
			var page_no = page.item.b
			loadPage(this, page_no)
		}.bind(this)

		this.addArticle = function() {
			openForm()
			clearForm()
		}.bind(this)

		this.cancelArticle = function(e){
			e.preventDefault()
			closeForm()
			clearForm()
		}.bind(this)

		this.editArticle = function(article) {
			axios.get('http://ivosights.dev:3333/articles/'+article.item.a.id)
	          .then(function(response){
	            if (response.status == 200) {
	            	openForm()

					article = response.data
					document.getElementById("title").value = article.data.title;
					document.getElementById("body").value = article.data.body;
					document.getElementById("author").value = article.data.author;
					document.getElementById("id").value = article.data.id;
	            }
	          });
		}.bind(this)

		this.saveArticle = function(e) {
        	e.preventDefault();
        	var self = this
			var id = document.getElementById("id").value
			var title = document.getElementById("title").value
			var body = document.getElementById("body").value
			var author = document.getElementById("author").value

			var check_data = validateForm(title, body, author)
			if (check_data === false) {
				return
			}

        	if (id == "") {
				axios.post('http://ivosights.dev:3333/articles', {
					title: title,
					body: body,
					author: author
				})
		        .then(function(response){
		        	closeForm()
					loadPage(self)
					notif(response.data.message)
					clearForm()
		        });
        	} else {
				axios.put('http://ivosights.dev:3333/articles/'+id, {
					title: title,
					body: body,
					author: author
				})
		        .then(function(response){
		        	closeForm()
					loadPage(self)
					notif(response.data.message)
					clearForm()
		        });
        	}
		}.bind(this)

		this.deleteArticle = function(article){
			var choice = confirm('Are you sure to delete this item?');
			if (choice) {
	        	var self = this
				axios.delete('http://ivosights.dev:3333/articles/'+article.item.a.id)
		          .then(function(response){
		            if (response.status == 200) {
						loadPage(self)
						notif(response.data.message)
		            }
		          });
			}
		}.bind(this)

		this.searchArticle = function(e){
			var search = this.refs.search.value
			loadPage(this, '', search)
			this.refs.search.value = ''
		}.bind(this)

		this.orderArticle = function(order){
			var orderBy = order.target.innerHTML.toLowerCase().replace(/\s/g,'_')
			loadPage(this, '', '', orderBy)
		}.bind(this)

		function clearForm() {
			document.getElementById("title").value = '';
			document.getElementById("body").value = '';
			document.getElementById("author").value = '';
			document.getElementById("id").value = '';
		}

		function openForm() {
			var article_list = document.getElementById('article-list');
			var article_add = document.getElementById('article-add');
			var article_form = document.getElementById('article-form');

			article_list.style.display = 'none';
			article_add.style.display = 'none';
			article_form.style.display = '';
		}

		function closeForm() {
			var article_list = document.getElementById('article-list');
			var article_add = document.getElementById('article-add');
			var article_form = document.getElementById('article-form');

			article_list.style.display = '';
			article_add.style.display = '';
			article_form.style.display = 'none';
		}

		function notif(message, type=true) {
		    var snackbar = document.getElementById("snackbar")
		    snackbar.className = "show";
		    snackbar.innerHTML = message;
		    if (type == 'error') {
		    	snackbar.style.backgroundColor = "#ff5454";
		    }
		    setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);
		}

		function validateForm(title, body, author){
			if (title=="") {
				notif('Title is required', 'error')
				return false
			}
			if (body=="") {
				notif('Body is required', 'error')
				return false
			}
			if (author=="") {
				notif('Author is required', 'error')
				return false
			}
			return true
		}
});