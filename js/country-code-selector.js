;
(function($){

    var defaults = {
        buttonSize: "btn-md",
        buttonType: "btn-default",
        labelMargin: "10px",
        scrollable: true,
        selectedCountry:'',
        scrollableHeight: "250px",
        searchField:false,
        placeholder: "US, BD",
    };

    $.countryDialCodeSelector = function (element, options, i) {

        var Plugin = this;
        var uniqueId = generateId(8);
        Plugin.countries = {};
        Plugin.selected = {value: null, text: null};
        Plugin.settings = {inputName: 'country-' + uniqueId};
        var $container = $(element);
        var htmlSelectId = 'dialcode-' + uniqueId;
        var htmlSelect = '#' + htmlSelectId;
        //console.log($container);

        Plugin.init = function(){
            Plugin.settings = $.extend({}, defaults, options, $container.data());
            //console.log(Plugin.settings.countriesData);
            if (undefined !== Plugin.settings.countriesData) {
                Plugin.countries = Plugin.settings.countriesData;
            }

            $container
                .addClass('countryDialCodeSelector')
                .append(buildHtmlSelect)
                .append(buildDropDownButton)
                .append(buildDropDownButtonItemList);


        };


        var buildHtmlSelect = function(){
            var htmlSelectElement = $('<select/>').attr('id', htmlSelectId).attr('name', Plugin.settings.inputName);
            $.each(Plugin.countries, function (key, country) {
                var optionAttributes = {value: country.code};

                if (Plugin.settings.selectedCountry !== undefined) {
                    if (Plugin.settings.selectedCountry === country.code) {
                        optionAttributes = {value: country.code, selected: "selected"};
                        Plugin.selected = {value: country.code,data:'test', text: country.dial_code}
                    }
                }
                optionAttributes['data-name']= country.name;
                htmlSelectElement.append($('<option>', optionAttributes).text(country.dial_code));

            });

            return htmlSelectElement;

        };

        var buildDropDownButton = function () {
            var selectedText = $(htmlSelect).find(":selected").text();
            var selectedValue = $(htmlSelect).find(":selected").val();
            var selectedName = $(htmlSelect).find(":selected").data('name');

            selectedText = Plugin.selected.text || selectedText;
            selectedValue = Plugin.selected.value || selectedValue;
            selectedName = Plugin.selected.name || selectedName;


            if (selectedValue !== Plugin.settings.placeholder.value) {
                var $selectedLabel = $('<i/>').addClass('flag-icon flag-icon-' + selectedValue.toLowerCase()).css('margin-right', Plugin.settings.labelMargin);
            } else {
                var $selectedLabel = $('<i/>').addClass('placeholder');
            }


            var buttonLabel = $('<span/>')
                .addClass('dialcode-selected-' + uniqueId)
                .html($selectedLabel)
                .append(selectedText);

            var button = $('<button/>')
                .attr('type', 'button')
                .attr('data-toggle', 'dropdown')
                .attr('id', 'dial-code-selector-' + uniqueId)
                .addClass('dial-code-selector btn ' + Plugin.settings.buttonType + ' ' + Plugin.settings.buttonSize + ' dropdown-toggle')
                .html(buttonLabel);

            $('<span/>')
                .addClass('caret')
                .css('margin-left', Plugin.settings.labelMargin)
                .insertAfter(buttonLabel);

            //console.log(selectedText +" "+ selectedValue +" "+selectedName);


            return button;
        };


        var buildDropDownButtonItemList = function () {
            var items = $('<ul/>')
                .attr('id', 'dialcode-drop-down-' + uniqueId + '-list')
                .attr('aria-labelled-by', 'dialcode-drop-down-' + uniqueId)
                .addClass('dropdown-menu');
            if (Plugin.settings.scrollable) {
                items.css('height', 'auto')
                    .css('max-height', Plugin.settings.scrollableHeight)
                    .css('overflow-x', 'hidden');
            }

            //Search feild
            if(Plugin.settings.searchField){
                $(items).append("<li id='country-code-selector-li'> <input type='text' class='form-control' id='country-code-selector-field' placeholder='"+ Plugin.settings.placeholder+"'></li>");

                $(document).on("keyup", "#country-code-selector-field", function(){
                    var Typed = $(this).val().toLowerCase();

                    $.each($(".country-code a"), function(){
                        var country_code = $(this).text(),
                        code  = $(this).data('val').toLowerCase(),
                        name  = $(this).data('name').toLowerCase();
                        if((country_code.indexOf(Typed) !== -1) || (code.indexOf(Typed) !== -1) || (name.indexOf(Typed) !== -1)){
                            $(this).parent("li").show();
                        }else{
                            $(this).parent("li").hide();
                        }
                    });
                });

            }

            $(htmlSelect).find('option').each(function () {
                var text = $(this).text();
                var value = $(this).val();
                var name = $(this).data("name");


                // Build the flag icon
                if (value !== Plugin.settings.placeholder.value) {
                    var flagIcon = $('<span/>').addClass('flag-icon flag-icon-' + value.toLowerCase()).css('margin-right', Plugin.settings.labelMargin);
                } else {
                    var flagIcon = null;
                }

                // Build a clickable drop down option item, insert the flag and label, attach click event
                var flagStrapItem = $('<a>')
                    .attr('data-val', value)
                    .attr('data-name', name)
                    .html(flagIcon)
                    .append(text)
                    .on('click', function (e) {
                        $(htmlSelect).find('option').removeAttr('selected');
                        $(htmlSelect).find('option[value="' + $(this).data('val') + '"]').attr("selected", "selected");
                        $(htmlSelect).trigger('change');
                        $('.dialcode-selected-' + uniqueId).html($(this).html());

                        e.preventDefault();
                    });


                //// Make it a list item
                var listItem = $('<li/>').prepend(flagStrapItem).addClass("country-code");
                items.append(listItem);
            });




            return items;
        };




        function generateId(length) {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

            if (!length) {
                length = Math.floor(Math.random() * chars.length);
            }

            var str = '';
            for (var i = 0; i < length; i++) {
                str += chars[Math.floor(Math.random() * chars.length)];
            }
            return str;
        }
        Plugin.init();
    };



    $.fn.countryDialCodeSelector = function(options){

        //console.log("working");
        //console.log(options);
        return this.each(function (i) {

            if ($(this).data('countryDialCodeSelector') === undefined) {
                //console.log("Has Data");
                $(this).data('countryDialCodeSelector', new $.countryDialCodeSelector(this, options, i));
            }else{
                //console.log("No Data");
            }
        });

    }
})(jQuery);