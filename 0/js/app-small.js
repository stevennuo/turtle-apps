function AppListCtrl($scope, $timeout, $http) {

	function arraysEqual(a, b) {
		if (a === b) return true;
		if (a == null || b == null) return false;
		if (a.length != b.length) return false;
		for (var i = 0; i < a.length; ++i) {
			if (a[i].id !== b[i].id || a[i].version_code !== b[i].version_code) return false;
		}
		return true;
	}

	$scope.refreshApps = function () {
		$http.get('/apps?launchable=1').success(function (data, status, headers, config) {
			if (200 != status) {
				alert("无法连接到服务器，请打开阳光芸芸检查服务状态。");
				return;
			}

			if (!arraysEqual(data, $scope.apps)) {
				$scope.version = "N/A";
				for (var i = 0; i < data.length; i++) {
					var app = data[i];
					app.home_url = app.url + app.home;
					if (app.id === "0") {
						$scope.version = app.version_code;
					}
				}
				$scope.apps = data;
				console.log("app updated");
			}
			$scope.lastSuccess = new Date().getTime();
		});
	}
	// refresh app list
	cancelRefresh = $timeout(function refreshApp() {
		$scope.refreshApps();
		cancelRefresh = $timeout(refreshApp, 15000);
	}, 0);
	$scope.$on('$destroy', function (e) {
		$timeout.cancel(cancelRefresh);
	});
	$scope.totalApps = (typeof apps === "undefined") ? 0 : apps.length;
}