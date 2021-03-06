define(['app', 'services'], function(app) {
	'use strict';

	var directives = angular.module('app.directives', ['app.services']);

	directives.directive('hideTabs', function($rootScope, $location, $ionicHistory) {
		return {
			restrict: 'AE',
			link: function($scope) {
				//不想隐藏的时候就不能隐藏了，可以监听$ionicView.beforeEnter
				$rootScope.hideTabs = 'tabs-item-hide';

				$scope.$on('$ionicView.beforeEnter', function() {
					if($location.path() == '/index/index' || $location.path() == '/product/productlist' || $location.path() == '/activite/newPublishList' || $location.path() == '/cart/cart' || $location.path() == '/mine/myIndex') {
						$rootScope.hideTabs = ' ';
					}
				});

				$scope.$on('$ionicView.beforeLeave', function() {
					if($location.path() == '/index/index' || $location.path() == '/product/productlist' || $location.path() == '/activite/newPublishList' || $location.path() == '/cart/cart' || $location.path() == '/mine/myIndex') {
						$rootScope.hideTabs = ' ';
					}
				});
			}
		}
	});

	directives.directive('scrollHeight', function($window) {
		return {
			restrict: 'AE',
			link: function(scope, element, attr) {
				element[0].style.height = ($window.innerHeight - 50 - 36 - 44) + 'px';
			}
		}
	});

	directives.directive('goBack', ['$ionicGesture', '$ionicHistory', '$ionicNavBarDelegate', function($ionicGesture, $ionicHistory, $ionicNavBarDelegate) {
		return {
			restrict: 'AE',
			link: function($scope, element) {
//				var startX,startY,endX,endY,dragFlag = false;
//				$ionicGesture.on("touch", function($event) {
//					startX = $event.gesture.deltaX;
//					startY = $event.gesture.deltaY;
//				}, element);
//				$ionicGesture.on("dragright", function($event) {
//					dragFlag = true;
//				}, element);
//				$ionicGesture.on("release", function($event) {
//					endX = $event.gesture.deltaX;
//					endY = $event.gesture.deltaY;
//					if(endX-startX > 200 && endY-startY < 20 && dragFlag){
//						$ionicHistory.goBack();
//					};
//				}, element);
//				$ionicGesture.on("swiperight", function() {
//					$ionicHistory.goBack();
//				}, element);
			}
		}
	}]);
	directives.directive('rjHoldActive', ['$ionicGesture', '$timeout', '$ionicBackdrop',
		function($ionicGesture, $timeout, $ionicBackdrop) {
			return {
				scope: false,
				restrict: 'A',
				replace: false,
				link: function(scope, iElm, iAttrs, controller) {
					$ionicGesture.on("tap", function() {
						iElm.addClass('hodeActive');
						$timeout(function() {
							iElm.removeClass('hodeActive');
						}, 300);
					}, iElm);
				}
			};
		}
	]);
	directives.directive('focusInput', ['$ionicScrollDelegate', '$window', '$timeout', '$ionicPosition', function($ionicScrollDelegate, $window, $timeout, $ionicPosition) {
		return {
			restrict: 'A',
			scope: false,
			link: function($scope, iElm, iAttrs, controller) {
				if(ionic.Platform.isAndroid()) {
					iElm.off('focus').on('focus', function() {
						var top = $ionicScrollDelegate.getScrollPosition().top;
						var eleTop = ($ionicPosition.offset(iElm).top) / 2;
						var realTop = eleTop + top;
						$timeout(function() {
							if(!$scope.$last) {
								$ionicScrollDelegate.scrollTo(0, realTop);
							} else {
								try {
									var aim = angular.element(document).find('.scroll')
									aim.css('transform', 'translate3d(0px,' + '-' + realTop + 'px, 0px) scale(1)');
									$timeout(function() {
										iElm[0].focus();
									}, 100)
								} catch(e) {}

							}
						}, 500)
					}).on('blur', function() {
						$ionicScrollDelegate.resize();
					})
				} else if(ionic.Platform.isIOS()) {
					iElm.on('blur', function() {
						$ionicScrollDelegate.resize();
					})
				}

			}
		}
	}]);
	directives.directive('dir', function($compile, $parse) {
		return {
			restrict: 'EA',
			link: function(scope, element, attr) {
				scope.$watch(attr.content, function() {
					element.html($parse(attr.content)(scope));
					$compile(element.contents())(scope);
				}, true);
			}
		}
	});
	directives.directive('backImageSrc', ['$document', function($document) {
		return {
			restrict: 'A',
			scope: {
				backImageSrc: "@"
			},
			link: function($scope, $element, $attributes) {
				function backImage() {
					var iw = $($element[0]).width();
					$($element[0]).css("height", iw);
					var ImgObj = new Image(); //判断图片是否存在
					ImgObj.src = $attributes.backImageSrc;
					ImgObj.onload = function() {
						var niw = ImgObj.width,
							nih = ImgObj.height;
						var min = Math.min(niw, nih);

						if(niw > nih) {
							var mult = niw / nih;
							var width = ImgObj.width / ImgObj.height * 100;
							var left = (niw - nih) / 2 / niw * iw * mult;
							$($element[0]).css({
								"background-image": "url(" + ImgObj.src + ")",
								"background-size": mult * 100 + "% 100%",
								"background-position": "-" + left + "px 0",
							});
						} else {
							var mult = nih / niw;
							var height = ImgObj.height / ImgObj.width * 100;
							var top = (nih - niw) / 2 / nih * iw * mult;
							$($element[0]).css({
								"background-image": "url(" + ImgObj.src + ")",
								"background-size": "100% " + mult * 100 + "%",
								"background-position": "0 -" + top + "px",
							});
						}
					};
				}
				backImage();
			}
		}
	}]);
	directives.directive('imagePosition', function($window) {
		return {
			restrict: 'AE',
			link: function(scope, element, attr) {
				$(element)[0].onload = function() {
					var winW = $window.innerWidth;
					var winH = $window.innerHeight;
					var scale = winW / winH;
					var src = $(element).attr('src');
					var ImgObj = new Image();
					ImgObj.src = src;
					ImgObj.onload = function() {
						var niW = ImgObj.width,
							niH = ImgObj.height;
						var nScale = niW / niH;
						if(nScale > scale) {
							if(winW <= niW) {
								var nih = winW / nScale;
								if(nih < winH * 0.6) {
									$(element).css("width", "100%").css("height", "auto");
									var h = (winH - nih) / 2;
									$(element).css({
										"margin-left": 0,
										"margin-top": h
									});
								} else {
									nih = winH * 0.6;
									var niw = nih * nScale;
									$(element).css("width", niw + 'px').css("height", nih + 'px');
									var w = (winW - niw) / 2;
									var h = (winH - nih) / 2;
									$(element).css({
										"margin-left": w,
										"margin-top": h
									});
								}

							} else {
								var nih = winW / nScale;
								if(nih > winH * 0.6) {
									nih = winH * 0.6;
									var niw = nih * nScale;
									$(element).css("width", niw + 'px').css("height", nih + 'px');
									var w = (winW - niw) / 2;
									var h = (winH - nih) / 2;
									$(element).css({
										"margin-left": w,
										"margin-top": h
									});
								} else {
									$(element).css("width", niW + 'px').css("height", "auto");
									var w = (winW - niW) / 2;
									var h = (winH - niH) / 2;
									$(element).css({
										"margin-left": w,
										"margin-top": h
									});
								}

							}

						} else {
							var nih = winH * 0.6;
							var niw = nih * nScale;
							if(niw <= niW) {
								$(element).css("width", niw + 'px').css("height", nih + 'px');
								var w = (winW - niw) / 2;
								var h = (winH - nih) / 2;
								$(element).css({
									"margin-left": w,
									"margin-top": h
								});
							} else {
								$(element).css("width", niW + 'px').css("height", "auto");
								var w = (winW - niW) / 2;
								var h = (winH - niH) / 2;
								$(element).css({
									"margin-left": w,
									"margin-top": h
								});
							}

						}
					}
				}

			}
		}
	});
	directives.directive('ngPinchZoom', function($document, $ionicSlideBoxDelegate) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var elWidth, elHeight;

				// mode : 'pinch' or 'swipe'
				var mode = '';

				// distance between two touche points (mode : 'pinch')
				var distance = 0;
				var initialDistance = 0;

				// image scaling
				var scale = 1;
				var relativeScale = 1;
				var initialScale = 1;
				var maxScale = parseInt(attrs.maxScale, 10);
				if(isNaN(maxScale) || maxScale <= 1) {
					maxScale = 3;
				}

				// position of the upper left corner of the element
				var positionX = 0;
				var positionY = 0;

				var initialPositionX = 0;
				var initialPositionY = 0;

				// central origin (mode : 'pinch')
				var originX = 0;
				var originY = 0;

				// start coordinate and amount of movement (mode : 'swipe')
				var startX = 0;
				var startY = 0;
				var moveX = 0;
				var moveY = 0;

				var image = new Image();
				image.onload = function() {
					elWidth = element[0].clientWidth;
					elHeight = element[0].clientHeight;

					element.css({
						'-webkit-transform-origin': '0 0',
						'transform-origin': '0 0'
					});

					element.on('touchstart', touchstartHandler);
					element.on('touchmove', touchmoveHandler);
					element.on('touchend', touchendHandler);
				};

				if(attrs.ngSrc) {
					image.src = attrs.ngSrc;
				} else {
					image.src = attrs.src;
				}

				/**
				 * @param {object} evt
				 */
				function touchstartHandler(evt) {
					var touches = evt.originalEvent ? evt.originalEvent.touches : evt.touches;

					startX = touches[0].clientX;
					startY = touches[0].clientY;
					initialPositionX = positionX;
					initialPositionY = positionY;
					moveX = 0;
					moveY = 0;
				}

				/**
				 * @param {object} evt
				 */
				function touchmoveHandler(evt) {
					var touches = evt.originalEvent ? evt.originalEvent.touches : evt.touches;

					if(mode === '') {
						if(touches.length === 1 && scale > 1) {

							mode = 'swipe';

						} else if(touches.length === 2) {

							mode = 'pinch';

							initialScale = scale;
							initialDistance = getDistance(touches);
							originX = touches[0].clientX -
								parseInt((touches[0].clientX - touches[1].clientX) / 2, 10) -
								element[0].offsetLeft - initialPositionX;
							originY = touches[0].clientY -
								parseInt((touches[0].clientY - touches[1].clientY) / 2, 10) -
								element[0].offsetTop - initialPositionY;

						}
					}

					if(mode === 'swipe') {
						evt.preventDefault();
						moveX = touches[0].clientX - startX;
						moveY = touches[0].clientY - startY;

						positionX = initialPositionX + moveX;
						positionY = initialPositionY + moveY;

						transformElement();

					} else if(mode === 'pinch') {
						evt.preventDefault();

						distance = getDistance(touches);
						relativeScale = distance / initialDistance;
						scale = relativeScale * initialScale;

						positionX = originX * (1 - relativeScale) + initialPositionX + moveX;
						positionY = originY * (1 - relativeScale) + initialPositionY + moveY;

						transformElement();

					}
				}

				/**
				 * @param {object} evt
				 */
				function touchendHandler(evt) {
					var touches = evt.originalEvent ? evt.originalEvent.touches : evt.touches;

					if(mode === '' || touches.length > 0) {
						return;
					}

					if(mode === 'swipe') {
						scale = 1;
					}
					if(scale < 1) {

						scale = 1;
						positionX = 0;
						positionY = 0;

					} else if(scale > maxScale) {

						scale = maxScale;
						relativeScale = scale / initialScale;
						positionX = originX * (1 - relativeScale) + initialPositionX + moveX;
						positionY = originY * (1 - relativeScale) + initialPositionY + moveY;

					} else {

						if(positionX > 0) {
							positionX = 0;
						} else if(positionX < elWidth * (1 - scale)) {
							positionX = elWidth * (1 - scale);
						}
						if(positionY > 0) {
							positionY = 0;
						} else if(positionY < elHeight * (1 - scale)) {
							positionY = elHeight * (1 - scale);
						}

					}

					transformElement(0.1);
					mode = '';
				}

				/**
				 * @param {Array} touches
				 * @return {number}
				 */
				function getDistance(touches) {
					var d = Math.sqrt(Math.pow(touches[0].clientX - touches[1].clientX, 2) +
						Math.pow(touches[0].clientY - touches[1].clientY, 2));
					return parseInt(d, 10);
				}

				/**
				 * @param {number} [duration]
				 */
				function transformElement(duration) {
					var transition = duration ? 'all cubic-bezier(0,0,.5,1) ' + duration + 's' : '';
					var matrixArray = [scale, 0, 0, scale, positionX, positionY];
					var matrix = 'matrix(' + matrixArray.join(',') + ')';

					element.css({
						'-webkit-transition': transition,
						transition: transition,
						'-webkit-transform': matrix + ' translate3d(0,0,0)',
						transform: matrix
					});
				}
			}
		}

	});
