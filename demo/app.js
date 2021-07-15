// Copyright (C) 2018-2021, Siemens AG. All Rights Reserved.

_mdsp.init({
    title: 'Simple Demo',
    polyfills: {
        promise: true
    }
});

window.addEventListener('load', function () {

    const assetView = document.querySelector('mdsp-asset-view');
    const customTemplateSwitch = document.getElementById('changeTemplateSwitch');
    const themeSwitch = document.getElementById('changeThemeSwitch');

    const aspectVariableSelector = document.querySelector('mdsp-aspect-variable-selector');
    const dateTimeRangePicker = document.querySelector('mdsp-date-time-range-picker');
    const timeSeriesChart = document.querySelector('mdsp-time-series-chart');
    const eventView = document.querySelector('mdsp-event-view');
    const fileView = document.querySelector('mdsp-file-view');
    const simpleMap = document.querySelector('mdsp-map');
    const assetMap = document.querySelector('mdsp-asset-map');
    const ruleView = document.querySelector('mdsp-rule-view');
    const customMap = document.querySelector('mdsp-custom-map');

    if (assetView) {
        assetView.addEventListener('selectedAssetChanged', function (eventParams) {
            aspectVariableSelector.selectedAssetIds = [eventParams.detail.assetId];
            eventView.assetId = eventParams.detail.assetId;

            if (!eventParams.detail.isShared) {
                fileView.assetId = eventParams.detail.assetId;
                ruleView.assetId = eventParams.detail.assetId;
            }

            if (eventParams.detail.location) {
                simpleMap.longitude = eventParams.detail.location.longitude;
                simpleMap.latitude = eventParams.detail.location.latitude;
            } else {
                simpleMap.longitude = 0;
                simpleMap.latitude = 0;
            }

            customMap.assetId = eventParams.detail.assetId;
        });

        assetView.addEventListener('searchTextChanged', function (eventParams) {
            if (assetMap) {
                assetMap.searchText = eventParams.detail;
            }
        });
    }

    if (customTemplateSwitch) {
        customTemplateSwitch.addEventListener('click', function () {
            if (customTemplateSwitch.checked) {
                assetView.customListTemplateId = 'customAssetViewTemplate';
            } else {
                assetView.customListTemplateId = '';
            }
        });
    }

    if (themeSwitch) {
        themeSwitch.addEventListener('click', function () {
            document.body.classList.toggle('dark');
        });
    }

    if (aspectVariableSelector) {
        aspectVariableSelector.addEventListener('selectedAspectsAndVariablesChanged', function (eventParams) {
            timeSeriesChart.variablePaths = eventParams.detail;
        });
    }

    if (dateTimeRangePicker) {
        dateTimeRangePicker.dateRange = {
            from: new Date(new Date().setDate(new Date().getDate() - 7)),
            to: new Date()
        };
        dateTimeRangePicker.validDateRange = {
            max: new Date()
        }

        dateTimeRangePicker.addEventListener('dateRangeChanged', function (eventParams) {
            if (timeSeriesChart) {
                timeSeriesChart.dateRange = eventParams.detail;
            }
            if (eventView) {
                eventView.dateRange = eventParams.detail;
            }
        });
    }

    if (timeSeriesChart) {
        if (dateTimeRangePicker) {
            timeSeriesChart.dateRange = dateTimeRangePicker.dateRange;
        }
        timeSeriesChart.addEventListener('error', function (eventParams) {
            console.log(eventParams.detail);
        });
    }

    if (eventView) {
        eventView.addEventListener('selectedEventChanged', function (eventParams) {
            console.log(JSON.stringify(eventParams.detail));
        });
        if (dateTimeRangePicker) {
            eventView.dateRange = dateTimeRangePicker.dateRange;
        }
        eventView.addEventListener('error', function (eventParams) {
            console.log(eventParams.detail);
        });
    }

    if (fileView) {
        fileView.addEventListener('selectedFileChanged', function (eventParams) {

            // example how to get the selected file
            if (eventParams.detail.type === 'application/json') {

                var baseUrl = 'api/iotfile/v3/files'
                var assetId = fileView.assetId;
                var fileName = eventParams.detail.name;
                var filePath = eventParams.detail.path;

                var fileUrl = [baseUrl, assetId, fileName, filePath].filter(_ => _).join('/');

                fetch(fileUrl)
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        console.log(data);
                    });
            } else {
                console.log(eventParams.detail);
            }
        });
    }

    if (assetMap) {
        assetMap.addEventListener('assetsClicked', function (eventParams) {
            console.log(JSON.stringify(eventParams.detail));
        });

        assetMap.addEventListener('selectedAssetChanged', function (eventParams) {
            console.log(JSON.stringify(eventParams.detail));
        });
    }

    if (customMap) {

        // customMap.markerStyle.default = { src: './lib/pin_red.png'};
        // customMap.markerStyle.selected = { src: './lib/pin_red_selected.png'};
        // customMap.markerStyle.clustered = { src: './lib/clustered.png'};
        // customMap.markerStyle.clusteredSelected = { src: './lib/clustered_selected.png'};
        // customMap.hierarchyMarkerStyle.default = { src: './lib/rect_red.png'};
        // customMap.hierarchyMarkerStyle.selected = { src: './lib/rect_red_selected.png'};
        // customMap.hierarchyMarkerStyle.clustered = { src: './lib/rect_clustered.png'};
        // customMap.hierarchyMarkerStyle.clusteredSelected = { src: './lib/rect_clustered_selected.png'};

        customMap.addEventListener('selectedAssetChanged', function (eventParams) {

            console.log(eventParams.detail.assetId);
            if (!eventParams.detail.isShared) {
                fileView.assetId = eventParams.detail.assetId;
                ruleView.assetId = eventParams.detail.assetId;
            }

            if (eventParams.detail.location) {
                simpleMap.longitude = eventParams.detail.location.longitude;
                simpleMap.latitude = eventParams.detail.location.latitude;
            } else {
                simpleMap.longitude = 0;
                simpleMap.latitude = 0;
            }
        });
    }

}, false);
