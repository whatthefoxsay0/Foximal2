/*
    Foximal2.js
    Javascript library by whatthefoxsay0
    for big numbers
*/

class F2 {
    sign = 1
    m = 0
    layer = 0

    constructor (input, m=0, layer=0) {
        if (input instanceof F2)
            this.fromFoximal2(input)

        else if (typeof(input) == "number" && m ==0)
            this.fromNumber(input)

        else if (typeof(input) == "string")
            this.fromString(input)

        else if (m != 0)
            this.fromComponents(input, m, layer)

        return this
    }

    fromFoximal2 = function(other) {
        this.sign = other.sign
        this.m = other.m
        this.layer = other.layer
        return this
    }

    fromNumber = function(number) {
        if (number < 0) {
            this.sign = -1
            number = -number
        }
        this.m = number
        return this._fix()
    }

    fromString = function(string) {
        if (string.includes("F")) {
            let strings = string.split("F")
            this.layer = Math.floor(parseFloat(strings[1]))

            if (parseFloat(strings[0]) < 0) {
                this.sign = -1
                this.m = -parseFloat(strings[0])
            } else
                this.m = parseFloat(strings[0])

        } else if (string.includes("f")) {
            let strings = string.split("f")
            this.layer = Math.floor(parseFloat(strings[1]))

            if (parseFloat(strings[0]) < 0) {
                this.sign = -1
                this.m = -parseFloat(strings[0])
            } else
                this.m = parseFloat(strings[0])

        } else {
            let strings = string.split("e")

            if (parseFloat(strings[0]) < 0) {
                this.sign = -1
                strings[0] = -parseFloat(strings[0])+""
            }

            if (strings.length == 1) {
                this.m = parseFloat(strings[0])
            } else {
                this.layer = strings.length

                if (parseFloat(strings[strings.length-2]) > 1)
                    this.m = Math.log10(parseFloat(strings[strings.length-1])+Math.log10(parseFloat(strings[strings.length-2])))
                else
                    this.m = Math.log10(parseFloat(strings[strings.length-1]))
            }
        } 
        return this._fix()
    }

    fromComponents = function(sign, m, layer) {
        this.sign = sign
        this.m = m
        this.layer = layer
        return this._fix()
    }

    toNumber = function() {
        if (this.gt(1.79e308)) {
            console.error("toNumber only up to 1.79e308")
            return 0
        }
        if (this.layer == 0)
            return this.m*this.sign

        if (this.layer == 1)
            return 10**this.m*this.sign

        if (this.layer == 2)
            return 10**10**this.m*this.sign
    }

    toString = function() {
        if (this.layer == 0)
            return ""+this.m*this.sign

        let string = ""

        if (this.sign == -1)
            string = "-"

        let i = 1

        while (i<this.layer) {
            string += "e"
            i++
        }
        string += (10**(this.m-Math.floor(this.m)))+"e"+Math.floor(this.m)
        return string
    }

    toF = function() {
        return this.m + "F" + this.layer
    }

    lt = function(other) {
        other = new F2(other)

        if (this.sign != other.sign)
            return !(this.sign+1)

        if (this.layer < other.layer)
            return !(this.sign-1)

        if (this.layer > other.layer)
            return !(this.sign+1)

        if (this.m < other.m)
            return !(this.sign-1)

        if (this.m > other.m)
            return !(this.sign+1)

        return false
    }

    lte = function(other) {
        other = new F2(other)

        if (this.sign != other.sign)
            return !(this.sign+1)

        if (this.layer < other.layer)
            return !(this.sign-1)

        if (this.layer > other.layer)
            return !(this.sign+1)

        if (this.m < other.m)
            return !(this.sign-1)

        if (this.m > other.m)
            return !(this.sign+1)

        return true
    }

    gt = function(other) {
        other = new F2(other)

        if (this.sign != other.sign)
            return !(this.sign-1)

        if (this.layer < other.layer)
            return !(this.sign+1)

        if (this.layer > other.layer)
            return !(this.sign-1)

        if (this.m < other.m)
            return !(this.sign+1)

        if (this.m > other.m)
            return !(this.sign-1)

        return false
    }

