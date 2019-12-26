(function(window) {
    var Kimmy = window.Kimmy = {};

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
			    'solar_Fe':  7.47}

    Kimmy.OneZone = function (eta=_OneZone_defaults['eta'],
			      tau_SFE=_OneZone_defaults['tau_SFE'],
			      tau_SFH=_OneZone_defaults['tau_SFH'],
			      tau_Ia=_OneZone_defaults['tau_Ia'],
			      min_dt_Ia=_OneZone_defaults['min_dt_Ia'],
			      sfh=_OneZone_defaults['sfh'],
			      mCC_O=_OneZone_defaults['mCC_O'],
			      mCC_Fe=_OneZone_defaults['mCC_Fe'],
			      mIa_O=_OneZone_defaults['mIa_O'],
			      mIa_Fe=_OneZone_defaults['mIa_Fe'],
			      r=_OneZone_defaults['r'],
			      tau_Ia_2=_OneZone_defaults['tau_Ia_2'],
			      frac_Ia_2=_OneZone_defaults['frac_Ia_2'],
			      solar_O=_OneZone_defaults['solar_O'],
			      solar_Fe=_OneZone_defaults['solar_Fe']) {
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
	}
    };
    Kimmy.OneZone.ozclass.init.prototype= Kimmy.OneZone.ozclass;
})(window || this);
