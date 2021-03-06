/*
  Dashboard Controller: This controller handles a part of the initial view of the dashboard.(dashboard.html)
  1) Latest tracks list
  2) Speed ranges pie chart
  3) User vs public bar chart
*/

angular.module('app')
  .constant('dashboard', {
    type: 'user',
    comments: 'Number of Tracks',
    color: 'primary',
    url1: 'https://envirocar.org/api/stable/users/',
    numberoftracks: 5,
    urltracks: 'https://envirocar.org/api/stable/tracks/',
    urlredirect: '#/dashboard/chart/',
    charttype: 'multiBarHorizontalChart',
    chartheight: 450,
    duration: 300,
    yaxislabel: 'Values',
    format: ',.2f',
    urlusers: 'https://envirocar.org/api/stable/users/',
    urlco2stats: '/statistics/CO2',
    textco2: 'CO2(',
    urlspeedstats: '/statistics/Speed',
    textspeed: 'Speed(',
    urlconsstats: '/statistics/Consumption',
    textcons: 'Consumption(',
    urlengineloadstats: '/statistics/Engine Load',
    key1: 'User Statistics',
    color1: '#d62728',
    urlcommonco2: 'https://envirocar.org/api/stable/statistics/CO2',
    urlcommonspeed: 'https://envirocar.org/api/stable/statistics/Speed',
    urlcommoncons: 'https://envirocar.org/api/stable/statistics/Consumption',
    urlcommonengineload: 'https://envirocar.org/api/stable/statistics/Consumption',
    key2: "Other User's Statistics",
    color2: '#1f77b4',
    loading_count: 5
  });