    gte = function(other) {
        other = new F2(other)

        if (this.sign != other.sign)
            return !(this.sign+1)

        if (this.layer < other.layer)
            return !(this.sign+1)

        if (this.layer > other.layer)
            return !(this.sign-1)

        if (this.m < other.m)
            return !(this.sign+1)

        if (this.m > other.m)
            return !(this.sign-1)

        return true
    }

    eq = function(other) {
        other = new F2(other)

        if (this.sign == other.sign && this.layer == other.layer && this.m == other.m)
            return true

        return false
    }

    neq = function(other) {
        other = new F2(other)

        if (this.sign == other.sign && this.layer == other.layer && this.m == other.m)
            return false

        return true
    }

    cmp = function(other) {
        other = new F2(other)

        if (this.lt(other))
            return -1

        if (this.gt(other))
            return 1

        return 0    
    }

    ispos = function() {
        return this.sign == 1
    }

    isneg = function() {
        return this.sign == -1
    }

    isNaN = function() {
        if (isNaN(this.sign) || isNaN(this.m) || isNaN(this.layer))
            return true

        return false
    }

    isInfinite = function() {
        if (!this.isNaN() && (!isFinite(this.sign) || !isFinite(this.m) || !isFinite(this.layer)))
            return true

        return false
    }

    isFinite = function() {
        if (isFinite(this.sign) && isFinite(this.m) && isFinite(this.layer))
            return true

        return false
    }

    iseven = function() {
        if (this.abs().gt(F2.MAXSAFEINT) || other.abs().gt(F2.MAXSAFEINT))
            return 0
        return this.toNumber()%2 == 0
    }

    isodd = function() {
        if (this.abs().gt(F2.MAXSAFEINT) || other.abs().gt(F2.MAXSAFEINT))
            return 0
        return this.toNumber()%2 == 1
    }

    isint = function() {
        return (this.mod(1) == 0) + 0
    }

    mod = function(other) {
        other = new F2(other)
        if (this.abs().gt(F2.MAXSAFEINT) || other.abs().gt(F2.MAXSAFEINT))
            return new F2()
        return new F2(this.toNumber()%other.toNumber())
    }

    floor = function() {
        if (this.abs().gt(F2.MAXSAFEINT))
            return new F2(this)
        if (this.abs().lt(1))
            return new F2()
        if (this.mod(1) == 0)
            return new F2(this)
        if (this.sign == -1)
            return this.sub(this.mod(1)).sub(1)
        return this.sub(this.mod(1))
    }

    ceil = function() {
        if (this.m == 0)
            return new F2()
        if (this.abs().gt(F2.MAXSAFEINT))
            return new F2(this)
        if (this.abs().lt(1))
            return new F2((this.sign == 1)+0)
        if (this.mod(1) == 0)
            return new F2(this)
        return this.floor().add(1)
    }

    round = function() {
        let up = this.abs().mod(1).gte(0.5)
        if (this.sign == -1)
            up = !up
        if (up)
            return this.ceil()
        else
            return this.floor()
    }

    min = function(other) {
        other = new F2(other)

        if (this.lt(other))
            return new F2(this)

        return other
    }

    max = function(other) {
        other = new F2(other)

        if (this.gt(other))
            return new F2(this)

        return other
    }

    neg = function() {
        let r = new F2(this)
        r.sign = -r.sign
        return r
    }

    abs = function() {
        let r = new F2(this)
        r.sign = 1
        return r
    }

