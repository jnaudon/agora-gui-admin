angular.module('avAdmin')
  .directive('avAdminHead', function(Authmethod, $state, $cookies, $i18next, ConfigService) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        var admin = $cookies.user;
        scope.admin = admin;
        scope.organization = ConfigService.organization;
        scope.technology = ConfigService.technology;
        scope.nologin = ('nologin' in attrs) || scope.admin;
        scope.helpurl = ConfigService.helpUrl;

        scope.loginrequired = ('loginrequired' in attrs);
        if (scope.loginrequired && !scope.admin) {
            $state.go("admin.logout");
        }
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-head-directive/admin-head-directive.html'
    };
  });
