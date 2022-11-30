class ControllerClass {
    constructor(model) {
        this.model = model
    }

    _validarCpf(sCpf) {
        var soma;
        var resto;
        soma = 0;
        
        if (sCpf == "00000000000") return false;

        for (var i = 1; i <= 9; i++)
            soma = soma + parseInt(sCpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;

        if (resto == 10 || resto == 11) resto = 0;
        if (resto != parseInt(sCpf.substring(9, 10))) return false;

        soma = 0;
        for (i = 1; i <= 10; i++)
            soma = soma + parseInt(sCpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;

        if (resto == 10 || resto == 11) resto = 0;
        if (resto != parseInt(sCpf.substring(10, 11))) return false;
        return true;
    }

}
