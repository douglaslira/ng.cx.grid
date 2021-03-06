angular.module('ng.cx.grid.grid', [
    'ng.cx.grid.cxScroll',
    'ng.cx.grid.CxGrid',
    'ng.cx.grid.cxGridService'
])

/**********************************************************
 *
 * @ngdoc directive
 * @name ngCxGrid
 * @module ng.cx.grid
 *
 **********************************************************/

.directive('cxGrid', [

    function() {
        'use strict';

        return {
            restrict: 'AE',
            replace: 'element',
            templateUrl: 'src/grid/ng.cx.grid.html',
            controller: 'cxGridController as gridController',
            scope: {},
            bindToController: {
                ioDataProvider: '=?',
                ioCellRenderer: '@?',
                ioRowHeaderRenderer: '@?',
                ioColumnHeaderRenderer: '@?',
                ioCornerRenderer: '@?'
            }
        };
    }
])

.controller('cxGridController', [
    '$scope',
    '$element',
    'CxGrid',
    'cxGridService',
    function ngCxGridController($scope, $element, CxGrid, cxGridService) {
        'use strict';

        var _grid,
            _$rowHeadersContainer,
            _$colHeadersContainer,
            _$cellsContainer,
            _$cornerContainer,
            _$element = $element;

        this.scrollHandler = scrollHandler;

        _$rowHeadersContainer = get$elementBySelector('.cx-grid-rh-container');
        _$colHeadersContainer = get$elementBySelector('.cx-grid-ch-container');
        _$cellsContainer      = get$elementBySelector('.cx-grid-cells-container');
        _$cornerContainer     = get$elementBySelector('.cx-grid-corner-container');

        _grid = new CxGrid(
            this.ioDataProvider,
            this.ioCellRenderer,
            this.ioColumnHeaderRenderer,
            this.ioRowHeaderRenderer,
            this.ioCornerRenderer,
            $element,
            _$colHeadersContainer,
            _$rowHeadersContainer,
            _$cellsContainer,
            _$cornerContainer,
            $scope
        );

        window.cxGrid = _grid;

        cxGridService.addGrid( _grid );

        function scrollHandler(event) {

            var scrollTop = event.target.scrollTop,
                scrollLeft = event.target.scrollLeft;

            if(scrollTop > 0){
                _$element.addClass('is-scrolling-y');
            } else {
                _$element.removeClass('is-scrolling-y');
            }

            if(scrollLeft > 0){
                _$element.addClass('is-scrolling-x');
            } else {
                _$element.removeClass('is-scrolling-x');
            }
        }

        function get$elementBySelector(selector) {
            return angular.element($element[0].querySelector(selector));
        }
    }
])

/**********************************************************/
;
