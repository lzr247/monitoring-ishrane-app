const moment = require("moment");

class StaticMethods{

    static calculateMaxIntakeCalsM(weight, height, birthYear, lostGainKg){
        var date = new Date().getFullYear();
        if(lostGainKg > 0){
            return parseInt(66 + (13.7 * weight) + (5 * height) + (6.8 * (date - birthYear)) * 1.2);
        }else{
            return parseInt(66 + (13.7 * weight) + (5 * height) + (6.8 * (date - birthYear)));
        }
    }

    static calculateMaxIntakeCalsF(weight, height, birthYear, lostGainKg){
        var date = new Date().getFullYear();
        if(lostGainKg > 0){
            return parseInt(655 + (9.6 * weight) + (1.8 * height) + (4.7 * (date - birthYear)) * 1.2);
        }else{
            return parseInt(655 + (9.6 * weight) + (1.8 * height) + (4.7 * (date - birthYear)));
        }
    }

    static calculateMaxIntakeProteins(maxCalories, percentageProteins){
        return parseInt(maxCalories * percentageProteins / 4);
    }

    static calculateMaxIntakeCarbs(maxCalories, percentageCarbs){
        return parseInt(maxCalories * percentageCarbs / 4);
    }

    static calculateMaxIntakeFats(maxCalories, percentageFats){
        return parseInt(maxCalories * percentageFats / 4);
    }

    static getCurrentDate(){
        return moment().format("DD/MM/YYYY");

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); 
        var yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;
        return today;
    }

}

module.exports = StaticMethods;