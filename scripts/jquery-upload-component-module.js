(function() {
    'use strict';

    function componentController($scope, $element, $timeout) {
        var ctrl = this;
        $timeout(function() {
            var $input = $element.find("input.fileupload");
            var $cancelButton = $element.find(".fileupload-cancel");
            var $embedContainer = $element.find(".fileupload-embed");
            var $embedElement = $embedContainer.find(".wistia_embed");
            var $errorContainer = $element.find(".fileupload-error");
            var $errorDiv = $errorContainer.find(".fileupload-error-message")
            var $progressBar = $element.find(".progress .progress-bar");

            $progressBar.updateProgress = function(progress) {
                var percent = progress + "%";
                this.css("width", percent).html(percent);
            };

            $input.fileupload({
                dataType: "json",
                add: function(e, data) {
                    $cancelButton.toggle(true);
                    $errorContainer.toggle(false);
                    $embedContainer.toggle(false);
                    var jqXHR = data.submit();

                    $cancelButton.click(function() {
                        jqXHR.abort();
                        $progressBar.updateProgress(0);
                        $cancelButton.toggle(false);
                    });
                },
                done: function(e, data) {
                    var hash = data.result.hashed_id;
                    $embedElement.attr("id", "wistia_" + hash);
                    $embedContainer.toggle(true);
                    Wistia.embed(hash);
                    $cancelButton.toggle(false);
                },
                fail: function(e, data) {
                    if (data.textStatus !== "error")
                        return;
                    $errorDiv.html(data.jqXHR.responseJSON.error);
                    $errorContainer.toggle(true);
                    $cancelButton.toggle(false);
                },
                progress: function(e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $progressBar.updateProgress(progress);
                }
            });
        });
    }

    angular.module("jquery-upload-component-module", [])
        .component("jqueryUploadComponent", {
            bindings: {
                apiPassword: '@',
                projectId: '@'
            },
            templateUrl: "templates/wistia-component.html",
            controller: componentController
        });

})();