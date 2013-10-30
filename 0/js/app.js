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

	$scope.lastAppMap = {};
	$scope.refreshApps = function () {
		$http.get('/apps?launchable=1').success(function (data, status, headers, config) {
			var existsApp,
				newApps;
			if (200 != status) {
				alert("无法连接到服务器，请打开阳光芸芸检查服务状态。");
				return;
			}

			if (!arraysEqual(data, $scope.apps)) {
				$scope.news = [];
				$scope.version = "N/A";
				newApps = {};
				for (var i = 0; i < data.length; i++) {
					var app = data[i];
					app.home_url = app.url + app.home;
					existsApp = $scope.lastAppMap[app.id];
					if (typeof $scope.apps != "undefined") {
						if (typeof existsApp === "undefined") {
							$scope.news.push(
								"<strong>[新应用] " + app.name + " ver." + app.version_code + "</strong><br>" + app.description
							);
							$('#notifyModal').modal('show');
						} else if (existsApp.version_code != app.version_code) {
							$scope.news.push(
								"<strong>[应用更新] " + app.name + " ver." + app.version_code + "</strong><br>" + app.description
							);
							$('#notifyModal').modal('show');
						}
					}
					newApps[app.id] = app;
				}
				if (typeof newApps["0"] != "undefined") {
					$scope.version = newApps["0"].version_code;
				}
				$scope.apps = data;
				$scope.lastAppMap = newApps;
				console.log("app updated");
			}
			$scope.lastSuccess = new Date().getTime();
		});
	}
	// refresh app list
	var cancelRefresh = $timeout(function refreshApp() {
		$scope.refreshApps();
		cancelRefresh = $timeout(refreshApp, 5000);
	}, 0);
	$scope.$on('$destroy', function (e) {
		$timeout.cancel(cancelRefresh);
	});
	$scope.currentSrc = "apps.html";
	$scope.currentApp = "0";
	$scope.totalApps = (typeof apps === "undefined") ? 0 : apps.length;
	$scope.changeApp = function (app) {
		$scope.currentSrc = app.home_url;
		$scope.currentApp = app.id;
	}
	$scope.isActive = function (app) {
		if ($scope.currentApp === app.id) {
			return "active";
		}
	}
}

var openedPDF = false;

function openPDF(url) {
	if (!openedPDF) {
		openedPDF = true;
		alert("打开PDF中，可能会有一点延迟，请耐心等待。点击确定继续。" + "\r\n" + url)
	}

	$.get("http://127.0.0.1:9460/reader?type=pdf&url=" + url);
}