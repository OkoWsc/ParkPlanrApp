const {
  Application,
  Color
} = require('@nativescript/core');

const RidecountCountViewModel = require("./ridecountCount-view-model");
const fromObject = require("@nativescript/core/data/observable").fromObject;
const frameModule = require("@nativescript/core/ui/frame");

const firebaseApp = require("@nativescript/firebase/app");
firebaseApp.initializeApp();

const FeedbackPlugin = require("nativescript-feedback");
const feedback = new FeedbackPlugin.Feedback();

const moment = require("moment");

function onNavigatingTo (args) {
  const page = args.object;
  page.bindingContext = new RidecountCountViewModel();

  const tripId = page.navigationContext.tripId;
  const parkId = page.navigationContext.parkId;
  const userId = page.bindingContext.user.uid;

  console.log(`Loading trip: ${tripId} to: ${parkId} for user: ${userId}`);

  const getPromises = [
    firebaseApp
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("ridecount")
      .doc(tripId)
      .get(),
    firebaseApp
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("ridecount")
      .doc(tripId)
      .collection("rides")
      .get(),
    firebaseApp.firestore().collection("parks").doc(parkId).get(),
    firebaseApp
      .firestore()
      .collection("parks")
      .doc(parkId)
      .collection("rides")
      .where("active", "==", true)
      .orderBy("name.name", "asc")
      .get()
  ];

  Promise.all(getPromises)
    .then((promiseResults) => {
      const rideCounts = {};
      const pageContext = {
        rides: []
      };
      promiseResults.forEach((promiseResult) => {
        if (promiseResult.id) {
          console.log("Document");
          switch (promiseResult.ref.path.split("/")[0]) {
            case "parks":
              console.log("Park doc");
              var park = promiseResult.data();
              park.id = promiseResult.id;
              pageContext.park = park;
              break;
            case "users":
              console.log("Trip doc");
              var trip = promiseResult.data();
              trip.id = promiseResult.id;
              trip.dateHuman = moment(trip.date).format(
                "dddd DD/MM/YYYY"
              );
              pageContext.trip = trip;
              break;
            default:
              console.log("Unknown first fragment");
              console.log(promiseResult.ref.path);
          }
        } else {
          console.log("Collection");
          promiseResult.forEach((doc) => {
            switch (doc.ref.path.split("/")[0]) {
              case "parks":
                console.log("Ride doc");
                var ride = doc.data();
                ride.id = doc.id;
                if (ride.logo) {
                  ride.hasLogo = true;
                } else {
                  ride.hasLogo = false;
                }
                ride.count = 0;
                pageContext.rides.push(ride);
                break;
              case "users":
                console.log("Ride count doc");
                console.log(doc.data());
                var rideId = doc.data().ride;
                var count = doc.data().count;
                if (rideCounts[rideId]) {
                  rideCounts[rideId] =
                                        rideCounts[rideId] + count;
                } else {
                  rideCounts[rideId] = count;
                }
                break;
              default:
                console.log("Unknown first fragment");
                console.log(doc.ref.path);
            }
          });
        }
      });
      pageContext.rides.forEach((ride, index) => {
        if (rideCounts[ride.id]) {
          pageContext.rides[index].count = rideCounts[ride.id];
        }
      });
      pageContext.pageTitle = `${pageContext.park.name.name} ${pageContext.trip.dateHuman}`;
      console.log(pageContext);
      const vm = fromObject(pageContext);
      page.bindingContext = vm;
    })
    .catch((error) => {
      console.log("Ride count get error");
      console.log(error);

      frameModule.Frame.topmost().navigate({
        moduleName: "home/home-page",
        transition: {
          name: "fade"
        }
      });
      setTimeout(() => {
        feedback.error({
          title: "Unable to load ride count",
          message: `Please check your internet connection and try again ${JSON.stringify(
                        error
                    )}`,
          titleColor: new Color("black")
        });
      }, 125);
    });
}

function onLoaded (args) {
  AuthenticatedPageState();
}

function onDrawerButtonTap (args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}

function rideSelected (args) {
  const tripId = args.view.tripId;
  const rideId = args.view.rideId;
  const parkId = args.view.parkId;
  console.log(
        `Switching to ride count add/edit/delete for ride: ${rideId} on trip: ${tripId} to park: ${parkId}`
  );
  frameModule.Frame.topmost().navigate({
    moduleName: "ridecountRide/ridecountRide-page",
    backstackVisible: false,
    transition: {
      name: "fade"
    },
    context: {
      tripId: tripId,
      parkId: parkId,
      rideId: rideId
    }
  });
}
exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump");
var AuthenticatedPageState = require("../shared/AuthenticatedPageState");
exports.cmsPage = require("../shared/cmsPage");
exports.AuthenticatedPageState = AuthenticatedPageState;
exports.onLoaded = onLoaded;
exports.rideSelected = rideSelected;