angular.module('app')
  .controller('DashboardController', ['$scope', '$http', '$rootScope',
    '$stateParams',
    'requesthomestats', 'requestgraphstats', 'dashboard', '$state',
    '$translate',
    function($scope, $http, $rootScope, $stateParams, requesthomestats,
      requestgraphstats,
      dashboard, $state, $translate) {
      $rootScope.tabNumber = 0;

      $scope.onloadSpeedPie = false;

      // The server does not support this features yet so placeholder values are used for the moment,
      var speedgraph_data = {
        "user": "naveen-gsoc",
        "distance": 3344.22,
        "duration": 50.2,
        "statistics": {
          "0": {
            "distance": 1610.2,
            "duration": 32.1
          },
          "60": {
            "distance": 502.34,
            "duration": 7.1
          },
          "130": {
            "distance": 400.56,
            "duration": 4
          }
        }
      };

      // The pie chart options
      $scope.options_pie = {
        chart: {
          type: 'pieChart',
          height: 250,
          x: function(d) {
            return d.key;
          },
          y: function(d) {
            return d.y;
          },
          showLabels: true,
          duration: 300,
          labelThreshold: 0.01,
          donut: true,
          labelsOutside: true,
          cornerRadius: 0,
          donutRatio: 0.45,
          showLegend: true,
          legendPosition: 'top',
          tooltip: {
            contentGenerator: function(d){
              var html = '<h3><b>' + d.data.key + '</b> - ' + d.data.y.toFixed(2) + '%</h3>';
              return(html);
            }
          }

        }
      };

      // The options for select in speed ranges pie chart
      $scope.speedPieOptions = ['Distance', 'Time'];
      $scope.pieSpeedRanges = 'Distance';
      var dataSpeedContainer = {
        'Distance': [{
          key: '0-60 Km/h',
          y: (speedgraph_data.statistics['0'].distance * 100) / (
            speedgraph_data.statistics['0'].distance +
            speedgraph_data.statistics['60'].distance +
            speedgraph_data.statistics['130'].distance)
        }, {
          key: '61-130 Km/h',
          y: (speedgraph_data.statistics['60'].distance * 100) / (
            speedgraph_data.statistics['0'].distance +
            speedgraph_data.statistics['60'].distance +
            speedgraph_data.statistics['130'].distance)
        }, {
          key: '>130Km/Hr',
          y: (speedgraph_data.statistics['130'].distance * 100) / (
            speedgraph_data.statistics['0'].distance +
            speedgraph_data.statistics['60'].distance +
            speedgraph_data.statistics['130'].distance)
        }],
        'Time': [{
          key: '0-60 Km/h',
          y: speedgraph_data.statistics['0'].duration
        }, {
          key: '61-130 Km/h',
          y: speedgraph_data.statistics['60'].duration
        }, {
          key: '>130Km/Hr',
          y: speedgraph_data.statistics['130'].duration
        }]
      };

      $scope.dataSpeedPie = dataSpeedContainer[$scope.pieSpeedRanges];
      $scope.onloadSpeedPie = true;

      // Function that is called when either the speed or time option is changed
      $scope.changePhenomenonPieSpeed = function(option) {
        $scope.pieSpeedRange = option;
        $scope.dataSpeedPie = dataSpeedContainer[option];
      }

      var loading_count = 0;
      // Visibility for each of the 3 components on the dashboard
      $scope.onload_user_vs_public = false;
      $scope.onload_speed_ranges = false;
      $scope.onload_tracks_timeline = false;

      $scope.loading = true;
      $scope.goToActivity = function(trackid) {
        //redirect to the track analytics page.
        $state.go('home.chart', {
          'trackid': trackid
        });
      }
      $scope.visible = false;
      $scope.events = [];
      var helperevents = [];

      $scope.type = dashboard.type;
      $scope.comments = dashboard.comments;
      $scope.colour = dashboard.color;

      var url1 = dashboard.url1;
      var username;
      if ($stateParams.user == "") {
        username = $rootScope.globals.currentUser.username;
      } else {
        // if the URL requests for a username specifically.(Happens when viewing a friend's profile)
        username = $stateParams.user
      }

      $scope.username = username;
      url1 = url1 + username + "/tracks";
      $http.defaults.headers.common = {
        'X-User': $rootScope.globals.currentUser.username,
        'X-Token': $rootScope.globals.currentUser.authdata
      };
      var timeline = {};
      requesthomestats.get(url1).then(function(data) {
        $scope.number = data.data.tracks.length;
        var limit = 0;
        // The latest tracks display shows latest 5 tracks. If the user only has a total of lesser than 5 tracks, then we update that number to avoid exceptions
        if ($scope.number >= dashboard.numberoftracks)
          limit = dashboard.numberoftracks;
        else
          limit = $scope.number;
        for (var i = 0; i < limit; i++) {
          (function(cntr) {

            var helper_events = {};
            helper_events['car'] = data.data.tracks[cntr].sensor.properties.model;
            helper_events['manufacturer'] = data.data.tracks[cntr].sensor.properties.manufacturer;
            helper_events['id'] = data.data.tracks[cntr].id;
            helper_events['title'] = data.data.tracks[cntr].name;
            helper_events['urlredirect'] = dashboard.urlredirect + data.data.tracks[cntr].id;
            helper_events['url'] = dashboard.urltracks + data.data.tracks[cntr].id + "/preview";
            var seconds_passed = new Date(data.data.tracks[cntr].end).getTime() - new Date(data.data.tracks[cntr].begin).getTime();
            var seconds = seconds_passed / 1000;
            var timeoftravel = seconds / 60;
            // time of travel is in minutes
            // convert to the right format. of hh:mm:ss;
            date_for_seconds = new Date(null);
            date_for_seconds.setSeconds(seconds);
            date_hh_mm_ss = date_for_seconds.toISOString().substr(11, 8)
            helper_events['travelTime'] = date_hh_mm_ss;
            helper_events['begin'] = new Date(data.data.tracks[cntr].begin);
            helper_events['distance'] = (data.data.tracks[cntr]['length'] != undefined) ? data.data.tracks[cntr]['length'].toFixed(2) : "NA";
            /*
            if (cntr % 2 == 0) {
              helper_events['side'] = 'left'
            } else {
              helper_events['side'] = 'left';
            }*/
            helperevents.push(helper_events);
          })(i);
        }
        $scope.timelinevalues = timeline;

        $scope.onload_tracks_timeline = true;
        window.dispatchEvent(new Event('resize'));
      });
      $scope.events = helperevents;
      //*******************************************************
      //*******************************************************
      //******************GRAPHS PART**************************
      $scope.options = {
        chart: {
          type: dashboard.charttype,
          height: dashboard.chartheight,
          x: function(d) {
            return d.label;
          },
          y: function(d) {
            return d.value;
          },
          showControls: false,
          showValues: true,
          duration: dashboard.duration,
          xAxis: {
            showMaxMin: true,
            rotatelabels: -90
          },
          yAxis: {
            axisLabel: dashboard.yaxislabel,
            tickFormat: function(d) {
              return d3.format(dashboard.format)(d);
            }
          }
        }
      };
      var speed_users;
      var speed_public;
      $scope.optionsSpeed = {
        chart: {
          type: 'discreteBarChart',
          height: 260,
          margin: {
            top: 10,
            right: 0,
            bottom: 70,
            left: 50
          },
          x: function(d) {
            return d.label;
          },
          y: function(d) {
            return d.value;
          },
          showValues: true,
          valueFormat: function(d) {
            return d3.format(',.4f')(d);
          },
          duration: 500,
          xAxis: {
            axisLabel: 'User vs Public '
          },
          yAxis: {
            axisLabel: 'Speed(Km/Hr)',
            axisLabelDistance: -20
          },
           tooltip: {
            contentGenerator: function(d)
            {
              var html = '<h3><b>' + d.data.label + '</b> = ' + d.data.value.toFixed(2) + '</h3>' ;
              return html;
            }
          }
        }
      };
      var consumption_users;
      var consumption_public;
      /*$scope.optionsConsumption = {
        chart: {
          type: 'discreteBarChart',
          height: 260,
          margin: {
            top: 10,
            right: 0,
            bottom: 80,
            left: 30
          },
          x: function(d) {
            return d.label;
          },
          y: function(d) {
            return d.value;
          },
          showValues: true,
          valueFormat: function(d) {
            return d3.format(',.4f')(d);
          },
          duration: 500,
          xAxis: {
            axisLabel: 'User vs Public '
          },
          yAxis: {
            axisLabel: 'Consumption(l/Hr)',
            axisLabelDistance: -30
          }
        }
      };
      */
      var CO2_users;
      var CO2_public;
      /*
      $scope.optionsCO2 = {
        chart: {
          type: 'discreteBarChart',
          height: 260,
          margin: {
            top: 10,
            right: 0,
            bottom: 80,
            left: 30
          },
          x: function(d) {
            return d.label;
          },
          y: function(d) {
            return d.value;
          },
          showValues: true,
          valueFormat: function(d) {
            return d3.format(',.4f')(d);
          },
          duration: 500,
          xAxis: {
            axisLabel: 'User vs Public '
          },
          yAxis: {
            axisLabel: 'CO2(Kg/Hr)',
            axisLabelDistance: -30
          }
        }
      };
      */
      var engineload_users;
      var engineload_public;
      /*
      $scope.optionsEngineload = {
        chart: {
          type: 'discreteBarChart',
          height: 260,
          margin: {
            top: 10,
            right: 0,
            bottom: 80,
            left: 30
          },
          x: function(d) {
            return d.label;
          },
          y: function(d) {
            return d.value;
          },
          showValues: true,
          valueFormat: function(d) {
            return d3.format(',.4f')(d);
          },
          duration: 500,
          xAxis: {
            axisLabel: 'User vs Public '
          },
          yAxis: {
            axisLabel: 'EngineLoad(%)',
            axisLabelDistance: -30
          }
        }
      };
      */


      $scope.barchartoptions = ["Speed", "Consumption", "CO2"];
      $scope.barchartshowing = "Speed"

      $scope.changePhenomenonbar = function(phenombar) {
        // Fired when phenomenon associated with the bar chart of User vs Public is changed.
        $scope.barchartshowing = phenombar;
        $scope.dataoverall = [];
        if (phenombar == "Speed") {
          $scope.optionsSpeed['chart']['yAxis']['axisLabel'] = "Speed (Km/h)"
          $scope.dataoverall = $scope.dataSpeed;
        } else if (phenombar == "Consumption") {
          $scope.optionsSpeed['chart']['yAxis']['axisLabel'] = "Consumption (l/h)"
          $scope.dataoverall = $scope.dataConsumption;
        } else if (phenombar == "CO2") {
          $scope.optionsSpeed['chart']['yAxis']['axisLabel'] = "CO2 (Kg/h)"
          $scope.dataoverall = $scope.dataCO2;
        }
      }

      $scope.dataoverall;
      $scope.dataConsumption;
      $scope.dataCO2;
      $scope.dataSpeed;
      $scope.dataEngineload;

      var datausers = [];
      var dataotherusers = [];

      var url = dashboard.urlusers + username + dashboard.urlco2stats;
      requestgraphstats.get(url).then(function(data) {
        // data.data.avg holds the data of CO2 avg consumption of user
        CO2_users = data.data.avg;
        url = dashboard.urlcommonco2;
        requestgraphstats.get(url).then(function(data) {
          // data.data.avg holds the data of CO2 avg consumption of all users.
          $scope.dataCO2 = [{
            key: "Cumulative Return",
            values: [{
              "label": "User",
              "value": CO2_users
            }, {
              "label": "Public",
              "value": data.data.avg
            }]
          }]
          loading_count++;

        });
      });

      url = dashboard.urlusers + username + dashboard.urlspeedstats;
      requestgraphstats.get(url).then(function(data) {
        // data.data.avg holds the data of avg Speed of user
        var store = data.data;
        speed_users = store.avg;
        url = dashboard.urlcommonspeed;
        requestgraphstats.get(url).then(function(data) {
          // data.data.avg holds the data of avg Speed of all users.
          var store = data.data;
          speed_public = store.avg
          $scope.dataSpeed = [{
            key: "Cumulative Return",
            values: [{
              "label": "User",
              "value": speed_users
            }, {
              "label": "Public",
              "value": speed_public
            }]
          }]
          $scope.dataoverall = $scope.dataSpeed;

          dataotherusers.push(data);

          $scope.onload_user_vs_public = true;
          window.dispatchEvent(new Event('resize'));
        });
      });

      url = dashboard.urlusers + username + dashboard.urlconsstats;
      requestgraphstats.get(url).then(function(data) {

        // data.data.avg holds the data of avg consumption of user
        consumption_users = data.data.avg;
        url = dashboard.urlcommoncons;
        requestgraphstats.get(url).then(function(data) {

          // data.data.avg holds the data of avg consumption of all users.
          $scope.loading = false;
          $scope.dataConsumption = [{
            key: "Cumulative Return",
            values: [{
              "label": "User",
              "value": consumption_users
            }, {
              "label": "Public",
              "value": data.data.avg
            }]
          }]
          loading_count++;
          if (loading_count == dashboard.loading_count) {
            $scope.onload = true;
            window.dispatchEvent(new Event('resize'));
          }
        });
      });

      url = dashboard.urlusers + username +
        dashboard.urlengineloadstats;
      requestgraphstats.get(url).then(function(data) {

        engineload_users = data.data.avg;
        url = dashboard.urlcommonengineload;
        requestgraphstats.get(url).then(function(data) {

          $scope.loading = false;
          $scope.dataEngineload = [{
            key: "Cumulative Return",
            values: [{
              "label": "User",
              "value": engineload_users
            }, {
              "label": "Public",
              "value": data.data.avg
            }]
          }]
          loading_count++;
          if (loading_count == dashboard.loading_count) {
            $scope.onload = true;
            window.dispatchEvent(new Event('resize'));
          }
        });
      });
      $scope.visible = true;

    }
  ]);

angular.module('app')
  .factory('requesthomestats', function($http) {
    var get = function(url) {
      return $http.get(url).success(function(data) {
        return data;
      })
    }
    return {
      get: get
    }
  });

angular.module('app')
  .factory('requestgraphstats', function($http) {
    var get = function(url) {
      return $http.get(url).success(function(data) {
        return data;
      });
    }

    return {
      get: get
    }
  });