    add = function(other) {
        other = new F2(other)
        if (this.layer > 2 || other.layer > 2 || (this.layer == 2 && this.m >= 2.4885507165004443) || (other.layer == 2 && other.m >= 2.4885507165004443))
            return this.max(other)
            
        if (this.m == 0)
            return other

        if (other.m == 0)
            return new F2(this)
            
        if (this.layer == other.layer) {
            if (this.m == other.m && this.sign != other.sign) {
                other.m = 0
                other.layer = 0
            } else if (this.layer == 0) {
                if (this.sign == other.sign)
                    other.m = this.m + other.m
                else if (other.m > this.m)
                    other.m = other.m - this.m
                else {
                    other.m = this.m - other.m
                    other.sign = -other.sign
                }
            } else if (this.layer == 1) {
                if (this.sign == other.sign)
                    other.m = Math.log10(10**this.m + 10**other.m)
                else if (other.m > this.m)
                    other.m = Math.log10(-(10**this.m) + 10**other.m)
                else {
                    other.m = Math.log10(10**this.m - 10**other.m)
                    other.sign = -other.sign
                }
            } else {
                if (this.sign == other.sign)
                    other.m = Math.log10(Math.log10(10**10**this.m + 10**10**other.m))
                else if (other.m > this.m)
                    other.m = Math.log10(Math.log10(-(10**10**this.m) + 10**10**other.m))
                else {
                    other.m = Math.log10(Math.log10(10**10**this.m - 10**10**other.m))
                    other.sign = -other.sign
                }
            }
        } else if (this.layer < other.layer) {
            if (this.layer == 1) {
                if (this.sign == other.sign)
                    other.m = Math.log10(Math.log10(10**this.m + 10**10**other.m))
                else
                    other.m = Math.log10(Math.log10(-(10**this.m) + 10**10**other.m))
            } else if (other.layer == 1) {
                if (this.sign == other.sign)
                    other.m = Math.log10(this.m + 10**other.m)
                else
                    other.m = Math.log10(-this.m + 10**other.m)
            } else {
                if (this.sign == other.sign)
                    other.m = Math.log10(Math.log10(this.m + 10**10**other.m))
                else
                    other.m = Math.log10(Math.log10(-this.m + 10**10**other.m))
            }
        } else {
            if (this.layer == 1) {
                if (this.sign == other.sign)
                    other.m = Math.log10(10**this.m+other.m)
                else {
                    other.m = Math.log10(10**this.m-other.m)
                    other.sign = -other.sign
                }
                other.layer++
            } else if (other.layer == 1) {
                if (this.sign == other.sign)
                    other.m = Math.log10(Math.log10(10**10**this.m + 10**other.m))
                else {
                    other.m = Math.log10(Math.log10(10**10**this.m - 10**other.m))
                    other.sign = -other.sign
                }
                other.layer++
            } else {
                if (this.sign == other.sign)
                    other.m = Math.log10(Math.log10(10**10**this.m + other.m))
                else {
                    other.m = Math.log10(Math.log10(10**10**this.m - other.m))
                    other.sign = -other.sign
                }
                other.layer +=2
            }
        }
        return other._fix()
    }

    sub = function(other) {
        other = new F2(other)
        return other.neg().add(this)
    }

    mul = function(other) {
        other = new F2(other)
        other.sign = this.sign == other.sign? 1 : -1
        if (this.layer > 3 || other.layer > 3 || (this.layer == 3 && this.m >= 2.4885507165004443) || (other.layer == 3 && other.m >= 2.4885507165004443))
            return this.max(other)

        if (this.m == 0 || other.m == 0)
            return new F2()

        if (this.layer == other.layer) {
            if (this.layer == 0) {
                other.m = other.m * this.m
            } else if (this.layer == 1) {
                other.m = other.m + this.m
            } else if (this.layer == 2) {
                other.m = Math.log10(10**other.m + 10*this.m)
            } else {
                other.m = Math.log10(Math.log10(10**10**other.m + 10**10**this.m))
            }
        } else if (this.layer < other.layer) {
            if (this.layer == 2) {
                other.m = Math.log10(Math.log10(10**10**other.m + 10**this.m))
            } else if (this.layer == 1) {
                if (other.layer == 2)
                    other.m = Math.log10(10**other.m + this.m)
                else
                    other.m = Math.log10(Math.log10(10**10**other.m + this.m))
            } else {
                if (other.layer == 1) 
                    other.m = other.m + Math.log10(this.m)
                else if (other.layer == 2)
                    other.m = Math.log10(10**other.m + Math.log10(this.m))
                else
                    other.m = Math.log10(Math.log10(10**10**other.m + Math.log10(this.m)))
            } 
        } else {
            if (other.layer == 2) {
                other.m == Math.log10(Math.log10(10**other.m + 10**10**this.m))
                other.layer++
            } else if (other.layer == 1) {
                if (this.layer == 2) {
                    other.m = Math.log10(other.m + 10**this.m)
                    other.layer++
                } else {
                    other.m = Math.log10(Math.log10(other.m + 10**10**this.m))
                    other.layer += 2
                }
            } else {
                if (this.layer == 1) {
                    other.m = Math.log10(other.m) + this.m
                    other.layer++
                } else if (this.layer == 2) {
                    other.m = Math.log10(Math.log10(other.m) + 10**this.m)
                    other.layer += 2
                } else {
                    other.m = Math.log10(Math.log10(Math.loh10(other.m) + 10**10**this.m))
                    other.layer += 3
                }
            }
        }
        return other._fix()
    }

