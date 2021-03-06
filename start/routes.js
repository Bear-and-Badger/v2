'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/guides/routing
|
*/

const Route = use('Route')

Route.on('/404').render('errors.404').as('404')

/**
 * User profile pages
 */
Route.on('/login').render('user.login')
Route.on('/signup').render('user.signup')
Route.post('/signup', 'UserController.signup').as('signup')
Route.post('/login', 'UserController.login').as('login')
Route.get('/profile/:id/:page?', 'UserController.profile').as('profile')

Route.get('/', 'ThreadController.index').as('home')
Route.get('/search/:id/:page?', 'SearchController.search').as('search')

/**
 * Public Threads / Categories
 */
Route.get('/discussions/:page?', 'ThreadController.index').as('discussions')
Route.get('/discussion/:id/:page?', 'ThreadController.view').as('discussion')
Route.get('/category/:id/:page?', 'ThreadController.category').as('category')

/**
 * Creating / editing posts & threads
 */
Route.group('authorised', function () {
  Route.get('/new/post/:thread', 'PostController.new').as('new_post')
  Route.get('/edit/post/:id', 'PostController.edit').as('edit_post')
  Route.post('/save/post', 'PostController.save')

  Route.get('/new/discussion', 'ThreadController.new').as('new_discussion')
  Route.get('/edit/discussion/:id', 'ThreadController.edit').as('edit_discussion')
  Route.post('/save/discussion', 'ThreadController.save')

  Route.get('/add/sticky/:id', 'ThreadController.sticky').as('sticky')
  Route.get('/remove/sticky/:id', 'ThreadController.removeSticky').as('remove_sticky')

  Route.get('/add/bookmark/:id', 'ThreadController.bookmark').as('bookmark')
  Route.get('/remove/bookmark/:id', 'ThreadController.removeBookmark').as('remove_bookmark')
}).middleware('checkUser')

/**
 * Creating / editing profile & inbox
 */
Route.group('profile', function () {
  Route.get('/logout', 'UserController.logout').as('logout')
  Route.get('/messages', 'ChatController.inbox').as('inbox')
  Route.get('/messages/new/:recipient?', 'ChatController.create').as('new_chat')
  Route.post('/messages/new', 'ChatController.store').as('save_chat')
  Route.post('/messages/reply', 'ChatController.reply').as('reply')
  Route.get('/messages/view/:id', 'ChatController.chat').as('chat')
}).middleware('checkUser')

/**
 * Admin views
 */
Route.group('admin', function () {
  Route.get('/admin/roles', 'Admin/RolesController.index').as('admin_roles')
  Route.get('/admin/categories', 'AdminController.categories').as('admin_categories')
  Route.get('/admin/categories/new', 'CategoryController.edit').as('new_category')
  Route.get('/admin/categories/edit/:id', 'CategoryController.edit').as('edit_category')
  Route.post('/admin/categories/save', 'CategoryController.save')

  Route.get('/admin/threads/:page?', 'AdminController.threads').as('admin_threads')

  Route.get('/admin/users/:page?', 'Admin/UsersController.index').as('admin_users')
  Route.get('/admin/user/delete/:id', 'Admin/UsersController.delete').as('delete_user')
}).middleware('checkUser')
