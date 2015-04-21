app.directive('vkcomments', function($timeout) {
  console.log('hello!');
  return {
    restrict: 'AE',
    templateUrl: './js/directives/vk_comments.html',
    replace: true,
    scope: {
      pageid: '=pageid',
    },
    link: function(scope, element, attrs) {
      var unregister = scope.$watch('pageid', function(value) {
        if (value) {

          $timeout(function() {
            VK.init({apiId: 4877357, onlyWidgets: true});
             VK.Widgets.Comments("vk_comments", {limit: 15}, scope.pageid);
          }, 400);
        }
      });
    }
  };
});