    div = function(other) {
        other = new F2(other)
        other.sign = this.sign == other.sign? 1 : -1
        if (other.m == 0) {
            console.error("divison by 0 is not possible")
            return new F2()
        }
        if ((this.layer == 3 && this.m >= 2.4885507165004443) || (other.layer == 3 && other.m >= 2.4885507165004443))
            if (this.gt(other))
                return new F2(this)
            else if (this.lt(other))
                return new F2()
            else
                return new F2(1)

        if (this.abs().eq(other.abs())) 
            return new F2(1)

        if (this.m == 0 || (this.layer < other.layer && other.layer > 3))
            return new F2()

        if (this.layer > other.layer && this.layer > 3)
            return new F2(other.sign, this.m, this.layer)
        
        if (this.layer <= 3 && other.layer <= 3) {
            if (this.layer == other.layer) {
                if (this.layer == 0)
                    other.m = this.m / other.m
                else if (this.layer == 1)
                    other.m = this.m - other.m
                else if (this.layer == 2)
                    other.m = Math.log10(10**this.m - 10**other.m)
                else
                    other.m = Math.log10(Math.log10(10**10**this.m - 10**10**other.m))
            } else if (this.layer < other.layer) {
                if (this.layer == 2) 
                    other.m = Math.log10(Math.log10(10**this.m - 10**10**other.m))
                else if (this.layer == 1) {
                    if (other.layer == 3) {
                        other.m = Math.log10(this.m - 10**10**other.m)
                        if (other.m > 10)
                            other.m = Math.log10(other.m)
                        else
                            other.layer--
                    } else
                        other.m = Math.log10(this.m - 10**other.m)
                } else {
                    if (other.layer == 3) {
                        other.m = 0
                        other.layer = 0
                    } else if (other.layer == 2) {
                        other.m = Math.log10(this.m) - 10**other.m
                        if (other.m > 10)
                            other.m = Math.log10(other.m)
                        else
                            other.layer--
                    } else
                        other.m = Math.log10(this.m) - other.m
                }
            } else {
                if (other.layer == 2) {
                    other.m = Math.log10(10**10**this.m-10**other.m)
                } else if (other.layer == 1) {
                    if (this.layer == 3) 
                        other.m = 10**10**this.m - other.m
                    else
                        other.m = 10**this.m - other.m
                } else {
                    if (this.layer == 3) {
                        other.m = this.m
                        other.layer = this.layer
                    } else if (this.layer == 2)
                        other.m = 10**10**this.m / other.m
                    else
                        other.m = 10**this.m / other.m
                }
            }
        }
        return other._fix()
    }

    pow = function(other) {
        other = new F2(other)

        if (other.m == 0 || this.eq(1))
            return new F2(1)

        let minus = false
        let r = new F2(this)

        if (other.sign == -1) {
            other.sign = 1
            minus = true
        }

        if (r.m == 0)
            return r
        
        r = r.log10().mul(other).powbase(10)
        r.sign = 1

        if (minus) {
            r = F2.ONE.div(r)
        }
            
        return r._fix()
    }

