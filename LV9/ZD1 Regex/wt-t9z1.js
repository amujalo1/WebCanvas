
let a_reg = /^\d+_[a-zA-Z]{2,}$/
let b_reg = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/

function testInput(input, regex, desc) {
    if(regex.test(input)){
        console.log(`✅ "${input}" je validan ${desc}.`);
    } else {
        console.log(`❌ "${input}" NIJE validan ${desc}.`);
    }
}
const inputs = [
    { value: "123_abc", regex: a_reg, desc: "brojčana vrijednost sa donjom crtom i znakovima" },
    { value: "31-12-2025", regex: b_reg, desc: "datum u formatu dd-mm-yyyy" },
    { value: "10-11-1990", regex: b_reg, desc: "datum u formatu dd-mm-yyyy" },
    { value: "45_ab", regex: a_reg, desc: "brojčana vrijednost sa donjom crtom i znakovima" },
    { value: "01-13-2023", regex: b_reg, desc: "datum u formatu dd-mm-yyyy" }, // Invalid month
    { value: "123_", regex: a_reg, desc: "brojčana vrijednost sa donjom crtom i znakovima" } // Invalid (no extra characters)
];

inputs.forEach(input => {
    testInput(input.value, input.regex, input.desc);
});

