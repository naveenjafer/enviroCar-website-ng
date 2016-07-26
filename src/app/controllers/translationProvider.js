angular.module('app')
  .config(['$translateProvider', function($translateProvider) {
    $translateProvider.translations('en', {
      'TITLE_TRACKS': 'Latest Tracks',
      'TRACK_ID': 'Track ID',
      'MODIFIED': 'Modified',
      'User_VS_PUBLIC': 'User vs Public',
      'FRIENDS_ACTIVITY': 'Friend\'s Activity',
      'LOADING_DATA': 'Loading Data...',
      'SPEED_STATS': 'Speed Zones',
      'LOAD_MORE': 'Load More',
      'HEAT_MAP': 'Heat Map',
      'MY_ACTIVITY': 'My Activity',
      'TRACK_MAP': 'Track Map',
      'GRAPH': 'Graph',
      'PIE_CHART': 'Pie Chart',
      'TRACK_SUMMARY': 'Track Summary',
      'DISTANCE': 'Distance',
      'VEHICLE_TYPE': 'VEHICLE_TYPE',
      'TOTAL_TIME': 'TOTAL_TIME',
      'START_FINISH': 'Start Finish Time',
      'CONSUMPTION': ' Consumption',
      'CONSUMPTION_HOUR': 'Consumption/Hr',
      'CO2_EMISSION': 'CO2 Emission',
      'CO2_EMISSION_HOUR': 'CO2 Emission/Hr',
      'FRIENDS': 'Friends',
      'TRACKS': 'Tracks',
      'DISTANCE': 'Distance',
      'GROUPS': 'Groups',
      'TIMELINE_TAB': 'Timeline',
      'ACTIVITY_TAB': 'Activity',
      'FRIENDS_AND_GROUPS_TAB': 'Friends and Groups',
      'NO_FRIENDS': 'You do not have any Friends',
      'NO_ACTIVITY': 'You do not have any Activity to show',
      'NO_FRIENDS_ACTIVITY': 'You do not have any friend activity to show',
      'CALENDAR_OF_TRACKS_TAB': 'Calendar of Tracks',
      'ALL_TRACKS_TAB': 'All Tracks',
      'TRACKS_LIST': "Tracks List",
      'TRACK_ID': 'Track ID',
      'NAME': 'Name',
      'CREATED': 'Created',
      'TIME_SERIES': 'Time Series',
      'TRACK_SUMMARY': 'Track Summary',
      'DURATION': 'Duration',
      'CAR:': 'Car:',
      'START:': 'Start:',
      'END:': 'End:',
      'CONSUMPTION:': 'Consumption:',
      'CO2_EMISSION:': 'CO2 Emission:',
      'TRACK_VS_PUBLIC': 'Track Vs Public',
      'LOGIN': 'Login',
      'LOGOUT': 'Logout',
      'PROFILE': 'Profile',
      'DASHBOARD': 'Dashboard',
      'TRACKS': 'Tracks',
      'TABLE': 'Profile',
      'SEGMENT': 'Segment',
      'SPEED_PIE': 'Speed',
      'CONSUMPTION_PIE': 'Consumption',
      'CO2_PIE': 'CO2'

    });
    $translateProvider.preferredLanguage('en');

  }])