    root = function(other) {
        return this.pow(F2.ONE.div(other))
    }

    sqrt = function() {
        return this.pow(1/2)
    }

    cbrt = function() {
        return this.pow(1/3)
    }

    powbase = function(other) {
        other = new F2(other)

        if (other.eq(10) && this.sign == 1)
            return this.layeradd(1)

        return other.pow(this)
    }

    exp = function() {
        return F2.E.pow(this)
    }
    
    log10 = function() {
        if (this.sign == -1) {
            console.error("log of negative number not possible")
            return new F2()
        }
        if (this.layer)
            return this.layeradd(-1)

        return new F2(Math.log10(this.toNumber()))
    }

    log2 = function() {
        if (this.sign == -1) {
            console.error("log of negative number not possible")
            return new F2()
        }
        if (this.layer)
            return this.log10().div(F2.LOG102)

        return new F2(Math.log2(this.toNumber()))
    }

    ln = function() {
        if (this.sign == -1) {
            console.error("log of negative number not possible")
            return new F2()
        }
        if (this.layer)
            return this.log10().div(F2.LOG10E)

        return new F2(Math.log(this.toNumber()))
    }

    logbase = function(other) {
        other = new F2(other)

        if (this.sign == -1) {
            console.error("log of negative number not possible")
            return new F2()
        }
        return this.log10().div(other.log10())
    }

    fact = function() {
        if (this.gt(0))
            return this.div(F2.E).pow(this).mul(this.mul(2).add(1/3).mul(F2.PI).sqrt())

        if (this.m == 0)
            return new F2(1)

        return new F2()
    }

    // Only positiv values above 1.5 are nearly accurate
    gamma = function() {
        if (this.gte(1.5))
            return this.mul(2).sub(1).fact().mul(F2.PI.sqrt()).div(this.sub(0.5).fact().mul(new F2(4).pow(this.sub(0.5))))
        
        if (this.gte(1))
            return new F2(1)

        return new F2()
    }

    lambertw = function() {
        if (this.gte(3)) {
            let L1 = this.ln()
            let L2 = this.ln().ln()
            return L1.sub(
                    L2).add(
                    L2.div(L1)).add(
                    L2.mul(L2.sub(2)).div(L1.pow(2).mul(2))).add(
                    L2.mul(L2.pow(2).mul(2).sub(L2.mul(9)).add(6)).div(L1.pow(3).mul(6))).add(
                    L2.mul(L2.pow(3).mul(3).sub(L2.pow(2).mul(22)).add(L2.mul(36)).sub(12)).div(L1.pow(4).mul(12))).add(
                    L2.mul(L2.pow(4).mul(12).add(L2.pow(3).mul(125)).add(L2.pow(2).mul(350)).sub(L2.mul(300)).add(60)).div(L1.pow(5).mul(60)))
        }
        if (this.gte(-1/Math.E))
            return this.ln().sub(this.ln().ln()).add(this.ln().ln().div(this.ln()))

        console.error("LambertW of values lower than -1/e ist not possible")
        return new F2()
    }

    ssrt = function() {
        if (this.gt(Math.E**(-1/Math.E)))
            return this.ln().div(this.ln().lambertw())

        console.error("for ssrt the value muss be greater than e^(-1/e)")
        return new F2()
    }

