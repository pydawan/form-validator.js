/**
 * Simples Validador de Formulários escrito em JavaScript.
 * 
 * @author thiago-amm
 * @version v1.0.0 04/02/2019
 * @since v1.0.0
 */

function test(condition, failMessage) {
    if (!condition) {
        throw failMessage;
    }
}

function ValidationError(field, message) {
    var validationError = null;
    this.field = field ? field : null;
    this.message = message ? message : "";
    if (field) {
        validationError = {
            field: field,
            message: message
        };
    }
    validationError;
}

ValidationError.prototype.toString = function () {
    return "ValidationError: " + $(this.field).attr("id") + " " + this.message;
};


function RequiredFieldValidation(field, message) {
    if (field) {
        var id = $(field).attr("id");
        message = message ? message : id + " é um campo de preenchimento obrigatório!";
        $("#" + id + "-error-message").remove();
        try {
            test($(field).val(), message);
            $(field).removeClass("invalid");
            $('label[for="' + id + '"]').removeClass("invalid");
        } catch (error) {
            $(field).addClass("invalid");
            $('label[for="' + id + '"]').addClass("invalid");
            $(field).after(
                '<span id="' +
                id +
                '-error-message" class="invalid">&nbsp;' +
                message +
                "</span>"
            );
            var validationError = new ValidationError(field, error);
            return validationError;
        }
    }    
}

var requiredFieldValidation = function (field, message) {
    return new RequiredFieldValidation(field, message);
};

function PatternFieldValidation(field, pattern, message) {
    // TODO - validar quando um elemento não é encontrado na DOM Tree.
    field = field ? field : null;
    pattern = pattern && pattern instanceof RegExp ? pattern : null;
    message = message ? message : $(field).attr("id") + " não corresponde ao padrão " + pattern + "!";
    if (field && pattern) {
        // Verifica se algum valor foi informado.
        // Caso não tenha sido trata-se de uma validação required.
        if ($(field).val() !== '') {
            var expected = true;
            var obtained = pattern.test($(field).val());
            var id = $(field).attr("id");
            $("#" + id + "-error-message").remove();
            try {
                test(obtained === expected, message);
                $(field).removeClass("invalid");
                $('label[for="' + id + '"]').removeClass("invalid");
            } catch (error) {
                $(field).addClass("invalid");
                $('label[for="' + id + '"]').addClass("invalid");
                $(field).after(
                    '<span id="' +
                    id +
                    '-error-message" class="invalid">&nbsp;' +
                    message +
                    "</span>"
                );
                var validationError = new ValidationError(field, error);
                return validationError;
            }
        }
    } else {
        if (!field) {
            throw "field não informado!";
        }
        if (!pattern) {
            throw "pattern não informado!";
        }
    }
}

var patternFieldValidation = function (field, pattern, message) {
    return new PatternFieldValidation(field, pattern, message);
};

function FormValidator(settings) {
    var _settings = settings && settings instanceof Object ? settings : null;
    var _form;
    var _validations = [];
    var _invalidForm = true;
    if (_settings) {
        for (var setting in settings) {
            if (setting === "form") {
                _form = "#" + settings["form"];
            }
            if (setting === "rules") {
                if (settings["rules"] && settings["rules"] instanceof Object) {
                    var rules = settings["rules"];
                    for (var i in rules) {
                        var rule = rules[i];
                        var fieldName = i;
                        var field = _form + " #" + fieldName;
                        if (rule && rule instanceof Object) {
                            for (var validation in rule) {
                                if (rule[validation] && rule[validation] instanceof Object) {
                                    var validationObject = rule[validation];
                                    var value;
                                    var message;
                                    if ("value" in validationObject) {
                                        value = validationObject["value"] ? validationObject["value"] : null;
                                    }
                                    if ("message" in validationObject) {
                                        message = validationObject["message"] && typeof(validationObject["message"]) === "string" ? validationObject["message"] : '';
                                    }
                                    if ("events" in validationObject) {
                                        var events = validationObject["events"] && validationObject["events"] instanceof Array ? validationObject["events"] : null;
                                        if (events) {
                                            var events = validationObject["events"];
                                            events = ("" + events).replace(/,/g, ' ');
                                        }
                                    }
                                    if (validation === "required") {
                                        if (value === true) {
                                            if (events && field && message) {
                                                (function(events, field, message) {
                                                    $(document).on(events, field, function(event) {
                                                        requiredFieldValidation(field, message);
                                                    });
                                                })(events, field, message);
                                                _validations.push(
                                                    (function(field, message) {
                                                        return function() {
                                                            return requiredFieldValidation(field, message)
                                                        };
                                                    })(field, message)
                                                );
                                            }
                                        }
                                    }
                                    if (validation === "pattern") {
                                        if (field && value && events && message) {
                                            if (value instanceof RegExp) {
                                                (function(events, field, pattern, message) {
                                                    $(document).on(events, field, function(event) {
                                                        patternFieldValidation(field, pattern, message);
                                                    });
                                                })(events, field, value, message);
                                                _validations.push(
                                                    (function(field, pattern, message) {
                                                        return function() {
                                                            return patternFieldValidation(field, pattern, message);
                                                        }
                                                    })(field, value, message)
                                                );
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (_form) {
            $(_form).submit(function(event) {
                var validationError;
                for (var _validation in _validations) {
                    validationError = (_validations[_validation])();
                    if (validationError) {
                        _invalidForm = true;
                    } else {
                        _invalidForm = false;
                    }
                }
                if (_invalidForm) {
                    $(_form).find('input:submit').attr("disabled", "disabled");
                } else {
                    $(_form).find('input:submit').removeAttr("disabled");
                }
                event.preventDefault();
            });
        }
    } else {
        throw "Não foram encontradas configurações para o validador de formulário!";
    }
    this.getSettings = function() {
        return JSON.parse(JSON.stringify(_settings));
    };
    this.getForm = function() {
        return '' + _form;
    };
}