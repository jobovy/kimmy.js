# kimmy.js
Javascript version of kimmy, Galactic chemical evolution in python

[![npm version](https://badge.fury.io/js/%40jobovy%2Fkimmy.svg)](https://badge.fury.io/js/%40jobovy%2Fkimmy)

## Overview

This is a stand-alone Javascript version of the
[kimmy](https://github.com/jobovy/kimmy) Python library for Galactic
chemical evolution. ``kimmy.js`` replicates all of the functionality
in ``kimmy.py`` as of 12/25/2019.

## Author

Jo Bovy (University of Toronto): bovy - at - astro - dot - utoronto - dot - ca

## Usage

Currently, the only implemented feature is a simple one-zone chemical
model with two elements ``O`` (for oxygen) and ``Fe`` (for
iron). Initialize this model as
```
var oz= new Kimmy.OneZone();
```
then for example compute the evolution of the default model and obtain
the [O/Fe] vs. [Fe/H] sequence, do
```
// Define a logarithmically-spaced array of times to compute the evolution at
var Ntimes= 51;
var min_age= 0.001; // Gyr
var max_age= 12.; // Gyr
var log10_min_age= Math.log10(min_age);
var log10_max_age= Math.log10(max_age);
var times= Array.apply(null, {length: Ntimes}).map(Number.call, Number).map\
(x => log10_min_age+x*(log10_max_age-log10_min_age)/(Ntimes-1.)).map(x => Math.pow(10.,x));
// Obtain the evolution
var OFe= oz.O_Fe(times);
var FeH= oz.Fe_H(times);
```

You can directly update the main parameters of the model and the model
will be re-computed. For example, to change the outflow parameter
``eta`` do
```
oz.eta= 4.
// Re-obtain the evolution
var OFe= oz.O_Fe(times);
var FeH= oz.Fe_H(times);
```
Keep in mind that once you change a parameter, it remains changed in
the model.