//	directives.directive('imageCropSrc', ['$document', function($document) {
//		return {
//			restrict: 'A',
//			scope: {
//				imageCropSrc: "@"
//			},
//			link: function($scope, $element, $attributes) {
//				function cropImage() {
//					var ImgObj = new Image(); //判断图片是否存在
//					ImgObj.crossOrigin = '*';
//					ImgObj.src = $attributes.imageCropSrc;
//					ImgObj.onload = function() {
//						console.log(ImgObj.width + "--" + ImgObj.height)
//						var min = Math.min(ImgObj.width, ImgObj.height)
//						var $canvas = $('<canvas width="' + min + '" height="' + min + '"></canvas>');
//						var $ctx = $canvas[0].getContext('2d');
//						if(ImgObj.width > ImgObj.height) {
//							var left = (ImgObj.width - ImgObj.height) / 2;
//							$ctx.drawImage(ImgObj, -left, 0, ImgObj.width, ImgObj.height);
//						} else {
//							var top = (ImgObj.height - ImgObj.width) / 2;
//							$ctx.drawImage(ImgObj, 0, -top, ImgObj.width, ImgObj.height);
//						}
//						console.log($canvas[0].toDataURL("image/png"))
//						$element[0].src = $canvas[0].toDataURL("image/png");
//					};
//				}
//				cropImage();
//			}
//		}
//	}]);

	directives.directive('imageLazySrc', ['$document', '$timeout', '$ionicScrollDelegate', '$compile',
        function ($document, $timeout, $ionicScrollDelegate, $compile) {
            return {
                restrict: 'A',
                scope: {
                    lazyScrollResize: "@lazyScrollResize",
                    imageLazyBackgroundImage: "@imageLazyBackgroundImage",
                    imageLazySrc: "@"
                },
                link: function ($scope, $element, $attributes) {
                    var loader;
                    function loadImage() {
                        //Bind "load" event
                        $element.bind("load", function (e) {
                            if ($attributes.imageLazyLoader) {
                                loader.remove();
                            }
                            $element.unbind("load");
                        });

                        if ($scope.imageLazyBackgroundImage == "true") {
                            var bgImg = new Image();
                            bgImg.onload = function () {
                                if ($attributes.imageLazyLoader) {
                                    loader.remove();
                                }
                                $element[0].style.backgroundImage = 'url(' + $attributes.imageLazySrc + ')'; // set style attribute on element (it will load image)
                                if ($scope.lazyScrollResize == "true") {
                                    //Call the resize to recalculate the size of the screen
                                    $ionicScrollDelegate.resize();
                                }
                            };
                            bgImg.src = $attributes.imageLazySrc;

                        } else {
                            var ImgObj = new Image(); //判断图片是否存在
                            ImgObj.src =  $attributes.imageLazySrc;
                            ImgObj.onload = function() {
                                // console.log($attributes.imageLazySrc)
                                $element[0].src = $attributes.imageLazySrc; // set src attribute on element (it will load image)
                            };
                        }
                    }

                    function isInView() {
                        var clientHeight = $document[0].documentElement.clientHeight;
                        var clientWidth = $document[0].documentElement.clientWidth;
                        var imageRect = $element[0].getBoundingClientRect();
                        return (imageRect.top >= 0 && imageRect.top <= clientHeight + parseInt($attributes.imageLazyDistanceFromBottomToLoad))
                            && (imageRect.left >= 0 && imageRect.left <= clientWidth + parseInt($attributes.imageLazyDistanceFromRightToLoad));
                    }

                    loadImage();
                }
            };
        }]);

    directives.directive('timePicker', ['$timeout','$compile', '$ionicScrollDelegate', '$ionicBackdrop', '$q', '$timePickerService',
            function ($timeout, $compile, $ionicScrollDelegate, $ionicBackdrop, $q, $timePickerService) {
                return {
					template: '<div>{{selectDateTime.show}}</div>',
					restrict: 'AE',
					replace: true,
					scope: {
						format: '@', //返回时间格式 如 yyyy-MM-dd
						okHandler: '&',   //回调函数
						timePickerResult: '=', //双向绑定
						loadDateTime: '=',  // 用于从服务端加载(或其他方式加载时间,反正是延迟的就对了) 初始 时间日期数值  //要配合options 中的loadLazy 属性使用  如果默认时间是从服务端加载回来的
						//要做如下设置  <time-picker  load-date-time="data.dateTime" loadLazy="true" time-picker-result="result"></time-picker>
						//即 loadLazy 设置为true(默认是false)标识时间数据延迟加载  data.dateTime 是从服务端加载回来的时间数据
					},
					link: function (scope, elm, attrs) {
						var globalId = ++$timePickerService.globalId;
						var dateTimeNow = new Date();
						var tem = "<div class='pickerContainer datetimeactive'>" +
							"<div class='main'>"
							+ "<div  class='header'>" +
							"<div>{{options.title}}</div>" +
							/* "<div>{{selectDateTime.show}}</div>" +*/
							"</div>"
							+ "<div class='body'>"
							+ "<div class='row row-no-padding'>" +
							"<div class='col'  ng-if='!options.hideYear' ><ion-scroll on-scroll='scrollingEvent(\"year\")' delegate-handle='yearScroll_" + globalId + "' scrollbar-y='false' class='yearContent'>" + "<ul>" + "<li ng-style='year.selected ? { color: \"#ff8400\",fontWeight: \"bold\", fontSize: \"1.2em\"}:{}' ng-click='selectEvent(\"year\",$index)' ng-repeat='year in yearList'>{{year.text}}</li>" + "</ul>" + "</ion-scroll></div>" +
							"<div class='col'  ng-if='!options.hideMonth' ><ion-scroll on-scroll='scrollingEvent(\"month\")' delegate-handle='monthScroll_" + globalId + "' scrollbar-y='false' class='monthContent'>" + "<ul>" + "<li ng-style='month.selected ? { color: \"#ff8400\",fontWeight: \"bold\", fontSize: \"1.2em\"}:{}' ng-click='selectEvent(\"month\",$index)' ng-repeat='month in monthList'>{{month.text}}</li>" + "</ul>" + "</ion-scroll></div>" +
							"<div class='col ' ng-if='!options.hideDate' ><ion-scroll on-scroll='scrollingEvent(\"date\")' delegate-handle='dateScroll_" + globalId + "' scrollbar-y='false' class='dateContent'>" + "<ul>" + "<li ng-style='date.selected ? { color: \"#ff8400\",fontWeight: \"bold\", fontSize: \"1.2em\"}:{}' ng-click='selectEvent(\"date\",$index)' ng-repeat='date in dateList'>{{date.text}}</li>" + "</ul>" + "</ion-scroll></div>" +
							"<div class='col ' ng-if='!options.hideTime' ><ion-scroll on-scroll='scrollingEvent(\"time\")' delegate-handle='timeScroll_" + globalId + "' scrollbar-y='false' class='timeContent'>" + "<ul>" + "<li ng-style='time.selected ? { color: \"#ff8400\",fontWeight: \"bold\", fontSize: \"1.2em\"}:{}' ng-click='selectEvent(\"time\",$index)' ng-repeat='time in timeList'>{{time.text}}</li>" + "</ul>" + "</ion-scroll></div>" +
							"</div>"
							+ "<div class='body_center_highlight'></div>" +
							"</div>" +
							"<div class='footer'>" +
							"<span ng-click='ok()'>确定</span><span ng-click='cancel()'>取消</span>" +
							"</div>" +
							"</div>" +
							"</div>";
						// 配置 教程  ！！！！！！！！   time-picker-result 这个选项是必须配置的 用来接收选择结果 其他的可不用 使用默认配置
						//options 中的参数  都可在页面配置  如
						// <time-picker
						// timeSpan="30"
						// DateTime="2012-20-09 10:30"  ！！！注意这里  时间部分的设置 要 和参数中的 timespan 相对应 如 timeSpan 为 15 时 则生成的时间 列表 是 10:00 10:15 10:30 10:45.... 这时就要求 分钟数要相对 如不能设置 为 10:18
						// title="我是程序员"
						// time-picker-result="model.result">
						// </time-picker>
						var options = {
							title: attrs.title || "时间选择",
							height: 40,// 每个滑动 li 的高度 这里如果也配置的话 要修改css文件中的高度的定义
							timeNum: parseInt(attrs.timenum) || 24,//可选时间数量
							yearStart: (attrs.yearstart && parseInt(attrs.yearstart)) || dateTimeNow.getFullYear() - 20,//开始年份
							yearEnd: (attrs.yearend && parseInt(attrs.yearend)) || dateTimeNow.getFullYear(),  //结束年份
							monthStart: 12,//开始月份
							monthEnd: 1,//结束月份
							DateTime: attrs.datetime && new Date(attrs.datetime) || dateTimeNow, //开始时间日期  不给默认是当天
							timeSpan: attrs.timespan && parseInt(attrs.timespan) || 15, //时间间隔 默认 15分钟一个间隔 15/30
							loadLazy: attrs.loadlazy || false,  //标识默认的时间数据是否从服务端加载回来的
							hideYear: attrs.hideyear || false, //选择器中隐藏年份选择栏
							hideMonth: attrs.hidemonth || false,//选择器中隐藏月份选择栏
							hideDate: attrs.hidedate || false,//选择器中隐藏日期选择栏
							hideTime: attrs.hidetime || false,//选择器中隐藏时间选择栏
							inModal: attrs.inmodal || false,//是否在Modal 中使用插件
						}
						scope.options = options;
						scope.yearScrollTimer = null; //年份滑动定时器
						scope.monthScrollTimer = null; //月份滑动定时器
						scope.dateScrollTimer = null; //日期滑动定时器
						scope.timeScrollTimer = null; //时间滑动定时器
						scope.dateList = [];
						scope.timeList = [];
						scope.yearList = [];
						scope.monthList = [];
						scope.selectDateTime = {
							year: {item: null, index: 0},
							month: {item: null, index: 0},
							date: {item: null, index: 0},
							time: {item: null, index: 0},
							show: ""
						};
						scope.specialDateTime = {
							bigMoth: [1, 3, 5, 7, 8, 10, 12],
							isBigMonth: function (month) {
								var length = this.bigMoth.length;
								while (length--) {
									if (this.bigMoth[length] == month) {
										return true;
									}
								}
								return false;
							},
							isLoopYear: function (year) { //是否是闰年
								return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
							}
						};
						if (options.loadLazy) {
							var loadListener = scope.$watch("loadDateTime", function () {
								if (scope.loadDateTime) {
									options.DateTime = new Date(scope.loadDateTime);
									scope.options = options;
									init(options);
									loadListener = null;
								}
							});
						} else {
							scope.options = options;
							init(options);
						}

						elm.on("click", function () {
							show();
							options.hideYear ? null : scrollToElm(scope.yearScroll, scope.yearList[scope.selectDateTime.year.index - 3]);
							options.hideMonth ? null : scrollToElm(scope.monthScroll, scope.monthList[scope.selectDateTime.month.index - 3]);
							options.hideDate ? null : scrollToElm(scope.dateScroll, scope.dateList[scope.selectDateTime.date.index - 3]);
							options.hideTime ? null : scrollToElm(scope.timeScroll, scope.timeList[scope.selectDateTime.time.index - 3]);
						});
						//滑动Event
						scope.scrollingEvent = function (type) {
							var opEntity = getOperateEntity(type);
							//当前存在滑动则取消
							scope[opEntity.scrollTimer] && $timeout.cancel(scope[opEntity.scrollTimer]);

							var posi = scope[opEntity.scrollHandler].getScrollPosition();
							var index = Math.abs(Math.round(posi.top / scope.options.height));
							if (posi.top == index * scope.options.height) {
								updateSelect(index + 3, type);
							} else {
								scope[opEntity.scrollTimer] = $timeout(function () {
									posi.top = index * 40;
									updateSelect(index + 3, type);
									scrollToPosi(scope[opEntity.scrollHandler], posi);
								}, 100);
							}
						}
						//点击Event
						scope.selectEvent = function (type, index) {
							var opEntity = getOperateEntity(type);
							if (index > 2 && index <= scope[opEntity.data].length - 3) {
								scrollToElm(scope[opEntity.scrollHandler], scope[opEntity.data][index - 3]);
							}
						}

						//初始化
						function init(options) {
							// console.log("--------时间插件初始化开始-----------");
							options.hideYear ? null : initYear(options);
							options.hideMonth ? null : initMoth(options);
							options.hideDate ? null : initDay(options);
							options.hideTime ? null : initTime(options);
							tem = angular.element(tem);
							$compile(tem)(scope);
							angular.element(document.body).append(tem);
							getSelectDateTime();
							setSelectDateTimeShow();
							// console.log("--------时间插件初始化结束-----------");
						}

						//年份初始化
						function initYear(options) {
							scope.yearScroll = $ionicScrollDelegate.$getByHandle("yearScroll_" + globalId);
							var defaultYear = options.DateTime.getFullYear();
							var yearSpan = options.yearEnd - options.yearStart;
							var text, data, top, item, defaultItem, defaultIndex;
							prependLi(scope.yearList, 3, "b")
							for (var i = 0; i <= yearSpan; i++) {
								text = options.yearStart + i + "年";
								data = options.yearStart + i;
								top = options.height + scope.yearList[scope.yearList.length - 1].top;
								item = createDateTimeLi(0, top, data, data == defaultYear, text);
								if (data == defaultYear) {
									defaultItem = item;
									defaultIndex = scope.yearList.length;
								}
								scope.yearList.push(item);
							}
							//设置默认选择
							scope.selectDateTime.year.item = defaultItem;
							scope.selectDateTime.year.index = defaultIndex;
							prependLi(scope.yearList, 3, "e")
						}

						//月份初始化
						function initMoth(options) {
							scope.monthScroll = $ionicScrollDelegate.$getByHandle("monthScroll_" + globalId);
							var defaultMonth = options.DateTime.getMonth() + 1 == 0 ? 12 : prependZero(options.DateTime.getMonth() + 1, 10);
							var text, data, original, top, item, defaultItem, defaultIndex;
							prependLi(scope.monthList, 3, "b")
							for (var i = 1; i <= 12; i++) {
								original = i;
								data = prependZero(i, 10);
								text = prependZero(i, 10) + "月";
								top = options.height + scope.monthList[scope.monthList.length - 1].top;
								item = createDateTimeLi(0, top, data, data == defaultMonth, text);
								if (data == defaultMonth) {
									defaultItem = item;
									defaultIndex = scope.monthList.length;
								}
								scope.monthList.push(item);
							}
							//设置默认选择
							scope.selectDateTime.month.item = defaultItem;
							scope.selectDateTime.month.index = defaultIndex;
							prependLi(scope.monthList, 3, "e")
						}

						//日期初始化
						function initDay(options) {
							scope.dateScroll = $ionicScrollDelegate.$getByHandle("dateScroll_" + globalId);
							//开始时间
							var defaultDay = prependZero(options.DateTime.getDate(), 10);
							var text, data, top, item, defaultItem, defaultIndex;
							var dateNum = getDateNum(options.DateTime.getFullYear(), options.DateTime.getMonth() + 1);
							prependLi(scope.dateList, 3, "b")
							for (var i = 1; i <= dateNum; i++) {
								data = prependZero(i, 10);
								text = prependZero(i, 10) + "日";
								top = options.height + scope.dateList[scope.dateList.length - 1].top;
								item = createDateTimeLi(0, top, data, data == defaultDay, text);
								if (data == defaultDay) {
									defaultItem = item;
									defaultIndex = scope.dateList.length;
								}
								scope.dateList.push(item);
							}
							//设置默认选择
							scope.selectDateTime.date.item = defaultItem;
							scope.selectDateTime.date.index = defaultIndex;
							prependLi(scope.dateList, 3, "e");
						}

						//时间初始化
						function initTime(options) {
							scope.timeScroll = $ionicScrollDelegate.$getByHandle("timeScroll_" + globalId);
							//获取默认选择时间
							var defaultTime = options.DateTime.getMinutes();//getDefaultSelectTime(options);
							var defaultItem, defaultIndex, hasSetDefault, nextFirst;
							prependLi(scope.timeList, 3, "b");
							var timeStart = options.DateTime.getHours();
							for (var i = 0; i < options.timeNum; i++) {
								var t = timeStart + i;
								if (t >= 24) {
									t = t - 24;
									t = prependZero(t, 10);
								} else if (t < 10) {
									t = prependZero(t, 10);
								}
								//按时间间隔来生产时间li
								for (var j = 0; j < 60 / (options.timeSpan); j++) {
									var top = options.height + scope.timeList[scope.timeList.length - 1].top;
									var selected = false;
									var bTime = j * options.timeSpan;
									if (!hasSetDefault) {
										if (nextFirst) {
											selected = true;
											hasSetDefault = true;
											nextFirst = false;
										}
										else if (bTime == defaultTime || defaultTime < bTime) {
											selected = true;
											hasSetDefault = true;
										} else if (j == 60 / (options.timeSpan) - 1) {
											nextFirst = true;
										}
									}
									var data = t + ":" + prependZero(j * options.timeSpan, 10);
									var item = createDateTimeLi(0, top, data, selected, data);
									scope.timeList.push(item);
									if (selected) {
										defaultItem = item;
										defaultIndex = scope.timeList.length - 1;
									}
								}
							}
							prependLi(scope.timeList, 3, "e");
							//设置默认选择
							scope.selectDateTime.time.item = defaultItem ? defaultItem : scope.timeList[3];
							scope.selectDateTime.time.index = defaultIndex ? defaultIndex : 3;
						}

						//滑动到指定元素
						function scrollToElm(scorllHandler, elm) {
							scorllHandler.scrollTo(elm.left, elm.top, true);
						}

						//滑动到指定位置
						function scrollToPosi(scorllHandler, posi) {
							scorllHandler.scrollTo(posi.left, posi.top, true);
						}

						function updateSelect(index, type) {
							switch (type) {
								case "year":
									//强制
									$timeout(function () {
										scope.selectDateTime.year.item.selected = false;
										scope.yearList[index].selected = true;
										scope.selectDateTime.year.item = scope.yearList[index];
										scope.selectDateTime.year.index = index;
										if (!scope.options.hideDate) {  //不显示日期的 不需要重置
											resettingDate(scope.selectDateTime.year.item.data, parseInt(scope.selectDateTime.month.item.data));  //年份变化 重置日期栏
										}
									});
									break;
								case "month":
									//强制
									$timeout(function () {
										scope.selectDateTime.month.item.selected = false;
										scope.monthList[index].selected = true;
										scope.selectDateTime.month.item = scope.monthList[index];
										scope.selectDateTime.month.index = index;
										if (!scope.options.hideDate) {  //不显示日期的 不需要重置
											if (scope.options.hideYear) { //不显示年份的情况 默认使用当前年来计算 日期栏
												scope.selectDateTime.year.item = {data: new Date().getFullYear()};
											}
											resettingDate(scope.selectDateTime.year.item.data, parseInt(scope.selectDateTime.month.item.data));  //月份份变化 重置日期栏
										}
									});
									break;
								case "date":
									$timeout(function () {
										scope.selectDateTime.date.item.selected = false;
										scope.dateList[index].selected = true;
										scope.selectDateTime.date.item = scope.dateList[index];
										scope.selectDateTime.date.index = index;
									});
									break;
								case "time":
									$timeout(function () {
										scope.selectDateTime.time.item.selected = false;
										scope.timeList[index].selected = true;
										scope.selectDateTime.time.item = scope.timeList[index];
										scope.selectDateTime.time.index = index;
									});
									break;
							}
						}

						//选中时间展示
						function setSelectDateTimeShow() {
							scope.selectDateTime.show = (scope.options.hideYear ? "" : scope.selectDateTime.year.item.text + " " ) + (scope.options.hideMonth ? "" : scope.selectDateTime.month.item.text) + (scope.options.hideDate ? "" : scope.selectDateTime.date.item.text + " ") + (scope.options.hideTime ? "" : scope.selectDateTime.time.item.text);
						}

						//获取选中的时间结果
						function getSelectDateTime() {
							var value = (scope.options.hideYear ? "" : scope.selectDateTime.year.item.data + (scope.options.hideMonth ? "" : "/") ) + (scope.options.hideMonth ? "" : scope.selectDateTime.month.item.data + (scope.options.hideDate ? "" : "/")) + (scope.options.hideDate ? "" : scope.selectDateTime.date.item.data + " ") + (scope.options.hideTime ? "" : scope.selectDateTime.time.item.data);
							// console.log("selected[formatBefore]=" + value);
							scope.timePickerResult = scope.format ? $timePickerService.format(new Date(value), scope.format) : value;
							// console.log("selected[AfterFormat]=" + scope.timePickerResult);
							return scope.timePickerResult;
						}

						//根据年份和月份计算日期数量
						function getDateNum(year, month) {
							var dateNum = 30;
							if (scope.specialDateTime.isBigMonth(month)) { //大小月判断
								dateNum++;
							} else {
								if (scope.specialDateTime.isLoopYear(year)) {//闰年判断
									if (month == 2)
										dateNum--;
								} else {
									if (month == 2)
										dateNum -= 2;
								}
							}
							return dateNum;
						}

						//重置日期选择栏数据
						function resettingDate(year, month) {
							var dateNum = getDateNum(year, month);
							if (dateNum != scope.dateList.length - 6) { //数量变化 需要进行重置
								var text, data, top, item, defaultItem, defaultIndex;
								var refreshNum = dateNum - (scope.dateList.length - 6)
								if (refreshNum > 0) {//追加日期数量
									var lastData = scope.dateList[scope.dateList.length - 4];
									for (var i = 1; i <= refreshNum; i++) {
										data = lastData.data + i;
										text = data + "日";
										top = options.height + scope.dateList[scope.dateList.length - 4].top;
										item = createDateTimeLi(0, top, data, false, text);
										scope.dateList.splice(scope.dateList.length - 3, 0, item);
									}
								} else { //移除多余的日期数量
									var refreshNum_ = Math.abs(refreshNum);
									scope.dateList.splice(scope.dateList.length - 4 - refreshNum_ + 1, refreshNum_);
									if (scope.selectDateTime.date.item.data > scope.dateList[scope.dateList.length - 4].data) {
										scope.dateList[scope.dateList.length - 4].selected = true;
										scope.selectDateTime.date.item = scope.dateList[scope.dateList.length - 4];
										scope.selectDateTime.date.item.index = scope.dateList.length - 4;
										scrollToElm(scope.dateScroll, scope.dateList[scope.selectDateTime.date.index - 3]);
									}
								}
							}
						}

						function getOperateEntity(type) {
							var entity = new Object();
							var scrollTimer, scrollHandler, data, defaultSelected, selectedItem;
							switch (type) {
								case "year":
									entity.scrollTimer = "yearScrollTimer";
									entity.type = type;
									entity.scrollHandler = "yearScroll";
									entity.data = "yearList";
									entity.defaultSelected = scope.selectDateTime.year.item.data;
									entity.selectedItem = "year";
									break;
								case "month":
									entity.scrollTimer = "monthScrollTimer";
									entity.type = type;
									entity.scrollHandler = "monthScroll";
									entity.data = "monthList";
									entity.defaultSelected = scope.selectDateTime.month.item.data;
									entity.selectedItem = "month";
									break;
								case "date":
									entity.scrollTimer = "dateScrollTimer";
									entity.type = type;
									entity.scrollHandler = "dateScroll";
									entity.data = "dateList";
									entity.defaultSelected = scope.selectDateTime.date.item.data;
									entity.selectedItem = "date";
									break;
								case "time":
									entity.scrollTimer = "timeScrollTimer";
									entity.type = type;
									entity.scrollHandler = "timeScroll";
									entity.data = "timeList";
									entity.defaultSelected = scope.selectDateTime.time.item.data;
									entity.selectedItem = "time";
									break;
							}
							return entity;
						}


						function prependZero(data, num) {
							return data >= num ? data : "0" + data;
						}

						function createDateTimeLi(left, top, data, selected, text) {
							var li = {left: left, top: top, data: data, selected: selected, text: text};
							return li;
						}

						function prependLi(arr, num, loc) {
							loc = loc || "b";
							switch (loc) {
								case "b":
									for (var i = 0; i < num; i++) {
										arr.push(createDateTimeLi(0, options.height * i, "", false, ""));
									}
									break;
								case "e":
									//最后那个li元素的 top
									var lastPosiTop = arr[arr.length - 1].top;
									for (var j = 0; j < num; j++) {
										arr.push(createDateTimeLi(0, (options.height * (i + 1) + lastPosiTop), "", false, ""));
									}
									break;
							}
						}

						scope.ok = function () {
							var datetime = getSelectDateTime();
							setSelectDateTimeShow();
							hide();
							if (scope.okHandler) {
								scope.okHandler({result: datetime});  //回调结果扩展操作
							}
						}
						scope.cancel = function () {
							hide();
						}

						function show() {
							//是否在Modal 中使用
							if (scope.options.inModal) {
								angular.element(document.body).removeClass("modal-open");
							}
							$ionicBackdrop.retain();
							tem.css("display", "block");
						}

						function hide() {
							//是否在Modal 中使用
							if (scope.options.inModal) {
								angular.element(document.body).addClass("modal-open");
							}
							tem.css("display", "none");
							$ionicBackdrop.release();
						}

						function remove() {
							tem.remove();
						}

						scope.$on("$destroy", function () {
							remove();
						})
					}
                }
            }
        ]);

	directives.directive('tabRedPoint', function($compile, $timeout){
		return {
			restrict: 'A',
			replace: false,
			link: function(scope, element, attrs, controller) {
				var $class = 'a.'+attrs.class;
				var key = attrs.tabRedPoint || false;
				// var template ="<b ng-class={true:'tabs-red-point',false:'no-red-point'}["+key+"]></b>";
				var template ="<b class='tabs-red-point' ng-if="+key+"></b>";
				var html = $compile(template)(scope);
				$timeout(function() {
					$($class).css({
						"position":'relative',
					}).append(html);
				},100);

			}
		};
	});
	directives.directive('linkRedPoint', function($compile, $timeout){
		return {
			restrict: 'A',
			replace: false,
			link: function(scope, element, attrs, controller) {
				var key = attrs.linkRedPoint || false;
				var template ="<b ng-class={true:'links-red-point',false:''}["+key+"]></b>";
				var $class = 'a.'+attrs.class;
				var html = $compile(template)(scope);
				$timeout(function() {
					$($class).css({
						"position":'relative',
					}).append(html);
				},100);

			}
		};
	});
	return directives;

});