    tetr = function(other) {
        other = new F2(other)

        if ((other.isInfinite() && other.sign == 1) || (other.gt(F2.MAXSAFEINT) && this.lt(Math.exp(1/Math.E)))) {
            if (this.gte(Math.exp(1/Math.E)))
                return new F2(F2.INFINITE)

            let negln = this.ln().neg()
            return negln.lambertw().div(negln)
        }
        if (other.lte(-2))
            return new F2()

        if (this.m == 0) {           
            if (other.mod(2).m == 0)
                return new F2(F2.ONE)

            return new F2()
        }
        if (this.eq(F2.ONE)) {
            if (other.eq(F2.ONE.neg())) 
                return new F2()
            return new F2(F2.ONE)
        }
        if (other.eq(F2.ONE.neg()))
            return new F2()

        if (other.eq(0))
            return new F2(F2.ONE)

        if (other.eq(F2.ONE))
            return new F2(this)

        if (other.eq(F2.TWO))
            return this.pow(this)

        if (other.lte(F2.ONE.neg()))
            return this.tetr(other.add(1))

        if (other.gte(1.79e308))
            return new F2(F2.INFINITE)

        let o = other.floor()
        let r = this.pow(other-o)
        
        if (o.gte(1000)) 
            return this.layeradd(o.toNumber()-1)

        for (let i = 0; o.gte(i+1);i++) {
            r=this.pow(r)
        }

        return r
    }

    slog10 = function() {
        if (this.m == 0 || this.sign == -1)
            return new F2(-1)
        let r = this.layer
        let m = this.m
        if (this.m > 1) {
            m = Math.log10(m)
            r += 1
        }
        r+= -1 + m
        
        return new F2(r)
    }

    slog = function(other) {
        other = new F2(other)

        if (this.eq(F2.ONE))
            return new F2()
        
        if (this.eq(other))
            return new F2(F2.ONE)

        if (this.lte(0))
            return F2.ONE.neg()

        let r = 0
        let t = new F2(this)
        while (t.gt(F2.ONE)) {
            t = t.logbase(other)
            r++
        }
        
        r += t.toNumber()-1
        return new F2(r)
    }
    
    layeradd = function(layers) {
        let r = new F2(this)
        if (layers instanceof F2) 
            layers = layers.toNumber()
        
        if (r.layer + layers >= 0) {
            r.layer += layers
        } else 
            console.error("layers below 0 are not allowed")
        return r._fix()
    }

    layeradd10 = function() {
        return this.layeradd(10)
    }

