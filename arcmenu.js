(function($) {
    'use strict';

    var methods = {
        init: function(options) {
            var opts = $.extend({}, $.fn.arcmenu.defaults, options);
            opts.show = getEasing(opts.show);
            opts.hide = getEasing(opts.hide);
            opts.angleStart = degToRad(opts.angleStart);
            opts.angleInterval = degToRad(opts.angleInterval);

            this.children('.arcmenu-display').css({
                'position': 'absolute',
                'display': 'block',
                'width': opts.width,
                'height': opts.height
            });

            this.children('.arcmenu-menu').css({
                'position': 'relative',
                'display': 'none',
                'margin': 0,
                'width': opts.width,
                'height': opts.height
            }).children().css({
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'opacity': 0
            });

            return this.off('click').on('click', function(e) {
                var that = $(this),
                    wrapper = that.children('.arcmenu-menu');
                if (that.is('.arcmenu-animating')) {
                    return that;
                }

                that.addClass('arcmenu-animating');
                if (that.is('.arcmenu-open')) {
                    closeMenu(that, opts);
                } else {
                    openMenu(that, opts);
                }
            });
        },
        open: function() {
            this.off('arcmenuOpen').on('arcmenuOpen', function() {
                var that = $(this);
                openMenu(that);
            });
            this.trigger('arcmenuOpen');
        },
        close: function() {
            this.off('arcmenuClose').on('arcmenuClose', function() {
                var that = $(this);
                closeMenu(that);
            });
            this.trigger('arcmenuClose');
        }
    };

    $.fn.arcmenu = function(params) {
        if (methods[params]) {
            return methods[params].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            return methods.init.apply(this, arguments);
        }
    }

    $.fn.arcmenu.defaults = {
        width: '55px',
        height: '55px',
        angleStart: 0,
        angleInterval: 45,
        delay: 50,
        distance: 100,
        show: 'easeOutBack',
        hide: 'easeInBack',
        step: 15,
        onOpen: false,
        onClose: false,
        itemRotation: 0,
        iconRotation: 0
    };

    function openMenu(elem, opts) {
        if (elem.is('.arcmenu-open')) {
            return elem;
        }

        var wrapper = elem.children('.arcmenu-menu'),
            target = wrapper.children();

        wrapper.show();
        animateTranslate({
            'objek': elem,
            'targetX': 0,
            'fromX': 0,
            'targetY': 0,
            'fromY': 0,
            'targetO': 1,
            'fromO': 1,
            'targetRot': opts.iconRotation,
            'fromRot': 0,
            'easing': opts.show,
            'step': opts.step
        });

        for (var i = 0; i < target.length; i++) {
            (function(increment) {
                var callback = false;
                if (increment == target.length - 1) {
                    callback = function() {
                        elem.removeClass('arcmenu-animating');
                        elem.addClass('arcmenu-open');
                        if (typeof opts.onOpen == 'function') {
                            opts.onOpen();
                        }
                    };
                }
                setTimeout(function() {
                    animateTranslate({
                        'objek': target.eq(increment),
                        'targetX': Math.round(Math.cos(opts.angleInterval * increment + opts.angleStart) * opts.distance),
                        'fromX': 0,
                        'targetY': Math.round(Math.sin(opts.angleInterval * increment + opts.angleStart) * opts.distance),
                        'fromY': 0,
                        'targetO': 1,
                        'fromO': 0,
                        'targetRot': 0,
                        'fromRot': 0,
                        'easing': opts.show,
                        'step': opts.step,
                        'callback': callback
                    });
                }, opts.delay * increment);
            })(i);
        }

        return elem;
    }

    function closeMenu(elem, opts) {
        if (!elem.is('.arcmenu-open')) {
            return elem;
        }

        var wrapper = elem.children('.arcmenu-menu'),
            target = wrapper.children();

        animateTranslate({
            'objek': elem,
            'targetX': 0,
            'fromX': 0,
            'targetY': 0,
            'fromY': 0,
            'targetO': 1,
            'fromO': 1,
            'targetRot': 0,
            'fromRot': opts.iconRotation,
            'easing': opts.hide,
            'step': opts.step
        });

        for (var i = target.length - 1; i >= 0; i--) {
            (function(increment) {
                var callback = false;
                if (increment == 0) {
                    callback = function() {
                        wrapper.hide();
                        elem.removeClass('arcmenu-animating');
                        elem.removeClass('arcmenu-open');
                        if (typeof opts.onClose == 'function') {
                            opts.onClose();
                        }
                    };
                }
                setTimeout(function() {
                    animateTranslate({
                        'objek': target.eq(increment),
                        'targetX': 0,
                        'fromX': Math.round(Math.cos(opts.angleInterval * increment + opts.angleStart) * opts.distance),
                        'targetY': 0,
                        'fromY': Math.round(Math.sin(opts.angleInterval * increment + opts.angleStart) * opts.distance),
                        'targetO': 0,
                        'fromO': 1,
                        'targetRot': 0,
                        'fromRot': 0,
                        'easing': opts.hide,
                        'step': opts.step,
                        'callback': callback
                    });
                }, opts.delay * (target.length - (increment + 1)));
            })(i);
        }

        return elem;
    }

    function animateTranslate(params) {
        if (typeof params['objek'] == 'undefined') {
            return false;
        }

        var objek = (params['objek'] instanceof jQuery) ? params['objek'] : $([params['objek']]);
        if (objek.is('.animatingTranslate')) {
            return false;
        }

        var targetX = (typeof params['targetX'] == 'undefined') ? false : params['targetX'],
            fromX = (typeof params['fromX'] == 'undefined') ? false : params['fromX'],
            targetY = (typeof params['targetY'] == 'undefined') ? false : params['targetY'],
            fromY = (typeof params['fromY'] == 'undefined') ? false : params['fromY'],
            targetO = (typeof params['targetO'] == 'undefined') ? false : params['targetO'],
            fromO = (typeof params['fromO'] == 'undefined') ? false : params['fromO'],
            targetRot = (typeof params['targetRot'] == 'undefined') ? false : params['targetRot'],
            fromRot = (typeof params['fromRot'] == 'undefined') ? false : params['fromRot'],
            easing = (typeof params['easing'] != 'function') ? getEasing('easeOutCirc') : params['easing'],
            step = (typeof params['step'] == 'undefined') ? 15 : params['step'],
            callback = (typeof params['callback'] == 'undefined') ? false : params['callback'],
            xform = 'transform',
            currentStep = 0;

        ['', 'webkit', 'Moz', 'O', 'ms'].every(function(prefix) {
            var e = prefix + 'Transform';
            if (typeof document.body.style[e] !== 'undefined') {
                xform = e;
            }
        });

        objek.addClass('animatingTranslate');
        processanimateTranslate(objek, targetX, fromX, targetY, fromY, targetO, fromO, targetRot, fromRot, easing, step, callback, xform, currentStep);
    }

    function processanimateTranslate(objek, targetX, fromX, targetY, fromY, targetO, fromO, targetRot, fromRot, easing, step, callback, xform, currentStep) {
        if (objek.is('.animatingTranslate')) {
            if (typeof fromX == 'undefined' || fromX === false) {
                fromX = parseInt(getTranslateX(objek[0]));
            }
            if (typeof targetX == 'undefined' || targetX === false) {
                targetX = fromX;
            }
            if (typeof fromY == 'undefined' || fromY === false) {
                fromY = parseInt(getTranslateY(objek[0]));
            }
            if (typeof targetY == 'undefined' || targetY === false) {
                targetY = fromY;
            }
            if (typeof fromO == 'undefined' || fromO === false) {
                fromO = parseInt(getOpacity(objek[0]));
            }
            if (typeof targetO == 'undefined' || targetO === false) {
                targetO = fromO;
            }
            if (typeof fromRot == 'undefined' || fromRot === false) {
                fromRot = 0;
            }
            if (typeof targetRot == 'undefined' || targetRot === false) {
                targetRot = fromRot;
            }

            var opts = {};
            if (currentStep <= step) {
                var currentTargetX = easing(currentStep, fromX, targetX - fromX, step),
                    currentTargetY = easing(currentStep, fromY, targetY - fromY, step),
                    currentTargetO = easing(currentStep, fromO, targetO - fromO, step),
                    currentTargetRot = easing(currentStep, fromRot, targetRot - fromRot, step);

                opts[xform] = 'translate3d(' + currentTargetX + 'px, ' + currentTargetY + 'px, 0)' +
                              'rotate(' + currentTargetRot + 'deg)';
                opts['opacity'] = currentTargetO;
                currentStep++;
                window.requestAnimationFrame(function() {
                    processanimateTranslate(objek, targetX, fromX, targetY, fromY, targetO, fromO, targetRot, fromRot, easing, step, callback, xform, currentStep);
                });
                objek.css(opts);
            } else {
                opts[xform] = 'translate3d(' + targetX + 'px, ' + targetY + 'px, 0)' +
                              'rotate(' + targetRot + 'deg)';
                opts['opacity'] = targetO;
                objek.css(opts);
                objek.removeClass('animatingTranslate');
                if (typeof callback == 'function') {
                    callback();
                }
            }
        }
    }

    function degToRad(angle) {
        return angle * (Math.PI / 180);
    }

    function getTranslateX(elem) {
		var m = new WebKitCSSMatrix(window.getComputedStyle(elem, null).webkitTransform);
		return m.m41;
	}

	function getTranslateY(elem) {
		var m = new WebKitCSSMatrix(window.getComputedStyle(elem, null).webkitTransform);
		return m.m42;
	}

	function getOpacity(elem) {
		return window.getComputedStyle(elem).opacity;
	}

    function getEasing(easing) {
        switch (easing) {
            case 'linearEase':
                return (function(t, b, c, d) {
                    return c * t / d + b;
                });
            break;

            case 'easeInQuad':
                return (function(t, b, c, d) {
                    return c * (t /= d) * t + b;
                });
            break;
            case 'easeOutQuad':
                return (function(t, b, c, d) {
                    return -c * (t /= d) * (t - 2) + b;
                });
            break;
            case 'easeInOutQuad':
                return (function(t, b, c, d) {
                    if ((t /= d / 2) < 1) {
                        return c / 2 * t * t + b;
                    }
                    return -c / 2 * ((--t) * (t - 2) - 1) + b;
                });
            break;

            case 'easeInCubic':
                return (function(t, b, c, d) {
                    return c * Math.pow(t / d, 3) + b;
                });
            break;
            case 'easeOutCubic':
                return (function(t, b, c, d) {
                    return c * (Math.pow(t / d - 1, 3) + 1) + b;
                });
            break;
            case 'easeInOutCubic':
                return (function(t, b, c, d) {
                    if ((t /= d / 2) < 1) {
                        return c / 2 * Math.pow(t, 3) + b;
                    }
                    return c / 2 * (Math.pow(t - 2, 3) + 2) + b;
                });
            break;

            case 'easeInQuart':
                return (function(t, b, c, d) {
                    return c * Math.pow (t / d, 4) + b;
                });
            break;
            case 'easeOutQuart':
                return (function(t, b, c, d) {
                    return -c * (Math.pow(t / d - 1, 4) - 1) + b;
                });
            break;
            case 'easeInOutQuart':
                return (function(t, b, c, d) {
                    if ((t /= d / 2) < 1) {
                        return c / 2 * Math.pow(t, 4) + b;
                    }
                    return -c / 2 * (Math.pow(t - 2, 4) - 2) + b;
                });
            break;

            case 'easeInQuint':
                return (function(t, b, c, d) {
                    return c * Math.pow (t / d, 5) + b;
                });
            break;
            case 'easeOutQuint':
                return (function(t, b, c, d) {
                    return c * (Math.pow(t / d - 1, 5) + 1) + b;
                });
            break;
            case 'easeInOutQuint':
                return (function(t, b, c, d) {
                    if ((t /= d / 2) < 1) {
                        return c / 2 * Math.pow(t, 5) + b;
                    }
                    return c / 2 * (Math.pow(t - 2, 5) + 2) + b;
                });
            break;

            case 'easeInSine':
                return (function(t, b, c, d) {
                    return c * (1 - Math.cos(t / d * (Math.PI / 2))) + b;
                });
            break;
            case 'easeOutSine':
                return (function(t, b, c, d) {
                    return c * Math.sin(t / d * (Math.PI / 2)) + b;
                });
            break;
            case 'easeInOutSine':
                return (function(t, b, c, d) {
                    return c / 2 * (1 - Math.cos(Math.PI * t / d)) + b;
                });
            break;

            case 'easeInExpo':
                return (function(t, b, c, d) {
                    return c * Math.pow(2, 10 * (t / d - 1)) + b;
                });
            break;
            case 'easeOutExpo':
                return (function(t, b, c, d) {
                    return c * (-Math.pow(2, -10 * t / d) + 1) + b;
                });
            break;
            case 'easeInOutExpo':
                return (function(t, b, c, d) {
                    if ((t /= d / 2) < 1) {
                        return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                    }
                    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
                });
            break;

            case 'easeInCirc':
                return (function(t, b, c, d) {
                    return c * (1 - Math.sqrt(1 - (t /= d) * t)) + b;
                });
            break;
            case 'easeOutCirc':
                return (function(t, b, c, d) {
                    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
                });
            break;
            case 'easeInOutCirc':
                return (function(t, b, c, d) {
                    if ((t /= d / 2) < 1) {
                        return c / 2 * (1 - Math.sqrt(1 - t * t)) + b;
                    }
                    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
                });
            break;

            case 'easeInElastic':
                return (function(t, b, c, d) {
                    var s = 1.70158, p = 0, a = c;

                    if(c == 0) return b;
                    if(t == 0) return b;
                    if((t /= d) == 1) return b+c;
                    if(!p) p=d*0.3;
                    if(a < Math.abs(c)) {
                        a = c;
                        s = p / 4;
                    } else {
                        s = p / (2 * Math.PI) * Math.asin(c / a);
                    }
                    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin( (t * d - s) * (2 * Math.PI) / p )) + b;
                });
            break;
            case 'easeOutElastic':
                return (function(t, b, c, d) {
                    var s = 1.70158, p = 0, a = c;

                    if(c == 0) return b;
                    if(t == 0) return b;
                    if((t /= d) == 1) return b+c;
                    if(!p) p=d*0.3;
                    if(a < Math.abs(c)) {
                        a = c;
                        s = p / 4;
                    } else {
                        s = p / (2 * Math.PI) * Math.asin(c / a);
                    }
                    return a * Math.pow(2, -10 * t) * Math.sin( (t * d - s) * (2 * Math.PI) / p ) + c + b;
                });
            break;
            case 'easeInOutElastic':
                return (function(t, b, c, d) {
                    var s = 1.70158, p = 0, a = c;

                    if(c == 0) return b;
                    if(t == 0) return b;
                    if((t /= d / 2) == 2) return b + c;
                    if(!p) p = d * ( 0.3 * 1.5 );
                    if(a < Math.abs(c)) {
                        a = c;
                        s = p / 4;
                    } else {
                        s = p / (2 * Math.PI) * Math.asin(c / a);
                    }

                    if(t < 1) {
                        return -0.5 * (a * Math.pow(2, 10 * ( t -= 1 )) * Math.sin((t * d - s) * (2 * Math.PI) / p) ) + b;
                    }
                    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin( (t * d - s) * (2 * Math.PI) / p ) * 0.5 + c + b;
                });
            break;

            case 'easeInBack':
                return (function(t, b, c, d, overShoot) {
                    var s = (typeof overShoot == 'undefined')?1.70158:overShoot;
                    return c * (t /= d) * t * ((s + 1) * t - s) + b;
                });
            break;
            case 'easeOutBack':
                return (function(t, b, c, d, overShoot) {
                    var s = (typeof overShoot == 'undefined')?1.70158:overShoot;
                    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
                });
            break;
            case 'easeInOutBack':
                return (function(t, b, c, d, overShoot) {
                    var s = (typeof overShoot == 'undefined')?1.70158:overShoot;
                    if((t /= d / 2) < 1) {
                        return c / 2 * (c * c * (((s *= (1.525)) + 1) * t)) + b;
                    }
                    return c / 2 *((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
                });
            break;

            case 'easeInBounce':
                return (function(t, b, c, d) {
                    return c - easing.easeOutBounce(d-t,0,c,d) + b;
                });
            break;
            case 'easeOutBounce':
                return (function(t, b, c, d) {
                    if((t /= d) < (1 / 2.75)) {
                        return c * (7.5625 * t * t) + b;
                    } else if(t < (2 / 2.75)) {
                        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
                    } else if(t < (2.5 / 2.75)) {
                        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
                    } else {
                        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) +b;
                    }
                });
            break;
            case 'easeInOutBounce':
                return (function(t, b, c, d) {
                    if(t < d/2) {
                        return easing.easeOutBounce(t*2,0,c,d) * 0.5 + b;
                    } else {
                        return easing.easeOutBounce(t*2-d,0,c,d) * 0.5 + c * 0.5 + b;
                    }
                });
            break;
        }
    }
})(jQuery);
