// This is a node example, for use of kimmy.js in the browser, do not include 
// the next (... = require...) line, instead load the library in your 
// document's <head> section as 
// <script src="https://cdn.jsdelivr.net/npm/@jobovy/kimmy"></script>
var Kimmy = require("@jobovy/kimmy")
// Setup the default model
var oz= new Kimmy.OneZone();
// Define a logarithmically-spaced array of times to compute the evolution at
var Ntimes= 51;
var min_age= 0.001; // Gyr
var max_age= 12.5; // Gyr
var log10_min_age= Math.log10(min_age);
var log10_max_age= Math.log10(max_age);
var times= Array.apply(null, {length: Ntimes}).map(Number.call, Number).map(x => log10_min_age+x*(log10_max_age-log10_min_age)/(Ntimes-1.)).map(x => Math.pow(10.,x));
// Obtain the evolution
var OFe= oz.O_Fe(times);
var FeH= oz.Fe_H(times);
// Print (or plot or do whatever you want with the output)
console.log(FeH[Ntimes-1],OFe[Ntimes-1]);
// Get the [Fe/H] distribution
var FeH_dist= oz.Fe_H_DF(0.1,-3.5,1.0); // inputs are dFeH, FeHmin, FeHmax
console.log(FeH_dist);