    _fix = function() {
        if (this.sign != 1 && this.sign != -1) 
            this.sign = 1

        if (this.layer < 0) 
            this.layer = -this.layer

        if (this.isInfinite())
            return this

        while (this.m >= 10) {
            this.layer++
            this.m = Math.log10(this.m)
        }

        while (this.m < 1 && this.layer > 0) {
            this.layer--
            this.m = 10**this.m
        }
        return this
    }
}
F2.TEN = new F2(10)
F2.TWO = new F2(2)
F2.ONE = new F2(1)
F2.E = new F2(Math.E)
F2.PI = new F2(Math.PI)
F2.LOG10E = new F2(Math.LOG10E)
F2.LOG102 = new F2(Math.log10(2))
F2.MAXSAFEINT = new F2(Number.MAX_SAFE_INTEGER)
F2.INFINITE = new F2(1, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)
var Foximal2 = function(n1) {
    return new F2(n1)
}
Foximal2.toNumber = F2.toNumber = function(n1) {
    return new F2(n1).toNumber()
}
Foximal2.toString = F2.toString = function(n1) {
    return new F2(n1).toString()
}
Foximal2.toF = F2.toF = function(n1) {
    return new F2(n1).toF()
}
Foximal2.lt = F2.lt = function(n1, n2) {
    return new F2(n1).lt(n2)
}
Foximal2.lte = F2.lte = function(n1, n2) {
    return new F2(n1).lte(n2)
}
Foximal2.gt = F2.gt = function(n1, n2) {
    return new F2(n1).gt(n2)
}
Foximal2.gte = F2.gte = function(n1, n2) {
    return new F2(n1).gte(n2)
}
Foximal2.eq = F2.eq = function(n1, n2) {
    return new F2(n1).eq(n2)
}
Foximal2.neq = F2.neq = function(n1, n2) {
    return new F2(n1).neq(n2)
}
Foximal2.cmp = F2.cmp = function(n1, n2) {
    return new F2(n1).cmp(n2)
}
Foximal2.ispos = F2.ispos = function(n1) {
    return new F2(n1).ispos()
}
Foximal2.isneg = F2.isneg = function(n1) {
    return new F2(n1).isneg()
}
Foximal2.isNaN = F2.isNaN = function(n1) {
    return new F2(n1).isNaN()
}
Foximal2.isInfinite = F2.isInfinite = function(n1) {
    return new F2(n1).isInfinite()
}
Foximal2.isFinite = F2.isFinite = function(n1) {
    return new F2(n1).isFinite()
}
Foximal2.iseven = F2.iseven = function(n1) {
    return new F2(n1).iseven()
}
Foximal2.isodd = F2.isodd = function(n1) {
    return new F2(n1).isodd()
}
Foximal2.isint = F2.isint = function(n1) {
    return new F2(n1).isint()
}
Foximal2.mod = F2.mod = function(n1, n2) {
    return new F2(n1).mod(n2)
}
Foximal2.floor = F2.floor = function(n1) {
    return new F2(n1).floor()
}
Foximal2.ceil = F2.ceil = function(n1) {
    return new F2(n1).ceil()
}
Foximal2.round = F2.round = function(n1) {
    return new F2(n1).round()
}
Foximal2.min = F2.min = function(n1, n2) {
    return new F2(n1).min(n2)
}
Foximal2.max = F2.max = function(n1, n2) {
    return new F2(n1).max(n2)
}
Foximal2.neg = F2.neg = function(n1) {
    return new F2(n1).neg()
}
Foximal2.abs = F2.abs = function(n1) {
    return new F2(n1).abs()
}
Foximal2.add = F2.add = function(n1, n2) {
    return new F2(n1).add(n2)
}
Foximal2.sub = F2.sub = function(n1, n2) {
    return new F2(n1).sub(n2)
}
Foximal2.mul = F2.mul = function(n1, n2) {
    return new F2(n1).mul(n2)
}
Foximal2.div = F2.div = function(n1, n2) {
    return new F2(n1).div(n2)
}
Foximal2.pow = F2.pow = function(n1, n2) {
    return new F2(n1).pow(n2)
}
Foximal2.root = F2.root = function(n1, n2) {
    return new F2(n1).root(n2)
}
Foximal2.sqrt = F2.sqrt = function(n1) {
    return new F2(n1).sqrt()
}
Foximal2.cbrt = F2.cbrt = function(n1) {
    return new F2(n1).cbrt()
}
Foximal2.powbase = F2.powbase = function(n1) {
    return new F2(n1).powbase(n2)
}
Foximal2.exp = F2.exp = function(n1) {
    return new F2(n1).exp()
}
Foximal2.log10 = F2.log10 = function(n1) {
    return new F2(n1).log10()
}
Foximal2.log2 = F2.log2 = function(n1) {
    return new F2(n1).log2()
}
Foximal2.ln = F2.ln = function(n1) {
    return new F2(n1).ln()
}
Foximal2.logbase = F2.logbase = function(n1, n2) {
    return new F2(n1).logbase(n2)
}
Foximal2.fact = F2.fact = function(n1) {
    return new F2(n1).fact()
}
Foximal2.gamma = F2.gamma = function(n1) {
    return new F2(n1).gamma()
}
Foximal2.lambertw = F2.lambertw = function(n1) {
    return new F2(n1).lambertw()
}
Foximal2.ssrt = F2.ssrt = function(n1) {
    return new F2(n1).ssrt()
}
Foximal2.tetr = F2.tetr = function(n1, n2) {
    return new F2(n1).tetr(n2)
}
Foximal2.slog10 = F2.slog10 = function(n1) {
    return new F2(n1).slog10()
}
Foximal2.slog = F2.slog = function(n1, n2) {
    return new F2(n1).slog(n2)
}
Foximal2.layeradd = F2.layeradd = function(n1, n2) {
    return new F2(n1).layeradd(n2)
}
Foximal2.layeradd10 = F2.layeradd10 = function(n1) {
    return new F2(n1).layeradd10()
}