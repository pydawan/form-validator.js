/**
 * Simples Validador de Formulários escrito em JavaScript.
 *
 * @author thiago-amm
 * @version v1.0.0 04/02/2019
 * @since v1.0.0
 */

 // 1. Verificar se as configurações do validador de formulário foram informadas.
 // 2. Armazenar o seletor do formulário.
 // 3. Obter e armazenar todos os campos do formulário em um mapa.
 // 4. Criar um mapa para cada campo do formulário.
 // 4.1 No mapa do campo deverá armazenar o tipo de validação, os eventos que irão dispará-la e a mensagem de validação.
 // 5. A validação do formulário (todos os campos) deve ocorrer em dois momentos:
 // 5.1 quando o usuário clicar no botão submit do formulário.
 // 5.2 quando o campo com o qual o usuário estiver interagindo possuir registrados uma validação e um evento e o mesmo
 //     disparar o evento registrado.
 // 5.2.1 nesse caso todo o formulário deverá ser validado.

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

function ValidationResult(field, valid) {
  var validationResult = null;
  if (field) {
    validationResult = {};
    validationResult.field = field;
    validationResult.valid = valid;
  }
  return validationResult;
}

ValidationError.prototype.toString = function() {
  return "ValidationError: " + $(this.field).attr("id") + " " + this.message;
};

function RequiredFieldValidation(field, message) {
  var validationError = null;
  var validationResult = null;
  if (field) {
    var id = $(field).attr("id");
    message = message
      ? message
      : id + " é um campo de preenchimento obrigatório!";
    $("#" + id + "-error-message").remove();
    try {
      test($(field).val(), message);
      $(field).removeClass("invalid");
      $('label[for="' + id + '"]').removeClass("invalid");
      validationResult = new ValidationResult(field, true);
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
      validationResult = new ValidationResult(field, false);
      validationError = new ValidationError(field, error);
    }
  }
  this.error = function() {
    return validationError;
  };
  this.result = function() {
    return validationResult;
  };
}

/*
var requiredFieldValidation = function(field, message) {
  return new RequiredFieldValidation(field, message);
};
*/

