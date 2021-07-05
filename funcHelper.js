/****************************
 * GENERIC GLOBAL FUNCTIONS *
 ****************************/

module.exports = {

    //convert textual month to the numeral form string or vice versa
    convertMonth: function (month) {
        var monthsConvObj = {
            'jan': '01',
            'feb': '02',
            'mar': '03',
            'apr': '04',
            'may': '05',
            'jun': '06',
            'jul': '07',
            'aug': '08',
            'sep': '09',
            'oct': '10',
            'nov': '11',
            'dec': '12'
        }
        if (typeof month === 'string') {
            if (month.length > 3) {
                month = month.substring(0, 3);
            }
            return monthsConvObj[month.toLowerCase()];
        }
        else if (typeof month === 'number') {
            for (var key in monthsConvObj) {
                if (parseInt(monthsConvObj[key]) === month) {
                    return key;
                }
            }
        }
        else {
            throw "Month value not supported!";
        }
    },

    //get the position of the nth occurrence of the substring value within a string haystack
    indexOfNth: function (strHaystack, strNeedle, nthOccurrence) {
        return strHaystack.split(strNeedle).slice(0, nthOccurrence).join(strNeedle).length;
    }
};