const app = require('@nativescript/core/application')

const SignoutViewModel = require('./signout-view-model')
const frameModule = require('@nativescript/core/ui/frame')

const firebaseApp = require('@nativescript/firebase/app')
firebaseApp.initializeApp()
const firebase = require('@nativescript/firebase').firebase

const config = require('../shared/config')

function onNavigatingTo (args) {
  const page = args.object
  page.bindingContext = new SignoutViewModel()

  page.getViewById('pageTitle').text = `Sign out of ${config('appName')}`
}

function onDrawerButtonTap (args) {
  const sideDrawer = Application.getRootView()
  sideDrawer.showDrawer()
}
function SignOut (args) {
  console.log('Sign out called')
  firebase.logout()
  firebaseApp
    .auth()
    .signOut()
    .then(function () {
      console.log('firebaseApp signOut')

      AuthenticatedPageState()
      setTimeout(function () {
        frameModule.Frame.topmost().navigate({
          moduleName: 'signoutExit/signoutExit-page',
          transition: {
            name: 'fade'
          }
        })
      }, 125)
    })
    .catch(function (error) {
      if (error) {
        console.log('Error signing out')
        console.log(error)
      }
    })
}

exports.onNavigatingTo = onNavigatingTo
exports.onDrawerButtonTap = onDrawerButtonTap
exports.SignOut = SignOut
exports.pageJump = require('../shared/pageJump')
var AuthenticatedPageState = require('../shared/AuthenticatedPageState')
exports.cmsPage = require('../shared/cmsPage')
exports.AuthenticatedPageState = AuthenticatedPageState
