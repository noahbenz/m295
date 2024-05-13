function verdoppeln(zahl, callback) {
    let ergebnis = zahl * 2;
    callback(ergebnis);
}

verdoppeln(5, function (ergebnis) {
    console.log("Das Ergebnis ist: ", ergebnis);
});