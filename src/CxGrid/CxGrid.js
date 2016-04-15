/**********************************************************
 *
 * @ngdoc module
 * @name ng.cx.grid.CxGrid
 *
 **********************************************************/

angular.module('ng.cx.grid.CxGrid', [
    'ng.cx.grid.CxCell'
])

/**********************************************************
 *
 * @ngdoc service
 * @name CxGrid
 *
 **********************************************************/

.factory('CxGrid', [
    '$timeout',
    'CxCell',
    function $CxGrid($timeout, CxCell) {
        'use strict';

        return CxGrid;

        function CxGrid(
            gridData,
            columnHeaderData,
            rowHeaderData,
            cellRenderer,
            columnHeaderRenderer,
            rowHeaderRenderer,
            cornerRenderer,
            $mainContainer,
            $colHeadersContainer,
            $rowHeadersContainer,
            $cellsContainer,
            $cornerContainer
        ) {

            console.time('render');

            var _rowHeaders = [],
                _colHeaders = [],
                _cells = [
                    []
                ],
                _highlighted = {
                    x: undefined,
                    y: undefined
                };


            this.highlightRow = highlightRow;
            this.highlightColumn = highlightColumn;

            /**********************************************************
             * IMPLEMENTATION
             **********************************************************/

            _init();

            /**********************************************************
             * METHODS
             **********************************************************/

            function switchLineHighlighting(index, axis, switchValue) {
                if(_highlighted.x !== undefined) {
                    _highlighted.x.switchHighlight('off');
                }

                if(_highlighted.y !== undefined) {
                    _highlighted.y.switchHighlight('off');
                }

                _highlighted[axis] = (axis === 'x') ? _getRowByIndex(index) : _getColumnByIndex(index);

                if(_highlighted.x !== undefined) {
                    _highlighted.x.switchHighlight('on');
                }

                if(_highlighted.y !== undefined) {
                    _highlighted.y.switchHighlight('on');
                }
            }

            function highlightRow(index) {
                switchLineHighlighting(index, 'x', 'on');
            }

            function highlightColumn(index) {
                switchLineHighlighting(index, 'y', 'on');
            }


            /**********************************************************
             * HELPERS
             **********************************************************/

            function _init() {
                _hideMainContainer();
                _renderHeaders();
                $timeout(_renderCorner);
                $timeout(_renderGrid);
                $timeout(_showMainContainer);
            }

            function _hideMainContainer() {
                $mainContainer.css('opacity', 0);
            }

            function _showMainContainer() {
                $mainContainer.css('opacity', 1);
                console.timeEnd('render');
            }

            // HEADERS -------------------------------------------------

            function _renderHeaders() {
                _colHeaders = columnHeaderData.map(_createColHeaderCell);
                _rowHeaders = rowHeaderData.map(_createRowHeaderCell);
            }

            function _createColHeaderCell(data) {
                var cell = _createCell(data, columnHeaderRenderer);
                $colHeadersContainer.append(cell.$element);
                return cell;
            }

            function _createRowHeaderCell(data) {
                var cell = _createCell(data, rowHeaderRenderer);

                $rowHeadersContainer.append(cell.$element);
                return cell;
            }

            // CORNER -------------------------------------------------

            function _renderCorner() {
                var restrictions = {
                        measure: {
                            width: _getMaxMeasure(_rowHeaders, 'width'),
                            height: _getMaxMeasure(_colHeaders, 'height'),
                        }
                    },
                    cell = _createCell(undefined, cornerRenderer, restrictions);

                $cornerContainer.append(cell.$element);
            }

            // GRID -------------------------------------------------

            function _renderGrid() {
                var row,
                    col,
                    width = _colHeaders.length,
                    height = _rowHeaders.length,
                    restrictions;

                for (row = 0; row < height; row++) {
                    _cells[row] = [];
                    for (col = 0; col < width; col++) {
                        _cells[row][col] = _createGridCell(row, col);
                    }
                }
            }

            function _createGridCell(rowIndex, colIndex) {
                var cell,
                    data = gridData[rowIndex][colIndex],
                    colHeaderCell = _colHeaders[colIndex],
                    rowHeaderCell = _rowHeaders[rowIndex],
                    restrictions = {
                        measure: {
                            width: colHeaderCell.width,
                            height: rowHeaderCell.height
                        },
                        position: {
                            x: colHeaderCell.relativeLeft,
                            y: rowHeaderCell.relativeTop
                        }
                    };

                cell = _createCell(data, cellRenderer, restrictions);

                $cellsContainer.append(cell.$element);

                return cell;
            }

            function _getColumnByIndex(index) {
                var column = [_colHeaders[index]];

                for (var ix = 0; ix < _cells.length; ix++) {
                    column.push(_cells[ix][index]);
                }

                return new GridLine(index, column);
            }

            function _getRowByIndex(index) {
                return new GridLine(index, [_rowHeaders[index]].concat(_cells[index]));
            }

        }

        function _createCell(data, template, restrictions) {
            return new CxCell(data, template, restrictions);
        }

        function _getMaxMeasure(elements, measure) {
            var measures = elements.map(function(cell) {
                console.log('row Header cell', cell.width, cell.height);
                return cell[measure];
            });

            return Math.max.apply(null, measures);
        }

        function GridLine(index, elements) {
            var _self = this;

            Object.defineProperty(this, 'index', {
                get: function() {
                    return index;
                }
            });

            this.switchHighlight = switchHighlight;

            this.isEqual = isEqual;

            function switchHighlight(switchValue) {
                elements.map(function(element) {
                    element.switchHighlighting(switchValue);
                });
            }

            function isEqual(gridLine) {
                return _self.index === gridLine.index;
            }
        }


    }
])


/**********************************************************/
;