function PatternFieldValidation(field, pattern, message) {
  var validationError = null;
  var validationResult = null;
  field = field ? field : null;
  pattern = pattern && pattern instanceof RegExp ? pattern : null;
  message = message
    ? message
    : $(field).attr("id") + " não corresponde ao padrão " + pattern + "!";
  if (field && pattern) {
    // Verifica se algum valor foi informado.
    // Caso não tenha sido trata-se de uma validação required.
    if ($(field).val() !== "") {
      var expected = true;
      var obtained = pattern.test($(field).val());
      var id = $(field).attr("id");
      $("#" + id + "-error-message").remove();
      try {
        test(obtained === expected, message);
        $(field).removeClass("invalid");
        $('label[for="' + id + '"]').removeClass("invalid");
        validationResult = new ValidationResult(field, true);
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
        validationResult = new ValidationResult(field, false);
        validationError = new ValidationError(field, error);
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
  this.error = function() {
    return validationError;
  };
  this.result = function() {
    return validationResult;
  };
}

/*
var patternFieldValidation = function(field, pattern, message) {
  return new PatternFieldValidation(field, pattern, message);
};
*/

function FormValidator(settings) {
  var _settings = settings && settings instanceof Object ? settings : null;
  var _form;
  var _validations = [];
  var _self = this;
  _self.validationResults = {};
  _self.fields = [];
  _self.valid = false;
  if (_settings) {
    for (var setting in settings) {
      if (setting === "form") {
        _form = "#" + settings["form"];
        _self.form = "" + _form;
      }
      if (setting === "rules") {
        if (settings["rules"] && settings["rules"] instanceof Object) {
          var rules = settings["rules"];
          for (var i in rules) {
            var rule = rules[i];
            var fieldName = i;
            var field = _form + " #" + fieldName;
            _self.validationResults["" + field] = { valid: false };
            if (rule && rule instanceof Object) {
              for (var validation in rule) {
                if (rule[validation] && rule[validation] instanceof Object) {
                  var validationObject = rule[validation];
                  var value;
                  var message;
                  if ("value" in validationObject) {
                    value = validationObject["value"]
                      ? validationObject["value"]
                      : null;
                  }
                  if ("message" in validationObject) {
                    message =
                      validationObject["message"] &&
                      typeof validationObject["message"] === "string"
                        ? validationObject["message"]
                        : "";
                  }
                  if ("events" in validationObject) {
                    var events =
                      validationObject["events"] &&
                      validationObject["events"] instanceof Array
                        ? validationObject["events"]
                        : null;
                    if (events) {
                      var events = validationObject["events"];
                      events = ("" + events).replace(/,/g, " ");
                    }
                  }
                  if (validation === "required") {
                    if (value === true) {
                      if (events && field && message) {
                        (function(events, field, message) {
                          $(document).on(events, field, function(event) {
                            var requiredFieldValidation = new RequiredFieldValidation(
                              field,
                              message
                            );
                            var validationResult = requiredFieldValidation.result();
                            if (validationResult) {
                              _self.validationResults[field]["valid"] =
                                validationResult.valid;
                              if (validationResult.valid === false) {
                                _self.valid = false;
                                $(_self.form)
                                  .find("input:submit")
                                  .attr("disabled", "disabled");
                              }
                            } else {
                              _self.valid = false;
                              _self.validationResults[field]["valid"] = false;
                              $(_self.form)
                                .find("input:submit")
                                .attr("disabled", "disabled");
                            }
                          });
                        })(events, field, message);
                        _validations.push(
                          (function(field, message) {
                            return function() {
                              return new RequiredFieldValidation(
                                field,
                                message
                              );
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
                            var patternFieldValidation = new PatternFieldValidation(
                              field,
                              pattern,
                              message
                            );
                            var validationResult = patternFieldValidation.result();
                            if (validationResult) {
                              _self.validationResults[field]["valid"] =
                                validationResult.valid;
                              if (validationResult === false) {
                                _self.valid = false;
                                $(_self.form)
                                  .find("input:submit")
                                  .attr("disabled", "disabled");
                              }
                            } else {
                              _self.valid = false;
                              $(_self.form)
                                .find("input:submit")
                                .attr("disabled", "disabled");
                              _self.validationResults[field]["valid"] = false;
                            }
                          });
                        })(events, field, value, message);
                        _validations.push(
                          (function(field, pattern, message) {
                            return function() {
                              return new PatternFieldValidation(
                                field,
                                pattern,
                                message
                              );
                            };
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
    _self.disableSubmit = function() {
        if (_self.valid === false) {
          $(_self.form).find("input:submit").attr("disabled", "disabeld");
        }
    };
    _self.enableSubmit = function() {
      if (_self.valid === true) {
        $(_self.form).find("input:submit").removeAttr("disabled");
      }
    };
    _self.validateForm = function() {
      var error = null;
      var result = null;
      for (var _validation in _validations) {
        console.log(_validation);
        console.log(_validations[_validation]);
      }
    };
    if (_form) {
      $(_form).submit(function(event) {
        _self.validateForm();
        /*
        var error = null;
        var result = null;
        for (var _validation in _validations) {
          result = _validations[_validation]().result();
          if (result) {
            if (!result.valid) {
              _self.valid = false;
              $(_self.form)
                .find("input:submit")
                .attr("disabled", "disabled");
            }
          } else {
            _self.valid = false;
            $(_self.form)
              .find("input:submit")
              .attr("disabled", "disabled");
          }
        }
        if (_self.valid === true) {
          $(_self.form)
            .find("input:submit")
            .removeAttr("disabled");
        }
        */
        event.preventDefault();
      });
    }
  } else {
    throw "Não foram encontradas configurações para o validador de formulário!";
  }
}
