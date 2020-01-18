# kimmy.js
Javascript version of kimmy, Galactic chemical evolution in python

[![npm version](https://badge.fury.io/js/%40jobovy%2Fkimmy.svg)](https://badge.fury.io/js/%40jobovy%2Fkimmy)
[![jsDelivr](https://badgen.net/jsdelivr/v/npm/@jobovy/kimmy)](https://www.jsdelivr.com/package/npm/@jobovy/kimmy)

## Overview

This is a stand-alone Javascript version of the
[kimmy](https://github.com/jobovy/kimmy) Python library for Galactic
chemical evolution. ``kimmy.js`` replicates all of the functionality
in ``kimmy.py`` as of 01/17/2020.

## Author

Jo Bovy (University of Toronto): bovy - at - astro - dot - utoronto - dot - ca

## Usage

Load the library, e.g., from ``jsDelivr`` using
```
<script src="https://cdn.jsdelivr.net/npm/@jobovy/kimmy"></script>
```
for the latest version or specify the version with (update ``1.1.0`` to later versions as necessary)
```
<script src="https://cdn.jsdelivr.net/npm/@jobovy/kimmy@1.1.0"></script>
```

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
var max_age= 12.5; // Gyr
var log10_min_age= Math.log10(min_age);
var log10_max_age= Math.log10(max_age);
var times= Array.apply(null, {length: Ntimes}).map(Number.call, Number).map\
(x => log10_min_age+x*(log10_max_age-log10_min_age)/(Ntimes-1.)).map(x => Math.pow(10.,x));
// Obtain the evolution
var OFe= oz.O_Fe(times);
var FeH= oz.Fe_H(times);
```

You can also compute the distribution of [Fe/H], [O/H], and [O/Fe],
for example as
```
var FeH_dist= oz.Fe_H_DF(0.1,-3.5,1.0); // inputs are dFeH, FeHmin, FeHmax
```
This returns a list with the element being the [Fe/H] bins and the
second the distribution.

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

## Publishing a new version of this package

Follow the following steps:

* Update the version in ``package.json``
* Create a new git tag for this version: ``git tag vX.X.X``
* Package up for npm: ``npm pack``, check that no extraneous files are included
* Log into npm: ``npm login``
* Publish to npm: ``npm publish``
* Done!