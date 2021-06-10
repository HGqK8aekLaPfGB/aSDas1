




if (typeof Object.create !== "function") {
    Object.create = function (e) {
        function t() {}
        t.prototype = e;
        return new t();
    };
}
(function (e, t, n) {
    var r = {
        init: function (t, n) {
            var r = this;
            r.$elem = e(n);
            r.options = e.extend({}, e.fn.owlCarousel.options, r.$elem.data(), t);
            r.userOptions = t;
            r.loadContent();
        },
        loadContent: function () {
            function r(e) {
                var n,
                    r = "";
                if (typeof t.options.jsonSuccess === "function") {
                    t.options.jsonSuccess.apply(this, [e]);
                } else {
                    for (n in e.owl) {
                        if (e.owl.hasOwnProperty(n)) {
                            r += e.owl[n].item;
                        }
                    }
                    t.$elem.html(r);
                }
                t.logIn();
            }
            var t = this,
                n;
            if (typeof t.options.beforeInit === "function") {
                t.options.beforeInit.apply(this, [t.$elem]);
            }
            if (typeof t.options.jsonPath === "string") {
                n = t.options.jsonPath;
                e.getJSON(n, r);
            } else {
                t.logIn();
            }
        },
        logIn: function () {
            var e = this;
            e.$elem.data("owl-originalStyles", e.$elem.attr("style"));
            e.$elem.data("owl-originalClasses", e.$elem.attr("class"));
            e.$elem.css({ opacity: 0 });
            e.orignalItems = e.options.items;
            e.checkBrowser();
            e.wrapperWidth = 0;
            e.checkVisible = null;
            e.setVars();
        },
        setVars: function () {
            var e = this;
            if (e.$elem.children().length === 0) {
                return false;
            }
            e.baseClass();
            e.eventTypes();
            e.$userItems = e.$elem.children();
            e.itemsAmount = e.$userItems.length;
            e.wrapItems();
            e.$owlItems = e.$elem.find(".owl-item");
            e.$owlWrapper = e.$elem.find(".owl-wrapper");
            e.playDirection = "next";
            e.prevItem = 0;
            e.prevArr = [0];
            e.currentItem = 0;
            e.customEvents();
            e.onStartup();
        },
        onStartup: function () {
            var e = this;
            e.updateItems();
            e.calculateAll();
            e.buildControls();
            e.updateControls();
            e.response();
            e.moveEvents();
            e.stopOnHover();
            e.owlStatus();
            if (e.options.transitionStyle !== false) {
                e.transitionTypes(e.options.transitionStyle);
            }
            if (e.options.autoPlay === true) {
                e.options.autoPlay = 5e3;
            }
            e.play();
            e.$elem.find(".owl-wrapper").css("display", "block");
            if (!e.$elem.is(":visible")) {
                e.watchVisibility();
            } else {
                e.$elem.css("opacity", 1);
            }
            e.onstartup = false;
            e.eachMoveUpdate();
            if (typeof e.options.afterInit === "function") {
                e.options.afterInit.apply(this, [e.$elem]);
            }
        },
        eachMoveUpdate: function () {
            var e = this;
            if (e.options.lazyLoad === true) {
                e.lazyLoad();
            }
            if (e.options.autoHeight === true) {
                e.autoHeight();
            }
            e.onVisibleItems();
            if (typeof e.options.afterAction === "function") {
                e.options.afterAction.apply(this, [e.$elem]);
            }
        },
        updateVars: function () {
            var e = this;
            if (typeof e.options.beforeUpdate === "function") {
                e.options.beforeUpdate.apply(this, [e.$elem]);
            }
            e.watchVisibility();
            e.updateItems();
            e.calculateAll();
            e.updatePosition();
            e.updateControls();
            e.eachMoveUpdate();
            if (typeof e.options.afterUpdate === "function") {
                e.options.afterUpdate.apply(this, [e.$elem]);
            }
        },
        reload: function () {
            var e = this;
            t.setTimeout(function () {
                e.updateVars();
            }, 0);
        },
        watchVisibility: function () {
            var e = this;
            if (e.$elem.is(":visible") === false) {
                e.$elem.css({ opacity: 0 });
                t.clearInterval(e.autoPlayInterval);
                t.clearInterval(e.checkVisible);
            } else {
                return false;
            }
            e.checkVisible = t.setInterval(function () {
                if (e.$elem.is(":visible")) {
                    e.reload();
                    e.$elem.animate({ opacity: 1 }, 200);
                    t.clearInterval(e.checkVisible);
                }
            }, 500);
        },
        wrapItems: function () {
            var e = this;
            e.$userItems.wrapAll('<div class="owl-wrapper">').wrap('<div class="owl-item"></div>');
            e.$elem.find(".owl-wrapper").wrap('<div class="owl-wrapper-outer">');
            e.wrapperOuter = e.$elem.find(".owl-wrapper-outer");
            e.$elem.css("display", "block");
        },
        baseClass: function () {
            var e = this,
                t = e.$elem.hasClass(e.options.baseClass),
                n = e.$elem.hasClass(e.options.theme);
            if (!t) {
                e.$elem.addClass(e.options.baseClass);
            }
            if (!n) {
                e.$elem.addClass(e.options.theme);
            }
        },
        updateItems: function () {
            var t = this,
                n,
                r;
            if (t.options.responsive === false) {
                return false;
            }
            if (t.options.singleItem === true) {
                t.options.items = t.orignalItems = 1;
                t.options.itemsCustom = false;
                t.options.itemsDesktop = false;
                t.options.itemsDesktopSmall = false;
                t.options.itemsTablet = false;
                t.options.itemsTabletSmall = false;
                t.options.itemsMobile = false;
                return false;
            }
            n = e(t.options.responsiveBaseWidth).width();
            if (n > (t.options.itemsDesktop[0] || t.orignalItems)) {
                t.options.items = t.orignalItems;
            }
            if (t.options.itemsCustom !== false) {
                t.options.itemsCustom.sort(function (e, t) {
                    return e[0] - t[0];
                });
                for (r = 0; r < t.options.itemsCustom.length; r += 1) {
                    if (t.options.itemsCustom[r][0] <= n) {
                        t.options.items = t.options.itemsCustom[r][1];
                    }
                }
            } else {
                if (n <= t.options.itemsDesktop[0] && t.options.itemsDesktop !== false) {
                    t.options.items = t.options.itemsDesktop[1];
                }
                if (n <= t.options.itemsDesktopSmall[0] && t.options.itemsDesktopSmall !== false) {
                    t.options.items = t.options.itemsDesktopSmall[1];
                }
                if (n <= t.options.itemsTablet[0] && t.options.itemsTablet !== false) {
                    t.options.items = t.options.itemsTablet[1];
                }
                if (n <= t.options.itemsTabletSmall[0] && t.options.itemsTabletSmall !== false) {
                    t.options.items = t.options.itemsTabletSmall[1];
                }
                if (n <= t.options.itemsMobile[0] && t.options.itemsMobile !== false) {
                    t.options.items = t.options.itemsMobile[1];
                }
            }
            if (t.options.items > t.itemsAmount && t.options.itemsScaleUp === true) {
                t.options.items = t.itemsAmount;
            }
        },
        response: function () {
            var n = this,
                r,
                i;
            if (n.options.responsive !== true) {
                return false;
            }
            i = e(t).width();
            n.resizer = function () {
                if (e(t).width() !== i) {
                    if (n.options.autoPlay !== false) {
                        t.clearInterval(n.autoPlayInterval);
                    }
                    t.clearTimeout(r);
                    r = t.setTimeout(function () {
                        i = e(t).width();
                        n.updateVars();
                    }, n.options.responsiveRefreshRate);
                }
            };
            e(t).resize(n.resizer);
        },
        updatePosition: function () {
            var e = this;
            e.jumpTo(e.currentItem);
            if (e.options.autoPlay !== false) {
                e.checkAp();
            }
        },
        appendItemsSizes: function () {
            var t = this,
                n = 0,
                r = t.itemsAmount - t.options.items;
            t.$owlItems.each(function (i) {
                var s = e(this);
                s.css({ width: t.itemWidth }).data("owl-item", Number(i));
                if (i % t.options.items === 0 || i === r) {
                    if (!(i > r)) {
                        n += 1;
                    }
                }
                s.data("owl-roundPages", n);
            });
        },
        appendWrapperSizes: function () {
            var e = this,
                t = e.$owlItems.length * e.itemWidth;
            e.$owlWrapper.css({ width: t * 2, left: 0 });
            e.appendItemsSizes();
        },
        calculateAll: function () {
            var e = this;
            e.calculateWidth();
            e.appendWrapperSizes();
            e.loops();
            e.max();
        },
        calculateWidth: function () {
            var e = this;
            e.itemWidth = Math.round(e.$elem.width() / e.options.items);
        },
        max: function () {
            var e = this,
                t = (e.itemsAmount * e.itemWidth - e.options.items * e.itemWidth) * -1;
            if (e.options.items > e.itemsAmount) {
                e.maximumItem = 0;
                t = 0;
                e.maximumPixels = 0;
            } else {
                e.maximumItem = e.itemsAmount - e.options.items;
                e.maximumPixels = t;
            }
            return t;
        },
        min: function () {
            return 0;
        },
        loops: function () {
            var t = this,
                n = 0,
                r = 0,
                i,
                s,
                o;
            t.positionsInArray = [0];
            t.pagesInArray = [];
            for (i = 0; i < t.itemsAmount; i += 1) {
                r += t.itemWidth;
                t.positionsInArray.push(-r);
                if (t.options.scrollPerPage === true) {
                    s = e(t.$owlItems[i]);
                    o = s.data("owl-roundPages");
                    if (o !== n) {
                        t.pagesInArray[n] = t.positionsInArray[i];
                        n = o;
                    }
                }
            }
        },
        buildControls: function () {
            var t = this;
            if (t.options.navigation === true || t.options.pagination === true) {
                t.owlControls = e('<div class="owl-controls"/>').toggleClass("clickable", !t.browser.isTouch).appendTo(t.$elem);
            }
            if (t.options.pagination === true) {
                t.buildPagination();
            }
            if (t.options.navigation === true) {
                t.buildButtons();
            }
        },
        buildButtons: function () {
            var t = this,
                n = e('<div class="owl-buttons"/>');
            t.owlControls.append(n);
            t.buttonPrev = e("<div/>", { class: "owl-prev", html: t.options.navigationText[0] || "" });
            t.buttonNext = e("<div/>", { class: "owl-next", html: t.options.navigationText[1] || "" });
            n.append(t.buttonPrev).append(t.buttonNext);
            n.on("touchstart.owlControls mousedown.owlControls", 'div[class^="owl"]', function (e) {
                e.preventDefault();
            });
            n.on("touchend.owlControls mouseup.owlControls", 'div[class^="owl"]', function (n) {
                n.preventDefault();
                if (e(this).hasClass("owl-next")) {
                    t.next();
                } else {
                    t.prev();
                }
            });
        },
        buildPagination: function () {
            var t = this;
            t.paginationWrapper = e('<div class="owl-pagination"/>');
            t.owlControls.append(t.paginationWrapper);
            t.paginationWrapper.on("touchend.owlControls mouseup.owlControls", ".owl-page", function (n) {
                n.preventDefault();
                if (Number(e(this).data("owl-page")) !== t.currentItem) {
                    t.goTo(Number(e(this).data("owl-page")), true);
                }
            });
        },
        updatePagination: function () {
            var t = this,
                n,
                r,
                i,
                s,
                o,
                u;
            if (t.options.pagination === false) {
                return false;
            }
            t.paginationWrapper.html("");
            n = 0;
            r = t.itemsAmount - (t.itemsAmount % t.options.items);
            for (s = 0; s < t.itemsAmount; s += 1) {
                if (s % t.options.items === 0) {
                    n += 1;
                    if (r === s) {
                        i = t.itemsAmount - t.options.items;
                    }
                    o = e("<div/>", { class: "owl-page" });
                    u = e("<span></span>", { text: t.options.paginationNumbers === true ? n : "", class: t.options.paginationNumbers === true ? "owl-numbers" : "" });
                    o.append(u);
                    o.data("owl-page", r === s ? i : s);
                    o.data("owl-roundPages", n);
                    t.paginationWrapper.append(o);
                }
            }
            t.checkPagination();
        },
        checkPagination: function () {
            var t = this;
            if (t.options.pagination === false) {
                return false;
            }
            t.paginationWrapper.find(".owl-page").each(function () {
                if (e(this).data("owl-roundPages") === e(t.$owlItems[t.currentItem]).data("owl-roundPages")) {
                    t.paginationWrapper.find(".owl-page").removeClass("active");
                    e(this).addClass("active");
                }
            });
        },
        checkNavigation: function () {
            var e = this;
            if (e.options.navigation === false) {
                return false;
            }
            if (e.options.rewindNav === false) {
                if (e.currentItem === 0 && e.maximumItem === 0) {
                    e.buttonPrev.addClass("disabled");
                    e.buttonNext.addClass("disabled");
                } else if (e.currentItem === 0 && e.maximumItem !== 0) {
                    e.buttonPrev.addClass("disabled");
                    e.buttonNext.removeClass("disabled");
                } else if (e.currentItem === e.maximumItem) {
                    e.buttonPrev.removeClass("disabled");
                    e.buttonNext.addClass("disabled");
                } else if (e.currentItem !== 0 && e.currentItem !== e.maximumItem) {
                    e.buttonPrev.removeClass("disabled");
                    e.buttonNext.removeClass("disabled");
                }
            }
        },
        updateControls: function () {
            var e = this;
            e.updatePagination();
            e.checkNavigation();
            if (e.owlControls) {
                if (e.options.items >= e.itemsAmount) {
                    e.owlControls.hide();
                } else {
                    e.owlControls.show();
                }
            }
        },
        destroyControls: function () {
            var e = this;
            if (e.owlControls) {
                e.owlControls.remove();
            }
        },
        next: function (e) {
            var t = this;
            if (t.isTransition) {
                return false;
            }
            t.currentItem += t.options.scrollPerPage === true ? t.options.items : 1;
            if (t.currentItem > t.maximumItem + (t.options.scrollPerPage === true ? t.options.items - 1 : 0)) {
                if (t.options.rewindNav === true) {
                    t.currentItem = 0;
                    e = "rewind";
                } else {
                    t.currentItem = t.maximumItem;
                    return false;
                }
            }
            t.goTo(t.currentItem, e);
        },
        prev: function (e) {
            var t = this;
            if (t.isTransition) {
                return false;
            }
            if (t.options.scrollPerPage === true && t.currentItem > 0 && t.currentItem < t.options.items) {
                t.currentItem = 0;
            } else {
                t.currentItem -= t.options.scrollPerPage === true ? t.options.items : 1;
            }
            if (t.currentItem < 0) {
                if (t.options.rewindNav === true) {
                    t.currentItem = t.maximumItem;
                    e = "rewind";
                } else {
                    t.currentItem = 0;
                    return false;
                }
            }
            t.goTo(t.currentItem, e);
        },
        goTo: function (e, n, r) {
            var i = this,
                s;
            if (i.isTransition) {
                return false;
            }
            if (typeof i.options.beforeMove === "function") {
                i.options.beforeMove.apply(this, [i.$elem]);
            }
            if (e >= i.maximumItem) {
                e = i.maximumItem;
            } else if (e <= 0) {
                e = 0;
            }
            i.currentItem = i.owl.currentItem = e;
            if (i.options.transitionStyle !== false && r !== "drag" && i.options.items === 1 && i.browser.support3d === true) {
                i.swapSpeed(0);
                if (i.browser.support3d === true) {
                    i.transition3d(i.positionsInArray[e]);
                } else {
                    i.css2slide(i.positionsInArray[e], 1);
                }
                i.afterGo();
                i.singleItemTransition();
                return false;
            }
            s = i.positionsInArray[e];
            if (i.browser.support3d === true) {
                i.isCss3Finish = false;
                if (n === true) {
                    i.swapSpeed("paginationSpeed");
                    t.setTimeout(function () {
                        i.isCss3Finish = true;
                    }, i.options.paginationSpeed);
                } else if (n === "rewind") {
                    i.swapSpeed(i.options.rewindSpeed);
                    t.setTimeout(function () {
                        i.isCss3Finish = true;
                    }, i.options.rewindSpeed);
                } else {
                    i.swapSpeed("slideSpeed");
                    t.setTimeout(function () {
                        i.isCss3Finish = true;
                    }, i.options.slideSpeed);
                }
                i.transition3d(s);
            } else {
                if (n === true) {
                    i.css2slide(s, i.options.paginationSpeed);
                } else if (n === "rewind") {
                    i.css2slide(s, i.options.rewindSpeed);
                } else {
                    i.css2slide(s, i.options.slideSpeed);
                }
            }
            i.afterGo();
        },
        jumpTo: function (e) {
            var t = this;
            if (typeof t.options.beforeMove === "function") {
                t.options.beforeMove.apply(this, [t.$elem]);
            }
            if (e >= t.maximumItem || e === -1) {
                e = t.maximumItem;
            } else if (e <= 0) {
                e = 0;
            }
            t.swapSpeed(0);
            if (t.browser.support3d === true) {
                t.transition3d(t.positionsInArray[e]);
            } else {
                t.css2slide(t.positionsInArray[e], 1);
            }
            t.currentItem = t.owl.currentItem = e;
            t.afterGo();
        },
        afterGo: function () {
            var e = this;
            e.prevArr.push(e.currentItem);
            e.prevItem = e.owl.prevItem = e.prevArr[e.prevArr.length - 2];
            e.prevArr.shift(0);
            if (e.prevItem !== e.currentItem) {
                e.checkPagination();
                e.checkNavigation();
                e.eachMoveUpdate();
                if (e.options.autoPlay !== false) {
                    e.checkAp();
                }
            }
            if (typeof e.options.afterMove === "function" && e.prevItem !== e.currentItem) {
                e.options.afterMove.apply(this, [e.$elem]);
            }
        },
        stop: function () {
            var e = this;
            e.apStatus = "stop";
            t.clearInterval(e.autoPlayInterval);
        },
        checkAp: function () {
            var e = this;
            if (e.apStatus !== "stop") {
                e.play();
            }
        },
        play: function () {
            var e = this;
            e.apStatus = "play";
            if (e.options.autoPlay === false) {
                return false;
            }
            t.clearInterval(e.autoPlayInterval);
            e.autoPlayInterval = t.setInterval(function () {
                e.next(true);
            }, e.options.autoPlay);
        },
        swapSpeed: function (e) {
            var t = this;
            if (e === "slideSpeed") {
                t.$owlWrapper.css(t.addCssSpeed(t.options.slideSpeed));
            } else if (e === "paginationSpeed") {
                t.$owlWrapper.css(t.addCssSpeed(t.options.paginationSpeed));
            } else if (typeof e !== "string") {
                t.$owlWrapper.css(t.addCssSpeed(e));
            }
        },
        addCssSpeed: function (e) {
            return { "-webkit-transition": "all " + e + "ms ease", "-moz-transition": "all " + e + "ms ease", "-o-transition": "all " + e + "ms ease", transition: "all " + e + "ms ease" };
        },
        removeTransition: function () {
            return { "-webkit-transition": "", "-moz-transition": "", "-o-transition": "", transition: "" };
        },
        doTranslate: function (e) {
            return {
                "-webkit-transform": "translate3d(" + e + "px, 0px, 0px)",
                "-moz-transform": "translate3d(" + e + "px, 0px, 0px)",
                "-o-transform": "translate3d(" + e + "px, 0px, 0px)",
                "-ms-transform": "translate3d(" + e + "px, 0px, 0px)",
                transform: "translate3d(" + e + "px, 0px,0px)",
            };
        },
        transition3d: function (e) {
            var t = this;
            t.$owlWrapper.css(t.doTranslate(e));
        },
        css2move: function (e) {
            var t = this;
            t.$owlWrapper.css({ left: e });
        },
        css2slide: function (e, t) {
            var n = this;
            n.isCssFinish = false;
            n.$owlWrapper.stop(true, true).animate(
                { left: e },
                {
                    duration: t || n.options.slideSpeed,
                    complete: function () {
                        n.isCssFinish = true;
                    },
                }
            );
        },
        checkBrowser: function () {
            var e = this,
                r = "translate3d(0px, 0px, 0px)",
                i = n.createElement("div"),
                s,
                o,
                u,
                a,
                f = n.documentElement.style;
            i.style.cssText = "  -moz-transform:" + r + "; -ms-transform:" + r + "; -o-transform:" + r + "; -webkit-transform:" + r + "; transform:" + r;
            s = /translate3d\(0px, 0px, 0px\)/g;
            o = i.style.cssText.match(s);
            u = f.webkitTransition !== undefined || f.MozTransition !== undefined || f.OTransition !== undefined || f.transition !== undefined;
            a = "ontouchstart" in t || t.navigator.msMaxTouchPoints;
            e.browser = { support3d: u, isTouch: a };
        },
        moveEvents: function () {
            var e = this;
            if (e.options.mouseDrag !== false || e.options.touchDrag !== false) {
                e.gestures();
                e.disabledEvents();
            }
        },
        eventTypes: function () {
            var e = this,
                t = ["s", "e", "x"];
            e.ev_types = {};
            if (e.options.mouseDrag === true && e.options.touchDrag === true) {
                t = ["touchstart.owl mousedown.owl", "touchmove.owl mousemove.owl", "touchend.owl touchcancel.owl mouseup.owl"];
            } else if (e.options.mouseDrag === false && e.options.touchDrag === true) {
                t = ["touchstart.owl", "touchmove.owl", "touchend.owl touchcancel.owl"];
            } else if (e.options.mouseDrag === true && e.options.touchDrag === false) {
                t = ["mousedown.owl", "mousemove.owl", "mouseup.owl"];
            }
            e.ev_types.start = t[0];
            e.ev_types.move = t[1];
            e.ev_types.end = t[2];
        },
        disabledEvents: function () {
            var t = this;
            t.$elem.on("dragstart.owl", function (e) {
                e.preventDefault();
            });
            t.$elem.on("mousedown.disableTextSelect", function (t) {
                return e(t.target).is("input, textarea, select, option");
            });
        },
        gestures: function () {
            function s(e) {
                if (e.touches !== undefined) {
                    return { x: e.touches[0].pageX, y: e.touches[0].pageY };
                }
                if (e.touches === undefined) {
                    if (e.pageX !== undefined) {
                        return { x: e.pageX, y: e.pageY };
                    }
                    if (e.pageX === undefined) {
                        return { x: e.clientX, y: e.clientY };
                    }
                }
            }
            function o(t) {
                if (t === "on") {
                    e(n).on(r.ev_types.move, a);
                    e(n).on(r.ev_types.end, f);
                } else if (t === "off") {
                    e(n).off(r.ev_types.move);
                    e(n).off(r.ev_types.end);
                }
            }
            function u(n) {
                var u = n.originalEvent || n || t.event,
                    a;
                if (u.which === 3) {
                    return false;
                }
                if (r.itemsAmount <= r.options.items) {
                    return;
                }
                if (r.isCssFinish === false && !r.options.dragBeforeAnimFinish) {
                    return false;
                }
                if (r.isCss3Finish === false && !r.options.dragBeforeAnimFinish) {
                    return false;
                }
                if (r.options.autoPlay !== false) {
                    t.clearInterval(r.autoPlayInterval);
                }
                if (r.browser.isTouch !== true && !r.$owlWrapper.hasClass("grabbing")) {
                    r.$owlWrapper.addClass("grabbing");
                }
                r.newPosX = 0;
                r.newRelativeX = 0;
                e(this).css(r.removeTransition());
                a = e(this).position();
                i.relativePos = a.left;
                i.offsetX = s(u).x - a.left;
                i.offsetY = s(u).y - a.top;
                o("on");
                i.sliding = false;
                i.targetElement = u.target || u.srcElement;
            }
            function a(o) {
                var u = o.originalEvent || o || t.event,
                    a,
                    f;
                r.newPosX = s(u).x - i.offsetX;
                r.newPosY = s(u).y - i.offsetY;
                r.newRelativeX = r.newPosX - i.relativePos;
                if (typeof r.options.startDragging === "function" && i.dragging !== true && r.newRelativeX !== 0) {
                    i.dragging = true;
                    r.options.startDragging.apply(r, [r.$elem]);
                }
                if ((r.newRelativeX > 8 || r.newRelativeX < -8) && r.browser.isTouch === true) {
                    if (u.preventDefault !== undefined) {
                        u.preventDefault();
                    } else {
                        u.returnValue = false;
                    }
                    i.sliding = true;
                }
                if ((r.newPosY > 10 || r.newPosY < -10) && i.sliding === false) {
                    e(n).off("touchmove.owl");
                }
                a = function () {
                    return r.newRelativeX / 5;
                };
                f = function () {
                    return r.maximumPixels + r.newRelativeX / 5;
                };
                r.newPosX = Math.max(Math.min(r.newPosX, a()), f());
                if (r.browser.support3d === true) {
                    r.transition3d(r.newPosX);
                } else {
                    r.css2move(r.newPosX);
                }
            }
            function f(n) {
                var s = n.originalEvent || n || t.event,
                    u,
                    a,
                    f;
                s.target = s.target || s.srcElement;
                i.dragging = false;
                if (r.browser.isTouch !== true) {
                    r.$owlWrapper.removeClass("grabbing");
                }
                if (r.newRelativeX < 0) {
                    r.dragDirection = r.owl.dragDirection = "left";
                } else {
                    r.dragDirection = r.owl.dragDirection = "right";
                }
                if (r.newRelativeX !== 0) {
                    u = r.getNewPosition();
                    r.goTo(u, false, "drag");
                    if (i.targetElement === s.target && r.browser.isTouch !== true) {
                        e(s.target).on("click.disable", function (t) {
                            t.stopImmediatePropagation();
                            t.stopPropagation();
                            t.preventDefault();
                            e(t.target).off("click.disable");
                        });
                        a = e._data(s.target, "events").click;
                        f = a.pop();
                        a.splice(0, 0, f);
                    }
                }
                o("off");
            }
            var r = this,
                i = { offsetX: 0, offsetY: 0, baseElWidth: 0, relativePos: 0, position: null, minSwipe: null, maxSwipe: null, sliding: null, dargging: null, targetElement: null };
            r.isCssFinish = true;
            r.$elem.on(r.ev_types.start, ".owl-wrapper", u);
        },
        getNewPosition: function () {
            var e = this,
                t = e.closestItem();
            if (t > e.maximumItem) {
                e.currentItem = e.maximumItem;
                t = e.maximumItem;
            } else if (e.newPosX >= 0) {
                t = 0;
                e.currentItem = 0;
            }
            return t;
        },
        closestItem: function () {
            var t = this,
                n = t.options.scrollPerPage === true ? t.pagesInArray : t.positionsInArray,
                r = t.newPosX,
                i = null;
            e.each(n, function (s, o) {
                if (r - t.itemWidth / 20 > n[s + 1] && r - t.itemWidth / 20 < o && t.moveDirection() === "left") {
                    i = o;
                    if (t.options.scrollPerPage === true) {
                        t.currentItem = e.inArray(i, t.positionsInArray);
                    } else {
                        t.currentItem = s;
                    }
                } else if (r + t.itemWidth / 20 < o && r + t.itemWidth / 20 > (n[s + 1] || n[s] - t.itemWidth) && t.moveDirection() === "right") {
                    if (t.options.scrollPerPage === true) {
                        i = n[s + 1] || n[n.length - 1];
                        t.currentItem = e.inArray(i, t.positionsInArray);
                    } else {
                        i = n[s + 1];
                        t.currentItem = s + 1;
                    }
                }
            });
            return t.currentItem;
        },
        moveDirection: function () {
            var e = this,
                t;
            if (e.newRelativeX < 0) {
                t = "right";
                e.playDirection = "next";
            } else {
                t = "left";
                e.playDirection = "prev";
            }
            return t;
        },
        customEvents: function () {
            var e = this;
            e.$elem.on("owl.next", function () {
                e.next();
            });
            e.$elem.on("owl.prev", function () {
                e.prev();
            });
            e.$elem.on("owl.play", function (t, n) {
                e.options.autoPlay = n;
                e.play();
                e.hoverStatus = "play";
            });
            e.$elem.on("owl.stop", function () {
                e.stop();
                e.hoverStatus = "stop";
            });
            e.$elem.on("owl.goTo", function (t, n) {
                e.goTo(n);
            });
            e.$elem.on("owl.jumpTo", function (t, n) {
                e.jumpTo(n);
            });
        },
        stopOnHover: function () {
            var e = this;
            if (e.options.stopOnHover === true && e.browser.isTouch !== true && e.options.autoPlay !== false) {
                e.$elem.on("mouseover", function () {
                    e.stop();
                });
                e.$elem.on("mouseout", function () {
                    if (e.hoverStatus !== "stop") {
                        e.play();
                    }
                });
            }
        },
        lazyLoad: function () {
            var t = this,
                n,
                r,
                i,
                s,
                o;
            if (t.options.lazyLoad === false) {
                return false;
            }
            for (n = 0; n < t.itemsAmount; n += 1) {
                r = e(t.$owlItems[n]);
                if (r.data("owl-loaded") === "loaded") {
                    continue;
                }
                i = r.data("owl-item");
                s = r.find(".lazyOwl");
                if (typeof s.data("src") !== "string") {
                    r.data("owl-loaded", "loaded");
                    continue;
                }
                if (r.data("owl-loaded") === undefined) {
                    s.hide();
                    r.addClass("loading").data("owl-loaded", "checked");
                }
                if (t.options.lazyFollow === true) {
                    o = i >= t.currentItem;
                } else {
                    o = true;
                }
                if (o && i < t.currentItem + t.options.items && s.length) {
                    t.lazyPreload(r, s);
                }
            }
        },
        lazyPreload: function (e, n) {
            function o() {
                e.data("owl-loaded", "loaded").removeClass("loading");
                n.removeAttr("data-src");
                if (r.options.lazyEffect === "fade") {
                    n.fadeIn(400);
                } else {
                    n.show();
                }
                if (typeof r.options.afterLazyLoad === "function") {
                    r.options.afterLazyLoad.apply(this, [r.$elem]);
                }
            }
            function u() {
                i += 1;
                if (r.completeImg(n.get(0)) || s === true) {
                    o();
                } else if (i <= 100) {
                    t.setTimeout(u, 100);
                } else {
                    o();
                }
            }
            var r = this,
                i = 0,
                s;
            if (n.prop("tagName") === "DIV") {
                n.css("background-image", "url(" + n.data("src") + ")");
                s = true;
            } else {
                n[0].src = n.data("src");
            }
            u();
        },
        autoHeight: function () {
            function s() {
                var r = e(n.$owlItems[n.currentItem]).height();
                n.wrapperOuter.css("height", r + "px");
                if (!n.wrapperOuter.hasClass("autoHeight")) {
                    t.setTimeout(function () {
                        n.wrapperOuter.addClass("autoHeight");
                    }, 0);
                }
            }
            function o() {
                i += 1;
                if (n.completeImg(r.get(0))) {
                    s();
                } else if (i <= 100) {
                    t.setTimeout(o, 100);
                } else {
                    n.wrapperOuter.css("height", "");
                }
            }
            var n = this,
                r = e(n.$owlItems[n.currentItem]).find("img"),
                i;
            if (r.get(0) !== undefined) {
                i = 0;
                o();
            } else {
                s();
            }
        },
        completeImg: function (e) {
            var t;
            if (!e.complete) {
                return false;
            }
            t = typeof e.naturalWidth;
            if (t !== "undefined" && e.naturalWidth === 0) {
                return false;
            }
            return true;
        },
        onVisibleItems: function () {
            var t = this,
                n;
            if (t.options.addClassActive === true) {
                t.$owlItems.removeClass("active");
            }
            t.visibleItems = [];
            for (n = t.currentItem; n < t.currentItem + t.options.items; n += 1) {
                t.visibleItems.push(n);
                if (t.options.addClassActive === true) {
                    e(t.$owlItems[n]).addClass("active");
                }
            }
            t.owl.visibleItems = t.visibleItems;
        },
        transitionTypes: function (e) {
            var t = this;
            t.outClass = "owl-" + e + "-out";
            t.inClass = "owl-" + e + "-in";
        },
        singleItemTransition: function () {
            function a(e) {
                return { position: "relative", left: e + "px" };
            }
            var e = this,
                t = e.outClass,
                n = e.inClass,
                r = e.$owlItems.eq(e.currentItem),
                i = e.$owlItems.eq(e.prevItem),
                s = Math.abs(e.positionsInArray[e.currentItem]) + e.positionsInArray[e.prevItem],
                o = Math.abs(e.positionsInArray[e.currentItem]) + e.itemWidth / 2,
                u = "webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend";
            e.isTransition = true;
            e.$owlWrapper.addClass("owl-origin").css({ "-webkit-transform-origin": o + "px", "-moz-perspective-origin": o + "px", "perspective-origin": o + "px" });
            i.css(a(s, 10))
                .addClass(t)
                .on(u, function () {
                    e.endPrev = true;
                    i.off(u);
                    e.clearTransStyle(i, t);
                });
            r.addClass(n).on(u, function () {
                e.endCurrent = true;
                r.off(u);
                e.clearTransStyle(r, n);
            });
        },
        clearTransStyle: function (e, t) {
            var n = this;
            e.css({ position: "", left: "" }).removeClass(t);
            if (n.endPrev && n.endCurrent) {
                n.$owlWrapper.removeClass("owl-origin");
                n.endPrev = false;
                n.endCurrent = false;
                n.isTransition = false;
            }
        },
        owlStatus: function () {
            var e = this;
            e.owl = {
                userOptions: e.userOptions,
                baseElement: e.$elem,
                userItems: e.$userItems,
                owlItems: e.$owlItems,
                currentItem: e.currentItem,
                prevItem: e.prevItem,
                visibleItems: e.visibleItems,
                isTouch: e.browser.isTouch,
                browser: e.browser,
                dragDirection: e.dragDirection,
            };
        },
        clearEvents: function () {
            var r = this;
            r.$elem.off(".owl owl mousedown.disableTextSelect");
            e(n).off(".owl owl");
            e(t).off("resize", r.resizer);
        },
        unWrap: function () {
            var e = this;
            if (e.$elem.children().length !== 0) {
                e.$owlWrapper.unwrap();
                e.$userItems.unwrap().unwrap();
                if (e.owlControls) {
                    e.owlControls.remove();
                }
            }
            e.clearEvents();
            e.$elem.attr("style", e.$elem.data("owl-originalStyles") || "").attr("class", e.$elem.data("owl-originalClasses"));
        },
        destroy: function () {
            var e = this;
            e.stop();
            t.clearInterval(e.checkVisible);
            e.unWrap();
            e.$elem.removeData();
        },
        reinit: function (t) {
            var n = this,
                r = e.extend({}, n.userOptions, t);
            n.unWrap();
            n.init(r, n.$elem);
        },
        addItem: function (e, t) {
            var n = this,
                r;
            if (!e) {
                return false;
            }
            if (n.$elem.children().length === 0) {
                n.$elem.append(e);
                n.setVars();
                return false;
            }
            n.unWrap();
            if (t === undefined || t === -1) {
                r = -1;
            } else {
                r = t;
            }
            if (r >= n.$userItems.length || r === -1) {
                n.$userItems.eq(-1).after(e);
            } else {
                n.$userItems.eq(r).before(e);
            }
            n.setVars();
        },
        removeItem: function (e) {
            var t = this,
                n;
            if (t.$elem.children().length === 0) {
                return false;
            }
            if (e === undefined || e === -1) {
                n = -1;
            } else {
                n = e;
            }
            t.unWrap();
            t.$userItems.eq(n).remove();
            t.setVars();
        },
    };
    e.fn.owlCarousel = function (t) {
        return this.each(function () {
            if (e(this).data("owl-init") === true) {
                return false;
            }
            e(this).data("owl-init", true);
            var n = Object.create(r);
            n.init(t, this);
            e.data(this, "owlCarousel", n);
        });
    };
    e.fn.owlCarousel.options = {
        items: 3,
        itemsCustom: false,
        itemsDesktop: [1199, 4],
        itemsDesktopSmall: [979, 3],
        itemsTablet: [768, 2],
        itemsTabletSmall: false,
        itemsMobile: [479, 1],
        singleItem: false,
        itemsScaleUp: false,
        slideSpeed: 200,
        paginationSpeed: 600,
        rewindSpeed: 1e3,
        autoPlay: true,
        stopOnHover: false,
        navigation: false,
        navigationText: ["prev", "next"],
        rewindNav: true,
        scrollPerPage: false,
        pagination: true,
        paginationNumbers: false,
        responsive: true,
        responsiveRefreshRate: 200,
        responsiveBaseWidth: t,
        baseClass: "owl-carousel",
        theme: "owl-theme",
        lazyLoad: false,
        lazyFollow: true,
        lazyEffect: "fade",
        autoHeight: false,
        jsonPath: false,
        jsonSuccess: false,
        dragBeforeAnimFinish: true,
        mouseDrag: true,
        touchDrag: true,
        addClassActive: false,
        transitionStyle: false,
        beforeUpdate: false,
        afterUpdate: false,
        beforeInit: false,
        afterInit: false,
        beforeMove: false,
        afterMove: false,
        afterAction: false,
        startDragging: false,
        afterLazyLoad: false,
        autoplay:true,
autoplayTimeout:500,
        
    };
})(jQuery, window, document);
