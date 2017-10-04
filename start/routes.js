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

/**
 * Stateless pages - just render the template
 */
Route.on('/').render('welcome')
Route.on('/login').render('user.login')
Route.on('/signup').render('user.signup')

/**
 * User profile pages
 */
Route.post('/signup', 'UserController.signup').as('signup')
Route.post('/login', 'UserController.login').as('login')
Route.get('/logout', 'UserController.logout').middleware('checkUser').as('logout')
Route.get('/profile', 'UserController.profile').middleware('checkUser').as('profile')

/**
 * Post content
 */
Route.get('/categories', 'CategoryController.index').as('categories')
Route.get('/category/:id', 'CategoryController.view').as('category')

Route.get('/discussions/:page?', 'ThreadController.index').as('discussions')
Route.get('/discussion/:id/:page?', 'ThreadController.view').as('discussion')

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
