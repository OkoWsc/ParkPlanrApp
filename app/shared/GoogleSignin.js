const app = require("tns-core-modules/application");

const fromObject = require("tns-core-modules/data/observable").fromObject;

const firebase = require("nativescript-plugin-firebase");

var FeedbackPlugin = require("nativescript-feedback");
var feedback = new FeedbackPlugin.Feedback();

const config = require("../shared/config");

function SignInGoogle(args) {
    console.log("Sign in with google called");

    var frameModule = require("tns-core-modules/ui/frame");
    var page = frameModule.topmost().currentPage;

    var FeedbackPlugin = require("nativescript-feedback");
    var feedback = new FeedbackPlugin.Feedback();
    var color = require("color");

    console.log("Attempting sign in with google");

    const options = {
        message: "Signing in with google",
        details: "Just a sec",
        //  progress: 0.65,
        margin: 10,
        dimBackground: true,
        color: "#4B9ED6", // color of indicator and labels
        // background box around indicator
        // hideBezel will override this if true
        // backgroundColor: 'yellow',
        //  userInteractionEnabled: false, // default true. Set false so that the touches will fall through it.
        hideBezel: true, // default false, can hide the surrounding bezel
        //  mode: Mode.AnnularDeterminate, // see options below
        //  android: {
        //    view: android.view.View, // Target view to show on top of (Defaults to entire window)
        //    cancelable: true,
        //    cancelListener: function(dialog) {
        //      console.log('Loading cancelled');
        //    }
        //  },
        //  ios: {
        //    view: UIView // Target view to show on top of (Defaults to entire window)
        //  }
    };

    firebase
        .login({
            type: firebase.LoginType.GOOGLE,
        })
        .then(function (result) {
            console.log(result);

            setTimeout(function () {
                frameModule.topmost().navigate({
                    moduleName: "home/home-page",
                    transition: {
                        name: "fade",
                    },
                });

                if (result.displayName) {
                    title = `Welcome ${result.displayName} to ${config(
                        "appName"
                    )}`;
                } else {
                    title = `Welcome to ${config("appName")}`;
                }
                feedback.success({
                    title: title,
                    titleColor: new color.Color("black"),
                });
            }, 125);
        })
        .catch(function (error) {
            console.log("Error signing in with google");
            console.log(error);

            UserErrorMessage = "Failed signing in with Google";
            // TODO: Remove me
            UserErrorMessage = JSON.stringify(error);

            setTimeout(function () {
                feedback.error({
                    title: UserErrorMessage,
                    titleColor: new color.Color("black"),
                });
            }, 25);
        });
}

module.exports = SignInGoogle;
