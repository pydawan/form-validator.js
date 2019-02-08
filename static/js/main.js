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
    var fieldMessageId = "#" + fieldId + "-error-message";
    message = message
      ? message
      : fieldId + " é um campo de preenchimento obrigatório!";
    $(fieldMessageId).remove();
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

function PatternFieldValidation(field, pattern, message) {
  var validationError = null;
  var validationResult = null;
  field = field ? field : null;
  pattern = pattern && pattern instanceof RegExp ? pattern : null;
  if (field && pattern) {
    var fieldId = $(field).attr("id");
    var fieldLabelId = 'label[for="' + fieldId + '"]';
    var fieldMessageId = "#" + fieldId + "-error-message";
    message = message
      ? message
      : fieldId + " não corresponde ao padrão " + pattern + "!";
    // 1. Verificar se algum valor foi informado para ser comparado com o padrão textual.
    // 1.1 Caso não tenha sido informado um valor trata-se de uma validação required.
    if ($(field).val() !== "") {
      var expected = true;
      var obtained = pattern.test($(field).val());
      $(fieldMessageId).remove();
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
  self.formFields = [];
  self.formValidations = [];
  self.formValidationResults = {};
  self.validForm = false;
  if (settings && settings instanceof Object) {
    for (var setting in settings) {
      //console.log(setting + ": " + settings[setting]);
      if (setting === "form") {
        self.form = "#" + settings["form"];
      }
      if (setting === "rules") {
        if (settings["rules"] && settings["rules"] instanceof Object) {
          var rules = settings["rules"];
          var fieldSettings = null;
          // Itera através dos nomes dos campos do formulário.
          for (var rule in rules) {
            self.formFields.push(rule);
            fieldSettings = rules[rule];
            if (fieldSettings && fieldSettings instanceof Object) {
              for (var fieldSetting in fieldSettings) {
                //console.log(fieldSetting);
                //console.log(fieldSettings[fieldSetting]);
              }
            }
          }
        }
      }
    }
  } else {
    throw "A configuração do validador de formulário não foi informada!";
  }
  this.validate = function() {
    if (self.form) {
      for (var formField in self.formFields) {
        console.log(self.formFields[formField]);
      }
    }
  };
  this.validate();
}
