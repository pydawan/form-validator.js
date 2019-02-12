/**
 * Simples Validador de Formulários escrito em JavaScript.
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
  var error = null;
  this.field = field ? field : null;
  this.message = message ? message : "";
  if (field) {
    error = {
      field: field,
      message: message
    };
  }
  return error;
}

ValidationError.prototype.toString = function() {
  return "ValidationError: " + $(this.field).attr("id") + " " + this.message;
};

function ValidationResult(field, status) {
  var result = null;
  if (field) {
    result = {};
    result.field = field;
    result.status = status;
  }
  return result;
}

function RequiredFieldValidation(field, message) {
  var validationError = null;
  var validationResult = null;
  if (field) {
    var fieldId = $(field).attr("id");
    var fieldLabelId = 'label[for="' + fieldId + '"]';
    var fieldMessageId = fieldId + "-error-message";
    message = message
      ? message
      : fieldId + " é um campo de preenchimento obrigatório!";
    $("#" + fieldMessageId).remove();
    try {
      test($(field).val(), message);
      $(field).removeClass("invalid");
      $(fieldLabelId).removeClass("invalid");
      validationResult = new ValidationResult(field, true);
    } catch (error) {
      $(field).addClass("invalid");
      $(fieldLabelId).addClass("invalid");
      var validationMessage =
        '<span id="' +
        fieldMessageId +
        '" class="invalid">&nbsp;' +
        message +
        "</span>";
      $(field).after(validationMessage);
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

function LengthValidationValue(field, length, message) {
  var validationError = null;
  var validationResult = null;
  if (field) {
    var fieldId = $(field).attr("id");
    var fieldLabelId = 'label[for="' + fieldId + '"]';
    var fieldMessageId = fieldId + "-error-message";
    var minValue = null;
    var maxValue = null;
    if (length && length instanceof Object) {
      if (
        "min" in length &&
        length["min"] &&
        typeof (length["min"] === "number")
      ) {
        minValue = length["min"];
      } else if (
        "minimum" in length &&
        length["minimum"] &&
        typeof (length["minimum"] === "number")
      ) {
        minValue = length["minimum"];
      } else {
        minValue = null;
      }
      if (
        "max" in length &&
        length["max"] &&
        typeof (length["max"] === "number")
      ) {
        maxValue = length["max"];
      } else if (
        "maximum" in length &&
        length["maximum"] &&
        typeof (length["maximum"] === "number")
      ) {
        maxValue = length["maximum"];
      } else {
        maxValue = null;
      }
    }
  }
  if (message === "") {
    // Informou apenas min.
    if (minValue && !maxValue) {
      message =
        fieldId +
        " deve possuir no mínimo " +
        minValue +
        (minValue == 1 ? " caracter" : " caracteres") +
        "!";
    }
    // Informou apenas max.
    if (maxValue && !minValue) {
      message =
        fieldId +
        " deve possuir no máximo " +
        maxValue +
        (maxValue == 1 ? " caracter" : " caracteres") +
        "!";
    }
    // Informou min e max.
    if (minValue && maxValue) {
      message =
        fieldId +
        " deve possuir no mínimo " +
        minValue +
        (minValue == 1 ? " caracter" : " caracteres") +
        " e ";
      message +=
        "no máximo " +
        maxValue +
        (maxValue == 1 ? " caracter" : " caracteres") +
        "!";
    }
  }
  if ($(field).val()) {
    $("#" + fieldMessageId).remove();
    try {
      if (minValue && !maxValue) {
        test($(field).val().length >= minValue, message);
      } else if (maxValue && !minValue) {
        test($(field).val().length <= maxValue, message);
      } else if (minValue && maxValue) {
        test(
          $(field).val().length >= minValue &&
            $(field).val().length <= maxValue,
          message
        );
      } else {
      }
      $(field).removeClass("invalid");
      $(fieldLabelId).removeClass("invalid");
      validationResult = new ValidationResult(field, true);
    } catch (error) {
      $(field).addClass("invalid");
      $(fieldLabelId).addClass("invalid");
      var validationMessage =
        '<span id="' +
        fieldMessageId +
        '" class="invalid">&nbsp;' +
        message +
        "</span>";
      $(field).after(validationMessage);
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

function MinLengthFieldValidation(field, length, message) {
  var validationError = null;
  var validationResult = null;
  if (field) {
    var fieldId = $(field).attr("id");
    var fieldLabelId = 'label[for="' + fieldId + '"]';
    var fieldMessageId = fieldId + "-error-message";
    message = message
      ? message
      : fieldId +
        " deve possuir no mínimo " +
        length +
        (length == 1 ? " caracter" : " caracteres") +
        "!";
    if ($(field).val()) {
      $("#" + fieldMessageId).remove();
      try {
        test($(field).val().length >= length, message);
        $(field).removeClass("invalid");
        $(fieldLabelId).removeClass("invalid");
        validationResult = new ValidationResult(field, true);
      } catch (error) {
        $(field).addClass("invalid");
        $(fieldLabelId).addClass("invalid");
        var validationMessage =
          '<span id="' +
          fieldMessageId +
          '" class="invalid">&nbsp;' +
          message +
          "</span>";
        $(field).after(validationMessage);
        validationResult = new ValidationResult(field, false);
        validationError = new ValidationError(field, error);
      }
    }
  }
  this.error = function() {
    return validationError;
  };
  this.result = function() {
    return validationResult;
  };
}

function MaxLengthFieldValidation(field, length, message) {
  var validationError = null;
  var validationResult = null;
  if (field) {
    var fieldId = $(field).attr("id");
    var fieldLabelId = 'label[for="' + fieldId + '"]';
    var fieldMessageId = fieldId + "-error-message";
    message = message
      ? message
      : fieldId +
        " deve possuir no máximo " +
        length +
        (length == 1 ? " caracter" : " caracteres") +
        "!";
    if ($(field).val()) {
      $("#" + fieldMessageId).remove();
      try {
        test($(field).val().length <= length, message);
        $(field).removeClass("invalid");
        $(fieldLabelId).removeClass("invalid");
        validationResult = new ValidationResult(field, true);
      } catch (error) {
        $(field).addClass("invalid");
        $(fieldLabelId).addClass("invalid");
        var validationMessage =
          '<span id="' +
          fieldMessageId +
          '" class="invalid">&nbsp;' +
          message +
          "</span>";
        $(field).after(validationMessage);
        validationResult = new ValidationResult(field, false);
        validationError = new ValidationError(field, error);
      }
    }
  }
  this.error = function() {
    return validationError;
  };
  this.result = function() {
    return validationResult;
  };
}

function PatternFieldValidation(field, pattern, message) {
  var validationError = null;
  var validationResult = null;
  field = field ? field : null;
  pattern = pattern && pattern instanceof RegExp ? pattern : null;
  if (field && pattern) {
    var fieldId = $(field).attr("id");
    var fieldLabelId = 'label[for="' + fieldId + '"]';
    var fieldMessageId = fieldId + "-error-message";
    message = message
      ? message
      : fieldId + " não corresponde ao padrão " + pattern + "!";
    // 1. Verificar se algum valor foi informado para ser comparado com o padrão textual.
    // 1.1 Caso não tenha sido informado um valor trata-se de uma validação required.
    if ($(field).val() !== "") {
      var expected = true;
      var obtained = pattern.test($(field).val());
      $("#" + fieldMessageId).remove();
      try {
        test(obtained === expected, message);
        $(field).removeClass("invalid");
        $(fieldLabelId).removeClass("invalid");
        validationResult = new ValidationResult(field, true);
      } catch (error) {
        $(field).addClass("invalid");
        $(fieldLabelId).addClass("invalid");
        var validationMessage =
          '<span id="' +
          fieldMessageId +
          '" class="invalid">&nbsp;' +
          message +
          "</span>";
        $(field).after(validationMessage);
        validationResult = new ValidationResult(field, false);
        validationError = new ValidationError(field, error);
      }
    }
  } else {
    if (!field) {
      throw "Nenhum field informado!";
    }
    if (!pattern) {
      throw "Nenhum pattern informado!";
    }
  }
  this.error = function() {
    return validationError;
  };
  this.result = function() {
    return validationResult;
  };
}

function FormValidator(settings) {
  var self = this;
  self.settings = null;
  self.form = null;
  self.formFieldRules = [];
  self.validForm = false;
  var setting = null;
  var rule = null;
  var formFieldRule = null;
  var formFieldRules = [];
  var formFieldValidation = null;
  var formFieldValidationEvents = null;
  var formFieldValidationEvent = null;
  var formValidationFieldsEvents = [];
  var formValidationFieldEvents = null;
  if (settings && settings instanceof Object) {
    self.settings = settings;
    for (var i in settings) {
      setting = settings[i] ? settings[i] : null;
      if (setting) {
        if (i === "form" && typeof setting === "string") {
          self.form = "#" + settings["form"];
        } else {
          // TODO - lançar exceção avisando que a propriedade não é uma string.
        }
        if (i === "rules" && setting instanceof Object) {
          for (var j in setting) {
            // j é o field do form.
            rule = setting[j] ? setting[j] : null;
            if (rule) {
              formFieldRule = {};
              formFieldRule[j] = {};
              for (var k in rule) {
                formFieldValidation = rule[k] ? rule[k] : null;
                if (formFieldValidation) {
                  formFieldRule[j][k] = formFieldValidation;
                  for (var formFieldValidationSetting in formFieldValidation) {
                    if (formFieldValidationSetting === "events") {
                      if (
                        formFieldValidation["events"] &&
                        formFieldValidation["events"] instanceof Array
                      ) {
                        formFieldValidationEvents =
                          formFieldValidation["events"];
                        if (formFieldValidationEvents.length > 0) {
                          var field = j;
                          var events = ("" + formFieldValidationEvents).replace(
                            /,/g,
                            " "
                          );
                          if (events) {
                            (function(field, events) {
                              $(document).on(events, field, function(event) {
                                //self.validate();
                                self.validateField(field);
                              });
                            })("#" + field, "" + events);
                          }
                        }
                      }
                    }
                  }
                }
              }
              if (self.formFieldRules.indexOf(formFieldRule) === -1) {
                self.formFieldRules.push(formFieldRule);
              }
            }
          }
        }
      }
    }
  } else {
    throw "A configuração do validador de formulário não foi informada!";
  }
  this.validateField = function(field) {
    if (field) {
      var $field = $(field);
      var fieldName = field.replace("#", "");
      var fieldValidationSettings = self.settings["rules"][fieldName];
      if (fieldValidationSettings) {
        var fieldValidationSetting = null;
        var fieldValidationValue = null;
        var fieldValidationMessage = null;
        var requiredFieldValidation = null;
        var patternFieldValidation = null;
        var minLengthFieldValidation = null;
        var maxLengthFieldValidation = null;
        var lengthFieldValidation = null;
        var validationResult = null;
        for (var fieldValidation in fieldValidationSettings) {
          fieldValidationSetting = fieldValidationSettings[fieldValidation];
          fieldValidationValue = fieldValidationSetting["value"];
          fieldValidationMessage = fieldValidationSetting["message"];
          if (fieldValidation === "required") {
            if (fieldValidationValue === true) {
              requiredFieldValidation = new RequiredFieldValidation(
                field,
                fieldValidationMessage
              );
              validationResult = requiredFieldValidation.result();
            }
          }
          if (fieldValidation === "pattern") {
            if (fieldValidationValue instanceof RegExp) {
              patternFieldValidation = new PatternFieldValidation(
                field,
                fieldValidationValue,
                fieldValidationMessage
              );
              validationResult = patternFieldValidation.result();
            }
          }
          if (fieldValidation === "minlength") {
            if (typeof fieldValidationValue === "number") {
              minLengthFieldValidation = new MinLengthFieldValidation(
                field,
                fieldValidationValue,
                fieldValidationMessage
              );
              validationResult = minLengthFieldValidation.result();
            }
          }
          if (fieldValidation === "maxlength") {
            if (typeof fieldValidationValue === "number") {
              maxLengthFieldValidation = new MaxLengthFieldValidation(
                field,
                fieldValidationValue,
                fieldValidationMessage
              );
              validationResult = maxLengthFieldValidation.result();
            }
          }
          if (validationResult.status === false) {
            self.validForm = false;
            this.disableSubmitButton();
            return;
          } else {
            this.enableSubmitButton();
          }
        }
      }
    }
  };
  this.enableSubmitButton = function() {
    $(self.form)
      .find("input:submit")
      .removeAttr("disabled");
  };
  this.disableSubmitButton = function() {
    $(self.form)
      .find("input:submit")
      .attr("disabled", "disabled");
  };
  this.validate = function() {
    self.form = self.form && typeof self.form === "string" ? self.form : null;
    self.formValidations =
      self.formValidations && self.formValidations instanceof Object
        ? self.formValidations
        : null;
    var formFieldRule = null;
    var formField = null;
    var requiredFieldValidation = null;
    var patternFieldValidation = null;
    var minLengthFieldValidation = null;
    var maxLengthFieldValidation = null;
    var lengthFieldValidation = null;
    var formFieldValidationEvents = null;
    var formFieldValidationEvent = null;
    var formFieldValidationValue = null;
    var formFieldValidationMessage = null;
    var $field = null;
    var validationResults = [];
    for (var rule in self.formFieldRules) {
      formFieldRule = self.formFieldRules[rule]
        ? self.formFieldRules[rule]
        : null;
      if (formFieldRule && formFieldRule instanceof Object) {
        for (var field in formFieldRule) {
          formField = field;
          $field = $(self.form + " #" + field);
          var formFieldValidation = formFieldRule[field]
            ? formFieldRule[field]
            : null;
          if (formFieldValidation && formFieldValidation instanceof Object) {
            for (var validation in formFieldValidation) {
              var formFieldValidationSettings = formFieldValidation[validation]
                ? formFieldValidation[validation]
                : null;
              if (
                formFieldValidationSettings &&
                formFieldValidationSettings instanceof Object
              ) {
                for (var setting in formFieldValidationSettings) {
                  var formFieldValidationSetting = formFieldValidationSettings[
                    setting
                  ]
                    ? formFieldValidationSettings[setting]
                    : null;
                  var formFieldValidationResult = null;
                  if (formFieldValidationSetting) {
                    if (
                      setting === "events" &&
                      formFieldValidationSetting instanceof Array &&
                      formFieldValidationSetting.length > 0
                    ) {
                      formFieldValidationEvents = formFieldValidationSetting;
                      for (var event in formFieldValidationEvents) {
                        formFieldValidationEvent = formFieldValidationEvents[
                          event
                        ]
                          ? formFieldValidationEvents[event]
                          : null;
                      }
                    }
                    if (setting === "value") {
                      formFieldValidationValue = formFieldValidationSetting;
                    }
                    if (
                      setting === "message" &&
                      typeof formFieldValidationSetting === "string"
                    ) {
                      formFieldValidationMessage = formFieldValidationSetting;
                    }
                    if (validation === "required") {
                      if (
                        formFieldValidationValue &&
                        typeof formFieldValidationValue === "boolean"
                      ) {
                        requiredFieldValidation = new RequiredFieldValidation(
                          $field,
                          formFieldValidationMessage
                        );
                        formFieldValidationResult = requiredFieldValidation.result();
                      }
                    }
                    if (validation === "pattern") {
                      if (
                        formFieldValidationValue &&
                        formFieldValidationValue instanceof RegExp
                      ) {
                        patternFieldValidation = new PatternFieldValidation(
                          $field,
                          formFieldValidationValue,
                          formFieldValidationMessage
                        );
                        formFieldValidationResult = patternFieldValidation.result();
                      }
                    }
                    if (validation === "minlength") {
                      if (
                        formFieldValidationValue &&
                        typeof formFieldValidationValue === "number"
                      ) {
                        minLengthFieldValidation = new MinLengthFieldValidation(
                          $field,
                          formFieldValidationValue,
                          formFieldValidationMessage
                        );
                        formFieldValidationResult = minLengthFieldValidation.result();
                      }
                    }
                    if (validation === "maxlength") {
                      if (
                        formFieldValidationValue &&
                        typeof formFieldValidationValue === "number"
                      ) {
                        maxLengthFieldValidation = new MaxLengthFieldValidation(
                          $field,
                          formFieldValidationValue,
                          formFieldValidationMessage
                        );
                        formFieldValidationResult = maxLengthFieldValidation.result();
                      }
                    }
                    if (validation === "length") {
                      if (
                        formFieldValidationValue &&
                        formFieldValidationValue instanceof Object
                      ) {
                        lengthFieldValidation = new LengthValidationValue(
                          $field,
                          formFieldValidationValue,
                          formFieldValidationMessage
                        );
                        formFieldValidationResult = lengthFieldValidation.result();
                      }
                    }
                    if (
                      formFieldValidationResult &&
                      "status" in formFieldValidationResult
                    ) {
                      validationResults.push(
                        formFieldValidationResult["status"]
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
    for (var i in validationResults) {
      self.validForm = validationResults[i];
      if (self.validForm === false) {
        break;
      }
    }
    if (self.validForm === true) {
      self.enableSubmitButton();
    } else {
      self.disableSubmitButton();
    }
  };
  this.reset = function() {
    if (self.form) {
      $(self.form)
        .find(".invalid")
        .each(function(i, e) {
          $(e).removeClass("invalid");
        });
      $('span[id$="-error-message"]').remove();
      $(self.form)
        .find("input:submit")
        .removeAttr("disabled");
    }
  };
}
