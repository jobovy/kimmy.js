(function() {
    var Kimmy = {};

    ////////////// OneZone model from Weinberg et al. (2017)  /////////////////
    var _OneZone_defaults= {'eta':2.5,
			    'tau_SFE':   1.,   //Gyr
			    'tau_SFH':   6.,   //Gyr,
			    'tau_Ia':    1.5,  //Gyr,
			    'min_dt_Ia': 0.15, //Gyr,
			    'sfh':       'exp',
			    'mCC_O':     0.015,
			    'mCC_Fe':    0.0012,
			    'mIa_O':     0.,
			    'mIa_Fe':    0.0017,
			    'r':         0.4,
			    'tau_Ia_2':  null,
			    'frac_Ia_2': 0.522,
			    'solar_O':   8.69,
			    'solar_Fe':  7.47,
			    // MDF calculation defaults
                            'dFeH':      0.05,
                            'FeHmin':    -2.0,
                            'FeHmax':    0.5,
                            'dOH':      0.05,
                            'OHmin':    -2.0,
                            'OHmax':    0.5,
                            'dOFe':      0.02,
                            'OFemin':    -0.1,
                            'OFemax':    0.5,
                            'Ntimes':    2001,
                            'min_age':   0.001,//Gyr
                            'max_age':   12.5,  //Gyr
    }

    Kimmy.OneZone = function (eta,
			      tau_SFE,
			      tau_SFH,
			      tau_Ia,
			      min_dt_Ia,
			      sfh,
			      mCC_O,
			      mCC_Fe,
			      mIa_O,
			      mIa_Fe,
			      r,
			      tau_Ia_2,
			      frac_Ia_2,
			      solar_O,
			      solar_Fe) {
	// Set default parameters
	eta       = ((typeof eta !== 'undefined') ? 
		     eta : _OneZone_defaults['eta']);
	tau_SFE   = ((typeof tau_SFE !== 'undefined') ? 
		     tau_SFE  : _OneZone_defaults['tau_SFE']);
	tau_SFH   = ((typeof tau_SFH !== 'undefined') ?  
		     tau_SFH : _OneZone_defaults['tau_SFH']);
	tau_Ia    = ((typeof tau_Ia !== 'undefined') ? 
		     tau_Ia : _OneZone_defaults['tau_Ia']);
	min_dt_Ia = ((typeof min_dt_Ia !== 'undefined') ? 
		     min_dt_Ia : _OneZone_defaults['min_dt_Ia']);
	sfh       = ((typeof sfh !== 'undefined') ? 
		     sfh : _OneZone_defaults['sfh']);
	mCC_O     = ((typeof mCC_O !== 'undefined') ?
		     mCC_O : _OneZone_defaults['mCC_O']);
	mCC_Fe    = ((typeof mCC_Fe !== 'undefined') ? 
		     mCC_Fe : _OneZone_defaults['mCC_Fe']);
	mIa_O     = ((typeof mIa_O !== 'undefined') ? 
		     mIa_O : _OneZone_defaults['mIa_O']);
	mIa_Fe    = ((typeof mIa_Fe !== 'undefined') ? 
		     mIa_Fe : _OneZone_defaults['mIa_Fe']);
	r         = ((typeof r !== 'undefined') ? 
		     r : _OneZone_defaults['r']);
	tau_Ia_2  = ((typeof tau_Ia_2 !== 'undefined') ? 
		     tau_Ia_2 : _OneZone_defaults['tau_Ia_2']);
	frac_Ia_2 = ((typeof frac_Ia_2 !== 'undefined') ? 
		     frac_Ia_2 : _OneZone_defaults['frac_Ia_2']);
	solar_O   = ((typeof solar_O !== 'undefined') ? 
		     solar_O : _OneZone_defaults['solar_O']);
	solar_Fe  = ((typeof solar_Fe !== 'undefined') ? 
		     solar_Fe : _OneZone_defaults['solar_Fe']);
	// Initialize
	return new Kimmy.OneZone.ozclass.init(eta,tau_SFE,tau_SFH,tau_Ia,
					      min_dt_Ia,sfh,mCC_O,mCC_Fe,
					      mIa_O,mIa_Fe,r,tau_Ia_2,
					      frac_Ia_2,solar_O,solar_Fe);
    }
    Kimmy.OneZone.ozclass= Kimmy.OneZone.prototype = {
	init: function(eta,tau_SFE,tau_SFH,tau_Ia,
		       min_dt_Ia,sfh,mCC_O,mCC_Fe,
		       mIa_O,mIa_Fe,r,tau_Ia_2,
		       frac_Ia_2,solar_O,solar_Fe) {
	    // Set model parameters
	    this._eta= eta;
	    this._tau_SFE= tau_SFE;
	    this._tau_SFH= tau_SFH;
	    this._tau_Ia= tau_Ia;
	    this._min_dt_Ia= min_dt_Ia;
	    this._sfh= sfh;
	    this._mCC_O= mCC_O;
	    this._mCC_Fe= mCC_Fe;
	    this._mIa_O= mIa_O;
	    this._mIa_Fe= mIa_Fe;
	    this._r= r;
	    this._tau_Ia_2= tau_Ia_2;
	    this._frac_Ia_2= frac_Ia_2;
	    this._solar_O= solar_O;
	    this._solar_Fe= solar_Fe;
	    // Calculate the model
	    this._recalc_model();
	    this._calc_solar();
	},
	// Function to print the model (useful for debugging)
	print(){
	    return `eta = ${this._eta}
tau_SFE = ${this._tau_SFE}`;
	},
	// getters and setters
	get eta() {
	    return this._eta;
	},
	set eta(val) {
	    this._eta= val;
	    this._recalc_model();
	},
	get tau_SFE() {
	    return this._tau_SFE;
	},
	set tau_SFE(val) {
	    this._tau_SFE= val;
	    this._recalc_model();
	},
	get tau_SFH() {
	    return this._tau_SFH;
	},
	set tau_SFH(val) {
	    this._tau_SFH= val;
	    this._recalc_model();
	},
	get tau_Ia() {
            return this._tau_Ia;
        },
        set tau_Ia(val) {
            this._tau_Ia= val;
	    this._recalc_model();
        },
	get min_dt_Ia() {
            return this._min_dt_Ia;
        },
        set min_dt_Ia(val) {
            this._min_dt_Ia= val;
	    this._recalc_model();
        },
	get sfh() {
            return this._sfh;
        },
        set sfh(val) {
            this._sfh= val;
        },
	get mCC_O() {
            return this._mCC_O;
        },
        set mCC_O(val) {
            this._mCC_O= val;
	    this._recalc_model();
        },
	get mCC_Fe() {
            return this._mCC_Fe;
        },
        set mCC_Fe(val) {
            this._mCC_Fe= val;
	    this._recalc_model();
        },
	get mIa_O() {
            return this._mIa_O;
        },
        set mIa_O(val) {
            this._mIa_O= val;
	    this._recalc_model();
        },
	get mIa_Fe() {
            return this._mIa_Fe;
        },
        set mIa_Fe(val) {
            this._mIa_Fe= val;
	    this._recalc_model();
        },
	get r() {
            return this._r;
        },
        set r(val) {
            this._r= val;
	    this._recalc_model();
        },
	get tau_Ia_2() {
            return this._tau_Ia_2;
        },
        set tau_Ia_2(val) {
            this._tau_Ia_2= val;
	    this._recalc_model();
        },
	get frac_Ia_2() {
            return this._frac_Ia_2;
        },
        set frac_Ia_2(val) {
            this._frac_Ia_2= val;
	    this._recalc_model();
        },
	get solar_O() {
            return this._solar_O;
        },
        set solar_O(val) {
            this._solar_O= val;
	    this._calc_solar();
        },
	get solar_Fe() {
            return this._solar_Fe;
        },
        set solar_Fe(val) {
            this._solar_Fe= val;
	    this._calc_solar();
        },
	// Function to calculate model internals
	_recalc_model() {
	    this._update_timescales();
	    this._calc_equilibrium();
	},
	_update_timescales() {
	    this._tau_dep= this.tau_SFE/(1.+this.eta-this.r);
	    this._tau_dep_SFH= 1./(1./this._tau_dep-1./this.tau_SFH);
	    this._tau_dep_Ia= 1./(1./this._tau_dep-1./this.tau_Ia);
	    this._tau_Ia_SFH= 1./(1./this.tau_Ia-1./this.tau_SFH);
	    if ( this.tau_Ia_2 ) {
		this._tau_dep_Ia_2= 1./(1./this._tau_dep-1./this.tau_Ia_2);
		this._tau_Ia_SFH_2= 1./(1./this.tau_Ia_2-1./this.tau_SFH);
	    }
	},
	_calc_equilibrium() {
	    this._ZO_CC_eq= this.mCC_O*this._tau_dep_SFH/this.tau_SFE;
	    this._ZO_Ia_eq= (this.mIa_O*this._tau_dep_SFH/this.tau_SFE
			     *this._tau_Ia_SFH/this.tau_Ia
			     *Math.exp(this.min_dt_Ia/this.tau_SFH));
	    this._ZFe_CC_eq= this.mCC_Fe*this._tau_dep_SFH/this.tau_SFE;
	    this._ZFe_Ia_eq= (this.mIa_Fe*this._tau_dep_SFH/this.tau_SFE
			      *this._tau_Ia_SFH/this.tau_Ia
			      *Math.exp(this.min_dt_Ia/this.tau_SFH));
	    if ( this.tau_Ia_2 ) {
		this._ZO_Ia_eq*= (1.-this.frac_Ia_2);
		this._ZFe_Ia_eq*= (1.-this.frac_Ia_2);
		this._ZO_Ia_eq_2= (this.frac_Ia_2*this.mIa_O
				   *this._tau_dep_SFH/this.tau_SFE
				   *this._tau_Ia_SFH_2/this.tau_Ia_2
				   *Math.exp(this.min_dt_Ia/this.tau_SFH));
		this._ZFe_Ia_eq_2= (this.frac_Ia_2*this.mIa_Fe
				    *this._tau_dep_SFH/this.tau_SFE
				    *this._tau_Ia_SFH_2/this.tau_Ia_2
				    *Math.exp(this.min_dt_Ia/this.tau_SFH));
	    }
	},
	_calc_solar() {
	    this._logZO_solar= -2.25+this.solar_O-8.69;
	    this._logZFe_solar= -2.93+this.solar_Fe-7.47;
	},
	// Functions to calculate time evolution
	_evol_CC(times) {
	    if ( this.sfh == 'exp' )
		return times.map(t => 1.-Math.exp(-t/this._tau_dep_SFH));
	    else 
		return times.map(t => (1.-this._tau_dep_SFH/t
				       *(1.-Math.exp(-t/this._tau_dep_SFH))));
	},
	_evol_Ia(times,tau_dep_Ia,tau_Ia_SFH) {
	    if ( this.sfh == 'exp' )
		return times.map(t => {
			var dt= t-this.min_dt_Ia;
			return dt > 0. ? (1.-Math.exp(-dt/this._tau_dep_SFH)
					  -tau_dep_Ia/this._tau_dep_SFH
					  *(Math.exp(-dt/tau_Ia_SFH)
					    -Math.exp(-dt/this._tau_dep_SFH)))
			: 0.});
	    else
		return times.map(t => {
			var dt= t-this.min_dt_Ia;
			return dt > 0. ? (tau_Ia_SFH/t
					  *(dt/tau_Ia_SFH+tau_dep_Ia
					    /this._tau_dep_SFH
					    *Math.exp(-dt/tau_Ia_SFH)
					    +(1.+this._tau_dep_SFH/tau_Ia_SFH
					      -tau_dep_Ia/this._tau_dep_SFH)
					    *Math.exp(-dt/this._tau_dep_SFH)
					    -(1.+this._tau_dep_SFH/tau_Ia_SFH)))
			: 0.});
	},
	O_H(times) {
	    // CCSNe contribution
	    var ZO_t_CC= this._evol_CC(times).map(x => this._ZO_CC_eq*x);
	    // Ia contribution
	    var ZO_t_Ia= this._evol_Ia(times,this._tau_dep_Ia,
				       this._tau_Ia_SFH).map(x => this._ZO_Ia_eq*x);
	    if ( this.tau_Ia_2 ) {
		var ZO_t_Ia_2= this._evol_Ia(times,this._tau_dep_Ia_2,
					 this._tau_Ia_SFH_2).map(x => this._ZO_Ia_eq_2*x);
		return ZO_t_CC.map( (x,i) => Math.log10(x + ZO_t_Ia[i] 
							+ ZO_t_Ia_2[i]) 
				    -this._logZO_solar);
	    }
	    else {
		return ZO_t_CC.map( (x,i) => Math.log10(x + ZO_t_Ia[i]) 
				    -this._logZO_solar);
	    }
	},
	Fe_H(times) {
	    // CCSNe contribution
	    var ZFe_t_CC= this._evol_CC(times).map(x => this._ZFe_CC_eq*x);
	    // Ia contribution
	    var ZFe_t_Ia= this._evol_Ia(times,this._tau_dep_Ia,
					this._tau_Ia_SFH).map(x => this._ZFe_Ia_eq*x);
	    if ( this.tau_Ia_2 ) {
		var ZFe_t_Ia_2= this._evol_Ia(times,this._tau_dep_Ia_2,
					      this._tau_Ia_SFH_2).map(x => this._ZFe_Ia_eq_2*x);
		return ZFe_t_CC.map( (x,i) => Math.log10(x + ZFe_t_Ia[i] 
							+ ZFe_t_Ia_2[i]) 
				    -this._logZFe_solar);
	    }
	    else {
		return ZFe_t_CC.map( (x,i) => Math.log10(x + ZFe_t_Ia[i]) 
				    -this._logZFe_solar);
	    }
	},
	O_Fe(times) {
	    var tFe_H= this.Fe_H(times);
	    return this.O_H(times).map( (x,i) => x - tFe_H[i]);
	},
	// Generic function to compute the DF of a certain element (ratio)
	_calc_XDF(elem_func,dFeH,FeHmin,FeHmax,Ntimes,min_age,max_age) {
	    // Set defaults
	    Ntimes= ((typeof Ntimes !== 'undefined') 
		     ? Ntimes : _OneZone_defaults['Ntimes']);
	    min_age= ((typeof min_age !== 'undefined') 
		     ? min_age : _OneZone_defaults['min_age']);
	    max_age= ((typeof max_age !== 'undefined') 
		     ? max_age : _OneZone_defaults['max_age']);
	    var nFeHbins= Math.round((FeHmax-FeHmin)/dFeH);
	    // Calculate [Fe/H] on a fine grid of times
	    // Setup times where the model is calculated at
	    var log10_min_age= Math.log10(min_age);
	    var log10_max_age= Math.log10(max_age);
	    var times= (Array.apply(null, {length: Ntimes})
			.map(Number.call, Number)
			.map(x => log10_min_age+x
			     *(log10_max_age-log10_min_age)/(Ntimes-1.))
			.map(x => Math.pow(10.,x)));    
	    // Calculate the element ratio whose distribution we want
	    var tX= elem_func(times);
	    // Now need to histogram these with weights SFR x times
	    var tSFRlnt;
	    if ( this.sfh == 'exp' )
		tSFRlnt= times.map(x => x*Math.exp(-x/this.tau_SFH));
	    else
		tSFRlnt= times.map(x => x*x*Math.exp(-x/this.tau_SFH));	
	    var binFeH= tX.map(x => Math.round((x-FeHmin)/dFeH));
	    // An array of zeros for accumulating the results
	    var out= (Array.apply(null, {length: nFeHbins}).map(x=>0.));
	    for (var ii = 0; ii < Ntimes; ii++) {
		if ( binFeH[ii] >= 0 && binFeH[ii] < nFeHbins )
		    out[binFeH[ii]]= out[binFeH[ii]] + tSFRlnt[ii];
	    }
	    // Normalize
	    out= out.map(x => x/out.reduce((a, b) => a + b, 0)/dFeH);
	    return [(Array.apply(null, {length: nFeHbins})
		     .map(Number.call, Number)
		     .map(x => FeHmin+dFeH/2.+x*(FeHmax-FeHmin)/nFeHbins)),
		    out];
	},
	Fe_H_DF(dFeH,FeHmin,FeHmax,Ntimes,min_age,max_age) {
	    // Set defaults
	    dFeH= ((typeof dFeH !== 'undefined') ? 
		   dFeH : _OneZone_defaults['dFeH']);
	    FeHmin= ((typeof FeHmin !== 'undefined') 
		     ? FeHmin : _OneZone_defaults['FeHmin']);
	    FeHmax= ((typeof FeHmax !== 'undefined') 
		     ? FeHmax : _OneZone_defaults['FeHmax']);
	    return this._calc_XDF(t => this.Fe_H(t),
				  dFeH,FeHmin,FeHmax,Ntimes,min_age,max_age);
	},
	O_H_DF(dOH,OHmin,OHmax,Ntimes,min_age,max_age) {
	    // Set defaults
	    dOH= ((typeof dOH !== 'undefined') ? 
		  dOH : _OneZone_defaults['dOH']);
	    OHmin= ((typeof OHmin !== 'undefined') 
		     ? OHmin : _OneZone_defaults['OHmin']);
	    OHmax= ((typeof OHmax !== 'undefined') 
		     ? OHmax : _OneZone_defaults['OHmax']);
	    return this._calc_XDF(t => this.O_H(t),
				  dOH,OHmin,OHmax,Ntimes,min_age,max_age);
	},
	O_Fe_DF(dOFe,OFemin,OFemax,Ntimes,min_age,max_age) {
	    // Set defaults
	    dOFe= ((typeof dOFe !== 'undefined') ? 
		  dOFe : _OneZone_defaults['dOFe']);
	    OFemin= ((typeof OFemin !== 'undefined') 
		     ? OFemin : _OneZone_defaults['OFemin']);
	    OFemax= ((typeof OFemax !== 'undefined') 
		     ? OFemax : _OneZone_defaults['OFemax']);
	    return this._calc_XDF(t => this.O_Fe(t),
				  dOFe,OFemin,OFemax,Ntimes,min_age,max_age);
	},
    };
    Kimmy.OneZone.ozclass.init.prototype= Kimmy.OneZone.ozclass;

    // Export module for node.js and browser
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
	module.exports = Kimmy;
    else
	window.Kimmy = Kimmy;
})();
