const observableModule = require("tns-core-modules/data/observable");
const Observable = require("tns-core-modules/data/observable").Observable;

const SelectedPageService = require("../shared/selected-page-service");
const AuthenticatedStateService = require("../shared/Authenticated-state-service");
const Percentages=[20,10];

function QueuetimesParkViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("QueuetimesPark");

    const viewModel = observableModule.fromObject({
        /* Add your view model properties here */
	Authenticated: false,
	user: false
    });

    SelectedPageService.getInstance().selectedPage$.subscribe((selectedPage) => { viewModel.selectedPage = selectedPage; });
    AuthenticatedStateService.getInstance().AuthenticatedState$.subscribe((user) => {
        viewModel.user = user;
    });
    return viewModel;
}

module.exports = QueuetimesParkViewModel;